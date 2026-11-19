import * as S from "./ArticleListSidebar.styles";
import React, { useState, useMemo, useEffect } from "react";
import type { Article, ArticleDraft } from "../../types/article";

interface ArticleListSidebarProps {
  articles: Article[];
  selectedFingerprint: string | null;
  onSelectArticle: (fingerprint: string | null) => void;
  onNewArticle: () => void;
  onCloneArticle: (article: Article) => void;
  onDeleteArticle: (article: Article, fingerprint: string) => void;
  drafts: Map<string, ArticleDraft>;
  getFingerprint: (article: Article) => string;
  defaultSortOrder?: "desc" | "asc";
  compactList?: boolean;
}

export const ArticleListSidebar: React.FC<ArticleListSidebarProps> = ({
  articles,
  selectedFingerprint,
  onSelectArticle,
  onNewArticle,
  onCloneArticle,
  onDeleteArticle,
  drafts,
  getFingerprint,
  defaultSortOrder = "desc",
  compactList = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">(defaultSortOrder);

  useEffect(() => {
    setSortOrder(defaultSortOrder);
  }, [defaultSortOrder]);

  const [filterDraftOnly, setFilterDraftOnly] = useState(false);
  const [filterMediaOnly, setFilterMediaOnly] = useState(false);

  const allTagsWithCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of articles) {
      for (const t of a.tags || []) {
        map.set(t, (map.get(t) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        const fp = getFingerprint(article);
        if (filterDraftOnly && !drafts.has(fp)) return false;
        if (filterMediaOnly && (!article.media || article.media.length === 0))
          return false;
        if (
          selectedTag &&
          (!article.tags || !article.tags.includes(selectedTag))
        )
          return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchContent = (article.content || "")
            .toLowerCase()
            .includes(q);
          const matchLoc = (article.location || "").toLowerCase().includes(q);
          const matchMusic = (article.music?.title || "")
            .toLowerCase()
            .includes(q);
          const matchTags = (article.tags || []).some((t) =>
            t.toLowerCase().includes(q),
          );
          if (!matchContent && !matchLoc && !matchMusic && !matchTags)
            return false;
        }

        return true;
      })
      .sort((a, b) => (sortOrder === "desc" ? b.time - a.time : a.time - b.time));
  }, [
    articles,
    searchQuery,
    selectedTag,
    sortOrder,
    filterDraftOnly,
    filterMediaOnly,
    drafts,
    getFingerprint,
  ]);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <S.SidebarContainer>
      <S.SidebarHeader>
        <S.SidebarTitleRow>
          <S.SidebarTitleGroup>
            <S.SidebarTitle>文章列表</S.SidebarTitle>
            <S.CountBadge>
              {filteredArticles.length} / {articles.length}
            </S.CountBadge>
          </S.SidebarTitleGroup>
          <S.CreateButtonGroup>
            <S.CreateButton type="button" onClick={onNewArticle}>
              <S.Plus />
              发表新说说
            </S.CreateButton>
          </S.CreateButtonGroup>
        </S.SidebarTitleRow>

        <S.SearchBox>
          <S.SearchIcon />
          <S.SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索正文、地点、标签、音乐..."
          />
        </S.SearchBox>

        <S.FilterRow>
          <S.FilterChipsScroll>
            <S.FilterChip
              type="button"
              onClick={() => setFilterDraftOnly(!filterDraftOnly)}
              $active={filterDraftOnly}
              $tone="amber"
            >
              草稿 ({drafts.size})
            </S.FilterChip>
            <S.FilterChip
              type="button"
              onClick={() => setFilterMediaOnly(!filterMediaOnly)}
              $active={filterMediaOnly}
              $tone="indigo"
            >
              带媒体
            </S.FilterChip>
            {selectedTag && (
              <S.ActiveTagChip
                type="button"
                onClick={() => setSelectedTag(null)}
              >
                #{selectedTag} ×
              </S.ActiveTagChip>
            )}
          </S.FilterChipsScroll>

          <S.SortButton
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            title="切换时间排序"
          >
            <S.ArrowUpDown />
            {sortOrder === "desc" ? "最新优先" : "最早优先"}
          </S.SortButton>
        </S.FilterRow>

        {allTagsWithCount.length > 0 && !selectedTag && (
          <S.FilterChipsScroll>
            {allTagsWithCount.slice(0, 6).map((t) => (
              <S.TagChip
                key={t.tag}
                type="button"
                onClick={() => setSelectedTag(t.tag)}
              >
                #{t.tag}
              </S.TagChip>
            ))}
          </S.FilterChipsScroll>
        )}
      </S.SidebarHeader>

      <S.ArticleListScroll>
        {filteredArticles.length === 0 ? (
          <S.EmptyState>
            <S.Sparkles />
            <S.EmptyText>暂无符合条件的文章</S.EmptyText>
          </S.EmptyState>
        ) : (
          filteredArticles.map((article) => {
            const fp = getFingerprint(article);
            const isSelected = selectedFingerprint === fp;
            const draft = drafts.get(fp);

            return (
              <S.ArticleCard
                key={fp}
                onClick={() => onSelectArticle(fp)}
                $selected={isSelected}
                $compact={compactList}
                data-style-group
              >
                <S.CardMetaRow>
                  <S.DateLabel>
                    <S.Clock />
                    <span>{formatDate(article.time)}</span>
                  </S.DateLabel>
                  {draft ? (
                    <S.DraftBadge>
                      <S.FileEdit />
                      未发布草稿
                    </S.DraftBadge>
                  ) : (
                    <S.PublishedBadge>
                      <S.CheckCircle2 />
                      已发布
                    </S.PublishedBadge>
                  )}
                </S.CardMetaRow>

                <S.CardExcerpt $compact={compactList}>
                  {article.content || (
                    <S.EmptyContentHint>（暂无正文内容）</S.EmptyContentHint>
                  )}
                </S.CardExcerpt>

                {article.media && article.media.length > 0 && (
                  <S.MediaStrip>
                    {article.media.slice(0, 3).map((m, idx) => (
                      <S.MediaThumbBox key={idx}>
                        {m.type === "img" ? (
                          <S.MediaThumbImg src={m.url} alt="" />
                        ) : (
                          <S.VideoThumbTag>VID</S.VideoThumbTag>
                        )}
                      </S.MediaThumbBox>
                    ))}
                    {article.media.length > 3 && (
                      <S.ExtraMediaCount>
                        +{article.media.length - 3}
                      </S.ExtraMediaCount>
                    )}
                  </S.MediaStrip>
                )}

                <S.CardFooter>
                  <S.MetaBadges>
                    {article.location && (
                      <S.MetaBadge>
                        <S.MapPin />
                        <S.MetaText>{article.location}</S.MetaText>
                      </S.MetaBadge>
                    )}
                    {article.music && (
                      <S.MetaBadge>
                        <S.Music2 />
                        <S.MetaText>{article.music.title}</S.MetaText>
                      </S.MetaBadge>
                    )}
                  </S.MetaBadges>

                  <S.CardHoverActions>
                    <S.CardHoverBtn
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneArticle(article);
                      }}
                      title="复制文章"
                    >
                      <S.Copy />
                    </S.CardHoverBtn>
                    <S.CardHoverBtn
                      type="button"
                      $danger
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteArticle(article, fp);
                      }}
                      title="删除文章"
                    >
                      <S.Trash2 />
                    </S.CardHoverBtn>
                  </S.CardHoverActions>
                </S.CardFooter>
              </S.ArticleCard>
            );
          })
        )}
      </S.ArticleListScroll>
    </S.SidebarContainer>
  );
};
