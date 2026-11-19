import styled, { css } from "styled-components";
import {
  Layers as BaseLayers,
  AlertTriangle as BaseAlertTriangle,
  RotateCw as BaseRotateCw,
  Edit2 as BaseEdit2,
  Play as BasePlay,
  ArrowLeftRight as BaseArrowLeftRight,
  Trash2 as BaseTrash2,
  GripVertical as BaseGripVertical,
  Plus as BasePlus,
  Image as BaseImageIcon,
  Video as BaseVideoIcon,
} from "lucide-react";
import { modalCard, modalOverlay } from "../../styles/workspace";

export const Root = styled.div`
  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 3);
  }
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BatchImportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-indigo-600);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: var(--color-indigo-700);
    }
  }
  &:where(.dark, .dark *) {
    color: var(--color-indigo-400);
  }
`;

export const Layers = styled(BaseLayers)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(var(--spacing) * 3);
`;

export const MediaCard = styled.div<{ $isDragging?: boolean; $isOver?: boolean }>`
  position: relative;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-100);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 200ms var(--default-transition-timing-function);
  user-select: none;

  &:where(.dark, .dark *) {
    border-color: color-mix(in oklab, var(--color-stone-700) 80%, transparent);
    background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
  }

  ${(p) =>
    p.$isDragging &&
    css`
      opacity: 0.3;
      transform: scale(0.95);
    `}

  ${(p) =>
    p.$isOver &&
    css`
      transform: scale(1.02);
      box-shadow: 0 0 0 2px var(--color-indigo-500);
    `}

  ${(p) =>
    !p.$isOver &&
    css`
      @media (hover: hover) {
        &:hover {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      }
    `}
`;

export const ErrorFallback = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in oklab, var(--color-stone-200) 50%, transparent);
  padding: calc(var(--spacing) * 2);
  text-align: center;

  &:where(.dark, .dark *) {
    background-color: var(--color-stone-800);
  }
`;

export const AlertTriangle = styled(BaseAlertTriangle)`
  margin-bottom: var(--spacing);
  height: calc(var(--spacing) * 6);
  width: calc(var(--spacing) * 6);
  color: var(--color-amber-500);
`;

export const ErrorLabel = styled.span`
  font-size: 10px;
  line-height: var(--leading-tight);
  color: var(--color-stone-600);

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const ErrorActions = styled.div`
  margin-top: calc(var(--spacing) * 2);
  display: flex;
  gap: calc(var(--spacing) * 1.5);
`;

export const ErrorActionBtn = styled.button`
  border-radius: 0.25rem;
  background-color: var(--color-white);
  padding: var(--spacing);
  color: var(--color-stone-700);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-stone-50);
    }
  }
  &:where(.dark, .dark *) {
    background-color: var(--color-stone-700);
    color: var(--color-stone-200);
  }
`;

export const RotateCw = styled(BaseRotateCw)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
`;

export const Edit2 = styled(BaseEdit2)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
`;

export const ThumbImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 300ms var(--default-transition-timing-function);

  @media (hover: hover) {
    &:is(:where([data-style-group]):hover *) {
      transform: scale(1.05);
    }
  }
`;

export const VideoBox = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: var(--color-stone-900);
`;

export const ThumbVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in oklab, var(--color-black) 25%, transparent);
`;

export const PlayCircle = styled.div`
  display: flex;
  height: calc(var(--spacing) * 8);
  width: calc(var(--spacing) * 8);
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
  color: var(--color-white);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  backdrop-filter: blur(var(--blur-xs));
  -webkit-backdrop-filter: blur(var(--blur-xs));
`;

export const Play = styled(BasePlay)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
  transform: translateX(calc(var(--spacing) * 0.5));
  fill: var(--color-white);
`;

export const VideoBadge = styled.span`
  position: absolute;
  right: calc(var(--spacing) * 1.5);
  bottom: calc(var(--spacing) * 1.5);
  border-radius: 0.25rem;
  background-color: color-mix(in oklab, var(--color-black) 70%, transparent);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 1.5);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
