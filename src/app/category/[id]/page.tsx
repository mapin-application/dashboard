"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

const mockDetail = {
  title: "NextJS 14 앱 라우터 완벽 가이드",
  category: "IT/과학",
  platform: "YouTube",
  thumbnailUrl: "https://picsum.photos/seed/detail/640/360",
  news: [
    {
      contentId: "n1",
      title: "Next.js 14 출시 - 앱 라우터 안정화 완료",
      thumbnailUrl: "https://picsum.photos/seed/n1/320/180",
    },
    {
      contentId: "n2",
      title: "React 서버 컴포넌트란? 개념부터 실전까지",
      thumbnailUrl: "https://picsum.photos/seed/n2/320/180",
    },
    {
      contentId: "n3",
      title: "Vercel, Next.js 14 지원 공식 발표",
      thumbnailUrl: "https://picsum.photos/seed/n3/320/180",
    },
  ],
  youtube: [
    {
      contentId: "y1",
      title: "Next.js 14 완전정복 - 3시간 마스터 클래스",
      thumbnailUrl: "https://picsum.photos/seed/y1/320/180",
    },
    {
      contentId: "y2",
      title: "React 18 + Next.js 14 실전 프로젝트 빌드",
      thumbnailUrl: "https://picsum.photos/seed/y2/320/180",
    },
  ],
};

export default function CategoryAnalysisPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"news" | "youtube">("news");

  const items = activeTab === "news" ? mockDetail.news : mockDetail.youtube;

  return (
    <div className="mobile-container min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-base font-semibold text-[#111827]">카테고리 분석</h1>
        </div>
      </header>

      {/* 대표 썸네일 */}
      <div className="relative w-full aspect-video bg-gray-200">
        <img
          src={mockDetail.thumbnailUrl}
          alt={mockDetail.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 콘텐츠 정보 */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Tag
            label={mockDetail.platform === "YouTube" ? "YouTube" : "뉴스"}
            variant="primary"
          />
          <Tag label={mockDetail.category} variant="outline" />
        </div>
        <h2 className="text-sm font-semibold text-[#111827] leading-5">{mockDetail.title}</h2>
      </div>

      {/* 탭 */}
      <div className="flex bg-white border-b border-gray-100">
        {(["news", "youtube"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab
                ? "border-[#FF7E64] text-[#FF7E64]"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab === "news" ? "뉴스" : "유튜브"}
          </button>
        ))}
      </div>

      {/* 관련 콘텐츠 리스트 */}
      <div className="px-4 py-3 space-y-3">
        {items.map((item) => (
          <div key={item.contentId} className="flex gap-3 bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-medium text-[#111827] leading-4 line-clamp-3 flex-1 pt-0.5">
              {item.title}
            </p>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <span className="text-2xl mb-2">🔍</span>
            <p className="text-sm text-gray-400">관련 콘텐츠가 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}
