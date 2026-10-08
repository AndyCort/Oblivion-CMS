import React, { useState } from "react";
import { MapPin, X } from "lucide-react";

interface LocationInputProps {
  location: string;
  onChange: (location: string) => void;
  historicalLocations?: string[];
}

export const LocationInput: React.FC<LocationInputProps> = ({
  location,
  onChange,
  historicalLocations = [],
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const filteredHistory = historicalLocations.filter(
    (loc) => loc && loc !== location
  );

  return (
    <div className="space-y-1.5 relative">
      <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
        <span>地点位置</span>
      </label>

      <div className="relative flex items-center">
        <input
          type="text"
          value={location}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="例如: Elysium, 东京, 杭州 · 咖啡馆..."
          className="w-full text-sm sm:text-xs p-2.5 pl-3 pr-8 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {location && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            title="清空地点"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Historical suggestions popup / chips */}
      {showHistory && filteredHistory.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1 animate-in fade-in">
          <span className="text-[11px] text-stone-400 dark:text-stone-500">历史地点:</span>
          {filteredHistory.slice(0, 6).map((hist) => (
            <button
              key={hist}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(hist);
                setShowHistory(false);
              }}
              className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 transition-colors"
            >
              {hist}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
