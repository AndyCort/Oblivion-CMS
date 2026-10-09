import * as S from './DeleteConfirmModal.styles';
import React from "react";
import type { Article } from "../../types/article";


interface DeleteConfirmModalProps {
  isOpen: boolean;
  article: Article | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  article,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !article) return null;

  return (
    <S.Div>
      <S.Div2>
        <S.Div3>
          <S.Div4>
            <S.AlertTriangle />
          </S.Div4>
          <S.Div5>
            <S.H3>
              确认删除该文章？
            </S.H3>
            <S.P>
              此操作将直接从 Cloudflare D1 数据库中删除该文章记录。
            </S.P>
          </S.Div5>
          <S.Button
            type="button"
            onClick={onClose}

          >
            <S.X />
          </S.Button>
        </S.Div3>

        {/* Content Preview */}
        <S.Div6>
          {article.content || "（无文本内容）"}
        </S.Div6>

        <S.Div7>
          <S.Button2
            type="button"
            onClick={onClose}
            disabled={isDeleting}

          >
            取消
          </S.Button2>
          <S.Button3
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}

          >
            <S.Trash2 />
            {isDeleting ? "正在删除..." : "确认删除"}
          </S.Button3>
        </S.Div7>
      </S.Div2>
    </S.Div>
  );
};
