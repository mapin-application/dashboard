"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <h1 className="text-base font-bold text-[#111827]">개인정보 처리방침</h1>
        </header>

        <div className="px-6 py-6 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-[#111827] mb-2">수집하는 개인정보</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>소셜 로그인 정보 (이메일, 닉네임)</li>
              <li>사용자가 등록한 콘텐츠 URL</li>
              <li>서비스 이용 기록</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-[#111827] mb-2">개인정보 이용 목적</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>회원 식별 및 서비스 제공</li>
              <li>콘텐츠 분석 및 맞춤 추천</li>
              <li>서비스 개선 및 통계 분석</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-[#111827] mb-2">개인정보 보유 기간</h2>
            <p>회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-[#111827] mb-2">제3자 제공</h2>
            <p>수집한 개인정보는 원칙적으로 제3자에게 제공하지 않습니다. 단, 법령에 의한 경우는 예외로 합니다.</p>
          </section>

          <p className="text-xs text-gray-400 pt-2">시행일: 2025년 1월 1일</p>
        </div>
      </div>
    </div>
  );
}
