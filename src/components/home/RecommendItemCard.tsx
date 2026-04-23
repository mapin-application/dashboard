"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { MediaPopup } from "@/components/ui/MediaPopup";
import { RecommendItem } from "@/store/useContentStore";

export function RecommendItemCard({ item }: { item: RecommendItem }) {
  const [popup, setPopup] = useState(false);
  const isYoutube = item.contentType?.toUpperCase() === "YOUTUBE";

  return (
    <>
      <button
        onClick={() => setPopup(true)}
        className="w-full bg-white rounded-xl border border-gray-100 flex gap-3 p-3 text-left hover:border-[#FF7E64]/30 transition-colors group"
      >
        <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play size={16} className="text-white fill-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
            {item.category && <Tag label={item.category} variant="outline" size="sm" />}
          </div>
          <p className="text-xs font-medium text-[#111827] leading-4 line-clamp-2">{item.title}</p>
        </div>
      </button>

      {popup && (
        <MediaPopup
          contentId={item.contentId}
          isYoutube={isYoutube}
          title={item.title}
          thumbnailUrl={item.thumbnailUrl}
          category={item.category}
          onClose={() => setPopup(false)}
        />
      )}
    </>
  );
}
