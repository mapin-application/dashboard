import { create } from "zustand";
import { api } from "@/lib/api";
import { useStatsStore } from "@/store/useStatsStore";

export interface ContentItem {
  id: number;
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

type ContentType = "YOUTUBE" | "NAVER_NEWS" | "ARTICLE";

function toPlatform(contentType: ContentType): string {
  return contentType === "YOUTUBE" ? "YouTube" : "뉴스";
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
      const items = await api.get<Array<{
        id: number;
        contentId: string;
        title: string;
        contentType: ContentType;
        category: string;
        analyzedDates: string[];
        thumbnailUrl?: string;
      }>>(`/users/me/analyses${qs ? `?${qs}` : ""}`);

      const byDate: Record<string, ContentItem[]> = {};
      for (const item of items ?? []) {
        const date = item.analyzedDates?.[0]?.slice(0, 10) ?? "";
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push({
          id: item.id,
          contentId: item.contentId,
          title: item.title,
          platform: toPlatform(item.contentType),
          category: item.category,
          date,
          thumbnailUrl: item.thumbnailUrl,
        });
      }

      set({ contentsByDate: byDate, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchRecommendations: async () => {
    set({ isLoadingRecs: true });
    try {
      const groups = await api.get<Array<{
        source: {
          contentId: string;
          contentType: ContentType;
          category: string;
          thumbnailUrl?: string;
          description: string;
        };
        recommendations: Array<{
          id: number;
          contentId: string;
          title: string;
          contentType: ContentType;
          thumbnailUrl?: string;
        }>;
      }>>("/users/me/recommendations?size=10");

      const mapped: RecommendationEntry[] = (groups ?? []).map((g) => ({
        source: {
          contentId: g.source.contentId,
          contentType: g.source.contentType,
          category: g.source.category,
          title: g.source.description,
          description: g.source.description,
          thumbnailUrl: g.source.thumbnailUrl,
        },
        recommendations: g.recommendations.map((r) => ({
          contentId: r.contentId,
          title: r.title,
          thumbnailUrl: r.thumbnailUrl,
        })),
      }));

      set({ recommendations: mapped, isLoadingRecs: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoadingRecs: false });
    }
  },

  analyzeUrls: async (urls) => {
    await api.post("/analyses", { urls });
    await Promise.all([
      get().fetchAnalyses(),
      useStatsStore.getState().fetchStats(),
      get().fetchRecommendations(),
    ]);
  },
}));
