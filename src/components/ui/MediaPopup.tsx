"use client";
import { X } from "lucide-react";

interface MediaPopupProps {
  contentId: string;
  isYoutube: boolean;
  title: string;
  onClose: () => void;
}

export function MediaPopup({ contentId, isYoutube, title, onClose }: MediaPopupProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
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

        {isYoutube ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${contentId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center bg-[#111] gap-4 p-8">
            <p className="text-white/60 text-sm text-center">{title}</p>
            <a
              href={contentId.startsWith("http") ? contentId : `https://search.naver.com/search.naver?query=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold hover:bg-[#EB6045] transition-colors"
            >
              기사 원문 보기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
