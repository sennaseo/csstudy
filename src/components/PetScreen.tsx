// =============================================================
// PetScreen — 마스코트 쓰다듬기 화면
// - 3D 고양이(public/mascot3d/cat.glb)를 띄우고 톡 치기 · 문지르기 · 간식 · 놀기 · 재우기.
// - three.js 는 무거워서 이 화면을 열 때만 내려받는다 (pet/catScene 을 동적 import).
// - 3D 를 못 띄우는 기기에서는 그림(hero.png)으로 대신한다 — 톡 치면 하트는 똑같이 나온다.
// - 쓰다듬은 횟수는 localStorage("csstudy-pet")에 쌓여 친밀도 단계가 오른다.
// =============================================================
import { useCallback, useEffect, useRef, useState } from "react";
import { useBack } from "../utils/useBack";
import type { CatScene, PetEvent } from "../pet/catScene";

const KEY = "csstudy-pet";
const LEVELS: [number, string][] = [
  [0, "서먹서먹"],
  [20, "조금 친해짐"],
  [80, "친한 친구"],
  [200, "단짝"],
  [500, "껌딱지"],
];
const LINES = {
  hello: ["왔어? 쓰다듬어 줘!", "오늘도 공부하러 왔구나!", "나 여기 있었어 🐾"],
  tap: ["꺅!", "간지러워!", "또 해줘!", "히힛"],
  pet: ["고르릉…", "거기 좋아…", "기분 좋다~", "더 쓰다듬어 줘"],
  full: ["너무 좋아!! 💕", "최고야!!", "오늘 공부도 화이팅!"],
  snack: ["쿠키다! 냠냠", "잘 먹겠습니다!"],
  ate: ["맛있었어! 고마워", "배부르다~"],
  play: ["빙글빙글~!", "신난다!"],
  sleep: ["쿨쿨… 💤"],
  wake: ["앗, 깼다!", "으음… 잘 잤다"],
};
const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

function loadCount(): number {
  try {
    return Number(JSON.parse(localStorage.getItem(KEY) ?? "{}").pets) || 0;
  } catch {
    return 0;
  }
}

interface Heart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export default function PetScreen({ onClose }: { onClose: () => void }) {
  useBack(onClose, true);
  const host = useRef<HTMLDivElement>(null);
  const cat = useRef<CatScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [count, setCount] = useState(loadCount);
  const [mood, setMood] = useState(30); // 0~100 기분 게이지
  const [line, setLine] = useState(() => pick(LINES.hello));
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [asleep, setAsleep] = useState(false);
  const [bump, setBump] = useState(0); // 그림 대체 화면에서 톡 칠 때 통통 튀는 용도
  const seq = useRef(0);
  const moodRef = useRef(mood);
  moodRef.current = mood;

  const addHeart = useCallback((x: number, y: number, emoji = "💗") => {
    const id = ++seq.current;
    setHearts((h) => [...h.slice(-14), { id, x: x + (Math.random() - 0.5) * 30, y, emoji }]);
    window.setTimeout(() => setHearts((h) => h.filter((v) => v.id !== id)), 1100);
  }, []);

  const love = useCallback(
    (amount: number, x: number, y: number, kind: "tap" | "pet") => {
      setCount((c) => {
        const next = c + 1;
        try {
          localStorage.setItem(KEY, JSON.stringify({ pets: next }));
        } catch {
          /* 저장 못 해도 놀 수는 있다 */
        }
        return next;
      });
      addHeart(x, y);
      const next = moodRef.current + amount;
      if (next >= 100) {
        // 게이지가 다 차면 크게 기뻐하고 다시 절반부터
        setMood(45);
        setLine(pick(LINES.full));
        cat.current?.act("cheer");
        for (let i = 0; i < 7; i++) window.setTimeout(() => addHeart(x + (Math.random() - 0.5) * 140, y + (Math.random() - 0.5) * 60, i % 2 ? "✨" : "💖"), i * 70);
        navigator.vibrate?.([20, 40, 20]);
      } else {
        setMood(next);
        if (Math.random() < (kind === "tap" ? 0.6 : 0.25)) setLine(pick(LINES[kind]));
        if (kind === "tap") navigator.vibrate?.(10);
      }
    },
    [addHeart],
  );

