// =============================================================
// WidgetPicker — 홈 화면 위젯에 띄울 단어 고르기
// - 단어장 카드를 분야별로 늘어놓고 체크한다. 체크한 카드만 위젯에서 돈다.
// - 하나도 안 고르면 전체가 돈다 (처음 상태).
// - 바꾸는 즉시 저장 + 위젯에 전달 (utils/widgetCards.ts).
// =============================================================

import { useState } from "react";
import { CARDS, CARD_DOMAINS, CARD_DOMAIN_EMOJI } from "../data/cards";
import { useBack } from "../utils/useBack";
import { hasWidget, loadWidgetIds, saveWidgetIds } from "../utils/widgetCards";

export function WidgetPicker({ onClose }: { onClose: () => void }) {
  useBack(onClose, true);
  // 없어진 카드 id 는 걸러서 시작한다
  const [ids, setIds] = useState<Set<string>>(() => {
    const known = new Set(CARDS.map((c) => c.id));
    return new Set(loadWidgetIds().filter((id) => known.has(id)));
  });
  const [query, setQuery] = useState("");

  const commit = (next: Set<string>) => {
    setIds(next);
    // 카드 순서대로 저장 — 목록을 다른 곳에서 읽어도 순서가 흔들리지 않게
    saveWidgetIds(CARDS.filter((c) => next.has(c.id)).map((c) => c.id));
  };
  const toggle = (id: string) => {
    const next = new Set(ids);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    commit(next);
  };
  const setMany = (targets: string[], on: boolean) => {
    const next = new Set(ids);
    for (const id of targets) {
      if (on) next.add(id);
      else next.delete(id);
    }
    commit(next);
  };

  const q = query.trim().toLowerCase();
  const match = (c: (typeof CARDS)[number]) =>
    !q || c.term.toLowerCase().includes(q) || c.oneLiner.toLowerCase().includes(q) || (c.tags ?? []).some((t) => t.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper" role="dialog" aria-modal="true" aria-labelledby="widget-picker-title">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col">
        <header className="shrink-0 border-b border-ink-200 bg-white px-2 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between">
            <button onClick={onClose} aria-label="닫기" className="flex h-11 w-11 items-center justify-center rounded-xl text-3xl leading-none text-ink-700 active:bg-ink-100">
              ‹
            </button>
            <h2 id="widget-picker-title" className="text-lg font-extrabold text-ink-900">
              위젯 단어 고르기
            </h2>
            <button
              onClick={() => commit(new Set())}
              disabled={ids.size === 0}
              className="min-h-11 rounded-xl px-3 text-xs font-extrabold text-accent disabled:text-ink-300"
            >
              모두 해제
            </button>
          </div>
          <p className="px-3 text-sm font-bold text-ink-700">
            {ids.size === 0 ? (
              <>고른 단어가 없어요 — 지금은 <span className="text-accent">전체 {CARDS.length}장</span>이 위젯에 나와요</>
            ) : (
              <>
                <span className="text-accent">{ids.size}장</span>을 골랐어요 — 위젯에는 이 단어들만 나와요
              </>
            )}
          </p>
          {!hasWidget && (
            <p className="mx-3 mt-2 rounded-xl bg-ink-100 px-3 py-2 text-xs text-ink-500">
              홈 화면 위젯은 안드로이드 앱에만 있어요. 여기(웹)에서 고른 목록은 이 브라우저에만 저장돼요.
            </p>
          )}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="단어 찾기 (예: WAS, 인덱스)"
            aria-label="단어 찾기"
            className="mx-3 mt-3 h-11 w-[calc(100%-1.5rem)] rounded-xl border-2 border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-accent"
          />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-3">
          {CARD_DOMAINS.map((d) => {
            const cards = CARDS.filter((c) => c.domain === d && match(c));
            if (cards.length === 0) return null;
            const picked = cards.filter((c) => ids.has(c.id)).length;
            const all = picked === cards.length;
            return (
              <section key={d} className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-ink-900">
                    {CARD_DOMAIN_EMOJI[d]} {d}{" "}
                    <span className="font-round text-xs font-semibold text-ink-400">
                      {picked}/{cards.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setMany(cards.map((c) => c.id), !all)}
                    className="min-h-9 rounded-full bg-ink-100 px-3 text-xs font-extrabold text-ink-700 active:bg-ink-200"
                  >
                    {all ? "이 분야 해제" : "이 분야 전부"}
                  </button>
                </div>
                <ul className="divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
                  {cards.map((c) => {
                    const on = ids.has(c.id);
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggle(c.id)}
                          className={"flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left active:bg-ink-100 " + (on ? "bg-accent-soft" : "")}
                        >
                          <span
                            className={
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm font-black " +
                              (on ? "border-accent bg-accent text-white" : "border-ink-300 text-transparent")
                            }
                          >
                            ✓
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-extrabold text-ink-900">{c.term}</span>
                            <span className="block truncate text-xs text-ink-500">{c.oneLiner}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
