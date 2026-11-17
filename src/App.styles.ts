import styled, { css } from "styled-components";
import {
  CheckCircle as BaseCheckCircle,
  AlertTriangle as BaseAlertTriangle,
  Sparkles as BaseSparkles,
} from "lucide-react";
import {
  workspaceSidebar,
  editorSurface,
  editorCard,
  primaryButton,
  topWorkspaceHeader,
  viewSegmentedGroup,
  viewSegmentedButton,
  ghostHeaderButton,
  dangerIconButton,
  canvasSplitGrid,
  floatingMetaDockContainer,
  floatingMetaDockBar,
  floatingMetaPill,
  floatingMetaDivider,
  dockInlineButton,
} from "./styles/workspace";

export const SessionScreen = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 3);
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background-color: var(--color-stone-950);
  font-family: var(--font-sans);
  color: var(--color-stone-400);
  user-select: none;
`;

export const SessionSpinner = styled.div`
  height: calc(var(--spacing) * 9);
  width: calc(var(--spacing) * 9);
  animation: spin 1s linear infinite;
  border-radius: 9999px;
  border: 2px solid var(--color-indigo-500);
  border-top-color: transparent;
`;

export const SessionMessage = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  letter-spacing: var(--tracking-wider);
  color: var(--color-stone-400);
`;

export const AppShell = styled.div`
  display: flex;
  height: 100dvh;
  min-height: 100vh;
  flex-direction: row;
  overflow: hidden;
  background-color: var(--color-stone-100);
  color: var(--color-stone-900);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:where(.dark, .dark *) {
    background-color: var(--color-stone-950);
    color: var(--color-stone-100);
  }
`;

export const LeftRailColumn = styled.aside`
  width: calc(44px + env(safe-area-inset-left, 0px));
  padding-left: env(safe-area-inset-left, 0px);
  flex-shrink: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-stone-200);
  background-color: var(--color-white);
  z-index: 30;

  @media (max-width: 767px) {
    width: calc(38px + env(safe-area-inset-left, 0px));
  }

  &:where(.dark, .dark *) {
    border-right-color: var(--color-stone-800);
    background-color: var(--color-stone-900);
  }
`;

export const RailTopToggleSlot = styled.div`
  height: calc(42px + env(safe-area-inset-top, 0px));
  padding-top: env(safe-area-inset-top, 0px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-stone-200);

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
  }
`;

export const RailNav = styled.nav`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  padding-bottom: max(10px, env(safe-area-inset-bottom, 10px));
`;

export const RailGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const RailMiniDivider = styled.div`
  width: 20px;
  height: 1px;
  margin: 2px 0;
  background-color: var(--color-stone-200);

  &:where(.dark, .dark *) {
    background-color: var(--color-stone-800);
  }
`;

export const RailIconButton = styled.button<{
  $active?: boolean;
  $primary?: boolean;
  $danger?: boolean;
}>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 150ms,
    color 150ms,
    transform 150ms;

  ${(p) =>
    p.$primary
      ? css`
          background-color: var(--color-indigo-600);
          color: var(--color-white);
          box-shadow: 0 2px 6px rgb(79 70 229 / 0.28);
          &:hover {
            background-color: var(--color-indigo-500);
          }
          &:active {
            transform: scale(0.94);
          }
        `
      : p.$active
        ? css`
            background-color: rgb(99 102 241 / 0.12);
            color: var(--color-indigo-600);
            &:where(.dark, .dark *) {
              background-color: rgb(99 102 241 / 0.2);
              color: var(--color-indigo-300);
            }
          `
        : css`
            background-color: transparent;
            color: var(--color-stone-500);
            &:hover {
              background-color: var(--color-stone-100);
              color: ${(p.$danger ? "var(--color-rose-600)" : "var(--color-stone-900)")};
            }
            &:where(.dark, .dark *) {
              color: var(--color-stone-400);
              &:hover {
                background-color: var(--color-stone-800);
                color: ${(p.$danger ? "var(--color-rose-400)" : "var(--color-stone-100)")};
              }
            }
          `}
