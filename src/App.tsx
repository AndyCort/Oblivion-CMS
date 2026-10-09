import * as S from './App.styles';
import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
import type {
  Article,
  ArticleDraft,
} from "./types/article";
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
} from "./lib/storage/draftStore";
import { ArticleListSidebar } from "./components/articles/ArticleListSidebar";
import { NineGridMedia } from "./components/media/NineGridMedia";
import { MusicEditor } from "./components/music/MusicEditor";
import { TagManager } from "./components/tags/TagManager";
import { LocationInput } from "./components/location/LocationInput";
import { DateTimePicker } from "./components/time/DateTimePicker";
import { MomentPreview } from "./components/preview/MomentPreview";
import { DeleteConfirmModal } from "./components/modals/DeleteConfirmModal";
import { ConflictResolutionModal } from "./components/modals/ConflictResolutionModal";
import { ConfigInfoModal } from "./components/modals/ConfigInfoModal";

const PostsWorkspace = lazy(() => import("./components/posts/PostsWorkspace"));


export function App() {
  const [contentMode, setContentMode] = useState<"moments" | "posts">(() => {
    try { return localStorage.getItem("oblivion_content_mode") === "posts" ? "posts" : "moments"; } catch { return "moments"; }
  });
  const [postsOpened, setPostsOpened] = useState(contentMode === "posts");
  function switchContentMode(mode: "moments" | "posts") {
    setContentMode(mode);
    if (mode === "posts") setPostsOpened(true);
    try { localStorage.setItem("oblivion_content_mode", mode); } catch { /* restricted storage */ }
  }
  // Server state
  const [serverData, setServerData] = useState<FetchArticlesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Local drafts state (mapped by draft ID)
  const [draftsMap, setDraftsMap] = useState<Map<string, ArticleDraft>>(new Map());

  // Active editing state
  const [selectedFingerprint, setSelectedFingerprint] = useState<string | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article>({
    time: Date.now(),
    content: "",
    media: [],
    tags: [],
    location: "",
  });

  // Undo / Redo history for content
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // UI state
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [mobileView, setMobileView] = useState<"sidebar" | "editor">("sidebar");
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("已保存");

  // Modals state
  const [deleteModalArticle, setDeleteModalArticle] = useState<{ article: Article; fp: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [conflictModalData, setConflictModalData] = useState<{
    isOpen: boolean;
    remoteSha?: string;
    clientBaseSha?: string;
  }>({ isOpen: false });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [commitMessageInput, setCommitMessageInput] = useState("");

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

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

      // Build drafts map
      const dMap = new Map<string, ArticleDraft>();
      for (const d of localDrafts) {
        dMap.set(d.id, d);
      }
      setDraftsMap(dMap);

      // Select first article by default if none selected
      if (remote.articles.length > 0 && !selectedFingerprint && !isNewArticle) {
        const first = remote.articles[0];
        const fp = generateArticleFingerprint(first);
        setSelectedFingerprint(fp);

        const existingDraft = dMap.get(fp);
        if (existingDraft) {
          setCurrentArticle(existingDraft.article);
          showToast("info", "已自动恢复该文章的本地未发布草稿");
        } else {
          setCurrentArticle(first);
        }
        setHistoryStack([first.content]);
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

  // Debounced auto-save draft to IndexedDB
  const triggerAutoSave = (updated: Article) => {
    setAutoSaveStatus("正在保存草稿...");
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const draftId = isNewArticle ? "new-draft" : (selectedFingerprint || "new-draft");
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

        const timeStr = new Date().toLocaleTimeString();
        setAutoSaveStatus(`本地已自动保存于 ${timeStr}`);
      } catch (err) {
        setAutoSaveStatus("本地保存失败");
      }
    }, 700);
  };

  // Update current article and trigger draft save
  const updateArticle = (updater: (prev: Article) => Article) => {
    setCurrentArticle((prev) => {
      const next = updater(prev);
      triggerAutoSave(next);
      return next;
    });
  };

  // Content change with Undo/Redo tracking
  const handleContentChange = (newContent: string) => {
    updateArticle((prev) => ({ ...prev, content: newContent }));

    // Record history (debounce history points)
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
    setMobileView("editor");

    // Check if draft exists
    const draft = draftsMap.get(fp);
    if (draft) {
      setCurrentArticle(draft.article);
      setHistoryStack([draft.article.content]);
      setHistoryIndex(0);
      showToast("info", "已载入本地未发布草稿");
    } else {
      const target = serverData?.articles.find(
        (a) => generateArticleFingerprint(a) === fp
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
    setMobileView("editor");

    // Check if unsaved new draft exists
    const newDraft = draftsMap.get("new-draft");
    if (newDraft) {
      setCurrentArticle(newDraft.article);
      setHistoryStack([newDraft.article.content]);
      setHistoryIndex(0);
      showToast("info", "已恢复之前的未发布新建草稿");
    } else {
      const freshArticle: Article = {
        time: Date.now(),
        content: "",
        media: [],
        tags: ["日常"],
        location: "",
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
    setMobileView("editor");

    const cloned: Article = {
      ...source,
      time: Date.now(),
      content: source.content ? `${source.content}\n（副本）` : "",
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
        (a) => generateArticleFingerprint(a) === selectedFingerprint
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
    setIsPublishing(true);

    const isForce = options?.force === true;
    const action = isNewArticle ? "create" : "update";
    const draftId = isNewArticle ? "new-draft" : (selectedFingerprint || "new-draft");

    try {
      const res = await publishArticleToServer({
        action,
        article: currentArticle,
        targetFingerprint: isNewArticle ? undefined : (selectedFingerprint || undefined),
        baseSha: conflictModalData.remoteSha || serverData.sha,
        commitMessage: commitMessageInput.trim() || undefined,
        force: isForce,
      });

      // Clear draft on successful publish
      await deleteDraft(draftId);
      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.delete(draftId);
        return next;
      });

      showToast("success", isForce ? `强制覆盖发布成功！${res.commitMessage}` : `发布成功！${res.commitMessage}`);
      setCommitMessageInput("");

      // Lock on newly published article and exit new mode
      const newFp = generateArticleFingerprint(currentArticle);
      setSelectedFingerprint(newFp);
      setIsNewArticle(false);

      // Close conflict modal if open
      setConflictModalData({ isOpen: false });

      // Refresh articles from server
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

      // Delete draft if exists
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

      // Reload
      await loadInitialData();
    } catch (err: any) {
      showToast("error", `删除失败: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Autocomplete tags and locations from all articles
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
      {/* Top Navbar */}
      <S.TopBar>
        <S.BrandArea>
          {/* Mobile view toggle */}
          {contentMode === "moments" && (mobileView === "editor" ? (
            <S.Button
              type="button"
              onClick={() => setMobileView("sidebar")}

              title="返回文章列表"
            >
              <S.ChevronLeft />
              <span>列表</span>
            </S.Button>
          ) : (
            <S.Button2
              type="button"
              onClick={() => setMobileView("editor")}

              title="前往编辑器"
            >
              <S.PenTool />
              <span>编辑</span>
            </S.Button2>
          ))}

          {/* Logo & Brand */}
          <S.InlineGroup>
            <S.BrandIcon>
              <S.PenTool2 />
            </S.BrandIcon>
            <div>
              <S.InlineGroup>
                <S.BrandName>
                  Oblivion-CMS
                </S.BrandName>
                <S.VersionBadge>
                  v1.0
                </S.VersionBadge>
              </S.InlineGroup>
            </div>
          </S.InlineGroup>

          {/* D1 Storage status badge */}
          {contentMode === "moments" && serverData && (
            <S.DatabaseStatus>
              <S.Database />
              <span>Cloudflare D1</span>
              {serverData.isD1 ? (
                <S.Span4>
                  {serverData.d1Mode === "http" ? "REST 直连" : "已联机 (生产)"}
                </S.Span4>
              ) : (
                <S.Button3
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}

                  title="未检测到 Cloudflare D1 绑定，点击查看配置指引"
                >
                  未绑定 D1
                </S.Button3>
              )}
            </S.DatabaseStatus>
          )}
        </S.BrandArea>

        {/* Right action controls */}
        <S.HeaderActions>
          {/* Desktop 3-option theme switcher */}
          <S.ThemeSwitcher>
            <S.LightThemeButton
              type="button"
              onClick={() => setTheme("light")}
              $variant={((theme === "light")) ? "v0" : "v1"}
              title="浅色模式"
            >
              <S.Sun />
            </S.LightThemeButton>
            <S.DarkThemeButton
              type="button"
              onClick={() => setTheme("dark")}
              $variant={((theme === "dark")) ? "v0" : "v1"}
              title="深色模式"
            >
              <S.Moon />
            </S.DarkThemeButton>
            <S.SystemThemeButton
              type="button"
              onClick={() => setTheme("system")}
              $variant={((theme === "system")) ? "v0" : "v1"}
              title="跟随系统"
            >
              <S.Laptop />
            </S.SystemThemeButton>
          </S.ThemeSwitcher>

          {/* Mobile compact single theme cycle button */}
          <S.MobileThemeButton
            type="button"
            onClick={() => {
              if (theme === "light") setTheme("dark");
              else if (theme === "dark") setTheme("system");
              else setTheme("light");
            }}

            title="切换主题"
          >
            {theme === "light" ? (
              <S.Sun2 />
            ) : theme === "dark" ? (
              <S.Moon2 />
            ) : (
              <S.Laptop2 />
            )}
          </S.MobileThemeButton>


          {/* System status / config modal button */}
          <S.SettingsButton
            type="button"
            onClick={() => setIsConfigModalOpen(true)}

            title="查看连接与鉴权配置"
          >
            <S.Settings />
          </S.SettingsButton>

          {/* Logout button */}
          <S.LogoutButton
            type="button"
            onClick={handleLogout}

            title="退出登录"
          >
            <S.LogOut />
          </S.LogoutButton>
        </S.HeaderActions>
      </S.TopBar>

      <S.ModeNavigation aria-label="内容模式" >
        {(["moments", "posts"] as const).map(mode => <S.ModeButton key={mode} type="button" aria-pressed={contentMode === mode} onClick={() => switchContentMode(mode)} $variant={((contentMode === mode)) ? "v0" : "v1"}>{mode === "moments" ? "💬 说说动态 (Moments)" : "📝 博客长文 (Posts)"}</S.ModeButton>)}
      </S.ModeNavigation>
      {postsOpened && <div hidden={contentMode !== "posts"}><Suspense fallback={<S.P role="status" >正在载入博客编辑器…</S.P>}><PostsWorkspace /></Suspense></div>}
      {contentMode === "moments" && isLoading && <S.LoadingNotice role="status" >正在加载文章…</S.LoadingNotice>}
      {contentMode === "moments" && errorMsg && (
        <S.ErrorNotice role="alert" >
          <span>{errorMsg}</span>
          <S.Button12 type="button" onClick={() => loadInitialData()} disabled={isLoading} >重新加载</S.Button12>
        </S.ErrorNotice>
      )}

      {/* Toast Alert Banner */}
      {toastMsg && (
        <S.Toast
          $variant={((toastMsg.type === "success")) ? "v0" : ((toastMsg.type === "error")) ? "v1" : "v2"}
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

      {/* Main Workspace Body */}
      <S.MomentsWorkspace  $visible={contentMode === "moments"}>
        {/* Left Sidebar: Article List */}
        <S.MomentsSidebar
          $variant={((mobileView === "sidebar")) ? "v0" : "v1"}
        >
          <ArticleListSidebar
            articles={serverData?.articles || []}
            selectedFingerprint={selectedFingerprint}
            onSelectArticle={handleSelectArticle}
            onNewArticle={handleNewArticle}
            onCloneArticle={handleCloneArticle}
            onDeleteArticle={(article, fp) => setDeleteModalArticle({ article, fp })}
            drafts={draftsMap}
            getFingerprint={generateArticleFingerprint}
 />
        </S.MomentsSidebar>

        {/* Right Content: Editor & Preview */}
        <S.MomentsEditor
          $variant={((mobileView === "editor")) ? "v0" : "v1"}
        >
          <S.EditorContainer>
            {/* D1 Unbound Warning Banner */}
            {serverData && !serverData.isD1 && (
              <S.DatabaseWarning>
                <S.WarningContent>
                  <S.AlertTriangle2 />
                  <div>
                    <S.Span7>未检测到 Cloudflare D1 数据库绑定（当前为离线模拟模式）</S.Span7>
                    <S.P2>
                      您所做的修改当前仅保存在临时内存中，未写入云端 D1 数据库。请在 Cloudflare Pages 绑定 D1 数据库以持久化保存文章。
                    </S.P2>
                  </div>
                </S.WarningContent>
                <S.Button13
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}

                >
                  如何绑定 D1
                </S.Button13>
              </S.DatabaseWarning>
            )}

            {/* Editor Action Bar / Header */}
            <S.EditorToolbar>
              <S.InlineGroup>
                <S.Span8>
                  {isNewArticle ? "撰写新说说" : "编辑说说"}
                </S.Span8>
                <S.Span9>
                  {autoSaveStatus}
                </S.Span9>
              </S.InlineGroup>

              {/* View Mode Toggle: Edit <-> Preview */}
              <S.EditorActions>
                <S.EditorViewSwitcher>
                  <S.EditViewButton
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    $variant={((activeTab === "edit")) ? "v0" : "v1"}
                  >
                    编辑
                  </S.EditViewButton>
                  <S.PreviewViewButton
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    $variant={((activeTab === "preview")) ? "v0" : "v1"}
                  >
                    <S.Eye />
                    前台预览
                  </S.PreviewViewButton>
                </S.EditorViewSwitcher>
              </S.EditorActions>
            </S.EditorToolbar>

            {/* Editor Mode */}
            {activeTab === "edit" ? (
              <S.EditorCard>
                {/* Meta details row: Time & Location */}
                <S.MetadataRow>
                  <DateTimePicker
                    time={currentArticle.time}
                    onChange={(newTime) =>
                      updateArticle((prev) => ({ ...prev, time: newTime }))
                    }
 />
                  <LocationInput
                    location={currentArticle.location}
                    onChange={(newLoc) =>
                      updateArticle((prev) => ({ ...prev, location: newLoc }))
                    }
                    historicalLocations={historicalLocations}
 />
                </S.MetadataRow>

                {/* Content Textarea with word count & Undo/Redo */}
                <S.Div23>
                  <S.Div24>
                    <S.Label>
                      正文内容 (支持多行与换行)
                    </S.Label>
                    <S.Div25>
                      <S.Div26>
                        <S.Button16
                          type="button"
                          onClick={handleUndo}
                          disabled={historyIndex <= 0}

                          title="撤回 (Undo)"
                        >
                          <S.Undo2 />
                        </S.Button16>
                        <S.Button16
                          type="button"
                          onClick={handleRedo}
                          disabled={historyIndex >= historyStack.length - 1}

                          title="重做 (Redo)"
                        >
                          <S.Redo2 />
                        </S.Button16>
                      </S.Div26>
                      <S.Span10>
                        {currentArticle.content.length} 字
                      </S.Span10>
                    </S.Div25>
                  </S.Div24>

                  <S.Textarea
                    value={currentArticle.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="分享此刻的所思所想..."
                    rows={6}

 />
                </S.Div23>

                {/* 9-Grid Media Manager */}
                <S.Div27>
                  <NineGridMedia
                    media={currentArticle.media}
                    onChange={(newMedia) =>
                      updateArticle((prev) => ({ ...prev, media: newMedia }))
                    }
 />
                </S.Div27>

                {/* Tags Manager */}
                <S.Div27>
                  <TagManager
                    tags={currentArticle.tags}
                    onChange={(newTags) =>
                      updateArticle((prev) => ({ ...prev, tags: newTags }))
                    }
                    availableTags={availableTags}
 />
                </S.Div27>

                {/* Music Editor */}
                <S.Div27>
                  <MusicEditor
                    music={currentArticle.music}
                    onChange={(newMusic) =>
                      updateArticle((prev) => ({ ...prev, music: newMusic }))
                    }
 />
                </S.Div27>

                {/* Commit message custom input */}
                <S.Div28>
                  <S.Label2>
                    自定义发布备注 / 变更说明 (留空将使用默认)
                  </S.Label2>
                  <S.Input
                    type="text"
                    value={commitMessageInput}
                    onChange={(e) => setCommitMessageInput(e.target.value)}
                    placeholder={
                      isNewArticle
                        ? "发表新说说"
                        : "更新说说内容"
                    }

 />
                </S.Div28>

                {/* Action Buttons Bar - sticky at bottom on mobile */}
                <S.Div29>
                  <S.InlineGroup>
                    <S.Button17
                      type="button"
                      onClick={handleRevertChanges}

                    >
                      <S.RotateCcw />
                      <span>放弃草稿更改</span>
                    </S.Button17>
                  </S.InlineGroup>

                  <S.Div30>
                    <S.Button18
                      type="button"
                      onClick={() => handlePublish()}
                      disabled={isPublishing}

                    >
                      <S.UploadCloud2 />
                      <span>{isPublishing ? "正在发布..." : "发布到数据库"}</span>
                    </S.Button18>
                  </S.Div30>
                </S.Div29>
              </S.EditorCard>
            ) : (
              /* Live Preview Mode */
              <S.Div31>
                <MomentPreview article={currentArticle} />

                {/* Quick publish bar under preview */}
                <S.Div32>
                  <S.Button19
                    type="button"
                    onClick={() => setActiveTab("edit")}

                  >
                    返回编辑
                  </S.Button19>
                  <S.Button20
                    type="button"
                    onClick={() => handlePublish()}
                    disabled={isPublishing}

                  >
                    <S.UploadCloud2 />
                    <span>{isPublishing ? "正在发布..." : "直接发布此版本"}</span>
                  </S.Button20>
                </S.Div32>
              </S.Div31>
            )}
          </S.EditorContainer>
        </S.MomentsEditor>
      </S.MomentsWorkspace>

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

      <ConfigInfoModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        owner={serverData?.owner}
        repo={serverData?.repo}
        branch={serverData?.branch}
        path={serverData?.path}
        sha={serverData?.sha}
        isMock={serverData?.isMock}
        userEmail={currentUser?.email || serverData?.user?.email}
        bindingName={serverData?.bindingName}
        envKeys={serverData?.envKeys}
 />

    </S.AppShell>
  );
}
export default App;
