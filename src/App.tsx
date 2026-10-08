import React, { useState, useEffect, useMemo, useRef } from "react";
import type {
  Article,
  ArticleDraft,
} from "./types/article";
import { generateArticleFingerprint } from "./types/article";
import {
  fetchArticles,
  publishArticleToServer,
} from "./lib/api/client";
import type { FetchArticlesResponse } from "./lib/api/client";
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
} from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export function App() {
  // Server state
  const [serverData, setServerData] = useState<FetchArticlesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

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
      setErrorMsg(err.message || "加载数据失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

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

  // Publish to GitHub
  const handlePublish = async () => {
    if (!serverData) return;
    setIsPublishing(true);

    const action = isNewArticle ? "create" : "update";
    const draftId = isNewArticle ? "new-draft" : (selectedFingerprint || "new-draft");

    try {
      const res = await publishArticleToServer({
        action,
        article: currentArticle,
        targetFingerprint: isNewArticle ? undefined : (selectedFingerprint || undefined),
        baseSha: serverData.sha,
        commitMessage: commitMessageInput.trim() || undefined,
      });

      // Clear draft on successful publish
      await deleteDraft(draftId);
      setDraftsMap((prev) => {
        const next = new Map(prev);
        next.delete(draftId);
        return next;
      });

      showToast("success", `发布成功！Commit: ${res.commitMessage}`);
      setCommitMessageInput("");

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

      showToast("success", "文章已成功删除并同步至 GitHub");
      setDeleteModalArticle(null);

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

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile view toggle */}
          <button
            type="button"
            onClick={() => setMobileView(mobileView === "sidebar" ? "editor" : "sidebar")}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {mobileView === "editor" ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

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
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          {/* GitHub Data status badge */}
          {serverData && (
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>{serverData.owner}/{serverData.repo}</span>
              <span className="text-stone-400">({serverData.branch})</span>
              {serverData.isMock && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-sans">
                  模拟模式
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 text-xs">
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

          {/* System status / config modal button */}
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            title="查看连接与鉴权配置"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200 ${
            toastMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
              : toastMsg.type === "error"
              ? "bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800"
              : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : toastMsg.type === "error" ? (
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-500" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Article List */}
        <aside
          className={`w-full md:w-80 lg:w-96 shrink-0 h-[calc(100vh-3.5rem)] ${
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
          className={`flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto bg-stone-50/50 dark:bg-stone-950/50 p-4 md:p-6 lg:p-8 ${
            mobileView === "editor" ? "block" : "hidden md:block"
          }`}
        >
          <div className="max-w-3xl mx-auto space-y-6">
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
              <div className="space-y-6 bg-white dark:bg-stone-900 p-5 md:p-7 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                {/* Meta details row: Time & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30"
                          title="撤回 (Undo)"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRedo}
                          disabled={historyIndex >= historyStack.length - 1}
                          className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30"
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
                    className="w-full text-sm leading-relaxed p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-y"
                  />
                </div>

                {/* 9-Grid Media Manager */}
                <div className="pt-2">
                  <NineGridMedia
                    media={currentArticle.media}
                    onChange={(newMedia) =>
                      updateArticle((prev) => ({ ...prev, media: newMedia }))
                    }
                  />
                </div>

                {/* Tags Manager */}
                <div className="pt-2">
                  <TagManager
                    tags={currentArticle.tags}
                    onChange={(newTags) =>
                      updateArticle((prev) => ({ ...prev, tags: newTags }))
                    }
                    availableTags={availableTags}
                  />
                </div>

                {/* Music Editor */}
                <div className="pt-2">
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
                    自定义 Git Commit 信息 (留空将使用默认)
                  </label>
                  <input
                    type="text"
                    value={commitMessageInput}
                    onChange={(e) => setCommitMessageInput(e.target.value)}
                    placeholder={
                      isNewArticle
                        ? "content: add article"
                        : "content: update article"
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Action Buttons Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRevertChanges}
                      className="px-3.5 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      放弃草稿更改
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {isPublishing ? "正在提交 GitHub..." : "发布到 GitHub"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Live Preview Mode */
              <div className="space-y-6">
                <MomentPreview article={currentArticle} />

                {/* Quick publish bar under preview */}
                <div className="flex justify-end gap-3 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
                  >
                    返回编辑
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {isPublishing ? "正在发布..." : "直接发布此版本"}
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
        onReloadRemote={() => {
          setConflictModalData({ isOpen: false });
          loadInitialData();
        }}
        localArticle={currentArticle}
        remoteSha={conflictModalData.remoteSha}
        clientBaseSha={conflictModalData.clientBaseSha}
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
