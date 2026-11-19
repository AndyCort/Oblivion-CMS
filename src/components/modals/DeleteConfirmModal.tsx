import * as S from "./DeleteConfirmModal.styles";
import React from "react";
import type { Article } from "../../types/article";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  article?: Article | null;
  title?: string;
  description?: string;
  previewText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  article,
  title,
  description,
  previewText,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || (!article && !previewText)) return null;

  return (
    <S.Overlay>
      <S.Dialog>
        <S.HeaderRow>
          <S.IconBox>
            <S.AlertTriangle />
          </S.IconBox>
          <S.TitleBox>
            <S.Title>{title || "确认删除该文章？"}</S.Title>
            <S.Description>
              {description ||
                "此操作将直接从 Cloudflare D1 数据库中删除该文章记录。"}
            </S.Description>
          </S.TitleBox>
          <S.CloseBtn type="button" onClick={onClose}>
            <S.X />
          </S.CloseBtn>
        </S.HeaderRow>

        <S.PreviewBox>
          {previewText ?? article?.content ?? "（无文本内容）"}
        </S.PreviewBox>

        <S.FooterRow>
          <S.CancelBtn type="button" onClick={onClose} disabled={isDeleting}>
            取消
          </S.CancelBtn>
          <S.ConfirmBtn type="button" onClick={onConfirm} disabled={isDeleting}>
            <S.Trash2 />
            {isDeleting ? "正在删除..." : "确认删除"}
          </S.ConfirmBtn>
        </S.FooterRow>
      </S.Dialog>
    </S.Overlay>
  );
};
