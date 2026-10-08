import React, { useEffect, useRef } from "react";
import type { ArticleMedia } from "../../types/article";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

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

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none"
    >
      {/* Top action bar */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <span className="text-stone-400 text-sm font-mono">
          {currentIndex + 1} / {media.length}
        </span>
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.pause();
            onClose();
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="关闭 (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
          title="上一张 (←)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
          title="下一张 (→)"
        >
          <ChevronRight className="w-6 h-6" />
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
