import styled, { css } from "styled-components";
import {
  Plus as BasePlus,
  Search as BaseSearch,
  ArrowUpDown as BaseArrowUpDown,
  Sparkles as BaseSparkles,
  Clock as BaseClock,
  FileEdit as BaseFileEdit,
  CheckCircle2 as BaseCheckCircle2,
  MapPin as BaseMapPin,
  Music2 as BaseMusic2,
  Copy as BaseCopy,
  Trash2 as BaseTrash2,
} from "lucide-react";
import { sidebarSurface, primaryButton } from "../../styles/workspace";

export const SidebarContainer = styled.div`
  ${sidebarSurface};
  display: flex;
  height: 100%;
  flex-direction: column;
  @media (max-width: 767px) {
    border-right: 0;
  }
`;

export const SidebarHeader = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-stone-100);
  padding: calc(var(--spacing) * 3.5);

  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 3);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
  }
`;

export const SidebarTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SidebarTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 2);
`;

export const SidebarTitle = styled.h2`
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  font-weight: var(--font-weight-semibold);
  color: var(--color-stone-900);

  &:where(.dark, .dark *) {
    color: var(--color-stone-100);
  }
`;

export const CountBadge = styled.span`
  border-radius: 9999px;
  background-color: var(--color-stone-100);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-600);

  &:where(.dark, .dark *) {
    background-color: var(--color-stone-800);
    color: var(--color-stone-400);
  }
`;

export const CreateButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
`;

export const CreateButton = styled.button`
  ${primaryButton};
`;

export const Plus = styled(BasePlus)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
`;

export const SearchBox = styled.div`
  position: relative;
`;

export const SearchIcon = styled(BaseSearch)`
  position: absolute;
  top: 50%;
  left: calc(var(--spacing) * 3);
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  transform: translateY(-50%);
  color: var(--color-stone-400);
`;

export const SearchInput = styled.input`
  width: 100%;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3) calc(var(--spacing) * 2)
    calc(var(--spacing) * 8.5);
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-stone-900);

  &::placeholder {
    color: var(--color-stone-400);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-indigo-500);
  }
  @media (width >= 40rem) {
    font-size: var(--text-xs);
    line-height: var(--text-xs--line-height);
  }
  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: var(--color-stone-950);
    color: var(--color-stone-100);
  }
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
`;

export const FilterChipsScroll = styled.div`
  display: flex;
  scrollbar-width: none;
  -ms-overflow-style: none;
  align-items: center;
  gap: var(--spacing);
  overflow-x: auto;
  padding-block: calc(var(--spacing) * 0.5);
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterChip = styled.button<{
  $active?: boolean;
  $tone?: "amber" | "indigo";
}>`
  border-radius: var(--radius-lg);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 2);
  font-size: 11px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color var(--default-transition-duration) var(--default-transition-timing-function),
    background-color var(--default-transition-duration) var(--default-transition-timing-function),
    border-color var(--default-transition-duration) var(--default-transition-timing-function);

  ${(p) =>
    p.$active
      ? p.$tone === "amber"
        ? css`
            border: 1px solid color-mix(in oklab, var(--color-amber-300) 60%, transparent);
            background-color: var(--color-amber-100);
            font-weight: var(--font-weight-medium);
            color: var(--color-amber-700);
            &:where(.dark, .dark *) {
              background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
              color: var(--color-amber-300);
            }
          `
        : css`
            border: 1px solid color-mix(in oklab, var(--color-indigo-300) 60%, transparent);
            background-color: var(--color-indigo-100);
            font-weight: var(--font-weight-medium);
            color: var(--color-indigo-700);
            &:where(.dark, .dark *) {
              background-color: color-mix(in oklab, var(--color-indigo-950) 60%, transparent);
              color: var(--color-indigo-300);
            }
          `
      : css`
          background-color: var(--color-stone-100);
          color: var(--color-stone-600);
          @media (hover: hover) {
            &:hover {
              background-color: var(--color-stone-200);
            }
          }
          &:where(.dark, .dark *) {
            background-color: var(--color-stone-800);
            color: var(--color-stone-400);
          }
        `}
