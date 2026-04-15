"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, User, LogOut, Trash2, FileText, Info } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useUserStore } from "@/store/useUserStore";
import { useStatsStore } from "@/store/useStatsStore";

export default function MyPage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { name, email, totalSharedCount } = useUserStore();
  const { totalCount, byCategory } = useStatsStore();

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">마이페이지</h1>
        <p className="text-sm text-gray-400 mt-1">계정 정보와 이용 통계를 확인하세요</p>
      </div>

      <div className="grid grid-cols-[340px_1fr] gap-6">
        {/* 왼쪽: 프로필 카드 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFEFEC] rounded-full flex items-center justify-center mb-3">
                <User size={30} className="text-[#FF7E64]" />
              </div>
              <h2 className="text-lg font-bold text-[#111827]">{name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{email}</p>
              <button
                onClick={() => router.push("/mypage/account")}
                className="mt-4 flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                계정정보 수정
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FFEFEC] rounded-2xl p-4 text-center">
              <p className="text-xs text-[#FF7E64] mb-1">공유 URL</p>
              <p className="text-3xl font-black text-[#FF7E64]">{totalSharedCount}</p>
              <p className="text-xs text-[#FF7E64]/60 mt-0.5">개</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">최다 카테고리</p>
              <p className="text-base font-black text-[#111827] mt-1">{byCategory[0]?.category}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-gray-400" />
                <span className="text-sm text-[#111827]">서비스 이용약관</span>
              </div>
              <ChevronRight size={15} className="text-gray-300" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Info size={16} className="text-gray-400" />
                <span className="text-sm text-[#111827]">버전 정보</span>
              </div>
              <span className="text-xs text-gray-400">1.0.0</span>
            </button>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 bg-white transition-colors"
          >
            <LogOut size={15} />
            로그아웃
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full text-center text-xs text-gray-400 hover:text-red-400 transition-colors py-1"
          >
            회원 탈퇴하기
          </button>
        </div>

        {/* 오른쪽: 카테고리 분석 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-[#111827] mb-5">카테고리별 분석</h2>
            <div className="space-y-4">
              {byCategory.map((item, i) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: `hsl(${16 - i * 3}, ${90 - i * 5}%, ${55 + i * 5}%)` }}
                      />
                      <span className="text-sm text-gray-700">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{item.count}개</span>
                      <span className="text-sm font-bold text-[#111827] w-10 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: `hsl(${16 - i * 3}, ${90 - i * 5}%, ${55 + i * 5}%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <p className="text-xs text-gray-400 mb-2">총 분석 콘텐츠</p>
              <p className="text-2xl font-black text-[#111827]">{totalCount}</p>
              <p className="text-xs text-gray-400 mt-1">개</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <p className="text-xs text-gray-400 mb-2">카테고리 수</p>
              <p className="text-2xl font-black text-[#111827]">{byCategory.length}</p>
              <p className="text-xs text-gray-400 mt-1">개</p>
            </div>
            <div className="bg-[#FFEFEC] rounded-2xl p-5 text-center">
              <p className="text-xs text-[#FF7E64] mb-2">최다 비율</p>
              <p className="text-2xl font-black text-[#FF7E64]">{byCategory[0]?.percentage}%</p>
              <p className="text-xs text-[#FF7E64]/70 mt-1">{byCategory[0]?.category}</p>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-xl">
            <h3 className="text-base font-bold text-[#111827] text-center mb-2">로그아웃</h3>
            <p className="text-sm text-gray-400 text-center mb-6">정말 로그아웃 하시겠어요?</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium">
                취소
              </button>
              <button onClick={() => router.push("/login")}
                className="py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-medium">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-xl">
            <h3 className="text-base font-bold text-[#111827] text-center mb-2">회원 탈퇴</h3>
            <p className="text-sm text-gray-400 text-center mb-1">탈퇴하면 모든 데이터가 삭제돼요.</p>
            <p className="text-xs text-red-400 text-center mb-6">이 작업은 되돌릴 수 없어요.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium">
                취소
              </button>
              <button onClick={() => router.push("/login")}
                className="py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
