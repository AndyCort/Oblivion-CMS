import { css } from "styled-components";

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
  height: calc(100dvh - 56px);
  flex-shrink: 0;
  @media (min-width: 768px) {
    width: 320px;
  }
  @media (min-width: 1024px) {
    width: 384px;
  }
`;

export const editorSurface = css`
  min-width: 0;
  height: calc(100dvh - 56px);
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
  @media (min-width: 640px) {
    padding: 20px;
  }
  @media (min-width: 768px) {
    padding: 24px;
  }
  @media (min-width: 1024px) {
    padding: 32px;
  }
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
  @media (min-width: 640px) {
    padding: 24px;
  }
  @media (min-width: 768px) {
    padding: 28px;
  }
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
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
  }
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
  transition:
    background 150ms,
    transform 150ms;
  &:hover {
    background: var(--color-indigo-500);
  }
  &:active {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const topWorkspaceHeader = css`
  height: calc(42px + env(safe-area-inset-top, 0px));
  padding-top: env(safe-area-inset-top, 0px);
  padding-right: max(14px, env(safe-area-inset-right, 0px));
  padding-left: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--color-stone-200);
  background: var(--color-white);
  @media (max-width: 767px) {
    padding-right: max(8px, env(safe-area-inset-right, 0px));
    padding-left: 8px;
    gap: 6px;
  }
  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
    background: var(--color-stone-900);
  }
`;

export const viewSegmentedGroup = css`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 9px;
  background: var(--color-stone-100);
  border: 1px solid var(--color-stone-200);
  &:where(.dark, .dark *) {
    background: var(--color-stone-800);
    border-color: var(--color-stone-700);
  }
`;

export const viewSegmentedButton = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: var(--color-stone-500);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    box-shadow 150ms;
  &:hover {
    color: var(--color-stone-800);
  }
  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
    &:hover {
      color: var(--color-stone-200);
    }
  }
  &[data-active='true'],
  &.active {
    background: var(--color-white);
    color: var(--color-stone-900);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
    &:where(.dark, .dark *) {
      background: var(--color-stone-700);
      color: var(--color-stone-100);
    }
  }
  @media (max-width: 767px) {
    padding: 3px 7px;
    font-size: 11px;
    svg {
      display: none;
    }
  }
`;

export const ghostHeaderButton = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-stone-200);
  background: transparent;
  color: var(--color-stone-600);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    border-color 150ms;
  &:hover:not(:disabled) {
    background: var(--color-stone-100);
    color: var(--color-stone-900);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    color: var(--color-stone-300);
    &:hover:not(:disabled) {
      background: var(--color-stone-800);
      color: var(--color-stone-100);
    }
  }
  @media (max-width: 640px) {
    padding: 0;
    width: 28px;
    justify-content: center;
    .btn-label {
      display: none;
    }
  }
`;

export const dangerIconButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--color-stone-200);
  background: transparent;
  color: var(--color-stone-500);
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    border-color 150ms;
  &:hover:not(:disabled) {
    background: rgb(244 63 94 / 0.1);
    border-color: rgb(244 63 94 / 0.35);
    color: var(--color-rose-600);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    color: var(--color-stone-400);
    &:hover:not(:disabled) {
      color: var(--color-rose-400);
    }
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
  &[data-single='true'],
  &.single {
    grid-template-columns: minmax(0, 1fr);
    max-width: 820px;
    width: 100%;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    &[data-single='true'],
    &.single {
      padding: 8px 8px calc(64px + env(safe-area-inset-bottom, 0px));
    }
  }
  @media (max-width: 900px) {
    &:not([data-single='true']):not(.single) {
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

export const floatingMetaDockContainer = css`
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

export const floatingMetaDockBar = css`
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
  overscroll-behavior-x: contain;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border: 1px solid rgb(231 229 228 / 0.9);
  background: rgb(255 255 255 / 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 8px 28px -6px rgb(0 0 0 / 0.14),
    0 2px 8px -2px rgb(0 0 0 / 0.06);
  &::-webkit-scrollbar {
    display: none;
  }
  &:where(.dark, .dark *) {
    border-color: rgb(68 64 60 / 0.85);
    background: rgb(28 25 23 / 0.88);
    box-shadow: 0 10px 30px -6px rgb(0 0 0 / 0.55);
  }
`;

export const floatingMetaPill = css`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 9px;
  border-radius: 9999px;
  border: 1px solid var(--color-stone-200);
  background: rgb(250 250 249 / 0.85);
  color: var(--color-stone-600);
  font-size: 11.5px;
  white-space: nowrap;
  transition:
    border-color 150ms,
    background 150ms;
  input,
  select {
    background: transparent;
    border: none;
    outline: none;
    font: inherit;
    font-size: 11.5px;
    color: var(--color-stone-800);
    padding: 0;
    min-width: 0;
  }
  input::placeholder {
    color: var(--color-stone-400);
  }
  &:focus-within {
    border-color: var(--color-indigo-500);
    background: var(--color-white);
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background: rgb(41 37 36 / 0.85);
    color: var(--color-stone-300);
    input,
    select {
      color: var(--color-stone-100);
    }
    select option {
      background: var(--color-stone-900);
      color: var(--color-stone-100);
    }
    &:focus-within {
      border-color: var(--color-indigo-400);
      background: var(--color-stone-900);
    }
  }
  @media (max-width: 767px) {
    height: 30px;
    padding: 0 10px;
  }
`;

export const floatingMetaDivider = css`
  flex: 0 0 auto;
  width: 1px;
  height: 16px;
  background: var(--color-stone-200);
  &:where(.dark, .dark *) {
    background: var(--color-stone-700);
  }
`;

export const dockInlineButton = css`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 20px;
  padding: 0 7px;
  border-radius: 9999px;
  border: 1px solid var(--color-stone-200);
  background: var(--color-white);
  color: var(--color-stone-600);
  font-size: 10.5px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 150ms,
    color 150ms,
    border-color 150ms;
  &:hover {
    border-color: var(--color-indigo-400);
    color: var(--color-indigo-600);
  }
  &[data-active='true'],
  &.active {
    background: var(--color-indigo-600);
    border-color: var(--color-indigo-600);
    color: white;
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background: var(--color-stone-800);
    color: var(--color-stone-300);
    &:hover {
      border-color: var(--color-indigo-500);
      color: var(--color-indigo-300);
    }
    &[data-active='true'],
    &.active {
      background: var(--color-indigo-600);
      border-color: var(--color-indigo-600);
      color: white;
    }
  }
  @media (max-width: 767px) {
    height: 22px;
    padding: 0 8px;
  }
`;

/** Detect mobile viewport (<= 767px) safely across browser and SSR/jsdom. */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  return window.innerWidth <= 767;
}

/** Convert vertical wheel motion into horizontal scroll for single-line docks. */
export function handleDockWheel(e: {
  deltaY: number;
  deltaX: number;
  currentTarget: { scrollLeft: number };
}) {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.currentTarget.scrollLeft += e.deltaY;
  }
}

/** Parse comma-delimited (ASCII or CJK) tag strings into trimmed tag arrays. */
export function parseTagList(raw: string): string[] {
  return raw
    .split(/[，,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
