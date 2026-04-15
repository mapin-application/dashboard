"use client";
import { useState } from "react";
import { X, Plus, Link, Check, Loader2 } from "lucide-react";
import { useContentStore } from "@/store/useContentStore";

interface AddContentModalProps {
  onClose: () => void;
}

const MAX_URLS = 10;
type Phase = "input" | "analyzing" | "done" | "error";

export function AddContentModal({ onClose }: AddContentModalProps) {
  const [phase, setPhase] = useState<Phase>("input");
  const [inputValue, setInputValue] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");

  const { analyzeUrls } = useContentStore();

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (urls.length >= MAX_URLS) { setError(`최대 ${MAX_URLS}개까지 등록 가능해요`); return; }
    if (urls.includes(trimmed)) { setError("이미 등록된 URL이에요"); return; }
    setUrls([...urls, trimmed]);
    setInputValue("");
    setError("");
  };

  const handleAnalyze = async () => {
    if (urls.length === 0) { setError("URL을 1개 이상 입력해주세요"); return; }
    setPhase("analyzing");
    setApiError("");
    try {
      await analyzeUrls(urls);
      setPhase("done");
    } catch (e) {
      setApiError((e as Error).message ?? "분석 중 오류가 발생했어요");
      setPhase("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#111827]">
            {phase === "input"     && "콘텐츠 추가"}
            {phase === "analyzing" && "분석 중..."}
            {phase === "done"      && "분석 완료!"}
            {phase === "error"     && "오류 발생"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Input 단계 */}
        {phase === "input" && (
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-400">YouTube나 네이버 뉴스 링크를 붙여넣으세요</p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="url"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="URL 입력"
                  className="w-full pl-8 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:outline-none focus:border-[#FF7E64] focus:bg-white transition-colors"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!inputValue.trim() || urls.length >= MAX_URLS}
                className="w-10 h-10 rounded-xl bg-[#FF7E64] flex items-center justify-center disabled:bg-gray-200 transition-colors flex-shrink-0"
              >
                <Plus size={18} className="text-white" strokeWidth={2.5} />
              </button>
            </div>

            {error && <p className="text-xs text-red-400 -mt-2">{error}</p>}

            {urls.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {urls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#FFEFEC] rounded-xl px-3 py-2">
                    <span className="w-4 h-4 bg-[#FF7E64] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[9px] font-bold">{i + 1}</span>
                    </span>
                    <span className="flex-1 text-xs text-[#111827] truncate">{url}</span>
                    <button onClick={() => setUrls(urls.filter((_, j) => j !== i))}>
                      <X size={13} className="text-[#FF7E64]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-400">
                <span className={urls.length >= MAX_URLS ? "text-[#FF7E64]" : "text-gray-700"}>{urls.length}</span>
                /{MAX_URLS}
              </span>
              <button
                onClick={handleAnalyze}
                disabled={urls.length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#EB6045] transition-colors"
              >
                분석하기
              </button>
            </div>
          </div>
        )}

        {/* 분석 중 */}
        {phase === "analyzing" && (
          <div className="px-6 py-10 flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-[#FFEFEC] rounded-full flex items-center justify-center">
              <Loader2 size={30} className="text-[#FF7E64] animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#111827]">콘텐츠 분석 중</p>
              <p className="text-xs text-gray-400 mt-1">{urls.length}개 URL을 처리하고 있어요</p>
            </div>
          </div>
        )}

        {/* 완료 */}
        {phase === "done" && (
          <div className="px-6 py-8 flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-[#FFEFEC] rounded-full flex items-center justify-center">
              <Check size={30} className="text-[#FF7E64]" strokeWidth={3} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#111827]">{urls.length}개 분석 완료!</p>
              <p className="text-xs text-gray-400 mt-1">콘텐츠가 추가됐어요</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold hover:bg-[#EB6045] transition-colors"
            >
              확인
            </button>
          </div>
        )}

        {/* 에러 */}
        {phase === "error" && (
          <div className="px-6 py-8 flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <X size={28} className="text-red-400" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#111827]">분석 실패</p>
              <p className="text-xs text-gray-400 mt-1">{apiError}</p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setPhase("input")}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold hover:bg-[#EB6045] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
