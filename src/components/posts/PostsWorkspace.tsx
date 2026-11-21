import * as S from "./PostsWorkspace.styles";
import {
  useEffect,
  useImperativeHandle,
  useState,
  type KeyboardEvent,
  type Ref,
} from "react";
import {
  AlignLeft,
  Calendar,
  Hash,
  Image as ImageIcon,
  Link2,
  Pin,
  User,
} from "lucide-react";
import { usePostsWorkspace } from "../../hooks/usePostsWorkspace";
import {
  DEFAULT_CMS_SETTINGS,
  resolveEditorFontCss,
  type CmsSettings,
} from "../../lib/settings/cmsSettings";
import { isMobileViewport, parseTagList } from "../../lib/utils";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import {
  DockButton,
  DockDivider,
  DockPill,
  FloatingMetaDock,
} from "../workspace/FloatingMetaDock";
import {
  WorkspaceHeader,
  type WorkspaceHandle,
} from "../workspace/WorkspaceHeader";
import { MarkdownPreview } from "./MarkdownPreview";
import { PostListSidebar } from "./PostListSidebar";

interface PostsWorkspaceProps {
  ref?: Ref<WorkspaceHandle>;
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  settings?: CmsSettings;
  onToast?: (type: "success" | "error" | "info", text: string) => void;
}

