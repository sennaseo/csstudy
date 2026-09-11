// =============================================================
// Buddy
// - 대표 캐릭터를 메인 화면에 데리고 다니는 위젯.
// - 캐릭터 아트 + 단계 이름 + 다음 진화까지의 XP 바.
// - 아직 한 마리도 없으면 "첫 문제를 풀어보세요" 안내.
// - 카드 전체가 도감 탭으로 가는 버튼 — 눌러도 되는 곳이 카드 어디든이라는 신호.
// =============================================================

import {
  findCharacter,
  RARITY_INFO,
  stageOf,
  stageProgress,
  STAGE_XP,
} from "../data/characters";
import { useStudyStore } from "../store/useStudyStore";

export function Buddy() {
  const buddies = useStudyStore((s) => s.buddies);
  const activeBuddyId = useStudyStore((s) => s.activeBuddyId);
  const setTab = useStudyStore((s) => s.setTab);

  const ownedCount = Object.keys(buddies).length;
  const character = activeBuddyId ? findCharacter(activeBuddyId) : undefined;
  const record = activeBuddyId ? buddies[activeBuddyId] : undefined;

  return (
    // 카드 전체 — 그림자 대신 흰 배경 + Swan(ink-200) 테두리 라운드 카드. 누르면 도감 탭으로.
    <button
      type="button"
      onClick={() => setTab("collection")}
      className="w-full text-left rounded-2xl border-2 border-ink-200 bg-white p-4 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-900">내 버디</span>
        {/* 도감 배지 — 버튼이 아니라 span. 진짜 버튼은 바깥 카드 하나뿐(중첩 버튼 금지). ›로 이동 힌트만 남김 */}
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent transition-colors">
          📖 도감 {ownedCount}/12 ›
        </span>
      </div>

      {character && record ? (
        <BuddyCard
          charId={character.id}
          xp={record.xp}
        />
      ) : (
        <p className="mt-3 text-center text-sm leading-relaxed text-ink-500">
          아직 버디가 없어요.
          <br />
          <span className="font-semibold text-accent">
            첫 문제를 풀면 친구가 찾아옵니다! 🐣
          </span>
        </p>
      )}
    </button>
  );
}

/** 대표 캐릭터 카드 — 아트 + 단계 + XP 바 */
function BuddyCard({ charId, xp }: { charId: string; xp: number }) {
  const character = findCharacter(charId);
  if (!character) return null;

  const stage = stageOf(xp);
  const stageInfo = character.stages[stage - 1];
  const rarity = RARITY_INFO[character.rarity];
  const percent = stageProgress(xp);
  const isMax = stage === 3;

  return (
    <div className="mt-3 flex items-center gap-4">
      {/* 아트 — 줄 배열을 그대로 pre 로. 레어 이상은 은은한 글로우 */}
      {/* 카드 전체가 버튼이 되면서, 스크린리더가 버튼 이름으로 아트의 기호 문자까지
          읽어버린다. 그림은 장식이니 이름에서 빼고 이름·단계 글자만 읽히게 한다. */}
      <div
        aria-hidden
        className={
          "flex h-20 min-w-20 items-center justify-center rounded-xl bg-accent-soft/50 px-3 " +
          rarity.glow
        }
      >
        <pre className="text-center font-mono text-base leading-snug text-ink-900">
          {stageInfo.art.join("\n")}
        </pre>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold text-ink-900">
            {stageInfo.title}
          </span>
          <span
            className={
              "shrink-0 rounded-full px-1.5 py-0.5 text-xs font-bold " +
              rarity.badge
            }
          >
            {rarity.label}
          </span>
        </div>
        <p className="text-xs text-ink-500">
          {character.name} · {stage}단계
        </p>

        {/* XP 바 — .progress-track/.progress-fill 재사용. 기본 16px 는 너무 두꺼워서
            !h-2.5 로 이 자리에서만 얇게 override (progress-fill 안의 ::after 하이라이트는 그대로 유지). */}
        <div
          className="progress-track !h-2.5 mt-1.5"
          role="progressbar"
          aria-label={`다음 진화까지 진행도 ${Math.round(percent)}%`}
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-0.5 text-xs tabular-nums text-ink-400">
          {isMax
            ? `최종 진화 완료! (XP ${xp})`
            : `다음 진화까지 XP ${xp} / ${STAGE_XP[stage]}`}
        </p>
      </div>
    </div>
  );
}
