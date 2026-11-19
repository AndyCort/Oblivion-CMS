import * as S from "./WorkspaceHeader.styles";
import {
  ArrowLeft,
  Columns2,
  Eye,
  PenLine,
  RotateCcw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { EditorViewMode } from "../../lib/settings/cmsSettings";

export interface WorkspaceHandle {
  createNew: () => void;
  saveNow: () => void;
  publishNow: () => void;
  refreshDrafts: () => void;
}

interface WorkspaceHeaderProps {
  modeLabel: string;
  statusText: string;
  dirty?: boolean;
  warning?: string;
  onWarningClick?: () => void;
  view: EditorViewMode;
  onChangeView: (view: EditorViewMode) => void;
  viewDisabled?: boolean;
  onRevert: () => void;
  revertDisabled?: boolean;
  revertTitle?: string;
  onDelete: () => void;
  deleteDisabled?: boolean;
  deleteLabel?: string;
  onPublish: () => void;
  publishDisabled?: boolean;
  publishLabel?: string;
  isPublishing?: boolean;
  showMobileBack?: boolean;
  onMobileBack?: () => void;
}

const VIEW_MODES: readonly [EditorViewMode, string, typeof PenLine][] = [
  ["edit", "编辑", PenLine],
  ["split", "分屏", Columns2],
  ["preview", "预览", Eye],
];

export function WorkspaceHeader({
  modeLabel,
  statusText,
  dirty,
  warning,
  onWarningClick,
  view,
  onChangeView,
  viewDisabled,
  onRevert,
  revertDisabled,
  revertTitle = "放弃未发布的本地修改",
  onDelete,
  deleteDisabled,
  deleteLabel = "删除",
  onPublish,
  publishDisabled,
  publishLabel = "发布",
  isPublishing,
  showMobileBack,
  onMobileBack,
}: WorkspaceHeaderProps) {
  return (
    <S.Header>
      <S.Left>
        {showMobileBack && onMobileBack && (
          <S.MobileBackBtn type="button" onClick={onMobileBack}>
            <ArrowLeft size={13} />
            列表
          </S.MobileBackBtn>
        )}
        <S.BrandIcon src="/favicon.svg" alt="" />
        <S.BrandTitle>Oblivion-CMS</S.BrandTitle>
        <S.ModePill>{modeLabel}</S.ModePill>
        <S.StatusText role="status">{statusText}</S.StatusText>
        {dirty && <S.DirtyBadge>未发布修改</S.DirtyBadge>}
        {warning && (
          <S.WarningButton
            type="button"
            onClick={onWarningClick}
            title={warning}
          >
            {warning}
          </S.WarningButton>
        )}
      </S.Left>

      <S.Right>
        <S.ViewGroup aria-label="编辑器视图">
          {VIEW_MODES.map(([mode, label, Icon]) => (
            <S.ViewButton
              key={mode}
              type="button"
              disabled={viewDisabled}
              aria-pressed={view === mode}
              data-active={view === mode}
              onClick={() => onChangeView(mode)}
            >
              <Icon size={12} />
              {label}
            </S.ViewButton>
          ))}
        </S.ViewGroup>

        <S.GhostBtn
          type="button"
          onClick={onRevert}
          disabled={revertDisabled}
          aria-label={revertTitle}
          title={revertTitle}
        >
          <RotateCcw size={12} />
          <span className="btn-label">放弃</span>
        </S.GhostBtn>

        <S.DangerBtn
          type="button"
          onClick={onDelete}
          disabled={deleteDisabled}
          aria-label={deleteLabel}
          title={deleteLabel}
        >
          <Trash2 size={13} />
        </S.DangerBtn>

        <S.PublishBtn
          type="button"
          onClick={onPublish}
          disabled={publishDisabled}
          aria-label={publishLabel}
        >
          <UploadCloud size={13} />
          {isPublishing ? "发布中…" : "发布"}
        </S.PublishBtn>
      </S.Right>
    </S.Header>
  );
}
