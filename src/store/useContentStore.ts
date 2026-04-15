import { create } from "zustand";
import { api } from "@/lib/api";

export interface ContentItem {
  category: string;
  title: string;
  platform: string;
  contentId: string;
  date: string;
  thumbnailUrl?: string;
  keywords?: string[];
  description?: string;
}

export interface RecommendItem {
  contentId: string;
  title: string;
  thumbnailUrl?: string;
}

export interface RecommendationEntry {
  source: {
    contentId: string;
    contentType: string;
    category: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
  };
  recommendations: RecommendItem[];
}

interface ContentState {
  contentsByDate: Record<string, ContentItem[]>;
  recommendations: RecommendationEntry[];
  isLoading: boolean;
  isLoadingRecs: boolean;
  error: string | null;

  fetchAnalyses: (params?: { from?: string; to?: string; category?: string; type?: string }) => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  analyzeUrls: (urls: string[]) => Promise<void>;
}

export const useContentStore = create<ContentState>()((set, get) => ({
  contentsByDate: {},
  recommendations: [],
  isLoading: false,
  isLoadingRecs: false,
  error: null,

  fetchAnalyses: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams();
      if (params.from)     query.set("from", params.from);
      if (params.to)       query.set("to", params.to);
      if (params.category) query.set("category", params.category);
      if (params.type)     query.set("type", params.type);

      const qs = query.toString();
      const data = await api.get<{ content: ContentItem[] }>(
        `/users/me/analyses${qs ? `?${qs}` : ""}`
      );

      // 날짜별로 그룹화
      const byDate: Record<string, ContentItem[]> = {};
      for (const item of data.content ?? []) {
        const date = item.date?.slice(0, 10) ?? "";
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push(item);
      }

      set({ contentsByDate: { ...get().contentsByDate, ...byDate }, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchRecommendations: async () => {
    set({ isLoadingRecs: true });
    try {
      const data = await api.get<{ content: RecommendationEntry[] }>(
        "/users/me/recommendations?size=10"
      );
      set({ recommendations: data.content ?? [], isLoadingRecs: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoadingRecs: false });
    }
  },

  analyzeUrls: async (urls) => {
    await api.post("/analyses", { urls });
    // 분석 완료 후 목록 갱신
    await get().fetchAnalyses();
  },
}));
