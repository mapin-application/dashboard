"use client";
import { X, ExternalLink } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

interface MediaPopupProps {
  contentId: string;
  isYoutube: boolean;
  title: string;
  thumbnailUrl?: string;
  category?: string;
  onClose: () => void;
}

export function MediaPopup({ contentId, isYoutube, title, thumbnailUrl, category, onClose }: MediaPopupProps) {
  const newsUrl = contentId.startsWith("http")
    ? contentId
    : `https://search.naver.com/search.naver?query=${encodeURIComponent(title)}`;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {isYoutube ? (
        /* YouTube 플레이어 */
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-black"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a]">
            <p className="text-white text-sm font-medium truncate flex-1 pr-4">{title}</p>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${contentId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        /* 뉴스 카드 */
        <div
          className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 썸네일 */}
          <div className="relative w-full aspect-video bg-gray-100">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-300 text-sm">이미지 없음</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Tag label="뉴스" variant="primary" size="sm" />
              {category && <Tag label={category} variant="outline" size="sm" />}
            </div>
            <p className="text-sm font-semibold text-[#111827] leading-5 mb-5 line-clamp-3">{title}</p>
            <a
              href={newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold hover:bg-[#EB6045] transition-colors"
            >
              <ExternalLink size={15} />
              기사 원문 보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
