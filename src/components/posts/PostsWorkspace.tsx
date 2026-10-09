import * as ListUI from '../articles/ArticleListSidebar.styles';
import { matchesPost, postTagCounts } from '../../lib/postsList';
import { useEffect, useRef, useState, useDeferredValue } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { pinyin } from "pinyin-pro";
import { Plus, UploadCloud, Trash2, ArrowLeft, Settings2, RefreshCw } from 'lucide-react';
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
import { TagManager } from "../tags/TagManager";
import { MarkdownPreview } from "./MarkdownPreview";
import { Workspace } from './PostsWorkspace.styles';
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
export default function PostsWorkspace({ listNavigation }: { listNavigation?: ReactNode } = {}) {
  const [result, setResult] = useState<PostList>();
  const [query, setQuery] = useState("");
  const [filterDraftOnly, setFilterDraftOnly] = useState(false);
  const [coverOnly, setCoverOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const search = useDeferredValue(query);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [editor, setEditor] = useState<PostDraft>(() => {
    const p = emptyPost();
    return { id: crypto.randomUUID(), post: p, baseline: p, updatedAt: 0 };
  });
  const current = useRef(editor);
  const pending = useRef<PostDraft | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const saving = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("尚未修改");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileEditor, setMobileEditor] = useState(false);
  const [view, setView] = useState<"edit" | "split" | "preview">("split");
  const [metadata, setMetadata] = useState(true);
  const [language, setLanguage] = useState("zh");
  const [newLanguage, setNewLanguage] = useState("en");
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
    fetchPosts(page, search, { tag: selectedTag || undefined, coverOnly, sortOrder })
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
    }, 700);
  }
  function activate(next: PostDraft) {
    setLanguage(preferredPostLanguage(next.post));
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
    change({
      [field]: updatePostText(current.current.post[field], language, value),
    });
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
        const p = emptyPost();
        activate({
          id: crypto.randomUUID(),
          post: p,
          baseline: p,
          updatedAt: 0,
        });
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
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
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
      setNotice(
        response.mode === "worker"
          ? "发布成功，Worker 已执行缓存清理流程。"
          : response.mode === "mock"
            ? "已发布到本地临时内存（未上线）。"
            : "已写入 D1，边缘缓存可能仍需等待过期。",
      );
      await deletePostDraft(editor.id);
      setDrafts((prev) => prev.filter((d) => d.id !== editor.id));
      setStatus("已发布");
    } catch (err) {
      setError(
        `${published ? "文章已发布，但本地草稿清理失败：" : ""}${(err as Error).message}`,
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !editor.originalId ||
      !window.confirm(
        `确定删除「${displayPostText(post.title)}」？此操作会删除线上文章。`,
      )
    )
      return;
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
      setNotice("文章已删除");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function shortcut(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) return;
    const key = e.key.toLowerCase();
    if (
      key !== "tab" &&
      !((e.ctrlKey || e.metaKey) && ["b", "i"].includes(key))
    )
      return;
    e.preventDefault();
    const el = e.currentTarget,
      start = el.selectionStart,
      end = el.selectionEnd;
    const wrap = key === "b" ? "**" : "*";
    const selected = content.slice(start, end);
    const insert =
      key === "tab"
        ? "  " + selected.replace(/\n/g, "\n  ")
        : wrap + selected + wrap;
    editText("content", content.slice(0, start) + insert + content.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + (key === "tab" ? 2 : wrap.length),
        start + insert.length - (key === "tab" ? 0 : wrap.length),
      );
    });
  }
  const titleText = displayPostText;
  const visibleDrafts = drafts.filter(d => matchesPost(d.post, search, { tag: selectedTag || undefined, coverOnly }))
    .sort((a, b) => sortOrder === 'asc' ? a.post.date.localeCompare(b.post.date) : b.post.date.localeCompare(a.post.date));
  const tags = [...new Set([...(result?.tags || postTagCounts(result?.posts || [])).map(t => t.tag), ...postTagCounts(drafts.map(d => d.post)).map(t => t.tag)])];
  const visiblePosts = filterDraftOnly ? [] : result?.posts || [];
  return (
    <Workspace
      className={mobileEditor ? "posts-mobile-editor" : undefined}
    >
      <aside className="posts-sidebar">
        {listNavigation}
        {error && (
          <p className="post-error" role="alert">
            {error}
          </p>
        )}
        <ListUI.Div2>
          <ListUI.Div3>
            <ListUI.Div4>
              <ListUI.H2>文章列表</ListUI.H2>
              <ListUI.Span>{filterDraftOnly ? visibleDrafts.length : result?.total ?? 0}</ListUI.Span>
            </ListUI.Div4>
            <ListUI.Button2 aria-label="新建文章" disabled={busy || !ready} onClick={() => void switchEditor()}>
              <Plus size={14} />新建文章
            </ListUI.Button2>
          </ListUI.Div3>
          <ListUI.Div6>
            <ListUI.Search />
            <ListUI.Input aria-label="搜索博客" placeholder="搜索标题、摘要、标签…" value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }} />
          </ListUI.Div6>
          <ListUI.Div7>
            <ListUI.Div8>
              <ListUI.Button3 type="button" aria-pressed={filterDraftOnly} $variant={filterDraftOnly ? 'v0' : 'v1'}
                onClick={() => { setFilterDraftOnly(v => !v); setPage(1); }}>草稿 ({drafts.length})</ListUI.Button3>
              <ListUI.Button4 type="button" aria-pressed={coverOnly} $variant={coverOnly ? 'v0' : 'v1'}
                onClick={() => { setCoverOnly(v => !v); setPage(1); }}>带封面</ListUI.Button4>
              {selectedTag && <ListUI.Button5 type="button" onClick={() => { setSelectedTag(null); setPage(1); }}>#{selectedTag} ×</ListUI.Button5>}
            </ListUI.Div8>
            <ListUI.Button6 type="button" title="切换时间排序" onClick={() => { setSortOrder(v => v === 'desc' ? 'asc' : 'desc'); setPage(1); }}>
              <ListUI.ArrowUpDown />{sortOrder === 'desc' ? '最新优先' : '最早优先'}
            </ListUI.Button6>
          </ListUI.Div7>
          {tags.length > 0 && !selectedTag && <ListUI.Div8>
            {tags.slice(0, 6).map(tag => <ListUI.Button7 key={tag} type="button" onClick={() => { setSelectedTag(tag); setPage(1); }}>#{tag}</ListUI.Button7>)}
          </ListUI.Div8>}
          <div className="posts-list-status"><span role="status">{loading ? '加载中…' : '文章库'}</span>
            <button type="button" aria-label="刷新文章列表" onClick={() => setRevision(v => v + 1)}><RefreshCw size={13} /></button>
          </div>
        </ListUI.Div2>
        <div className="posts-list-scroll">
        {visibleDrafts.length > 0 && (
          <details open>
            <summary>本地草稿 · {visibleDrafts.length}</summary>
            {visibleDrafts.map((d) => (
              <button
                disabled={busy || !ready}
                className={`post-list-card ${editor.id === d.id ? "selected" : ""}`}
                key={d.id}
                onClick={() => void switchEditor(undefined, d)}
              >
                <strong>{titleText(d.post.title) || "未命名文章"}</strong>
                <span className="post-tag-pills">{d.post.tags.map(tag => <span className="post-tag-pill" key={tag}>{tag}</span>)}</span>
                <span className="post-dirty">未发布修改</span>
              </button>
            ))}
          </details>
        )}
        <div className="posts-list">
          {visiblePosts.map((p) => (
            <button
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
              <span className="post-tag-pills">{p.tags.map(tag => <span className="post-tag-pill" key={tag}>{tag}</span>)}</span>
              {drafts.some((d) => d.originalId === p.id) && (
                <span className="post-dirty">未发布修改</span>
              )}
            </button>
          ))}
        </div>
        {!loading && !visiblePosts.length && !visibleDrafts.length && (
          <div className="posts-empty">
            {query || selectedTag || coverOnly || filterDraftOnly ? "暂无符合条件的文章" : "从一篇新文章开始。"}
            <button
              disabled={busy || !ready}
              onClick={() => void switchEditor()}
            >
              撰写文章
            </button>
          </div>
        )}
        {!filterDraftOnly && <div className="posts-pagination">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            上一页
          </button>
          <span>
            {page} / {Math.max(1, Math.ceil((result?.total || 0) / 20))}
          </span>
          <button
            disabled={!result || page * 20 >= result.total || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            下一页
          </button>
        </div>}
        </div>
      </aside>
      <main className="posts-main">
        <div className="posts-editor-scroll">
        <div className="posts-editor-container">
        {result?.warning && (
          <p className="post-warning" role="status">
            {result.warning}
          </p>
        )}
        <div className="posts-toolbar">
          <button className="posts-back" onClick={() => setMobileEditor(false)}>
            <ArrowLeft size={16} />
            列表
          </button>
          <div>
            <strong>{editor.originalId ? "编辑文章" : "撰写新文章"}</strong>
            <span role="status">{ready ? status : "恢复草稿中…"}</span>
            {dirty && <small className="post-dirty">未发布修改</small>}
          </div>
            <div className="post-view-switch" aria-label="编辑器视图">
              {(["edit", "split", "preview"] as const).map((v) => (
                <button
                  key={v}
                  disabled={busy || !ready}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                >
                  {v === "edit" ? "编辑" : v === "split" ? "分屏" : "预览"}
                </button>
              ))}
            </div>
        </div>
        {error && (
          <p className="post-error" role="alert">
            {error}
            <button onClick={() => setError("")} aria-label="关闭错误">
              ×
            </button>
          </p>
        )}
        {notice && (
          <p className="post-notice" role="status">
            {notice}
          </p>
        )}
        <fieldset disabled={busy || !ready} className="post-editor-fields">
          <label className="post-field-label" htmlFor="post-title">文章标题</label>
          <input
            id="post-title"
            className="post-title"
            aria-label="文章标题"
            placeholder="输入文章标题…"
            value={title}
            onChange={(e) => editText("title", e.target.value)}
 />
          <div className="post-editor-options">

            <span>
              {chars} 字 · 约 {Math.max(1, Math.ceil(chars / 400))} 分钟
            </span>
            <button
              aria-expanded={metadata}
              onClick={() => setMetadata((v) => !v)}
            >
              <Settings2 size={16} />
              文章设置
            </button>
          </div>
          {metadata && (
            <section className="post-metadata" aria-label="文章设置">
              <div className="post-language-bar">
                <label>
                  {languages.length ? "文章语言" : "原文语言"}
                  <select aria-label="编辑语言" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {(languages.length ? languages : ["zh", "en"]).map((code) => (
                      <option key={code} value={code}>{languageLabel(code)}</option>
                    ))}
                  </select>
                </label>
                {!(languages.length ? languages : [language]).includes("en") && (
                  <button type="button" onClick={() => addLanguage("en")}>添加英文版</button>
                )}
                {!(languages.length ? languages : [language]).some((code) => code === "zh" || code.startsWith("zh-")) && (
                  <button type="button" onClick={() => addLanguage("zh")}>添加中文版</button>
                )}
                <details className="post-language-more">
                  <summary>更多语言设置</summary>
                  <div className="post-add-language">
                    <input aria-label="新语言代码" placeholder="其他语言，如 ja" value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); addLanguage(); } }} />
                    <button type="button" disabled={!newLanguage.trim()} onClick={() => addLanguage()}>添加语言</button>
                  </div>
                  {languages.length > 0 && [post.title, post.summary, post.content].some((value) => typeof value === "string") && (
                    <div className="post-shared-fields">
                      <small>部分内容由各语言共用。</small>
                      <button type="button" onClick={() => change(addPostLanguage(post, language, language))}>改为分语言编辑</button>
                    </div>
                  )}
                </details>
              </div>
              <label className="post-slug-field">
                Slug / 链接 ID
                <div className="post-slug">
                  <input
                    value={post.id}
                    disabled={!!editor.originalId}
                    placeholder="my-first-post"
                    onChange={(e) => change({ id: e.target.value })}
 />
                  <button
                    disabled={!!editor.originalId}
                    onClick={() =>
                      change({
                        id: slugFromTitle(title || displayPostText(post.title)),
                      })
                    }
                  >
                    从标题生成
                  </button>
                </div>
                {editor.originalId && (
                  <small>已发布链接保持稳定；如需新链接请新建文章。</small>
                )}
              </label>
              <label>
                发布日期
                <input
                  type="date"
                  value={post.date.slice(0, 10)}
                  onChange={(e) =>
                    change({
                      date: replacePostDateDay(post.date, e.target.value),
                    })
                  }
 />
                {post.date.length > 10 && (
                  <small>保留原时间：{post.date.slice(11)}</small>
                )}
              </label>
              <label>
                作者
                <input
                  value={post.author || ""}
                  onChange={(e) => change({ author: e.target.value })}
                  placeholder="可选"
 />
              </label>
              <label>
                封面图 URL
                <div className="post-cover">
                  <input
                    type="url"
                    value={post.cover || ""}
                    placeholder="https://…"
                    onChange={(e) => change({ cover: e.target.value })}
 />
                  {/^https?:\/\//i.test(post.cover || "") && (
                    <img
                      src={post.cover}
                      alt="封面预览"
                      referrerPolicy="no-referrer"
 />
                  )}
                </div>
              </label>
              <label className="post-summary">
                摘要
                <textarea
                  rows={2}
                  aria-label="文章摘要"
                  value={summary}
                  placeholder="这篇文章讲述什么？"
                  onChange={(e) => editText("summary", e.target.value)}
 />
              </label>
              <div className="post-tags">
                <TagManager
                  tags={post.tags}
                  onChange={(tags) => change({ tags })}
                  availableTags={[
                    ...new Set(
                      result?.posts.flatMap((p) =>
                        Array.isArray(p.tags) ? p.tags : [],
                      ) || [],
                    ),
                  ].map((tag) => ({ tag, count: 1 }))}
 />
              </div>
              <label className="post-pin">
                <input
                  type="checkbox"
                  checked={!!post.pinned}
                  onChange={(e) => change({ pinned: e.target.checked })}
 />
                置顶这篇文章
              </label>
            </section>
          )}
          <div className={`post-writing post-view-${view}`}>
            {view !== "preview" && (
              <div className="post-source">
                <div
                  ref={gutter}
                  className="post-line-numbers"
                  aria-hidden="true"
                >
                  {content.split("\n").map((line, i) => (
                    <div key={i} data-line={i + 1}>{line || "\u200b"}</div>
                  ))}
                </div>
                <textarea
                  ref={textarea}
                  aria-label="Markdown 正文"
                  spellCheck={false}
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
            )}
            {view !== "edit" && <MarkdownPreview content={content} />}
          </div>
        </fieldset>
        <p className="post-shortcuts">Markdown · ⌘ / Ctrl+B 加粗 · ⌘ / Ctrl+I 斜体 · Tab 缩进</p>
        </div>
        </div>
        <footer className="post-footer">
          <div className="post-footer-inner">
          <div>
            <button
              disabled={busy || !ready}
              onClick={() => void removeDraft()}
            >
              清空草稿 / 放弃更改
            </button>
            {editor.originalId && (
              <button
                className="post-delete"
                disabled={busy}
                onClick={() => void remove()}
              >
                <Trash2 size={15} />
                删除文章
              </button>
            )}
          </div>
          <button
            disabled={busy || !ready}
            className="post-primary"
            onClick={() => void publish()}
          >
            <UploadCloud size={16} />
            {busy ? "处理中…" : "发布文章"}
          </button>
          </div>
        </footer>
      </main>
    </Workspace>
  );
}
