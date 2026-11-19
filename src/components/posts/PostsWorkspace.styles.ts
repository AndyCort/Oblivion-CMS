import styled from "styled-components";
import {
  workspaceSidebar,
  sidebarSurface,
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
} from "../../styles/workspace";

export const Workspace = styled.div`
  & {
    --post-panel: var(--color-white);
    --post-border: var(--color-stone-200);
    --post-muted: var(--color-stone-500);
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    color: var(--color-stone-900);
    font-size: 14px;
  }
  .dark & {
    --post-panel: var(--color-stone-900);
    --post-border: var(--color-stone-800);
    --post-muted: var(--color-stone-400);
    color: var(--color-stone-100);
  }
  & :where(.posts-sidebar, .posts-pagination) button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 9px;
    transition: background 0.15s;
  }
  & button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
  & :focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 2px;
  }

  .posts-top-header {
    ${topWorkspaceHeader};
  }
  .posts-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
  }
  .posts-header-brand {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
  .posts-header-icon {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .posts-mode-pill {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 999px;
    background: var(--color-stone-100);
    color: var(--post-muted);
    white-space: nowrap;
  }
  .dark & .posts-mode-pill {
    background: var(--color-stone-800);
  }
  .posts-status-pill {
    min-width: 0;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--post-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .posts-dirty-pill {
    flex-shrink: 0;
    font-size: 10.5px;
    font-weight: 600;
    padding: 1px 7px;
    border-radius: 999px;
    background: #f59e0b22;
    color: #b45309;
    white-space: nowrap;
  }
  .dark & .posts-dirty-pill {
    color: #fbbf24;
  }
  .posts-warning-pill {
    flex-shrink: 0;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 10.5px;
    font-weight: 500;
    padding: 1px 8px;
    border-radius: 999px;
    background: #f59e0b18;
    border: 1px solid #f59e0b40;
    color: #a16207;
    white-space: nowrap;
  }
  .dark & .posts-warning-pill {
    color: #fbbf24;
  }
  .posts-header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .post-view-switch {
    ${viewSegmentedGroup};
  }
  .post-view-switch button {
    ${viewSegmentedButton};
  }
  .post-ghost-btn {
    ${ghostHeaderButton};
  }
  .post-danger-btn {
    ${dangerIconButton};
  }
  & .post-primary {
    ${primaryButton};
    height: 28px;
    padding: 0 12px;
    border-radius: 8px;
    font-size: 11.5px;
  }
  & .posts-back {
    display: none;
  }

  .posts-body {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
  .posts-sidebar {
    ${workspaceSidebar};
    ${sidebarSurface};
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .posts-sidebar.collapsed {
    display: none;
  }
  .posts-sidebar.compact .post-list-card {
    padding: 9px 12px;
    gap: 3px;
  }
  .posts-sidebar.compact .post-list-card p {
    -webkit-line-clamp: 1;
  }
  .posts-nav-slot {
    padding: 10px 14px 0;
  }
  .posts-sidebar details summary {
    font-size: 11px;
    color: var(--post-muted);
    padding: 10px 14px;
    cursor: pointer;
  }
  & .post-list-card {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    text-align: left;
    width: 100%;
    padding: 14px;
    border: 0;
    border-bottom: 1px solid var(--post-border);
    border-left: 3px solid transparent;
    border-radius: 0;
    gap: 6px;
    background: transparent;
  }
  .post-list-card:hover {
    background: color-mix(in oklab, var(--color-stone-100) 65%, transparent);
  }
  .dark & .post-list-card:hover {
    background: color-mix(in oklab, var(--color-stone-800) 55%, transparent);
  }
  .post-list-card.selected {
    background: color-mix(in oklab, var(--color-indigo-50) 70%, transparent);
    border-left-color: var(--color-indigo-600);
  }
  .dark & .post-list-card.selected {
    background: #1e1b4b66;
  }
  .post-list-card strong {
    font-size: 13.5px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
  .post-list-card small,
  .post-list-card span,
  .post-list-card p {
    font-size: 11.5px;
    color: var(--post-muted);
  }
  .post-list-card p {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .post-dirty {
    font-size: 10.5px !important;
    color: #b45309 !important;
    background: #f59e0b18;
    padding: 2px 7px;
    border-radius: 20px;
    width: fit-content;
  }
  .dark & .post-dirty {
    color: #fbbf24 !important;
  }
  .posts-empty {
    padding: 35px 10px;
    color: var(--post-muted);
    display: flex;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  .posts-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    padding: 12px 14px;
    border-top: 1px solid var(--post-border);
  }
  .posts-pagination button {
    padding: 4px 10px;
    border: 1px solid var(--post-border);
    background: transparent;
    color: inherit;
    font-size: 11px;
  }
  .posts-pagination button:hover:not(:disabled) {
    background: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
    border-color: var(--color-indigo-400);
  }
  .posts-list-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .posts-list-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: var(--post-muted);
  }
  .posts-list-status button {
    padding: 2px;
    cursor: pointer;
  }
  .post-tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .post-list-card .post-tag-pill {
    display: inline-flex;
    padding: 2px 7px;
    border-radius: 999px;
    font-size: 10px;
    line-height: 16px;
    background: var(--color-stone-100);
    color: var(--post-muted);
  }
  .dark & .post-list-card .post-tag-pill {
    background: var(--color-stone-800);
  }

  .posts-main {
    ${editorSurface};
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    overflow: hidden;
  }
  .post-banners {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px 0;
  }
  .post-error,
  .post-notice {
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 12px;
  }
  .post-error {
    background: #f43f5e15;
    color: #e11d48;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .post-error button {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    padding: 0 4px;
  }
  .post-notice {
    background: #10b98115;
    color: #059669;
  }
  .dark & .post-notice {
    color: #34d399;
  }

  .posts-canvas-grid {
    ${canvasSplitGrid};
  }
  .post-editor-fieldset {
    display: contents;
    border: 0;
    margin: 0;
    padding: 0;
    min-width: 0;
  }
  .post-pane-card {
    ${editorCard};
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    padding: 14px 16px;
    gap: 10px;
    overflow: hidden;
  }
  .post-pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-shrink: 0;
    font-size: 11px;
    color: var(--post-muted);
  }
  .post-pane-header strong {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .post-title {
    width: 100%;
    flex-shrink: 0;
    font-size: 20px;
    font-weight: 700;
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--post-border);
    outline: 0;
    padding: 4px 0 10px;
    color: inherit;
  }
  .post-source {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
  /* The gutter mirrors each logical line at the exact input width, so soft
     wraps keep subsequent line numbers aligned without changing Markdown. */
  .post-line-numbers,
  .post-source textarea {
    tab-size: 2;
    font-family: var(--post-editor-font, ui-monospace, SFMono-Regular, monospace);
    font-size: var(--post-editor-size, 13.5px);
    line-height: var(--post-editor-lh, 24px);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: normal;
  }
  .post-line-numbers {
    position: absolute;
    inset: 0;
    padding: 10px 12px 10px 44px;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    color: transparent;
  }
  .post-line-numbers > div {
    position: relative;
    min-height: var(--post-editor-lh, 24px);
  }
  .post-line-numbers > div::before {
    content: attr(data-line);
    position: absolute;
    left: -40px;
    width: 32px;
    text-align: right;
    color: var(--post-muted);
    opacity: 0.45;
    font-size: 12px;
  }
  .post-source textarea {
    min-width: 0;
    width: calc(100% - 40px);
    margin-left: 40px;
    height: 100%;
    padding: 10px 12px 10px 4px;
    resize: none;
    background: transparent;
    outline: 0;
    border: 0;
    overflow-x: hidden;
    overflow-y: auto;
    color: inherit;
  }
  .post-source.no-line-numbers .post-line-numbers {
    display: none;
  }
  .post-source.no-line-numbers textarea {
    width: 100%;
    margin-left: 0;
    padding-left: 12px;
  }
  .post-preview-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 4px 2px;
  }

  .posts-dock-wrap {
    ${floatingMetaDockContainer};
  }
  .posts-dock-scroll {
    ${floatingMetaDockBar};
  }
  .posts-dock-pill {
    ${floatingMetaPill};
  }
  .posts-dock-divider {
    ${floatingMetaDivider};
  }
  .post-dock-btn {
    ${dockInlineButton};
  }
  .post-dock-toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    font-size: 11.5px;
  }
  .post-dock-toggle input {
    width: 13px;
    height: 13px;
    accent-color: #6366f1;
    cursor: pointer;
  }
  .posts-dock-cover-thumb {
    width: 18px;
    height: 18px;
    object-fit: cover;
    border-radius: 9999px;
    flex-shrink: 0;
  }
  .post-dock-shortcuts {
    font-size: 10.5px;
    color: var(--post-muted);
  }

  @media (max-width: 900px) {
    .posts-canvas-grid:not([data-single='true']):not(.single) .post-source {
      height: 240px;
      min-height: 240px;
      flex: none;
    }
  }
  @media (max-width: 767px) {
    & {
      min-height: 0;
    }
    .posts-sidebar {
      width: 100%;
      border: 0;
    }
    .posts-main {
      display: none;
      width: 100%;
    }
    &.posts-mobile-editor .posts-sidebar {
      display: none;
    }
    &.posts-mobile-editor .posts-main {
      display: flex;
    }
    .posts-sidebar.collapsed + .posts-main {
      display: flex;
    }
    & .posts-back {
      display: inline-flex;
    }
    .posts-header-brand,
    .posts-header-icon,
    .posts-warning-pill {
      display: none;
    }
    .posts-header-left,
    .posts-header-right {
      gap: 5px;
    }
    & .post-primary {
      padding: 0 9px;
      gap: 4px;
      font-size: 11px;
    }
    .post-pane-card {
      padding: 10px 12px;
      gap: 8px;
      border-radius: 14px;
    }
    .post-title {
      font-size: 17px;
      padding: 2px 0 8px;
    }
    .post-dock-shortcuts {
      display: none;
    }
    .post-source,
    .post-source textarea {
      min-height: 120px;
    }
  }
  @media (max-width: 480px) {
    .posts-mode-pill {
      display: none;
    }
  }
  @media (max-width: 420px) {
    .posts-dirty-pill {
      font-size: 10px;
      padding: 1px 5px;
    }
  }
`;
