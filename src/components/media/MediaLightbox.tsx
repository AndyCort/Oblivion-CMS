import * as S from "./MediaLightbox.styles";
import React, { useEffect, useRef } from "react";
import type { ArticleMedia } from "../../types/article";

interface MediaLightboxProps {
  media: ArticleMedia[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  media,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < media.length - 1) {
        onNavigate(currentIndex + 1);
      }
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 50 && hasPrev) onNavigate(currentIndex - 1);
    else if (diff < -50 && hasNext) onNavigate(currentIndex + 1);
    touchStartXRef.current = null;
  };

  return (
    <S.Overlay
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <S.TopBar>
        <S.CounterBadge>
          {currentIndex + 1} / {media.length}
        </S.CounterBadge>
        <S.CloseBtn type="button" onClick={handleClose} title="关闭 (Esc)">
          <S.X />
        </S.CloseBtn>
      </S.TopBar>

      {hasPrev && (
        <S.NavBtn
          type="button"
          $side="left"
          onClick={() => onNavigate(currentIndex - 1)}
          title="上一张 (←)"
        >
          <S.ChevronLeft />
        </S.NavBtn>
      )}

      {hasNext && (
        <S.NavBtn
          type="button"
          $side="right"
          onClick={() => onNavigate(currentIndex + 1)}
          title="下一张 (→)"
        >
          <S.ChevronRight />
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
};
