import * as L from "../workspace/Sidebar.styles";
import * as S from "./MomentListSidebar.styles";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Copy,
  FileEdit,
  MapPin,
  Music2,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Article, ArticleDraft } from "../../types/article";

interface MomentListSidebarProps {
  open: boolean;
  articles: Article[];
  selectedTime: number | null;
  onSelectArticle: (time: number) => void;
  onNewArticle: () => void;
  onCloneArticle: (article: Article) => void;
  onDeleteArticle: (article: Article) => void;
  drafts: Map<string, ArticleDraft>;
  defaultSortOrder?: "desc" | "asc";
  compactList?: boolean;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function hasDraftForMoment(map: Map<string, ArticleDraft>, time: number): boolean {
  if (map.has(String(time))) return true;
  const legacyPrefix = `${time}-`;
  for (const key of map.keys()) {
    if (key.startsWith(legacyPrefix)) return true;
  }
  return false;
}

export function MomentListSidebar({
  open,
  articles,
  selectedTime,
  onSelectArticle,
  onNewArticle,
  onCloneArticle,
  onDeleteArticle,
  drafts,
  defaultSortOrder = "desc",
  compactList = false,
}: MomentListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">(defaultSortOrder);
  const [filterDraftOnly, setFilterDraftOnly] = useState(false);
  const [filterMediaOnly, setFilterMediaOnly] = useState(false);

  useEffect(() => {
    setSortOrder(defaultSortOrder);
  }, [defaultSortOrder]);

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of articles) {
      for (const t of a.tags || []) map.set(t, (map.get(t) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [articles]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles
      .filter((a) => {
        if (filterDraftOnly && !hasDraftForMoment(drafts, a.time)) return false;
        if (filterMediaOnly && !a.media.length) return false;
        if (selectedTag && !a.tags.includes(selectedTag)) return false;
        if (q) {
          const hay = [a.content, a.location, a.music?.title || "", ...a.tags]
            .join("\n")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (sortOrder === "desc" ? b.time - a.time : a.time - b.time));
  }, [
    articles,
    drafts,
    filterDraftOnly,
    filterMediaOnly,
    searchQuery,
    selectedTag,
    sortOrder,
  ]);

  return (
    <L.SidebarRoot $open={open}>
      <L.SidebarHeader>
        <L.SidebarTitleRow>
          <L.SidebarTitleGroup>
            <L.SidebarTitle>说说列表</L.SidebarTitle>
            <L.CountBadge>
              {filtered.length} / {articles.length}
            </L.CountBadge>
          </L.SidebarTitleGroup>
          <L.CreateButton type="button" onClick={onNewArticle}>
            <Plus size={14} />
            发表新说说
          </L.CreateButton>
        </L.SidebarTitleRow>

        <L.SearchBox>
          <Search size={14} />
          <L.SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索正文、地点、标签、音乐…"
          />
        </L.SearchBox>

        <L.FilterRow>
          <L.FilterChipsScroll>
            <L.FilterChip
              type="button"
              $active={filterDraftOnly}
              $tone="amber"
              onClick={() => setFilterDraftOnly((v) => !v)}
            >
              草稿 ({drafts.size})
            </L.FilterChip>
            <L.FilterChip
              type="button"
              $active={filterMediaOnly}
              onClick={() => setFilterMediaOnly((v) => !v)}
            >
              带媒体
            </L.FilterChip>
            {selectedTag && (
              <L.ActiveTagChip
                type="button"
                onClick={() => setSelectedTag(null)}
              >
                #{selectedTag} ×
              </L.ActiveTagChip>
            )}
          </L.FilterChipsScroll>
          <L.SortButton
            type="button"
            onClick={() =>
              setSortOrder((v) => (v === "desc" ? "asc" : "desc"))
            }
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
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </L.TagChip>
            ))}
          </L.FilterChipsScroll>
        )}
      </L.SidebarHeader>

      <L.ListScroll>
        {filtered.length === 0 ? (
          <L.EmptyState>
            <Sparkles size={20} />
            <span>暂无符合条件的说说</span>
          </L.EmptyState>
        ) : (
          filtered.map((article) => {
            const hasDraft = hasDraftForMoment(drafts, article.time);
            return (
              <L.ListCard
                key={article.time}
                className="sidebar-card"
                $selected={selectedTime === article.time}
                $compact={compactList}
                onClick={() => onSelectArticle(article.time)}
              >
                <L.CardMetaRow>
                  <S.DateLabel>
                    <Clock size={11} />
                    {formatDate(article.time)}
                  </S.DateLabel>
                  <S.StatusBadge $draft={hasDraft}>
                    {hasDraft ? (
                      <>
                        <FileEdit size={10} />
                        未发布草稿
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={10} />
                        已发布
                      </>
                    )}
                  </S.StatusBadge>
                </L.CardMetaRow>

                <L.CardExcerpt $compact={compactList}>
                  {article.content || "（暂无正文内容）"}
                </L.CardExcerpt>

                {article.media.length > 0 && (
                  <S.MediaStrip>
                    {article.media.slice(0, 3).map((m, idx) => (
                      <S.MediaThumb key={idx}>
                        {m.type === "img" ? (
                          <img src={m.url} alt="" />
                        ) : (
                          <span>VID</span>
                        )}
                      </S.MediaThumb>
                    ))}
                    {article.media.length > 3 && (
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        +{article.media.length - 3}
                      </span>
                    )}
                  </S.MediaStrip>
                )}

                <S.CardFooter>
                  <S.MetaRow>
                    {article.location && (
                      <span>
                        <MapPin size={11} />
                        {article.location}
                      </span>
                    )}
                    {article.music && (
                      <span>
                        <Music2 size={11} />
                        {article.music.title}
                      </span>
                    )}
                  </S.MetaRow>

                  <S.HoverActions>
                    <S.HoverBtn
                      type="button"
                      title="复制说说"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneArticle(article);
                      }}
                    >
                      <Copy size={12} />
                    </S.HoverBtn>
                    <S.HoverBtn
                      type="button"
                      $danger
                      title="删除说说"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteArticle(article);
                      }}
                    >
                      <Trash2 size={12} />
                    </S.HoverBtn>
                  </S.HoverActions>
                </S.CardFooter>
              </L.ListCard>
            );
          })
        )}
      </L.ListScroll>
    </L.SidebarRoot>
  );
}
