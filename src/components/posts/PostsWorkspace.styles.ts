import styled from 'styled-components';
import { workspaceSidebar, sidebarSurface, editorSurface, editorCard, editorToolbar, primaryButton } from '../../styles/workspace';

export const Workspace = styled.div`
& {
  --post-panel: var(--color-white);
  --post-border: var(--color-stone-200);
  --post-muted: var(--color-stone-500);
  display: flex;
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
& :where(.posts-main, .posts-pagination) button {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 9px;
  padding: 8px 10px;
  transition: background 0.15s;
}
& :where(.posts-main, .posts-pagination) button:hover {
  background: #6366f119;
}
& button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
& :focus-visible {
  outline: 2px solid #818cf8;
  outline-offset: 2px;
}
.posts-sidebar {
  ${workspaceSidebar};
  ${sidebarSurface};
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.posts-list-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 14px;
  min-height: 62px;
}
.posts-list-heading small {
  letter-spacing: 0.18em;
  font-size: 10px;
  color: var(--post-muted);
}
.posts-list-heading h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}
.posts-list-heading h2 span {
  padding: 2px 8px;
  border-radius: 999px;
  font: 12px/16px var(--font-mono);
  color: var(--post-muted);
  background: var(--color-stone-100);
}
.posts-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 14px;
  padding: 9px 10px;
  border: 1px solid var(--post-border);
  border-radius: 12px;
  background: var(--color-stone-50);
  color: var(--post-muted);
  font-size: 12px;
}
.posts-search input {
  min-width: 0;
  width: 100%;
  background: transparent;
  outline: 0;
}
.posts-list-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--post-border);
  color: var(--post-muted);
  font-size: 11px;
}
.posts-sidebar details summary {
  font-size: 11px;
  color: var(--post-muted);
  padding: 12px 14px;
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
  gap: 7px;
}
.post-list-card.selected {
  background: color-mix(in oklab, var(--color-indigo-50) 70%, transparent);
  border-left-color: var(--color-indigo-600);
}
.post-list-card strong {
  font-size: 14px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.post-list-card small,
.post-list-card span,
.post-list-card p {
  font-size: 12px;
  color: var(--post-muted);
}
.post-list-card p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-dirty {
  font-size: 11px !important;
  color: #b45309 !important;
  background: #f59e0b15;
  padding: 3px 7px;
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
}
.posts-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: calc(100dvh - 56px);
  overflow: hidden;
}
.posts-editor-scroll {
  ${editorSurface};
  height: auto;
  min-height: 0;
}
.posts-list-scroll { flex: 1; min-height: 0; overflow-y: auto; }
.posts-list-status { display:flex; justify-content:space-between; align-items:center; font-size:10px; color:var(--post-muted); }
.posts-list-status button { padding:2px; cursor:pointer; }
.post-tag-pills { display:flex; flex-wrap:wrap; gap:5px; }
.post-list-card .post-tag-pill {
  display:inline-flex; padding:2px 7px; border-radius:999px;
  font-size:10px; line-height:16px; background:var(--color-stone-100); color:var(--post-muted);
}
.dark & .post-list-card .post-tag-pill { background:var(--color-stone-800); }

.posts-toolbar {
  ${editorToolbar};
  margin-bottom: 20px;
}
.posts-toolbar > div:not(.post-view-switch) {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.posts-toolbar span {
  font-size: 10px;
  color: var(--post-muted);
  padding: 3px 7px;
  background: var(--color-stone-100);
  border-radius: 999px;
}
& .post-primary {
  ${primaryButton};
}
& .post-primary:hover {
  background: #6366f1;
}
& .posts-back {
  display: none;
}
.post-warning,
.post-error,
.post-notice {
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 16px;
  font-size: 13px;
}
.post-warning {
  background: #f59e0b12;
  color: #a16207;
}
.dark & .post-warning {
  color: #fbbf24;
}
.post-error {
  background: #f43f5e15;
  color: #e11d48;
  display: flex;
  justify-content: space-between;
}
.post-notice {
  background: #10b98115;
  color: #059669;
}
.post-editor-fields {
  ${editorCard};
  margin: 0;
}
.post-title {
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--post-border);
  outline: 0;
  padding: 12px 0 18px;
  margin-bottom: 20px;
}
.post-editor-options {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  color: var(--post-muted);
  font-size: 12px;
}
.post-view-switch {
  flex-shrink: 0;
  font-size: 12px;
  display: flex;
  border: 1px solid var(--post-border);
  background: var(--color-stone-100);
  border-radius: 12px;
  padding: 3px;
}
.post-view-switch button[aria-pressed="true"] {
  color: var(--color-stone-900);
  background: var(--color-white);
  box-shadow: 0 1px 2px rgb(0 0 0 / .05);
}
.post-editor-options > button {
  margin-left: auto;
}
.post-metadata {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--post-border);
  border-radius: 12px;
  background: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
  margin-bottom: 22px;
}
.post-metadata > label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: var(--post-muted);
}
.post-metadata input:not([type="checkbox"]),
.post-metadata textarea {
  width: 100%;
  min-width: 0;
  font-size: 14px;
  padding: 9px 11px;
  border: 1px solid var(--post-border);
  border-radius: 9px;
  background: transparent;
  color: inherit;
}
.post-metadata small {
  font-size: 11px;
}
.post-slug,
.post-cover {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.post-slug button {
  white-space: nowrap;
  font-size: 11px;
  flex-shrink: 0;
}
.post-cover img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 7px;
}
.post-summary {
  grid-column: span 2;
}
.post-tags {
  grid-column: span 2;
}
.post-metadata .post-pin {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.post-pin input {
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
}
.post-writing {
  border: 1px solid var(--post-border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--post-panel);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 520px;
}
.post-view-split {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.post-source {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 520px;
}
.post-view-split .post-source {
  border-right: 1px solid var(--post-border);
}
/* The gutter mirrors each logical line at the exact input width, so soft
   wraps keep subsequent line numbers aligned without changing Markdown. */
.post-line-numbers,
.post-source textarea {
  tab-size: 2;
  font: 14px/26px ui-monospace, SFMono-Regular, monospace;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: normal;
}
.post-line-numbers {
  position: absolute;
  inset: 0;
  padding: 24px 16px 24px 48px;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  color: transparent;
}
.post-line-numbers > div {
  position: relative;
  min-height: 26px;
}
.post-line-numbers > div::before {
  content: attr(data-line);
  position: absolute;
  left: -44px;
  width: 34px;
  text-align: right;
  color: var(--post-muted);
  opacity: 0.5;
  font-size: 13px;
}
.post-source textarea {
  min-width: 0;
  width: calc(100% - 44px);
  margin-left: 44px;
  height: 600px;
  padding: 24px 16px 24px 4px;
  resize: vertical;
  background: transparent;
  outline: 0;
  border: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.post-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--post-border);
  padding: 12px 12px max(12px, env(safe-area-inset-bottom));
  background: var(--post-panel);
  color: var(--post-muted);
  font-size: 12px;
}
.post-footer-inner {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  width:100%;
  max-width:768px;
  margin:0 auto;
}
.post-footer-inner > div { display:flex; flex-wrap:wrap; gap:8px; min-width:0; }
.post-footer .post-primary { flex-shrink:0; }
.post-shortcuts { padding:16px 0 0; font-size:10px; color:var(--post-muted); }
@media (min-width:640px) { .post-footer { padding-inline:20px; } }
@media (min-width:768px) { .post-footer { padding-inline:24px; } }
@media (min-width:1024px) { .post-footer { padding-inline:32px; } }
.post-footer .post-delete {
  color: #e11d48;
}
.post-footer small {
  font-size: 11px;
}

@media (max-width: 1100px) {
  .post-metadata {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .post-metadata > .post-slug-field {
    grid-column: span 2;
  }
  .post-summary {
    grid-column: span 1;
  }
  .post-tags {
    grid-column: span 2;
  }
  .post-pin {
    grid-column: span 2;
  }
}
@media (max-width: 767px) {
  & {
    min-height: calc(100dvh - 108px);
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
  & .posts-back {
    display: inline-flex;
  }
  .posts-toolbar > div:not(.post-view-switch) {
    gap: 4px;
    flex-direction: column;
    align-items: flex-start;
  }
  .posts-toolbar span {
    font-size: 10px;
  }
  .posts-toolbar .post-primary {
    padding: 10px;
    font-size: 12px;
  }
  .post-view-split {
    grid-template-columns: minmax(0, 1fr);
  }
  .post-view-split .post-source {
    border-right: 0;
    border-bottom: 1px solid var(--post-border);
  }
  .post-metadata {
    padding: 16px;
    gap: 14px;
  }
  .post-editor-options {
    gap: 8px;
  }
  .post-editor-options > span {
    font-size: 11px;
  }
  .post-line-numbers {
    font-size: 16px;
  }
  .post-source textarea {
    font-size: 16px;
    height: 460px;
  }
  .post-source {
    min-height: 460px;
  }
  .post-metadata input:not([type="checkbox"]),
  .post-metadata textarea,
  .posts-search input {
    font-size: 16px;
  }
}
.post-language-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 18px;
  grid-column: 1 / -1;
  padding: 0 0 16px;
  border-bottom: 1px solid var(--post-border);
  font-size: 12px;
  color: var(--post-muted);
}
.post-language-bar label {
  flex-direction: row;
  display: flex;
  align-items: center;
  gap: 10px;
}
.post-language-bar select,
.post-add-language input {
  min-width: 0;
  border: 1px solid var(--post-border);
  border-radius: 9px;
  padding: 8px 10px;
  background: var(--post-panel);
  color: inherit;
}
.post-add-language {
  display: flex;
  align-items: center;
  gap: 6px;
}
.post-add-language input {
  width: 165px;
}
.post-language-bar small {
  flex-basis: 100%;
  font-size: 12px;
}
.post-shared-fields {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.post-shared-fields small {
  flex-basis: auto;
}
.dark & .post-language-bar select {
  color-scheme: dark;
}
@media (max-width: 767px) {
  .post-language-bar select,
  .post-add-language input {
    font-size: 16px;
  }
  .post-add-language {
    flex: 1;
    min-width: 220px;
  }
  .post-add-language input {
    flex: 1;
    width: 120px;
  }
  .post-add-language button {
    white-space: nowrap;
  }
}

.post-language-more { margin-left: auto; }
.post-language-more summary { cursor: pointer; padding: 8px 0; }
.post-language-more[open] { flex-basis: 100%; margin-left: 0; }
.post-language-more .post-add-language { max-width: 320px; margin-top: 8px; }
.post-language-more .post-shared-fields { margin-top: 8px; }
@media (max-width: 767px) {
  .post-language-bar { gap: 8px 12px; }
  .post-language-more { margin-left: 0; }
}


.posts-editor-container { max-width: 768px; margin: 0 auto; }
.posts-toolbar strong { font-size: 16px; font-weight: 600; }
.post-field-label { font-size: 12px; font-weight: 600; color: var(--post-muted); }
.post-slug-field { grid-column: 1 / -1; }
.post-summary { grid-column: span 1; }
.post-view-switch button { padding: 4px 12px; border-radius: 8px; }
.post-warning { border: 1px solid #f59e0b4d; margin: 0 0 20px; }
.post-error, .post-notice { margin: 0 0 16px; }
.dark & .posts-list-heading h2 span,
.dark & .posts-toolbar span,
.dark & .post-view-switch { background: var(--color-stone-800); }
.dark & .posts-search { background: var(--color-stone-950); }
.dark & .post-metadata { background: #0c0a0980; }
.dark & .post-list-card.selected { background: #1e1b4b66; }
.dark & .post-view-switch button[aria-pressed="true"] { background: var(--color-stone-700); color: var(--color-stone-100); }
@media (max-width: 767px) {
  .posts-toolbar { flex-wrap: wrap; }
  .posts-toolbar .post-view-switch { margin-left:auto; }
  .post-footer { gap: 8px; }
  .post-footer button { padding: 8px; font-size: 11px; }
}

`;
