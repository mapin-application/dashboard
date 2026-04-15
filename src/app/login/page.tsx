"use client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="mobile-container flex flex-col min-h-screen">
      {/* 배경 그라데이션 상단 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        {/* 로고 영역 */}
        <div className="flex flex-col items-center mb-16">
          <Logo height={80} className="mb-3" />
          <p className="text-gray-400 text-sm mt-2 text-center leading-5">
            내가 본 콘텐츠를 분석하고<br />
            취향에 맞는 콘텐츠를 추천받으세요
          </p>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          <p className="text-center text-xs text-gray-400 mb-2">SNS 계정으로 간편하게 시작하기</p>

          {/* Google 로그인 */}
          <button
            onClick={() => router.push("/home")}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Google로 계속하기</span>
          </button>

          {/* Apple 로그인 */}
          <button
            onClick={() => router.push("/home")}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#111827] hover:bg-black transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.18.74 2.98.76 1.11-.21 2.17-.9 3.36-.77 1.43.17 2.49.76 3.21 1.9-3.02 1.72-2.41 5.96.41 7.27-.51 1.41-1.23 2.81-1.96 3.72zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className="text-sm font-medium text-white">Apple로 계속하기</span>
          </button>
        </div>
      </div>

      {/* 하단 약관 */}
      <div className="pb-10 px-8 text-center">
        <p className="text-[11px] text-gray-400 leading-5">
          계속 진행하면{" "}
          <span className="text-gray-500 underline cursor-pointer">서비스 이용약관</span> 및{" "}
          <span className="text-gray-500 underline cursor-pointer">개인정보 처리방침</span>에
          <br />동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
