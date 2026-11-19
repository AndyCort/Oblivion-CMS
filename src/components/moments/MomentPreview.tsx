import * as S from "./MomentPreview.styles";
import { MapPin, Music2, Play } from "lucide-react";
import type { Article } from "../../types/article";
import { DEFAULT_MOMENT_AVATAR } from "../../lib/settings/cmsSettings";

interface MomentPreviewProps {
  article: Article;
  authorName?: string;
  authorAvatar?: string;
}

function formatDisplayDate(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MomentPreview({
  article,
  authorName,
  authorAvatar,
}: MomentPreviewProps) {
  const displayAuthor = authorName?.trim() || "Andy";
  const displayAvatar = authorAvatar?.trim() || DEFAULT_MOMENT_AVATAR;

  return (
    <S.Card>
      <S.Header>
        <S.Avatar src={displayAvatar} alt={`${displayAuthor} Avatar`} />
        <S.AuthorName>{displayAuthor}</S.AuthorName>
      </S.Header>

      <S.ContentBody>
        {article.content || <S.EmptyText>（暂无正文内容）</S.EmptyText>}
      </S.ContentBody>

      {article.media.length > 0 && (
        <S.MediaGrid>
          {article.media.map((item, idx) => (
            <S.MediaCell key={idx}>
              {item.type === "img" ? (
                <img src={item.url} alt="" />
              ) : (
                <>
                  <video src={item.url} />
                  <S.VideoOverlay>
                    <Play size={14} fill="currentColor" />
                  </S.VideoOverlay>
                </>
              )}
            </S.MediaCell>
          ))}
        </S.MediaGrid>
      )}

      {article.tags.length > 0 && (
        <S.TagList>
          {article.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </S.TagList>
      )}

      {article.location && (
        <S.LocationRow>
          <MapPin size={13} color="#818cf8" />
          <span>{article.location}</span>
        </S.LocationRow>
      )}

      <S.Footer>
        <span>{formatDisplayDate(article.time)}</span>
        {article.music && (
          <S.MusicBadge>
            <Music2 size={13} color="#818cf8" />
            <span>
              {article.music.title} - {article.music.artist}
            </span>
          </S.MusicBadge>
        )}
      </S.Footer>
    </S.Card>
  );
}
