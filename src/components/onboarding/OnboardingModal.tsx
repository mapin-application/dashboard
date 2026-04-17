"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Link, X } from "lucide-react";

const MAX_URLS = 10;

interface Props {
  onSkip: () => void;
}

export default function OnboardingModal({ onSkip }: Props) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
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
    sessionStorage.setItem("pending_urls", JSON.stringify(urls));
    router.push("/onboarding/analysis");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 모달 */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="px-6 pt-7 pb-8 flex flex-col">
          {/* 타이틀 */}
          <div className="mb-6">
            <h1 className="text-xl font-black text-[#111827] leading-7">
              내가 본 콘텐츠를<br />
              <span className="text-[#FF7E64]">등록</span>해보세요
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              YouTube나 네이버 뉴스 링크를 붙여넣으세요
            </p>
          </div>

          {/* 카운터 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">등록된 URL</span>
            <span className="text-xs font-semibold">
              <span className={urls.length >= MAX_URLS ? "text-[#FF7E64]" : "text-gray-700"}>{urls.length}</span>
              <span className="text-gray-300">/{MAX_URLS}</span>
            </span>
          </div>

          {/* URL 입력 */}
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

          {/* URL 리스트 */}
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

          {/* 분석하기 */}
          <button
            onClick={handleAnalyze}
            disabled={urls.length === 0}
            className="mt-2 w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:bg-gray-100 disabled:text-gray-300 bg-[#FF7E64] text-white hover:bg-[#EB6045] active:scale-[0.98] shadow-sm shadow-[#FF7E64]/30"
          >
            분석하기
          </button>

          {/* 다음에 하기 */}
          <button
            onClick={onSkip}
            className="mt-2 w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            다음에 하기
          </button>
        </div>
      </div>
    </div>
  );
}
