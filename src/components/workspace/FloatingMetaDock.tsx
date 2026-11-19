import type { ReactNode } from "react";
import styled from "styled-components";
import { handleDockWheel } from "../../lib/utils";

const DockWrap = styled.div`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 10px;
  z-index: 25;
  display: flex;
  justify-content: center;
  pointer-events: none;

  @media (max-width: 767px) {
    left: 6px;
    right: 6px;
    bottom: max(8px, env(safe-area-inset-bottom, 8px));
  }
`;

const DockScroll = styled.div`
  pointer-events: auto;
  max-width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 9999px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  white-space: nowrap;
  border: 1px solid var(--border);
  background: var(--bg-dock);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 8px 28px -6px rgb(0 0 0 / 0.16);
`;

export const DockPill = styled.label`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 9px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 11.5px;
  white-space: nowrap;
  transition: border-color 150ms, background 150ms;

  input,
  select {
    background: transparent;
    border: none;
    outline: none;
    font: inherit;
    font-size: 11.5px;
    color: var(--text);
    padding: 0;
    min-width: 0;
  }

  &:focus-within {
    border-color: var(--accent);
    background: var(--bg-surface);
  }
`;

export const DockDivider = styled.span`
  flex: 0 0 auto;
  width: 1px;
  height: 16px;
  background: var(--border);
`;

export const DockButton = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 7px;
  border-radius: 9999px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 10.5px;
  font-weight: 500;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent-text);
  }
`;

export function FloatingMetaDock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <DockWrap>
      <DockScroll aria-label={label} onWheel={handleDockWheel}>
        {children}
      </DockScroll>
    </DockWrap>
  );
}
