import styled from "styled-components";
import { dangerIconButton, ghostButton, primaryButton } from "../../styles/workspace";

export const Header = styled.header`
  height: calc(42px + env(safe-area-inset-top, 0px));
  padding: env(safe-area-inset-top, 0px) max(14px, env(safe-area-inset-right, 0px)) 0 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);

  @media (max-width: 767px) {
    padding-right: max(8px, env(safe-area-inset-right, 0px));
    padding-left: 8px;
    gap: 6px;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 767px) {
    gap: 5px;
  }
`;

export const BrandIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const BrandTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  white-space: nowrap;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const ModePill = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 9999px;
  background: var(--bg-subtle);
  color: var(--text-muted);
  white-space: nowrap;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const StatusText = styled.span`
  min-width: 0;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DirtyBadge = styled.span`
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 9999px;
  background: var(--warning-soft);
  color: var(--warning);
  white-space: nowrap;
`;

export const WarningButton = styled.button`
  flex-shrink: 0;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgb(245 158 11 / 0.35);
  background: var(--warning-soft);
  color: var(--warning);
  white-space: nowrap;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    gap: 5px;
  }
`;

export const ViewGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 9px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
`;

export const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 7px;
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 150ms, color 150ms, box-shadow 150ms;

  &:hover:not(:disabled) {
    color: var(--text);
  }
  &[data-active="true"] {
    background: var(--bg-surface);
    color: var(--text);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
  }

  @media (max-width: 767px) {
    padding: 3px 7px;
    font-size: 11px;
    svg {
      display: none;
    }
  }
`;

export const GhostBtn = styled.button`
  ${ghostButton};

  @media (max-width: 640px) {
    padding: 0;
    width: 28px;
    .btn-label {
      display: none;
    }
  }
`;

export const MobileBackBtn = styled(GhostBtn)`
  display: none;
  @media (max-width: 767px) {
    display: inline-flex;
    width: auto;
    padding: 0 8px;
  }
`;

export const DangerBtn = styled.button`
  ${dangerIconButton};
`;

export const PublishBtn = styled.button`
  ${primaryButton};
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 11.5px;

  @media (max-width: 640px) {
    padding: 0 9px;
    gap: 4px;
    font-size: 11px;
  }
`;
