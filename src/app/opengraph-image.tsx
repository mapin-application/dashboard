import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MAPIN — 내가 본 콘텐츠를 분석하고 추천받으세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF5F3 0%, #FFEEE9 50%, #FFE0D8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 배경 원형 장식 */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 126, 100, 0.12)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 126, 100, 0.08)",
            display: "flex",
          }}
        />

        {/* 로고 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#FF7E64",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "white",
                display: "flex",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#111827",
              letterSpacing: -2,
            }}
          >
            MAPIN
          </span>
        </div>

        {/* 메인 문구 */}
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#374151",
            margin: 0,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          내가 본 콘텐츠를 분석하고
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#FF7E64",
            margin: 0,
            marginBottom: 48,
          }}
        >
          새로운 관점을 추천받으세요
        </p>

        {/* 태그 칩 3개 */}
        <div style={{ display: "flex", gap: 12 }}>
          {["YouTube 분석", "뉴스 분석", "맞춤 추천"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                background: "white",
                border: "2px solid #FFD4CB",
                fontSize: 18,
                fontWeight: 600,
                color: "#FF7E64",
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
