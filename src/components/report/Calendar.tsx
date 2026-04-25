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
  while (cells.length < 42) cells.push(null); // 항상 6주

  return (
    <div className="h-full p-4 md:p-6 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3 md:mb-5">
        <button
          onClick={() => onMonthChange(-1)}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <span className="text-base md:text-xl font-bold text-[#111827]">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={() => onMonthChange(1)}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={clsx(
              "text-center text-xs md:text-sm font-semibold py-1.5 md:py-2",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 flex-1 content-start">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="h-11 md:h-14" />;

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
                "relative flex flex-col items-center justify-center h-11 md:h-14 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all",
                isSelected && "bg-[#FF7E64] text-white",
                !isSelected && isToday && "bg-[#FFEFEC] text-[#FF7E64]",
                !isSelected && !isToday && "hover:bg-gray-50",
                !isSelected && !isToday && col === 0 && "text-red-400",
                !isSelected && !isToday && col === 6 && "text-blue-400",
                !isSelected && !isToday && col > 0 && col < 6 && "text-[#111827]",
              )}
            >
              {date.getDate()}
              {hasContent && (
                <span
                  className={clsx(
                    "absolute bottom-1.5 w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-white/70" : "bg-[#FF7E64]"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
