"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Logo } from "@/components/ui/Logo";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import TermsConsentModal from "@/components/onboarding/TermsConsentModal";

const isDev = process.env.NODE_ENV === "development";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function redirectToOAuth(provider: "google") {
  const redirectUri = `${window.location.origin}/auth/google/callback`;

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state: "google",
      access_type: "offline",
      prompt: "consent",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }
}

type PageState = "form" | "success" | "terms" | "onboarding";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithTestToken } = useAuthStore();
  const [pageState, setPageState] = useState<PageState>("form");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      window.history.replaceState({}, "", "/login");
      setPageState("success");
      setTimeout(() => {
        const { isNewUser, isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated && isNewUser) {
          setPageState("terms");
        } else {
          router.replace("/home");
        }
      }, 1600);
    }
    if (params.get("error")) {
      setError("로그인에 실패했어요. 다시 시도해주세요.");
      window.history.replaceState({}, "", "/login");
    }
  }, [router]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    redirectToOAuth("google");
  };

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

      {/* 오른쪽 패널 */}
      <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-sm">

          {/* 성공 상태 */}
          {pageState === "success" && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle size={36} className="text-green-500" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#111827]">로그인 완료!</p>
                <p className="text-sm text-gray-400 mt-1">잠시 후 이어집니다...</p>
              </div>
              <Loader2 size={18} className="text-gray-300 animate-spin mt-2" />
            </div>
          )}

          {/* 로그인 폼 */}
          {pageState === "form" && (
            <>
              <div className="lg:hidden mb-10 flex justify-center">
                <Logo height={40} />
              </div>

              <h1 className="text-2xl font-bold text-[#111827] mb-2">시작하기</h1>
              <p className="text-sm text-gray-400 mb-8">SNS 계정으로 간편하게 로그인하세요</p>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-xs text-red-500">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
                >
                  {googleLoading ? (
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  {googleLoading ? "Google로 이동 중..." : "Google로 계속하기"}
                </button>
              </div>

              {isDev && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-300 text-center mb-3">개발 환경 전용</p>
                  <button
                    onClick={handleTestLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 active:scale-[0.98] disabled:bg-gray-300 transition-all duration-150"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : "🛠 개발용 로그인 (test-token)"}
                  </button>
                  {error && <p className="text-xs text-red-400 text-center mt-2">{error}</p>}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mt-8 leading-5">
                계속 진행하면{" "}
                <Link href="/terms" className="text-gray-500 underline hover:text-gray-700 transition-colors">서비스 이용약관</Link> 및{" "}
                <Link href="/privacy" className="text-gray-500 underline hover:text-gray-700 transition-colors">개인정보 처리방침</Link>에<br />
                동의하는 것으로 간주됩니다.
              </p>
            </>
          )}
        </div>
      </div>

      {/* 약관 동의 모달 */}
      {pageState === "terms" && (
        <TermsConsentModal onAgreed={() => setPageState("onboarding")} />
      )}

      {/* 온보딩 모달 */}
      {pageState === "onboarding" && (
        <OnboardingModal onSkip={() => router.replace("/home")} />
      )}
    </div>
  );
}
