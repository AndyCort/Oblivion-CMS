import styled from "styled-components";
import {
  canvasSplitGrid,
  editorCard,
  editorSurface,
  paneHeader,
} from "../../styles/workspace";

export const WorkspaceRoot = styled.div<{ $visible: boolean }>`
  display: ${(p) => (p.$visible ? "flex" : "none")};
  flex: 1;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

export const CanvasWrap = styled.main<{ $sidebarOpen: boolean }>`
  ${editorSurface};

  @media (max-width: 767px) {
    display: ${(p) => (p.$sidebarOpen ? "none" : "flex")};
    width: 100%;
  }
`;

export const SplitGrid = styled.div`
  ${canvasSplitGrid};
`;

export const PaneCard = styled.section`
  ${editorCard};
`;

export const PaneHeader = styled.div`
  ${paneHeader};
`;

export const EditorScroll = styled.div`
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
  border: 1px solid var(--border);
  background: var(--bg-input);
  padding: 12px 14px;
  color: var(--text);
  line-height: 1.7;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-ring);
  }

  @media (max-width: 767px) {
    min-height: 120px;
  }
`;

export const MediaSection = styled.div`
  flex-shrink: 0;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
`;

export const PreviewScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 2px;
`;

export const Banner = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 16px;
  font-size: 12px;
  border-bottom: 1px solid var(--border);
  background: ${(p) => (p.$error ? "var(--danger-soft)" : "var(--bg-surface)")};
  color: ${(p) => (p.$error ? "var(--danger)" : "var(--text-muted)")};

  button {
    text-decoration: underline;
    color: inherit;
  }
`;
