import * as S from "./App.styles";
import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import {
  PanelLeft,
  MessageCircle,
  FileText,
  Plus,
  Sun,
  Moon,
  Laptop,
  Settings,
  LogOut,
  PenLine,
  Columns2,
  Eye,
  RotateCcw,
  Trash2,
  UploadCloud,
  Undo2,
  Redo2,
  Clock,
  MapPin,
  Hash,
  Music,
  GitCommitHorizontal,
} from "lucide-react";
import type { Article, ArticleDraft } from "./types/article";
import { generateArticleFingerprint } from "./types/article";
import {
  fetchArticles,
  publishArticleToServer,
  checkAuthStatus,
  logoutUser,
} from "./lib/api/client";
import type { FetchArticlesResponse, UserSession } from "./lib/api/client";
import { LoginPage } from "./components/auth/LoginPage";
import {
  saveDraft,
  getAllDrafts,
  deleteDraft,
  getPostDrafts,
  deletePostDraft,
} from "./lib/storage/draftStore";
import type { PostDraft } from "./types/post";
import { ArticleListSidebar } from "./components/articles/ArticleListSidebar";
import { NineGridMedia } from "./components/media/NineGridMedia";
import { MomentPreview } from "./components/preview/MomentPreview";
import { DeleteConfirmModal } from "./components/modals/DeleteConfirmModal";
import { ConflictResolutionModal } from "./components/modals/ConflictResolutionModal";
import {
  handleDockWheel,
  isMobileViewport,
  parseTagList,
} from "./styles/workspace";
import {
  applySiteBrand,
  applyThemeAndAccent,
  loadCmsSettings,
  resetCmsSettings,
  resolveEditorFontCss,
  saveCmsSettings,
  type CmsSettings,
} from "./lib/settings/cmsSettings";

const PostsWorkspace = lazy(() => import("./components/posts/PostsWorkspace"));
const ConfigInfoModal = lazy(() => import("./components/modals/ConfigInfoModal"));

