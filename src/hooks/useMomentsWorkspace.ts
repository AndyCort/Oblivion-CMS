import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Article, ArticleDraft, ArticleMusic } from "../types/article";
import {
  deleteMoment,
  fetchMoments,
  saveMoment,
  type FetchMomentsResponse,
} from "../lib/api/client";
import { deleteDraft, getAllDrafts, saveDraft } from "../lib/storage/draftStore";
import type { CmsSettings } from "../lib/settings/cmsSettings";
import { useDraftQueue } from "./useDraftQueue";

interface UseMomentsWorkspaceOptions {
  enabled: boolean;
  settings: CmsSettings;
  showToast: (type: "success" | "error" | "info", text: string) => void;
  onAuthExpired: () => void;
  onAfterNavigate?: () => void;
}

function createEmptyMoment(settings: CmsSettings): Article {
  return {
    time: Date.now(),
    content: "",
    media: [],
    tags: [...settings.defaultMomentTags],
    location: settings.defaultMomentLocation,
  };
}

function findLegacyDraftId(map: Map<string, ArticleDraft>, time: number): string | null {
  if (map.has(String(time))) return String(time);
  const legacyPrefix = `${time}-`;
  for (const key of map.keys()) {
    if (key.startsWith(legacyPrefix)) return key;
  }
  return null;
}