`;

export const StatusDot = styled.span<{ $connected?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  display: inline-block;
  background-color: ${(p) =>
    p.$connected ? "var(--color-emerald-500)" : "var(--color-amber-500)"};
  box-shadow: 0 0 0 3px
    ${(p) =>
      p.$connected ? "rgb(16 185 129 / 0.2)" : "rgb(245 158 11 / 0.2)"};
`;

export const WorkspaceColumn = styled.div`
  flex: 1;
  min-width: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const PostsSlot = styled.div<{ $visible: boolean }>`
  display: ${(p) => (p.$visible ? "flex" : "none")};
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

export const WorkspaceHeader = styled.header`
  ${topWorkspaceHeader};
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 767px) {
    gap: 5px;
  }
`;

export const BrandTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-stone-900);
  white-space: nowrap;

  @media (max-width: 767px) {
    display: none;
  }

  &:where(.dark, .dark *) {
    color: var(--color-stone-100);
  }
`;

export const BrandIconImg = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const ModePill = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 9999px;
  background-color: var(--color-stone-100);
  color: var(--color-stone-500);
  white-space: nowrap;

  @media (max-width: 480px) {
    display: none;
  }

  &:where(.dark, .dark *) {
    background-color: var(--color-stone-800);
    color: var(--color-stone-400);
  }
`;

export const StatusTextPill = styled.span`
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-stone-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const DirtyBadge = styled.span`
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 9999px;
  background-color: rgb(245 158 11 / 0.14);
  color: var(--color-amber-700);
  white-space: nowrap;

  &:where(.dark, .dark *) {
    color: var(--color-amber-300);
  }
`;

export const HeaderModeButton = styled.button`
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgb(245 158 11 / 0.35);
  background-color: rgb(245 158 11 / 0.12);
  color: var(--color-amber-700);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: rgb(245 158 11 / 0.2);
  }

  &:where(.dark, .dark *) {
    color: var(--color-amber-300);
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    gap: 5px;
  }
`;

export const ViewGroup = styled.div`
  ${viewSegmentedGroup};
`;

export const ViewButton = styled.button`
  ${viewSegmentedButton};
`;

export const GhostButton = styled.button`
  ${ghostHeaderButton};
`;

export const DangerIconButton = styled.button`
  ${dangerIconButton};
`;

export const PublishButton = styled.button`
  ${primaryButton};
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 11.5px;

  @media (max-width: 640px) {
    padding: 0 9px;
    gap: 4px;
    font-size: 11px;
  }
`;

export const P = styled.p`
  padding: calc(var(--spacing) * 8);
`;

export const LoadingNotice = styled.div`
  padding: 6px 16px;
  font-size: var(--text-xs);
  color: var(--color-stone-500);
  border-bottom: 1px solid var(--color-stone-200);

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
    color: var(--color-stone-400);
  }
`;

export const ErrorNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--color-rose-50);
  padding: 6px 16px;
  font-size: var(--text-xs);
  color: var(--color-rose-700);

  &:where(.dark, .dark *) {
    background-color: var(--color-rose-950);
    color: var(--color-rose-200);
  }
`;

export const RetryButton = styled.button`
  text-decoration: underline;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

const ToastVariants = {
  v0: css`
    border-color: var(--color-emerald-300);
    background-color: var(--color-emerald-50);
    color: var(--color-emerald-800);

    &:where(.dark, .dark *) {
      border-color: var(--color-emerald-800);
      background-color: color-mix(in oklab, var(--color-emerald-950) 90%, transparent);
      color: var(--color-emerald-200);
    }
  `,
  v1: css`
    border-color: var(--color-rose-300);
    background-color: var(--color-rose-50);
    color: var(--color-rose-800);

    &:where(.dark, .dark *) {
      border-color: var(--color-rose-800);
      background-color: color-mix(in oklab, var(--color-rose-950) 90%, transparent);
      color: var(--color-rose-200);
    }
  `,
  v2: css`
    border-color: var(--color-indigo-300);
    background-color: var(--color-indigo-50);
    color: var(--color-indigo-800);

    &:where(.dark, .dark *) {
      border-color: var(--color-indigo-800);
      background-color: color-mix(in oklab, var(--color-indigo-950) 90%, transparent);
      color: var(--color-indigo-200);
    }
  `,
};

export const Toast = styled.div<{ $variant: keyof typeof ToastVariants }>`
  position: fixed;
  top: calc(52px + env(safe-area-inset-top, 0px));
  right: 16px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(420px, calc(100vw - 32px));
  border-radius: 12px;
  border: 1px solid;
  padding: 8px 14px;
  font-size: var(--text-xs);
  font-weight: 500;
  box-shadow: 0 12px 24px -8px rgb(0 0 0 / 0.18);
  ${(p) => ToastVariants[p.$variant]}

  @media (max-width: 767px) {
    top: calc(48px + env(safe-area-inset-top, 0px));
    right: max(8px, env(safe-area-inset-right, 8px));
    left: calc(46px + env(safe-area-inset-left, 0px));
    max-width: none;
  }
