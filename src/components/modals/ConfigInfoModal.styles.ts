import styled, { css } from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 12px;
  padding-top: max(12px, env(safe-area-inset-top, 0px));
  padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
  padding-left: max(12px, env(safe-area-inset-left, 0px));
  padding-right: max(12px, env(safe-area-inset-right, 0px));
`;

export const Dialog = styled.div`
  width: 100%;
  max-width: 780px;
  height: min(650px, calc(100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-white);
  color: var(--color-stone-900);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: var(--color-stone-900);
    color: var(--color-stone-100);
  }
`;

export const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-stone-200);

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
  }
`;

export const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const HeaderIconBox = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in oklab, var(--color-indigo-500) 14%, transparent);
  color: var(--color-indigo-600);

  &:where(.dark, .dark *) {
    color: var(--color-indigo-300);
  }
`;

export const HeaderTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
`;

export const HeaderSubtitle = styled.p`
  font-size: 11px;
  color: var(--color-stone-500);

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const CloseButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-stone-400);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: var(--color-stone-100);
    color: var(--color-stone-700);
  }
  &:where(.dark, .dark *):hover {
    background-color: var(--color-stone-800);
    color: var(--color-stone-200);
  }
`;

export const TabBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-950) 60%, transparent);
  }

  @media (max-width: 640px) {
    padding: 8px 10px;
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border-radius: 9999px;
  border: 1px solid
    ${(p) => (p.$active ? "var(--color-indigo-600)" : "transparent")};
  background-color: ${(p) =>
    p.$active ? "var(--color-indigo-600)" : "transparent"};
  color: ${(p) =>
    p.$active ? "var(--color-white)" : "var(--color-stone-600)"};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;

  &:hover {
    background-color: ${(p) =>
      p.$active ? "var(--color-indigo-600)" : "var(--color-stone-200)"};
  }

  &:where(.dark, .dark *) {
    color: ${(p) =>
      p.$active ? "var(--color-white)" : "var(--color-stone-300)"};
    &:hover {
      background-color: ${(p) =>
        p.$active ? "var(--color-indigo-600)" : "var(--color-stone-800)"};
    }
  }
`;

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 640px) {
    padding: 12px;
    gap: 12px;
  }
`;

export const SectionCard = styled.section`
  border-radius: 14px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-white);
  overflow: hidden;

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-950) 55%, transparent);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-stone-100);
  background-color: var(--color-stone-50);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-stone-600);

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-900) 80%, transparent);
    color: var(--color-stone-300);
  }
`;

export const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--color-stone-100);

  &:last-child {
    border-bottom: none;
  }

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
  }

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export const SettingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1 1 200px;

  @media (max-width: 560px) {
    flex: none;
  }
`;

export const SettingLabel = styled.span`
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-stone-900);

  &:where(.dark, .dark *) {
    color: var(--color-stone-100);
  }
`;

export const SettingHint = styled.span`
  font-size: 11px;
  color: var(--color-stone-500);
  line-height: 1.4;

  &:where(.dark, .dark *) {
    color: var(--color-stone-400);
  }
`;

export const SettingControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 1 auto;
  max-width: 100%;
  flex-wrap: wrap;

  @media (max-width: 560px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const TextInput = styled.input`
  height: 32px;
  min-width: 180px;
  max-width: 100%;
  padding: 0 10px;
  border-radius: 9px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  color: var(--color-stone-900);
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: var(--color-indigo-500);
    background-color: var(--color-white);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-900);
    color: var(--color-stone-100);
    &:focus {
      border-color: var(--color-indigo-400);
    }
  }

  @media (max-width: 560px) {
    flex: 1 1 140px;
    min-width: 0;
  }
`;

export const SelectInput = styled.select`
  height: 32px;
  padding: 0 10px;
  border-radius: 9px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  color: var(--color-stone-900);
  font-size: 12px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-indigo-500);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-900);
    color: var(--color-stone-100);
  }
`;

export const SegmentGroup = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  max-width: 100%;
  padding: 2px;
  gap: 2px;
  border-radius: 9px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-100);

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-800);
  }
`;

export const SegmentButton = styled.button<{ $active: boolean }>`
  height: 26px;
  padding: 0 10px;
  border-radius: 7px;
  border: none;
  background-color: ${(p) => (p.$active ? "var(--color-white)" : "transparent")};
  color: ${(p) =>
    p.$active ? "var(--color-stone-900)" : "var(--color-stone-500)"};
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: ${(p) => (p.$active ? "0 1px 2px rgb(0 0 0 / 0.08)" : "none")};

  &:where(.dark, .dark *) {
    background-color: ${(p) => (p.$active ? "var(--color-stone-700)" : "transparent")};
    color: ${(p) =>
      p.$active ? "var(--color-stone-100)" : "var(--color-stone-400)"};
  }
`;

