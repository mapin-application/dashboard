"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface CalendarProps {
  selectedMonth: Date;
  selectedDate: Date | null;
  datesWithContent: Set<string>;
  onMonthChange: (dir: number) => void;
  onDateSelect: (date: Date) => void;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function Calendar({
  selectedMonth,
  selectedDate,
  datesWithContent,
  onMonthChange,
  onDateSelect,
}: CalendarProps) {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="bg-white rounded-2xl p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(-1)}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-[#111827]">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={() => onMonthChange(1)}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={clsx(
              "text-center text-[11px] font-medium py-1",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const dateStr = toDateString(date);
          const hasContent = datesWithContent.has(dateStr);
          const isSelected = selectedDate ? toDateString(selectedDate) === dateStr : false;
          const isToday = toDateString(new Date()) === dateStr;
          const col = i % 7;

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(date)}
              className={clsx(
                "relative flex flex-col items-center justify-center h-9 rounded-lg text-[12px] font-medium transition-all",
                isSelected && "bg-[#FFEFEC]",
                !isSelected && "hover:bg-gray-50",
                col === 0 ? "text-red-400" : col === 6 ? "text-blue-400" : "text-[#111827]",
                isSelected && "text-[#FF7E64]"
              )}
            >
              {date.getDate()}
              {hasContent && (
                <span
                  className={clsx(
                    "absolute bottom-1 w-1 h-1 rounded-full",
                    isSelected ? "bg-[#FF7E64]" : "bg-red-400"
                  )}
                />
              )}
              {isToday && !isSelected && (
                <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#FF7E64]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
