// =============================================================
// LessonPath — 듀오링고식 "감긴 길" 스킬 패스
//
// 예전에는 [스테이지 목록 → 상세] 2단 구조였지만, 듀오링고처럼
// 홈 화면 하나에 모든 레슨이 위→아래로 이어진 "길"로 바꿨다.
//
// 구조:
//   그룹 구분선 (프론트엔드 / 백엔드&프로그래밍)
//   └ 유닛 배너 (유닛 색 통판 — "유닛 N · React", 스크롤하면 위에 붙는다)
//     └ 노드들 (동그란 3D 버튼이 좌우로 지그재그하며 내려감)
//
// 노드 상태 (듀오링고 표준):
//   완료   = 유닛 색 + 흰 ★ (복습 노드는 왕관)
//   현재   = 유닛 색 + 바깥 링(.path-node-current) + "시작" 말풍선(둥실둥실)
//   잠금   = 회색(.path-node-locked)
// 현재 노드가 화면 밖이면 오른쪽 아래 ↓ 버튼으로 돌아간다.
//
// 지그재그: 노드 순서 i 에 sin 곡선을 태워 translateX 로 좌우 오프셋.
// 유닛이 바뀔 때마다 곡선 방향을 뒤집어 길이 S자로 흐르게 한다.
// =============================================================

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useStudyStore, MAX_HEARTS } from "../store/useStudyStore";
import { unitsFor } from "../data/lessonPath";
import type { LessonNode } from "../data/lessonPath";
import type { CategoryGroup } from "../types";

/** 유닛별 색 — 듀오링고처럼 배너와 노드를 유닛 색 한 가지로 칠한다.
 *  face = 윗면, side = 아래 두께(3D 그림자). 듀오링고 실제 색(밝은 쪽)을 쓴다.
 *  밝은 바탕이라 흰 글자 대비가 4.5:1 에 못 미친다 → 배너 글자는 굵고 크게(20px extrabold) 둔다.
 *  CSS 변수로 넘기는 이유: 노드 3D 그림자·광택·말풍선이 전부 같은 색을 써야 해서. */
const UNIT_COLORS = [
  { face: "#58CC02", side: "#58A700" },
  { face: "#1CB0F6", side: "#1899D6" },
  { face: "#CE82FF", side: "#A568CC" },
  { face: "#FF9600", side: "#CC7800" },
] as const;

type UnitColor = (typeof UNIT_COLORS)[number];

const colorVars = (c: UnitColor) =>
  ({ "--unit": c.face, "--unit-side": c.side }) as CSSProperties;

// 노드 아이콘 — 글리프 대신 SVG. 이모지는 기기마다 모양·색이 달라 흰 아이콘이 안 된다.
const STAR = "M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z";
const CROWN = "M3 18.5h18l-1.6-10.5-4.6 4.2L12 5.5l-2.8 6.7-4.6-4.2z";

/** 노드 하나 — 동그란 3D 버튼 + (현재 노드면) 시작 말풍선.
 *  노드 색은 이제 유닛 색이 아니라 상태(완료/현재/잠금) 기반이라 유닛 color 는 안 받는다. */
