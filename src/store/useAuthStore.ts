import { create } from "zustand";
import { api, setTokens, clearTokens, getToken } from "@/lib/api";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isNewUser: boolean;
  isLoading: boolean;
  init: () => void;
  loginWithWebOAuth: (provider: string, code: string, redirectUri: string) => Promise<void>;
  loginWithTestToken: (userId?: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isNewUser: false,
  isLoading: true,

  init: () => {
    const token = getToken();
    set({ isAuthenticated: !!token, isLoading: false });
  },

  loginWithWebOAuth: async (provider, code, redirectUri) => {
    set({ isLoading: true });
    try {
      const data = await api.post<TokenResponse>("/auth/web/login", {
        provider,
        code,
        redirectUri,
      });
      setTokens(data.accessToken, data.refreshToken);
      set({ isAuthenticated: true, isNewUser: data.isNewUser, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  // 개발용 — test-token 엔드포인트로 바로 로그인
  loginWithTestToken: async (userId = 1) => {
    set({ isLoading: true });
    try {
      const data = await api.post<TokenResponse>(
        `/auth/test-token?userId=${userId}`
      );
      setTokens(data.accessToken, data.refreshToken);
      set({ isAuthenticated: true, isNewUser: data.isNewUser, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // 실패해도 클라이언트 토큰은 제거
    }
    clearTokens();
    set({ isAuthenticated: false });
  },
}));

export function handleOAuthCallback(accessToken: string, refreshToken: string) {
  setTokens(accessToken, refreshToken);
  useAuthStore.setState({ isAuthenticated: true });
}
