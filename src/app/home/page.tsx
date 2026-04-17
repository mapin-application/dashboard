"use client";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BubbleChart } from "@/components/home/BubbleChart";
import { RecommendationCard } from "@/components/home/RecommendationCard";
import { AddContentModal } from "@/components/layout/AddContentModal";
import { useUserStore } from "@/store/useUserStore";
import { useStatsStore } from "@/store/useStatsStore";
import { useContentStore } from "@/store/useContentStore";

const PERIOD_OPTIONS = [
  { label: "오늘", value: 1 },
  { label: "7일",  value: 7 },
  { label: "30일", value: 30 },
];

export default function HomePage() {
  const [selectedDays, setSelectedDays] = useState(7);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { name, fetchProfile } = useUserStore();
  const { totalCount, byCategory, fetchStats } = useStatsStore();
  const { recommendations, fetchRecommendations } = useContentStore();

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchRecommendations();
  }, []);

  const pct = (count: number) => totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  const byCategoryWithPct = byCategory.map((item) => ({ ...item, percentage: pct(item.count) }));
  const top    = byCategoryWithPct[0];
  const bottom = byCategoryWithPct[byCategoryWithPct.length - 1];
  const visibleRecs = showAll ? recommendations : recommendations.slice(0, 4);

  return (
    <AppLayout>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-0.5">안녕하세요!</p>
          <h1 className="text-2xl font-bold text-[#111827]">{name}님의 콘텐츠 분석</h1>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedDays(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDays === opt.value
                  ? "bg-[#FF7E64] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상단 통계 카드 4개 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">전체 콘텐츠</p>
          <p className="text-3xl font-black text-[#111827]">{totalCount}</p>
          <p className="text-xs text-gray-400 mt-1">개 분석됨</p>
        </div>
        <div className="bg-[#FFEFEC] rounded-2xl p-5">
          <p className="text-xs text-[#FF7E64] mb-1">최다 카테고리</p>
          <p className="text-xl font-black text-[#FF7E64]">{top?.category ?? <span className="text-[#FF7E64]/40">—</span>}</p>
          <p className="text-xs text-[#FF7E64]/70 mt-1">{top ? `${pct(top.count)}% · ${top.count}개` : <span className="text-[#FF7E64]/30 font-bold">데이터 없음</span>}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">최소 카테고리</p>
          <p className="text-xl font-black text-[#111827]">{bottom?.category ?? <span className="text-gray-300">—</span>}</p>
          <p className="text-xs text-gray-400 mt-1">{bottom ? `${pct(bottom.count)}% · ${bottom.count}개` : <span className="text-gray-300 font-bold">데이터 없음</span>}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">공유한 URL</p>
          <p className="text-3xl font-black text-[#111827]">{totalCount}</p>
          <p className="text-xs text-gray-400 mt-1">개 등록됨</p>
        </div>
      </div>

      {/* 메인 2컬럼 */}
      <div className="grid grid-cols-[1fr_340px] gap-6 mb-8">
        {/* 왼쪽: 버블 차트 + 카테고리 바 */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-[#111827] mb-5">카테고리 분포</h2>
            <BubbleChart data={byCategoryWithPct} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-[#111827] mb-4">카테고리별 비율</h2>
            <div className="space-y-3">
              {byCategoryWithPct.map((item) => (
                <div key={item.category} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20 shrink-0">{item.category}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FF7E64] transition-all duration-700"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-10 text-right shrink-0">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 추천 콘텐츠 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col max-h-[700px]">
          <h2 className="text-base font-semibold text-[#111827] mb-4 flex-shrink-0">
            맞춤 추천 콘텐츠 <span className="text-[#FF7E64]">✨</span>
          </h2>
          <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
            {visibleRecs.map((rec) => (
              <RecommendationCard
                key={rec.source.contentId}
                source={rec.source}
                recommendations={rec.recommendations}
              />
            ))}
          </div>
          {recommendations.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 flex-shrink-0 w-full py-2.5 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium hover:border-[#FF7E64] hover:text-[#FF7E64] hover:bg-[#FFEFEC] transition-colors"
            >
              {showAll ? "접기" : `더보기 (${recommendations.length - 4}개)`}
            </button>
          )}
        </div>
      </div>

      {showModal && <AddContentModal onClose={() => setShowModal(false)} />}
    </AppLayout>
  );
}
