import * as S from "./MomentPreview.styles";
import React from "react";
import type { Article } from "../../types/article";
import {
  DEFAULT_MOMENT_AVATAR,
  type MomentDateFormat,
} from "../../lib/settings/cmsSettings";

interface MomentPreviewProps {
  article: Article;
  authorName?: string;
  authorAvatar?: string;
  dateFormat?: MomentDateFormat;
}

function formatDisplayDate(
  timestamp: number,
  dateFormat: MomentDateFormat = "full",
): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart =
    dateFormat === "short"
      ? `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
      : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return `${datePart} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const MomentPreview: React.FC<MomentPreviewProps> = ({
  article,
  authorName,
  authorAvatar,
  dateFormat = "full",
}) => {
  const displayAuthor = authorName?.trim() || "Andy";
  const displayAvatar = authorAvatar?.trim() || DEFAULT_MOMENT_AVATAR;

  return (
    <S.PreviewRoot>
      <S.Card>
        <S.Header>
          <S.AvatarWrap>
            <S.CoverImg src={displayAvatar} alt={`${displayAuthor} Avatar`} />
          </S.AvatarWrap>
          <S.AuthorName>{displayAuthor}</S.AuthorName>
        </S.Header>

        <S.ContentBody>
          {article.content || <S.EmptyText>（暂无正文内容）</S.EmptyText>}
        </S.ContentBody>

        {article.media && article.media.length > 0 && (
          <S.MediaGrid>
            {article.media.map((item, idx) => (
              <S.MediaCell key={idx}>
                {item.type === "img" ? (
                  <S.CoverImg src={item.url} alt="" />
                ) : (
                  <S.VideoWrap>
                    <S.VideoEl src={item.url} />
                    <S.VideoOverlay>
                      <S.PlayBadge>
                        <S.Play />
                      </S.PlayBadge>
                    </S.VideoOverlay>
                  </S.VideoWrap>
                )}
              </S.MediaCell>
            ))}
          </S.MediaGrid>
        )}

        {article.tags && article.tags.length > 0 && (
          <S.TagList>
            {article.tags.map((t) => (
              <S.TagItem key={t}>#{t}</S.TagItem>
            ))}
          </S.TagList>
        )}

        {article.location && (
          <S.LocationRow>
            <S.MapPin />
            <span>{article.location}</span>
          </S.LocationRow>
        )}

        <S.Footer>
          <span>{formatDisplayDate(article.time, dateFormat)}</span>

          {article.music && (
            <S.MusicBadge>
              <S.Music2 />
              <S.MusicTitle>
                {article.music.title} - {article.music.artist}
              </S.MusicTitle>
            </S.MusicBadge>
          )}
        </S.Footer>
      </S.Card>
    </S.PreviewRoot>
  );
};
