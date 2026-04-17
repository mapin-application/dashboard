"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentCard } from "@/components/report/ContentCard";
import { useContentStore } from "@/store/useContentStore";

const CATEGORIES = ["전체", "정치", "경제", "사회", "생활/문화", "IT/과학", "세계", "연예", "스포츠"];
const PLATFORMS  = ["전체", "YouTube", "뉴스"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");

  const { contentsByDate, fetchAnalyses, isLoading } = useContentStore();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const allContents = useMemo(
    () => Object.values(contentsByDate).flat(),
    [contentsByDate]
  );

  const results = useMemo(() => {
    return allContents.filter((c) => {
      const queryOk = !query || c.title.toLowerCase().includes(query.toLowerCase());
      const catOk   = selectedCategory === "전체" || c.category === selectedCategory;
      const platOk  =
        selectedPlatform === "전체" ||
        (selectedPlatform === "YouTube" && c.platform === "YouTube") ||
        (selectedPlatform === "뉴스" && c.platform !== "YouTube");
      return queryOk && catOk && platOk;
    });
  }, [allContents, query, selectedCategory, selectedPlatform]);

  const hasFilter = query || selectedCategory !== "전체" || selectedPlatform !== "전체";

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">검색</h1>

      {/* 검색 입력 */}
      <div className="relative mb-4">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="콘텐츠 제목으로 검색"
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-[#111827] placeholder:text-gray-300 focus:outline-none focus:border-[#FF7E64] transition-colors shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap mb-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-[#FF7E64] text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-[#FF7E64] hover:text-[#FF7E64]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 플랫폼 필터 */}
      <div className="flex gap-2 mb-6">
        {PLATFORMS.map((plat) => (
          <button
            key={plat}
            onClick={() => setSelectedPlatform(plat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedPlatform === plat
                ? "bg-[#111827] text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {plat}
          </button>
        ))}
      </div>

      {/* 결과 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#FF7E64] border-t-transparent animate-spin" />
        </div>
      ) : !hasFilter ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={36} className="text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-400">검색어나 필터를 선택해보세요</p>
          <p className="text-xs text-gray-300 mt-1">총 {allContents.length}개의 분석된 콘텐츠</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-sm font-medium text-gray-400">검색 결과가 없어요</p>
          <p className="text-xs text-gray-300 mt-1">다른 검색어나 필터를 시도해보세요</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">{results.length}개의 결과</p>
          <div className="space-y-3 max-w-2xl">
            {results.map((c) => (
              <ContentCard
                key={c.contentId}
                id={c.id}
                category={c.category}
                title={c.title}
                platform={c.platform}
                contentId={c.contentId}
                thumbnailUrl={c.thumbnailUrl}
                keywords={c.keywords}
              />
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
}
