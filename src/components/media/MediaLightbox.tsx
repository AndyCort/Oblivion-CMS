import React, { useEffect, useRef } from "react";
import type { ArticleMedia } from "../../types/article";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 select-none"
    >
      {/* Top action bar */}
      <div className="absolute top-4 right-4 pt-safe flex items-center gap-3 z-20">
        <span className="text-stone-300 text-xs sm:text-sm font-mono bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
          {currentIndex + 1} / {media.length}
        </span>
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.pause();
            onClose();
          }}
          className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white transition-colors"
          title="关闭 (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-2 sm:left-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 text-white transition-colors z-20 backdrop-blur-xs"
          title="上一张 (←)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-2 sm:right-4 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 text-white transition-colors z-20 backdrop-blur-xs"
          title="下一张 (→)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Media content */}
      <div className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center p-2">
        {currentItem.type === "img" ? (
          <img
            src={currentItem.url}
            alt=""
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform"
          />
        ) : (
          <div className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentItem.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};
