import styled, { css } from "styled-components";
import {
  X as BaseX,
  ChevronLeft as BaseChevronLeft,
  ChevronRight as BaseChevronRight,
} from "lucide-react";

const roundNavStyle = css`
  border-radius: 9999px;
  color: var(--color-white);
  cursor: pointer;
  transition: background-color var(--default-transition-duration)
    var(--default-transition-timing-function);

  @media (hover: hover) {
    &:hover {
      background-color: color-mix(in oklab, var(--color-white) 25%, transparent);
    }
  }
  &:active {
    background-color: color-mix(in oklab, var(--color-white) 35%, transparent);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in oklab, var(--color-black) 90%, transparent);
  padding: calc(var(--spacing) * 2);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  user-select: none;

  @media (width >= 40rem) {
    padding: calc(var(--spacing) * 4);
  }
`;

export const TopBar = styled.div`
  position: absolute;
  top: calc(var(--spacing) * 4);
  right: calc(var(--spacing) * 4);
  padding-top: max(0.75rem, env(safe-area-inset-top, 0px));
  z-index: 20;
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 3);
`;

export const CounterBadge = styled.span`
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--color-black) 40%, transparent);
  padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 2);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-300);
  backdrop-filter: blur(var(--blur-xs));
  -webkit-backdrop-filter: blur(var(--blur-xs));

  @media (width >= 40rem) {
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
  }
`;

export const CloseBtn = styled.button`
  ${roundNavStyle};
  background-color: color-mix(in oklab, var(--color-white) 15%, transparent);
  padding: calc(var(--spacing) * 2);

  @media (width >= 40rem) {
    padding: calc(var(--spacing) * 2.5);
  }
`;

export const X = styled(BaseX)`
  height: calc(var(--spacing) * 5);
  width: calc(var(--spacing) * 5);
`;

export const NavBtn = styled.button<{ $side: "left" | "right" }>`
  ${roundNavStyle};
  position: absolute;
  ${(p) => (p.$side === "left" ? "left" : "right")}: calc(var(--spacing) * 2);
  z-index: 20;
  background-color: color-mix(in oklab, var(--color-white) 10%, transparent);
  padding: calc(var(--spacing) * 2);
  backdrop-filter: blur(var(--blur-xs));
  -webkit-backdrop-filter: blur(var(--blur-xs));

  @media (width >= 40rem) {
    ${(p) => (p.$side === "left" ? "left" : "right")}: calc(var(--spacing) * 4);
    padding: calc(var(--spacing) * 3);
  }
`;

const navIconCss = css`
  height: calc(var(--spacing) * 5);
  width: calc(var(--spacing) * 5);
  @media (width >= 40rem) {
    height: calc(var(--spacing) * 6);
    width: calc(var(--spacing) * 6);
  }
`;

export const ChevronLeft = styled(BaseChevronLeft)`
  ${navIconCss};
`;

export const ChevronRight = styled(BaseChevronRight)`
  ${navIconCss};
`;

export const Stage = styled.div`
  display: flex;
  max-height: 85vh;
  width: 100%;
  max-width: var(--container-4xl);
  align-items: center;
  justify-content: center;
  padding: calc(var(--spacing) * 2);
`;

export const LightboxImg = styled.img`
  max-height: 80vh;
  max-width: 100%;
  border-radius: var(--radius-lg);
  object-fit: contain;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

export const VideoWrap = styled.div`
  display: flex;
  aspect-ratio: var(--aspect-video);
  width: 100%;
  max-width: var(--container-3xl);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background-color: var(--color-black);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

export const LightboxVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;
