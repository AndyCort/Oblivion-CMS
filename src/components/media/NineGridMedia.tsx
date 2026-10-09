import * as S from './NineGridMedia.styles';
import React, { useState } from "react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";

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
    <S.Div>
      <S.Div2>
        <S.Label>
          <span>九宫格媒体</span>
          <S.Span>
            ({media.length} 项，支持自由混排与拖拽排序)
          </S.Span>
        </S.Label>
        <S.Button
          type="button"
          onClick={() => setIsBatchModalOpen(true)}

        >
          <S.Layers />
          批量粘贴导入
        </S.Button>
      </S.Div2>

      {/* 3-column Grid (QQ Space style) */}
      <S.Div3>
        {media.map((item, index) => {
          const isFailed = failedUrls.has(item.url);
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <S.Div4
              key={`${index}-${item.url}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(index, e)}
              onClick={() => setLightboxIndex(index)}
              $variant={((isDragging) && (isOver)) ? "v0" : ((isDragging) && (!(isOver))) ? "v1" : ((!(isDragging)) && (isOver)) ? "v2" : "v3"} data-style-group
            >
              {/* Media Preview */}
              {isFailed ? (
                <S.Div5>
                  <S.AlertTriangle />
                  <S.Span2>
                    加载异常
                  </S.Span2>
                  <S.Div6>
                    <S.Button2
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryMedia(item.url);
                      }}

                      title="重试"
                    >
                      <S.RotateCw />
                    </S.Button2>
                    <S.Button2
                      type="button"
                      onClick={(e) => handleStartEdit(index, e)}

                      title="修改 URL"
                    >
                      <S.Edit2 />
                    </S.Button2>
                  </S.Div6>
                </S.Div5>
              ) : item.type === "img" ? (
                <S.Img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  onError={() => handleMediaError(item.url)}

 />
              ) : (
                <S.Div7>
                  <S.Video
                    src={item.url}
                    preload="metadata"
                    onError={() => handleMediaError(item.url)}

 />
                  <S.Div8>
                    <S.Div9>
                      <S.Play />
                    </S.Div9>
                  </S.Div8>
                  <S.Span3>
                    VID
                  </S.Span3>
                </S.Div7>
              )}

              {/* Order index badge */}
              <S.Div10>
                {index + 1}
              </S.Div10>

              {/* Actions group: always visible & easy to tap on mobile, hover on desktop */}
              <S.Div11>
                <S.Button3
                  type="button"
                  onClick={(e) => handleToggleType(index, e)}

                  title={item.type === "img" ? "切换为视频" : "切换为图片"}
                >
                  <S.ArrowLeftRight />
                </S.Button3>
                <S.Button3
                  type="button"
                  onClick={(e) => handleStartEdit(index, e)}

                  title="编辑 URL"
                >
                  <S.Edit2 />
                </S.Button3>
                <S.Button4
                  type="button"
                  onClick={(e) => handleDelete(index, e)}

                  title="删除"
                >
                  <S.Trash2 />
                </S.Button4>
              </S.Div11>

              {/* Drag handle & Preview hint */}
              <S.Div12>
                <S.Div13>
                  <S.Div14

                    title="拖拽排序"
                  >
                    <S.GripVertical />
                  </S.Div14>
                </S.Div13>
                <S.Div15>
                  点击查看大图
                </S.Div15>
              </S.Div12>
            </S.Div4>
          );
        })}

        {/* Add Card (Always at the end) */}
        <S.Button5
          type="button"
          onClick={() => setIsAddingSingle(true)}

        >
          <S.Div16>
            <S.Plus />
          </S.Div16>
          <S.Span4>添加媒体</S.Span4>
        </S.Button5>
      </S.Div3>

      {/* Single Add Media Modal */}
      {isAddingSingle && (
        <S.Div17>
          <S.Div18>
            <S.H4>
              添加单项媒体
            </S.H4>
            <S.Form onSubmit={handleAddSingle} >
              <S.Div19>
                <S.Button6
                  type="button"
                  onClick={() => setNewTypeInput("img")}
                  $variant={((newTypeInput === "img")) ? "v0" : "v1"}
                >
                  <S.ImageIcon /> 图片
                </S.Button6>
                <S.Button6
                  type="button"
                  onClick={() => setNewTypeInput("vid")}
                  $variant={((newTypeInput === "vid")) ? "v0" : "v1"}
                >
                  <S.VideoIcon /> 视频
                </S.Button6>
              </S.Div19>

              <div>
                <S.Label2>
                  媒体链接 URL (支持图片或视频直接访问地址)
                </S.Label2>
                <S.Input
                  type="url"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"

                  autoFocus
 />
              </div>

              <S.Div20>
                <S.Button7
                  type="button"
                  onClick={() => setIsAddingSingle(false)}

                >
                  取消
                </S.Button7>
                <S.Button8
                  type="submit"
                  disabled={!newUrlInput.trim()}

                >
                  确定添加
                </S.Button8>
              </S.Div20>
            </S.Form>
          </S.Div18>
        </S.Div17>
      )}

      {/* Inline edit URL modal */}
      {editingIndex !== null && (
        <S.Div21>
          <S.Div22>
            <S.H4>
              修改媒体链接 #{editingIndex + 1}
            </S.H4>
            <S.Form2 onSubmit={handleSaveEdit} >
              <S.Input2
                type="url"
                value={editUrlValue}
                onChange={(e) => setEditUrlValue(e.target.value)}

                autoFocus
 />
              <S.Div23>
                <S.Button9
                  type="button"
                  onClick={() => setEditingIndex(null)}

                >
                  取消
                </S.Button9>
                <S.Button10
                  type="submit"

                >
                  保存修改
                </S.Button10>
              </S.Div23>
            </S.Form2>
          </S.Div22>
        </S.Div21>
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
    </S.Div>
  );
};
