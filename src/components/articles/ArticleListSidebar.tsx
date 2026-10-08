import React, { useState, useMemo } from "react";
import type { Article, ArticleDraft } from "../../types/article";
import {
  Search,
  Plus,
  ArrowUpDown,
  Filter,
  Image as ImageIcon,
  Music2,
  MapPin,
  Trash2,
  Copy,
  Clock,
  Sparkles,
  CheckCircle2,
  FileEdit,
} from "lucide-react";

interface ArticleListSidebarProps {
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
    <div className="h-full flex flex-col bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800">
      {/* Sidebar Header & New Article Button */}
      <div className="p-3.5 border-b border-stone-100 dark:border-stone-800 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              文章列表
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono">
              {filteredArticles.length} / {articles.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onNewArticle}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            发表新说说
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索正文、地点、标签、音乐..."
            className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter chips & Sort toggle */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setFilterDraftOnly(!filterDraftOnly)}
              className={`px-2 py-0.5 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                filterDraftOnly
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium border border-amber-300/60"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
              }`}
            >
              草稿 ({drafts.size})
            </button>
            <button
              type="button"
              onClick={() => setFilterMediaOnly(!filterMediaOnly)}
              className={`px-2 py-0.5 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                filterMediaOnly
                  ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-300/60"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
              }`}
            >
              带媒体
            </button>
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="px-2 py-0.5 rounded-lg text-[11px] bg-indigo-600 text-white flex items-center gap-1"
              >
                #{selectedTag} ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 shrink-0 ml-2"
            title="切换时间排序"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === "desc" ? "最新优先" : "最早优先"}
          </button>
        </div>

        {/* Tag pills bar */}
        {allTagsWithCount.length > 0 && !selectedTag && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {allTagsWithCount.slice(0, 6).map((t) => (
              <button
                key={t.tag}
                type="button"
                onClick={() => setSelectedTag(t.tag)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 shrink-0"
              >
                #{t.tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article List Cards */}
      <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/80">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center text-stone-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto stroke-1 opacity-60" />
            <p className="text-xs">暂无符合条件的文章</p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const fp = getFingerprint(article);
            const isSelected = selectedFingerprint === fp;
            const draft = drafts.get(fp);

            return (
              <div
                key={fp}
                onClick={() => onSelectArticle(fp)}
                className={`p-3.5 cursor-pointer transition-colors relative group ${
                  isSelected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-l-3 border-indigo-600"
                    : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
                }`}
              >
                {/* Meta row: Date & status */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{formatDate(article.time)}</span>
                  </div>
                  {draft ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-medium">
                      <FileEdit className="w-2.5 h-2.5" />
                      未发布草稿
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      已发布
                    </span>
                  )}
                </div>

                {/* Content Excerpt - 1:1 aligned with frontend preview */}
                <div className="text-xs sm:text-[13px] text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap font-serif tracking-wide mb-2 select-text break-words">
                  {article.content || (
                    <span className="text-stone-400 dark:text-stone-500 italic">
                      （暂无正文内容）
                    </span>
                  )}
                </div>

                {/* Media thumbnail preview snippet */}
                {article.media && article.media.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {article.media.slice(0, 3).map((m, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-md overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700"
                      >
                        {m.type === "img" ? (
                          <img
                            src={m.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-900 flex items-center justify-center text-[8px] text-white font-bold">
                            VID
                          </div>
                        )}
                      </div>
                    ))}
                    {article.media.length > 3 && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        +{article.media.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Badges & Hover Actions */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <div className="flex items-center gap-2 overflow-hidden truncate">
                    {article.location && (
                      <span className="flex items-center gap-0.5 truncate text-stone-500">
                        <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{article.location}</span>
                      </span>
                    )}
                    {article.music && (
                      <span className="flex items-center gap-0.5 truncate text-stone-500">
                        <Music2 className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{article.music.title}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions visible on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloneArticle(article);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700/60"
                      title="复制文章"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteArticle(article, fp);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="删除文章"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
