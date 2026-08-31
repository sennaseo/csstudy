// =============================================================
// CardDeck (단어장) — 한 장씩 넘겨 보는 화면
// - 목록으로 좌르르 보여주면 눈이 미끄러진다. 그래서 화면에 카드는 항상 한 장뿐이고,
//   탭하면 뒤집혀서 뜻이 나오고, 넘겨야 다음 장이 온다 (실제 단어장처럼).
// - 순서는 열 때마다 셔플한다. 고정 순서면 "앞쪽 카드만 외우는" 편식이 생긴다.
//   셔플은 마운트 시 딱 한 번(useState 초기화 함수) — 리렌더마다 섞이면 넘길 수가 없다.
// - 플립 3D 는 index.css 의 .flip-scene / .flip-inner / .flip-back 을 그대로 쓴다.
// =============================================================

import { useMemo, useState } from "react";
import { CARDS, CARD_DOMAINS, CARD_DOMAIN_EMOJI } from "../data/cards";
import type { CardDomain, CsCard } from "../data/cards";

/** Fisher–Yates. 원본 배열(CARDS)은 건드리지 않게 복사본을 섞는다. */
function shuffle(cards: CsCard[]): CsCard[] {
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CardDeck({ onClose }: { onClose: () => void }) {
  const [domain, setDomain] = useState<CardDomain | null>(null);
  // 전체 카드를 한 번만 섞어두고, 도메인 필터는 그 순서 위에서 걸러낸다.
  const [deck] = useState(() => shuffle(CARDS));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(
    () => (domain ? deck.filter((c) => c.domain === domain) : deck),
    [deck, domain],
  );

  // 필터가 바뀌면 카드 수가 줄어 index 가 범위를 넘을 수 있다 → 항상 안으로 접어준다.
  const safeIndex = cards.length ? index % cards.length : 0;
  const card = cards[safeIndex];

  /** 카드를 바꿀 땐 반드시 앞면부터. 뒤집힌 채로 다음 장이 오면 답부터 보인다. */
  function go(step: number) {
    if (!cards.length) return;
    setFlipped(false);
    setIndex((i) => (i + step + cards.length * 2) % cards.length);
  }

  function pickDomain(d: CardDomain | null) {
    setDomain(d);
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-label="단어장"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-paper shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between p-5 pb-3">
          <h2 className="font-display text-lg font-extrabold text-ink-900">
            📇 단어장{" "}
            <span className="font-round text-sm font-semibold text-ink-500">
              {cards.length ? safeIndex + 1 : 0} / {cards.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-200"
          >
            닫기 ✕
          </button>
        </div>

        {/* 도메인 필터 칩 */}
        <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-5 pb-3">
          <button
            onClick={() => pickDomain(null)}
            className={
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold shadow-chip transition-all active:scale-95 " +
              (domain === null
                ? "bg-ink-900 text-white"
                : "bg-white text-ink-500 hover:bg-ink-100")
            }
          >
            전체
          </button>
          {CARD_DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => pickDomain(d)}
              className={
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold shadow-chip transition-all active:scale-95 " +
                (domain === d
                  ? "bg-accent text-white"
                  : "bg-white text-ink-500 hover:bg-ink-100")
              }
            >
              {CARD_DOMAIN_EMOJI[d]} {d}
            </button>
          ))}
        </div>

        {/* 카드 한 장 */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-4">
          {!card ? (
            <p className="py-10 text-center text-sm text-ink-300">
              이 분야 카드가 아직 없어요.
            </p>
          ) : (
            <div className="flip-scene w-full">
              {/* key={card.id} → 카드가 바뀌면 DOM 이 새로 나면서 pop 등장 애니메이션이 다시 돈다 */}
              <button
                key={card.id}
                onClick={() => setFlipped((f) => !f)}
                aria-label={flipped ? "앞면 보기" : "뜻 보기"}
                className="w-full animate-pop text-left"
              >
                <div className={"flip-inner" + (flipped ? " is-flipped" : "")}>
                  {/* 앞면 — 용어만 */}
                  <div className="flip-face flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-ink-900 bg-paper-card p-6 shadow-card">
                    <span className="font-round text-xs font-bold text-ink-500">
                      {CARD_DOMAIN_EMOJI[card.domain]} {card.domain}
                    </span>
                    <p className="text-center font-display text-3xl font-extrabold leading-tight text-ink-900">
                      {card.term}
                    </p>
                    <span className="font-hand text-sm text-ink-300">
                      톡 눌러서 뒤집기 👆
                    </span>
                  </div>

                  {/* 뒷면 — 한 줄 정의 + 비유 */}
                  <div className="flip-face flip-back flex min-h-[240px] flex-col justify-center gap-3 rounded-3xl border-2 border-ink-900 bg-accent-soft p-6 shadow-card">
                    <p className="text-lg font-extrabold leading-snug text-ink-900">
                      {card.oneLiner}
                    </p>
                    <p className="text-sm leading-relaxed text-ink-700">
                      {card.example}
                    </p>
                    {card.tags?.length ? (
                      <p className="font-round text-xs text-ink-500">
                        {card.tags.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 넘기기 */}
        <div className="flex shrink-0 items-center gap-3 p-5 pt-2">
          <button
            onClick={() => go(-1)}
            disabled={!cards.length}
            className="rounded-2xl border-2 border-ink-900 bg-white px-5 py-3 text-sm font-extrabold text-ink-900 shadow-chip transition-all active:scale-95 disabled:opacity-40"
          >
            ← 이전
          </button>
          <button
            onClick={() => go(1)}
            disabled={!cards.length}
            className="flex-1 rounded-2xl border-2 border-ink-900 bg-duo-green px-5 py-3 text-sm font-extrabold text-white shadow-card transition-all active:scale-95 disabled:opacity-40"
          >
            다음 카드 →
          </button>
        </div>
      </div>
    </div>
  );
}
