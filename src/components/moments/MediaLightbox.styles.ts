import styled, { css } from "styled-components";

const roundNav = css`
  border-radius: 9999px;
  color: #fff;
  transition: background-color 150ms;

  &:hover {
    background-color: rgb(255 255 255 / 0.25);
  }
  &:active {
    background-color: rgb(255 255 255 / 0.35);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 65;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.9);
  padding: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  user-select: none;
`;

export const TopBar = styled.div`
  position: absolute;
  top: max(16px, env(safe-area-inset-top, 16px));
  right: max(16px, env(safe-area-inset-right, 16px));
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CounterBadge = styled.span`
  border-radius: 9999px;
  background: rgb(0 0 0 / 0.45);
  padding: 3px 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: #d6d3d1;
`;

export const CloseBtn = styled.button`
  ${roundNav};
  background: rgb(255 255 255 / 0.16);
  padding: 8px;
`;

export const NavBtn = styled.button<{ $side: "left" | "right" }>`
  ${roundNav};
  position: absolute;
  ${(p) => (p.$side === "left" ? "left" : "right")}: 12px;
  z-index: 20;
  background: rgb(255 255 255 / 0.12);
  padding: 10px;
`;

export const Stage = styled.div`
  display: flex;
  max-height: 85vh;
  width: 100%;
  max-width: 56rem;
  align-items: center;
  justify-content: center;
`;

export const LightboxImg = styled.img`
  max-height: 80vh;
  max-width: 100%;
  border-radius: 10px;
  object-fit: contain;
`;

export const VideoWrap = styled.div`
  display: flex;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 48rem;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
`;

export const LightboxVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;
