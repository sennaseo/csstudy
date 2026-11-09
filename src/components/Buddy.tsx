// =============================================================
// Buddy
// - 대표 캐릭터를 메인 화면에 데리고 다니는 위젯.
// - 캐릭터 아트 + 이름·Lv + "다음 진화까지 N XP" 한 줄과 바 + 버디의 손글씨 한마디.
//   숫자를 여러 개(XP 37/50, 도감 3/12 …) 늘어놓지 않고 "다음 목표 하나"만 보여준다.
// - 아트는 회색 박스에 가두지 않고 카드 위에 그대로 둔다 — 버디가 "거기 있는" 느낌.
//   (그래서 박스 테두리용이던 희귀도 글로우도 여기선 쓰지 않는다. 도감·보상 모달은 그대로)
// - 손글씨 한마디는 작은 양념(text-sm, 회색). 센 밈은 퀘스트 카드 한 곳뿐이다.
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
import { buddyLine } from "../data/memes";
import { dateKeyOf } from "../data/missions";
import { useStudyStore } from "../store/useStudyStore";

export function Buddy() {
  const buddies = useStudyStore((s) => s.buddies);
  const activeBuddyId = useStudyStore((s) => s.activeBuddyId);
  const setTab = useStudyStore((s) => s.setTab);

  const character = activeBuddyId ? findCharacter(activeBuddyId) : undefined;
  const record = activeBuddyId ? buddies[activeBuddyId] : undefined;

  return (
    // 카드 전체 — 그림자 대신 흰 배경 + Swan(ink-200) 테두리 라운드 카드. 누르면 도감 탭으로.
    <button
      type="button"
      onClick={() => setTab("collection")}
      className="w-full text-left rounded-2xl border border-ink-200 bg-white p-4 transition-colors active:bg-ink-100"
    >
      {character && record ? (
        <BuddyCard
          charId={character.id}
          xp={record.xp}
        />
      ) : (
        <div className="flex items-center justify-between gap-3">
          {/* 아트 자리 — 버디가 없으니 마스코트가 대신 기다린다(장식) */}
          <img
            src={`${import.meta.env.BASE_URL}mascot/face-happy.png`}
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="shrink-0"
          />
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink-500">
            아직 버디가 없어요.
            <br />
            <span className="font-semibold text-ink-700">
              첫 문제를 풀면 친구가 <span className="whitespace-nowrap">찾아와요 🐣</span>
            </span>
          </p>
          <DexHint />
        </div>
      )}
    </button>
  );
}

/** 우측 "도감 ›" 힌트 — 버튼이 아니라 글자. 진짜 버튼은 바깥 카드 하나뿐(중첩 버튼 금지). */
function DexHint() {
  return <span className="shrink-0 text-sm font-bold text-accent-dim">도감 ›</span>;
}

/** 대표 캐릭터 카드 — 아트 + 이름·Lv + 다음 진화까지 남은 XP + 손글씨 한마디 */
function BuddyCard({ charId, xp }: { charId: string; xp: number }) {
  const character = findCharacter(charId);
  if (!character) return null;

  const stage = stageOf(xp);
  const stageInfo = character.stages[stage - 1];
  const rarity = RARITY_INFO[character.rarity];
  const percent = stageProgress(xp);
  const isMax = stage === 3;
  // 다음 진화까지 남은 XP — 최종 단계면 0 (buddyLine 이 "다 컸어요" 쪽 문구를 고른다)
  const xpLeft = isMax ? 0 : STAGE_XP[stage] - xp;

  // 아트 줄 수가 많을수록 폭도 넓어지므로 글자를 한 단계씩 줄인다 (1줄 2xl / 2줄 xl / 3줄 lg)
  const art = stageInfo.art;
  const artSize = ["text-2xl", "text-xl", "text-lg"][art.length - 1] ?? "text-lg";

  // 명함형 배치: 위 = 아트 + (이름·Lv·배지, 다음 진화 XP), 아래 = 전폭 바 → 손글씨 + "버디 보기 →"
  return (
    <div>
      <div className="flex items-center gap-3">
        {/* 아트 — 장식이라 스크린리더에서 뺀다(카드 전체가 버튼이라 기호까지 읽히는 것 방지) */}
        <pre
          aria-hidden
          className={
            "max-w-[60%] shrink-0 overflow-hidden text-center font-mono leading-tight text-ink-900 " +
            artSize
          }
        >
          {art.join("\n")}
        </pre>

        <div className="min-w-0 flex-1">
          {/* 이름은 절대 자르지 않는다 — 좁으면 희귀도 배지가 다음 줄로 내려간다 */}
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 break-keep text-base font-bold text-ink-900">
            <span>
              {stageInfo.title}{" "}
              <span className="font-round tabular-nums text-ink-700">Lv.{stage}</span>
            </span>
            <span
              className={
                "rounded-full px-1.5 py-0.5 text-xs font-bold " + rarity.badge
              }
            >
              {rarity.label}
            </span>
          </p>
          <p className="mt-0.5 break-keep text-sm font-semibold text-ink-700">
            {isMax ? (
              "최종 진화 완료"
            ) : (
              <>
                다음 진화까지{" "}
                <span className="font-round tabular-nums">{xpLeft}</span> XP
              </>
            )}
          </p>
        </div>
      </div>

      {/* XP 바 — .progress-track/.progress-fill 재사용. 기본 굵기는 두꺼워서 !h-2.5 로 얇게. */}
      <div
        className="progress-track !h-2.5 mt-2"
        role="progressbar"
        aria-label={`다음 진화까지 진행도 ${Math.round(percent)}%`}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      {/* 버디의 손글씨 한마디(날짜로 고정) + "버디 보기 →" — 링크도 글자일 뿐, 진짜 버튼은 바깥 카드 */}
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="min-w-0 flex-1 break-keep font-display text-sm text-ink-500">
          {buddyLine(dateKeyOf(new Date()), xpLeft)}
        </p>
        <span className="shrink-0 text-sm font-bold text-accent-dim">버디 보기 →</span>
      </div>
    </div>
  );
}
