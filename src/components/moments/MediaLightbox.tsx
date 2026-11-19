import * as S from "./MediaLightbox.styles";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ArticleMedia } from "../../types/article";

interface MediaLightboxProps {
  media: ArticleMedia[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function MediaLightbox({
  media,
  currentIndex,
  onClose,
  onNavigate,
}: MediaLightboxProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      else if (e.key === "ArrowRight" && currentIndex < media.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      videoRef.current?.pause();
    };
  }, [currentIndex, media.length, onClose, onNavigate]);

  if (currentIndex === null || !media[currentIndex]) return null;

  const currentItem = media[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  const handleClose = () => {
    videoRef.current?.pause();
    onClose();
  };

  return (
    <S.Overlay
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onTouchStart={(e) => {
        touchStartXRef.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartXRef.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartXRef.current;
        if (diff > 50 && hasPrev) onNavigate(currentIndex - 1);
        else if (diff < -50 && hasNext) onNavigate(currentIndex + 1);
        touchStartXRef.current = null;
      }}
    >
      <S.TopBar>
        <S.CounterBadge>
          {currentIndex + 1} / {media.length}
        </S.CounterBadge>
        <S.CloseBtn type="button" onClick={handleClose} title="关闭 (Esc)">
          <X size={20} />
        </S.CloseBtn>
      </S.TopBar>

      {hasPrev && (
        <S.NavBtn
          type="button"
          $side="left"
          onClick={() => onNavigate(currentIndex - 1)}
          title="上一张 (←)"
        >
          <ChevronLeft size={22} />
        </S.NavBtn>
      )}

      {hasNext && (
        <S.NavBtn
          type="button"
          $side="right"
          onClick={() => onNavigate(currentIndex + 1)}
          title="下一张 (→)"
        >
          <ChevronRight size={22} />
        </S.NavBtn>
      )}

      <S.Stage>
        {currentItem.type === "img" ? (
          <S.LightboxImg src={currentItem.url} alt="" />
        ) : (
          <S.VideoWrap>
            <S.LightboxVideo
              ref={videoRef}
              src={currentItem.url}
              controls
              autoPlay
              playsInline
            />
          </S.VideoWrap>
        )}
      </S.Stage>
    </S.Overlay>
  );
}
