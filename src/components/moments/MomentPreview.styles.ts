import styled from "styled-components";

export const Card = styled.div`
  border-radius: 16px;
  border: 1px solid #292524;
  background: #0c0a09;
  padding: 18px;
  color: #fff;
  box-shadow: 0 20px 40px -12px rgb(0 0 0 / 0.35);
`;

export const Header = styled.header`
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid rgb(255 255 255 / 0.2);
`;

export const AuthorName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f5f5f4;
`;

export const ContentBody = styled.div`
  margin-bottom: 14px;
  font-family: var(--font-serif);
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: 0.02em;
  white-space: pre-wrap;
  color: #e7e5e4;
`;

export const EmptyText = styled.span`
  color: #78716c;
  font-style: italic;
`;

export const MediaGrid = styled.div`
  margin-bottom: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const MediaCell = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 8px;
  background: #1c1917;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.3);
  color: #fff;
`;

export const TagList = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-family: var(--font-serif);
  font-size: 12px;
  color: #a5b4fc;
`;

export const LocationRow = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-serif);
  font-size: 12px;
  color: #a8a29e;
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  padding-top: 10px;
  font-size: 12px;
  color: #a8a29e;
`;

export const MusicBadge = styled.span`
  display: flex;
  max-width: 55%;
  align-items: center;
  gap: 5px;
  color: #d6d3d1;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
