import * as S from './ArticleListSidebar.styles';
import React, { useState, useMemo } from "react";
import type { Article, ArticleDraft } from "../../types/article";

interface ArticleListSidebarProps {
  listNavigation?: React.ReactNode;
  articles: Article[];
  selectedFingerprint: string | null;
  onSelectArticle: (fingerprint: string | null) => void;
  onNewArticle: () => void;
  onCloneArticle: (article: Article) => void;
  onDeleteArticle: (article: Article, fingerprint: string) => void;
  drafts: Map<string, ArticleDraft>;
  getFingerprint: (article: Article) => string;
}

export const ArticleListSidebar: React.FC<ArticleListSidebarProps> = ({
  listNavigation,
  articles,
  selectedFingerprint,
  onSelectArticle,
  onNewArticle,
  onCloneArticle,
  onDeleteArticle,
  drafts,
  getFingerprint,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [filterDraftOnly, setFilterDraftOnly] = useState(false);
  const [filterMediaOnly, setFilterMediaOnly] = useState(false);

  // Collect all unique tags and counts
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

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        const fp = getFingerprint(article);
        const hasDraft = drafts.has(fp);

        if (filterDraftOnly && !hasDraft) return false;
        if (filterMediaOnly && (!article.media || article.media.length === 0)) return false;
        if (selectedTag && (!article.tags || !article.tags.includes(selectedTag))) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchContent = (article.content || "").toLowerCase().includes(q);
          const matchLoc = (article.location || "").toLowerCase().includes(q);
          const matchMusic = (article.music?.title || "").toLowerCase().includes(q);
          const matchTags = (article.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchContent && !matchLoc && !matchMusic && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        return sortOrder === "desc" ? b.time - a.time : a.time - b.time;
      });
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
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${d.getFullYear()}.${m}.${day} ${hour}:${min}`;
  };

  return (
    <S.Div>
      {listNavigation}
      {/* Sidebar Header & New Article Button */}
      <S.Div2>
        <S.Div3>
          <S.Div4>
            <S.H2>
              文章列表
            </S.H2>
            <S.Span>
              {filteredArticles.length} / {articles.length}
            </S.Span>
          </S.Div4>
          <S.Div5>
            <S.Button2
              type="button"
              onClick={onNewArticle}

            >
              <S.Plus />
              发表新说说
            </S.Button2>
          </S.Div5>
        </S.Div3>

        {/* Search input */}
        <S.Div6>
          <S.Search />
          <S.Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索正文、地点、标签、音乐..."

 />
        </S.Div6>

        {/* Filter chips & Sort toggle */}
        <S.Div7>
          <S.Div8>
            <S.Button3
              type="button"
              onClick={() => setFilterDraftOnly(!filterDraftOnly)}
              $variant={((filterDraftOnly)) ? "v0" : "v1"}
            >
              草稿 ({drafts.size})
            </S.Button3>
            <S.Button4
              type="button"
              onClick={() => setFilterMediaOnly(!filterMediaOnly)}
              $variant={((filterMediaOnly)) ? "v0" : "v1"}
            >
              带媒体
            </S.Button4>
            {selectedTag && (
              <S.Button5
                type="button"
                onClick={() => setSelectedTag(null)}

              >
                #{selectedTag} ×
              </S.Button5>
            )}
          </S.Div8>

          <S.Button6
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}

            title="切换时间排序"
          >
            <S.ArrowUpDown />
            {sortOrder === "desc" ? "最新优先" : "最早优先"}
          </S.Button6>
        </S.Div7>

        {/* Tag pills bar */}
        {allTagsWithCount.length > 0 && !selectedTag && (
          <S.Div8>
            {allTagsWithCount.slice(0, 6).map((t) => (
              <S.Button7
                key={t.tag}
                type="button"
                onClick={() => setSelectedTag(t.tag)}

              >
                #{t.tag}
              </S.Button7>
            ))}
          </S.Div8>
        )}
      </S.Div2>

      {/* Article List Cards */}
      <S.Div9>
        {filteredArticles.length === 0 ? (
          <S.Div10>
            <S.Sparkles />
            <S.P>暂无符合条件的文章</S.P>
          </S.Div10>
        ) : (
          filteredArticles.map((article) => {
            const fp = getFingerprint(article);
            const isSelected = selectedFingerprint === fp;
            const draft = drafts.get(fp);

            return (
              <S.Div11
                key={fp}
                onClick={() => onSelectArticle(fp)}
                $variant={((isSelected)) ? "v0" : "v1"} data-style-group
              >
                {/* Meta row: Date & status */}
                <S.Div12>
                  <S.Div13>
                    <S.Clock />
                    <span>{formatDate(article.time)}</span>
                  </S.Div13>
                  {draft ? (
                    <S.Span2>
                      <S.FileEdit />
                      未发布草稿
                    </S.Span2>
                  ) : (
                    <S.Span3>
                      <S.CheckCircle2 />
                      已发布
                    </S.Span3>
                  )}
                </S.Div12>

                {/* Content Excerpt - 1:1 aligned with frontend preview */}
                <S.Div14>
                  {article.content || (
                    <S.Span4>
                      （暂无正文内容）
                    </S.Span4>
                  )}
                </S.Div14>

                {/* Media thumbnail preview snippet */}
                {article.media && article.media.length > 0 && (
                  <S.Div15>
                    {article.media.slice(0, 3).map((m, idx) => (
                      <S.Div16
                        key={idx}

                      >
                        {m.type === "img" ? (
                          <S.Img
                            src={m.url}
                            alt=""

 />
                        ) : (
                          <S.Div17>
                            VID
                          </S.Div17>
                        )}
                      </S.Div16>
                    ))}
                    {article.media.length > 3 && (
                      <S.Span5>
                        +{article.media.length - 3}
                      </S.Span5>
                    )}
                  </S.Div15>
                )}

                {/* Bottom Badges & Hover Actions */}
                <S.Div18>
                  <S.Div19>
                    {article.location && (
                      <S.Span6>
                        <S.MapPin />
                        <S.Span7>{article.location}</S.Span7>
                      </S.Span6>
                    )}
                    {article.music && (
                      <S.Span6>
                        <S.Music2 />
                        <S.Span7>{article.music.title}</S.Span7>
                      </S.Span6>
                    )}
                  </S.Div19>

                  {/* Actions visible on hover or mobile touch */}
                  <S.Div20>
                    <S.Button8
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneArticle(article);
                      }}

                      title="复制文章"
                    >
                      <S.Copy />
                    </S.Button8>
                    <S.Button9
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteArticle(article, fp);
                      }}

                      title="删除文章"
                    >
                      <S.Trash2 />
                    </S.Button9>
                  </S.Div20>
                </S.Div18>
              </S.Div11>
            );
          })
        )}
      </S.Div9>
    </S.Div>
  );
};
