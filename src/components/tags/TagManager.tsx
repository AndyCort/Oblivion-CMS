import React, { useState } from "react";
import { Tag as TagIcon, X, Plus } from "lucide-react";

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
    <div className="space-y-2">
      <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
        <TagIcon className="w-3.5 h-3.5 text-indigo-500" />
        <span>文章标签</span>
      </label>

      {/* Selected tags */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 min-h-10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 animate-in fade-in"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="hover:text-indigo-900 dark:hover:text-indigo-200 p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[120px] flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "输入标签按回车添加..." : "添加标签..."}
            className="w-full text-sm sm:text-xs bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={() => handleAdd(inputVal)}
              className="text-indigo-600 p-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Recommended existing tags */}
      {suggestedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <span className="text-[11px] text-stone-400 dark:text-stone-500">常用标签:</span>
          {suggestedTags.slice(0, 8).map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => handleAdd(item.tag)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 transition-colors"
            >
              +{item.tag}
              {item.count > 1 && (
                <span className="text-[10px] opacity-60 ml-0.5">({item.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
