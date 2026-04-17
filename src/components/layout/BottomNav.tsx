"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/home",   icon: Home,   label: "홈" },
  { href: "/search", icon: Search, label: "검색" },
  { href: "/mypage", icon: User,   label: "마이페이지" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50">
      <nav className="flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors",
                active ? "text-[#FF7E64]" : "text-gray-400"
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.8}
                className={active ? "text-[#FF7E64]" : "text-gray-400"}
              />
              <span className={clsx("text-[10px] font-medium", active ? "text-[#FF7E64]" : "text-gray-400")}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
