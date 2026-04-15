"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Link } from "lucide-react";

const MAX_URLS = 10;

export default function OnboardingURLPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (urls.length >= MAX_URLS) {
      setError(`최대 ${MAX_URLS}개까지 등록할 수 있어요`);
      return;
    }
    if (urls.includes(trimmed)) {
      setError("이미 등록된 URL이에요");
      return;
    }
    setUrls([...urls, trimmed]);
    setInputValue("");
    setError("");
  };

  const handleRemove = (url: string) => {
    setUrls(urls.filter((u) => u !== url));
  };

  const handleAnalyze = () => {
    if (urls.length === 0) {
      setError("URL을 1개 이상 입력해주세요");
      return;
    }
    router.push("/onboarding/analysis");
  };

  return (
    <div className="mobile-container min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <span />
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </header>

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col">
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
            <span className={urls.length >= MAX_URLS ? "text-[#FF7E64]" : "text-gray-700"}>
              {urls.length}
            </span>
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
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
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

        {/* 에러 메시지 */}
        {error && (
          <p className="text-xs text-red-400 mb-3 -mt-2">{error}</p>
        )}

        {/* 등록된 URL 리스트 */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {urls.map((url, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-[#FFEFEC] rounded-xl px-3 py-2.5"
            >
              <div className="flex-shrink-0 w-5 h-5 bg-[#FF7E64] rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">{i + 1}</span>
              </div>
              <span className="flex-1 text-xs text-[#111827] truncate">{url}</span>
              <button
                onClick={() => handleRemove(url)}
                className="p-0.5 rounded-full hover:bg-[#FF7E64]/20 transition-colors"
              >
                <X size={14} className="text-[#FF7E64]" />
              </button>
            </div>
          ))}
        </div>

        {/* 분석하기 버튼 */}
        <button
          onClick={handleAnalyze}
          disabled={urls.length === 0}
          className="mt-4 w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:bg-gray-100 disabled:text-gray-300 bg-[#FF7E64] text-white hover:bg-[#EB6045] shadow-sm shadow-[#FF7E64]/30"
        >
          분석하기
        </button>
      </div>
    </div>
  );
}
