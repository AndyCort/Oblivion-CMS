import React, { useState } from "react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";
import {
  Plus,
  Play,
  Trash2,
  Edit2,
  ArrowLeftRight,
  GripVertical,
  Image as ImageIcon,
  Video as VideoIcon,
  AlertTriangle,
  RotateCw,
  Layers,
} from "lucide-react";
import { MediaLightbox } from "./MediaLightbox";
import { BatchAddModal } from "./BatchAddModal";

interface NineGridMediaProps {
  media: ArticleMedia[];
  onChange: (newMedia: ArticleMedia[]) => void;
}

export const NineGridMedia: React.FC<NineGridMediaProps> = ({ media, onChange }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [newUrlInput, setNewUrlInput] = useState("");
  const [newTypeInput, setNewTypeInput] = useState<ArticleMediaType>("img");
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleMediaError = (url: string) => {
    setFailedUrls((prev) => new Set(prev).add(url));
  };

  const handleRetryMedia = (url: string) => {
    setFailedUrls((prev) => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const handleDelete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = media.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleToggleType = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...media];
    const target = updated[index];
    updated[index] = {
      ...target,
      type: target.type === "img" ? "vid" : "img",
    };
    onChange(updated);
  };

  const handleStartEdit = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditUrlValue(media[index].url);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editUrlValue.trim()) return;

    const updated = [...media];
    updated[editingIndex] = {
      ...updated[editingIndex],
      url: editUrlValue.trim(),
    };
    handleRetryMedia(editUrlValue.trim());
    onChange(updated);
    setEditingIndex(null);
    setEditUrlValue("");
  };

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;

    const updated = [
      ...media,
      {
        type: newTypeInput,
        url: newUrlInput.trim(),
      },
    ];
    onChange(updated);
    setNewUrlInput("");
    setIsAddingSingle(false);
  };

  const handleBatchAdd = (newItems: ArticleMedia[]) => {
    onChange([...media, ...newItems]);
  };

  // Drag & drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...media];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moved);

    onChange(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch drag support for mobile Safari
  const touchStartY = React.useRef<number>(0);
  const touchStartIndex = React.useRef<number | null>(null);

  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    touchStartIndex.current = index;
    touchStartY.current = e.touches[0].clientY;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>九宫格媒体</span>
          <span className="text-stone-400 dark:text-stone-600 font-normal">
            ({media.length} 项，支持自由混排与拖拽排序)
          </span>
        </label>
        <button
          type="button"
          onClick={() => setIsBatchModalOpen(true)}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 font-medium"
        >
          <Layers className="w-3.5 h-3.5" />
          批量粘贴导入
        </button>
      </div>

      {/* 3-column Grid (QQ Space style) */}
      <div className="grid grid-cols-3 gap-3">
        {media.map((item, index) => {
          const isFailed = failedUrls.has(item.url);
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={`${index}-${item.url}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(index, e)}
              onClick={() => setLightboxIndex(index)}
              className={`group relative aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-sm cursor-pointer select-none transition-all duration-200 ${
                isDragging ? "opacity-30 scale-95" : ""
              } ${isOver ? "ring-2 ring-indigo-500 scale-102" : "hover:shadow-md"}`}
            >
              {/* Media Preview */}
              {isFailed ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-200/50 dark:bg-stone-800">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mb-1" />
                  <span className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                    加载异常
                  </span>
                  <div className="flex gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryMedia(item.url);
                      }}
                      className="p-1 rounded bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50"
                      title="重试"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(index, e)}
                      className="p-1 rounded bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50"
                      title="修改 URL"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : item.type === "img" ? (
                <img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  onError={() => handleMediaError(item.url)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full relative bg-stone-900 flex items-center justify-center">
                  <video
                    src={item.url}
                    preload="metadata"
                    onError={() => handleMediaError(item.url)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center shadow-lg backdrop-blur-xs">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                    VID
                  </span>
                </div>
              )}

              {/* Order index badge */}
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-[10px] font-mono text-white/90">
                {index + 1}
              </div>

              {/* Actions group: always visible & easy to tap on mobile, hover on desktop */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => handleToggleType(index, e)}
                  className="w-6 h-6 rounded-md bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs active:scale-90 transition-transform"
                  title={item.type === "img" ? "切换为视频" : "切换为图片"}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleStartEdit(index, e)}
                  className="w-6 h-6 rounded-md bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs active:scale-90 transition-transform"
                  title="编辑 URL"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(index, e)}
                  className="w-6 h-6 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-xs shadow-xs active:scale-90 transition-transform"
                  title="删除"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Drag handle & Preview hint */}
              <div className="absolute inset-0 bg-black/30 opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 pointer-events-none">
                <div className="flex items-center">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 rounded-md bg-black/50 text-white pointer-events-auto"
                    title="拖拽排序"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-center text-[11px] text-white/90 font-medium pb-1 drop-shadow">
                  点击查看大图
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Card (Always at the end) */}
        <button
          type="button"
          onClick={() => setIsAddingSingle(true)}
          className="aspect-square rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 flex flex-col items-center justify-center gap-1 text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors active:scale-95"
        >
          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center">
            <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-medium">添加媒体</span>
        </button>
      </div>

      {/* Single Add Media Modal */}
      {isAddingSingle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
              添加单项媒体
            </h4>
            <form onSubmit={handleAddSingle} className="space-y-3.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewTypeInput("img")}
                  className={`flex-1 text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                    newTypeInput === "img"
                      ? "bg-indigo-600 text-white font-medium shadow-xs"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> 图片
                </button>
                <button
                  type="button"
                  onClick={() => setNewTypeInput("vid")}
                  className={`flex-1 text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                    newTypeInput === "vid"
                      ? "bg-indigo-600 text-white font-medium shadow-xs"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <VideoIcon className="w-3.5 h-3.5" /> 视频
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                  媒体链接 URL (支持图片或视频直接访问地址)
                </label>
                <input
                  type="url"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full text-sm sm:text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingSingle(false)}
                  className="px-3.5 py-2 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!newUrlInput.trim()}
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl disabled:opacity-50 shadow-xs"
                >
                  确定添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline edit URL modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
              修改媒体链接 #{editingIndex + 1}
            </h4>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input
                type="url"
                value={editUrlValue}
                onChange={(e) => setEditUrlValue(e.target.value)}
                className="w-full text-sm font-mono p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <MediaLightbox
        media={media}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      {/* Batch Import Modal */}
      <BatchAddModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onAdd={handleBatchAdd}
      />
    </div>
  );
};
