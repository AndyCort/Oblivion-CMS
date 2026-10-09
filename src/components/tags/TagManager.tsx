import * as S from './TagManager.styles';
import React, { useState } from "react";


interface TagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  availableTags?: Array<{ tag: string; count: number }>;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onChange,
  availableTags = [],
}) => {
  const [inputVal, setInputVal] = useState("");

  const handleAdd = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim().replace(/^#+/, "");
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd(inputVal);
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  // Filter recommendations: existing tags not yet selected
  const suggestedTags = availableTags.filter((item) => !tags.includes(item.tag));

  return (
    <S.Div>
      <S.Label>
        <S.TagIcon />
        <span>文章标签</span>
      </S.Label>

      {/* Selected tags */}
      <S.Div2>
        {tags.map((tag) => (
          <S.Span
            key={tag}

          >
            <span>#{tag}</span>
            <S.Button
              type="button"
              onClick={() => handleRemove(tag)}

            >
              <S.X />
            </S.Button>
          </S.Span>
        ))}

        <S.Div3>
          <S.Input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "输入标签按回车添加..." : "添加标签..."}

 />
          {inputVal.trim() && (
            <S.Button2
              type="button"
              onClick={() => handleAdd(inputVal)}

            >
              <S.Plus />
            </S.Button2>
          )}
        </S.Div3>
      </S.Div2>

      {/* Recommended existing tags */}
      {suggestedTags.length > 0 && (
        <S.Div4>
          <S.Span2>常用标签:</S.Span2>
          {suggestedTags.slice(0, 8).map((item) => (
            <S.Button3
              key={item.tag}
              type="button"
              onClick={() => handleAdd(item.tag)}

            >
              +{item.tag}
              {item.count > 1 && (
                <S.Span3>({item.count})</S.Span3>
              )}
            </S.Button3>
          ))}
        </S.Div4>
      )}
    </S.Div>
  );
};
