import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { Article, ArticleDraft } from "../../types/article";
import { generateArticleFingerprint } from "../../types/article";
import {
  fetchArticles,
  publishArticleToServer,
  type FetchArticlesResponse,
} from "../api/client";
import { saveDraft, getAllDrafts, deleteDraft } from "../storage/draftStore";
import { parseTagList } from "../../styles/workspace";
import type { CmsSettings } from "../settings/cmsSettings";

interface UseMomentsWorkspaceOptions {
  settings: CmsSettings;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  onAuthExpired: () => void;
  onAfterNavigate?: () => void;
}

const EMPTY_ARTICLE: Article = {
  time: Date.now(),
  content: "",
  media: [],
  tags: [],
  location: "",
};

export function useMomentsWorkspace({
  settings,
  showToast,
  onAuthExpired,
  onAfterNavigate,
}: UseMomentsWorkspaceOptions) {
  const [serverData, setServerData] = useState<FetchArticlesResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [draftsMap, setDraftsMap] = useState<Map<string, ArticleDraft>>(
    new Map(),
  );

  const [selectedFingerprint, setSelectedFingerprint] = useState<string | null>(
    null,
  );
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article>(EMPTY_ARTICLE);
  const [tagsInput, setTagsInput] = useState("");

  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("已保存");
  const [commitMessageInput, setCommitMessageInput] = useState("");

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

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (parseTagList(tagsInput).join(",") !== currentArticle.tags.join(",")) {
      setTagsInput(currentArticle.tags.join(", "));
    }
  }, [currentArticle.tags]);

  const removeDraftFromState = useCallback((id: string) => {
    setDraftsMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const setActiveArticle = useCallback((article: Article) => {
    setCurrentArticle(article);
    setHistoryStack([article.content]);
    setHistoryIndex(0);
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [remote, localDrafts] = await Promise.all([
        fetchArticles(),
        getAllDrafts(),
      ]);

      setServerData(remote);
      const dMap = new Map(localDrafts.map((d) => [d.id, d]));
      setDraftsMap(dMap);

      if (remote.articles.length > 0 && !selectedFingerprint && !isNewArticle) {
        const first = remote.articles[0];
        const fp = generateArticleFingerprint(first);
        setSelectedFingerprint(fp);

        const existingDraft = dMap.get(fp);
        if (existingDraft) {
          setActiveArticle(existingDraft.article);
          if (settings.notifyOnDraftRestore) {
            showToast("info", "已自动恢复该文章的本地未发布草稿");
          }
        } else {
          setActiveArticle(first);
        }
      }
    } catch (err: any) {
      if (err.isAuthError) {
        onAuthExpired();
      } else {
        setErrorMsg(err.message || "加载数据失败");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    isNewArticle,
    onAuthExpired,
    selectedFingerprint,
    setActiveArticle,
    settings.notifyOnDraftRestore,
    showToast,
  ]);

  const persistDraftNow = async (updated: Article) => {
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
      setDraftsMap((prev) => new Map(prev).set(draftId, draft));

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setAutoSaveStatus(`已存 ${timeStr}`);
    } catch {
      setAutoSaveStatus("保存失败");
    }
  };

  const triggerAutoSave = (updated: Article) => {
    setAutoSaveStatus("保存中…");
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      void persistDraftNow(updated);
    }, settings.autoSaveDelayMs);
  };

  const saveDraftImmediately = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    void persistDraftNow(currentArticle).then(() =>
      showToast("success", "当前说说草稿已立即保存"),
    );
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
      return { ...prev, music: hasAny ? merged : undefined };
    });
  };

  const handleContentChange = (newContent: string) => {
    updateArticle((prev) => ({ ...prev, content: newContent }));
    setHistoryStack((prev) => [...prev.slice(0, historyIndex + 1), newContent]);
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

  const handleSelectArticle = (fp: string | null) => {
    if (!fp) return;
    setSelectedFingerprint(fp);
    setIsNewArticle(false);
    onAfterNavigate?.();

    const draft = draftsMap.get(fp);
    if (draft) {
      setActiveArticle(draft.article);
      if (settings.notifyOnDraftRestore) {
        showToast("info", "已载入本地未发布草稿");
      }
    } else {
      const target = serverData?.articles.find(
        (a) => generateArticleFingerprint(a) === fp,
      );
      if (target) setActiveArticle(target);
    }
  };

  const handleNewArticle = () => {
    setIsNewArticle(true);
    setSelectedFingerprint(null);
    onAfterNavigate?.();

    const newDraft = draftsMap.get("new-draft");
    if (newDraft) {
      setActiveArticle(newDraft.article);
      if (settings.notifyOnDraftRestore) {
        showToast("info", "已恢复之前的未发布新建草稿");
      }
    } else {
      setActiveArticle({
        time: Date.now(),
        content: "",
        media: [],
        tags: [...settings.defaultMomentTags],
        location: settings.defaultMomentLocation,
      });
    }
  };

  const handleCloneArticle = (source: Article) => {
    setIsNewArticle(true);
    setSelectedFingerprint(null);
    onAfterNavigate?.();

    const suffix =
      settings.cloneAppendSuffix && settings.cloneSuffixText
        ? `\n${settings.cloneSuffixText}`
        : "";
    const cloned: Article = {
      ...source,
      time: Date.now(),
      content: source.content ? `${source.content}${suffix}` : "",
    };
    setActiveArticle(cloned);
    triggerAutoSave(cloned);
    showToast("info", "已基于该文章创建新副本，可继续编辑");
  };

  const handleRevertChanges = async () => {
    if (isNewArticle) {
      await deleteDraft("new-draft");
      removeDraftFromState("new-draft");
      handleNewArticle();
      showToast("info", "已清空新文章草稿");
    } else if (selectedFingerprint) {
      await deleteDraft(selectedFingerprint);
      removeDraftFromState(selectedFingerprint);

      const serverVersion = serverData?.articles.find(
        (a) => generateArticleFingerprint(a) === selectedFingerprint,
      );
      if (serverVersion) {
        setActiveArticle(serverVersion);
        showToast("info", "已恢复至远程权威版本，本地草稿已清理");
      }
    }
  };

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
      removeDraftFromState(draftId);

      showToast(
        "success",
        isForce
          ? `强制覆盖发布成功！${res.commitMessage}`
          : `发布成功！${res.commitMessage}`,
      );
      if (settings.clearCommitAfterPublish) setCommitMessageInput("");

      setSelectedFingerprint(generateArticleFingerprint(currentArticle));
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
      removeDraftFromState(deleteModalArticle.fp);

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

  const handleDeleteDraftById = async (id: string) => {
    await deleteDraft(id);
    removeDraftFromState(id);
    showToast("info", "已删除一条说说草稿");
  };

  const handleClearAllDrafts = async () => {
    for (const id of draftsMap.keys()) {
      await deleteDraft(id);
    }
    setDraftsMap(new Map());
    showToast("info", "已清空所有本地说说草稿");
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

  return {
    serverData,
    setServerData,
    isLoading,
    errorMsg,
    draftsMap,
    selectedFingerprint,
    isNewArticle,
    currentArticle,
    tagsInput,
    setTagsInput,
    historyStack,
    historyIndex,
    isPublishing,
    autoSaveStatus,
    commitMessageInput,
    setCommitMessageInput,
    deleteModalArticle,
    setDeleteModalArticle,
    isDeleting,
    conflictModalData,
    setConflictModalData,
    availableTags,
    historicalLocations,
    isMomentsDirty,
    loadInitialData,
    saveDraftImmediately,
    updateArticle,
    updateMusicField,
    handleContentChange,
    handleUndo,
    handleRedo,
    handleSelectArticle,
    handleNewArticle,
    handleCloneArticle,
    handleRevertChanges,
    handlePublish,
    handleConfirmDelete,
    handleDeleteDraftById,
    handleClearAllDrafts,
  };
}
