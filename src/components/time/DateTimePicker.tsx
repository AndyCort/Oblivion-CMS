import * as S from './DateTimePicker.styles';
import React from "react";


interface DateTimePickerProps {
  time: number;
  onChange: (time: number) => void;
}

/**
 * Format Unix ms timestamp to local datetime-local string YYYY-MM-DDTHH:mm:ss
 */
function toDateTimeLocalString(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ time, onChange }) => {
  const dateStr = toDateTimeLocalString(time || Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const dateObj = new Date(val);
    if (!isNaN(dateObj.getTime())) {
      onChange(dateObj.getTime());
    }
  };

  const handleSetNow = () => {
    onChange(Date.now());
  };

  return (
    <S.Div>
      <S.Div2>
        <S.Label>
          <S.Clock />
          <span>发表时间</span>
        </S.Label>
        <S.Button
          type="button"
          onClick={handleSetNow}

        >
          <S.RotateCcw />
          设为当前时间
        </S.Button>
      </S.Div2>

      <S.Div3>
        <S.Input
          type="datetime-local"
          step="1"
          value={dateStr}
          onChange={handleChange}

 />
      </S.Div3>
    </S.Div>
  );
};
