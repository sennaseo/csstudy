// =============================================================
// CardDeck (단어장) — 한 장씩 넘기며 외우는 암기 카드
// - 화면 구성 (영어 단어장 앱식):
//     상단  ‹ 뒤로 · "단어장 ▾"(분야 고르기) · 필터(미암기만)
//     카드  위 = 상태 배지 + 진행(3/120) + 용어 크게 + 🔊 읽기 · 👁 뜻 항상 보기
//           아래 = 가려진 뜻 — "터치하여 뜻 확인" 을 눌러야 한 줄 정의·비유가 나온다
//     하단  [✓ 암기완료] [✕ 미암기] — 누르면 기록하고 다음 장
// - 다 돌면 결과 화면: 몇 장 외웠나 + "미암기만 다시" / "처음부터".
// - 암기 기록은 이 기기 localStorage 에만 둔다 (학습 진도·동기화와 얽히지 않는 독립 기능).
//   저장소가 막힌 환경(시크릿 모드 등)에서도 화면은 그대로 돌아간다 — 기록만 안 남는다.
// - 순서는 열 때마다 셔플한다. 고정 순서면 "앞쪽 카드만 외우는" 편식이 생긴다.
// =============================================================

import { useMemo, useState } from "react";
import { CARDS, CARD_DOMAINS, CARD_DOMAIN_EMOJI } from "../data/cards";
import type { CardDomain, CsCard } from "../data/cards";
import { useBack } from "../utils/useBack";
import { useDialog } from "../utils/useDialog";

