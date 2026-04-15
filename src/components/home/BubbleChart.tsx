"use client";
import { useMemo } from "react";

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface BubbleChartProps {
  data: CategoryData[];
}

const COLORS = [
  "rgba(251,113,84,1.0)",
  "rgba(251,113,84,0.8)",
  "rgba(251,113,84,0.6)",
  "rgba(251,113,84,0.45)",
  "rgba(251,113,84,0.3)",
];

function DotPattern() {
  const dots = useMemo(() => {
    const arr = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 10; c++) {
        arr.push({ x: c * 40 + 20, y: r * 40 + 20 });
      }
    }
    return arr;
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.5} fill="#E5E5E5" opacity={0.6} />
      ))}
    </svg>
  );
}

function computePositions(count: number, containerW: number, containerH: number, sizes: number[]) {
  const positions: { x: number; y: number }[] = [];
  const cx = containerW / 2;
  const cy = containerH / 2;

  if (count === 0) return positions;

  positions.push({ x: cx, y: cy });

  if (count === 1) return positions;

  const radiusStep = Math.min(containerW, containerH) * 0.18;
  let radius = radiusStep;
  let placed = 1;
  let attempts = 0;

  while (placed < count && attempts < 500) {
    const angle = (attempts * 137.5 * Math.PI) / 180;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const r = (sizes[placed] || 40) / 2;

    const inBounds = x - r > 10 && x + r < containerW - 10 && y - r > 10 && y + r < containerH - 10;

    let overlapping = false;
    for (let p = 0; p < positions.length; p++) {
      const dx = x - positions[p].x;
      const dy = y - positions[p].y;
      const minDist = r + (sizes[p] || 40) / 2 + 6;
      if (Math.sqrt(dx * dx + dy * dy) < minDist) {
        overlapping = true;
        break;
      }
    }

    if (inBounds && !overlapping) {
      positions.push({ x, y });
      placed++;
      radius = radiusStep * (0.8 + placed * 0.2);
    }
    attempts++;
    if (attempts % 50 === 0) radius += radiusStep * 0.3;
  }

  while (positions.length < count) {
    positions.push({ x: cx + positions.length * 20, y: cy + positions.length * 20 });
  }

  return positions;
}

export function BubbleChart({ data }: BubbleChartProps) {
  const W = 340;
  const H = 280;
  const sorted = [...data].sort((a, b) => b.percentage - a.percentage).slice(0, 5);

  const sizes = sorted.map((d, i) => {
    const base = 120 - i * 16;
    return Math.max(60, base);
  });

  const positions = useMemo(
    () => computePositions(sorted.length, W, H, sizes),
    [sorted.length, sizes]
  );

  if (sorted.length === 0) {
    return (
      <div className="relative bg-[#FBFBFB] rounded-2xl overflow-hidden flex items-center justify-center" style={{ width: W, height: H }}>
        <DotPattern />
        <p className="text-gray-400 text-sm relative z-10">분석 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="relative bg-[#FBFBFB] rounded-2xl overflow-hidden mx-auto" style={{ width: W, height: H }}>
      <DotPattern />
      <svg className="absolute inset-0" width={W} height={H}>
        {sorted.map((item, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const r = sizes[i] / 2;
          return (
            <g key={item.category}>
              <circle cx={pos.x} cy={pos.y} r={r} fill={COLORS[i]} opacity={0.15} />
              <circle cx={pos.x} cy={pos.y} r={r * 0.85} fill={COLORS[i]} />
              <text
                x={pos.x}
                y={pos.y - 8}
                textAnchor="middle"
                fill="white"
                fontSize={sizes[i] > 90 ? 12 : 10}
                fontWeight="600"
                fontFamily="Pretendard, sans-serif"
              >
                {item.category}
              </text>
              <text
                x={pos.x}
                y={pos.y + 10}
                textAnchor="middle"
                fill="white"
                fontSize={sizes[i] > 90 ? 14 : 12}
                fontWeight="700"
                fontFamily="Pretendard, sans-serif"
              >
                {item.percentage}%
              </text>
              {item.count > 0 && (
                <g>
                  <rect
                    x={pos.x - 14}
                    y={pos.y + 16}
                    width={28}
                    height={16}
                    rx={8}
                    fill="rgba(0,0,0,0.2)"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 28}
                    textAnchor="middle"
                    fill="white"
                    fontSize={9}
                    fontFamily="Pretendard, sans-serif"
                  >
                    {item.count}개
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