export function useMomentsWorkspace({
  enabled,
  settings,
  showToast,
  onAuthExpired,
  onAfterNavigate,
}: UseMomentsWorkspaceOptions) {
  const [serverData, setServerData] = useState<FetchMomentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [draftsMap, setDraftsMap] = useState<Map<string, ArticleDraft>>(new Map());

  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(true);
  const [currentArticle, setCurrentArticle] = useState<Article>(() =>
    createEmptyMoment(settings),
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("尚未修改");
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadedOnceRef = useRef(false);
  const selectionRef = useRef({ isNew: true, selectedTime: null as number | null });
  selectionRef.current = { isNew: isNewArticle, selectedTime };

  const draftQueue = useDraftQueue<ArticleDraft>({
    delayMs: 700,
    persist: async (draft) => {
      await saveDraft(draft);
      setDraftsMap((prev) => new Map(prev).set(draft.id, draft));
      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setAutoSaveStatus(`已存 ${timeStr}`);
    },
    onError: () => setAutoSaveStatus("保存失败"),
  });

  const removeDraftKey = useCallback(async (id: string) => {
    await deleteDraft(id);
    if (id === "new") await deleteDraft("new-draft");
    setDraftsMap((prev) => {
      const next = new Map(prev);
      next.delete(id);
      if (id === "new") next.delete("new-draft");
      return next;
    });
  }, []);

  const refreshDrafts = useCallback(async () => {
    try {
      const rows = await getAllDrafts();
      setDraftsMap(new Map(rows.map((d) => [d.id, d])));
    } catch {
      /* indexedDB unavailable */
    }
  }, []);

  const loadMoments = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [remote, localDrafts] = await Promise.all([
        fetchMoments(),
        getAllDrafts().catch(() => [] as ArticleDraft[]),
      ]);
      setServerData(remote);
      const dMap = new Map(localDrafts.map((d) => [d.id, d]));
      setDraftsMap(dMap);

      const { isNew, selectedTime: currentSelected } = selectionRef.current;
      if (remote.moments.length > 0 && currentSelected === null && isNew) {
        const first = remote.moments[0];
        const draftKey = findLegacyDraftId(dMap, first.time);
        const existingDraft = draftKey ? dMap.get(draftKey) : undefined;
        setSelectedTime(first.time);
        setIsNewArticle(false);
        setCurrentArticle(existingDraft ? existingDraft.article : first);
        setAutoSaveStatus(existingDraft ? "已恢复本地草稿" : "尚未修改");
      }
    } catch (err: any) {
      loadedOnceRef.current = false;
      if (err?.isAuthError) {
        onAuthExpired();
      } else {
        setErrorMsg(err?.message || "加载数据失败");
      }
    } finally {
      setIsLoading(false);
    }
  }, [onAuthExpired]);

  useEffect(() => {
    if (enabled && !loadedOnceRef.current) {
      loadedOnceRef.current = true;
      void loadMoments();
    }
  }, [enabled, loadMoments]);

  const updateArticle = useCallback(
    (updater: (prev: Article) => Article) => {
      setCurrentArticle((prev) => {
        const next = updater(prev);
        const draftId = isNewArticle
          ? "new"
          : selectedTime !== null
            ? String(selectedTime)
            : "new";
        setAutoSaveStatus("保存中…");
        draftQueue.schedule({
          id: draftId,
          article: next,
          updatedAt: Date.now(),
          isNew: isNewArticle,
        });
        return next;
      });
    },
    [draftQueue, isNewArticle, selectedTime],
  );

  const updateMusicField = useCallback(
    (field: "title" | "artist" | "url", value: string) => {
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
    },
    [updateArticle],
  );

  const setMusic = useCallback(
    (music: ArticleMusic | undefined) => {
      updateArticle((prev) => {
        if (!music) return { ...prev, music: undefined };
        const normalized: ArticleMusic = {
          title: music.title.trim(),
          artist: music.artist.trim(),
          url: music.url.trim(),
        };
        const hasAny = normalized.title || normalized.artist || normalized.url;
        return { ...prev, music: hasAny ? normalized : undefined };
      });
    },
    [updateArticle],
  );

  const saveDraftImmediately = useCallback(async () => {
    try {
      await draftQueue.flush();
      showToast("success", "当前说说草稿已立即保存");
    } catch {
      showToast("error", "保存草稿失败");
    }
  }, [draftQueue, showToast]);

  const handleSelectArticle = useCallback(
    async (time: number) => {
      try {
        await draftQueue.flush();
      } catch {
        showToast("error", "保存当前草稿失败，请重试");
        return;
      }
      setSelectedTime(time);
      setIsNewArticle(false);
      onAfterNavigate?.();

      const draftKey = findLegacyDraftId(draftsMap, time);
      const draft = draftKey ? draftsMap.get(draftKey) : undefined;
      if (draft) {
        setCurrentArticle(draft.article);
        setAutoSaveStatus("已恢复本地草稿");
        return;
      }
      const target = serverData?.moments.find((m) => m.time === time);
      if (target) {
        setCurrentArticle(target);
        setAutoSaveStatus("尚未修改");
      }
    },
    [draftQueue, draftsMap, onAfterNavigate, serverData, showToast],
  );

  const handleNewArticle = useCallback(async () => {
    try {
      await draftQueue.flush();
    } catch {
      showToast("error", "保存当前草稿失败，请重试");
      return;
    }
    setIsNewArticle(true);
    setSelectedTime(null);
    onAfterNavigate?.();

    const newDraft = draftsMap.get("new") ?? draftsMap.get("new-draft");
    if (newDraft) {
      setCurrentArticle(newDraft.article);
      setAutoSaveStatus("已恢复本地草稿");
    } else {
      setCurrentArticle(createEmptyMoment(settings));
      setAutoSaveStatus("尚未修改");
    }
  }, [draftQueue, draftsMap, onAfterNavigate, settings, showToast]);

  const handleCloneArticle = useCallback(
    async (source: Article) => {
      try {
        await draftQueue.flush();
      } catch {
        showToast("error", "保存当前草稿失败，请重试");
        return;
      }
      setIsNewArticle(true);
      setSelectedTime(null);
      onAfterNavigate?.();

      const cloned: Article = {
        ...structuredClone(source),
        time: Date.now(),
      };
      setCurrentArticle(cloned);
      setAutoSaveStatus("保存中…");
      draftQueue.schedule({
        id: "new",
        article: cloned,
        updatedAt: Date.now(),
        isNew: true,
      });
      showToast("info", "已基于该说说创建新副本");
    },
    [draftQueue, onAfterNavigate, showToast],
  );

  const handleRevertChanges = useCallback(async () => {
    draftQueue.cancel();
    await draftQueue.flush().catch(() => {});
    if (isNewArticle) {
      await removeDraftKey("new");
      setCurrentArticle(createEmptyMoment(settings));
      setAutoSaveStatus("尚未修改");
      showToast("info", "已清空新说说草稿");
    } else if (selectedTime !== null) {
      const legacyKey = findLegacyDraftId(draftsMap, selectedTime);
      await removeDraftKey(String(selectedTime));
      if (legacyKey && legacyKey !== String(selectedTime)) {
        await removeDraftKey(legacyKey);
      }
      const serverVersion = serverData?.moments.find(
        (m) => m.time === selectedTime,
      );
      if (serverVersion) {
        setCurrentArticle(serverVersion);
        setAutoSaveStatus("尚未修改");
        showToast("info", "已恢复远程版本");
      }
    }
  }, [
    draftQueue,
    draftsMap,
    isNewArticle,
    removeDraftKey,
    selectedTime,
    serverData,
    settings,
    showToast,
  ]);

  const handlePublish = useCallback(async () => {
    if (!serverData) return;
    if (!currentArticle.content.trim() && currentArticle.media.length === 0) {
      showToast("error", "请填写正文或添加媒体后再发布");
      return;
    }
    if (
      settings.confirmBeforePublish &&
      typeof window !== "undefined" &&
      !window.confirm("确认将当前说说发布到数据库？")
    ) {
      return;
    }

    setIsPublishing(true);
    const originalTime = isNewArticle ? undefined : selectedTime ?? undefined;
    const draftId = isNewArticle
      ? "new"
      : selectedTime !== null
        ? String(selectedTime)
        : "new";

    try {
      await draftQueue.flush();
      await saveMoment(currentArticle, originalTime);
      draftQueue.cancel();
      await removeDraftKey(draftId);
      if (originalTime !== undefined) {
        const legacyKey = findLegacyDraftId(draftsMap, originalTime);
        if (legacyKey && legacyKey !== draftId) {
          await removeDraftKey(legacyKey);
        }
      }

      setSelectedTime(currentArticle.time);
      setIsNewArticle(false);
      setAutoSaveStatus("已发布");
      showToast("success", "说说发布成功");
      await loadMoments();
    } catch (err: any) {
      showToast("error", `发布失败: ${err?.message || "未知错误"}`);
    } finally {
      setIsPublishing(false);
    }
  }, [
    currentArticle,
    draftQueue,
    draftsMap,
    isNewArticle,
    loadMoments,
    removeDraftKey,
    selectedTime,
    serverData,
    settings.confirmBeforePublish,
    showToast,
  ]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget || !serverData) return;
    setIsDeleting(true);
    try {
      draftQueue.cancel();
      await draftQueue.flush().catch(() => {});
      await deleteMoment(deleteTarget.time);
      await removeDraftKey(String(deleteTarget.time));
      const legacyKey = findLegacyDraftId(draftsMap, deleteTarget.time);
      if (legacyKey) await removeDraftKey(legacyKey);

      const wasSelected = selectedTime === deleteTarget.time;
      setDeleteTarget(null);
      showToast("success", "说说已从数据库删除");
      if (wasSelected) {
        setSelectedTime(null);
        setIsNewArticle(true);
        setCurrentArticle(createEmptyMoment(settings));
      }
      await loadMoments();
    } catch (err: any) {
      showToast("error", `删除失败: ${err?.message || "未知错误"}`);
    } finally {
      setIsDeleting(false);
    }
  }, [
    deleteTarget,
    draftQueue,
    draftsMap,
    loadMoments,
    removeDraftKey,
    selectedTime,
    serverData,
    settings,
    showToast,
  ]);

  const availableTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of serverData?.moments || []) {
      for (const t of a.tags || []) {
        map.set(t, (map.get(t) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [serverData]);

  const historicalLocations = useMemo(() => {
    const set = new Set<string>();
    for (const a of serverData?.moments || []) {
      if (a.location) set.add(a.location);
    }
    return Array.from(set);
  }, [serverData]);

  const isDirty = useMemo(() => {
    if (isNewArticle) {
      return (
        draftsMap.has("new") ||
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
    if (selectedTime === null) return false;
    if (findLegacyDraftId(draftsMap, selectedTime)) return true;
    const serverArticle = serverData?.moments.find((m) => m.time === selectedTime);
    return serverArticle
      ? JSON.stringify(currentArticle) !== JSON.stringify(serverArticle)
      : false;
  }, [isNewArticle, selectedTime, draftsMap, currentArticle, serverData]);

  const resetOnLogout = useCallback(() => {
    draftQueue.cancel();
    loadedOnceRef.current = false;
    setServerData(null);
    setSelectedTime(null);
    setIsNewArticle(true);
    setCurrentArticle(createEmptyMoment(settings));
  }, [draftQueue, settings]);

  return {
    serverData,
    isLoading,
    errorMsg,
    draftsMap,
    selectedTime,
    isNewArticle,
    currentArticle,
    isPublishing,
    autoSaveStatus,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    availableTags,
    historicalLocations,
    isDirty,
    loadMoments,
    refreshDrafts,
    resetOnLogout,
    saveDraftImmediately,
    updateArticle,
    updateMusicField,
    setMusic,
    handleSelectArticle,
    handleNewArticle,
    handleCloneArticle,
    handleRevertChanges,
    handlePublish,
    handleConfirmDelete,
  };
}
