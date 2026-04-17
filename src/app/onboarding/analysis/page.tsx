"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useStatsStore } from "@/store/useStatsStore";
import { useContentStore } from "@/store/useContentStore";

interface BatchResult {
  url: string;
  success: boolean;
  errorMessage?: string;
}

type UrlState = "pending" | "loading" | "done" | "error";

export default function OnboardingAnalysisPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<string[]>([]);
  const [urlStates, setUrlStates] = useState<UrlState[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("pending_urls");
    const parsed: string[] = stored ? JSON.parse(stored) : [];

    if (parsed.length === 0) {
      router.replace("/home");
      return;
    }

    setUrls(parsed);
    setUrlStates(parsed.map(() => "pending"));

    // 첫 번째 URL loading 표시 후 API 호출
    setTimeout(() => {
      setUrlStates(parsed.map(() => "loading"));

      api.post<BatchResult[]>("/analyses", { urls: parsed })
        .then((results) => {
          // 결과를 순차적으로 표시
          results.forEach((result, i) => {
            setTimeout(() => {
              setUrlStates((prev) => {
                const next = [...prev];
                next[i] = result.success ? "done" : "error";
                return next;
              });

              if (i === results.length - 1) {
                const anyFailed = results.some((r) => !r.success);
                setFailed(anyFailed);
                setAllDone(true);
                sessionStorage.removeItem("pending_urls");

                useStatsStore.getState().fetchStats();
                useContentStore.getState().fetchRecommendations();
                useContentStore.getState().fetchAnalyses();

                setTimeout(() => router.push("/home"), 1500);
              }
            }, i * 400);
          });
        })
        .catch(() => {
          setUrlStates(parsed.map(() => "error"));
          setFailed(true);
          setAllDone(true);
          setTimeout(() => router.push("/home"), 2000);
        });
    }, 300);
  }, [router]);

  const done = urlStates.filter((s) => s === "done" || s === "error").length;
  const total = urls.length;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
      {/* 아이콘 */}
      <div className="mb-8">
        {allDone ? (
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${failed ? "bg-orange-50" : "bg-[#FFEFEC]"}`}>
            {failed
              ? <AlertCircle size={36} className="text-orange-400" />
              : <Check size={36} className="text-[#FF7E64]" strokeWidth={3} />
            }
          </div>
        ) : (
          <div className="w-20 h-20 bg-[#FFEFEC] rounded-full flex items-center justify-center">
            <Loader2 size={36} className="text-[#FF7E64] animate-spin" />
          </div>
        )}
      </div>

      <h2 className="text-lg font-bold text-[#111827] mb-2">
        {allDone ? (failed ? "일부 분석 실패" : "분석 완료!") : "분석 중입니다..."}
      </h2>
      <p className="text-sm text-gray-400 mb-8 text-center">
        {allDone
          ? (failed ? "일부 콘텐츠를 분석하지 못했어요" : "콘텐츠 분석이 완료되었어요")
          : "잠시만 기다려주세요, 콘텐츠를 분석하고 있어요"}
      </p>

      {/* 진행률 */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">분석 진행률</span>
          <span className="text-xs font-semibold text-[#FF7E64]">{done}/{total}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF7E64] rounded-full transition-all duration-500"
            style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {/* URL 리스트 */}
      <div className="w-full space-y-3">
        {urls.map((url, i) => {
          const state = urlStates[i] ?? "pending";
          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                state === "done" ? "bg-[#FFEFEC] border-[#FF7E64]/20"
                : state === "error" ? "bg-red-50 border-red-100"
                : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex-shrink-0">
                {state === "done" ? (
                  <div className="w-6 h-6 bg-[#FF7E64] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                ) : state === "error" ? (
                  <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                    <AlertCircle size={12} className="text-white" />
                  </div>
                ) : state === "loading" ? (
                  <div className="w-6 h-6 bg-[#FFEFEC] rounded-full flex items-center justify-center">
                    <Loader2 size={12} className="text-[#FF7E64] animate-spin" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                )}
              </div>
              <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
              {state === "done" && <span className="text-[10px] text-[#FF7E64] font-medium flex-shrink-0">완료</span>}
              {state === "error" && <span className="text-[10px] text-red-400 font-medium flex-shrink-0">실패</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