`;

export const ActiveTagChip = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing);
  border-radius: var(--radius-lg);
  background-color: var(--color-indigo-600);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 2);
  font-size: 11px;
  color: var(--color-white);
  cursor: pointer;
`;

export const SortButton = styled.button`
  margin-left: calc(var(--spacing) * 2);
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--spacing);
  font-size: 11px;
  color: var(--color-stone-500);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: var(--color-stone-800);
    }
    &:where(.dark, .dark *):hover {
      color: var(--color-stone-200);
    }
  }
`;

export const ArrowUpDown = styled(BaseArrowUpDown)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
`;

export const TagChip = styled.button`
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: var(--color-stone-100);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 2);
  font-size: 10px;
  color: var(--color-stone-600);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-stone-200);
    }
    &:where(.dark, .dark *):hover {
      background-color: var(--color-stone-700);
    }
  }
  &:where(.dark, .dark *) {
    background-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
    color: var(--color-stone-400);
  }
`;

export const ArticleListScroll = styled.div`
  flex: 1;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
  overflow-y: auto;

  & > :not(:last-child) {
    border-bottom: 1px solid var(--color-stone-100);
  }
  &:where(.dark, .dark *) > :not(:last-child) {
    border-color: color-mix(in oklab, var(--color-stone-800) 80%, transparent);
  }
`;

export const EmptyState = styled.div`
  padding: calc(var(--spacing) * 8);
  text-align: center;
  color: var(--color-stone-400);

  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 2);
  }
`;

export const Sparkles = styled(BaseSparkles)`
  margin-inline: auto;
  height: calc(var(--spacing) * 8);
  width: calc(var(--spacing) * 8);
  stroke-width: 1;
  opacity: 0.6;
`;

export const EmptyText = styled.p`
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
`;

export const ArticleCard = styled.div<{
  $selected?: boolean;
  $compact?: boolean;
}>`
  position: relative;
  cursor: pointer;
  padding: ${(p) => (p.$compact ? "8px 12px" : "calc(var(--spacing) * 3.5)")};
  transition:
    color var(--default-transition-duration) var(--default-transition-timing-function),
    background-color var(--default-transition-duration) var(--default-transition-timing-function),
    border-color var(--default-transition-duration) var(--default-transition-timing-function);

  &:active {
    background-color: color-mix(in oklab, var(--color-stone-100) 70%, transparent);
  }
  &:where(.dark, .dark *):active {
    background-color: color-mix(in oklab, var(--color-stone-800) 60%, transparent);
  }

  ${(p) =>
    p.$selected
      ? css`
          border-left: 3px solid var(--color-indigo-600);
          background-color: color-mix(in oklab, var(--color-indigo-50) 70%, transparent);
          &:where(.dark, .dark *) {
            background-color: color-mix(in oklab, var(--color-indigo-950) 40%, transparent);
          }
        `
      : css`
          @media (hover: hover) {
            &:hover {
              background-color: var(--color-stone-50);
            }
            &:where(.dark, .dark *):hover {
              background-color: color-mix(in oklab, var(--color-stone-800) 50%, transparent);
            }
          }
        `}
`;

export const CardMetaRow = styled.div`
  margin-bottom: calc(var(--spacing) * 1.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-stone-400);
`;

export const DateLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing);
  font-family: var(--font-mono);
`;

export const Clock = styled(BaseClock)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
  color: var(--color-stone-400);
`;

export const DraftBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing);
  border-radius: 0.25rem;
  background-color: var(--color-amber-100);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 1.5);
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  color: var(--color-amber-700);

  &:where(.dark, .dark *) {
    background-color: color-mix(in oklab, var(--color-amber-950) 80%, transparent);
    color: var(--color-amber-400);
  }
`;

