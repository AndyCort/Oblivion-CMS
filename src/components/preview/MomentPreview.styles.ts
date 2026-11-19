import styled from "styled-components";
import {
  Play as BasePlay,
  MapPin as BaseMapPin,
  Music2 as BaseMusic2,
} from "lucide-react";

export const PreviewRoot = styled.div`
  & > :not(:last-child) {
    margin-bottom: calc(var(--spacing) * 2);
  }
`;

export const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in oklab, var(--color-stone-800) 80%, transparent);
  background-color: var(--color-stone-950);
  padding: calc(var(--spacing) * 4);
  color: var(--color-white);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  backdrop-filter: blur(var(--blur-xl));
  -webkit-backdrop-filter: blur(var(--blur-xl));

  @media (width >= 40rem) {
    padding: calc(var(--spacing) * 5);
  }
`;

export const Header = styled.header`
  margin-bottom: calc(var(--spacing) * 4);
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 3);
`;

export const AvatarWrap = styled.div`
  height: calc(var(--spacing) * 9);
  width: calc(var(--spacing) * 9);
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid color-mix(in oklab, var(--color-white) 20%, transparent);
`;

export const CoverImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const AuthorName = styled.div`
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  font-weight: var(--font-weight-medium);
  color: var(--color-stone-100);
`;

export const ContentBody = styled.div`
  margin-bottom: calc(var(--spacing) * 4);
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  letter-spacing: var(--tracking-wide);
  white-space: pre-wrap;
  color: var(--color-stone-200);
  user-select: text;
`;

export const EmptyText = styled.span`
  color: var(--color-stone-500);
  font-style: italic;
`;

export const MediaGrid = styled.div`
  margin-bottom: calc(var(--spacing) * 4);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(var(--spacing) * 2);

  @media (width >= 40rem) {
    gap: calc(var(--spacing) * 2.5);
  }
`;

export const MediaCell = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--color-white) 10%, transparent);
  background-color: var(--color-stone-900);
`;

export const VideoWrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const VideoEl = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in oklab, var(--color-black) 30%, transparent);
`;

export const PlayBadge = styled.div`
  display: flex;
  height: calc(var(--spacing) * 7);
  width: calc(var(--spacing) * 7);
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--color-black) 60%, transparent);
  color: var(--color-white);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

export const Play = styled(BasePlay)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  transform: translateX(calc(var(--spacing) * 0.5));
  fill: var(--color-white);
`;

export const TagList = styled.div`
  margin-bottom: calc(var(--spacing) * 3);
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--spacing) * 2.5);
  font-family: var(--font-serif);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
`;

export const TagItem = styled.span`
  color: var(--color-indigo-300);
`;

export const LocationRow = styled.div`
  margin-bottom: calc(var(--spacing) * 4);
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  font-family: var(--font-serif);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-400);
`;

export const MapPin = styled(BaseMapPin)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  stroke-width: 2.5;
  color: var(--color-indigo-400);
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid color-mix(in oklab, var(--color-white) 10%, transparent);
  padding-top: calc(var(--spacing) * 3);
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-stone-400);
`;

export const MusicBadge = styled.span`
  display: flex;
  max-width: 50%;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-stone-300);
`;

export const Music2 = styled(BaseMusic2)`
  height: calc(var(--spacing) * 3.5);
  width: calc(var(--spacing) * 3.5);
  flex-shrink: 0;
  color: var(--color-indigo-400);
`;

export const MusicTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
