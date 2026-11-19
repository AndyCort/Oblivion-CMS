import * as S from "./NineGridMedia.styles";
import React, { useState } from "react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";
import { MediaLightbox } from "./MediaLightbox";
import { BatchAddModal } from "./BatchAddModal";

interface NineGridMediaProps {
  media: ArticleMedia[];
  onChange: (newMedia: ArticleMedia[]) => void;
  defaultBatchMediaType?: "auto" | ArticleMediaType;
}

export const NineGridMedia: React.FC<NineGridMediaProps> = ({
  media,
  onChange,
  defaultBatchMediaType = "auto",
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [newUrlInput, setNewUrlInput] = useState("");
  const [newTypeInput, setNewTypeInput] = useState<ArticleMediaType>("img");
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

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
    onChange(media.filter((_, i) => i !== index));
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

    const url = editUrlValue.trim();
    const updated = [...media];
    updated[editingIndex] = { ...updated[editingIndex], url };
    handleRetryMedia(url);
    onChange(updated);
    setEditingIndex(null);
    setEditUrlValue("");
  };

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlInput.trim()) return;

    onChange([...media, { type: newTypeInput, url: newUrlInput.trim() }]);
    setNewUrlInput("");
    setIsAddingSingle(false);
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

  const clearDrag = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <S.Root>
      <S.ToolbarRow>
        <S.BatchImportBtn
          type="button"
          onClick={() => setIsBatchModalOpen(true)}
        >
          <S.Layers />
          批量粘贴导入
        </S.BatchImportBtn>
      </S.ToolbarRow>

      <S.MediaGrid>
        {media.map((item, index) => {
          const isFailed = failedUrls.has(item.url);

          return (
            <S.MediaCard
              key={`${index}-${item.url}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={clearDrag}
              onClick={() => setLightboxIndex(index)}
              $isDragging={draggedIndex === index}
              $isOver={dragOverIndex === index}
              data-style-group
            >
              {isFailed ? (
                <S.ErrorFallback>
                  <S.AlertTriangle />
                  <S.ErrorLabel>加载异常</S.ErrorLabel>
                  <S.ErrorActions>
                    <S.ErrorActionBtn
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryMedia(item.url);
                      }}
                      title="重试"
                    >
                      <S.RotateCw />
                    </S.ErrorActionBtn>
                    <S.ErrorActionBtn
                      type="button"
                      onClick={(e) => handleStartEdit(index, e)}
                      title="修改 URL"
                    >
                      <S.Edit2 />
                    </S.ErrorActionBtn>
                  </S.ErrorActions>
                </S.ErrorFallback>
              ) : item.type === "img" ? (
                <S.ThumbImg
                  src={item.url}
                  alt=""
                  loading="lazy"
                  onError={() => handleMediaError(item.url)}
                />
              ) : (
                <S.VideoBox>
                  <S.ThumbVideo
                    src={item.url}
                    preload="metadata"
                    onError={() => handleMediaError(item.url)}
                  />
                  <S.VideoOverlay>
                    <S.PlayCircle>
                      <S.Play />
                    </S.PlayCircle>
                  </S.VideoOverlay>
                  <S.VideoBadge>VID</S.VideoBadge>
                </S.VideoBox>
              )}

              <S.IndexBadge>{index + 1}</S.IndexBadge>

              <S.CardActions>
                <S.CardActionBtn
                  type="button"
                  onClick={(e) => handleToggleType(index, e)}
                  title={item.type === "img" ? "切换为视频" : "切换为图片"}
                >
                  <S.ArrowLeftRight />
                </S.CardActionBtn>
                <S.CardActionBtn
                  type="button"
                  onClick={(e) => handleStartEdit(index, e)}
                  title="编辑 URL"
                >
                  <S.Edit2 />
                </S.CardActionBtn>
                <S.CardActionBtn
                  type="button"
                  $danger
                  onClick={(e) => handleDelete(index, e)}
                  title="删除"
                >
                  <S.Trash2 />
                </S.CardActionBtn>
              </S.CardActions>

              <S.DragOverlay>
                <S.DragHandleRow>
                  <S.DragHandle title="拖拽排序">
                    <S.GripVertical />
                  </S.DragHandle>
                </S.DragHandleRow>
                <S.PreviewHint>点击查看大图</S.PreviewHint>
              </S.DragOverlay>
            </S.MediaCard>
          );
        })}

        <S.AddCardBtn type="button" onClick={() => setIsAddingSingle(true)}>
          <S.AddIconCircle>
            <S.Plus />
          </S.AddIconCircle>
          <S.AddLabel>添加媒体</S.AddLabel>
        </S.AddCardBtn>
      </S.MediaGrid>

      {isAddingSingle && (
        <S.ModalOverlay>
          <S.ModalDialog>
            <S.ModalTitle>添加单项媒体</S.ModalTitle>
            <S.ModalForm onSubmit={handleAddSingle}>
              <S.TypeButtonsRow>
                <S.TypeButton
                  type="button"
                  onClick={() => setNewTypeInput("img")}
                  $active={newTypeInput === "img"}
                >
                  <S.ImageIcon /> 图片
                </S.TypeButton>
                <S.TypeButton
                  type="button"
                  onClick={() => setNewTypeInput("vid")}
                  $active={newTypeInput === "vid"}
                >
                  <S.VideoIcon /> 视频
                </S.TypeButton>
              </S.TypeButtonsRow>

              <div>
                <S.InputLabel>
                  媒体链接 URL (支持图片或视频直接访问地址)
                </S.InputLabel>
                <S.UrlInput
                  type="url"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  autoFocus
                />
              </div>

              <S.ModalActions>
                <S.ModalCancelBtn
                  type="button"
                  onClick={() => setIsAddingSingle(false)}
                >
                  取消
                </S.ModalCancelBtn>
                <S.ModalSubmitBtn type="submit" disabled={!newUrlInput.trim()}>
                  确定添加
                </S.ModalSubmitBtn>
              </S.ModalActions>
            </S.ModalForm>
          </S.ModalDialog>
        </S.ModalOverlay>
      )}

      {editingIndex !== null && (
        <S.ModalOverlay>
          <S.ModalDialog $wide>
            <S.ModalTitle>修改媒体链接 #{editingIndex + 1}</S.ModalTitle>
            <S.ModalForm $compact onSubmit={handleSaveEdit}>
              <S.UrlInput
                type="url"
                value={editUrlValue}
                onChange={(e) => setEditUrlValue(e.target.value)}
                autoFocus
              />
              <S.ModalActions>
                <S.ModalCancelBtn
                  type="button"
                  onClick={() => setEditingIndex(null)}
                >
                  取消
                </S.ModalCancelBtn>
                <S.ModalSubmitBtn type="submit">保存修改</S.ModalSubmitBtn>
              </S.ModalActions>
            </S.ModalForm>
          </S.ModalDialog>
        </S.ModalOverlay>
      )}

      <MediaLightbox
        media={media}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      <BatchAddModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onAdd={(newItems) => onChange([...media, ...newItems])}
        defaultMediaMode={defaultBatchMediaType}
      />
    </S.Root>
  );
};
