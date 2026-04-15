"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { handleOAuthCallback } from "@/store/useAuthStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken  = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      handleOAuthCallback(accessToken, refreshToken);
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#FF7E64] animate-spin" />
        <p className="text-sm text-gray-400">로그인 처리 중...</p>
      </div>
    </div>
  );
}
