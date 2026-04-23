"use client";
import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { MediaPopup } from "@/components/ui/MediaPopup";
import { ContentDetailPopup } from "@/components/ui/ContentDetailPopup";

interface ContentCardProps {
  id: number;
  category: string;
  title: string;
  platform: string;
  contentId: string;
  thumbnailUrl?: string;
  keywords?: string[];
}

export function ContentCard({
  id,
  category,
  title,
  platform,
  contentId,
  thumbnailUrl,
  keywords = [],
}: ContentCardProps) {
  const isYoutube = platform === "YouTube" || platform === "YOUTUBE";
  const [showDetail, setShowDetail] = useState(false);
  const [popup, setPopup] = useState<{ contentId: string; isYoutube: boolean; title: string; thumbnailUrl?: string; category?: string } | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="relative flex gap-3 p-3 pb-4">
          {/* 썸네일 — 클릭 시 미디어 팝업 */}
          <button
            onClick={() => setPopup({ contentId, isYoutube, title, thumbnailUrl, category })}
            className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100 group"
          >
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-[10px]">없음</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={16} className="text-white fill-white" />
            </div>
          </button>

          {/* 내용 */}
          <div className="flex-1 min-w-0 pr-7">
            <div className="flex items-center gap-1.5 mb-1">
              <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
              <Tag label={category} variant="outline" size="sm" />
            </div>
            <p className="text-xs font-medium text-[#111827] leading-4 line-clamp-2">{title}</p>
          </div>

          {/* 토글 — 다른 관점 팝업 */}
          <button
            onClick={() => setShowDetail(true)}
            className="absolute bottom-1 right-3 w-6 h-6 rounded-full border bg-white border-gray-200 text-gray-400 hover:border-[#FF7E64] hover:text-[#FF7E64] flex items-center justify-center shadow-sm transition-all"
          >
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      {showDetail && (
        <ContentDetailPopup
          id={id}
          title={title}
          category={category}
          platform={platform}
          contentId={contentId}
          thumbnailUrl={thumbnailUrl}
          onClose={() => setShowDetail(false)}
        />
      )}

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
