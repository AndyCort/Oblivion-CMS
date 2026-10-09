import * as S from './LocationInput.styles';
import React, { useState } from "react";


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
    <S.Div>
      <S.Label>
        <S.MapPin />
        <span>地点位置</span>
      </S.Label>

      <S.Div2>
        <S.Input
          type="text"
          value={location}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="例如: Elysium, 东京, 杭州 · 咖啡馆..."

 />
        {location && (
          <S.Button
            type="button"
            onClick={() => onChange("")}

            title="清空地点"
          >
            <S.X />
          </S.Button>
        )}
      </S.Div2>

      {/* Historical suggestions popup / chips */}
      {showHistory && filteredHistory.length > 0 && (
        <S.Div3>
          <S.Span>历史地点:</S.Span>
          {filteredHistory.slice(0, 6).map((hist) => (
            <S.Button2
              key={hist}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(hist);
                setShowHistory(false);
              }}

            >
              {hist}
            </S.Button2>
          ))}
        </S.Div3>
      )}
    </S.Div>
  );
};