  const onEvent = useCallback(
    (e: PetEvent) => {
      if (e.type === "ready") setStatus("ready");
      else if (e.type === "tap") love(6, e.x, e.y, "tap");
      else if (e.type === "pet") love(4, e.x, e.y, "pet");
      else if (e.type === "wake") {
        setAsleep(false);
        setLine(pick(LINES.wake));
      } else if (e.type === "ate") {
        setLine(pick(LINES.ate));
        setMood((m) => Math.min(99, m + 15));
      }
    },
    [love],
  );
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    let dead = false;
    let made: CatScene | null = null;
    import("../pet/catScene")
      .then((m) => m.createCatScene(host.current!, `${import.meta.env.BASE_URL}mascot3d/cat.glb`, (e) => onEventRef.current(e)))
      .then((s) => {
        if (dead) s.dispose();
        else cat.current = made = s;
      })
      .catch(() => !dead && setStatus("fallback"));
    return () => {
      dead = true;
      made?.dispose();
      cat.current = null;
    };
  }, []);

  // 기분은 가만두면 천천히 내려간다
  useEffect(() => {
    const id = window.setInterval(() => setMood((m) => Math.max(0, m - 1)), 1500);
    return () => window.clearInterval(id);
  }, []);

  const level = LEVELS.reduce((acc, [min], i) => (count >= min ? i : acc), 0);
  const nextAt = LEVELS[level + 1]?.[0];

  const act = (a: "snack" | "play" | "sleep") => {
    if (a === "sleep") {
      const to = !asleep;
      setAsleep(to);
      setLine(pick(to ? LINES.sleep : LINES.wake));
      cat.current?.act(to ? "sleep" : "wake");
      return;
    }
    setAsleep(false);
    setLine(pick(LINES[a]));
    cat.current?.act(a);
    if (a === "play") setMood((m) => Math.min(99, m + 8));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-cute-lav-bg via-cute-pink to-cute-lav-soft" role="dialog" aria-modal="true" aria-labelledby="pet-title">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col">
        <header className="flex shrink-0 items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <button onClick={onClose} aria-label="닫기" className="flex h-11 w-11 items-center justify-center rounded-xl text-3xl leading-none text-cute-navy active:bg-white/60">
            ‹
          </button>
          <h2 id="pet-title" className="text-lg font-extrabold text-cute-navy">
            쓰담쓰담
          </h2>
          <span className="mr-2 rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-cute-pink-ink shadow-chip">💗 {count}</span>
        </header>

        {/* 친밀도 + 기분 */}
        <div className="shrink-0 px-5 pt-2">
          <div className="flex items-baseline justify-between text-xs font-extrabold text-cute-navy">
            <span>
              친밀도 Lv.{level + 1} · {LEVELS[level][1]}
            </span>
            <span className="font-bold text-cute-navy/60">{nextAt ? `다음 단계까지 ${nextAt - count}번` : "최고 단계!"}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span aria-hidden className="text-sm">😊</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/70" role="progressbar" aria-label="기분" aria-valuemin={0} aria-valuemax={100} aria-valuenow={mood}>
              <div className="h-full rounded-full bg-gradient-to-r from-pink-300 to-accent transition-[width] duration-300" style={{ width: `${mood}%` }} />
            </div>
          </div>
        </div>

        {/* 말풍선 */}
        <div className="flex shrink-0 justify-center px-5 pt-4">
          <p key={line} className="float-in relative rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-cute-navy shadow-chip" aria-live="polite">
            {line}
            <span aria-hidden className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
          </p>
        </div>

        {/* 고양이 */}
        <div className="relative min-h-0 flex-1">
          <div ref={host} className="absolute inset-0" aria-label="고양이 — 톡 치거나 문질러서 쓰다듬기" role="img" />
          {status !== "ready" && (
            <button
              type="button"
              disabled={status === "loading"}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setBump((n) => n + 1);
                love(6, e.clientX - r.left, e.clientY - r.top, "tap");
              }}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="고양이 쓰다듬기"
            >
              <img
                key={bump}
                src={`${import.meta.env.BASE_URL}mascot/hero.png`}
                alt=""
                className={"w-3/5 max-w-xs object-contain " + (status === "loading" ? "animate-pulse opacity-60" : "pet-bump")}
              />
            </button>
          )}
          {asleep && (
            <span aria-hidden className="pet-zzz pointer-events-none absolute right-[22%] top-[18%] text-3xl font-extrabold text-cute-navy/60">
              Zzz
            </span>
          )}
          {hearts.map((h) => (
            <span key={h.id} aria-hidden className="pet-heart pointer-events-none absolute text-2xl" style={{ left: h.x, top: h.y }}>
              {h.emoji}
            </span>
          ))}
        </div>

        <p className="shrink-0 px-5 text-center text-xs font-bold text-cute-navy/60">톡 치면 폴짝 · 문지르면 쓰담쓰담 · 옆을 끌면 돌려 보기</p>
        <div className="grid shrink-0 grid-cols-3 gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {(
            [
              ["snack", "🍪", "간식 주기"],
              ["play", "🎾", "놀아주기"],
              ["sleep", asleep ? "☀️" : "🌙", asleep ? "깨우기" : "재우기"],
            ] as const
          ).map(([id, emoji, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => act(id)}
              disabled={status === "loading"}
              className="flex min-h-14 flex-col items-center justify-center rounded-2xl bg-white text-xs font-extrabold text-cute-navy shadow-chip active:translate-y-0.5 active:bg-cute-lav-soft disabled:opacity-50"
            >
              <span aria-hidden className="text-xl">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