export default function PostsWorkspace({
  ref,
  sidebarOpen = true,
  onSidebarOpenChange,
  settings = DEFAULT_CMS_SETTINGS,
  onToast,
}: PostsWorkspaceProps) {
  const [tagsInput, setTagsInput] = useState("");

  const posts = usePostsWorkspace({
    settings,
    onToast,
    onAfterNavigate: () => {
      if (isMobileViewport()) {
        onSidebarOpenChange?.(false);
      }
    },
  });

  const post = posts.editor.post;

  useEffect(() => {
    if (parseTagList(tagsInput).join(",") !== post.tags.join(",")) {
      setTagsInput(post.tags.join(", "));
    }
  }, [post.tags]);

  useImperativeHandle(
    ref,
    () => ({
      createNew: () => {
        void posts.switchEditor();
      },
      saveNow: () => {
        void posts.saveNow();
      },
      publishNow: () => {
        if (!posts.busy && posts.ready) void posts.publish();
      },
      refreshDrafts: () => {
        void posts.refreshDrafts();
      },
    }),
    [posts],
  );

  const handleShortcut = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!settings.enableShortcuts || e.nativeEvent.isComposing) return;
    const key = e.key.toLowerCase();
    if (
      key !== "tab" &&
      !((e.ctrlKey || e.metaKey) && ["b", "i"].includes(key))
    ) {
      return;
    }
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const wrap = key === "b" ? "**" : "*";
    const tabUnit = " ".repeat(settings.tabIndentSpaces);
    const selected = post.content.slice(start, end);
    const insert =
      key === "tab"
        ? tabUnit + selected.replace(/\n/g, `\n${tabUnit}`)
        : wrap + selected + wrap;

    posts.change({
      content: post.content.slice(0, start) + insert + post.content.slice(end),
    });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + (key === "tab" ? tabUnit.length : wrap.length),
        start + insert.length - (key === "tab" ? 0 : wrap.length),
      );
    });
  };

  const chars = Array.from(post.content.replace(/\s/g, "")).length;

  return (
    <S.Workspace>
      <WorkspaceHeader
        modeLabel={posts.editor.originalId ? "博客长文" : "新文章"}
        statusText={`${posts.ready ? posts.status : "恢复草稿中…"} · ${chars} 字`}
        dirty={posts.dirty}
        view={posts.view}
        onChangeView={posts.setView}
        viewDisabled={posts.busy || !posts.ready}
        onRevert={() => void posts.removeDraft()}
        revertDisabled={posts.busy || !posts.ready || !posts.dirty}
        revertTitle="清空本地草稿并放弃更改"
        onDelete={() => posts.setDeleteConfirmOpen(true)}
        deleteDisabled={posts.busy || !posts.editor.originalId}
        deleteLabel="删除文章"
        onPublish={() => void posts.publish()}
        publishDisabled={posts.busy || !posts.ready}
        publishLabel="发布文章"
        isPublishing={posts.busy}
        showMobileBack={!sidebarOpen && Boolean(onSidebarOpenChange)}
        onMobileBack={() => onSidebarOpenChange?.(true)}
      />

      <S.Body>
        <PostListSidebar
          open={sidebarOpen}
          compactList={settings.compactList}
          busy={posts.busy}
          ready={posts.ready}
          loading={posts.loading}
          query={posts.query}
          onQueryChange={(q) => {
            posts.setQuery(q);
            posts.setPage(1);
          }}
          filterDraftOnly={posts.filterDraftOnly}
          onToggleDraftOnly={() => {
            posts.setFilterDraftOnly((v) => !v);
            posts.setPage(1);
          }}
          coverOnly={posts.coverOnly}
          onToggleCoverOnly={() => {
            posts.setCoverOnly((v) => !v);
            posts.setPage(1);
          }}
          selectedTag={posts.selectedTag}
          onSelectTag={(tag) => {
            posts.setSelectedTag(tag);
            posts.setPage(1);
          }}
          sortOrder={posts.sortOrder}
          onToggleSort={() => {
            posts.setSortOrder((v) => (v === "desc" ? "asc" : "desc"));
            posts.setPage(1);
          }}
          tags={posts.tags}
          drafts={posts.drafts}
          visibleDrafts={posts.visibleDrafts}
          visiblePosts={posts.visiblePosts}
          total={posts.result?.total ?? 0}
          page={posts.page}
          onPageChange={posts.setPage}
          activeEditorId={posts.editor.id}
          activeOriginalId={posts.editor.originalId}
          onSelectPost={(id, draft) => void posts.switchEditor(id, draft)}
          onRefresh={posts.refreshList}
        />

        <S.Main $sidebarOpen={sidebarOpen}>
          {(posts.error || posts.notice) && (
            <S.Banners>
              {posts.error && (
                <S.BannerItem $error role="alert">
                  <span>{posts.error}</span>
                  <button
                    type="button"
                    aria-label="关闭错误"
                    onClick={() => posts.setError("")}
                  >
                    ×
                  </button>
                </S.BannerItem>
              )}
              {posts.notice && (
                <S.BannerItem role="status">{posts.notice}</S.BannerItem>
              )}
            </S.Banners>
          )}

          <S.Fieldset disabled={posts.busy || !posts.ready}>
            <S.SplitGrid data-single={posts.view !== "split"}>
              {posts.view !== "preview" && (
                <S.PaneCard>
                  <S.PaneHeader>
                    <strong>Markdown 正文</strong>
                    <span>{chars} 字 · ⌘/Ctrl+B · I · Tab</span>
                  </S.PaneHeader>
                  <S.TitleInput
                    aria-label="文章标题"
                    placeholder="输入文章标题…"
                    value={post.title}
                    onChange={(e) => posts.change({ title: e.target.value })}
                  />
                  <S.ContentTextarea
                    aria-label="Markdown 正文"
                    placeholder="从这里落笔。支持 Markdown…"
                    value={post.content}
                    onChange={(e) => posts.change({ content: e.target.value })}
                    onKeyDown={handleShortcut}
                    style={{
                      fontFamily: resolveEditorFontCss(
                        settings.editorFontFamily,
                        "posts",
                      ),
                      fontSize: `${settings.editorFontSize}px`,
                    }}
                  />
                </S.PaneCard>
              )}

              {posts.view !== "edit" && (
                <S.PaneCard>
                  <S.PaneHeader>
                    <strong>实时预览</strong>
                    <span>{post.title || "未命名文章"}</span>
                  </S.PaneHeader>
                  <S.PreviewScroll>
                    <MarkdownPreview
                      content={post.content}
                      tocDefaultOpen={settings.previewTocDefaultOpen}
                    />
                  </S.PreviewScroll>
                </S.PaneCard>
              )}
            </S.SplitGrid>

            <FloatingMetaDock label="文章设置">
              <DockPill>
                <Link2 size={12} />
                <input
                  aria-label="Slug"
                  value={post.id}
                  disabled={Boolean(posts.editor.originalId)}
                  placeholder="slug-id"
                  onChange={(e) => posts.change({ id: e.target.value })}
                  style={{ width: "112px" }}
                />
                {!posts.editor.originalId && (
                  <DockButton
                    type="button"
                    onClick={() => void posts.generateSlug()}
                    disabled={!post.title.trim()}
                  >
                    生成
                  </DockButton>
                )}
              </DockPill>

              <DockPill>
                <Calendar size={12} />
                <input
                  type="date"
                  aria-label="发布日期"
                  value={post.date.slice(0, 10)}
                  onChange={(e) =>
                    posts.change({
                      date: e.target.value
                        ? e.target.value + post.date.slice(10)
                        : "",
                    })
                  }
                  style={{ minWidth: "118px" }}
                />
              </DockPill>

              <DockPill as="div">
                <Pin size={12} />
                <S.DockCheck as="label">
                  <input
                    type="checkbox"
                    checked={Boolean(post.pinned)}
                    onChange={(e) => posts.change({ pinned: e.target.checked })}
                  />
                  <span>置顶</span>
                </S.DockCheck>
              </DockPill>

              <DockDivider />

              <DockPill>
                <AlignLeft size={12} />
                <input
                  type="text"
                  aria-label="文章摘要"
                  value={post.summary}
                  placeholder="文章摘要…"
                  onChange={(e) => posts.change({ summary: e.target.value })}
                  style={{ width: "150px" }}
                />
              </DockPill>

              <DockPill>
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
                    posts.change({ tags: parseTagList(raw) });
                  }}
                  style={{ width: "120px" }}
                />
              </DockPill>

              <DockPill>
                <ImageIcon size={12} />
                {/^https?:\/\//i.test(post.cover || "") && (
                  <S.CoverThumb
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
                  onChange={(e) => posts.change({ cover: e.target.value })}
                  style={{ width: "124px" }}
                />
              </DockPill>

              <DockPill>
                <User size={12} />
                <input
                  type="text"
                  aria-label="作者"
                  value={post.author || ""}
                  placeholder="作者"
                  onChange={(e) => posts.change({ author: e.target.value })}
                  style={{ width: "76px" }}
                />
              </DockPill>
            </FloatingMetaDock>
          </S.Fieldset>

          <datalist id="posts-tag-list">
            {posts.tags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
        </S.Main>
      </S.Body>

      <DeleteConfirmModal
        isOpen={posts.deleteConfirmOpen}
        title={`删除文章「${post.title || post.id}」？`}
        description="此操作将直接从数据库中永久移除该博客文章。"
        previewText={
          post.summary ||
          post.content.slice(0, 160) ||
          `Slug: ${post.id || posts.editor.originalId}`
        }
        onClose={() => posts.setDeleteConfirmOpen(false)}
        onConfirm={() => void posts.confirmRemove()}
        isDeleting={posts.busy}
      />
    </S.Workspace>
  );
}