`;

export const ToastContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  white-space: nowrap;
`;

export const CheckCircle = styled(BaseCheckCircle)`
  height: 15px;
  width: 15px;
  flex-shrink: 0;
  color: var(--color-emerald-500);
`;

export const AlertTriangle = styled(BaseAlertTriangle)`
  height: 15px;
  width: 15px;
  flex-shrink: 0;
  color: var(--color-rose-500);
`;

export const Sparkles = styled(BaseSparkles)`
  height: 15px;
  width: 15px;
  flex-shrink: 0;
  color: var(--color-indigo-500);
`;

export const ToastText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MomentsWorkspace = styled.div<{ $visible: boolean }>`
  display: ${(p) => (p.$visible ? "flex" : "none")};
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
`;

export const MomentsBody = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

export const MomentsSidebarWrap = styled.aside<{ $open: boolean }>`
  ${workspaceSidebar};
  display: ${(p) => (p.$open ? "flex" : "none")};
  flex-direction: column;
  width: 300px;
  height: 100%;

  @media (max-width: 767px) {
    width: 100%;
    border-right: 0;
  }
`;

export const MomentsCanvasWrap = styled.main<{ $sidebarOpen?: boolean }>`
  ${editorSurface};
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  overflow: hidden;

  @media (max-width: 767px) {
    display: ${(p) => (p.$sidebarOpen ? "none" : "flex")};
    width: 100%;
  }
`;

export const MomentsSplitGrid = styled.div`
  ${canvasSplitGrid};
`;

export const CanvasPaneCard = styled.section`
  ${editorCard};
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: 14px 16px;
  gap: 12px;
  overflow: hidden;

  @media (max-width: 767px) {
    padding: 10px 12px;
    gap: 10px;
    border-radius: 14px;
  }
`;

export const PaneHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
`;

export const PaneTitle = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-stone-500);

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const PaneMetaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-stone-400);
`;

export const UndoRedoGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

export const SmallIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--color-stone-500);
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: var(--color-stone-100);
    color: var(--color-stone-800);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
    &:hover:not(:disabled) {
      background-color: var(--color-stone-800);
      color: var(--color-stone-100);
    }
  }
`;

export const EditorScrollBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
`;

export const Textarea = styled.textarea`
  flex: 1;
  min-height: 180px;
  width: 100%;
  resize: none;
  border-radius: 12px;
  border: 1px solid var(--color-stone-200);
  background-color: color-mix(in oklab, var(--color-stone-50) 60%, transparent);
  padding: 12px 14px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-stone-900);

  &::placeholder {
    color: var(--color-stone-400);
  }

  &:focus {
    outline: none;
    border-color: var(--color-indigo-500);
    box-shadow: 0 0 0 2px rgb(99 102 241 / 0.16);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-950) 55%, transparent);
    color: var(--color-stone-100);
  }
`;

export const MediaSection = styled.div`
  flex-shrink: 0;
  padding-top: 6px;
  border-top: 1px dashed var(--color-stone-200);

  &:where(.dark, .dark *) {
    border-top-color: var(--color-stone-800);
  }
`;

export const PreviewScrollBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 2px;
`;

export const FloatingDockWrap = styled.div`
  ${floatingMetaDockContainer};
`;

export const FloatingDockScroll = styled.div`
  ${floatingMetaDockBar};
`;

export const DockPill = styled.label`
  ${floatingMetaPill};
`;

export const DockDivider = styled.span`
  ${floatingMetaDivider};
`;

export const DockNowButton = styled.button`
  ${dockInlineButton};
`;
