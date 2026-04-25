"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Plus } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "@/components/ui/Logo";
import { AddContentModal } from "@/components/layout/AddContentModal";

const navItems = [
  { href: "/home",   icon: Home,   label: "홈" },
  { href: "/search", icon: Search, label: "검색" },
  { href: "/mypage", icon: User,   label: "마이페이지" },
];

export function SideNav() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-gray-100 hidden md:flex flex-col z-50">
        {/* 로고 */}
        <div className="px-6 py-6 border-b border-gray-50">
          <Logo height={28} />
        </div>

        {/* 콘텐츠 추가 버튼 */}
        <div className="px-4 py-3 border-b border-gray-50">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#FF7E64] text-white text-sm font-semibold hover:bg-[#EB6045] transition-colors shadow-sm shadow-[#FF7E64]/30"
          >
            <Plus size={15} strokeWidth={2.5} />
            콘텐츠 추가
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                  active
                    ? "bg-[#FFEFEC] text-[#FF7E64]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {showModal && <AddContentModal onClose={() => setShowModal(false)} />}
    </>
  );
}
