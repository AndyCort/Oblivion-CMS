import React from "react";
import type { Article } from "../../types/article";
import { MapPin, Music2, Eye, Play } from "lucide-react";

interface MomentPreviewProps {
  article: Article;
}

function formatDisplayDate(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const MomentPreview: React.FC<MomentPreviewProps> = ({ article }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>博客前台实时渲染预览</span>
        </span>
        <span className="text-[11px] text-stone-400 font-normal">
          (与 Oblivion 前台 1:1 视觉对齐)
        </span>
      </div>

      <div className="rounded-2xl border border-stone-800/80 bg-stone-950 text-white p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Card Header: Avatar & Author */}
        <header className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
            <img
              src="https://raw.githubusercontent.com/AndyCort/PicGo/master/img/6C93394B-9A64-4DCE-BA19-3E6A316120D1_1_201_a.jpeg"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-medium text-sm text-stone-100">Andy</div>
        </header>

        {/* Content text: whitespace-pre-wrap */}
        <div className="text-stone-200 text-sm leading-relaxed whitespace-pre-wrap font-serif tracking-wide mb-4 select-text">
          {article.content || (
            <span className="text-stone-500 italic">（暂无正文内容）</span>
          )}
        </div>

        {/* 3-Column Media Grid */}
        {article.media && article.media.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
            {article.media.map((item, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden bg-stone-900 border border-white/10 relative"
              >
                {item.type === "img" ? (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center shadow">
                        <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-3 text-xs font-serif">
            {article.tags.map((t) => (
              <span key={t} className="text-indigo-300">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {article.location && (
          <div className="flex items-center gap-1.5 text-xs text-stone-400 font-serif mb-4">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" />
            <span>{article.location}</span>
          </div>
        )}

        {/* Card Footer: Time & Music */}
        <footer className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span>{formatDisplayDate(article.time)}</span>

          {article.music && (
            <span className="flex items-center gap-1.5 text-stone-300 truncate max-w-[50%]">
              <Music2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">
                {article.music.title} - {article.music.artist}
              </span>
            </span>
          )}
        </footer>
      </div>
    </div>
  );
};
