import { create } from "zustand";
import { api } from "@/lib/api";

interface UserState {
  name: string;
  email: string;
  totalSharedCount: number;
  topCategory: string;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  acceptTerms: (agreedAt: string) => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
  name: "",
  email: "",
  totalSharedCount: 0,
  topCategory: "",
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{
        name: string;
        email: string;
        totalSharedCount: number;
        topCategory: string;
      }>("/users/me/profile");
      set({ ...data, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  updateName: async (name) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch("/users/me/profile", { name });
      set({ name, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
      throw e;
    }
  },

  deleteAccount: async () => {
    await api.delete("/users/me");
  },

  acceptTerms: async (agreedAt) => {
    await api.post("/users/me/agreements", { agreedAt });
  },
}));
