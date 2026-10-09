import * as S from './BatchAddModal.styles';
import React, { useState } from "react";
import type { ArticleMedia, ArticleMediaType } from "../../types/article";


interface BatchAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (items: ArticleMedia[]) => void;
}

export const BatchAddModal: React.FC<BatchAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [urlsText, setUrlsText] = useState("");
  const [defaultType, setDefaultType] = useState<"auto" | ArticleMediaType>("auto");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = urlsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && (l.startsWith("http://") || l.startsWith("https://") || l.startsWith("/")));

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
        } else {
          type = "img";
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
    <S.Div>
      <S.Div2>
        <S.Div3>
          <S.Div4>
            <S.Layers />
            <S.H3>
              批量添加媒体链接
            </S.H3>
          </S.Div4>
          <S.Button
            onClick={onClose}
            type="button"

          >
            <S.X />
          </S.Button>
        </S.Div3>

        <S.Form onSubmit={handleSubmit} >
          <div>
            <S.Label>
              每行粘贴一个图片或视频 URL（支持多行）
            </S.Label>
            <S.Textarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/video1.mp4"
              rows={5}

              autoFocus
 />
          </div>

          <S.Div5>
            <S.Span>
              媒体类型判断：
            </S.Span>
            <S.Div6>
              <S.Button2
                type="button"
                onClick={() => setDefaultType("auto")}
                $variant={((defaultType === "auto")) ? "v0" : "v1"}
              >
                智能推测
              </S.Button2>
              <S.Button2
                type="button"
                onClick={() => setDefaultType("img")}
                $variant={((defaultType === "img")) ? "v0" : "v1"}
              >
                全部作为图片
              </S.Button2>
              <S.Button2
                type="button"
                onClick={() => setDefaultType("vid")}
                $variant={((defaultType === "vid")) ? "v0" : "v1"}
              >
                全部作为视频
              </S.Button2>
            </S.Div6>
          </S.Div5>

          <S.Div7>
            <S.Button3
              type="button"
              onClick={onClose}

            >
              取消
            </S.Button3>
            <S.Button4
              type="submit"
              disabled={!urlsText.trim()}

            >
              <S.Plus />
              添加至媒体库
            </S.Button4>
          </S.Div7>
        </S.Form>
      </S.Div2>
    </S.Div>
  );
};
