import React, { useState } from "react";
import type { ArticleMusic } from "../../types/article";
import { Music2, Trash2, ExternalLink, Plus, Edit2 } from "lucide-react";

interface MusicEditorProps {
  music?: ArticleMusic;
  onChange: (music?: ArticleMusic) => void;
}

export const MusicEditor: React.FC<MusicEditorProps> = ({ music, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(music?.title || "");
  const [artist, setArtist] = useState(music?.artist || "");
  const [url, setUrl] = useState(music?.url || "");

  const handleOpenAdd = () => {
    setTitle("");
    setArtist("");
    setUrl("");
    setIsEditing(true);
  };

  const handleOpenEdit = () => {
    setTitle(music?.title || "");
    setArtist(music?.artist || "");
    setUrl(music?.url || "");
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !artist.trim() && !url.trim()) {
      onChange(undefined);
    } else {
      onChange({
        title: title.trim(),
        artist: artist.trim(),
        url: url.trim(),
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    onChange(undefined);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Music2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>背景音乐 (可选)</span>
        </label>
        {music && !isEditing && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              编辑
            </button>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              移除
            </button>
          </div>
        )}
      </div>

      {!music && !isEditing ? (
        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 text-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加音乐信息 (歌名、歌手、链接)
        </button>
      ) : isEditing ? (
        <form
          onSubmit={handleSave}
          className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3"
        >
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                歌曲名称
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: Sorrow Love"
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                艺术家 / 歌手
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="例如: Someone"
                className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
              音乐链接 (网页或音频 URL)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/music"
              className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
            >
              确定
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Music2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                {music?.title || "未命名曲目"}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {music?.artist || "未知艺术家"}
              </div>
            </div>
          </div>
          {music?.url && (
            <a
              href={music.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 shrink-0"
              title="打开音乐链接"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
