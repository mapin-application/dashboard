"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function AccountPage() {
  const router = useRouter();
  const { name: storedName, email, updateName } = useUserStore();
  const [name, setName] = useState(storedName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateName(name);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.back();
    }, 1000);
  };

  return (
    <div className="mobile-container min-h-screen bg-white">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1.5 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-[#111827]">계정 정보</h1>
      </header>

      <div className="px-4 py-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">닉네임</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-[#111827] border border-gray-100 focus:outline-none focus:border-[#FF7E64] focus:bg-white transition-colors"
          />
          <p className="text-right text-[10px] text-gray-300 mt-1">{name.length}/20</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">이메일</label>
          <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-400 border border-gray-100">
            {email}
          </div>
          <p className="text-[10px] text-gray-300 mt-1">이메일은 변경할 수 없어요</p>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? "bg-green-500 text-white" : "bg-[#FF7E64] text-white hover:bg-[#EB6045]"
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={16} />
              저장됨
            </span>
          ) : "저장하기"}
        </button>
      </div>
    </div>
  );
}
