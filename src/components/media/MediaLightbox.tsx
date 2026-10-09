import * as S from './MediaLightbox.styles';
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

  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) onNavigate(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        if (currentIndex < media.length - 1) onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Clean up video playback
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [currentIndex, media.length, onClose, onNavigate]);

  if (currentIndex === null || !media[currentIndex]) return null;

  const currentItem = media[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (videoRef.current) videoRef.current.pause();
      onClose();
    }
  };

  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 50 && hasPrev) {
      onNavigate(currentIndex - 1);
    } else if (diff < -50 && hasNext) {
      onNavigate(currentIndex + 1);
    }
    touchStartXRef.current = null;
  };

  return (
    <S.Div
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}

    >
      {/* Top action bar */}
      <S.Div2>
        <S.Span>
          {currentIndex + 1} / {media.length}
        </S.Span>
        <S.Button
          onClick={() => {
            if (videoRef.current) videoRef.current.pause();
            onClose();
          }}

          title="关闭 (Esc)"
        >
          <S.X />
        </S.Button>
      </S.Div2>

      {/* Prev button */}
      {hasPrev && (
        <S.Button2
          onClick={() => onNavigate(currentIndex - 1)}

          title="上一张 (←)"
        >
          <S.ChevronLeft />
        </S.Button2>
      )}

      {/* Next button */}
      {hasNext && (
        <S.Button3
          onClick={() => onNavigate(currentIndex + 1)}

          title="下一张 (→)"
        >
          <S.ChevronRight />
        </S.Button3>
      )}

      {/* Media content */}
      <S.Div3>
        {currentItem.type === "img" ? (
          <S.Img
            src={currentItem.url}
            alt=""

 />
        ) : (
          <S.Div4>
            <S.Video
              ref={videoRef}
              src={currentItem.url}
              controls
              autoPlay
              playsInline

 />
          </S.Div4>
        )}
      </S.Div3>
    </S.Div>
  );
};