`;

export const IndexBadge = styled.div`
  position: absolute;
  top: calc(var(--spacing) * 1.5);
  left: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-md);
  background-color: color-mix(in oklab, var(--color-black) 50%, transparent);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 1.5);
  font-family: var(--font-mono);
  font-size: 10px;
  color: color-mix(in oklab, var(--color-white) 90%, transparent);
  backdrop-filter: blur(var(--blur-xs));
  -webkit-backdrop-filter: blur(var(--blur-xs));
`;

export const CardActions = styled.div`
  position: absolute;
  top: calc(var(--spacing) * 1.5);
  right: calc(var(--spacing) * 1.5);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--spacing);
  opacity: 0.9;
  transition: opacity var(--default-transition-duration) var(--default-transition-timing-function);

  @media (width >= 40rem) {
    opacity: 0;
    @media (hover: hover) {
      &:is(:where([data-style-group]):hover *) {
        opacity: 1;
      }
    }
  }
`;

const cardActionButtonCss = css`
  display: flex;
  height: calc(var(--spacing) * 6);
  width: calc(var(--spacing) * 6);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-white);
  cursor: pointer;
  backdrop-filter: blur(var(--blur-xs));
  -webkit-backdrop-filter: blur(var(--blur-xs));
  transition: transform var(--default-transition-duration) var(--default-transition-timing-function);

  &:active {
    transform: scale(0.9);
  }
`;

export const CardActionBtn = styled.button<{ $danger?: boolean }>`
  ${cardActionButtonCss};
  background-color: ${(p) =>
    p.$danger
      ? "color-mix(in oklab, var(--color-rose-600) 90%, transparent)"
      : "color-mix(in oklab, var(--color-black) 60%, transparent)"};

  @media (hover: hover) {
    &:hover {
      background-color: ${(p) =>
        p.$danger
          ? "var(--color-rose-600)"
          : "color-mix(in oklab, var(--color-black) 90%, transparent)"};
    }
  }
`;

export const ArrowLeftRight = styled(BaseArrowLeftRight)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
`;

export const Trash2 = styled(BaseTrash2)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
`;

export const DragOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: color-mix(in oklab, var(--color-black) 30%, transparent);
  padding: calc(var(--spacing) * 1.5);
  opacity: 0;
  transition: opacity var(--default-transition-duration) var(--default-transition-timing-function);

  @media (width >= 40rem) {
    @media (hover: hover) {
      &:is(:where([data-style-group]):hover *) {
        opacity: 1;
      }
    }
  }
`;

export const DragHandleRow = styled.div`
  display: flex;
  align-items: center;
`;

export const DragHandle = styled.div`
  pointer-events: auto;
  cursor: grab;
  border-radius: var(--radius-md);
  background-color: color-mix(in oklab, var(--color-black) 50%, transparent);
  padding: var(--spacing);
  color: var(--color-white);

  &:active {
    cursor: grabbing;
  }
`;

export const GripVertical = styled(BaseGripVertical)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const PreviewHint = styled.div`
  padding-bottom: var(--spacing);
  text-align: center;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  color: color-mix(in oklab, var(--color-white) 90%, transparent);
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
`;

export const AddCardBtn = styled.button`
  display: flex;
  aspect-ratio: 1 / 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--color-stone-300);
  background-color: color-mix(in oklab, var(--color-stone-50) 50%, transparent);
  color: var(--color-stone-500);
  cursor: pointer;
  transition:
    color var(--default-transition-duration) var(--default-transition-timing-function),
    background-color var(--default-transition-duration) var(--default-transition-timing-function),
    border-color var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      border-color: var(--color-indigo-500);
      background-color: color-mix(in oklab, var(--color-indigo-50) 30%, transparent);
      color: var(--color-indigo-600);
    }
    &:where(.dark, .dark *):hover {
      border-color: var(--color-indigo-400);
      background-color: color-mix(in oklab, var(--color-indigo-950) 20%, transparent);
      color: var(--color-indigo-400);
    }
  }
  &:active {
    transform: scale(0.95);
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: color-mix(in oklab, var(--color-stone-900) 50%, transparent);
    color: var(--color-stone-400);
  }
`;

