import { css } from 'styled-components';

// Shared by both content modes: changing one surface updates the whole CMS.
export const sidebarSurface = css`
  border-right: 1px solid var(--color-stone-200);
  background: var(--color-white);
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background: var(--color-stone-900);
  }
`;

export const workspaceSidebar = css`
  width: 100%;
  height: calc(100dvh - 7rem);
  flex-shrink: 0;
  @media (min-width: 768px) { width: 320px; }
  @media (min-width: 1024px) { width: 384px; }
`;

export const editorSurface = css`
  min-width: 0;
  height: calc(100dvh - 7rem);
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
  @media (min-width: 640px) { padding: 20px; }
  @media (min-width: 768px) { padding: 24px; }
  @media (min-width: 1024px) { padding: 32px; }
  padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
  &:where(.dark, .dark *) {
    background: color-mix(in oklab, var(--color-stone-950) 50%, transparent);
  }
`;

export const editorCard = css`
  min-width: 0;
  border: 1px solid var(--color-stone-200);
  border-radius: 16px;
  background: var(--color-white);
  padding: 16px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  @media (min-width: 640px) { padding: 24px; }
  @media (min-width: 768px) { padding: 28px; }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background: var(--color-stone-900);
  }
`;

export const editorToolbar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 40px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-stone-200);
  &:where(.dark, .dark *) { border-color: var(--color-stone-800); }
`;

export const primaryButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--color-indigo-600);
  color: white;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  transition: background 150ms, transform 150ms;
  &:hover { background: var(--color-indigo-500); }
  &:active { transform: scale(.97); }
  &:disabled { opacity: .5; cursor: not-allowed; }
`;
