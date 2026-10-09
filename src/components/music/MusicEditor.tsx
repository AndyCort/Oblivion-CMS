import * as S from './MusicEditor.styles';
import React, { useState } from "react";
import type { ArticleMusic } from "../../types/article";


interface MusicEditorProps {
  music?: ArticleMusic;
  onChange: (music?: ArticleMusic) => void;
}

export const MusicEditor: React.FC<MusicEditorProps> = ({ music, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(music?.title || "");
  const [artist, setArtist] = useState(music?.artist || "");
  const [url, setUrl] = useState(music?.url || "");

  const handleOpenAdd = () => {
    setTitle("");
    setArtist("");
    setUrl("");
    setIsEditing(true);
  };

  const handleOpenEdit = () => {
    setTitle(music?.title || "");
    setArtist(music?.artist || "");
    setUrl(music?.url || "");
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !artist.trim() && !url.trim()) {
      onChange(undefined);
    } else {
      onChange({
        title: title.trim(),
        artist: artist.trim(),
        url: url.trim(),
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    onChange(undefined);
    setIsEditing(false);
  };

  return (
    <S.Div>
      <S.Div2>
        <S.Label>
          <S.Music2 />
          <span>背景音乐 (可选)</span>
        </S.Label>
        {music && !isEditing && (
          <S.Div3>
            <S.Button
              type="button"
              onClick={handleOpenEdit}

            >
              <S.Edit2 />
              编辑
            </S.Button>
            <S.Span>·</S.Span>
            <S.Button2
              type="button"
              onClick={handleDelete}

            >
              <S.Trash2 />
              移除
            </S.Button2>
          </S.Div3>
        )}
      </S.Div2>

      {!music && !isEditing ? (
        <S.Button3
          type="button"
          onClick={handleOpenAdd}

        >
          <S.Plus />
          添加音乐信息 (歌名、歌手、链接)
        </S.Button3>
      ) : isEditing ? (
        <S.Form
          onSubmit={handleSave}

        >
          <S.Div4>
            <div>
              <S.Label2>
                歌曲名称
              </S.Label2>
              <S.Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: Sorrow Love"

 />
            </div>
            <div>
              <S.Label2>
                艺术家 / 歌手
              </S.Label2>
              <S.Input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="例如: Someone"

 />
            </div>
          </S.Div4>
          <div>
            <S.Label2>
              音乐链接 (网页或音频 URL)
            </S.Label2>
            <S.Input2
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/music"

 />
          </div>
          <S.Div5>
            <S.Button4
              type="button"
              onClick={() => setIsEditing(false)}

            >
              取消
            </S.Button4>
            <S.Button5
              type="submit"

            >
              确定
            </S.Button5>
          </S.Div5>
        </S.Form>
      ) : (
        <S.Div6>
          <S.Div7>
            <S.Div8>
              <S.Music22 />
            </S.Div8>
            <S.Div9>
              <S.Div10>
                {music?.title || "未命名曲目"}
              </S.Div10>
              <S.Div11>
                {music?.artist || "未知艺术家"}
              </S.Div11>
            </S.Div9>
          </S.Div7>
          {music?.url && (
            <S.A
              href={music.url}
              target="_blank"
              rel="noopener noreferrer"

              title="打开音乐链接"
            >
              <S.ExternalLink />
            </S.A>
          )}
        </S.Div6>
      )}
    </S.Div>
  );
};
