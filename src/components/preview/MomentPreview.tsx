import * as S from './MomentPreview.styles';
import React from "react";
import type { Article } from "../../types/article";


interface MomentPreviewProps {
  article: Article;
}

function formatDisplayDate(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const MomentPreview: React.FC<MomentPreviewProps> = ({ article }) => {
  return (
    <S.Div>
      <S.Div2>
        <S.Span>
          <S.Eye />
          <span>博客前台实时渲染预览</span>
        </S.Span>
        <S.Span2>
          (与 Oblivion 前台 1:1 视觉对齐)
        </S.Span2>
      </S.Div2>

      <S.Div3>
        {/* Card Header: Avatar & Author */}
        <S.Header>
          <S.Div4>
            <S.Img
              src="https://raw.githubusercontent.com/AndyCort/PicGo/master/img/6C93394B-9A64-4DCE-BA19-3E6A316120D1_1_201_a.jpeg"
              alt="Avatar"

 />
          </S.Div4>
          <S.Div5>Andy</S.Div5>
        </S.Header>

        {/* Content text: whitespace-pre-wrap */}
        <S.Div6>
          {article.content || (
            <S.Span3>（暂无正文内容）</S.Span3>
          )}
        </S.Div6>

        {/* 3-Column Media Grid */}
        {article.media && article.media.length > 0 && (
          <S.Div7>
            {article.media.map((item, idx) => (
              <S.Div8
                key={idx}

              >
                {item.type === "img" ? (
                  <S.Img
                    src={item.url}
                    alt=""

 />
                ) : (
                  <S.Div9>
                    <S.Video
                      src={item.url}

 />
                    <S.Div10>
                      <S.Div11>
                        <S.Play />
                      </S.Div11>
                    </S.Div10>
                  </S.Div9>
                )}
              </S.Div8>
            ))}
          </S.Div7>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <S.Div12>
            {article.tags.map((t) => (
              <S.Span4 key={t} >
                #{t}
              </S.Span4>
            ))}
          </S.Div12>
        )}

        {/* Location */}
        {article.location && (
          <S.Div13>
            <S.MapPin />
            <span>{article.location}</span>
          </S.Div13>
        )}

        {/* Card Footer: Time & Music */}
        <S.Footer>
          <span>{formatDisplayDate(article.time)}</span>

          {article.music && (
            <S.Span5>
              <S.Music2 />
              <S.Span6>
                {article.music.title} - {article.music.artist}
              </S.Span6>
            </S.Span5>
          )}
        </S.Footer>
      </S.Div3>
    </S.Div>
  );
};
