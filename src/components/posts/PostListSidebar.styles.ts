import styled from "styled-components";

export const StatusStrip = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10.5px;
  color: var(--text-muted);

  button {
    padding: 2px;
    border-radius: 6px;
    color: var(--text-muted);
    &:hover {
      color: var(--text);
      background: var(--bg-subtle);
    }
  }
`;

export const DraftsGroup = styled.details`
  summary {
    font-size: 11px;
    color: var(--text-muted);
    padding: 8px 14px;
    cursor: pointer;
    border-bottom: 1px solid var(--border);
  }
`;

export const CardTitle = styled.strong`
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text);
  overflow-wrap: anywhere;
`;

export const TagPills = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const TagPill = styled.span`
  display: inline-flex;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 10px;
  line-height: 16px;
  background: var(--bg-subtle);
  color: var(--text-muted);
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  padding: 12px 14px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);

  button {
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-secondary);
    &:hover:not(:disabled) {
      border-color: var(--accent);
      color: var(--accent-text);
      background: var(--accent-soft);
    }
    &:disabled {
      opacity: 0.45;
    }
  }
`;
