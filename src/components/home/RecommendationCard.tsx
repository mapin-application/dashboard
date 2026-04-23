"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { MediaPopup } from "@/components/ui/MediaPopup";

interface RecommendItem {
  contentId: string;
  title: string;
  thumbnailUrl?: string;
  contentType?: string;
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
  const [popup, setPopup] = useState<{ contentId: string; isYoutube: boolean; title: string; thumbnailUrl?: string; category?: string } | null>(null);
  const isYoutube = source.contentType === "YOUTUBE";

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100">
        {/* 메인 콘텐츠 */}
        <div className="relative flex gap-3 p-3 pb-4">
          {/* 썸네일 — 클릭 시 팝업 */}
          <button
            onClick={() => setPopup({ contentId: source.contentId, isYoutube, title: source.title, thumbnailUrl: source.thumbnailUrl, category: source.category })}
            className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100 group"
          >
            {source.thumbnailUrl ? (
              <img src={source.thumbnailUrl} alt={source.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={16} className="text-white fill-white" />
            </div>
          </button>

          {/* 텍스트 */}
          <div className="flex-1 min-w-0 pr-7">
            <div className="flex items-center gap-1.5 mb-1">
              <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
              <Tag label={source.category} variant="outline" size="sm" />
            </div>
            <p className="text-xs font-medium text-[#111827] leading-4 line-clamp-2">
              {source.title}
            </p>
          </div>

          {/* 토글 — 우측 하단 */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`absolute bottom-1 right-3 w-6 h-6 rounded-full border flex items-center justify-center shadow-sm transition-all ${
              expanded
                ? "bg-[#FF7E64] border-[#FF7E64] text-white"
                : "bg-white border-gray-200 text-gray-400 hover:border-[#FF7E64] hover:text-[#FF7E64]"
            }`}
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>

        {/* 추천 리스트 */}
        {expanded && (
          <div className="border-t border-gray-100 bg-[#FBFBFB]">
            {recommendations.slice(0, 3).map((rec) => (
              <button
                key={rec.contentId}
                onClick={() => setPopup({ contentId: rec.contentId, isYoutube: rec.contentType === "YOUTUBE", title: rec.title, thumbnailUrl: rec.thumbnailUrl })}
                className="w-full flex gap-2 px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors text-left group"
              >
                <div className="relative flex-shrink-0 w-12 h-9 rounded overflow-hidden bg-gray-200">
                  {rec.thumbnailUrl ? (
                    <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={10} className="text-white fill-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-4 line-clamp-2 flex-1">{rec.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {popup && (
        <MediaPopup
          contentId={popup.contentId}
          isYoutube={popup.isYoutube}
          title={popup.title}
          thumbnailUrl={popup.thumbnailUrl}
          category={popup.category}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
