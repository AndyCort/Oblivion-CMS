import * as S from "./NineGridMedia.styles";
import { useState, type FormEvent, type MouseEvent } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  Edit2,
  GripVertical,
  Layers,
  Play,
  Plus,
  RotateCw,
  Trash2,
} from "lucide-react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";
import { BaseModal, ModalButton } from "../workspace/BaseModal";
import { MediaLightbox } from "./MediaLightbox";

interface NineGridMediaProps {
  media: ArticleMedia[];
  onChange: (newMedia: ArticleMedia[]) => void;
}

function inferMediaType(
  url: string,
  mode: "auto" | ArticleMediaType,
): ArticleMediaType {
  if (mode !== "auto") return mode;
  const lower = url.toLowerCase();
  if (
    /\.(mp4|webm|mov|m4v)($|\?)/.test(lower) ||
    lower.includes("/video/") ||
    lower.includes("download/video")
  ) {
    return "vid";
  }
  return "img";
}

export function NineGridMedia({ media, onChange }: NineGridMediaProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [urlsText, setUrlsText] = useState("");
  const [mediaMode, setMediaMode] = useState<"auto" | ArticleMediaType>("auto");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const retryUrl = (url: string) => {
    setFailedUrls((prev) => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const handleToggleType = (index: number, e: MouseEvent) => {
    e.stopPropagation();
    const updated = [...media];
    updated[index] = {
      ...updated[index],
      type: updated[index].type === "img" ? "vid" : "img",
    };
    onChange(updated);
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const lines = urlsText
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) =>
          l.startsWith("http://") ||
          l.startsWith("https://") ||
          l.startsWith("/"),
      );
    if (!lines.length) return;
    onChange([
      ...media,
      ...lines.map((url) => ({ type: inferMediaType(url, mediaMode), url })),
    ]);
    setUrlsText("");
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editUrlValue.trim()) return;
    const url = editUrlValue.trim();
    const updated = [...media];
    updated[editingIndex] = { ...updated[editingIndex], url };
    retryUrl(url);
    onChange(updated);
    setEditingIndex(null);
    setEditUrlValue("");
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const reordered = [...media];
      const [moved] = reordered.splice(draggedIndex, 1);
      reordered.splice(index, 0, moved);
      onChange(reordered);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <S.Root>
      <S.ToolbarRow>
        <S.BatchBtn type="button" onClick={() => setIsAddOpen(true)}>
          <Layers size={14} />
          添加 / 批量粘贴媒体
        </S.BatchBtn>
      </S.ToolbarRow>

      <S.MediaGrid>
        {media.map((item, index) => {
          const isFailed = failedUrls.has(item.url);
          return (
            <S.MediaCard
              key={`${index}-${item.url}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                if (draggedIndex !== null && draggedIndex !== index) {
                  setDragOverIndex(index);
                }
              }}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              onClick={() => setLightboxIndex(index)}
              $isDragging={draggedIndex === index}
              $isOver={dragOverIndex === index}
            >
              {isFailed ? (
                <S.ErrorFallback>
                  <AlertTriangle size={20} />
                  <span>加载异常</span>
                  <S.ErrorActions>
                    <S.SmallBtn
                      type="button"
                      title="重试"
                      onClick={(e) => {
                        e.stopPropagation();
                        retryUrl(item.url);
                      }}
                    >
                      <RotateCw size={12} />
                    </S.SmallBtn>
                    <S.SmallBtn
                      type="button"
                      title="修改 URL"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingIndex(index);
                        setEditUrlValue(item.url);
                      }}
                    >
                      <Edit2 size={12} />
                    </S.SmallBtn>
                  </S.ErrorActions>
                </S.ErrorFallback>
              ) : item.type === "img" ? (
                <S.ThumbMedia
                  src={item.url}
                  alt=""
                  loading="lazy"
                  onError={() =>
                    setFailedUrls((prev) => new Set(prev).add(item.url))
                  }
                />
              ) : (
                <>
                  <S.ThumbVideo
                    src={item.url}
                    preload="metadata"
                    onError={() =>
                      setFailedUrls((prev) => new Set(prev).add(item.url))
                    }
                  />
                  <S.VideoOverlay>
                    <S.PlayCircle>
                      <Play size={15} fill="currentColor" />
                    </S.PlayCircle>
                  </S.VideoOverlay>
                  <S.VideoBadge>VID</S.VideoBadge>
                </>
              )}

              <S.IndexBadge>{index + 1}</S.IndexBadge>

              <S.CardActions>
                <S.CardActionBtn
                  type="button"
                  onClick={(e) => handleToggleType(index, e)}
                  title={item.type === "img" ? "切换为视频" : "切换为图片"}
                >
                  <ArrowLeftRight size={12} />
                </S.CardActionBtn>
                <S.CardActionBtn
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingIndex(index);
                    setEditUrlValue(item.url);
                  }}
                  title="编辑 URL"
                >
                  <Edit2 size={12} />
                </S.CardActionBtn>
                <S.CardActionBtn
                  type="button"
                  $danger
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(media.filter((_, i) => i !== index));
                  }}
                  title="删除"
                >
                  <Trash2 size={12} />
                </S.CardActionBtn>
              </S.CardActions>

              <S.DragOverlay>
                <GripVertical size={14} />
                <span>点击查看大图</span>
              </S.DragOverlay>
            </S.MediaCard>
          );
        })}

        <S.AddCardBtn type="button" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} />
          <span>添加媒体</span>
        </S.AddCardBtn>
      </S.MediaGrid>

      <BaseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="添加媒体链接"
        subtitle="支持单条粘贴或多行批量粘贴 URL"
        icon={<Layers size={16} />}
        maxWidth="480px"
      >
        <S.ModalForm onSubmit={handleAddSubmit}>
          <S.ModalTextarea
            rows={5}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            placeholder={"https://example.com/photo.jpg\nhttps://example.com/video.mp4"}
            autoFocus
          />
          <S.ModeRow>
            <span>类型：</span>
            {(
              [
                ["auto", "智能推测"],
                ["img", "全部图片"],
                ["vid", "全部视频"],
              ] as const
            ).map(([mode, label]) => (
              <S.ModeBtn
                key={mode}
                type="button"
                $active={mediaMode === mode}
                onClick={() => setMediaMode(mode)}
              >
                {label}
              </S.ModeBtn>
            ))}
          </S.ModeRow>
          <S.ModalActions>
            <ModalButton type="button" onClick={() => setIsAddOpen(false)}>
              取消
            </ModalButton>
            <ModalButton type="submit" $tone="primary" disabled={!urlsText.trim()}>
              <Plus size={14} />
              添加到九宫格
            </ModalButton>
          </S.ModalActions>
        </S.ModalForm>
      </BaseModal>

      <BaseModal
        isOpen={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        title={`修改媒体链接 #${(editingIndex ?? 0) + 1}`}
        icon={<Edit2 size={16} />}
        maxWidth="460px"
      >
        <S.ModalForm onSubmit={handleSaveEdit}>
          <S.ModalInput
            type="url"
            value={editUrlValue}
            onChange={(e) => setEditUrlValue(e.target.value)}
            autoFocus
          />
          <S.ModalActions>
            <ModalButton type="button" onClick={() => setEditingIndex(null)}>
              取消
            </ModalButton>
            <ModalButton type="submit" $tone="primary" disabled={!editUrlValue.trim()}>
              保存修改
            </ModalButton>
          </S.ModalActions>
        </S.ModalForm>
      </BaseModal>

      <MediaLightbox
        media={media}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </S.Root>
  );
}
