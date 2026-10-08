import React from "react";
import { Clock, RotateCcw } from "lucide-react";

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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>发表时间</span>
        </label>
        <button
          type="button"
          onClick={handleSetNow}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          设为当前时间
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="datetime-local"
          step="1"
          value={dateStr}
          onChange={handleChange}
          className="w-full text-sm sm:text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
        />
      </div>
    </div>
  );
};
