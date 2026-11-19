import styled, { css } from "styled-components";

export const TabBar = styled.div`
  display: flex;
  gap: 6px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
`;

export const TabBtn = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => (p.$active ? "var(--accent-text)" : "var(--text-muted)")};
  background: ${(p) => (p.$active ? "var(--accent-soft)" : "transparent")};

  &:hover {
    color: var(--text);
    background: ${(p) => (p.$active ? "var(--accent-soft)" : "var(--bg-subtle)")};
  }
`;

export const Card = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-canvas);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;

  &:last-child {
    border-bottom: 0;
  }
`;

export const RowLabel = styled.div`
  min-width: 140px;
  flex: 1;

  strong {
    display: block;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text);
  }
  span {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
  }
`;

export const RowControl = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  height: 30px;
  min-width: 160px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  font-size: 12px;
  color: var(--text);

  &:focus {
    outline: none;
    border-color: var(--accent);
  }
`;

export const Select = styled.select`
  height: 30px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  font-size: 12px;
  color: var(--text);
`;

export const Segment = styled.div`
  display: inline-flex;
  padding: 2px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
`;

export const SegmentBtn = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: ${(p) => (p.$active ? "#fff" : "var(--text-muted)")};
  background: ${(p) => (p.$active ? "var(--accent)" : "transparent")};
`;

export const Toggle = styled.button<{ $checked: boolean }>`
  width: 38px;
  height: 22px;
  padding: 2px;
  border-radius: 9999px;
  background: ${(p) => (p.$checked ? "var(--accent)" : "var(--border-strong)")};
  display: inline-flex;
  align-items: center;
  transition: background 150ms;

  span {
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: #fff;
    transform: translateX(${(p) => (p.$checked ? "16px" : "0")});
    transition: transform 150ms;
  }
`;

export const SwatchBtn = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 9999px;
  font-size: 11.5px;
  border: 1px solid ${(p) => (p.$active ? "var(--accent)" : "var(--border)")};
  background: ${(p) => (p.$active ? "var(--accent-soft)" : "var(--bg-surface)")};
  color: var(--text);
`;

export const SwatchDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: ${(p) => p.$color};
`;

export const AvatarThumb = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid var(--border);
`;

export const SmallBtn = styled.button<{ $tone?: "default" | "danger" }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 500;
  ${(p) =>
    p.$tone === "danger"
      ? css`
          border: 1px solid var(--danger);
          color: var(--danger);
          &:hover:not(:disabled) {
            background: var(--danger-soft);
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

export const DraftList = styled.div`
  max-height: 220px;
  overflow-y: auto;
`;

export const DraftRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 12px;

  &:last-child {
    border-bottom: 0;
  }
`;

export const DraftKind = styled.span<{ $kind: "moment" | "post" }>`
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 9999px;
  background: ${(p) => (p.$kind === "moment" ? "var(--accent-soft)" : "var(--warning-soft)")};
  color: ${(p) => (p.$kind === "moment" ? "var(--accent-text)" : "var(--warning)")};
`;

export const ShortcutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 14px;
  font-size: 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);

  &:last-child {
    border-bottom: 0;
  }
  kbd {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg-surface);
  }
`;
