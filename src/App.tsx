import React, { useState, useEffect, useMemo, useRef } from "react";
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
  getDraft,
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
import {
  PenTool,
  UploadCloud,
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  Eye,
  CheckCircle,
  AlertTriangle,
  GitBranch,
  Sun,
  Moon,
  Laptop,
  Menu,
  ChevronLeft,
  Sparkles,
  Layers,
  Settings,
  LogOut,
  Database,
} from "lucide-react";

export function App() {
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

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-400 gap-3 select-none font-sans">
        <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-stone-400 tracking-wider">正在验证安全会话...</span>
      </div>
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
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile view toggle */}
          {mobileView === "editor" ? (
            <button
              type="button"
              onClick={() => setMobileView("sidebar")}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 -ml-1 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl active:scale-95 transition-all"
              title="返回文章列表"
            >
              <ChevronLeft className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
              <span>列表</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileView("editor")}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 -ml-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl active:scale-95 transition-all"
              title="前往编辑器"
            >
              <PenTool className="w-3.5 h-3.5 text-indigo-500" />
              <span>编辑</span>
            </button>
          )}

          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-stone-900 dark:text-stone-100">
                  Oblivion-CMS
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          {/* D1 Storage status badge */}
          {serverData && (
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Cloudflare D1</span>
              {serverData.isMock ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-sans">
                  模拟存储
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-sans">
                  已联机
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop 3-option theme switcher */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 text-xs">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "light"
                  ? "bg-white dark:bg-stone-700 text-amber-600 shadow-xs"
                  : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
              title="浅色模式"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-white dark:bg-stone-700 text-indigo-400 shadow-xs"
                  : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
              title="深色模式"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "system"
                  ? "bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-xs"
                  : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
              title="跟随系统"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile compact single theme cycle button */}
          <button
            type="button"
            onClick={() => {
              if (theme === "light") setTheme("dark");
              else if (theme === "dark") setTheme("system");
              else setTheme("light");
            }}
            className="sm:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            title="切换主题"
          >
            {theme === "light" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : theme === "dark" ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Laptop className="w-4 h-4 text-stone-500" />
            )}
          </button>

          {/* System status / config modal button */}
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95"
            title="查看连接与鉴权配置"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors active:scale-95"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div
          className={`fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-medium flex items-center justify-between sm:justify-start gap-2 animate-in slide-in-from-bottom-5 duration-200 ${
            toastMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
              : toastMsg.type === "error"
              ? "bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800"
              : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {toastMsg.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : toastMsg.type === "error" ? (
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            )}
            <span className="truncate">{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Article List */}
        <aside
          className={`w-full md:w-80 lg:w-96 shrink-0 h-[calc(100dvh-3.5rem)] ${
            mobileView === "sidebar" ? "block" : "hidden md:block"
          }`}
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
        </aside>

        {/* Right Content: Editor & Preview */}
        <main
          className={`flex-1 h-[calc(100dvh-3.5rem)] overflow-y-auto bg-stone-50/50 dark:bg-stone-950/50 p-3 sm:p-5 md:p-6 lg:p-8 pb-safe ${
            mobileView === "editor" ? "block" : "hidden md:block"
          }`}
        >
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Editor Action Bar / Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {isNewArticle ? "撰写新说说" : "编辑说说"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
                  {autoSaveStatus}
                </span>
              </div>

              {/* View Mode Toggle: Edit <-> Preview */}
              <div className="flex items-center gap-1.5">
                <div className="flex p-0.5 rounded-xl bg-stone-200/60 dark:bg-stone-800/80 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      activeTab === "edit"
                        ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs"
                        : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                    }`}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      activeTab === "preview"
                        ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs"
                        : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    前台预览
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Mode */}
            {activeTab === "edit" ? (
              <div className="space-y-5 sm:space-y-6 bg-white dark:bg-stone-900 p-4 sm:p-6 md:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm relative">
                {/* Meta details row: Time & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                </div>

                {/* Content Textarea with word count & Undo/Redo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      正文内容 (支持多行与换行)
                    </label>
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleUndo}
                          disabled={historyIndex <= 0}
                          className="p-1.5 sm:p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 active:scale-95"
                          title="撤回 (Undo)"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRedo}
                          disabled={historyIndex >= historyStack.length - 1}
                          className="p-1.5 sm:p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 active:scale-95"
                          title="重做 (Redo)"
                        >
                          <Redo2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono">
                        {currentArticle.content.length} 字
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={currentArticle.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="分享此刻的所思所想..."
                    rows={6}
                    className="w-full text-sm leading-relaxed p-3.5 sm:p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-y min-h-[140px]"
                  />
                </div>

                {/* 9-Grid Media Manager */}
                <div className="pt-1 sm:pt-2">
                  <NineGridMedia
                    media={currentArticle.media}
                    onChange={(newMedia) =>
                      updateArticle((prev) => ({ ...prev, media: newMedia }))
                    }
                  />
                </div>

                {/* Tags Manager */}
                <div className="pt-1 sm:pt-2">
                  <TagManager
                    tags={currentArticle.tags}
                    onChange={(newTags) =>
                      updateArticle((prev) => ({ ...prev, tags: newTags }))
                    }
                    availableTags={availableTags}
                  />
                </div>

                {/* Music Editor */}
                <div className="pt-1 sm:pt-2">
                  <MusicEditor
                    music={currentArticle.music}
                    onChange={(newMusic) =>
                      updateArticle((prev) => ({ ...prev, music: newMusic }))
                    }
                  />
                </div>

                {/* Commit message custom input */}
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80">
                  <label className="block text-xs text-stone-500 dark:text-stone-400 mb-1">
                    自定义发布备注 / 变更说明 (留空将使用默认)
                  </label>
                  <input
                    type="text"
                    value={commitMessageInput}
                    onChange={(e) => setCommitMessageInput(e.target.value)}
                    placeholder={
                      isNewArticle
                        ? "发表新说说"
                        : "更新说说内容"
                    }
                    className="w-full text-sm sm:text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Action Buttons Bar - sticky at bottom on mobile */}
                <div className="sticky bottom-0 z-20 -mx-4 -mb-4 sm:mx-0 sm:mb-0 p-3 sm:p-0 bg-white/95 dark:bg-stone-900/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2.5 sm:gap-3 rounded-b-2xl shadow-lg sm:shadow-none pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRevertChanges}
                      className="px-3 sm:px-3.5 py-2.5 sm:py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>放弃草稿更改</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 w-auto">
                    <button
                      type="button"
                      onClick={() => handlePublish()}
                      disabled={isPublishing}
                      className="px-4 sm:px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{isPublishing ? "正在发布..." : "发布到数据库"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Live Preview Mode */
              <div className="space-y-6">
                <MomentPreview article={currentArticle} />

                {/* Quick publish bar under preview */}
                <div className="sticky bottom-0 z-20 flex justify-end gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className="px-3.5 sm:px-4 py-2.5 sm:py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl active:scale-95 transition-all"
                  >
                    返回编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePublish()}
                    disabled={isPublishing}
                    className="px-4 sm:px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isPublishing ? "正在发布..." : "直接发布此版本"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

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
        userEmail={serverData?.user?.email}
      />
    </div>
  );
}
export default App;
