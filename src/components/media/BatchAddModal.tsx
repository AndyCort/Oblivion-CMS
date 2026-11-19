import * as S from "./BatchAddModal.styles";
import React, { useEffect, useState } from "react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";

interface BatchAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (items: ArticleMedia[]) => void;
  defaultMediaMode?: "auto" | ArticleMediaType;
}

export const BatchAddModal: React.FC<BatchAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultMediaMode = "auto",
}) => {
  const [urlsText, setUrlsText] = useState("");
  const [defaultType, setDefaultType] = useState<"auto" | ArticleMediaType>(
    defaultMediaMode,
  );

  useEffect(() => {
    if (isOpen) {
      setDefaultType(defaultMediaMode);
    }
  }, [isOpen, defaultMediaMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = urlsText
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) =>
          l.length > 0 &&
          (l.startsWith("http://") ||
            l.startsWith("https://") ||
            l.startsWith("/")),
      );

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
    <S.Overlay>
      <S.Dialog>
        <S.HeaderRow>
          <S.TitleGroup>
            <S.Layers />
            <S.Title>批量添加媒体链接</S.Title>
          </S.TitleGroup>
          <S.CloseBtn onClick={onClose} type="button">
            <S.X />
          </S.CloseBtn>
        </S.HeaderRow>

        <S.Form onSubmit={handleSubmit}>
          <div>
            <S.FieldLabel>
              每行粘贴一个图片或视频 URL（支持多行）
            </S.FieldLabel>
            <S.Textarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/video1.mp4"
              rows={5}
              autoFocus
            />
          </div>

          <S.ModeRow>
            <S.ModeLabel>媒体类型判断：</S.ModeLabel>
            <S.ModeButtons>
              {(
                [
                  ["auto", "智能推测"],
                  ["img", "全部作为图片"],
                  ["vid", "全部作为视频"],
                ] as const
              ).map(([mode, label]) => (
                <S.ModeButton
                  key={mode}
                  type="button"
                  onClick={() => setDefaultType(mode)}
                  $active={defaultType === mode}
                >
                  {label}
                </S.ModeButton>
              ))}
            </S.ModeButtons>
          </S.ModeRow>

          <S.FooterRow>
            <S.CancelBtn type="button" onClick={onClose}>
              取消
            </S.CancelBtn>
            <S.SubmitBtn type="submit" disabled={!urlsText.trim()}>
              <S.Plus />
              添加至媒体库
            </S.SubmitBtn>
          </S.FooterRow>
        </S.Form>
      </S.Dialog>
    </S.Overlay>
  );
};
