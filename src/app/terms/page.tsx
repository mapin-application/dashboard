"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-base font-bold text-[#111827]">서비스 이용약관</h1>
        </header>

        <div className="px-6 py-6 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-[#111827] mb-2">제1조 (목적)</h2>
            <p>본 약관은 MAPIN(이하 "서비스")이 제공하는 콘텐츠 분석 및 추천 서비스의 이용에 관한 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-[#111827] mb-2">제2조 (서비스 이용)</h2>
            <p>서비스는 사용자가 등록한 콘텐츠 URL을 분석하여 취향에 맞는 콘텐츠를 추천합니다. 서비스 이용을 위해서는 소셜 계정 로그인이 필요합니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-[#111827] mb-2">제3조 (금지 행위)</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>타인의 정보를 도용하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>불법적인 목적으로 서비스를 이용하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-[#111827] mb-2">제4조 (서비스 변경 및 중단)</h2>
            <p>서비스는 운영 정책에 따라 사전 공지 후 서비스 내용을 변경하거나 중단할 수 있습니다.</p>
          </section>

          <p className="text-xs text-gray-400 pt-2">시행일: 2025년 1월 1일</p>
        </div>
      </div>
    </div>
  );
}
