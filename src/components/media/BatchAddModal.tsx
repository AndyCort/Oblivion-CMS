import React, { useState } from "react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";
import { X, Layers, Plus } from "lucide-react";

interface BatchAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (items: ArticleMedia[]) => void;
}

export const BatchAddModal: React.FC<BatchAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [urlsText, setUrlsText] = useState("");
  const [defaultType, setDefaultType] = useState<"auto" | ArticleMediaType>("auto");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = urlsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && (l.startsWith("http://") || l.startsWith("https://") || l.startsWith("/")));

    if (lines.length === 0) return;

    const newItems: ArticleMedia[] = lines.map((url) => {
      let type: ArticleMediaType = "img";
      if (defaultType === "auto") {
        const lower = url.toLowerCase();
        if (
          lower.endsWith(".mp4") ||
          lower.endsWith(".webm") ||
          lower.endsWith(".mov") ||
          lower.includes("/video/") ||
          lower.includes("download/video")
        ) {
          type = "vid";
        } else {
          type = "img";
        }
      } else {
        type = defaultType;
      }

      return { type, url };
    });

    onAdd(newItems);
    setUrlsText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
              批量添加媒体链接
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              每行粘贴一个图片或视频 URL（支持多行）
            </label>
            <textarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/video1.mp4"
              rows={6}
              className="w-full text-sm font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 dark:text-stone-100"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 dark:text-stone-400">
              媒体类型判断：
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDefaultType("auto")}
                className={`px-2.5 py-1 text-xs rounded-lg border ${
                  defaultType === "auto"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-600 dark:text-indigo-400 font-medium"
                    : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                }`}
              >
                智能推测
              </button>
              <button
                type="button"
                onClick={() => setDefaultType("img")}
                className={`px-2.5 py-1 text-xs rounded-lg border ${
                  defaultType === "img"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-600 dark:text-indigo-400 font-medium"
                    : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                }`}
              >
                全部作为图片
              </button>
              <button
                type="button"
                onClick={() => setDefaultType("vid")}
                className={`px-2.5 py-1 text-xs rounded-lg border ${
                  defaultType === "vid"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-600 dark:text-indigo-400 font-medium"
                    : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                }`}
              >
                全部作为视频
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!urlsText.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              添加至媒体库
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