export const AddIconCircle = styled.div`
  display: flex;
  height: calc(var(--spacing) * 8);
  width: calc(var(--spacing) * 8);
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--color-stone-200) 70%, transparent);

  @media (width >= 40rem) {
    height: calc(var(--spacing) * 9);
    width: calc(var(--spacing) * 9);
  }
  &:where(.dark, .dark *) {
    background-color: var(--color-stone-800);
  }
`;

export const Plus = styled(BasePlus)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
  @media (width >= 40rem) {
    height: calc(var(--spacing) * 5);
    width: calc(var(--spacing) * 5);
  }
`;

export const AddLabel = styled.span`
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  @media (width >= 40rem) {
    font-size: var(--text-xs);
    line-height: var(--text-xs--line-height);
  }
`;

export const ModalOverlay = styled.div`
  ${modalOverlay};
  backdrop-filter: blur(var(--blur-xs));
  -webkit-backdrop-filter: blur(var(--blur-xs));
`;

export const ModalDialog = styled.div<{ $wide?: boolean }>`
  ${modalCard};
  max-width: ${(p) => (p.$wide ? "var(--container-md)" : "var(--container-sm)")};
  padding: calc(var(--spacing) * 5);

  @media (width >= 40rem) {
    padding: calc(var(--spacing) * 5);
  }
`;

export const ModalTitle = styled.h4`
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--color-stone-900);

  &:where(.dark, .dark *) {
    color: var(--color-stone-100);
  }
`;

export const ModalForm = styled.form<{ $compact?: boolean }>`
  & > :not(:last-child) {
    margin-bottom: ${(p) =>
      p.$compact ? "calc(var(--spacing) * 3)" : "calc(var(--spacing) * 3.5)"};
  }
`;

export const TypeButtonsRow = styled.div`
  display: flex;
  gap: calc(var(--spacing) * 2);
`;

export const TypeButton = styled.button<{ $active?: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 2) 0;
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  cursor: pointer;
  transition:
    color var(--default-transition-duration) var(--default-transition-timing-function),
    background-color var(--default-transition-duration) var(--default-transition-timing-function);

  ${(p) =>
    p.$active
      ? css`
          background-color: var(--color-indigo-600);
          font-weight: var(--font-weight-medium);
          color: var(--color-white);
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        `
      : css`
          background-color: var(--color-stone-100);
          color: var(--color-stone-600);
          &:where(.dark, .dark *) {
            background-color: var(--color-stone-800);
            color: var(--color-stone-400);
          }
        `}
`;

export const ImageIcon = styled(BaseImageIcon)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const VideoIcon = styled(BaseVideoIcon)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const InputLabel = styled.label`
  margin-bottom: var(--spacing);
  display: block;
  font-size: 11px;
  color: var(--color-stone-500);
  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const UrlInput = styled.input`
  width: 100%;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-300);
  background-color: var(--color-stone-50);
  padding: calc(var(--spacing) * 2.5);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-stone-900);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-indigo-500);
  }
  @media (width >= 40rem) {
    font-size: var(--text-xs);
    line-height: var(--text-xs--line-height);
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-950);
    color: var(--color-stone-100);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: calc(var(--spacing) * 2);
  padding-top: var(--spacing);
`;

export const ModalCancelBtn = styled.button`
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3.5);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-600);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-stone-100);
    }
    &:where(.dark, .dark *):hover {
      background-color: var(--color-stone-800);
    }
  }
  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const ModalSubmitBtn = styled.button`
  border-radius: var(--radius-xl);
  background-color: var(--color-indigo-600);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-indigo-500);
    }
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
