import styled, { css } from "styled-components";

export const RailColumn = styled.aside`
  width: calc(44px + env(safe-area-inset-left, 0px));
  padding-left: env(safe-area-inset-left, 0px);
  flex-shrink: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  background: var(--bg-surface);
  z-index: 30;

  @media (max-width: 767px) {
    width: calc(38px + env(safe-area-inset-left, 0px));
  }
`;

export const TopSlot = styled.div`
  height: calc(42px + env(safe-area-inset-top, 0px));
  padding-top: env(safe-area-inset-top, 0px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border);
`;

export const Nav = styled.nav`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 max(10px, env(safe-area-inset-bottom, 10px));
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const Divider = styled.div`
  width: 20px;
  height: 1px;
  margin: 2px 0;
  background: var(--border);
`;

export const IconBtn = styled.button<{
  $active?: boolean;
  $primary?: boolean;
  $danger?: boolean;
}>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms, color 150ms, transform 150ms;

  ${(p) =>
    p.$primary
      ? css`
          background: var(--accent);
          color: #fff;
          &:hover {
            background: var(--accent-hover);
          }
          &:active {
            transform: scale(0.94);
          }
        `
      : p.$active
        ? css`
            background: var(--accent-soft);
            color: var(--accent-text);
          `
        : css`
            color: var(--text-muted);
            &:hover {
              background: var(--bg-subtle);
              color: ${p.$danger ? "var(--danger)" : "var(--text)"};
            }
          `}
`;

export const StatusDot = styled.span<{ $connected?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${(p) => (p.$connected ? "var(--success)" : "var(--warning)")};
  box-shadow: 0 0 0 3px
    ${(p) => (p.$connected ? "var(--success-soft)" : "var(--warning-soft)")};
`;
