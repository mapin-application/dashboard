"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronDown, User, LogOut, FileText, Info } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/report/Calendar";
import { ContentCard } from "@/components/report/ContentCard";
import { useUserStore } from "@/store/useUserStore";
import { useStatsStore } from "@/store/useStatsStore";
import { useContentStore } from "@/store/useContentStore";

const CATEGORIES = ["전체", "정치", "경제", "사회", "생활/문화", "IT/과학", "세계", "연예", "스포츠"];
const PLATFORMS  = ["전체", "YouTube", "뉴스"];

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function MyPage() {
  const router = useRouter();
  const today = new Date();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedMonth, setSelectedMonth]       = useState(today);
  const [selectedDate, setSelectedDate]         = useState<Date | null>(today);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [showCatDropdown, setShowCatDropdown]   = useState(false);
  const [showPlatDropdown, setShowPlatDropdown] = useState(false);

  const { name, email, totalSharedCount, fetchProfile } = useUserStore();
  const { totalCount, byCategory, fetchStats } = useStatsStore();
  const { contentsByDate, fetchAnalyses } = useContentStore();

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchAnalyses();
  }, []);

  const pct = (count: number) => totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  const byCategoryWithPct = byCategory.map((item) => ({ ...item, percentage: pct(item.count) }));

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
      <h1 className="text-2xl font-bold text-[#111827] mb-6">마이페이지</h1>

      {/* 프로필 배너 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 bg-[#FFEFEC] rounded-full flex items-center justify-center flex-shrink-0">
            <User size={30} className="text-[#FF7E64]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#111827]">{name}</h2>
            <p className="text-sm text-gray-400 mt-0.5 truncate">{email}</p>
            <button
              onClick={() => router.push("/mypage/account")}
              className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF7E64] transition-colors"
            >
              계정정보 수정
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex items-center gap-0 border-t sm:border-t-0 pt-4 sm:pt-0">
            <div className="text-center px-4 sm:px-5 border-r border-gray-100">
              <p className="text-2xl font-black text-[#111827]">{totalCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">분석 콘텐츠</p>
            </div>
            <div className="text-center px-4 sm:px-5 border-r border-gray-100">
              <p className="text-2xl font-black text-[#FF7E64]">{totalSharedCount}</p>
              <p className="text-xs text-[#FF7E64]/70 mt-0.5">공유 URL</p>
            </div>
            <div className="text-center px-4 sm:px-5">
              <p className="text-lg font-black text-[#111827]">
                {byCategoryWithPct[0]?.category ?? <span className="text-gray-300 text-base">—</span>}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">최다 카테고리</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 2컬럼 */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5 md:gap-6 mb-6 md:mb-8">
        {/* 왼쪽: 설정 메뉴 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden self-start">
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-gray-400" />
              <span className="text-sm text-[#111827]">서비스 이용약관</span>
            </div>
            <ChevronRight size={15} className="text-gray-300" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Info size={16} className="text-gray-400" />
              <span className="text-sm text-[#111827]">버전 정보</span>
            </div>
            <span className="text-xs text-gray-400">1.0.0</span>
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut size={16} className="text-gray-400" />
              <span className="text-sm text-[#111827]">로그아웃</span>
            </div>
            <ChevronRight size={15} className="text-gray-300" />
          </button>
        </div>

        {/* 오른쪽: 카테고리 분석 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[#111827]">카테고리별 분석</h2>
            <span className="text-xs text-gray-400">총 {totalCount}개</span>
          </div>
          <div className="space-y-3">
            {byCategoryWithPct.map((item, i) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `hsl(${16 - i * 3}, ${90 - i * 5}%, ${55 + i * 5}%)` }}
                    />
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{item.count}개</span>
                    <span className="text-sm font-bold text-[#111827] w-9 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: `hsl(${16 - i * 3}, ${90 - i * 5}%, ${55 + i * 5}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 마이 리포트 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#111827] mb-4">마이 리포트</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-5 md:gap-6 items-start">
          {/* 달력 */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden md:sticky md:top-[72px] md:h-[600px]">
            <Calendar
              selectedMonth={selectedMonth}
              selectedDate={selectedDate}
              datesWithContent={datesWithContent}
              onMonthChange={handleMonthChange}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* 콘텐츠 패널 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col md:sticky md:top-[72px] md:h-[600px] min-h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-[#111827] flex-1">
                {selectedDate
                  ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
                  : "날짜를 선택하세요"}
                {filteredContents.length > 0 && (
                  <span className="text-sm font-normal text-gray-400 ml-1.5">
                    {filteredContents.length}개
                  </span>
                )}
              </h3>

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

            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredContents.length > 0 ? (
                <div className="space-y-3">
                  {filteredContents.map((content) => (
                    <ContentCard
                      key={content.contentId}
                      id={content.id}
                      category={content.category}
                      title={content.title}
                      platform={content.platform}
                      contentId={content.contentId}
                      thumbnailUrl={content.thumbnailUrl}
                      keywords={content.keywords}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-4xl mb-3">📭</span>
                  <p className="text-sm font-medium text-gray-400">콘텐츠가 없어요</p>
                  <p className="text-xs text-gray-300 mt-1">다른 날짜를 선택해보세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 회원탈퇴 */}
      <div className="mt-6 mb-2 text-center">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-xs text-gray-300 hover:text-red-400 transition-colors"
        >
          회원 탈퇴하기
        </button>
      </div>

      {(showCatDropdown || showPlatDropdown) && (
        <div className="fixed inset-0 z-20"
          onClick={() => { setShowCatDropdown(false); setShowPlatDropdown(false); }} />
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-xl">
            <h3 className="text-base font-bold text-[#111827] text-center mb-2">로그아웃</h3>
            <p className="text-sm text-gray-400 text-center mb-6">정말 로그아웃 하시겠어요?</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium">
                취소
              </button>
              <button onClick={() => router.push("/login")}
                className="py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-medium">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-xl">
            <h3 className="text-base font-bold text-[#111827] text-center mb-2">회원 탈퇴</h3>
            <p className="text-sm text-gray-400 text-center mb-1">탈퇴하면 모든 데이터가 삭제돼요.</p>
            <p className="text-xs text-red-400 text-center mb-6">이 작업은 되돌릴 수 없어요.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium">
                취소
              </button>
              <button onClick={() => router.push("/login")}
                className="py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
