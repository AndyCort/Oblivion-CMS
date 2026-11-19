import styled from "styled-components";

export const DateLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
`;

export const StatusBadge = styled.span<{ $draft?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border-radius: 9999px;
  padding: 1px 7px;
  font-size: 10.5px;
  font-weight: 500;
  background: ${(p) => (p.$draft ? "var(--warning-soft)" : "var(--success-soft)")};
  color: ${(p) => (p.$draft ? "var(--warning)" : "var(--success)")};
`;

export const MediaStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const MediaThumb = styled.div`
  width: 34px;
  height: 34px;
  overflow: hidden;
  border-radius: 7px;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;

  span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const HoverActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms;

  .sidebar-card:hover & {
    opacity: 1;
  }
  @media (max-width: 767px) {
    opacity: 1;
  }
`;

export const HoverBtn = styled.button<{ $danger?: boolean }>`
  padding: 4px;
  border-radius: 6px;
  color: var(--text-muted);

  &:hover {
    background: ${(p) => (p.$danger ? "var(--danger-soft)" : "var(--bg-subtle)")};
    color: ${(p) => (p.$danger ? "var(--danger)" : "var(--text)")};
  }
`;
