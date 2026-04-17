import { create } from "zustand";
import { api } from "@/lib/api";

interface CategoryStat {
  category: string;
  count: number;
}

interface StatsState {
  totalCount: number;
  byCategory: CategoryStat[];
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>()((set) => ({
  totalCount: 0,
  byCategory: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<{
        totalCount: number;
        byCategory: CategoryStat[];
      }>("/users/me/analyses/stats");
      set({ ...data, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },
}));
