"use client";
import { Tag } from "@/components/ui/Tag";
import { ExternalLink } from "lucide-react";

interface ContentCardProps {
  category: string;
  title: string;
  platform: string;
  contentId: string;
  thumbnailUrl?: string;
  keywords?: string[];
  onMoreClick?: () => void;
}

export function ContentCard({
  category,
  title,
  platform,
  contentId,
  thumbnailUrl,
  keywords = [],
  onMoreClick,
}: ContentCardProps) {
  const isYoutube = platform === "YouTube" || platform === "YOUTUBE";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3">
      <div className="flex gap-3">
        {/* 썸네일 */}
        <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-[10px]">No image</span>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 mb-1">{category}</p>
          <p className="text-xs font-medium text-[#111827] leading-4 line-clamp-2 mb-2">{title}</p>

          {/* 태그들 */}
          <div className="flex flex-wrap gap-1">
            <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
            {keywords.slice(0, 2).map((kw) => (
              <Tag key={kw} label={kw} variant="gray" size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* 더보기 버튼 */}
      {onMoreClick && (
        <button
          onClick={onMoreClick}
          className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-400 hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={12} />
          더보기
        </button>
      )}
    </div>
  );
}
