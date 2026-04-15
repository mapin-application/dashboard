"use client";
import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/report/Calendar";
import { ContentCard } from "@/components/report/ContentCard";
import { ContentDetailModal } from "@/components/report/ContentDetailModal";
import { useContentStore, type ContentItem } from "@/store/useContentStore";

const CATEGORIES = ["전체", "정치", "경제", "사회", "생활/문화", "IT/과학", "세계", "연예", "스포츠"];
const PLATFORMS  = ["전체", "YouTube", "뉴스"];

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function ReportPage() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth]     = useState(today);
  const [selectedDate, setSelectedDate]       = useState<Date | null>(today);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showPlatDropdown, setShowPlatDropdown] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const { contentsByDate, fetchAnalyses } = useContentStore();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const datesWithContent = useMemo(() => new Set(Object.keys(contentsByDate)), [contentsByDate]);

  const filteredContents = useMemo(() => {
    if (!selectedDate) return [];
    const contents = contentsByDate[toDateString(selectedDate)] ?? [];
    return contents.filter((c) => {
      const catOk  = selectedCategory === "전체" || c.category === selectedCategory;
      const platOk =
        selectedPlatform === "전체" ||
        (selectedPlatform === "YouTube" && c.platform === "YouTube") ||
        (selectedPlatform === "뉴스" && c.platform !== "YouTube");
      return catOk && platOk;
    });
  }, [selectedDate, selectedCategory, selectedPlatform, contentsByDate]);

  const handleMonthChange = (dir: number) => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + dir);
    setSelectedMonth(d);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">리포트</h1>
        <p className="text-sm text-gray-400 mt-1">날짜별로 본 콘텐츠를 확인해보세요</p>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6 items-start">
        {/* 왼쪽 — 달력 */}
        <div className="bg-white rounded-2xl border border-gray-100 sticky top-[72px]">
          <Calendar
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            datesWithContent={datesWithContent}
            onMonthChange={handleMonthChange}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* 오른쪽 — 콘텐츠 패널 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sticky top-[72px]">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-semibold text-[#111827] flex-1">
              {selectedDate
                ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
                : "날짜를 선택하세요"}
              {filteredContents.length > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-1.5">
                  {filteredContents.length}개
                </span>
              )}
            </h2>

            <div className="relative">
              <button
                onClick={() => { setShowCatDropdown(!showCatDropdown); setShowPlatDropdown(false); }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs font-medium text-gray-600 hover:border-gray-200 transition-colors"
              >
                {selectedCategory}
                <ChevronDown size={12} className="text-gray-400" />
              </button>
              {showCatDropdown && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-xl border border-gray-100 shadow-lg z-30 overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setShowCatDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                        selectedCategory === cat ? "text-[#FF7E64] font-semibold" : "text-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setShowPlatDropdown(!showPlatDropdown); setShowCatDropdown(false); }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs font-medium text-gray-600 hover:border-gray-200 transition-colors"
              >
                {selectedPlatform}
                <ChevronDown size={12} className="text-gray-400" />
              </button>
              {showPlatDropdown && (
                <div className="absolute top-full right-0 mt-1 w-24 bg-white rounded-xl border border-gray-100 shadow-lg z-30 overflow-hidden">
                  {PLATFORMS.map((plat) => (
                    <button
                      key={plat}
                      onClick={() => { setSelectedPlatform(plat); setShowPlatDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
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
                  onMoreClick={() => setSelectedContent(content)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-sm font-medium text-gray-400">콘텐츠가 없어요</p>
              <p className="text-xs text-gray-300 mt-1">다른 날짜를 선택해보세요</p>
            </div>
          )}
        </div>
      </div>

      {(showCatDropdown || showPlatDropdown) && (
        <div className="fixed inset-0 z-20"
          onClick={() => { setShowCatDropdown(false); setShowPlatDropdown(false); }} />
      )}

      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </AppLayout>
  );
}
