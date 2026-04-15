"use client";
import { X } from "lucide-react";
import { Tag } from "@/components/ui/Tag";

interface ContentDetailModalProps {
  content: {
    category: string;
    title: string;
    platform: string;
    contentId: string;
    date: string;
    thumbnailUrl?: string;
    keywords?: string[];
  };
  onClose: () => void;
}

const MOCK_DESCRIPTION: Record<string, string> = {
  yt1: "Next.js 14의 앱 라우터(App Router)를 처음부터 끝까지 다루는 완벽 가이드입니다. 서버 컴포넌트, 클라이언트 컴포넌트, 레이아웃, 로딩 UI 등 핵심 개념을 실전 예제로 익혀보세요.",
  n1: "한국은행이 발표한 2026년 1분기 경제 성장률이 전년 동기 대비 2.8% 증가했습니다. 수출 회복세와 내수 소비 개선이 주요 요인으로 분석됩니다.",
  n2: "BTS가 새 앨범 발매를 앞두고 예약 판매에서 역대 최고 기록을 갱신했습니다. 글로벌 팬덤의 뜨거운 반응이 이어지고 있습니다.",
  n3: "손흥민이 시즌 20번째 골을 기록하며 토트넘 팬들의 환호를 받았습니다. 이번 시즌 리그 최고 활약을 이어가고 있습니다.",
  yt2: "메타가 공개한 라마3(Llama 3)는 오픈소스 AI의 새로운 기준을 제시했습니다. GPT-4와의 성능 비교와 실제 활용 방안을 살펴봅니다.",
  n4: "한국이 기후위기 대응 국제 협약에 가입하며 탄소 중립 목표를 2040년으로 앞당겼습니다. 관련 산업에 미치는 영향이 주목됩니다.",
  yt3: "비트코인이 10만 달러를 돌파한 배경과 향후 전망을 분석합니다. 기관 투자자 유입과 반감기 효과가 핵심 요인으로 꼽힙니다.",
};

export function ContentDetailModal({ content, onClose }: ContentDetailModalProps) {
  const isYoutube = content.platform === "YouTube" || content.platform === "YOUTUBE";
  const description = MOCK_DESCRIPTION[content.contentId] ?? "콘텐츠 요약 정보가 없습니다.";

  const dateObj = new Date(content.date);
  const dateLabel = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 썸네일 */}
        <div className="relative w-full aspect-video bg-gray-100">
          {content.thumbnailUrl ? (
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          {/* 태그 + 날짜 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Tag label={isYoutube ? "YouTube" : "뉴스"} variant="primary" size="sm" />
              <Tag label={content.category} variant="outline" size="sm" />
            </div>
            <span className="text-xs text-gray-400">{dateLabel}</span>
          </div>

          {/* 제목 */}
          <h2 className="text-base font-bold text-[#111827] leading-snug mb-3">
            {content.title}
          </h2>

          {/* 설명 */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {description}
          </p>

          {/* 키워드 */}
          {content.keywords && content.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {content.keywords.map((kw) => (
                <Tag key={kw} label={`# ${kw}`} variant="gray" size="sm" />
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold hover:bg-[#EB6045] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
