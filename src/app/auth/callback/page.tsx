"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { handleOAuthCallback, useAuthStore } from "@/store/useAuthStore";

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const { loginWithWebOAuth } = useAuthStore();

  useEffect(() => {
    const code = params.get("code");
    const provider = params.get("state");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (code && provider) {
      const redirectUri = `${window.location.origin}/auth/callback`;
      loginWithWebOAuth(provider, code, redirectUri)
        .then(() => {
          useAuthStore.getState().isNewUser
            ? router.replace("/onboarding/url")
            : router.replace("/home");
        })
        .catch(() => router.replace("/login?error=oauth_failed"));
    } else if (accessToken && refreshToken) {
      handleOAuthCallback(accessToken, refreshToken);
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [params, router, loginWithWebOAuth]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#FF7E64] animate-spin" />
        <p className="text-sm text-gray-400">로그인 처리 중...</p>
      </div>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
