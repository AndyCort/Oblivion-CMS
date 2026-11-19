import styled, { css } from "styled-components";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BatchBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-text);

  &:hover {
    text-decoration: underline;
  }
`;

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

export const MediaCard = styled.div<{ $isDragging?: boolean; $isOver?: boolean }>`
  position: relative;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  transition: transform 150ms, opacity 150ms, box-shadow 150ms;
  user-select: none;

  ${(p) =>
    p.$isDragging &&
    css`
      opacity: 0.35;
      transform: scale(0.95);
    `}

  ${(p) =>
    p.$isOver &&
    css`
      transform: scale(1.02);
      box-shadow: 0 0 0 2px var(--accent);
    `}

  &:hover .media-actions,
  &:hover .media-drag-overlay {
    opacity: 1;
  }
`;

export const ThumbMedia = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ThumbVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #1c1917;
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.28);
  color: #fff;
`;

export const PlayCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.6);
`;

export const VideoBadge = styled.span`
  position: absolute;
  right: 6px;
  bottom: 6px;
  border-radius: 4px;
  background: rgb(0 0 0 / 0.72);
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
`;

export const IndexBadge = styled.span`
  position: absolute;
  top: 6px;
  left: 6px;
  border-radius: 6px;
  background: rgb(0 0 0 / 0.55);
  padding: 1px 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: #fff;
`;

export const CardActions = styled.div.attrs({ className: "media-actions" })`
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10;
  display: flex;
  gap: 4px;
  opacity: 0.92;
  transition: opacity 150ms;

  @media (min-width: 640px) {
    opacity: 0;
  }
`;

export const CardActionBtn = styled.button<{ $danger?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: ${(p) => (p.$danger ? "rgb(225 29 72 / 0.9)" : "rgb(0 0 0 / 0.65)")};

  &:hover {
    background: ${(p) => (p.$danger ? "#e11d48" : "rgb(0 0 0 / 0.9)")};
  }
`;

export const DragOverlay = styled.div.attrs({ className: "media-drag-overlay" })`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;
  background: rgb(0 0 0 / 0.25);
  color: #fff;
  font-size: 10px;
  opacity: 0;
  transition: opacity 150ms;
`;

export const ErrorFallback = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  color: var(--warning);
  font-size: 11px;
  text-align: center;
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 6px;
`;

export const SmallBtn = styled.button`
  border-radius: 6px;
  padding: 4px;
  background: var(--bg-surface);
  color: var(--text);
  border: 1px solid var(--border);
`;

export const AddCardBtn = styled.button`
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 1.5px dashed var(--border-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 12px;
  transition: border-color 150ms, color 150ms, background 150ms;

  &:hover {
    border-color: var(--accent);
    color: var(--accent-text);
    background: var(--accent-soft);
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalTextarea = styled.textarea`
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

export const ModalInput = styled.input`
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text);

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

export const ModeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--text-muted);
`;

export const ModeBtn = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  border: 1px solid ${(p) => (p.$active ? "var(--accent)" : "var(--border)")};
  background: ${(p) => (p.$active ? "var(--accent-soft)" : "transparent")};
  color: ${(p) => (p.$active ? "var(--accent-text)" : "var(--text-secondary)")};
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
