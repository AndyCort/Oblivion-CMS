import * as ListUI from "../articles/ArticleListSidebar.styles";
import { matchesPost, postTagCounts } from "../../lib/postsList";
import { useEffect, useRef, useState, useDeferredValue } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { pinyin } from "pinyin-pro";
import {
  Plus,
  UploadCloud,
  Trash2,
  ArrowLeft,
  RefreshCw,
  PenLine,
  Columns2,
  Eye,
  RotateCcw,
  Globe,
  Link2,
  Calendar,
  Pin,
  AlignLeft,
  Hash,
  Image as ImageIcon,
  User,
} from "lucide-react";
import {
  emptyPost,
  countChars,
  textForLanguage,
  displayPostText,
  postLanguages,
  preferredPostLanguage,
  updatePostText,
  addPostLanguage,
  replacePostDateDay,
  type PostTextField,
  type BlogPost,
  type PostDraft,
} from "../../types/post";
import {
  fetchPosts,
  fetchPost,
  publishPost,
  deletePost,
  type PostList,
} from "../../lib/api/posts";
import {
  getPostDrafts,
  savePostDraft,
  deletePostDraft,
} from "../../lib/storage/draftStore";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import { MarkdownPreview } from "./MarkdownPreview";
import { Workspace } from "./PostsWorkspace.styles";
import {
  handleDockWheel,
  isMobileViewport,
  parseTagList,
} from "../../styles/workspace";
import {
  DEFAULT_CMS_SETTINGS,
  resolveEditorFontCss,
  type CmsSettings,
} from "../../lib/settings/cmsSettings";

