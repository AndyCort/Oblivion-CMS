import styled, { css } from "styled-components";
import { primaryButton, workspaceSidebar } from "../../styles/workspace";

export const SidebarRoot = styled.aside<{ $open?: boolean }>`
  ${workspaceSidebar};
  display: ${(p) => (p.$open === false ? "none" : "flex")};
  flex-direction: column;
  overflow: hidden;
`;

export const SidebarHeader = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SidebarTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const SidebarTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SidebarTitle = styled.h2`
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
`;

export const CountBadge = styled.span`
  border-radius: 9999px;
  background: var(--bg-subtle);
  padding: 1px 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
`;

export const CreateButton = styled.button`
  ${primaryButton};
  padding: 6px 10px;
  border-radius: 10px;
`;

export const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 11px;
    color: var(--text-faint);
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-input);
  padding: 7px 10px 7px 32px;
  font-size: 13px;
  color: var(--text);

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-ring);
  }
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const FilterChipsScroll = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  min-width: 0;
`;

export const FilterChip = styled.button<{
  $active?: boolean;
  $tone?: "amber" | "accent";
}>`
  flex-shrink: 0;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11.5px;
  font-weight: 500;
  background: var(--bg-subtle);
  color: var(--text-secondary);
  transition: background 150ms, color 150ms;

  ${(p) =>
    p.$active &&
    (p.$tone === "amber"
      ? css`
          background: var(--warning-soft);
          color: var(--warning);
        `
      : css`
          background: var(--accent-soft);
          color: var(--accent-text);
        `)}
`;

export const ActiveTagChip = styled.button`
  flex-shrink: 0;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11.5px;
  font-weight: 500;
  background: var(--accent-soft);
  color: var(--accent-text);
`;

export const TagChip = styled.button`
  flex-shrink: 0;
  border-radius: 7px;
  padding: 2px 7px;
  font-size: 11px;
  background: var(--bg-subtle);
  color: var(--text-muted);

  &:hover {
    color: var(--accent-text);
    background: var(--accent-soft);
  }
`;

export const SortButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11.5px;
  color: var(--text-muted);

  &:hover {
    background: var(--bg-subtle);
    color: var(--text);
  }
`;

export const ListScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const ListCard = styled.div<{ $selected?: boolean; $compact?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  gap: ${(p) => (p.$compact ? "4px" : "6px")};
  padding: ${(p) => (p.$compact ? "10px 14px" : "13px 14px")};
  border-bottom: 1px solid var(--border);
  border-left: 3px solid ${(p) => (p.$selected ? "var(--accent)" : "transparent")};
  background: ${(p) => (p.$selected ? "var(--accent-soft)" : "transparent")};
  cursor: pointer;
  transition: background 150ms;

  &:hover {
    background: ${(p) => (p.$selected ? "var(--accent-soft)" : "var(--bg-hover)")};
  }
`;

export const CardMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11.5px;
  color: var(--text-muted);
`;

export const CardExcerpt = styled.p<{ $compact?: boolean }>`
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: ${(p) => (p.$compact ? 1 : 2)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
`;

export const DirtyPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 9999px;
  background: var(--warning-soft);
  color: var(--warning);
  width: fit-content;
`;

export const EmptyState = styled.div`
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  font-size: 12.5px;
  color: var(--text-muted);
`;
