import styled from "styled-components";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Article } from "../../types/article";
import { BaseModal, ModalButton } from "../workspace/BaseModal";

const PreviewBox = styled.div`
  max-height: 130px;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  padding: 10px 12px;
  font-size: 12.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  color: var(--text-secondary);
`;

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

export function DeleteConfirmModal({
  isOpen,
  article,
  title = "确认删除该内容？",
  description = "此操作将直接从数据库中永久移除该记录。",
  previewText,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen || (!article && !previewText)) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={description}
      icon={<AlertTriangle size={18} />}
      tone="danger"
      maxWidth="440px"
      footer={
        <>
          <ModalButton type="button" onClick={onClose} disabled={isDeleting}>
            取消
          </ModalButton>
          <ModalButton
            type="button"
            $tone="danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={14} />
            {isDeleting ? "正在删除…" : "确认删除"}
          </ModalButton>
        </>
      }
    >
      <PreviewBox>
        {previewText ?? article?.content ?? "（无文本内容）"}
      </PreviewBox>
    </BaseModal>
  );
}
