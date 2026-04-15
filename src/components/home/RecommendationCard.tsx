"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

interface RecommendItem {
  contentId: string;
  title: string;
  thumbnailUrl?: string;
}

interface RecommendationCardProps {
  source: {
    contentId: string;
    contentType: string;
    category: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
  };
  recommendations: RecommendItem[];
}

export function RecommendationCard({ source, recommendations }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isYoutube = source.contentType === "YOUTUBE";

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="relative flex gap-3 p-3 pb-6">
        <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
          {source.thumbnailUrl ? (
            <img src={source.thumbnailUrl} alt={source.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">이미지 없음</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
            <Tag label={source.category} variant="outline" size="sm" />
          </div>
          <p className="text-xs font-medium text-[#111827] leading-4 line-clamp-2">
            {source.title}
          </p>
        </div>

        {/* 동그란 토글 버튼 — 우측 하단 */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-[-14px] right-4 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#FF7E64] hover:text-[#FF7E64] transition-all z-10 text-gray-400"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* 추천 리스트 */}
      {expanded && (
        <div className="border-t border-gray-100 bg-[#FBFBFB] pt-2">
          {recommendations.slice(0, 2).map((rec) => (
            <div key={rec.contentId} className="flex gap-2 px-3 py-2 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 w-12 h-9 rounded overflow-hidden bg-gray-200">
                {rec.thumbnailUrl ? (
                  <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <p className="text-xs text-gray-600 leading-4 line-clamp-2 flex-1">{rec.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
