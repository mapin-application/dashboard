"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { MediaPopup } from "@/components/ui/MediaPopup";
import { api } from "@/lib/api";

interface OppositionItem {
  contentId: string;
  title: string;
  thumbnailUrl?: string;
  contentType: string;
}

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
  const [expanded, setExpanded] = useState(false);
  const [opposition, setOpposition] = useState<OppositionItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{ contentId: string; isYoutube: boolean; title: string } | null>(null);

  const handleToggle = async () => {
    if (!expanded && opposition === null) {
      setLoading(true);
      try {
        const data = await api.get<{
          youtube: OppositionItem[];
          naverNews: OppositionItem[];
        }>(`/analyses/${id}`);
        setOpposition([...(data.youtube ?? []), ...(data.naverNews ?? [])]);
      } catch {
        setOpposition([]);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="relative flex gap-3 p-3 pb-4">
          {/* 썸네일 — 클릭 시 팝업 */}
          <button
            onClick={() => setPopup({ contentId, isYoutube, title })}
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

          {/* 토글 — 우측 하단 */}
          <button
            onClick={handleToggle}
            className={`absolute bottom-1 right-3 w-6 h-6 rounded-full border flex items-center justify-center shadow-sm transition-all ${
              expanded
                ? "bg-[#FF7E64] border-[#FF7E64] text-white"
                : "bg-white border-gray-200 text-gray-400 hover:border-[#FF7E64] hover:text-[#FF7E64]"
            }`}
          >
            {loading ? (
              <span className="text-[8px] text-gray-400">...</span>
            ) : expanded ? (
              <ChevronUp size={11} />
            ) : (
              <ChevronDown size={11} />
            )}
          </button>
        </div>

        {/* 다른 관점 목록 */}
        {expanded && opposition && (
          <div className="border-t border-gray-100 bg-[#FBFBFB]">
            {opposition.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">추천 콘텐츠가 없어요</p>
            ) : (
              opposition.slice(0, 4).map((item) => {
                const itemIsYoutube = item.contentType === "YOUTUBE";
                return (
                  <button
                    key={item.contentId}
                    onClick={() => setPopup({ contentId: item.contentId, isYoutube: itemIsYoutube, title: item.title })}
                    className="w-full flex gap-2 px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="relative flex-shrink-0 w-12 h-9 rounded overflow-hidden bg-gray-200">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={10} className="text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 leading-4 line-clamp-2">{item.title}</p>
                      <span className="text-[10px] text-gray-400">{itemIsYoutube ? "YouTube" : "뉴스"}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {popup && (
        <MediaPopup
          contentId={popup.contentId}
          isYoutube={popup.isYoutube}
          title={popup.title}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
