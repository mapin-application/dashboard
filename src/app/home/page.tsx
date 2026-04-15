"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Logo } from "@/components/ui/Logo";
import { BubbleChart } from "@/components/home/BubbleChart";
import { RecommendationCard } from "@/components/home/RecommendationCard";
import { mockStats, mockRecommendations, mockProfile } from "@/lib/mockData";

const PERIOD_OPTIONS = [
  { label: "오늘", value: 1 },
  { label: "7일", value: 7 },
  { label: "30일", value: 30 },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState(7);
  const [showAll, setShowAll] = useState(false);

  const topCategory = mockStats.byCategory[0];
  const bottomCategory = mockStats.byCategory[mockStats.byCategory.length - 1];

  const visibleRecs = showAll ? mockRecommendations : mockRecommendations.slice(0, 3);

  return (
    <AppLayout>
      {/* 앱바 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo height={26} />
          <button
            onClick={() => router.push("/onboarding/url")}
            className="w-8 h-8 rounded-full bg-[#FF7E64] flex items-center justify-center shadow-sm shadow-[#FF7E64]/40"
          >
            <Plus size={18} className="text-white" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-5">
        {/* 인사말 + 기간 필터 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-gray-400">안녕하세요!</p>
            <h2 className="text-base font-bold text-[#111827]">{mockProfile.name}님의 콘텐츠 분석</h2>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDays(opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedDays === opt.value
                    ? "bg-white text-[#FF7E64] shadow-sm font-semibold"
                    : "text-gray-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 버블 차트 */}
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-3">카테고리 분포</h3>
          <div className="flex justify-center">
            <BubbleChart data={mockStats.byCategory} />
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 많이 본 카테고리 */}
          <div className="bg-[#FFEFEC] rounded-2xl p-4">
            <p className="text-[11px] text-[#FF7E64] font-medium mb-1">가장 많이 본 분야</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-[#FF7E64]">{topCategory?.percentage}%</span>
            </div>
            <p className="text-sm font-bold text-[#111827] mt-1">{topCategory?.category}</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-[#FF7E64] text-white rounded-full text-[10px] font-medium">
              {topCategory?.count}개
            </span>
          </div>

          {/* 적게 본 카테고리 */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-[11px] text-gray-400 font-medium mb-1">가장 적게 본 분야</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-gray-600">{bottomCategory?.percentage}%</span>
            </div>
            <p className="text-sm font-bold text-[#111827] mt-1">{bottomCategory?.category}</p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full text-[10px] font-medium">
              {bottomCategory?.count}개
            </span>
          </div>
        </div>

        {/* 전체 카테고리 바 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-[#111827] mb-3">
            전체 <span className="text-[#FF7E64]">{mockStats.totalCount}개</span> 콘텐츠
          </h3>
          <div className="space-y-2.5">
            {mockStats.byCategory.map((item, i) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{item.category}</span>
                  <span className="text-xs font-semibold text-gray-700">{item.percentage}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: `rgba(251,113,84,${1 - i * 0.15})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 콘텐츠 */}
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-3">
            맞춤 추천 콘텐츠 <span className="text-[#FF7E64]">✨</span>
          </h3>
          <div className="space-y-3">
            {visibleRecs.map((rec) => (
              <RecommendationCard
                key={rec.source.contentId}
                source={rec.source}
                recommendations={rec.recommendations}
              />
            ))}
          </div>

          {!showAll && mockRecommendations.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 w-full py-3 rounded-xl border border-[#FF7E64] text-[#FF7E64] text-sm font-medium hover:bg-[#FFEFEC] transition-colors"
            >
              추천 콘텐츠 더보기
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
