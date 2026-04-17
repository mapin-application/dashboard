"use client";
import { useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

const TERMS_VERSION = "2025-01-01";

interface Props {
  onAgreed: () => void;
}

export default function TermsConsentModal({ onAgreed }: Props) {
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allChecked = termsChecked && privacyChecked;

  const handleAgreeAll = () => {
    const next = !allChecked;
    setTermsChecked(next);
    setPrivacyChecked(next);
  };

  const handleSubmit = async () => {
    if (!allChecked) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/users/me/agreements", { termsVersion: TERMS_VERSION });
      onAgreed();
    } catch {
      setError("처리 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="px-6 pt-7 pb-8">
          <h2 className="text-lg font-black text-[#111827] mb-1">서비스 이용을 위해</h2>
          <p className="text-sm text-gray-400 mb-6">아래 약관에 동의해주세요</p>

          {/* 전체 동의 */}
          <button
            onClick={handleAgreeAll}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors mb-3"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${allChecked ? "bg-[#FF7E64] border-[#FF7E64]" : "border-gray-300"}`}>
              {allChecked && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span className="text-sm font-bold text-[#111827]">전체 동의</span>
          </button>

          <div className="h-px bg-gray-100 mb-3" />

          {/* 서비스 이용약관 */}
          <div className="flex items-center gap-3 px-1 py-2 mb-2">
            <button
              onClick={() => setTermsChecked(!termsChecked)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${termsChecked ? "bg-[#FF7E64] border-[#FF7E64]" : "border-gray-300"}`}
            >
              {termsChecked && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
            <span className="flex-1 text-sm text-gray-700">
              <span className="text-[#FF7E64] font-semibold">(필수)</span> 서비스 이용약관
            </span>
            <a href="/terms" target="_blank" className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              보기 <ChevronRight size={12} />
            </a>
          </div>

          {/* 개인정보 처리방침 */}
          <div className="flex items-center gap-3 px-1 py-2 mb-6">
            <button
              onClick={() => setPrivacyChecked(!privacyChecked)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${privacyChecked ? "bg-[#FF7E64] border-[#FF7E64]" : "border-gray-300"}`}
            >
              {privacyChecked && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
            <span className="flex-1 text-sm text-gray-700">
              <span className="text-[#FF7E64] font-semibold">(필수)</span> 개인정보 처리방침
            </span>
            <a href="/privacy" target="_blank" className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              보기 <ChevronRight size={12} />
            </a>
          </div>

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!allChecked || loading}
            className="w-full py-4 rounded-2xl text-sm font-bold transition-all bg-[#FF7E64] text-white hover:bg-[#EB6045] active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-300 shadow-sm shadow-[#FF7E64]/30"
          >
            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "동의하고 시작하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
