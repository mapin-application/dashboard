"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Logo } from "@/components/ui/Logo";

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithTestToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithTestToken(1);
      router.push("/home");
    } catch {
      setError("로그인 실패 — 서버가 실행 중인지 확인해주세요");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex">
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex w-1/2 bg-[#FF7E64] flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full" />
        <div className="relative z-10 text-center">
          <Logo height={56} className="mb-8 mx-auto brightness-0 invert" />
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            내가 본 콘텐츠를<br />분석하고 추천받으세요
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            YouTube, 뉴스 링크를 등록하면<br />
            취향에 맞는 콘텐츠를 추천해드려요
          </p>
        </div>
      </div>

      {/* 오른쪽 로그인 패널 */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 flex justify-center">
            <Logo height={40} />
          </div>

          <h1 className="text-2xl font-bold text-[#111827] mb-2">시작하기</h1>
          <p className="text-sm text-gray-400 mb-8">SNS 계정으로 간편하게 로그인하세요</p>

          <div className="space-y-3">
            {/* Google (추후 Firebase 연동) */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-300 cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 계속하기
            </button>

            {/* Apple (추후 Firebase 연동) */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-300 cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40" fill="#111827">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.18.74 2.98.76 1.11-.21 2.17-.9 3.36-.77 1.43.17 2.49.76 3.21 1.9-3.02 1.72-2.41 5.96.41 7.27-.51 1.41-1.23 2.81-1.96 3.72zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple로 계속하기
            </button>
          </div>

          {/* 개발용 로그인 */}
          {isDev && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-300 text-center mb-3">개발 환경 전용</p>
              <button
                onClick={handleTestLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  "🛠 개발용 로그인 (test-token)"
                )}
              </button>
              {error && <p className="text-xs text-red-400 text-center mt-2">{error}</p>}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-8 leading-5">
            계속 진행하면{" "}
            <span className="text-gray-500 underline cursor-pointer">서비스 이용약관</span> 및{" "}
            <span className="text-gray-500 underline cursor-pointer">개인정보 처리방침</span>에<br />
            동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
