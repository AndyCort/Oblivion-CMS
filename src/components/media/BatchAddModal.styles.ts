import styled, { css } from "styled-components";
import {
  Layers as BaseLayers,
  X as BaseX,
  Plus as BasePlus,
} from "lucide-react";
import { modalCard, modalOverlay } from "../../styles/workspace";

export const Overlay = styled.div`
  ${modalOverlay};
  z-index: 70;
`;

export const Dialog = styled.div`
  ${modalCard};
  max-height: 92dvh;
  max-width: var(--container-lg);
  overflow-y: auto;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-stone-100);
  padding-bottom: calc(var(--spacing) * 2);

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 2);
`;

export const Layers = styled(BaseLayers)`
  height: calc(var(--spacing) * 5);
  width: calc(var(--spacing) * 5);
  color: var(--color-indigo-500);
`;

export const Title = styled.h3`
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--color-stone-900);

  @media (width >= 40rem) {
    font-size: var(--text-lg);
    line-height: var(--text-lg--line-height);
  }

  &:where(.dark, .dark *) {
    color: var(--color-stone-100);
  }
`;

export const CloseBtn = styled.button`
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 1.5);
  color: var(--color-stone-400);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-stone-100);
      color: var(--color-stone-700);
    }
    &:where(.dark, .dark *):hover {
      background-color: var(--color-stone-800);
      color: var(--color-stone-200);
    }
  }
`;

export const X = styled(BaseX)`
  height: calc(var(--spacing) * 5);
  width: calc(var(--spacing) * 5);
`;

export const Form = styled.form`
  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 4);
  }
`;

export const FieldLabel = styled.label`
  margin-bottom: var(--spacing);
  display: block;
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-stone-500);

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-300);
  background-color: var(--color-stone-50);
  padding: calc(var(--spacing) * 3);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-stone-900);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-indigo-500);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-950);
    color: var(--color-stone-100);
  }
`;

export const ModeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: calc(var(--spacing) * 2);
`;

export const ModeLabel = styled.span`
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-500);

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const ModeButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--spacing) * 2);
`;

export const ModeButton = styled.button<{ $active?: boolean }>`
  border-radius: var(--radius-lg);
  border: 1px solid;
  padding: var(--spacing) calc(var(--spacing) * 2.5);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  cursor: pointer;

  ${(p) =>
    p.$active
      ? css`
          border-color: var(--color-indigo-300);
          background-color: var(--color-indigo-50);
          font-weight: var(--font-weight-medium);
          color: var(--color-indigo-600);

          &:where(.dark, .dark *) {
            border-color: var(--color-indigo-600);
            background-color: color-mix(in oklab, var(--color-indigo-950) 60%, transparent);
            color: var(--color-indigo-400);
          }
        `
      : css`
          border-color: var(--color-stone-200);
          color: var(--color-stone-600);

          &:where(.dark, .dark *) {
            border-color: var(--color-stone-700);
            color: var(--color-stone-400);
          }
        `}
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: calc(var(--spacing) * 3);
  padding-top: calc(var(--spacing) * 2);
`;

export const CancelBtn = styled.button`
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  font-weight: var(--font-weight-medium);
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

export const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-xl);
  background-color: var(--color-indigo-600);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-indigo-500);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Plus = styled(BasePlus)`
  height: calc(var(--spacing) * 4);
  width: calc(var(--spacing) * 4);
`;