function formatLocalDateTime(ts: number): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function App() {
  const [settings, setSettings] = useState<CmsSettings>(() => loadCmsSettings());

  const updateSettings = (patch: Partial<CmsSettings>) => {
    setSettings((prev) => saveCmsSettings({ ...prev, ...patch }));
  };

  const handleResetSettings = () => {
    const fresh = resetCmsSettings();
    setSettings(fresh);
    showToast("info", "已恢复全部默认设置");
  };

  const handleReplaceSettings = (next: CmsSettings) => {
    setSettings(saveCmsSettings(next));
  };

  const [contentMode, setContentMode] = useState<"moments" | "posts">(() => {
    if (settings.startupMode === "moments" || settings.startupMode === "posts") {
      return settings.startupMode;
    }
    try {
      return localStorage.getItem("oblivion_content_mode") === "posts"
        ? "posts"
        : "moments";
    } catch {
      return "moments";
    }
  });
  const [postsOpened, setPostsOpened] = useState(contentMode === "posts");
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    isMobileViewport() ? true : settings.defaultSidebarOpen,
  );
  const [newPostTrigger, setNewPostTrigger] = useState(0);
  const [postSaveTrigger, setPostSaveTrigger] = useState(0);
  const [postPublishTrigger, setPostPublishTrigger] = useState(0);
  const [postDraftSyncRev, setPostDraftSyncRev] = useState(0);
  const [modalPostDrafts, setModalPostDrafts] = useState<PostDraft[]>([]);

  function switchContentMode(mode: "moments" | "posts") {
    setContentMode(mode);
    if (mode === "posts") setPostsOpened(true);
    try {
      localStorage.setItem("oblivion_content_mode", mode);
    } catch {
      /* restricted storage */
    }
  }

  // Server state
  const [serverData, setServerData] = useState<FetchArticlesResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Local drafts state (mapped by draft ID)
  const [draftsMap, setDraftsMap] = useState<Map<string, ArticleDraft>>(
    new Map(),
  );

  // Active editing state
  const [selectedFingerprint, setSelectedFingerprint] = useState<string | null>(
    null,
  );
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article>({
    time: Date.now(),
    content: "",
    media: [],
    tags: [],
    location: "",
  });
  const [tagsInput, setTagsInput] = useState("");

  // Undo / Redo history for content
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI state
  const [momentsView, setMomentsView] = useState<"edit" | "split" | "preview">(
    () => settings.defaultMomentsView,
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("已保存");

  // Modals state
  const [deleteModalArticle, setDeleteModalArticle] = useState<{
    article: Article;
    fp: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [conflictModalData, setConflictModalData] = useState<{
    isOpen: boolean;
    remoteSha?: string;
    clientBaseSha?: string;
  }>({ isOpen: false });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [commitMessageInput, setCommitMessageInput] = useState("");

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shortcutHandlersRef = useRef({
    save: () => {},
    publish: () => {},
    toggleSidebar: () => {},
    enabled: true,
  });

  // Sync view & sidebar when updated in settings
  useEffect(() => {
    setMomentsView(settings.defaultMomentsView);
  }, [settings.defaultMomentsView]);

  useEffect(() => {
    if (!isMobileViewport()) {
      setSidebarOpen(settings.defaultSidebarOpen);
    }
  }, [settings.defaultSidebarOpen]);

  // Keep raw tags input synchronized when switching/reverting articles without clobbering trailing commas while typing
  useEffect(() => {
    if (parseTagList(tagsInput).join(",") !== currentArticle.tags.join(",")) {
      setTagsInput(currentArticle.tags.join(", "));
    }
  }, [currentArticle.tags]);

  // Apply unified site brand (document.title, favicon, iPhone web app title)
  useEffect(() => {
    applySiteBrand(settings);
  }, [settings.siteName, settings.siteSubtitle, settings.siteIcon]);

  // Apply theme & accent color + watch system color scheme when theme === "system"
  useEffect(() => {
    applyThemeAndAccent(settings);
    if (settings.theme !== "system" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyThemeAndAccent(settings);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [settings.theme, settings.accentColor]);

  // Global keyboard shortcuts: Ctrl/Cmd+B (sidebar), Ctrl/Cmd+S (save), Ctrl/Cmd+Enter (publish)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const h = shortcutHandlersRef.current;
      if (!h.enabled || e.defaultPrevented || e.isComposing) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        h.toggleSidebar();
      } else if (key === "s") {
        e.preventDefault();
        h.save();
      } else if (key === "enter") {
        e.preventDefault();
        h.publish();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Show auto-dismissing toast
  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Check auth status on app start
  const initAuth = async () => {
    setIsCheckingAuth(true);
    setAuthError(null);
    try {
      const res = await checkAuthStatus();
      if (res.user) {
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        await loadInitialData();
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        if (res.error) {
          setAuthError(res.error);
        }
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthError(err?.message || "网络请求失败");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const handleLoginSuccess = async (user: UserSession) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAuthError(null);
    showToast("success", `欢迎回来，${user.name || user.email}`);
    await loadInitialData();
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setServerData(null);
    setAuthError(null);
    showToast("info", "已安全退出登录");
  };

  // Load server data and local drafts
  const loadInitialData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [remote, localDrafts] = await Promise.all([
        fetchArticles(),
        getAllDrafts(),
      ]);

      setServerData(remote);

      const dMap = new Map<string, ArticleDraft>();
      for (const d of localDrafts) {
        dMap.set(d.id, d);
      }
      setDraftsMap(dMap);

      if (remote.articles.length > 0 && !selectedFingerprint && !isNewArticle) {
        const first = remote.articles[0];
        const fp = generateArticleFingerprint(first);
        setSelectedFingerprint(fp);

        const existingDraft = dMap.get(fp);
        if (existingDraft) {
          setCurrentArticle(existingDraft.article);
          setHistoryStack([existingDraft.article.content]);
          if (settings.notifyOnDraftRestore) {
            showToast("info", "已自动恢复该文章的本地未发布草稿");
          }
        } else {
          setCurrentArticle(first);
          setHistoryStack([first.content]);
        }
        setHistoryIndex(0);
      }
    } catch (err: any) {
      if (err.isAuthError) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } else {
        setErrorMsg(err.message || "加载数据失败");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const persistMomentDraftNow = async (updated: Article) => {
    try {
      const draftId = isNewArticle
        ? "new-draft"
        : selectedFingerprint || "new-draft";
      const draft: ArticleDraft = {
        id: draftId,
        article: updated,
        baseSha: serverData?.sha,
        updatedAt: Date.now(),
        isNew: isNewArticle,
      };
      await saveDraft(draft);

      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.set(draftId, draft);
        return next;
      });

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setAutoSaveStatus(`已存 ${timeStr}`);
    } catch {
      setAutoSaveStatus("保存失败");
    }
  };

  // Debounced auto-save draft to IndexedDB
  const triggerAutoSave = (updated: Article) => {
    setAutoSaveStatus("保存中…");
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      void persistMomentDraftNow(updated);
    }, settings.autoSaveDelayMs);
  };

  const updateArticle = (updater: (prev: Article) => Article) => {
    setCurrentArticle((prev) => {
      const next = updater(prev);
      triggerAutoSave(next);
      return next;
    });
  };

  const updateMusicField = (
    field: "title" | "artist" | "url",
    value: string,
  ) => {
    updateArticle((prev) => {
      const merged = {
        title: prev.music?.title || "",
        artist: prev.music?.artist || "",
        url: prev.music?.url || "",
        [field]: value,
      };
      const hasAny =
        merged.title.trim() || merged.artist.trim() || merged.url.trim();
      return {
        ...prev,
        music: hasAny ? merged : undefined,
      };
    });
  };

  // Content change with Undo/Redo tracking
  const handleContentChange = (newContent: string) => {
    updateArticle((prev) => ({ ...prev, content: newContent }));
    setHistoryStack((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newContent];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const target = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      updateArticle((prev) => ({ ...prev, content: target }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const target = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      updateArticle((prev) => ({ ...prev, content: target }));
    }
  };

  // Select article from sidebar
  const handleSelectArticle = (fp: string | null) => {
    if (!fp) return;
    setSelectedFingerprint(fp);
    setIsNewArticle(false);
    if (isMobileViewport() && settings.autoCloseSidebarOnMobile) {
      setSidebarOpen(false);
    }

    const draft = draftsMap.get(fp);
    if (draft) {
      setCurrentArticle(draft.article);
      setHistoryStack([draft.article.content]);
      setHistoryIndex(0);
      if (settings.notifyOnDraftRestore) {
        showToast("info", "已载入本地未发布草稿");
      }
    } else {
      const target = serverData?.articles.find(
        (a) => generateArticleFingerprint(a) === fp,
      );
      if (target) {
        setCurrentArticle(target);
        setHistoryStack([target.content]);
        setHistoryIndex(0);
      }
    }
  };

  // New Article action
  const handleNewArticle = () => {
    setIsNewArticle(true);
    setSelectedFingerprint(null);
    if (isMobileViewport() && settings.autoCloseSidebarOnMobile) {
      setSidebarOpen(false);
    }

    const newDraft = draftsMap.get("new-draft");
    if (newDraft) {
      setCurrentArticle(newDraft.article);
      setHistoryStack([newDraft.article.content]);
      setHistoryIndex(0);
      if (settings.notifyOnDraftRestore) {
        showToast("info", "已恢复之前的未发布新建草稿");
      }
    } else {
      const freshArticle: Article = {
        time: Date.now(),
        content: "",
        media: [],
        tags: [...settings.defaultMomentTags],
        location: settings.defaultMomentLocation,
      };
      setCurrentArticle(freshArticle);
      setHistoryStack([""]);
      setHistoryIndex(0);
    }
  };

  // Clone Article action
  const handleCloneArticle = (source: Article) => {
    setIsNewArticle(true);
    setSelectedFingerprint(null);
    if (isMobileViewport() && settings.autoCloseSidebarOnMobile) {
      setSidebarOpen(false);
    }

    const suffix = settings.cloneAppendSuffix
      ? settings.cloneSuffixText
        ? `\n${settings.cloneSuffixText}`
        : ""
      : "";
    const cloned: Article = {
      ...source,
      time: Date.now(),
      content: source.content ? `${source.content}${suffix}` : "",
    };
    setCurrentArticle(cloned);
    setHistoryStack([cloned.content]);
    setHistoryIndex(0);
    triggerAutoSave(cloned);
    showToast("info", "已基于该文章创建新副本，可继续编辑");
  };

  // Discard local changes & revert to server version
  const handleRevertChanges = async () => {
    if (isNewArticle) {
      await deleteDraft("new-draft");
      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.delete("new-draft");
        return next;
      });
      handleNewArticle();
      showToast("info", "已清空新文章草稿");
    } else if (selectedFingerprint) {
      await deleteDraft(selectedFingerprint);
      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.delete(selectedFingerprint);
        return next;
      });

      const serverVersion = serverData?.articles.find(
        (a) => generateArticleFingerprint(a) === selectedFingerprint,
      );
      if (serverVersion) {
        setCurrentArticle(serverVersion);
        setHistoryStack([serverVersion.content]);
        setHistoryIndex(0);
        showToast("info", "已恢复至远程权威版本，本地草稿已清理");
      }
    }
  };

  // Publish to D1 Database
  const handlePublish = async (options?: { force?: boolean }) => {
    if (!serverData) return;
    if (
      settings.preventEmptyPublish &&
      !currentArticle.content.trim() &&
      currentArticle.media.length === 0
    ) {
      showToast("error", "已开启防空发布保护：请填写正文或添加媒体后再发布");
      return;
    }
    if (
      settings.confirmBeforePublish &&
      options?.force !== true &&
      typeof window !== "undefined" &&
      !window.confirm("确认将当前说说发布到数据库？")
    ) {
      return;
    }
    setIsPublishing(true);

    const isForce = options?.force === true;
    const action = isNewArticle ? "create" : "update";
    const draftId = isNewArticle
      ? "new-draft"
      : selectedFingerprint || "new-draft";

    try {
      const res = await publishArticleToServer({
        action,
        article: currentArticle,
        targetFingerprint: isNewArticle
          ? undefined
          : selectedFingerprint || undefined,
        baseSha: conflictModalData.remoteSha || serverData.sha,
        commitMessage:
          commitMessageInput.trim() ||
          settings.defaultCommitMessage.trim() ||
          undefined,
        force: isForce,
      });

      await deleteDraft(draftId);
      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.delete(draftId);
        return next;
      });

      showToast(
        "success",
        isForce
          ? `强制覆盖发布成功！${res.commitMessage}`
          : `发布成功！${res.commitMessage}`,
      );
      if (settings.clearCommitAfterPublish) {
        setCommitMessageInput("");
      }

      const newFp = generateArticleFingerprint(currentArticle);
      setSelectedFingerprint(newFp);
      setIsNewArticle(false);

      setConflictModalData({ isOpen: false });
      await loadInitialData();
    } catch (err: any) {
      if (err.isConflict) {
        setConflictModalData({
          isOpen: true,
          remoteSha: err.conflictData?.remoteSha,
          clientBaseSha: err.conflictData?.clientBaseSha || serverData.sha,
        });
      } else {
        showToast("error", `发布失败: ${err.message || "未知错误"}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Confirm delete article
  const handleConfirmDelete = async () => {
    if (!deleteModalArticle || !serverData) return;
    setIsDeleting(true);

    try {
      await publishArticleToServer({
        action: "delete",
        targetFingerprint: deleteModalArticle.fp,
        baseSha: serverData.sha,
        commitMessage: `content: delete article (${deleteModalArticle.fp})`,
      });

      await deleteDraft(deleteModalArticle.fp);
      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.delete(deleteModalArticle.fp);
        return next;
      });

      showToast("success", "文章已成功从数据库中删除");
      const deletedFp = deleteModalArticle.fp;
      setDeleteModalArticle(null);

      if (selectedFingerprint === deletedFp) {
        setSelectedFingerprint(null);
        setIsNewArticle(true);
      }

      await loadInitialData();
    } catch (err: any) {
      showToast("error", `删除失败: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const availableTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of serverData?.articles || []) {
      for (const t of a.tags || []) {
        map.set(t, (map.get(t) || 0) + 1);
      }
    }
    return Array.from(map.entries()).map(([tag, count]) => ({ tag, count }));
  }, [serverData]);

  const historicalLocations = useMemo(() => {
    const set = new Set<string>();
    for (const a of serverData?.articles || []) {
      if (a.location) set.add(a.location);
    }
    return Array.from(set);
  }, [serverData]);

  const isMomentsDirty = useMemo(() => {
    if (isNewArticle) {
      return (
        draftsMap.has("new-draft") ||
        currentArticle.content.trim().length > 0 ||
        currentArticle.media.length > 0 ||
        Boolean(currentArticle.location) ||
        Boolean(
          currentArticle.music?.title ||
            currentArticle.music?.artist ||
            currentArticle.music?.url,
        )
      );
    }
    if (!selectedFingerprint) return false;
    if (draftsMap.has(selectedFingerprint)) return true;
    const serverArticle = serverData?.articles.find(
      (a) => generateArticleFingerprint(a) === selectedFingerprint,
    );
    return serverArticle
      ? JSON.stringify(currentArticle) !== JSON.stringify(serverArticle)
      : false;
  }, [isNewArticle, selectedFingerprint, draftsMap, currentArticle, serverData]);

  const handleCycleTheme = () => {
    const next =
      settings.theme === "light"
        ? "dark"
        : settings.theme === "dark"
          ? "system"
          : "light";
    updateSettings({ theme: next });
  };

  const handleRailCreate = () => {
    if (contentMode === "moments") {
      handleNewArticle();
    } else {
      setPostsOpened(true);
      setNewPostTrigger((c) => c + 1);
      if (isMobileViewport() && settings.autoCloseSidebarOnMobile) {
        setSidebarOpen(false);
      }
    }
  };

  const refreshPostDrafts = async () => {
    try {
      setModalPostDrafts(await getPostDrafts());
    } catch {
      /* indexedDB unavailable */
    }
  };

  const handleDeleteMomentDraft = async (id: string) => {
    await deleteDraft(id);
    setDraftsMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    showToast("info", "已删除一条说说草稿");
  };

  const handleClearAllMomentDrafts = async () => {
    for (const id of draftsMap.keys()) {
      await deleteDraft(id);
    }
    setDraftsMap(new Map());
    showToast("info", "已清空所有本地说说草稿");
  };

  const handleDeletePostDraft = async (id: string) => {
    await deletePostDraft(id);
    await refreshPostDrafts();
    setPostDraftSyncRev((c) => c + 1);
    showToast("info", "已删除一条博客草稿");
  };

  const handleClearAllPostDrafts = async () => {
    for (const d of modalPostDrafts) {
      await deletePostDraft(d.id);
    }
    setModalPostDrafts([]);
    setPostDraftSyncRev((c) => c + 1);
    showToast("info", "已清空所有本地博客草稿");
  };

  shortcutHandlersRef.current = {
    enabled: settings.enableShortcuts,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    save: () => {
      if (contentMode === "moments") {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        void persistMomentDraftNow(currentArticle).then(() =>
          showToast("success", "当前说说草稿已立即保存"),
        );
      } else {
        setPostsOpened(true);
        setPostSaveTrigger((c) => c + 1);
      }
    },
    publish: () => {
      if (contentMode === "moments") {
        if (!isPublishing && serverData) void handlePublish();
      } else {
        setPostsOpened(true);
        setPostPublishTrigger((c) => c + 1);
      }
    },
  };

  if (isCheckingAuth) {
    return (
      <S.SessionScreen>
        <S.SessionSpinner />
        <S.SessionMessage>正在验证安全会话...</S.SessionMessage>
      </S.SessionScreen>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        initialError={authError}
        onRetry={initAuth}
      />
    );
  }

  return (
    <S.AppShell>
      {/* Left 44px Icon Rail with aligned top-left single-icon list toggle */}
      <S.LeftRailColumn>
        <S.RailTopToggleSlot>
          <S.RailIconButton
            type="button"
            $active={sidebarOpen}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "收起列表" : "展开列表"}
            title={sidebarOpen ? "收起列表 (Ctrl+B)" : "展开列表 (Ctrl+B)"}
          >
            <PanelLeft size={15} />
          </S.RailIconButton>
        </S.RailTopToggleSlot>

        <S.RailNav>
          <S.RailGroup>
            <S.RailIconButton
              type="button"
              $active={contentMode === "moments"}
              onClick={() => switchContentMode("moments")}
              aria-label="说说动态"
              title="说说动态"
            >
              <MessageCircle size={15} />
            </S.RailIconButton>
            <S.RailIconButton
              type="button"
              $active={contentMode === "posts"}
              onClick={() => switchContentMode("posts")}
              aria-label="博客长文"
              title="博客长文"
            >
              <FileText size={15} />
            </S.RailIconButton>
            <S.RailMiniDivider />
            <S.RailIconButton
              type="button"
              $primary
              onClick={handleRailCreate}
              aria-label={contentMode === "moments" ? "新建说说" : "新建文章"}
              title={contentMode === "moments" ? "新建说说" : "新建文章"}
            >
              <Plus size={15} />
            </S.RailIconButton>
          </S.RailGroup>

          <S.RailGroup>
            <S.RailIconButton
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              aria-label="存储状态"
              title={
                serverData?.isD1
                  ? serverData.d1Mode === "http"
                    ? "Cloudflare D1 (REST 直连)"
                    : "Cloudflare D1 已联机"
                  : "未绑定 D1 (离线模拟模式)"
              }
            >
              <S.StatusDot $connected={Boolean(serverData?.isD1)} />
            </S.RailIconButton>
            <S.RailIconButton
              type="button"
              onClick={handleCycleTheme}
              aria-label="切换主题"
              title={
                settings.theme === "light"
                  ? "主题：浅色"
                  : settings.theme === "dark"
                    ? "主题：深色"
                    : "主题：跟随系统"
              }
            >
              {settings.theme === "light" ? (
                <Sun size={15} />
              ) : settings.theme === "dark" ? (
                <Moon size={15} />
              ) : (
                <Laptop size={15} />
              )}
            </S.RailIconButton>
            <S.RailIconButton
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              aria-label="系统设置"
              title="CMS 设置"
            >
              <Settings size={15} />
            </S.RailIconButton>
            <S.RailIconButton
              type="button"
              $danger
              onClick={handleLogout}
              aria-label="退出登录"
              title="退出登录"
            >
              <LogOut size={15} />
            </S.RailIconButton>
          </S.RailGroup>
        </S.RailNav>
      </S.LeftRailColumn>

      {/* Main Content Column */}
      <S.WorkspaceColumn>
        {toastMsg && (
          <S.Toast
            $variant={
              toastMsg.type === "success"
                ? "v0"
                : toastMsg.type === "error"
                  ? "v1"
                  : "v2"
            }
          >
            <S.ToastContent>
              {toastMsg.type === "success" ? (
                <S.CheckCircle />
              ) : toastMsg.type === "error" ? (
                <S.AlertTriangle />
              ) : (
                <S.Sparkles />
              )}
              <S.ToastText>{toastMsg.text}</S.ToastText>
            </S.ToastContent>
          </S.Toast>
        )}

        {postsOpened && (
          <S.PostsSlot $visible={contentMode === "posts"}>
            <Suspense fallback={<S.P role="status">正在载入博客编辑器…</S.P>}>
              <PostsWorkspace
                sidebarOpen={sidebarOpen}
                onSidebarOpenChange={setSidebarOpen}
                newPostTrigger={newPostTrigger}
                draftSyncRevision={postDraftSyncRev}
                saveTrigger={postSaveTrigger}
                publishTrigger={postPublishTrigger}
                settings={settings}
                onToast={showToast}
              />
            </Suspense>
          </S.PostsSlot>
        )}

        {/* Moments Workspace */}
        <S.MomentsWorkspace $visible={contentMode === "moments"}>
          <S.WorkspaceHeader>
            <S.HeaderLeft>
              {settings.siteIcon && (
                <S.BrandIconImg src={settings.siteIcon} alt="" />
              )}
              <S.BrandTitle>{settings.siteName}</S.BrandTitle>
              <S.ModePill>{isNewArticle ? "新说说" : "说说动态"}</S.ModePill>
              <S.StatusTextPill>
                {autoSaveStatus} · {currentArticle.content.length} 字
              </S.StatusTextPill>
              {isMomentsDirty && <S.DirtyBadge>未发布修改</S.DirtyBadge>}
              {serverData && !serverData.isD1 && (
                <S.HeaderModeButton
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  title="未检测到 Cloudflare D1 绑定，点击查看配置"
                >
                  离线模拟
                </S.HeaderModeButton>
              )}
            </S.HeaderLeft>

            <S.HeaderRight>
              <S.ViewGroup>
                <S.ViewButton
                  type="button"
                  data-active={momentsView === "edit"}
                  onClick={() => setMomentsView("edit")}
                >
                  <PenLine size={12} />
                  编辑
                </S.ViewButton>
                <S.ViewButton
                  type="button"
                  data-active={momentsView === "split"}
                  onClick={() => setMomentsView("split")}
                >
                  <Columns2 size={12} />
                  分屏
                </S.ViewButton>
                <S.ViewButton
                  type="button"
                  data-active={momentsView === "preview"}
                  onClick={() => setMomentsView("preview")}
                >
                  <Eye size={12} />
                  预览
                </S.ViewButton>
              </S.ViewGroup>

              <S.GhostButton
                type="button"
                onClick={handleRevertChanges}
                disabled={!isMomentsDirty}
                aria-label="放弃未发布的本地修改"
                title="放弃未发布的本地修改"
              >
                <RotateCcw size={12} />
                <span className="btn-label">放弃</span>
              </S.GhostButton>

              <S.DangerIconButton
                type="button"
                onClick={() => {
                  if (selectedFingerprint) {
                    setDeleteModalArticle({
                      article: currentArticle,
                      fp: selectedFingerprint,
                    });
                  }
                }}
                disabled={isNewArticle || !selectedFingerprint}
                aria-label="删除当前说说"
                title="删除当前说说"
              >
                <Trash2 size={13} />
              </S.DangerIconButton>

              <S.PublishButton
                type="button"
                onClick={() => handlePublish()}
                disabled={isPublishing || !serverData}
              >
                <UploadCloud size={13} />
                {isPublishing ? "发布中…" : "发布"}
              </S.PublishButton>
            </S.HeaderRight>
          </S.WorkspaceHeader>

          {isLoading && (
            <S.LoadingNotice role="status">正在加载文章…</S.LoadingNotice>
          )}
          {errorMsg && (
            <S.ErrorNotice role="alert">
              <span>{errorMsg}</span>
              <S.RetryButton
                type="button"
                onClick={() => loadInitialData()}
                disabled={isLoading}
              >
                重新加载
              </S.RetryButton>
            </S.ErrorNotice>
          )}

          <S.MomentsBody>
            <S.MomentsSidebarWrap $open={sidebarOpen}>
              <ArticleListSidebar
                articles={serverData?.articles || []}
                selectedFingerprint={selectedFingerprint}
                onSelectArticle={handleSelectArticle}
                onNewArticle={handleNewArticle}
                onCloneArticle={handleCloneArticle}
                onDeleteArticle={(article, fp) =>
                  setDeleteModalArticle({ article, fp })
                }
                drafts={draftsMap}
                getFingerprint={generateArticleFingerprint}
                defaultSortOrder={settings.defaultSortOrder}
                compactList={settings.compactList}
              />
            </S.MomentsSidebarWrap>

            <S.MomentsCanvasWrap $sidebarOpen={sidebarOpen}>
              <S.MomentsSplitGrid data-single={momentsView !== "split"}>
                {momentsView !== "preview" && (
                  <S.CanvasPaneCard>
                    <S.PaneHeader>
                      <S.PaneTitle>
                        {isNewArticle ? "撰写新说说" : "正文内容"}
                      </S.PaneTitle>
                      <S.PaneMetaGroup>
                        <S.UndoRedoGroup>
                          <S.SmallIconButton
                            type="button"
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            title="撤回 (Undo)"
                          >
                            <Undo2 size={13} />
                          </S.SmallIconButton>
                          <S.SmallIconButton
                            type="button"
                            onClick={handleRedo}
                            disabled={historyIndex >= historyStack.length - 1}
                            title="重做 (Redo)"
                          >
                            <Redo2 size={13} />
                          </S.SmallIconButton>
                        </S.UndoRedoGroup>
                        <span>{currentArticle.content.length} 字</span>
                      </S.PaneMetaGroup>
                    </S.PaneHeader>

                    <S.EditorScrollBody>
                      <S.Textarea
                        value={currentArticle.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="分享此刻的所思所想..."
                        rows={8}
                        spellCheck={settings.spellCheck}
                        style={{
                          fontFamily: resolveEditorFontCss(
                            settings.editorFontFamily,
                            "moments",
                          ),
                          fontSize: `${settings.editorFontSize}px`,
                          lineHeight: settings.editorLineHeight,
                        }}
                      />
                      <S.MediaSection>
                        <NineGridMedia
                          media={currentArticle.media}
                          onChange={(newMedia) =>
                            updateArticle((prev) => ({
                              ...prev,
                              media: newMedia,
                            }))
                          }
                          defaultBatchMediaType={settings.defaultBatchMediaType}
                        />
                      </S.MediaSection>
                    </S.EditorScrollBody>
                  </S.CanvasPaneCard>
                )}

                {momentsView !== "edit" && (
                  <S.CanvasPaneCard>
                    <S.PaneHeader>
                      <S.PaneTitle>实时前台预览</S.PaneTitle>
                      <S.PaneMetaGroup>Moments</S.PaneMetaGroup>
                    </S.PaneHeader>
                    <S.PreviewScrollBody>
                      <MomentPreview
                        article={currentArticle}
                        authorName={settings.momentAuthorName}
                        authorAvatar={settings.momentAuthorAvatar}
                        dateFormat={settings.momentDateFormat}
                      />
                    </S.PreviewScrollBody>
                  </S.CanvasPaneCard>
                )}
              </S.MomentsSplitGrid>

              {/* Single-line horizontally scrollable always-editable Floating Meta Dock */}
              <S.FloatingDockWrap>
                <S.FloatingDockScroll onWheel={handleDockWheel}>
                  <S.DockPill>
                    <Clock size={12} />
                    <input
                      type="datetime-local"
                      value={formatLocalDateTime(currentArticle.time)}
                      onChange={(e) => {
                        const parsed = new Date(e.target.value).getTime();
                        if (!Number.isNaN(parsed)) {
                          updateArticle((prev) => ({ ...prev, time: parsed }));
                        }
                      }}
                      aria-label="发布时间"
                      style={{ width: "138px" }}
                    />
                    <S.DockNowButton
                      type="button"
                      onClick={() =>
                        updateArticle((prev) => ({ ...prev, time: Date.now() }))
                      }
                    >
                      此刻
                    </S.DockNowButton>
                  </S.DockPill>

                  <S.DockDivider />

                  <S.DockPill>
                    <MapPin size={12} />
                    <input
                      type="text"
                      list="moments-location-list"
                      value={currentArticle.location || ""}
                      onChange={(e) =>
                        updateArticle((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="地点"
                      aria-label="发布地点"
                      style={{ width: "84px" }}
                    />
                  </S.DockPill>

                  <S.DockPill>
                    <Hash size={12} />
                    <input
                      type="text"
                      list="moments-tag-list"
                      value={tagsInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setTagsInput(raw);
                        updateArticle((prev) => ({
                          ...prev,
                          tags: parseTagList(raw),
                        }));
                      }}
                      placeholder="标签 (逗号分隔)"
                      aria-label="说说标签"
                      style={{ width: "120px" }}
                    />
                  </S.DockPill>

                  <S.DockDivider />

                  <S.DockPill>
                    <Music size={12} />
                    <input
                      type="text"
                      value={currentArticle.music?.title || ""}
                      onChange={(e) => updateMusicField("title", e.target.value)}
                      placeholder="歌名"
                      aria-label="音乐名称"
                      style={{ width: "86px" }}
                    />
                    <span>·</span>
                    <input
                      type="text"
                      value={currentArticle.music?.artist || ""}
                      onChange={(e) =>
                        updateMusicField("artist", e.target.value)
                      }
                      placeholder="歌手"
                      aria-label="歌手"
                      style={{ width: "68px" }}
                    />
                    <span>·</span>
                    <input
                      type="url"
                      value={currentArticle.music?.url || ""}
                      onChange={(e) => updateMusicField("url", e.target.value)}
                      placeholder="音频 URL"
                      aria-label="音频链接"
                      style={{ width: "120px" }}
                    />
                  </S.DockPill>

                  <S.DockDivider />

                  <S.DockPill>
                    <GitCommitHorizontal size={12} />
                    <input
                      type="text"
                      value={commitMessageInput}
                      onChange={(e) => setCommitMessageInput(e.target.value)}
                      placeholder={isNewArticle ? "发布备注 (新说说)" : "发布备注 (可选)"}
                      aria-label="发布备注"
                      style={{ width: "128px" }}
                    />
                  </S.DockPill>
                </S.FloatingDockScroll>
              </S.FloatingDockWrap>

              <datalist id="moments-location-list">
                {historicalLocations.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
              <datalist id="moments-tag-list">
                {availableTags.map(({ tag }) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </S.MomentsCanvasWrap>
          </S.MomentsBody>
        </S.MomentsWorkspace>
      </S.WorkspaceColumn>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={deleteModalArticle !== null}
        article={deleteModalArticle?.article || null}
        onClose={() => setDeleteModalArticle(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <ConflictResolutionModal
        isOpen={conflictModalData.isOpen}
        onClose={() => setConflictModalData({ isOpen: false })}
        onReloadRemote={async () => {
          setConflictModalData({ isOpen: false });
          await loadInitialData();
          showToast("info", "已拉取最新远程版本，当前草稿已保留");
        }}
        onForcePublish={() => handlePublish({ force: true })}
        localArticle={currentArticle}
        remoteSha={conflictModalData.remoteSha}
        clientBaseSha={conflictModalData.clientBaseSha}
        isPublishing={isPublishing}
      />

      {isConfigModalOpen && (
        <Suspense fallback={null}>
          <ConfigInfoModal
            isOpen={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetSettings={handleResetSettings}
            onReplaceSettings={handleReplaceSettings}
            articles={serverData?.articles || []}
            momentDrafts={Array.from(draftsMap.values())}
            postDrafts={modalPostDrafts}
            onRefreshPostDrafts={refreshPostDrafts}
            onDeleteMomentDraft={handleDeleteMomentDraft}
            onDeletePostDraft={handleDeletePostDraft}
            onClearAllMomentDrafts={handleClearAllMomentDrafts}
            onClearAllPostDrafts={handleClearAllPostDrafts}
            onImportComplete={loadInitialData}
            onToast={showToast}
            onLogout={handleLogout}
            isD1={serverData?.isD1}
            d1Mode={serverData?.d1Mode}
            userEmail={currentUser?.email || serverData?.user?.email}
          />
        </Suspense>
      )}
    </S.AppShell>
  );
}

export default App;
