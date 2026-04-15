"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/report/Calendar";
import { ContentCard } from "@/components/report/ContentCard";
import { mockContentsByDate } from "@/lib/mockData";
import { Logo } from "@/components/ui/Logo";

const CATEGORIES = ["전체", "정치", "경제", "사회", "생활/문화", "IT/과학", "세계", "연예", "스포츠"];
const PLATFORMS = ["전체", "YouTube", "뉴스"];

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function ReportPage() {
  const router = useRouter();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showPlatDropdown, setShowPlatDropdown] = useState(false);

  const datesWithContent = useMemo(() => new Set(Object.keys(mockContentsByDate)), []);

  const filteredContents = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = toDateString(selectedDate);
    const contents = mockContentsByDate[dateStr] || [];
    return contents.filter((c) => {
      const catMatch = selectedCategory === "전체" || c.category === selectedCategory;
      const platMatch =
        selectedPlatform === "전체" ||
        (selectedPlatform === "YouTube" && c.platform === "YouTube") ||
        (selectedPlatform === "뉴스" && c.platform !== "YouTube");
      return catMatch && platMatch;
    });
  }, [selectedDate, selectedCategory, selectedPlatform]);

  const handleMonthChange = (dir: number) => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + dir);
    setSelectedMonth(d);
  };

  return (
    <AppLayout>
      {/* 앱바 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-50">
        <div className="flex items-center px-4 py-3">
          <Logo height={26} />
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* 달력 */}
        <Calendar
          selectedMonth={selectedMonth}
          selectedDate={selectedDate}
          datesWithContent={datesWithContent}
          onMonthChange={handleMonthChange}
          onDateSelect={setSelectedDate}
        />

        {/* 필터 */}
        <div className="flex gap-2">
          {/* 카테고리 드롭다운 */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowCatDropdown(!showCatDropdown);
                setShowPlatDropdown(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700"
            >
              {selectedCategory}
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {showCatDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-lg z-30 overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCatDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs hover:bg-gray-50 transition-colors ${
                      selectedCategory === cat ? "text-[#FF7E64] font-semibold" : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 플랫폼 드롭다운 */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowPlatDropdown(!showPlatDropdown);
                setShowCatDropdown(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-700"
            >
              {selectedPlatform}
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {showPlatDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-lg z-30 overflow-hidden">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat}
                    onClick={() => {
                      setSelectedPlatform(plat);
                      setShowPlatDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-xs hover:bg-gray-50 transition-colors ${
                      selectedPlatform === plat ? "text-[#FF7E64] font-semibold" : "text-gray-700"
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 선택된 날짜 표시 */}
        {selectedDate && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#111827]">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
            </p>
            <span className="text-xs text-gray-400">{filteredContents.length}개</span>
          </div>
        )}

        {/* 콘텐츠 리스트 */}
        {filteredContents.length > 0 ? (
          <div className="space-y-3">
            {filteredContents.map((content) => (
              <ContentCard
                key={content.contentId}
                category={content.category}
                title={content.title}
                platform={content.platform}
                contentId={content.contentId}
                thumbnailUrl={content.thumbnailUrl}
                keywords={content.keywords}
                onMoreClick={() => router.push(`/category/${content.contentId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm font-medium text-gray-400">선택한 날짜에 콘텐츠가 없어요</p>
            <p className="text-xs text-gray-300 mt-1">다른 날짜를 선택해보세요</p>
          </div>
        )}
      </div>

      {/* 드롭다운 오버레이 클로저 */}
      {(showCatDropdown || showPlatDropdown) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowCatDropdown(false);
            setShowPlatDropdown(false);
          }}
        />
      )}
    </AppLayout>
  );
}
