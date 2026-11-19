import { useEffect, type ReactNode } from "react";
import styled, { css } from "styled-components";
import { X } from "lucide-react";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-overlay);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: max(12px, env(safe-area-inset-top, 0px))
    max(12px, env(safe-area-inset-right, 0px))
    max(12px, env(safe-area-inset-bottom, 0px))
    max(12px, env(safe-area-inset-left, 0px));
`;

const Dialog = styled.div<{ $maxWidth: string; $height?: string }>`
  width: 100%;
  max-width: ${(p) => p.$maxWidth};
  ${(p) =>
    p.$height
      ? css`
          height: ${p.$height};
        `
      : css`
          max-height: calc(100dvh - 24px);
        `}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  color: var(--text);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.3);
`;

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const IconBox = styled.div<{ $tone: "accent" | "danger" }>`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.$tone === "danger" ? "var(--danger-soft)" : "var(--accent-soft)"};
  color: ${(p) =>
    p.$tone === "danger" ? "var(--danger)" : "var(--accent-text)"};
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  margin-top: 2px;
  font-size: 11.5px;
  color: var(--text-muted);
`;

const CloseBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;

  &:hover {
    background: var(--bg-subtle);
    color: var(--text);
  }
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Footer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--border);
`;

export const ModalButton = styled.button<{
  $tone?: "default" | "primary" | "danger";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 150ms, border-color 150ms, color 150ms;

  ${(p) =>
    p.$tone === "primary"
      ? css`
          background: var(--accent);
          color: #fff;
          &:hover:not(:disabled) {
            background: var(--accent-hover);
          }
        `
      : p.$tone === "danger"
        ? css`
            background: var(--danger-solid);
            color: #fff;
            &:hover:not(:disabled) {
              background: var(--danger-hover);
            }
          `
        : css`
            border: 1px solid var(--border-strong);
            color: var(--text-secondary);
            &:hover:not(:disabled) {
              background: var(--bg-subtle);
              color: var(--text);
            }
          `}

  &:disabled {
    opacity: 0.45;
  }
`;

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: "accent" | "danger";
  maxWidth?: string;
  height?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  tone = "accent",
  maxWidth = "480px",
  height,
  footer,
  children,
}: BaseModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={title}
        $maxWidth={maxWidth}
        $height={height}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <HeaderLeft>
            {icon && <IconBox $tone={tone}>{icon}</IconBox>}
            <div style={{ minWidth: 0 }}>
              <Title>{title}</Title>
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </div>
          </HeaderLeft>
          <CloseBtn type="button" onClick={onClose} aria-label="关闭">
            <X size={16} />
          </CloseBtn>
        </Header>

        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Dialog>
    </Overlay>
  );
}