export function slugFromTitle(title: string) {
  return pinyin(title, {
    toneType: "none",
    type: "array",
    nonZh: "consecutive",
  })
    .join("-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150)
    .replace(/-$/, "");
}

function useTrigger(value: number, effect: () => void) {
  const prev = useRef(value);
  useEffect(() => {
    if (value > 0 && value !== prev.current) {
      prev.current = value;
      effect();
    }
  }, [value]);
}

interface PostsWorkspaceProps {
  listNavigation?: ReactNode;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  newPostTrigger?: number;
  draftSyncRevision?: number;
  saveTrigger?: number;
  publishTrigger?: number;
  settings?: CmsSettings;
  onToast?: (type: "success" | "error" | "info", text: string) => void;
}

export default function PostsWorkspace({
  listNavigation,
  sidebarOpen = true,
  onSidebarOpenChange,
  newPostTrigger = 0,
  draftSyncRevision = 0,
  saveTrigger = 0,
  publishTrigger = 0,
  settings = DEFAULT_CMS_SETTINGS,
  onToast,
}: PostsWorkspaceProps = {}) {
  const createDefaultPost = (): BlogPost => {
    const fresh = emptyPost();
    return settings.defaultPostAuthor
      ? { ...fresh, author: settings.defaultPostAuthor }
      : fresh;
  };

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
  const current = useRef(editor);
  const pending = useRef<PostDraft | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const saving = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevSidebarOpen = useRef(sidebarOpen);
  const slugManuallyEdited = useRef(false);

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("尚未修改");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileEditor, setMobileEditor] = useState(false);
  const [view, setView] = useState<"edit" | "split" | "preview">(
    settings.defaultPostsView,
  );
  const [language, setLanguage] = useState(settings.defaultPostLanguage || "zh");
  const [newLanguage, setNewLanguage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLDivElement>(null);

  const post = editor.post;
  const dirty = JSON.stringify(post) !== JSON.stringify(editor.baseline);
  const languages = postLanguages(post);
  const title = textForLanguage(post.title, language);
  const summary = textForLanguage(post.summary, language);
  const content = textForLanguage(post.content, language);
  const chars = countChars(content);

  const languageLabel = (code: string) =>
    ({
      zh: "中文",
      en: "English",
      ja: "日本語",
      "zh-CN": "简体中文",
      "zh-TW": "繁體中文",
    })[code] || code;

  useEffect(() => {
    if (parseTagList(tagsInput).join(",") !== post.tags.join(",")) {
      setTagsInput(post.tags.join(", "));
    }
  }, [post.tags]);

  useEffect(() => {
    setSortOrder(settings.defaultSortOrder);
  }, [settings.defaultSortOrder]);

  useEffect(() => {
    setView(settings.defaultPostsView);
  }, [settings.defaultPostsView]);

  useTrigger(draftSyncRevision, () => {
    void getPostDrafts().then(setDrafts).catch(() => {});
  });

  useTrigger(saveTrigger, () => {
    void flush()
      .then(() => onToast?.("success", "当前博客草稿已保存至本机"))
      .catch(() => {});
  });

  useTrigger(publishTrigger, () => {
    if (!busy && ready) void publish();
  });

  useTrigger(newPostTrigger, () => {
    void switchEditor();
  });

  useEffect(() => {
    if (prevSidebarOpen.current !== sidebarOpen) {
      prevSidebarOpen.current = sidebarOpen;
      setMobileEditor(!sidebarOpen);
    }
  }, [sidebarOpen]);

  function persist(draft: PostDraft): Promise<void> {
    saving.current += 1;
    const operation = queue.current
      .catch(() => {})
      .then(async () => {
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
        if (current.current === draft) setStatus("草稿已保存至本机");
      })
      .finally(() => {
        saving.current -= 1;
      });
    queue.current = operation;
    return operation;
  }

  async function flush() {
    clearTimeout(timer.current);
    const draft = pending.current;
    pending.current = null;
    try {
      if (draft) await persist(draft);
      else await queue.current;
    } catch (err) {
      if (draft && !pending.current && current.current === draft)
        pending.current = draft;
      setStatus("保存失败，请重试");
      throw err;
    }
  }

  useEffect(() => {
    let cancelled = false;
    getPostDrafts()
      .then((rows) => {
        if (cancelled) return;
        setDrafts(rows);
        const latest = rows.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        if (latest) {
          setLanguage(preferredPostLanguage(latest.post));
          current.current = latest;
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
    const save = () => {
      if (pending.current) void flush().catch(() => {});
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (pending.current || saving.current > 0) {
        save();
        e.preventDefault();
      }
    };
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("visibilitychange", visibility);
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

  function change(patch: Partial<BlogPost>) {
    const next = {
      ...current.current,
      post: { ...current.current.post, ...patch },
      updatedAt: Date.now(),
    };
    current.current = next;
    setEditor(next);
    pending.current = next;
    setStatus("等待保存…");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void flush().catch((err) => {
        pending.current = next;
        setStatus("保存失败");
        setError(err.message);
      });
    }, settings.autoSaveDelayMs);
  }

  function activate(next: PostDraft) {
    const existingLangs = postLanguages(next.post);
    setLanguage(
      existingLangs.length
        ? preferredPostLanguage(next.post)
        : settings.defaultPostLanguage || "zh",
    );
    slugManuallyEdited.current = false;
    current.current = next;
    setEditor(next);
    setMobileEditor(true);
    setStatus(
      JSON.stringify(next.post) !== JSON.stringify(next.baseline)
        ? "已恢复本地草稿"
        : "尚未修改",
    );
    setError("");
    setNotice("");
  }

  function editText(field: PostTextField, value: string) {
    const patch: Partial<BlogPost> = {
      [field]: updatePostText(current.current.post[field], language, value),
    };
    if (
      field === "title" &&
      settings.autoGenerateSlug &&
      !current.current.originalId &&
      !slugManuallyEdited.current
    ) {
      patch.id = slugFromTitle(value);
    }
    change(patch);
  }

  function addLanguage(requested = newLanguage) {
    const code = requested.trim();
    try {
      change(addPostLanguage(current.current.post, code, language));
      setLanguage(code);
      setNewLanguage("");
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function switchEditor(id?: string, draft?: PostDraft) {
    setBusy(true);
    try {
      await flush();
      if (draft) activate(draft);
      else if (id) {
        const saved =
          current.current.originalId === id
            ? current.current
            : drafts.find((d) => d.originalId === id);
        if (saved) activate(saved);
        else {
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
      if (isMobileViewport() && settings.autoCloseSidebarOnMobile) {
        prevSidebarOpen.current = false;
        onSidebarOpenChange?.(false);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function removeDraft() {
    if (!window.confirm("清空当前本地草稿并放弃未发布修改？")) return;
    setBusy(true);
    try {
      await flush();
      await deletePostDraft(editor.id);
      setDrafts((prev) => prev.filter((d) => d.id !== editor.id));
      const p = editor.originalId
        ? await fetchPost(editor.originalId)
        : emptyPost();
      activate({ ...editor, post: p, baseline: p, updatedAt: 0 });
      setStatus("草稿已清空");
      onToast?.("info", "已清空本地草稿并恢复原版本");
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      onToast?.("error", msg);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (
      settings.confirmBeforePublish &&
      typeof window !== "undefined" &&
      !window.confirm(`确认将「${displayPostText(post.title) || post.id || "当前文章"}」发布写入数据库？`)
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    let published = false;
    try {
      await flush();
      const response = await publishPost(post, editor.originalId);
      published = true;
      const next = {
        ...editor,
        post: response.post,
        baseline: response.post,
        originalId: response.post.id,
        updatedAt: 0,
      };
      current.current = next;
      setEditor(next);
      setRevision((v) => v + 1);
      const msg =
        response.mode === "worker"
          ? "发布成功，Worker 已执行缓存清理流程。"
          : response.mode === "mock"
            ? "已发布到本地临时内存（未上线）。"
            : "已写入 D1，边缘缓存可能仍需等待过期。";
      setNotice(msg);
      onToast?.("success", msg);
      await deletePostDraft(editor.id);
      setDrafts((prev) => prev.filter((d) => d.id !== editor.id));
      setStatus("已发布");
    } catch (err) {
      const msg = `${published ? "文章已发布，但本地草稿清理失败：" : ""}${(err as Error).message}`;
      setError(msg);
      onToast?.("error", msg);
    } finally {
      setBusy(false);
    }
  }

  async function confirmRemove() {
    if (!editor.originalId) return;
    setBusy(true);
    setError("");
    try {
      await flush();
      await deletePost(editor.originalId);
      await deletePostDraft(editor.id);
      setDrafts((prev) => prev.filter((d) => d.id !== editor.id));
      const p = emptyPost();
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
  }

  function shortcut(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!settings.enableShortcuts || e.nativeEvent.isComposing) return;
    const key = e.key.toLowerCase();
    if (
      key !== "tab" &&
      !((e.ctrlKey || e.metaKey) && ["b", "i"].includes(key))
    )
      return;
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const wrap = key === "b" ? "**" : "*";
    const tabUnit = " ".repeat(settings.tabIndentSpaces);
    const selected = content.slice(start, end);
    const insert =
      key === "tab"
        ? tabUnit + selected.replace(/\n/g, `\n${tabUnit}`)
        : wrap + selected + wrap;
    editText("content", content.slice(0, start) + insert + content.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + (key === "tab" ? tabUnit.length : wrap.length),
        start + insert.length - (key === "tab" ? 0 : wrap.length),
      );
    });
  }

  const titleText = displayPostText;
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
  const visiblePosts = filterDraftOnly ? [] : result?.posts || [];
  const activeLanguages = languages.length ? languages : [language];

  return (
    <Workspace className={mobileEditor ? "posts-mobile-editor" : undefined}>
      {/* Unified Top Bar */}
      <header className="posts-top-header">
        <div className="posts-header-left">
          <button
            type="button"
            className="posts-back post-ghost-btn"
            style={onSidebarOpenChange ? { display: "none" } : undefined}
            onClick={() => {
              setMobileEditor(false);
              prevSidebarOpen.current = true;
              onSidebarOpenChange?.(true);
            }}
          >
            <ArrowLeft size={13} />
            列表
          </button>
          {settings.siteIcon && (
            <img
              className="posts-header-icon"
              src={settings.siteIcon}
              alt=""
            />
          )}
          <span className="posts-header-brand">{settings.siteName}</span>
          <span className="posts-mode-pill">
            {editor.originalId ? "博客长文" : "新文章"}
          </span>
          <span className="posts-status-pill" role="status">
            {ready ? status : "恢复草稿中…"} · {chars} 字
          </span>
          {dirty && <span className="posts-dirty-pill">未发布修改</span>}
          {result?.warning && (
            <span
              className="posts-warning-pill"
              role="status"
              title={result.warning}
            >
              {result.warning}
            </span>
          )}
        </div>

        <div className="posts-header-right">
          <div className="post-view-switch" aria-label="编辑器视图">
            {(["edit", "split", "preview"] as const).map((v) => (
              <button
                key={v}
                type="button"
                disabled={busy || !ready}
                aria-pressed={view === v}
                data-active={view === v}
                onClick={() => setView(v)}
              >
                {v === "edit" ? (
                  <PenLine size={12} />
                ) : v === "split" ? (
                  <Columns2 size={12} />
                ) : (
                  <Eye size={12} />
                )}
                {v === "edit" ? "编辑" : v === "split" ? "分屏" : "预览"}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="post-ghost-btn"
            disabled={busy || !ready || !dirty}
            onClick={() => void removeDraft()}
            aria-label="清空本地草稿并放弃更改"
            title="清空本地草稿并放弃更改"
          >
            <RotateCcw size={12} />
            <span className="btn-label">放弃</span>
          </button>

          <button
            type="button"
            className="post-danger-btn"
            disabled={busy || !editor.originalId}
            onClick={() => setDeleteConfirmOpen(true)}
            aria-label="删除文章"
            title="删除文章"
          >
            <Trash2 size={13} />
          </button>

          <button
            type="button"
            disabled={busy || !ready}
            className="post-primary"
            aria-label="发布文章"
            onClick={() => void publish()}
          >
            <UploadCloud size={13} />
            {busy ? "处理中…" : "发布"}
          </button>
        </div>
      </header>

      <div className="posts-body">
        <aside
          className={`posts-sidebar${sidebarOpen ? "" : " collapsed"}${settings.compactList ? " compact" : ""}`}
        >
          {listNavigation && (
            <div className="posts-nav-slot">{listNavigation}</div>
          )}
          <ListUI.SidebarHeader>
            <ListUI.SidebarTitleRow>
              <ListUI.SidebarTitleGroup>
                <ListUI.SidebarTitle>文章列表</ListUI.SidebarTitle>
                <ListUI.CountBadge>
                  {filterDraftOnly ? visibleDrafts.length : (result?.total ?? 0)}
                </ListUI.CountBadge>
              </ListUI.SidebarTitleGroup>
              <ListUI.CreateButton
                type="button"
                aria-label="新建文章"
                disabled={busy || !ready}
                onClick={() => void switchEditor()}
              >
                <Plus size={14} />
                新建文章
              </ListUI.CreateButton>
            </ListUI.SidebarTitleRow>
            <ListUI.SearchBox>
              <ListUI.SearchIcon />
              <ListUI.SearchInput
                aria-label="搜索博客"
                placeholder="搜索标题、摘要、标签…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </ListUI.SearchBox>
            <ListUI.FilterRow>
              <ListUI.FilterChipsScroll>
                <ListUI.FilterChip
                  type="button"
                  aria-pressed={filterDraftOnly}
                  $active={filterDraftOnly}
                  $tone="amber"
                  onClick={() => {
                    setFilterDraftOnly((v) => !v);
                    setPage(1);
                  }}
                >
                  草稿 ({drafts.length})
                </ListUI.FilterChip>
                <ListUI.FilterChip
                  type="button"
                  aria-pressed={coverOnly}
                  $active={coverOnly}
                  $tone="indigo"
                  onClick={() => {
                    setCoverOnly((v) => !v);
                    setPage(1);
                  }}
                >
                  带封面
                </ListUI.FilterChip>
                {selectedTag && (
                  <ListUI.ActiveTagChip
                    type="button"
                    onClick={() => {
                      setSelectedTag(null);
                      setPage(1);
                    }}
                  >
                    #{selectedTag} ×
                  </ListUI.ActiveTagChip>
                )}
              </ListUI.FilterChipsScroll>
              <ListUI.SortButton
                type="button"
                title="切换时间排序"
                onClick={() => {
                  setSortOrder((v) => (v === "desc" ? "asc" : "desc"));
                  setPage(1);
                }}
              >
                <ListUI.ArrowUpDown />
                {sortOrder === "desc" ? "最新优先" : "最早优先"}
              </ListUI.SortButton>
            </ListUI.FilterRow>
            {tags.length > 0 && !selectedTag && (
              <ListUI.FilterChipsScroll>
                {tags.slice(0, 6).map((tag) => (
                  <ListUI.TagChip
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      setPage(1);
                    }}
                  >
                    #{tag}
                  </ListUI.TagChip>
                ))}
              </ListUI.FilterChipsScroll>
            )}
            <div className="posts-list-status">
              <span role="status">{loading ? "加载中…" : "文章库"}</span>
              <button
                type="button"
                aria-label="刷新文章列表"
                onClick={() => setRevision((v) => v + 1)}
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </ListUI.SidebarHeader>

          <div className="posts-list-scroll">
            {visibleDrafts.length > 0 && (
              <details open>
                <summary>本地草稿 · {visibleDrafts.length}</summary>
                {visibleDrafts.map((d) => (
                  <button
                    type="button"
                    disabled={busy || !ready}
                    className={`post-list-card ${editor.id === d.id ? "selected" : ""}`}
                    key={d.id}
                    onClick={() => void switchEditor(undefined, d)}
                  >
                    <strong>{titleText(d.post.title) || "未命名文章"}</strong>
                    <span className="post-tag-pills">
                      {d.post.tags.map((tag) => (
                        <span className="post-tag-pill" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </span>
                    <span className="post-dirty">未发布修改</span>
                  </button>
                ))}
              </details>
            )}
            <div className="posts-list">
              {visiblePosts.map((p) => (
                <button
                  type="button"
                  disabled={busy || !ready}
                  className={`post-list-card ${editor.originalId === p.id ? "selected" : ""}`}
                  key={p.id}
                  onClick={() => void switchEditor(p.id)}
                >
                  <small>
                    {p.pinned ? "置顶 · " : ""}
                    {p.date}
                  </small>
                  <strong>{titleText(p.title)}</strong>
                  <p>{titleText(p.summary)}</p>
                  <span className="post-tag-pills">
                    {p.tags.map((tag) => (
                      <span className="post-tag-pill" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                  {drafts.some((d) => d.originalId === p.id) && (
                    <span className="post-dirty">未发布修改</span>
                  )}
                </button>
              ))}
            </div>
            {!loading && !visiblePosts.length && !visibleDrafts.length && (
              <div className="posts-empty">
                {query || selectedTag || coverOnly || filterDraftOnly
                  ? "暂无符合条件的文章"
                  : "从一篇新文章开始。"}
                <button
                  type="button"
                  disabled={busy || !ready}
                  onClick={() => void switchEditor()}
                >
                  撰写文章
                </button>
              </div>
            )}
            {!filterDraftOnly && (
              <div className="posts-pagination">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  上一页
                </button>
                <span>
                  {page} / {Math.max(1, Math.ceil((result?.total || 0) / 20))}
                </span>
                <button
                  type="button"
                  disabled={!result || page * 20 >= result.total || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </aside>

        <main className="posts-main">
          {(error || notice) && (
            <div className="post-banners">
              {error && (
                <p className="post-error" role="alert">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    aria-label="关闭错误"
                  >
                    ×
                  </button>
                </p>
              )}
              {notice && (
                <p className="post-notice" role="status">
                  {notice}
                </p>
              )}
            </div>
          )}

          <fieldset
            disabled={busy || !ready}
            className="post-editor-fieldset"
          >
            <div
              className="posts-canvas-grid"
              data-single={view !== "split"}
            >
              {view !== "preview" && (
                <section className="post-pane-card">
                  <div className="post-pane-header">
                    <strong>Markdown 正文</strong>
                    <span className="post-dock-shortcuts">
                      {chars} 字 · 约{" "}
                      {Math.max(
                        1,
                        Math.ceil(chars / (settings.readingSpeedCpm || 400)),
                      )}{" "}
                      分钟 · ⌘/Ctrl+B · I · Tab
                    </span>
                  </div>
                  <input
                    id="post-title"
                    className="post-title"
                    aria-label="文章标题"
                    placeholder="输入文章标题…"
                    value={title}
                    onChange={(e) => editText("title", e.target.value)}
                  />
                  <div
                    className={`post-source${settings.showLineNumbers ? "" : " no-line-numbers"}`}
                    style={
                      {
                        "--post-editor-font": resolveEditorFontCss(
                          settings.editorFontFamily,
                          "posts",
                        ),
                        "--post-editor-size": `${settings.editorFontSize}px`,
                        "--post-editor-lh": `${Math.round(settings.editorFontSize * settings.editorLineHeight)}px`,
                      } as CSSProperties
                    }
                  >
                    <div
                      ref={gutter}
                      className="post-line-numbers"
                      aria-hidden="true"
                    >
                      {content.split("\n").map((line, i) => (
                        <div key={i} data-line={i + 1}>
                          {line || "\u200b"}
                        </div>
                      ))}
                    </div>
                    <textarea
                      ref={textarea}
                      aria-label="Markdown 正文"
                      spellCheck={settings.spellCheck}
                      wrap="soft"
                      placeholder="从这里落笔。支持 Markdown…"
                      value={content}
                      onChange={(e) => editText("content", e.target.value)}
                      onKeyDown={shortcut}
                      onScroll={(e) => {
                        if (gutter.current)
                          gutter.current.scrollTop = e.currentTarget.scrollTop;
                      }}
                    />
                  </div>
                </section>
              )}

              {view !== "edit" && (
                <section className="post-pane-card">
                  <div className="post-pane-header">
                    <strong>实时预览</strong>
                    <span>{displayPostText(post.title) || "未命名文章"}</span>
                  </div>
                  <div className="post-preview-scroll">
                    <MarkdownPreview
                      content={content}
                      tocDefaultOpen={settings.previewTocDefaultOpen}
                    />
                  </div>
                </section>
              )}
            </div>

            {/* Single-line horizontally scrollable always-editable Floating Meta Dock */}
            <div className="posts-dock-wrap">
              <div
                className="posts-dock-scroll"
                aria-label="文章设置"
                onWheel={handleDockWheel}
              >
                <div className="posts-dock-pill">
                  <Globe size={12} />
                  <select
                    aria-label="编辑语言"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {(languages.length ? languages : ["zh", "en"]).map(
                      (code) => (
                        <option key={code} value={code}>
                          {languageLabel(code)}
                        </option>
                      ),
                    )}
                  </select>
                  {!activeLanguages.includes("en") && (
                    <button
                      type="button"
                      className="post-dock-btn"
                      onClick={() => addLanguage("en")}
                    >
                      添加英文版
                    </button>
                  )}
                  {!activeLanguages.some(
                    (code) => code === "zh" || code.startsWith("zh-"),
                  ) && (
                    <button
                      type="button"
                      className="post-dock-btn"
                      onClick={() => addLanguage("zh")}
                    >
                      添加中文版
                    </button>
                  )}
                  <input
                    aria-label="新语言代码"
                    placeholder="+语言如ja"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                    style={{ width: "68px" }}
                  />
                  {newLanguage.trim() && (
                    <button
                      type="button"
                      className="post-dock-btn"
                      onClick={() => addLanguage()}
                    >
                      添加
                    </button>
                  )}
                  {languages.length > 0 &&
                    [post.title, post.summary, post.content].some(
                      (value) => typeof value === "string",
                    ) && (
                      <button
                        type="button"
                        className="post-dock-btn"
                        onClick={() =>
                          change(addPostLanguage(post, language, language))
                        }
                        title="将共用文案拆分为分语言编辑"
                      >
                        分语言
                      </button>
                    )}
                </div>

                <span className="posts-dock-divider" />

                <div className="posts-dock-pill">
                  <Link2 size={12} />
                  <input
                    aria-label="Slug"
                    value={post.id}
                    disabled={!!editor.originalId}
                    placeholder="slug-id"
                    onChange={(e) => {
                      slugManuallyEdited.current = true;
                      change({ id: e.target.value });
                    }}
                    style={{ width: "112px" }}
                  />
                  {!editor.originalId && (
                    <button
                      type="button"
                      className="post-dock-btn"
                      onClick={() =>
                        change({
                          id: slugFromTitle(
                            title || displayPostText(post.title),
                          ),
                        })
                      }
                    >
                      生成
                    </button>
                  )}
                </div>

                <label className="posts-dock-pill">
                  <Calendar size={12} />
                  <input
                    type="date"
                    aria-label="发布日期"
                    value={post.date.slice(0, 10)}
                    onChange={(e) =>
                      change({
                        date: replacePostDateDay(post.date, e.target.value),
                      })
                    }
                    style={{ minWidth: "118px", width: "auto" }}
                  />
                </label>

                <div className="posts-dock-pill">
                  <Pin size={12} />
                  <label className="post-dock-toggle">
                    <input
                      type="checkbox"
                      checked={!!post.pinned}
                      onChange={(e) => change({ pinned: e.target.checked })}
                    />
                    <span>置顶</span>
                  </label>
                </div>

                <span className="posts-dock-divider" />

                <label className="posts-dock-pill">
                  <AlignLeft size={12} />
                  <input
                    type="text"
                    aria-label="文章摘要"
                    value={summary}
                    placeholder="文章摘要…"
                    onChange={(e) => editText("summary", e.target.value)}
                    style={{ width: "150px" }}
                  />
                </label>

                <label className="posts-dock-pill">
                  <Hash size={12} />
                  <input
                    type="text"
                    list="posts-tag-list"
                    aria-label="文章标签"
                    value={tagsInput}
                    placeholder="标签 (逗号分隔)"
                    onChange={(e) => {
                      const raw = e.target.value;
                      setTagsInput(raw);
                      change({ tags: parseTagList(raw) });
                    }}
                    style={{ width: "120px" }}
                  />
                </label>

                <label className="posts-dock-pill">
                  <ImageIcon size={12} />
                  {/^https?:\/\//i.test(post.cover || "") && (
                    <img
                      className="posts-dock-cover-thumb"
                      src={post.cover}
                      alt="封面预览"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <input
                    type="url"
                    aria-label="封面图 URL"
                    value={post.cover || ""}
                    placeholder="封面图 URL"
                    onChange={(e) => change({ cover: e.target.value })}
                    style={{ width: "124px" }}
                  />
                </label>

                <label className="posts-dock-pill">
                  <User size={12} />
                  <input
                    type="text"
                    aria-label="作者"
                    value={post.author || ""}
                    placeholder="作者"
                    onChange={(e) => change({ author: e.target.value })}
                    style={{ width: "76px" }}
                  />
                </label>
              </div>
            </div>
          </fieldset>

          <datalist id="posts-tag-list">
            {tags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </main>
      </div>

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        title={`删除文章「${displayPostText(post.title) || post.id}」？`}
        description="此操作将直接从数据库中永久移除该博客文章。"
        previewText={
          displayPostText(post.summary) ||
          displayPostText(post.content).slice(0, 160) ||
          `Slug: ${post.id || editor.originalId}`
        }
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => void confirmRemove()}
        isDeleting={busy}
      />
    </Workspace>
  );
}
