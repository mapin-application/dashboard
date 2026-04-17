"use client";
import { useState } from "react";
import { Plus, Link, X, Check, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useStatsStore } from "@/store/useStatsStore";
import { useContentStore } from "@/store/useContentStore";

const MAX_URLS = 10;

type Phase = "input" | "analyzing" | "done";
type UrlState = "pending" | "loading" | "done" | "error";

interface BatchResult {
  url: string;
  success: boolean;
  errorMessage?: string;
}

interface Props {
  onSkip: () => void;
}

export default function OnboardingModal({ onSkip }: Props) {
  const [phase, setPhase] = useState<Phase>("input");
  const [inputValue, setInputValue] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [urlStates, setUrlStates] = useState<UrlState[]>([]);
  const [anyFailed, setAnyFailed] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (urls.length >= MAX_URLS) { setError(`최대 ${MAX_URLS}개까지 등록할 수 있어요`); return; }
    if (urls.includes(trimmed)) { setError("이미 등록된 URL이에요"); return; }
    setUrls([...urls, trimmed]);
    setInputValue("");
    setError("");
  };

  const handleAnalyze = () => {
    if (urls.length === 0) { setError("URL을 1개 이상 입력해주세요"); return; }

    setPhase("analyzing");
    setUrlStates(urls.map(() => "loading"));

    api.post<BatchResult[]>("/analyses", { urls })
      .then((results) => {
        results.forEach((result, i) => {
          setTimeout(() => {
            setUrlStates((prev) => {
              const next = [...prev];
              next[i] = result.success ? "done" : "error";
              return next;
            });

            if (i === results.length - 1) {
              setAnyFailed(results.some((r) => !r.success));
              setPhase("done");
              useStatsStore.getState().fetchStats();
              useContentStore.getState().fetchRecommendations();
              useContentStore.getState().fetchAnalyses();
              setTimeout(onSkip, 1500);
            }
          }, i * 400);
        });
      })
      .catch(() => {
        setUrlStates(urls.map(() => "error"));
        setAnyFailed(true);
        setPhase("done");
        setTimeout(onSkip, 2000);
      });
  };

  const done = urlStates.filter((s) => s === "done" || s === "error").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="px-6 pt-7 pb-8 flex flex-col">

          {/* ── 입력 단계 ── */}
          {phase === "input" && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-black text-[#111827] leading-7">
                  내가 본 콘텐츠를<br />
                  <span className="text-[#FF7E64]">등록</span>해보세요
                </h1>
                <p className="text-sm text-gray-400 mt-2">
                  YouTube나 네이버 뉴스 링크를 붙여넣으세요
                </p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">등록된 URL</span>
                <span className="text-xs font-semibold">
                  <span className={urls.length >= MAX_URLS ? "text-[#FF7E64]" : "text-gray-700"}>{urls.length}</span>
                  <span className="text-gray-300">/{MAX_URLS}</span>
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Link size={15} className="text-gray-300" />
                  </div>
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="URL을 입력하세요"
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 rounded-xl text-xs text-[#111827] border border-gray-100 focus:outline-none focus:border-[#FF7E64] focus:bg-white transition-colors"
                  />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!inputValue.trim() || urls.length >= MAX_URLS}
                  className="w-12 h-12 rounded-xl bg-[#FF7E64] flex items-center justify-center disabled:bg-gray-200 transition-colors"
                >
                  <Plus size={20} className="text-white" strokeWidth={2.5} />
                </button>
              </div>

              {error && <p className="text-xs text-red-400 mb-3 -mt-2">{error}</p>}

              {urls.length > 0 && (
                <div className="space-y-2 mb-4 max-h-36 overflow-y-auto">
                  {urls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#FFEFEC] rounded-xl px-3 py-2.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-[#FF7E64] rounded-full flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">{i + 1}</span>
                      </div>
                      <span className="flex-1 text-xs text-[#111827] truncate">{url}</span>
                      <button
                        onClick={() => setUrls(urls.filter((u) => u !== url))}
                        className="p-0.5 rounded-full hover:bg-[#FF7E64]/20 transition-colors"
                      >
                        <X size={14} className="text-[#FF7E64]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={urls.length === 0}
                className="mt-2 w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:bg-gray-100 disabled:text-gray-300 bg-[#FF7E64] text-white hover:bg-[#EB6045] active:scale-[0.98]"
              >
                분석하기
              </button>

              <button
                onClick={onSkip}
                className="mt-2 w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                다음에 하기
              </button>
            </>
          )}

          {/* ── 분석 중 / 완료 단계 ── */}
          {(phase === "analyzing" || phase === "done") && (
            <>
              <div className="mb-6 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  phase === "done" ? (anyFailed ? "bg-orange-50" : "bg-[#FFEFEC]") : "bg-[#FFEFEC]"
                }`}>
                  {phase === "done" ? (
                    anyFailed
                      ? <AlertCircle size={30} className="text-orange-400" />
                      : <Check size={30} className="text-[#FF7E64]" strokeWidth={3} />
                  ) : (
                    <Loader2 size={30} className="text-[#FF7E64] animate-spin" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-[#111827]">
                  {phase === "done" ? (anyFailed ? "일부 분석 실패" : "분석 완료!") : "분석 중입니다..."}
                </h2>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  {phase === "done"
                    ? (anyFailed ? "일부 콘텐츠를 분석하지 못했어요" : "잠시 후 홈으로 이동해요")
                    : "잠시만 기다려주세요"}
                </p>
              </div>

              <div className="w-full mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">분석 진행률</span>
                  <span className="text-xs font-semibold text-[#FF7E64]">{done}/{urls.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF7E64] rounded-full transition-all duration-500"
                    style={{ width: urls.length > 0 ? `${(done / urls.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
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
                        ) : (
                          <div className="w-6 h-6 bg-[#FFEFEC] rounded-full flex items-center justify-center">
                            <Loader2 size={12} className="text-[#FF7E64] animate-spin" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
                      {state === "done" && <span className="text-[10px] text-[#FF7E64] font-medium flex-shrink-0">완료</span>}
                      {state === "error" && <span className="text-[10px] text-red-400 font-medium flex-shrink-0">실패</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
