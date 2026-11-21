import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { matchesPost, postTagCounts } from "../lib/postsList";
import {
  deletePost,
  fetchPost,
  fetchPosts,
  publishPost,
  type PostList,
} from "../lib/api/posts";
import {
  deletePostDraft,
  getPostDrafts,
  savePostDraft,
} from "../lib/storage/draftStore";
import { emptyPost, type BlogPost, type PostDraft } from "../types/post";
import type { CmsSettings, EditorViewMode } from "../lib/settings/cmsSettings";
import { slugFromTitle } from "../lib/utils";
import { useDraftQueue } from "./useDraftQueue";

interface UsePostsWorkspaceOptions {
  settings: CmsSettings;
  onToast?: (type: "success" | "error" | "info", text: string) => void;
  onAfterNavigate?: () => void;
}

export function usePostsWorkspace({
  settings,
  onToast,
  onAfterNavigate,
}: UsePostsWorkspaceOptions) {
  const createDefaultPost = useCallback((): BlogPost => {
    const fresh = emptyPost();
    return settings.defaultPostAuthor
      ? { ...fresh, author: settings.defaultPostAuthor }
      : fresh;
  }, [settings.defaultPostAuthor]);

  const [result, setResult] = useState<PostList>();
  const [query, setQuery] = useState("");
  const [filterDraftOnly, setFilterDraftOnly] = useState(false);
  const [coverOnly, setCoverOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    settings.defaultSortOrder,
  );
  const search = useDeferredValue(query);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [editor, setEditor] = useState<PostDraft>(() => {
    const p = createDefaultPost();
    return { id: crypto.randomUUID(), post: p, baseline: p, updatedAt: 0 };
  });

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("尚未修改");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<EditorViewMode>(settings.defaultView);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const currentRef = useRef(editor);
  currentRef.current = editor;

  useEffect(() => {
    setSortOrder(settings.defaultSortOrder);
  }, [settings.defaultSortOrder]);

  useEffect(() => {
    setView(settings.defaultView);
  }, [settings.defaultView]);

  const draftQueue = useDraftQueue<PostDraft>({
    delayMs: 700,
    persist: async (draft) => {
      if (JSON.stringify(draft.post) === JSON.stringify(draft.baseline)) {
        await deletePostDraft(draft.id);
        setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      } else {
        await savePostDraft(draft);
        setDrafts((prev) => [
          draft,
          ...prev.filter((d) => d.id !== draft.id),
        ]);
      }
      if (currentRef.current === draft) {
        setStatus("草稿已保存至本机");
      }
    },
    onError: (err) => {
      setStatus("保存失败");
      setError(err.message);
    },
  });

  const refreshDrafts = useCallback(async () => {
    try {
      setDrafts(await getPostDrafts());
    } catch {
      /* indexedDB unavailable */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getPostDrafts()
      .then((rows) => {
        if (cancelled) return;
        setDrafts(rows);
        const latest = [...rows].sort((a, b) => b.updatedAt - a.updatedAt)[0];
        if (latest) {
          currentRef.current = latest;
          setEditor(latest);
          setStatus("已恢复本地草稿");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(`无法读取本地草稿：${err.message}`);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPosts(page, search, {
      tag: selectedTag || undefined,
      coverOnly,
      sortOrder,
    })
      .then((data) => {
        if (!cancelled) {
          setResult(data);
          if (page > 1 && !data.posts.length) setPage(page - 1);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, revision, selectedTag, coverOnly, sortOrder]);

  const activate = useCallback((next: PostDraft) => {
    currentRef.current = next;
    setEditor(next);
    setStatus(
      JSON.stringify(next.post) !== JSON.stringify(next.baseline)
        ? "已恢复本地草稿"
        : "尚未修改",
    );
    setError("");
    setNotice("");
  }, []);

  const change = useCallback(
    (patch: Partial<BlogPost>) => {
      const next: PostDraft = {
        ...currentRef.current,
        post: { ...currentRef.current.post, ...patch },
        updatedAt: Date.now(),
      };
      currentRef.current = next;
      setEditor(next);
      setStatus("等待保存…");
      draftQueue.schedule(next);
    },
    [draftQueue],
  );

  const switchEditor = useCallback(
    async (id?: string, draft?: PostDraft) => {
      setBusy(true);
      try {
        await draftQueue.flush();
        if (draft) {
          activate(draft);
        } else if (id) {
          const saved =
            currentRef.current.originalId === id
              ? currentRef.current
              : drafts.find((d) => d.originalId === id);
          if (saved) {
            activate(saved);
          } else {
            const p = await fetchPost(id);
            activate({
              id: crypto.randomUUID(),
              post: p,
              baseline: p,
              originalId: id,
              updatedAt: 0,
            });
          }
        } else {
          const p = createDefaultPost();
          activate({
            id: crypto.randomUUID(),
            post: p,
            baseline: p,
            updatedAt: 0,
          });
        }
        onAfterNavigate?.();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [activate, createDefaultPost, draftQueue, drafts, onAfterNavigate],
  );

  const removeDraft = useCallback(async () => {
    if (!window.confirm("清空当前本地草稿并放弃未发布修改？")) return;
    setBusy(true);
    try {
      draftQueue.cancel();
      await draftQueue.flush();
      await deletePostDraft(currentRef.current.id);
      setDrafts((prev) => prev.filter((d) => d.id !== currentRef.current.id));
      const p = currentRef.current.originalId
        ? await fetchPost(currentRef.current.originalId)
        : createDefaultPost();
      activate({ ...currentRef.current, post: p, baseline: p, updatedAt: 0 });
      setStatus("草稿已清空");
      onToast?.("info", "已清空本地草稿并恢复原版本");
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      onToast?.("error", msg);
    } finally {
      setBusy(false);
    }
  }, [activate, createDefaultPost, draftQueue, onToast]);

  const publish = useCallback(async () => {
    const active = currentRef.current;
    if (
      settings.confirmBeforePublish &&
      typeof window !== "undefined" &&
      !window.confirm(
        `确认将「${active.post.title || active.post.id || "当前文章"}」发布写入数据库？`,
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    let published = false;
    try {
      await draftQueue.flush();
      const response = await publishPost(active.post, active.originalId);
      published = true;
      const next: PostDraft = {
        ...active,
        post: response.post,
        baseline: response.post,
        originalId: response.post.id,
        updatedAt: 0,
      };
      currentRef.current = next;
      setEditor(next);
      setRevision((v) => v + 1);
      const msg = "发布成功，Worker 已执行缓存清理流程。";
      setNotice(msg);
      onToast?.("success", msg);
      draftQueue.cancel();
      await deletePostDraft(active.id);
      setDrafts((prev) => prev.filter((d) => d.id !== active.id));
      setStatus("已发布");
    } catch (err) {
      const msg = `${published ? "文章已发布，但本地草稿清理失败：" : ""}${(err as Error).message}`;
      setError(msg);
      onToast?.("error", msg);
    } finally {
      setBusy(false);
    }
  }, [draftQueue, onToast, settings.confirmBeforePublish]);

  const confirmRemove = useCallback(async () => {
    const targetId = currentRef.current.originalId;
    if (!targetId) return;
    setBusy(true);
    setError("");
    try {
      draftQueue.cancel();
      await draftQueue.flush();
      await deletePost(targetId);
      await deletePostDraft(currentRef.current.id);
      setDrafts((prev) => prev.filter((d) => d.id !== currentRef.current.id));
      const p = createDefaultPost();
      activate({ id: crypto.randomUUID(), post: p, baseline: p, updatedAt: 0 });
      setRevision((v) => v + 1);
      setDeleteConfirmOpen(false);
      setNotice("文章已删除");
      onToast?.("success", "博客文章已删除");
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      onToast?.("error", msg);
    } finally {
      setBusy(false);
    }
  }, [activate, createDefaultPost, draftQueue, onToast]);

  const saveNow = useCallback(async () => {
    try {
      await draftQueue.flush();
      onToast?.("success", "当前博客草稿已保存至本机");
    } catch {
      onToast?.("error", "保存草稿失败");
    }
  }, [draftQueue, onToast]);

  const generateSlug = useCallback(async () => {
    const generated = await slugFromTitle(currentRef.current.post.title);
    if (generated) change({ id: generated });
  }, [change]);

  const visibleDrafts = drafts
    .filter((d) =>
      matchesPost(d.post, search, { tag: selectedTag || undefined, coverOnly }),
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.post.date.localeCompare(b.post.date)
        : b.post.date.localeCompare(a.post.date),
    );

  const tags = [
    ...new Set([
      ...(result?.tags || postTagCounts(result?.posts || [])).map((t) => t.tag),
      ...postTagCounts(drafts.map((d) => d.post)).map((t) => t.tag),
    ]),
  ];

  const dirty =
    JSON.stringify(editor.post) !== JSON.stringify(editor.baseline);

  return {
    result,
    query,
    setQuery,
    filterDraftOnly,
    setFilterDraftOnly,
    coverOnly,
    setCoverOnly,
    selectedTag,
    setSelectedTag,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    refreshList: () => setRevision((v) => v + 1),
    drafts,
    editor,
    dirty,
    ready,
    status,
    error,
    setError,
    notice,
    busy,
    loading,
    view,
    setView,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    visibleDrafts,
    visiblePosts: filterDraftOnly ? [] : result?.posts || [],
    tags,
    change,
    switchEditor,
    removeDraft,
    publish,
    confirmRemove,
    saveNow,
    refreshDrafts,
    generateSlug,
  };
}
