"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, User, LogOut, Trash2, FileText, Info } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockProfile } from "@/lib/mockData";
import { Logo } from "@/components/ui/Logo";

export default function MyPage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <AppLayout>
      {/* 앱바 */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-50">
        <div className="flex items-center px-4 py-3">
          <Logo height={26} />
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* 유저 프로필 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFEFEC] rounded-full flex items-center justify-center">
                <User size={24} className="text-[#FF7E64]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111827]">{mockProfile.name}</h2>
                <p className="text-xs text-gray-400">{mockProfile.email}</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/mypage/account")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              계정정보
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FFEFEC] rounded-2xl p-4 flex flex-col items-center">
            <p className="text-[11px] text-[#FF7E64] font-medium mb-2">공유한 URL</p>
            <span className="text-3xl font-black text-[#FF7E64]">{mockProfile.totalSharedCount}</span>
            <span className="text-xs text-[#FF7E64]/70 mt-1">개</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center">
            <p className="text-[11px] text-gray-400 font-medium mb-2">최다 카테고리</p>
            <span className="text-lg font-black text-[#111827] mt-1">{mockProfile.topCategory}</span>
            <span className="text-[10px] text-gray-400 mt-1">가장 많이 본 분야</span>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-gray-500" />
              </div>
              <span className="text-sm text-[#111827]">서비스 이용약관</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Info size={16} className="text-gray-500" />
              </div>
              <span className="text-sm text-[#111827]">버전 정보</span>
            </div>
            <span className="text-xs text-gray-400">1.0.0</span>
          </button>
        </div>

        {/* 로그아웃 / 탈퇴 */}
        <div className="space-y-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} />
            로그아웃
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            회원 탈퇴하기
          </button>
        </div>
      </div>

      {/* 로그아웃 확인 모달 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6">
            <h3 className="text-base font-bold text-[#111827] text-center mb-2">로그아웃</h3>
            <p className="text-sm text-gray-400 text-center mb-6">정말 로그아웃 하시겠어요?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-3 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
              >
                취소
              </button>
              <button
                onClick={() => router.push("/login")}
                className="py-3 rounded-xl bg-[#FF7E64] text-white text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6">
            <h3 className="text-base font-bold text-[#111827] text-center mb-2">회원 탈퇴</h3>
            <p className="text-sm text-gray-400 text-center mb-1">탈퇴하면 모든 데이터가 삭제돼요.</p>
            <p className="text-xs text-red-400 text-center mb-6">이 작업은 되돌릴 수 없어요.</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-3 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium"
              >
                취소
              </button>
              <button
                onClick={() => router.push("/login")}
                className="py-3 rounded-xl bg-red-500 text-white text-sm font-medium"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
