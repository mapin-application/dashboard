"use client";
import { useState, useEffect } from "react";
import { X, Play, Loader2 } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { MediaPopup } from "@/components/ui/MediaPopup";
import { api } from "@/lib/api";

interface DetailItem {
  id: number;
  contentId: string;
  title: string;
  contentType: string;
  category: string;
  thumbnailUrl?: string;
}

interface ContentDetailPopupProps {
  id: number;
  title: string;
  category: string;
  platform: string;
  contentId: string;
  thumbnailUrl?: string;
  onClose: () => void;
}

export function ContentDetailPopup({
  id, title, category, platform, contentId, thumbnailUrl, onClose,
}: ContentDetailPopupProps) {
  const [youtube, setYoutube] = useState<DetailItem[]>([]);
  const [news, setNews] = useState<DetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<{ contentId: string; isYoutube: boolean; title: string; thumbnailUrl?: string; category?: string } | null>(null);

  const isYoutube = platform === "YouTube" || platform === "YOUTUBE";

  useEffect(() => {
    api.get<{ youtube: DetailItem[]; naverNews: DetailItem[] }>(`/users/me/analyses/${id}`)
      .then((data) => {
        setYoutube(data.youtube ?? []);
        setNews(data.naverNews ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 — 원본 콘텐츠 */}
          <div className="flex gap-3 p-4 border-b border-gray-100">
            <button
              onClick={() => setPopup({ contentId, isYoutube, title, thumbnailUrl, category })}
              className="relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden bg-gray-100 group"
            >
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={14} className="text-white fill-white" />
              </div>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
                <Tag label={category} variant="outline" size="sm" />
              </div>
              <p className="text-xs font-semibold text-[#111827] line-clamp-2 leading-4">{title}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors self-start"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>

          {/* 본문 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="text-[#FF7E64] animate-spin" />
              </div>
            ) : youtube.length === 0 && news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-gray-400">다른 관점 콘텐츠가 없어요</p>
              </div>
            ) : (
              <>
                {youtube.length > 0 && (
                  <div>
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-500">YouTube 관점 · {youtube.length}개</span>
                    </div>
                    {youtube.map((item) => (
                      <ItemRow
                        key={item.contentId}
                        item={item}
                        isYoutube
                        onSelect={(it) => setPopup({ contentId: it.contentId, isYoutube: true, title: it.title, thumbnailUrl: it.thumbnailUrl, category: it.category })}
                      />
                    ))}
                  </div>
                )}
                {news.length > 0 && (
                  <div>
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                      <span className="text-xs font-semibold text-gray-500">뉴스 관점 · {news.length}개</span>
                    </div>
                    {news.map((item) => (
                      <ItemRow
                        key={item.contentId}
                        item={item}
                        isYoutube={false}
                        onSelect={(it) => setPopup({ contentId: it.contentId, isYoutube: false, title: it.title, thumbnailUrl: it.thumbnailUrl, category: it.category })}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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

function ItemRow({ item, isYoutube, onSelect }: { item: DetailItem; isYoutube: boolean; onSelect: (item: DetailItem) => void }) {
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
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
        <p className="text-xs font-medium text-[#111827] line-clamp-2 leading-4">{item.title}</p>
        <span className="text-[10px] text-gray-400 mt-0.5 block">{isYoutube ? "YouTube" : "뉴스"}</span>
      </div>
    </button>
  );
}
