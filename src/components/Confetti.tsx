// =============================================================
// Confetti
// - "이해함"을 누르면 카드 위로 색종이가 터지는 효과.
// - 라이브러리 없이 직접 구현 — 원리가 보이게.
//
// 동작 원리 (비유: 폭죽):
//   1) 부모가 burstId 를 +1 하면 (방아쇠)
//   2) useMemo 가 새 조각 24개를 랜덤 생성하고 (화약)
//   3) 각 조각은 CSS 변수(--tx, --ty, --r)로 자기 목적지를 받아
//      keyframes 하나로 전부 다른 방향으로 날아간다 (폭발)
//   4) 0.9초 후 setTimeout 으로 전부 제거 (연기 청소)
// =============================================================

import { useEffect, useMemo, useState, type CSSProperties } from "react";

const COLORS = [
  "#7c6ff0", // 바이올렛 (accent)
  "#38bdf8", // 하늘
  "#34d399", // 민트
  "#fbbf24", // 노랑
  "#fb7185", // 핑크
];

interface Piece {
  id: number;
  style: CSSProperties;
}

/** 조각 24개를 랜덤 방향/색으로 생성 */
function makePieces(burstId: number): Piece[] {
  return Array.from({ length: 24 }, (_, i) => {
    // 각도는 위쪽 반원(폭죽처럼 위로 퍼지게), 거리는 60~160px 랜덤
    const angle = Math.PI * (0.15 + Math.random() * 0.7); // 27°~153°
    const dist = 60 + Math.random() * 100;
    return {
      id: burstId * 100 + i, // burst 마다 키가 겹치지 않게
      style: {
        left: "50%",
        top: "60%",
        background: COLORS[i % COLORS.length],
        // CSS 변수로 목적지 주입 → index.css 의 confetti-burst 가 사용
        ["--tx" as string]: `${Math.cos(angle) * dist * (Math.random() > 0.5 ? 1 : -1)}px`,
        ["--ty" as string]: `${-Math.sin(angle) * dist}px`,
        ["--r" as string]: `${(Math.random() - 0.5) * 720}deg`,
        animationDelay: `${Math.random() * 0.1}s`,
      },
    };
  });
}

export function Confetti({ burstId }: { burstId: number }) {
  const [visible, setVisible] = useState(false);

  // burstId 가 바뀔 때만 조각을 다시 만든다 (불필요한 재계산 방지)
  const pieces = useMemo(
    () => (burstId > 0 ? makePieces(burstId) : []),
    [burstId]
  );

  useEffect(() => {
    if (burstId === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(t); // 연속 클릭 시 이전 타이머 정리
  }, [burstId]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span key={p.id} className="confetti-piece" style={p.style} />
      ))}
    </div>
  );
}
