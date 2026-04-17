"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { SideNav } from "./SideNav";
import { useUserStore } from "@/store/useUserStore";
import { api, getToken, clearTokens } from "@/lib/api";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { name, email } = useUserStore();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api.get("/users/me/profile").then(() => {
      setAuthChecked(true);
    }).catch(() => {
      clearTokens();
      router.replace("/login");
    });
  }, [router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <SideNav />
      <main className="ml-[220px] min-h-screen flex flex-col">
        {/* 상단 바 */}
        <header className="sticky top-0 z-40 bg-[#F4F5F7]/90 backdrop-blur-sm border-b border-gray-200/50 px-8 h-14 flex items-center justify-end">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#FF7E64] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-[#111827]">{name}</span>
            </button>

            {open && (
              <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-[#111827]">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{email}</p>
                </div>
                <button
                  onClick={() => { setOpen(false); router.push("/login"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <User size={14} className="text-gray-400" />
                  마이페이지
                </button>
                <button
                  onClick={() => { setOpen(false); router.push("/login"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-[1100px] mx-auto w-full px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