export const FileEdit = styled(BaseFileEdit)`
  height: calc(var(--spacing) * 2.5);
  width: calc(var(--spacing) * 2.5);
`;

export const PublishedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: var(--spacing);
  font-size: 10px;
  color: var(--color-emerald-600);

  &:where(.dark, .dark *) {
    color: var(--color-emerald-400);
  }
`;

export const CheckCircle2 = styled(BaseCheckCircle2)`
  height: calc(var(--spacing) * 2.5);
  width: calc(var(--spacing) * 2.5);
`;

export const CardExcerpt = styled.div<{ $compact?: boolean }>`
  margin-bottom: ${(p) =>
    p.$compact ? "calc(var(--spacing) * 1)" : "calc(var(--spacing) * 2)"};
  font-family: var(--font-serif);
  font-size: var(--text-xs);
  line-height: var(--leading-relaxed);
  letter-spacing: var(--tracking-wide);
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: var(--color-stone-800);
  user-select: text;

  ${(p) =>
    p.$compact &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}

  @media (width >= 40rem) {
    font-size: 13px;
  }
  &:where(.dark, .dark *) {
    color: var(--color-stone-200);
  }
`;

export const EmptyContentHint = styled.span`
  color: var(--color-stone-400);
  font-style: italic;
  &:where(.dark, .dark *) {
    color: var(--color-stone-500);
  }
`;

export const MediaStrip = styled.div`
  margin-bottom: calc(var(--spacing) * 2);
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
`;

export const MediaThumbBox = styled.div`
  height: calc(var(--spacing) * 7);
  width: calc(var(--spacing) * 7);
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-200);

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-800);
  }
`;

export const MediaThumbImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const VideoThumbTag = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: var(--color-stone-900);
  font-size: 8px;
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
`;

export const ExtraMediaCount = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-stone-400);
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing);
  font-size: 11px;
  color: var(--color-stone-400);
`;

export const MetaBadges = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MetaBadge = styled.span`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-stone-500);
`;

export const MetaText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MapPin = styled(BaseMapPin)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
  flex-shrink: 0;
  color: var(--color-indigo-400);
`;

export const Music2 = styled(BaseMusic2)`
  height: calc(var(--spacing) * 3);
  width: calc(var(--spacing) * 3);
  flex-shrink: 0;
  color: var(--color-indigo-400);
`;

export const CardHoverActions = styled.div`
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

export const CardHoverBtn = styled.button<{ $danger?: boolean }>`
  border-radius: var(--radius-md);
  padding: calc(var(--spacing) * 1.5);
  color: var(--color-stone-400);
  cursor: pointer;
  transition: transform var(--default-transition-duration) var(--default-transition-timing-function);

  @media (hover: hover) {
    ${(p) =>
      p.$danger
        ? css`
            &:hover {
              background-color: var(--color-rose-50);
              color: var(--color-rose-600);
            }
            &:where(.dark, .dark *):hover {
              background-color: color-mix(in oklab, var(--color-rose-950) 50%, transparent);
            }
          `
        : css`
            &:hover {
              background-color: color-mix(in oklab, var(--color-stone-200) 60%, transparent);
              color: var(--color-stone-700);
            }
            &:where(.dark, .dark *):hover {
              background-color: color-mix(in oklab, var(--color-stone-700) 60%, transparent);
              color: var(--color-stone-200);
            }
          `}
  }
  &:active {
    transform: scale(0.95);
  }
  @media (width >= 40rem) {
    padding: var(--spacing);
  }
`;

const hoverIconCss = css`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  @media (width >= 40rem) {
    height: calc(var(--spacing) * 3);
    width: calc(var(--spacing) * 3);
  }
`;

export const Copy = styled(BaseCopy)`
  ${hoverIconCss};
`;

export const Trash2 = styled(BaseTrash2)`
  ${hoverIconCss};
`;
