import styled from "styled-components";
import {
  canvasSplitGrid,
  editorCard,
  editorSurface,
  paneHeader,
} from "../../styles/workspace";

export const Workspace = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  font-size: 14px;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

export const Main = styled.main<{ $sidebarOpen: boolean }>`
  ${editorSurface};

  @media (max-width: 767px) {
    display: ${(p) => (p.$sidebarOpen ? "none" : "flex")};
    width: 100%;
  }
`;

export const Banners = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 12px 0;
`;

export const BannerItem = styled.p<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  background: ${(p) => (p.$error ? "var(--danger-soft)" : "var(--success-soft)")};
  color: ${(p) => (p.$error ? "var(--danger)" : "var(--success)")};
`;

export const Fieldset = styled.fieldset`
  display: contents;
  min-width: 0;
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

export const TitleInput = styled.input`
  width: 100%;
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 700;
  border-bottom: 1px solid var(--border);
  outline: none;
  padding: 4px 0 10px;
  color: var(--text);

  @media (max-width: 767px) {
    font-size: 17px;
    padding: 2px 0 8px;
  }
`;

export const ContentTextarea = styled.textarea`
  flex: 1;
  min-width: 0;
  min-height: 180px;
  width: 100%;
  padding: 10px 4px;
  resize: none;
  outline: none;
  overflow-y: auto;
  color: var(--text);
  line-height: 1.75;

  @media (max-width: 767px) {
    min-height: 120px;
  }
`;

export const PreviewScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 2px;
`;

export const DockCheck = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  input {
    width: 13px;
    height: 13px;
    accent-color: var(--accent);
  }
`;

export const CoverThumb = styled.img`
  width: 18px;
  height: 18px;
  object-fit: cover;
  border-radius: 9999px;
  flex-shrink: 0;
`;
