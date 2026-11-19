import styled from "styled-components";
import {
  AlertCircle as BaseAlertCircle,
  X as BaseX,
  Check as BaseCheck,
  Copy as BaseCopy,
  RefreshCw as BaseRefreshCw,
  UploadCloud as BaseUploadCloud,
} from "lucide-react";
import { modalCard, modalOverlay } from "../../styles/workspace";

export const Overlay = styled.div`
  ${modalOverlay};
`;

export const Dialog = styled.div`
  ${modalCard};
  max-height: 92dvh;
  max-width: var(--container-lg);
  overflow-y: auto;
  border-color: var(--color-amber-300);

  &:where(.dark, .dark *) {
    border-color: color-mix(in oklab, var(--color-amber-800) 80%, transparent);
  }
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
  background-color: var(--color-amber-50);
  color: var(--color-amber-600);

  &:where(.dark, .dark *) {
    background-color: color-mix(in oklab, var(--color-amber-950) 50%, transparent);
    color: var(--color-amber-400);
  }
`;

export const AlertCircle = styled(BaseAlertCircle)`
  height: calc(var(--spacing) * 6);
  width: calc(var(--spacing) * 6);
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

export const ShaBox = styled.div`
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  padding: calc(var(--spacing) * 3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-600);

  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 1.5);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: var(--color-stone-950);
    color: var(--color-stone-400);
  }
`;

export const FooterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 3);
  padding-top: calc(var(--spacing) * 2);

  @media (width >= 40rem) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const CopyBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-200);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-600);
  cursor: pointer;
  transition: color var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      color: var(--color-stone-900);
    }
    &:where(.dark, .dark *):hover {
      color: var(--color-stone-200);
    }
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    color: var(--color-stone-400);
  }
`;

export const Check = styled(BaseCheck)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  color: var(--color-emerald-500);
`;

export const Copy = styled(BaseCopy)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--spacing) * 2);
`;

export const LaterBtn = styled.button`
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-600);
  cursor: pointer;
  transition: background-color var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-stone-100);
    }
    &:where(.dark, .dark *):hover {
      background-color: var(--color-stone-800);
    }
  }

  &:disabled {
    opacity: 0.5;
  }

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const ReloadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-xl);
  background-color: var(--color-amber-100);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-amber-800);
  cursor: pointer;
  transition: background-color var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-amber-200);
    }
    &:where(.dark, .dark *):hover {
      background-color: color-mix(in oklab, var(--color-amber-900) 60%, transparent);
    }
  }

  &:disabled {
    opacity: 0.5;
  }

  &:where(.dark, .dark *) {
    background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
    color: var(--color-amber-300);
  }
`;

export const RefreshCw = styled(BaseRefreshCw)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const ForceBtn = styled.button`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  border-radius: var(--radius-xl);
  background-color: var(--color-rose-600);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3.5);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: all var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-rose-500);
    }
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const UploadCloud = styled(BaseUploadCloud)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;