/** Fisher–Yates. 원본 배열(CARDS)은 건드리지 않게 복사본을 섞는다. */
function shuffle(cards: CsCard[]): CsCard[] {
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── 암기 기록 (카드 id → 외웠나) ───
type Memo = Record<string, "known" | "unknown">;
const MEMO_KEY = "csstudy-card-memo";
function loadMemo(): Memo {
  try {
    return JSON.parse(window.localStorage.getItem(MEMO_KEY) ?? "{}") as Memo;
  } catch {
    return {};
  }
}
function saveMemo(m: Memo) {
  try {
    window.localStorage.setItem(MEMO_KEY, JSON.stringify(m));
  } catch {
    /* 저장이 막혀도 화면은 계속 */
  }
}

/** 용어 읽어주기 — 브라우저가 음성 합성을 지원할 때만 버튼이 보인다 (안드로이드 WebView 는 대개 미지원). */
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
function speak(term: string) {
  if (!canSpeak) return;
  const u = new SpeechSynthesisUtterance(term.replace(/[()]/g, " "));
  u.lang = "ko-KR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

const ICON_BTN = "flex h-11 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-500 transition-colors active:bg-ink-200";

export function CardDeck({ onClose }: { onClose: () => void }) {
  useBack(onClose); // 안드로이드 뒤로가기 = 닫기
  const dialogRef = useDialog<HTMLDivElement>(onClose); // Esc·포커스 가둠·포커스 복귀

  const [memo, setMemo] = useState<Memo>(loadMemo);
  const [domain, setDomain] = useState<CardDomain | null>(null);
  const [onlyUnknown, setOnlyUnknown] = useState(false); // 필터: 아직 못 외운 카드만
  const [menuOpen, setMenuOpen] = useState(false);
  // 한 판(세션)에 돌 카드 — 분야·필터를 바꾸거나 "다시"를 누를 때만 새로 섞는다.
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [alwaysShow, setAlwaysShow] = useState(false); // 👁 뜻 항상 보기
  const [tally, setTally] = useState({ known: 0, unknown: 0 }); // 이번 판 결과

  const deck = useMemo(
    () =>
      shuffle(
        CARDS.filter((c) => (!domain || c.domain === domain) && (!onlyUnknown || memo[c.id] !== "known")),
      ),
    // memo 는 일부러 뺀다 — 카드를 누를 때마다 덱이 다시 섞이면 안 된다. 판이 바뀔 때만 반영.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [domain, onlyUnknown, round],
  );
  const card = deck[index];
  const done = deck.length > 0 && index >= deck.length;
  const showMeaning = revealed || alwaysShow;

  function restart(next?: { domain?: CardDomain | null; onlyUnknown?: boolean }) {
    if (next && "domain" in next) setDomain(next.domain ?? null);
    if (next && "onlyUnknown" in next) setOnlyUnknown(!!next.onlyUnknown);
    setRound((r) => r + 1);
    setIndex(0);
    setRevealed(false);
    setTally({ known: 0, unknown: 0 });
    setMenuOpen(false);
  }

  function mark(result: "known" | "unknown") {
    if (!card) return;
    const next = { ...memo, [card.id]: result };
    setMemo(next);
    saveMemo(next);
    setTally((t) => ({ ...t, [result]: t[result] + 1 }));
    setRevealed(false); // 다음 장은 반드시 뜻을 가린 채로
    setIndex((i) => i + 1);
  }

  const status = card ? memo[card.id] : undefined;
  const knownTotal = CARDS.filter((c) => (!domain || c.domain === domain) && memo[c.id] === "known").length;
  const domainTotal = CARDS.filter((c) => !domain || c.domain === domain).length;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="carddeck-title"
      className="fixed inset-0 z-40 flex flex-col bg-[#EEF0F3] outline-none"
    >
      <div className="mx-auto flex h-full w-full max-w-md flex-col">
        {/* ── 상단 바 ── */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-ink-200 bg-paper px-2 py-2">
          <button onClick={onClose} aria-label="단어장 닫기" className="flex h-11 w-11 items-center justify-center rounded-xl text-3xl leading-none text-ink-700 active:bg-ink-100">
            ‹
          </button>
          <button
            id="carddeck-title"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            className="flex items-center gap-1 rounded-xl px-3 py-2 text-lg font-extrabold text-ink-900 active:bg-ink-100"
          >
            {domain ? `${CARD_DOMAIN_EMOJI[domain]} ${domain}` : "단어장"}
            <span className="text-xs text-ink-500">▼</span>
          </button>
          <button
            onClick={() => restart({ onlyUnknown: !onlyUnknown })}
            aria-pressed={onlyUnknown}
            aria-label={onlyUnknown ? "모든 카드 보기" : "미암기 카드만 보기"}
            className={"flex h-11 items-center gap-1 rounded-xl px-2.5 text-xs font-extrabold active:bg-ink-100 " + (onlyUnknown ? "text-duo-red" : "text-ink-500")}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
              <circle cx="16" cy="7" r="2.2" />
              <circle cx="10" cy="17" r="2.2" />
            </svg>
            {onlyUnknown && "미암기만"}
          </button>

          {/* 분야 고르기 메뉴 */}
          {menuOpen && (
            <div className="absolute left-1/2 top-full z-10 mt-1 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sheet">
              {[null, ...CARD_DOMAINS].map((d) => {
                const n = CARDS.filter((c) => !d || c.domain === d).length;
                return (
                  <button
                    key={d ?? "all"}
                    onClick={() => restart({ domain: d })}
                    className={"flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold active:bg-ink-100 " + (d === domain ? "bg-accent-soft text-accent-dim" : "text-ink-700")}
                  >
                    <span>{d ? `${CARD_DOMAIN_EMOJI[d]} ${d}` : "✨ 전체"}</span>
                    <span className="font-round text-xs text-ink-400">{n}장</span>
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {/* ── 카드 ── */}
        <main className="flex min-h-0 flex-1 flex-col px-5 pb-3 pt-6">
          {deck.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <p className="text-4xl">🎉</p>
              <p className="text-base font-extrabold text-ink-900">미암기 카드가 없어요!</p>
              <button onClick={() => restart({ onlyUnknown: false })} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-accent shadow-chip">
                전체 카드 보기
              </button>
            </div>
          ) : done ? (
            // 한 판 끝 — 결과
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-[#F6F7F9] p-6 text-center shadow-card">
              <p className="text-5xl">🏁</p>
              <p className="text-xl font-extrabold text-ink-900">한 바퀴 끝!</p>
              <div className="flex gap-3">
                <span className="rounded-2xl bg-accent-soft px-4 py-2 text-sm font-extrabold text-accent-dim">✓ 암기 {tally.known}</span>
                <span className="rounded-2xl bg-duo-red-soft px-4 py-2 text-sm font-extrabold text-duo-red-ink">✕ 미암기 {tally.unknown}</span>
              </div>
              <p className="text-sm text-ink-500">
                {domain ?? "전체"} {domainTotal}장 중 {knownTotal}장 외웠어요
              </p>
              <div className="mt-2 flex w-full flex-col gap-2">
                {tally.unknown > 0 && (
                  <button onClick={() => restart({ onlyUnknown: true })} className="btn-3d min-h-12 rounded-full border-b-4 border-duo-red-dim bg-duo-red text-base font-extrabold text-white">
                    ✕ 미암기만 다시 보기
                  </button>
                )}
                <button onClick={() => restart({ onlyUnknown: false })} className="min-h-12 rounded-full border-2 border-ink-200 bg-white text-base font-extrabold text-ink-700">
                  처음부터 다시
                </button>
              </div>
            </div>
          ) : (
            card && (
              <div className="relative flex min-h-0 flex-1 flex-col">
                {/* 뒤에 겹쳐 쌓인 카드 두 장 — "아직 더 있다" 는 느낌 */}
                <div className="absolute inset-x-6 -bottom-3 top-6 rounded-3xl bg-[#E2E5EA]" aria-hidden />
                <div className="absolute inset-x-3 -bottom-1.5 top-3 rounded-3xl bg-[#E8EAEE]" aria-hidden />

                <div key={card.id} className="relative flex min-h-0 flex-1 animate-pop flex-col overflow-hidden rounded-3xl bg-[#F6F7F9] shadow-card">
                  {/* 위 — 용어 */}
                  <section className="flex flex-[1.1] flex-col px-5 pb-4 pt-5">
                    <div className="flex items-center justify-between">
                      {status === "known" ? (
                        <span className="flex items-center gap-1.5 text-base font-bold text-accent">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent text-xs">✓</span>암기
                        </span>
                      ) : status === "unknown" ? (
                        <span className="flex items-center gap-1.5 text-base font-bold text-duo-red">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-duo-red text-xs">✕</span>미암기
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-base font-bold text-ink-400">
                          <span className="h-6 w-6 rounded-full border-2 border-ink-300" />새 카드
                        </span>
                      )}
                      <span className="font-round text-base font-semibold text-ink-500">
                        {index + 1}/{deck.length}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-3 text-center">
                      <span className="text-xs font-bold text-ink-400">
                        {CARD_DOMAIN_EMOJI[card.domain]} {card.domain}
                      </span>
                      <p className="break-keep text-[34px] font-black leading-tight tracking-tight text-ink-900">{card.term}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      {canSpeak ? (
                        <button onClick={() => speak(card.term)} aria-label="용어 읽어주기" className={ICON_BTN}>
                          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                            <path d="M4 9h4l5-4v14l-5-4H4z" />
                            <path d="M16 9.5a3.5 3.5 0 010 5M18.5 7a7 7 0 010 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      ) : (
                        <span />
                      )}
                      <button
                        onClick={() => setAlwaysShow((a) => !a)}
                        aria-pressed={alwaysShow}
                        aria-label={alwaysShow ? "뜻 가리기 모드" : "뜻 항상 보기"}
                        className={ICON_BTN + (alwaysShow ? " !bg-accent-soft !text-accent" : "")}
                      >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                          <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </section>

                  <div className="mx-0 h-px bg-ink-200" />

                  {/* 아래 — 뜻 (가려져 있다가 터치하면 열림) */}
                  <section className="relative flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4">
                    {showMeaning && !alwaysShow && (
                      <button onClick={() => setRevealed(false)} aria-label="뜻 다시 가리기" className={ICON_BTN + " absolute right-5 top-4"}>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                          <path d="M3 10c2.5 3 5.5 4.5 9 4.5S18.5 13 21 10M6 13.5l-1.5 2M12 14.5v2.5M18 13.5l1.5 2" />
                        </svg>
                      </button>
                    )}
                    {showMeaning ? (
                      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-y-auto pr-2 pt-8">
                        <p className="text-lg font-extrabold leading-snug text-ink-900">{card.oneLiner}</p>
                        <p className="rounded-2xl bg-white px-4 py-3 text-[15px] leading-relaxed text-ink-700">💡 {card.example}</p>
                        {card.tags?.length ? <p className="font-round text-xs text-ink-400">{card.tags.join(" · ")}</p> : null}
                      </div>
                    ) : (
                      <button onClick={() => setRevealed(true)} className="flex flex-1 flex-col items-center justify-center gap-3 text-ink-400 active:opacity-70">
                        <span className="text-5xl opacity-30 grayscale" aria-hidden>
                          👆
                        </span>
                        <span className="text-lg font-semibold">터치하여 뜻 확인</span>
                      </button>
                    )}
                  </section>
                </div>
              </div>
            )
          )}
        </main>

        {/* ── 하단: 암기완료 / 미암기 ── */}
        {!done && card && (
          <footer className="flex shrink-0 gap-4 px-5 pb-6 pt-4">
            <button
              onClick={() => mark("known")}
              className="flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-full bg-[#3B8EF0] text-lg font-extrabold text-white shadow-card transition-transform active:scale-95"
            >
              <span className="text-2xl leading-none">✓</span> 암기완료
            </button>
            <button
              onClick={() => mark("unknown")}
              className="flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-full bg-[#D9534A] text-lg font-extrabold text-white shadow-card transition-transform active:scale-95"
            >
              <span className="text-2xl leading-none">✕</span> 미암기
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
