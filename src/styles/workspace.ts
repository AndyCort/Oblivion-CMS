import { css } from "styled-components";

export const workspaceSidebar = css`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--bg-surface);

  @media (min-width: 768px) {
    width: 300px;
  }
  @media (min-width: 1280px) {
    width: 340px;
  }
  @media (max-width: 767px) {
    border-right: 0;
  }
`;

export const editorSurface = css`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  background: var(--bg-canvas);
`;

export const editorCard = css`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: 14px 16px;
  gap: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-surface);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);

  @media (max-width: 767px) {
    padding: 10px 12px;
    border-radius: 14px;
  }
`;

export const primaryButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
  transition: background 150ms, transform 150ms;

  &:hover:not(:disabled) {
    background: var(--accent-hover);
  }
  &:active:not(:disabled) {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.45;
  }
`;

export const ghostButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-secondary);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 150ms, color 150ms, border-color 150ms;

  &:hover:not(:disabled) {
    background: var(--bg-subtle);
    color: var(--text);
  }
  &:disabled {
    opacity: 0.45;
  }
`;

export const dangerIconButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-muted);
  transition: background 150ms, color 150ms, border-color 150ms;

  &:hover:not(:disabled) {
    background: var(--danger-soft);
    border-color: var(--danger);
    color: var(--danger);
  }
  &:disabled {
    opacity: 0.4;
  }
`;

export const paneHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
  font-size: 11.5px;
  color: var(--text-muted);

  strong {
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
`;

export const canvasSplitGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  flex: 1;
  min-height: 0;
  padding: 12px 12px 64px;
  overflow: hidden;

  &[data-single="true"] {
    grid-template-columns: minmax(0, 1fr);
    max-width: 820px;
    width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 767px) {
    &[data-single="true"] {
      padding: 8px 8px calc(64px + env(safe-area-inset-bottom, 0px));
    }
  }

  @media (max-width: 900px) {
    &:not([data-single="true"]) {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 8px 8px calc(68px + env(safe-area-inset-bottom, 0px));
      gap: 10px;
      & > section {
        height: auto;
        min-height: 300px;
        flex-shrink: 0;
        overflow: visible;
      }
    }
  }
`;
