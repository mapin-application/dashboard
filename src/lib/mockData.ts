export const mockStats = {
  totalCount: 47,
  byCategory: [
    { category: "IT/과학", count: 15, percentage: 32 },
    { category: "경제", count: 11, percentage: 23 },
    { category: "사회", count: 9, percentage: 19 },
    { category: "연예", count: 7, percentage: 15 },
    { category: "스포츠", count: 5, percentage: 11 },
  ],
};

export const mockRecommendations = [
  {
    source: {
      contentId: "abc123",
      contentType: "YOUTUBE",
      category: "IT/과학",
      title: "2024 AI 트렌드 총정리 - GPT, Gemini, Claude 완벽 비교",
      description: "최신 AI 모델들의 비교 분석 영상입니다.",
      thumbnailUrl: "https://picsum.photos/seed/yt1/320/180",
    },
    recommendations: [
      {
        contentId: "rec1",
        title: "AI 개발자가 되는 방법 - 2024 로드맵",
        thumbnailUrl: "https://picsum.photos/seed/yt2/320/180",
      },
      {
        contentId: "rec2",
        title: "ChatGPT vs Claude 3.5 실전 비교",
        thumbnailUrl: "https://picsum.photos/seed/yt3/320/180",
      },
    ],
  },
  {
    source: {
      contentId: "def456",
      contentType: "NAVER_NEWS",
      category: "경제",
      title: "코스피 상승세 지속... 외국인 순매수 4거래일 연속",
      description: "코스피가 외국인 매수세에 힘입어 상승세를 이어가고 있다.",
      thumbnailUrl: "https://picsum.photos/seed/news1/320/180",
    },
    recommendations: [
      {
        contentId: "rec3",
        title: "금리 인하 전망과 주식시장 영향 분석",
        thumbnailUrl: "https://picsum.photos/seed/news2/320/180",
      },
      {
        contentId: "rec4",
        title: "2024 하반기 투자 전략 총정리",
        thumbnailUrl: "https://picsum.photos/seed/news3/320/180",
      },
    ],
  },
  {
    source: {
      contentId: "ghi789",
      contentType: "YOUTUBE",
      category: "사회",
      title: "서울시 주거 문제 현황과 청년 주거 지원 정책 심층 분석",
      description: "청년 주거 문제 해결을 위한 정책 분석",
      thumbnailUrl: "https://picsum.photos/seed/yt4/320/180",
    },
    recommendations: [
      {
        contentId: "rec5",
        title: "전월세 계약 시 주의사항 완벽 가이드",
        thumbnailUrl: "https://picsum.photos/seed/yt5/320/180",
      },
      {
        contentId: "rec6",
        title: "2024 청년 주거 지원 혜택 정리",
        thumbnailUrl: "https://picsum.photos/seed/yt6/320/180",
      },
    ],
  },
];

export const mockContentsByDate: Record<string, Array<{
  category: string;
  title: string;
  platform: string;
  contentId: string;
  date: string;
  thumbnailUrl?: string;
  keywords?: string[];
}>> = {
  "2026-04-15": [
    {
      category: "IT/과학",
      title: "NextJS 14 앱 라우터 완벽 가이드",
      platform: "YouTube",
      contentId: "yt1",
      date: "2026-04-15",
      thumbnailUrl: "https://picsum.photos/seed/d1/320/180",
      keywords: ["NextJS", "React", "웹개발"],
    },
    {
      category: "경제",
      title: "2026년 1분기 경제 성장률 발표",
      platform: "Naver News",
      contentId: "n1",
      date: "2026-04-15",
      thumbnailUrl: "https://picsum.photos/seed/d2/320/180",
      keywords: ["경제성장", "GDP"],
    },
  ],
  "2026-04-12": [
    {
      category: "연예",
      title: "BTS 새 앨범 발매 임박... 예약 판매 기록 갱신",
      platform: "Naver News",
      contentId: "n2",
      date: "2026-04-12",
      thumbnailUrl: "https://picsum.photos/seed/d3/320/180",
      keywords: ["BTS", "K-POP"],
    },
  ],
  "2026-04-10": [
    {
      category: "스포츠",
      title: "손흥민 시즌 20골 달성, 토트넘 팬들 환호",
      platform: "Naver News",
      contentId: "n3",
      date: "2026-04-10",
      thumbnailUrl: "https://picsum.photos/seed/d4/320/180",
      keywords: ["손흥민", "프리미어리그"],
    },
    {
      category: "IT/과학",
      title: "메타 라마3 공개 - 오픈소스 AI의 새 지평",
      platform: "YouTube",
      contentId: "yt2",
      date: "2026-04-10",
      thumbnailUrl: "https://picsum.photos/seed/d5/320/180",
      keywords: ["Meta", "AI", "오픈소스"],
    },
  ],
  "2026-04-08": [
    {
      category: "사회",
      title: "기후 위기 대응 국제 협약 한국 가입",
      platform: "Naver News",
      contentId: "n4",
      date: "2026-04-08",
      thumbnailUrl: "https://picsum.photos/seed/d6/320/180",
      keywords: ["기후변화", "환경"],
    },
  ],
  "2026-04-05": [
    {
      category: "경제",
      title: "비트코인 10만 달러 돌파 분석",
      platform: "YouTube",
      contentId: "yt3",
      date: "2026-04-05",
      thumbnailUrl: "https://picsum.photos/seed/d7/320/180",
      keywords: ["비트코인", "암호화폐"],
    },
  ],
};

export const mockProfile = {
  name: "김마핀",
  email: "user@example.com",
  totalSharedCount: 12,
  topCategory: "IT/과학",
};
