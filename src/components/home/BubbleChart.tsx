"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface BubbleChartProps {
  data: CategoryData[];
}

const COLORS = [
  "#E8563A",
  "#F06A4E",
  "#F87E62",
  "#FF9176",
  "#FFA48A",
];

const W = 390;
const H = 310;
const PADDING = 10;
const MAX_SPEED = 0.35;
const MIN_SPEED = 0.06;
const WOBBLE_FREQ = 9;
const WOBBLE_AMP  = 0.07;
const WOBBLE_DAMP = 4.2;
const WOBBLE_MS   = 1200;

interface BubblePhysics {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

interface RenderedBubble {
  x: number; y: number;
  sx: number; sy: number;
  holdScale: number;
  ringR: number;
}

function DotPattern() {
  const dots = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 10; c++)
        arr.push({ x: c * 40 + 20, y: r * 40 + 20 });
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

function computeInitialPositions(count: number, sizes: number[]) {
  const cx = W / 2, cy = H / 2;
  const positions: { x: number; y: number }[] = [];
  if (count === 0) return positions;
  positions.push({ x: cx, y: cy });
  if (count === 1) return positions;

  const step = Math.min(W, H) * 0.18;
  let radius = step, placed = 1, attempts = 0;

  while (placed < count && attempts < 600) {
    const angle = (attempts * 137.5 * Math.PI) / 180;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    const r = (sizes[placed] || 40) / 2;
    const inBounds = x - r > PADDING && x + r < W - PADDING && y - r > PADDING && y + r < H - PADDING;
    const overlapping = positions.some((p, pi) =>
      Math.hypot(x - p.x, y - p.y) < r + (sizes[pi] || 40) / 2 + 6
    );
    if (inBounds && !overlapping) {
      positions.push({ x, y });
      placed++;
      radius = step * (0.8 + placed * 0.2);
    }
    attempts++;
    if (attempts % 50 === 0) radius += step * 0.3;
  }
  while (positions.length < count)
    positions.push({ x: cx + positions.length * 20, y: cy + positions.length * 20 });
  return positions;
}

export function BubbleChart({ data }: BubbleChartProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.percentage - a.percentage).slice(0, 5),
    [data]
  );
  const sizes = useMemo(() => sorted.map((_, i) => Math.max(68, 162 - i * 26)), [sorted]);
  const initPos = useMemo(
    () => computeInitialPositions(sorted.length, sizes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sorted.length]
  );

  const physicsRef   = useRef<BubblePhysics[]>([]);
  const wobbleRef    = useRef<Map<number, number>>(new Map());
  const draggingRef  = useRef<number | null>(null);           // 드래그 중인 버블 인덱스
  const dragOffRef   = useRef({ dx: 0, dy: 0 });             // 버블 중심 ↔ 포인터 오프셋
  const dragHistRef  = useRef<{ x: number; y: number; t: number }[]>([]); // 속도 계산용
  const svgRef       = useRef<SVGSVGElement>(null);
  const rafRef       = useRef<number>(0);

  const [rendered, setRendered] = useState<RenderedBubble[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);

  /* SVG 좌표 변환 (viewBox 스케일 반영) */
  const toSVGPos = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return {
      x: (clientX - rect.left) * (W / rect.width),
      y: (clientY - rect.top)  * (H / rect.height),
    };
  };

  useEffect(() => {
    if (sorted.length === 0) return;

    physicsRef.current = initPos.map((pos, i) => ({
      x: pos.x, y: pos.y,
      vx: (Math.random() - 0.5) * MAX_SPEED * 2,
      vy: (Math.random() - 0.5) * MAX_SPEED * 2,
      r: sizes[i] / 2,
    }));

    const tick = () => {
      const b = physicsRef.current;
      const now = performance.now();
      const di = draggingRef.current;

      /* 물리 업데이트 */
      for (let i = 0; i < b.length; i++) {
        if (i === di) continue; // 드래그 중인 버블은 물리 스킵
        b[i].x += b[i].vx;
        b[i].y += b[i].vy;

        if (b[i].x - b[i].r < PADDING)     { b[i].x = b[i].r + PADDING;     b[i].vx =  Math.abs(b[i].vx); }
        if (b[i].x + b[i].r > W - PADDING) { b[i].x = W - PADDING - b[i].r; b[i].vx = -Math.abs(b[i].vx); }
        if (b[i].y - b[i].r < PADDING)     { b[i].y = b[i].r + PADDING;     b[i].vy =  Math.abs(b[i].vy); }
        if (b[i].y + b[i].r > H - PADDING) { b[i].y = H - PADDING - b[i].r; b[i].vy = -Math.abs(b[i].vy); }
      }

      /* 충돌 (드래그 중인 버블은 다른 버블을 밀기만 함) */
      for (let i = 0; i < b.length; i++) {
        for (let j = i + 1; j < b.length; j++) {
          const dx = b[j].x - b[i].x, dy = b[j].y - b[i].y;
          const dist = Math.hypot(dx, dy);
          const minD = b[i].r + b[j].r + 4;
          if (dist < minD && dist > 0.001) {
            const nx = dx / dist, ny = dy / dist;
            const overlap = minD - dist;
            if (i === di) {
              // 드래그 중인 버블은 위치 고정, 상대방만 밀어냄
              b[j].x += nx * overlap;
              b[j].y += ny * overlap;
              b[j].vx += nx * 0.3;
              b[j].vy += ny * 0.3;
            } else if (j === di) {
              b[i].x -= nx * overlap;
              b[i].y -= ny * overlap;
              b[i].vx -= nx * 0.3;
              b[i].vy -= ny * 0.3;
            } else {
              const half = overlap / 2;
              b[i].x -= nx * half; b[i].y -= ny * half;
              b[j].x += nx * half; b[j].y += ny * half;
              const dot = (b[i].vx - b[j].vx) * nx + (b[i].vy - b[j].vy) * ny;
              b[i].vx -= dot * nx; b[i].vy -= dot * ny;
              b[j].vx += dot * nx; b[j].vy += dot * ny;
            }
          }
        }
      }

      /* 속도 제한 + 최솟값 */
      for (let i = 0; i < b.length; i++) {
        if (i === di) continue;
        const sp = Math.hypot(b[i].vx, b[i].vy);
        if (sp > MAX_SPEED) { b[i].vx = b[i].vx / sp * MAX_SPEED; b[i].vy = b[i].vy / sp * MAX_SPEED; }
        else if (sp < MIN_SPEED) {
          const a = Math.random() * Math.PI * 2;
          b[i].vx += Math.cos(a) * 0.05; b[i].vy += Math.sin(a) * 0.05;
        }
      }

      /* 렌더 상태 */
      const next: RenderedBubble[] = b.map((bubble, i) => {
        let sx = 1, sy = 1;
        const ws = wobbleRef.current.get(i);
        if (ws !== undefined) {
          const t = (now - ws) / 1000;
          if (t > WOBBLE_MS / 1000) { wobbleRef.current.delete(i); }
          else {
            const squish = WOBBLE_AMP * Math.sin(WOBBLE_FREQ * t * Math.PI * 2) * Math.exp(-WOBBLE_DAMP * t);
            sx = 1 + squish; sy = 1 - squish;
          }
        }
        const isDrag = i === di;
        const holdScale = isDrag ? 1.13 : 1;
        const ringR = isDrag ? bubble.r * 1.13 + 6 + Math.sin(now / 220) * 3 : 0;
        return { x: bubble.x, y: bubble.y, sx, sy, holdScale, ringR };
      });

      setRendered(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initPos, sizes, sorted.length]);

  const triggerWobble = (i: number) => wobbleRef.current.set(i, performance.now());

  /* ── 포인터 다운 (드래그 시작) ── */
  const handleDown = (i: number, clientX: number, clientY: number) => {
    const pos = toSVGPos(clientX, clientY);
    const b = physicsRef.current[i];
    draggingRef.current = i;
    setDragging(i);
    dragOffRef.current = { dx: pos.x - b.x, dy: pos.y - b.y };
    dragHistRef.current = [{ x: pos.x, y: pos.y, t: performance.now() }];
    triggerWobble(i);
  };

  /* ── 포인터 무브 (드래그 중) ── */
  const handleMove = (clientX: number, clientY: number) => {
    const di = draggingRef.current;
    if (di === null) return;
    const pos = toSVGPos(clientX, clientY);
    const b = physicsRef.current[di];
    // 버블 중심을 포인터 위치로 (오프셋 반영)
    b.x = Math.max(b.r + PADDING, Math.min(W - b.r - PADDING, pos.x - dragOffRef.current.dx));
    b.y = Math.max(b.r + PADDING, Math.min(H - b.r - PADDING, pos.y - dragOffRef.current.dy));
    b.vx = 0; b.vy = 0;
    // 속도 계산용 히스토리 (최근 6프레임)
    const hist = dragHistRef.current;
    hist.push({ x: pos.x, y: pos.y, t: performance.now() });
    if (hist.length > 6) hist.shift();
  };

  /* ── 포인터 업 (드래그 끝) ── */
  const handleUp = () => {
    const di = draggingRef.current;
    if (di === null) return;
    const b = physicsRef.current[di];
    // 드래그 속도 → 던지기
    const hist = dragHistRef.current;
    if (hist.length >= 2) {
      const last = hist[hist.length - 1];
      const prev = hist[0];
      const dt = (last.t - prev.t) / 1000;
      if (dt > 0) {
        const THROW = 0.06;
        b.vx = Math.max(-MAX_SPEED * 4, Math.min(MAX_SPEED * 4, (last.x - prev.x) / dt * THROW));
        b.vy = Math.max(-MAX_SPEED * 4, Math.min(MAX_SPEED * 4, (last.y - prev.y) / dt * THROW));
      }
    } else {
      // 그냥 놓으면 랜덤 튕김
      const a = Math.random() * Math.PI * 2;
      b.vx = Math.cos(a) * MAX_SPEED;
      b.vy = Math.sin(a) * MAX_SPEED;
    }
    triggerWobble(di);
    draggingRef.current = null;
    setDragging(null);
    dragHistRef.current = [];
  };

  if (sorted.length === 0) {
    return (
      <div className="relative bg-[#FBFBFB] rounded-2xl overflow-hidden flex items-center justify-center w-full" style={{ aspectRatio: `${W}/${H}` }}>
        <DotPattern />
        <p className="text-gray-400 text-sm relative z-10">분석 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div
      className="relative bg-[#FBFBFB] rounded-2xl overflow-hidden w-full select-none"
      style={{ aspectRatio: `${W}/${H}` }}
    >
      <DotPattern />
      <svg
        ref={svgRef}
        className="absolute inset-0 touch-none"
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchMove={(e) => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={handleUp}
        onTouchCancel={handleUp}
      >
        {sorted.map((item, i) => {
          const p = rendered[i];
          if (!p) return null;
          const baseR = sizes[i] / 2;
          const innerRx = baseR * p.sx * p.holdScale;
          const innerRy = baseR * p.sy * p.holdScale;
          const fontSize = baseR > 45 ? 12 : 10;
          const isDrag = dragging === i;

          return (
            <g
              key={item.category}
              style={{ cursor: isDrag ? "grabbing" : "grab" }}
              onMouseDown={(e) => { e.preventDefault(); handleDown(i, e.clientX, e.clientY); }}
              onTouchStart={(e) => { e.preventDefault(); handleDown(i, e.touches[0].clientX, e.touches[0].clientY); }}
            >
              {/* 드래그 중 링 */}
              {isDrag && (
                <>
                  <circle cx={p.x} cy={p.y} r={p.ringR} fill="none"
                    stroke={COLORS[i]} strokeWidth={2} strokeDasharray="6 4" opacity={0.45} />
                  <circle cx={p.x} cy={p.y} r={p.ringR + 10} fill={COLORS[i]} opacity={0.05} />
                </>
              )}

              {/* 메인 버블 */}
              <ellipse cx={p.x} cy={p.y} rx={innerRx} ry={innerRy} fill={COLORS[i]} />

              <text x={p.x} y={p.y - 8} textAnchor="middle" fill="white"
                fontSize={fontSize} fontWeight="600" fontFamily="Pretendard, sans-serif">
                {item.category}
              </text>
              <text x={p.x} y={p.y + 10} textAnchor="middle" fill="white"
                fontSize={fontSize + 2} fontWeight="700" fontFamily="Pretendard, sans-serif">
                {item.percentage}%
              </text>

              {item.count > 0 && (
                <g>
                  <rect x={p.x - 14} y={p.y + 16} width={28} height={16} rx={8} fill="rgba(0,0,0,0.2)" />
                  <text x={p.x} y={p.y + 28} textAnchor="middle" fill="white" fontSize={9} fontFamily="Pretendard, sans-serif">
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