function PathNode({
  node,
  offsetX,
  color,
}: {
  node: LessonNode;
  offsetX: number;
  color: UnitColor;
}) {
  const lessonProgress = useStudyStore((s) => s.lessonProgress);
  const isNodeUnlocked = useStudyStore((s) => s.isNodeUnlocked);
  const startLesson = useStudyStore((s) => s.startLesson);
  const hearts = useStudyStore((s) => s.hearts);

  const completed = !!lessonProgress[node.id];
  const unlocked = isNodeUnlocked(node.id);
  const current = unlocked && !completed;
  const locked = !unlocked;
  // 아직 안 푼 노드인데 하트가 없으면 = 지금은 눌러도 안 열린다.
  const noHearts = !completed && !locked && hearts === 0;

  // 듀오링고 표준: 완료·현재 = 유닛 색, 잠금 = 회색. 현재 노드는 링 + 말풍선으로 구분.
  const stateClass = locked ? "path-node-locked" : current ? "path-node-current" : "";

  return (
    <div
      className="relative flex justify-center"
      style={{ transform: `translateX(${offsetX}px)`, ...colorVars(color) }}
    >
      {/* 현재 노드 위 말풍선 — 하트가 없으면 회복 안내로 바뀐다.
          노드가 이미 scale(1.08) + 그림자로 충분히 도드라지므로 ring 은 빼고 굵기로 강조한다. */}
      {current && (
        <div
          className={
            "start-bubble animate-bob px-3 py-1.5 text-sm font-extrabold " +
            (hearts > 0 ? "text-[var(--unit-side)]" : "text-duo-red-ink")
          }
        >
          {hearts > 0 ? "시작" : "하트 없음 💔"}
        </div>
      )}

      <button
        onClick={() => startLesson(node.id)}
        // 하트 0 이면 startLesson 이 조용히 아무것도 안 한다 (스토어 726줄).
        // 눌러봐야 막힌 걸 아는 대신, 눌리지 않는다는 걸 눈으로 먼저 알려준다.
        // (복습·랜덤·오늘의 5문제는 하트를 안 쓰므로 그쪽은 그대로 열어둔다.)
        disabled={locked || noHearts}
        aria-disabled={locked || noHearts}
        // 마운트 시 자동 스크롤의 표적. ref 를 노드마다 위로 끌어올리는 대신
        // 부모가 querySelector 한 번으로 찾게 표시만 해둔다.
        data-current={current || undefined}
        aria-label={`${node.category} ${node.label}${
          completed
            ? " (완료)"
            : locked
            ? " (잠김)"
            : noHearts
            ? " (하트가 없어 지금은 못 풀어요)"
            : " (지금 풀 차례)"
        }`}
        className={
          "path-node " +
          stateClass +
          (noHearts ? " opacity-60" : locked ? "" : " hover:brightness-110")
        }
      >
        <svg viewBox="0 0 24 24" className="relative h-9 w-9" aria-hidden>
          <path
            d={node.kind === "review" ? CROWN : STAR}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

/** 그룹 구분선 — 가는 선 사이에 그룹 이름. */
function GroupDivider({ group }: { group: CategoryGroup }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-0.5 flex-1 rounded bg-ink-200" />
      <span className="text-xs font-semibold text-ink-500">
        {group}
      </span>
      <div className="h-0.5 flex-1 rounded bg-ink-200" />
    </div>
  );
}

export function LessonPath() {
  const lessonProgress = useStudyStore((s) => s.lessonProgress);
  const startRandom = useStudyStore((s) => s.startRandom);
  const activeTrack = useStudyStore((s) => s.activeTrack);
  const activeLevel = useStudyStore((s) => s.activeLevel);
  const hearts = useStudyStore((s) => s.hearts);

  // 트랙을 골랐으면 그 트랙의 유닛만, 레벨을 골랐으면 그 레벨 노드만, 아니면 전체.
  const units = unitsFor(activeTrack, activeLevel);

  // 트랙 모드에서는 그룹 구분선을 안 쓴다 (트랙 자체가 이미 하나의 흐름이라
  // "프론트엔드 / 백엔드" 구분선이 오히려 길을 끊어 보이게 한다).
  let lastGroup: CategoryGroup | null = null;

  // ─── 마운트 시 "지금 풀 차례" 노드로 스크롤 ───────────────────
  // 전체 보기는 노드가 80개를 넘어 길이가 8000px 가까이 된다. 진도가 중반이면
  // 홈에 들어올 때마다 손으로 한참 굴려야 내 자리를 찾는다 — 그걸 대신 해준다.
  // behavior 는 auto(즉시). smooth 로 8000px 를 훑으면 멀미가 나고,
  // 모션에 민감한 사용자에게도 좋을 게 없다.
  const rootRef = useRef<HTMLDivElement>(null);

  // ↓/↑ 버튼 — 현재 노드가 화면 밖에 있을 때만, 노드가 있는 쪽을 가리킨다(듀오링고 오른쪽 아래 버튼).
  const [jump, setJump] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    const current = rootRef.current?.querySelector("[data-current]");
    if (!current) return setJump(null);
    const io = new IntersectionObserver(([e]) =>
      setJump(e.isIntersecting ? null : e.boundingClientRect.top < 0 ? "up" : "down"),
    );
    io.observe(current);
    return () => io.disconnect();
  }, [activeTrack, activeLevel, lessonProgress]);

  useEffect(() => {
    // 하트가 0이면 굴리지 않는다. 어차피 레슨을 못 여는 상태라 내 자리로
    // 데려다줄 이유가 없고, 굴리면 헤더 밑의 "하트를 다 썼어요" 안내가
    // 화면 밖으로 밀려나 정작 이유를 못 보게 된다 (그게 4번 이슈였다).
    if (hearts === 0) return;

    const root = rootRef.current;
    const current = root?.querySelector<HTMLElement>("[data-current]");
    if (!root || !current) return;

    // 지금 풀 차례가 "길 전체의 첫 노드"일 때만 스크롤을 건너뛴다.
    // 예전엔 units[0].nodes[0] 의 완료 여부로 판단했는데, 그러면 앞 유닛을
    // 건너뛴 사용자는 현재 노드가 한참 아래에 있어도 영영 스크롤을 못 받았다.
    // 화면에 실제로 붙은 노드끼리 비교하면 그런 구멍이 없다.
    const firstNode = root.querySelector<HTMLElement>(".path-node");
    if (current === firstNode) return;

    // 스크롤 컨테이너를 찾는다 (앱은 창이 아니라 안쪽 div 가 스크롤된다).
    // 높이 비교만으로는 안 된다 — 부모 중엔 overflow:visible 인데 반올림 때문에
    // scrollHeight 가 1~3px 더 큰 칸이 있어서, 거기서 멈추면 안 굴러간다.
    // "실제로 스크롤되는 칸" = overflow 가 auto/scroll 이고 내용이 더 긴 칸.
    let sc: HTMLElement | null = current.parentElement;
    while (
      sc &&
      !(
        /auto|scroll/.test(getComputedStyle(sc).overflowY) &&
        sc.scrollHeight > sc.clientHeight
      )
    ) {
      sc = sc.parentElement;
    }
    const scroller: HTMLElement | Element =
      sc ?? document.scrollingElement ?? document.documentElement;

    // 예전 block:"center" 는 노드를 화면 정중앙에 놓느라 1117px 를 굴려서
    // 현재 노드만 덩그러니 남기고 위아래 맥락을 다 날렸다.
    // 지금은 노드를 화면 위쪽 1/3 에 둔다 — 위로 남는 210px 에 방금 끝낸
    // 노드들이 보여서 "내가 어디까지 왔는지"가 함께 읽힌다.
    //
    // 한계(측정값): 상단 정보 묶음(헤더~CTA)만 940px 라서, 640px 화면에서는
    // 현재 노드와 헤더·CTA 를 동시에 보여주는 스크롤 위치가 존재하지 않는다.
    // 길에서 내 자리를 찾아주는 쪽을 택했고, 하트 0 일 때는 위(HeartWarning)를
    // 택해 아예 안 굴린다.
    const nodeTop = current.getBoundingClientRect().top;
    const scRect =
      scroller === document.scrollingElement || scroller === document.documentElement
        ? { top: 0, height: window.innerHeight }
        : (scroller as HTMLElement).getBoundingClientRect();
    const delta = nodeTop - scRect.top - Math.round(scRect.height * 0.33);
    // 이미 화면 위쪽에 있으면(delta<=0) 굳이 안 건드린다.
    if (delta > 0) scroller.scrollBy({ top: delta, behavior: "auto" });
    // 트랙/레벨을 바꾸면 길 자체가 다시 깔리므로 그때도 새 위치를 잡아준다.
  }, [activeTrack, activeLevel, lessonProgress, hearts]);

  return (
    <div ref={rootRef} className="flex flex-col">
      {/* 하트 0 안내 배너는 이 길 맨 위(스크롤 758px 아래)에 있어서 첫 화면에서
          안 보였다. 지금은 App 의 HeartWarning 이 헤더 바로 밑에서 보여준다. */}
      {units.map((unit, unitIndex) => {
        const color = UNIT_COLORS[unitIndex % UNIT_COLORS.length];
        const total = unit.nodes.length;
        const done = unit.nodes.filter((n) => lessonProgress[n.id]).length;
        // 유닛마다 지그재그 방향을 뒤집어 길이 S자로 흐르게.
        const dir = unitIndex % 2 === 0 ? 1 : -1;

        const showDivider = !activeTrack && unit.group !== lastGroup;
        lastGroup = unit.group;

        // 다 끝낸 유닛은 접어둔다 — 이미 지나온 길이 8000px 를 차지할 이유가 없다.
        // 상태도 모달도 안 쓰고 네이티브 <details> 로 (LessonComplete 와 같은 방식).
        // 접힌 유닛엔 "지금 풀 차례" 노드가 있을 수 없으므로 자동 스크롤과도 안 부딪힌다.
        const unitDone = done === total;

        return (
          <div key={`${unit.category}-${unitIndex}`}>
            {showDivider && <GroupDivider group={unit.group} />}

            <details open={!unitDone}>
              {/* 유닛 배너 = 접기 손잡이. 듀오링고처럼 유닛 색 통판 + 오른쪽 칸막이 아이콘.
                  sticky: 스크롤하면 지금 걷는 유닛 배너가 위에 붙어 있다(details 안이라 다음 유닛이 오면 밀려난다). */}
              <summary
                style={colorVars(color)}
                className="sticky top-2 z-20 mb-14 mt-2 flex min-h-11 cursor-pointer list-none items-stretch overflow-hidden rounded-2xl border-b-4 border-[var(--unit-side)] bg-[var(--unit)] text-white [&::-webkit-details-marker]:hidden"
              >
                <div className="min-w-0 flex-1 px-4 py-3.5">
                  <p className="text-sm font-extrabold text-white/90">
                    유닛 {unitIndex + 1} · {done}/{total} 완료{unitDone && " ✓"}
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold leading-snug">{unit.label}</p>
                </div>
                {/* 칸막이 + 노트 아이콘 — 완료 유닛은 펼침 화살표 */}
                <span className="flex w-16 shrink-0 items-center justify-center border-l-2 border-[var(--unit-side)]">
                  {unitDone ? (
                    <span className="text-2xl font-extrabold">⌄</span>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                      <rect x="6" y="3" width="13" height="18" rx="2.5" />
                      <path d="M10 8h6M10 12h6M10 16h4M3.5 7h3M3.5 12h3M3.5 17h3" />
                    </svg>
                  )}
                </span>
              </summary>

              {/* 지그재그 노드 길 */}
              <div className="mb-10 flex flex-col gap-8">
                {unit.nodes.map((node, i) => (
                  <PathNode
                    key={node.id}
                    node={node}
                    color={color}
                    // sin 곡선으로 좌우 왕복 (최대 ±70px — 듀오링고 폭)
                    offsetX={Math.round(Math.sin(((i + 1) * Math.PI) / 4) * 70) * dir}
                  />
                ))}
              </div>
            </details>
          </div>
        );
      })}

      {/* 랜덤 연습 — 길의 끝에서 무한 연습 (하트 소모 없음). Secondary 버튼. */}
      <button
        onClick={startRandom}
        className="btn-3d min-h-12 w-full rounded-xl border-2 border-b-4 border-ink-200 bg-white px-4 text-sm font-bold text-accent hover:bg-ink-100"
      >
        🎲 랜덤 연습 — 하트 걱정 없이
      </button>

      {jump && (
        <button
          type="button"
          aria-label="지금 풀 차례로 이동"
          onClick={() =>
            rootRef.current
              ?.querySelector("[data-current]")
              ?.scrollIntoView({ block: "center", behavior: "smooth" })
          }
          // 탭바(약 64px) 위에 띄운다
          className="btn-3d fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-[max(1rem,calc(50%-18rem))] z-30 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-b-4 border-ink-200 bg-white text-2xl font-extrabold text-accent"
        >
          {jump === "up" ? "↑" : "↓"}
        </button>
      )}

      <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">
        길을 따라 한 칸씩. 천천히, 꾸준히 🐢 (❤️ 최대 {MAX_HEARTS}개)
      </p>
    </div>
  );
}
