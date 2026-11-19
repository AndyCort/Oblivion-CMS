import styled from "styled-components";
import {
  AlertTriangle as BaseAlertTriangle,
  X as BaseX,
  Trash2 as BaseTrash2,
} from "lucide-react";
import { modalCard, modalOverlay } from "../../styles/workspace";

export const Overlay = styled.div`
  ${modalOverlay};
`;

export const Dialog = styled.div`
  ${modalCard};
  max-width: var(--container-md);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: calc(var(--spacing) * 3);
`;

export const IconBox = styled.div`
  display: flex;
  height: calc(var(--spacing) * 10);
  width: calc(var(--spacing) * 10);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background-color: var(--color-rose-50);
  color: var(--color-rose-600);

  &:where(.dark, .dark *) {
    background-color: color-mix(in oklab, var(--color-rose-950) 50%, transparent);
    color: var(--color-rose-400);
  }
`;

export const AlertTriangle = styled(BaseAlertTriangle)`
  height: calc(var(--spacing) * 5);
  width: calc(var(--spacing) * 5);
`;

export const TitleBox = styled.div`
  flex: 1;
`;

export const Title = styled.h3`
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--color-stone-900);

  &:where(.dark, .dark *) {
    color: var(--color-stone-100);
  }
`;

export const Description = styled.p`
  margin-top: var(--spacing);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-500);

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const CloseBtn = styled.button`
  border-radius: var(--radius-lg);
  padding: var(--spacing);
  color: var(--color-stone-400);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: var(--color-stone-600);
    }
    &:where(.dark, .dark *):hover {
      color: var(--color-stone-300);
    }
  }
`;

export const X = styled(BaseX)`
  height: calc(var(--spacing) * 5);
  width: calc(var(--spacing) * 5);
`;

export const PreviewBox = styled.div`
  max-height: calc(var(--spacing) * 32);
  overflow-y: auto;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  padding: calc(var(--spacing) * 3);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  white-space: pre-wrap;
  color: var(--color-stone-600);

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-950) 60%, transparent);
    color: var(--color-stone-300);
  }
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: calc(var(--spacing) * 2.5);
  padding-top: calc(var(--spacing) * 2);
`;

export const CancelBtn = styled.button`
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-stone-600);
  cursor: pointer;
  transition:
    background-color var(--default-transition-duration) var(--default-transition-timing-function),
    color var(--default-transition-duration) var(--default-transition-timing-function);

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

export const ConfirmBtn = styled.button`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-xl);
  background-color: var(--color-rose-600);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: background-color var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-rose-500);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Trash2 = styled(BaseTrash2)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
`;
