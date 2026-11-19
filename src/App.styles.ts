import styled, { css } from "styled-components";

export const SessionScreen = styled.div`
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--bg-app);
  color: var(--text-muted);
  font-size: 12px;
`;

export const SessionSpinner = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  border: 2px solid var(--accent);
  border-top-color: transparent;
  animation: spin 1s linear infinite;
`;

export const AppShell = styled.div`
  display: flex;
  height: 100dvh;
  flex-direction: row;
  overflow: hidden;
  background: var(--bg-app);
  color: var(--text);
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

export const WorkspaceSlot = styled.div<{ $visible: boolean }>`
  display: ${(p) => (p.$visible ? "flex" : "none")};
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

export const FallbackText = styled.p`
  padding: 28px;
  font-size: 13px;
  color: var(--text-muted);
`;

export const Toast = styled.div<{ $variant: "success" | "error" | "info" }>`
  position: fixed;
  top: calc(52px + env(safe-area-inset-top, 0px));
  right: 16px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(420px, calc(100vw - 32px));
  border-radius: 12px;
  border: 1px solid;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 24px -8px rgb(0 0 0 / 0.22);

  ${(p) =>
    p.$variant === "success"
      ? css`
          border-color: var(--success);
          background: var(--bg-surface);
          color: var(--success);
        `
      : p.$variant === "error"
        ? css`
            border-color: var(--danger);
            background: var(--bg-surface);
            color: var(--danger);
          `
        : css`
            border-color: var(--accent);
            background: var(--bg-surface);
            color: var(--accent-text);
          `}

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    top: calc(48px + env(safe-area-inset-top, 0px));
    right: max(8px, env(safe-area-inset-right, 8px));
    left: calc(46px + env(safe-area-inset-left, 0px));
    max-width: none;
  }
`;
