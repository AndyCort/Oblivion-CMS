import * as L from "../workspace/Sidebar.styles";
import * as S from "./PostListSidebar.styles";
import { ArrowUpDown, Plus, RefreshCw, Search } from "lucide-react";
import type { BlogPost, PostDraft } from "../../types/post";

interface PostListSidebarProps {
  open: boolean;
  compactList: boolean;
  busy: boolean;
  ready: boolean;
  loading: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  filterDraftOnly: boolean;
  onToggleDraftOnly: () => void;
  coverOnly: boolean;
  onToggleCoverOnly: () => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  sortOrder: "asc" | "desc";
  onToggleSort: () => void;
  tags: string[];
  drafts: PostDraft[];
  visibleDrafts: PostDraft[];
  visiblePosts: BlogPost[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  activeEditorId: string;
  activeOriginalId?: string;
  onSelectPost: (id?: string, draft?: PostDraft) => void;
  onRefresh: () => void;
}

export function PostListSidebar({
  open,
  compactList,
  busy,
  ready,
  loading,
  query,
  onQueryChange,
  filterDraftOnly,
  onToggleDraftOnly,
  coverOnly,
  onToggleCoverOnly,
  selectedTag,
  onSelectTag,
  sortOrder,
  onToggleSort,
  tags,
  drafts,
  visibleDrafts,
  visiblePosts,
  total,
  page,
  onPageChange,
  activeEditorId,
  activeOriginalId,
  onSelectPost,
  onRefresh,
}: PostListSidebarProps) {
  const hasFilters = Boolean(query || selectedTag || coverOnly || filterDraftOnly);

  return (
    <L.SidebarRoot $open={open}>
      <L.SidebarHeader>
        <L.SidebarTitleRow>
          <L.SidebarTitleGroup>
            <L.SidebarTitle>文章列表</L.SidebarTitle>
            <L.CountBadge>
              {filterDraftOnly ? visibleDrafts.length : total}
            </L.CountBadge>
          </L.SidebarTitleGroup>
          <L.CreateButton
            type="button"
            aria-label="新建文章"
            disabled={busy || !ready}
            onClick={() => onSelectPost()}
          >
            <Plus size={14} />
            新建文章
          </L.CreateButton>
        </L.SidebarTitleRow>

        <L.SearchBox>
          <Search size={14} />
          <L.SearchInput
            aria-label="搜索博客"
            placeholder="搜索标题、摘要、标签…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </L.SearchBox>

        <L.FilterRow>
          <L.FilterChipsScroll>
            <L.FilterChip
              type="button"
              aria-pressed={filterDraftOnly}
              $active={filterDraftOnly}
              $tone="amber"
              onClick={onToggleDraftOnly}
            >
              草稿 ({drafts.length})
            </L.FilterChip>
            <L.FilterChip
              type="button"
              aria-pressed={coverOnly}
              $active={coverOnly}
              onClick={onToggleCoverOnly}
            >
              带封面
            </L.FilterChip>
            {selectedTag && (
              <L.ActiveTagChip type="button" onClick={() => onSelectTag(null)}>
                #{selectedTag} ×
              </L.ActiveTagChip>
            )}
          </L.FilterChipsScroll>
          <L.SortButton
            type="button"
            title="切换时间排序"
            onClick={onToggleSort}
          >
            <ArrowUpDown size={12} />
            {sortOrder === "desc" ? "最新优先" : "最早优先"}
          </L.SortButton>
        </L.FilterRow>

        {tags.length > 0 && !selectedTag && (
          <L.FilterChipsScroll>
            {tags.slice(0, 6).map((tag) => (
              <L.TagChip
                key={tag}
                type="button"
                onClick={() => onSelectTag(tag)}
              >
                #{tag}
              </L.TagChip>
            ))}
          </L.FilterChipsScroll>
        )}

        <S.StatusStrip>
          <span role="status">{loading ? "加载中…" : "文章库"}</span>
          <button type="button" aria-label="刷新文章列表" onClick={onRefresh}>
            <RefreshCw size={13} />
          </button>
        </S.StatusStrip>
      </L.SidebarHeader>

      <L.ListScroll>
        {visibleDrafts.length > 0 && (
          <S.DraftsGroup open>
            <summary>本地草稿 · {visibleDrafts.length}</summary>
            {visibleDrafts.map((d) => (
              <L.ListCard
                key={d.id}
                as="button"
                type="button"
                disabled={busy || !ready}
                $selected={activeEditorId === d.id}
                $compact={compactList}
                onClick={() => onSelectPost(undefined, d)}
              >
                <S.CardTitle>{d.post.title || "未命名文章"}</S.CardTitle>
                {d.post.tags.length > 0 && (
                  <S.TagPills>
                    {d.post.tags.map((tag) => (
                      <S.TagPill key={tag}>{tag}</S.TagPill>
                    ))}
                  </S.TagPills>
                )}
                <L.DirtyPill>未发布修改</L.DirtyPill>
              </L.ListCard>
            ))}
          </S.DraftsGroup>
        )}

        {visiblePosts.map((p) => (
          <L.ListCard
            key={p.id}
            as="button"
            type="button"
            disabled={busy || !ready}
            $selected={activeOriginalId === p.id}
            $compact={compactList}
            onClick={() => onSelectPost(p.id)}
          >
            <L.CardMetaRow>
              <span>
                {p.pinned ? "置顶 · " : ""}
                {p.date}
              </span>
            </L.CardMetaRow>
            <S.CardTitle>{p.title}</S.CardTitle>
            {p.summary && (
              <L.CardExcerpt $compact={compactList}>{p.summary}</L.CardExcerpt>
            )}
            {p.tags.length > 0 && (
              <S.TagPills>
                {p.tags.map((tag) => (
                  <S.TagPill key={tag}>{tag}</S.TagPill>
                ))}
              </S.TagPills>
            )}
            {drafts.some((d) => d.originalId === p.id) && (
              <L.DirtyPill>未发布修改</L.DirtyPill>
            )}
          </L.ListCard>
        ))}

        {!loading && !visiblePosts.length && !visibleDrafts.length && (
          <L.EmptyState>
            <span>{hasFilters ? "暂无符合条件的文章" : "从一篇新文章开始。"}</span>
            <L.CreateButton
              type="button"
              disabled={busy || !ready}
              onClick={() => onSelectPost()}
            >
              撰写文章
            </L.CreateButton>
          </L.EmptyState>
        )}

        {!filterDraftOnly && (
          <S.Pagination>
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              上一页
            </button>
            <span>
              {page} / {Math.max(1, Math.ceil(total / 20))}
            </span>
            <button
              type="button"
              disabled={page * 20 >= total || loading}
              onClick={() => onPageChange(page + 1)}
            >
              下一页
            </button>
          </S.Pagination>
        )}
      </L.ListScroll>
    </L.SidebarRoot>
  );
}
