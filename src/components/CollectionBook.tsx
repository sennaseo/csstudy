// =============================================================
// CollectionBook (도감)
// - 전체 12종을 그리드로 — 보유한 캐릭터는 현재 모습, 미보유는 ??? 실루엣.
// - 보유 캐릭터를 누르면 대표(active)로 지정.
// - 도감 탭 화면 (모달 아님).
//   왜 모달을 버렸나: 이 앱은 예전에 뒤로가기로 앱이 통째로 꺼지는 P0 버그를
//   겪었다(히스토리 장부 경합). 모달은 열릴 때마다 히스토리를 한 장 쌓는데,
//   도감이 탭이 되면서 그 장부를 쓰는 곳이 하나 줄었다. 탭 전환은 히스토리를
//   만들지 않는다.
// =============================================================

import {
  CHARACTERS,
  RARITY_INFO,
  stageOf,
  stageProgress,
} from "../data/characters";
import { useStudyStore } from "../store/useStudyStore";

export function CollectionBook() {
  const buddies = useStudyStore((s) => s.buddies);
  const activeBuddyId = useStudyStore((s) => s.activeBuddyId);
  const setActiveBuddy = useStudyStore((s) => s.setActiveBuddy);

  const ownedCount = Object.keys(buddies).length;

  return (
    // 홈 카드와 같은 스타일 한 겹 — 탭 화면이니 배경/본체 이중 레이어가 필요 없다.
    <div className="rounded-2xl border-2 border-ink-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-ink-900">
          📖 버디 도감{" "}
          <span className="text-sm font-semibold text-ink-500">
            {ownedCount}/{CHARACTERS.length}
          </span>
        </h2>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-ink-500">
        하루 목표를 달성하면 새 버디가 찾아와요. &lsquo;이해함&rsquo;을 누르면
        가끔(20%) 깜짝 등장하기도! 보유한 버디를 누르면 대표로 데리고
        다닙니다.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CHARACTERS.map((c) => {
          const record = buddies[c.id];
          const rarity = RARITY_INFO[c.rarity];

          // ── 미보유: ??? 실루엣 ──
          if (!record) {
            return (
              <div
                key={c.id}
                className="flex flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-ink-200 p-4 text-center"
              >
                <span className="text-2xl text-ink-400">❓</span>
                <span className="text-xs font-bold text-ink-400">???</span>
                <span
                  className={
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
                    rarity.badge
                  }
                >
                  {rarity.label}
                </span>
              </div>
            );
          }

          // ── 보유: 현재 단계 모습 ──
          const stage = stageOf(record.xp);
          const stageInfo = c.stages[stage - 1];
          const isActive = activeBuddyId === c.id;

          return (
            <button
              key={c.id}
              onClick={() => setActiveBuddy(c.id)}
              className={
                "flex flex-col items-center gap-1 rounded-2xl p-4 text-center transition-all active:scale-95 " +
                rarity.glow +
                " " +
                (isActive
                  ? "bg-accent-soft ring-2 ring-accent"
                  : "bg-ink-100/60 hover:bg-accent-soft/60")
              }
            >
              <pre className="font-mono text-sm leading-snug text-ink-900">
                {stageInfo.art.join("\n")}
              </pre>
              <span className="text-xs font-bold text-ink-900">
                {stageInfo.title}
              </span>
              <span className="text-[10px] text-ink-500">
                {c.name} · {stage}단계
              </span>
              {/* 진화 진행 점 3개 */}
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={
                      "h-1.5 w-1.5 rounded-full " +
                      (s <= stage ? "bg-accent" : "bg-ink-200")
                    }
                  />
                ))}
              </div>
              {/* 다음 진화까지 미니 바 */}
              {stage < 3 && (
                <div className="h-1 w-full overflow-hidden rounded-full bg-ink-200">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${stageProgress(record.xp)}%` }}
                  />
                </div>
              )}
              {isActive && (
                <span className="text-[10px] font-bold text-accent">
                  ★ 대표
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