export const ToggleSwitch = styled.button<{ $checked: boolean }>`
  width: 40px;
  height: 22px;
  padding: 2px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: ${(p) => (p.$checked ? "flex-end" : "flex-start")};
  background-color: ${(p) =>
    p.$checked ? "var(--color-indigo-600)" : "var(--color-stone-300)"};
  transition: background-color 150ms;

  &:where(.dark, .dark *) {
    background-color: ${(p) =>
      p.$checked ? "var(--color-indigo-500)" : "var(--color-stone-700)"};
  }
`;

export const ToggleKnob = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background-color: var(--color-white);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
`;

export const AccentSwatchButton = styled.button<{
  $color: string;
  $active: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 9px;
  border-radius: 9999px;
  border: 1.5px solid
    ${(p) => (p.$active ? p.$color : "var(--color-stone-200)")};
  background-color: ${(p) =>
    p.$active ? `color-mix(in oklab, ${p.$color} 12%, transparent)` : "transparent"};
  color: inherit;
  font-size: 11.5px;
  cursor: pointer;

  &:where(.dark, .dark *) {
    border-color: ${(p) => (p.$active ? p.$color : "var(--color-stone-700)")};
  }
`;

export const AccentDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background-color: ${(p) => p.$color};
`;

export const PreviewThumb = styled.img<{ $round?: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: ${(p) => (p.$round ? "9999px" : "8px")};
  object-fit: cover;
  border: 1px solid var(--color-stone-200);
  flex-shrink: 0;

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
  }
`;

export const ActionButton = styled.button<{
  $tone?: "default" | "primary" | "danger";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 30px;
  padding: 0 11px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms, border-color 150ms, opacity 150ms;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${(p) =>
    p.$tone === "primary"
      ? css`
          border: 1px solid var(--color-indigo-600);
          background-color: var(--color-indigo-600);
          color: var(--color-white);
          &:hover:not(:disabled) {
            background-color: var(--color-indigo-500);
          }
        `
      : p.$tone === "danger"
        ? css`
            border: 1px solid rgb(244 63 94 / 0.35);
            background-color: rgb(244 63 94 / 0.08);
            color: var(--color-rose-600);
            &:hover:not(:disabled) {
              background-color: rgb(244 63 94 / 0.16);
            }
            &:where(.dark, .dark *) {
              color: var(--color-rose-400);
            }
          `
        : css`
            border: 1px solid var(--color-stone-200);
            background-color: var(--color-white);
            color: var(--color-stone-700);
            &:hover:not(:disabled) {
              background-color: var(--color-stone-100);
            }
            &:where(.dark, .dark *) {
              border-color: var(--color-stone-700);
              background-color: var(--color-stone-800);
              color: var(--color-stone-200);
              &:hover:not(:disabled) {
                background-color: var(--color-stone-700);
              }
            }
          `}
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StatCard = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    font-size: 18px;
    font-weight: 700;
    font-family: var(--font-mono);
  }
  span {
    font-size: 11px;
    color: var(--color-stone-500);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-950) 55%, transparent);
    span {
      color: var(--color-stone-400);
    }
  }
`;

export const DraftList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
`;

export const DraftItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--color-stone-100);
  font-size: 12px;

  &:last-child {
    border-bottom: none;
  }

  &:where(.dark, .dark *) {
    border-bottom-color: var(--color-stone-800);
  }
`;

export const DraftBadge = styled.span<{ $kind: "moment" | "post" }>`
  padding: 1px 6px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
  background-color: ${(p) =>
    p.$kind === "moment" ? "rgb(99 102 241 / 0.14)" : "rgb(16 185 129 / 0.14)"};
  color: ${(p) =>
    p.$kind === "moment" ? "var(--color-indigo-600)" : "var(--color-emerald-700)"};

  &:where(.dark, .dark *) {
    color: ${(p) =>
      p.$kind === "moment" ? "var(--color-indigo-300)" : "var(--color-emerald-300)"};
  }
`;

export const ImportBox = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ImportTextarea = styled.textarea`
  width: 100%;
  min-height: 88px;
  resize: vertical;
  padding: 9px 11px;
  border-radius: 10px;
  border: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  color: var(--color-stone-900);
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.5;
  outline: none;

  &:focus {
    border-color: var(--color-indigo-500);
  }

  &:where(.dark, .dark *) {
    border-color: var(--color-stone-700);
    background-color: var(--color-stone-900);
    color: var(--color-stone-100);
  }
`;

export const ShortcutTable = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 12px 14px;

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ShortcutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 9px;
  background-color: var(--color-stone-50);
  font-size: 11.5px;

  kbd {
    font-family: var(--font-mono);
    font-size: 10.5px;
    padding: 2px 6px;
    border-radius: 5px;
    border: 1px solid var(--color-stone-200);
    background-color: var(--color-white);
  }

  &:where(.dark, .dark *) {
    background-color: var(--color-stone-900);
    kbd {
      border-color: var(--color-stone-700);
      background-color: var(--color-stone-800);
    }
  }
`;

export const Footer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid var(--color-stone-200);
  background-color: var(--color-stone-50);
  font-size: 11.5px;

  &:where(.dark, .dark *) {
    border-top-color: var(--color-stone-800);
    background-color: color-mix(in oklab, var(--color-stone-950) 60%, transparent);
  }
`;
