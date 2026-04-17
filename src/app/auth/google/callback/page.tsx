"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { loginWithWebOAuth } = useAuthStore();

  useEffect(() => {
    const code = params.get("code");
    if (!code) {
      router.replace("/login");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    loginWithWebOAuth("google", code, redirectUri)
      .then(() => router.replace("/login?success=true"))
      .catch(() => router.replace("/login?error=oauth_failed"));
  }, [params, router, loginWithWebOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#FF7E64] animate-spin" />
        <p className="text-sm text-gray-400">로그인 처리 중...</p>
      </div>
    </div>
  );
}
