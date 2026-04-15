"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

const MOCK_URLS = [
  "https://youtube.com/watch?v=abc123",
  "https://news.naver.com/article/001",
  "https://youtube.com/watch?v=def456",
];

export default function OnboardingAnalysisPage() {
  const router = useRouter();
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCompletedIndices((prev) => [...prev, i]);
      i++;
      if (i >= MOCK_URLS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setAllDone(true);
          setTimeout(() => router.push("/home"), 1200);
        }, 400);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [router]);

  const total = MOCK_URLS.length;
  const done = completedIndices.length;

  return (
    <div className="mobile-container min-h-screen bg-white flex flex-col items-center justify-center px-8">
      {/* 메인 아이콘 */}
      <div className="mb-8">
        {allDone ? (
          <div className="w-20 h-20 bg-[#FFEFEC] rounded-full flex items-center justify-center">
            <Check size={36} className="text-[#FF7E64]" strokeWidth={3} />
          </div>
        ) : (
          <div className="w-20 h-20 bg-[#FFEFEC] rounded-full flex items-center justify-center">
            <Loader2 size={36} className="text-[#FF7E64] animate-spin" />
          </div>
        )}
      </div>

      {/* 제목 */}
      <h2 className="text-lg font-bold text-[#111827] mb-2">
        {allDone ? "분석 완료!" : "분석 중입니다..."}
      </h2>
      <p className="text-sm text-gray-400 mb-8 text-center">
        {allDone
          ? "콘텐츠 분석이 완료되었어요"
          : "잠시만 기다려주세요, 콘텐츠를 분석하고 있어요"}
      </p>

      {/* 진행률 */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">분석 진행률</span>
          <span className="text-xs font-semibold text-[#FF7E64]">
            {done}/{total}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF7E64] rounded-full transition-all duration-500"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      </div>

      {/* URL 리스트 */}
      <div className="w-full space-y-3">
        {MOCK_URLS.map((url, i) => {
          const isDone = completedIndices.includes(i);
          const isLoading = !isDone && i === done;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isDone ? "bg-[#FFEFEC] border-[#FF7E64]/20" : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <div className="w-6 h-6 bg-[#FF7E64] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                ) : isLoading ? (
                  <div className="w-6 h-6 bg-[#FFEFEC] rounded-full flex items-center justify-center">
                    <Loader2 size={12} className="text-[#FF7E64] animate-spin" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                )}
              </div>
              <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
              {isDone && (
                <span className="text-[10px] text-[#FF7E64] font-medium flex-shrink-0">완료</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
