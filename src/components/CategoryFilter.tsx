// =============================================================
// CategoryFilter
// - 2단 필터: ① 큰 그룹 탭 (전체/프론트엔드/백엔드&프로그래밍)
//            ② 그룹 안의 카테고리 칩
// - 그룹을 고르면 그 그룹에 속한 카테고리 칩만 보인다.
// - 카테고리마다 고유 파스텔 색 — 활성화하면 그 색이 진해진다.
// =============================================================

import { CATEGORY_GROUPS } from "../data/questions";
import { useStudyStore } from "../store/useStudyStore";
import type { Category, CategoryGroup } from "../types";

/** 그룹 탭 목록 — null = 전체 */
const GROUP_TABS: Array<{ label: string; value: CategoryGroup | null }> = [
  { label: "✨ 전체", value: null },
  { label: "🎨 프론트엔드", value: "프론트엔드" },
  { label: "⚙️ 백엔드&프로그래밍", value: "백엔드&프로그래밍" },
];

/** 카테고리별 색상 — [비활성, 활성] 클래스 쌍.
 *
 *  규칙 세 가지:
 *  1) 팔레트 토큰만 쓴다. sky/cyan/blue 같은 테일윈드 기본 원색은 채도가 높아
 *     "크림 종이에 색연필" 톤에서 혼자 형광등처럼 튄다.
 *  2) 비활성 = 형광펜으로 슥 그은 옅은 틴트, 활성 = 그 색을 꽉 칠한다.
 *  3) 글자 대비는 전부 4.5:1 이상. 그래서 활성 칩의 글자색이 두 종류다 —
 *     파랑·초록·빨강처럼 어두운 색은 흰 글자(그 대신 한 톤 진한 -dim 을 깐다),
 *     노랑·주황처럼 밝은 색은 흰 글자가 3점대라 미달이라서 잉크색 글자를 얹는다.
 *     (duo-fox 위: 흰 글자 3.06:1 미달 → ink-900 글자 5.69:1 통과)
 *     -ink 토큰은 "글자 전용"이라 배경으로는 쓰지 않는다.
 *
 *  색 계열은 6개인데 카테고리는 12개다. 한 계열을 둘이 나눠 쓰되 짝끼리
 *  모양을 다르게 한다 — 하나는 "칠한 틴트", 다른 하나는 "테두리만 두른 종이".
 *  덕분에 같은 계열 둘이 나란히 놓여도 구별된다.
 *  (테두리 유무로 칩 키가 달라지지 않게 border-2 는 공통 클래스에 깔고 색만 바꾼다) */
const CHIP_COLORS: Record<string, [string, string]> = {
  전체: ["bg-white text-ink-500 hover:bg-ink-100", "bg-ink-900 text-white"],

  // ─ 잉크 블루 ─ 프론트엔드의 뼈대
  React: ["bg-accent-soft text-accent-dim hover:bg-accent-soft/70", "bg-accent text-white"],
  TypeScript: ["bg-white text-accent-dim border-accent/40 hover:bg-accent-soft/50", "bg-accent-dim text-white"],

  // ─ 색연필 초록 ─ 데이터가 담기고 흐르는 것들
  상태관리: ["bg-duo-green-soft text-duo-green-ink hover:bg-duo-green-soft/70", "bg-duo-green-dim text-white"],
  데이터베이스: ["bg-white text-duo-green-ink border-duo-green/40 hover:bg-duo-green-soft/50", "bg-duo-green-ink text-white"],

  // ─ 연필 회갈색 ─ 컴퓨터 밑바닥(OS·자료구조)은 색을 안 쓴 "흑연" 느낌으로
  운영체제: ["bg-ink-100 text-ink-700 hover:bg-ink-200", "bg-ink-500 text-white"],
  자료구조: ["bg-white text-ink-700 border-ink-300 hover:bg-ink-100", "bg-ink-700 text-white"],

  // ─ 주황 색연필 ─ 바깥과 이어지는 것들
  네트워크: ["bg-duo-fox/10 text-duo-fox-ink hover:bg-duo-fox/20", "bg-duo-fox text-ink-900"],
  구조설계: ["bg-white text-duo-fox-ink border-duo-fox/40 hover:bg-duo-fox/10", "bg-duo-fox text-ink-900"],

  // ─ 노란 형광펜 ─ 자바 계열
  Java: ["bg-duo-bee/10 text-duo-bee-ink hover:bg-duo-bee/25", "bg-duo-bee-dim text-ink-900"],
  SpringBoot: ["bg-white text-duo-bee-ink border-duo-bee/50 hover:bg-duo-bee/10", "bg-duo-bee text-ink-900"],

  // ─ 빨간 펜 첨삭 ─ 개념(CS)과 말하기 훈련(기술면접)
  CS: ["bg-duo-red-soft text-duo-red-ink hover:bg-duo-red-soft/70", "bg-duo-red-dim text-white"],
  기술면접: ["bg-white text-duo-red-ink border-duo-red/40 hover:bg-duo-red-soft/50", "bg-duo-red-ink text-white"],
};

export function CategoryFilter() {
  const activeGroup = useStudyStore((s) => s.activeGroup);
  const activeCategory = useStudyStore((s) => s.activeCategory);
  const setGroup = useStudyStore((s) => s.setGroup);
  const setCategory = useStudyStore((s) => s.setCategory);

  // 보여줄 카테고리: 그룹 선택 시 그 그룹 것만, 아니면 전부.
  const visibleCategories: Category[] = activeGroup
    ? CATEGORY_GROUPS[activeGroup]
    : Object.values(CATEGORY_GROUPS).flat();

  const chips: Array<{ label: string; value: Category | null }> = [
    { label: "전체", value: null },
    ...visibleCategories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {/* ─── ① 그룹 탭 ─── */}
      <div
        className="flex gap-1 rounded-xl bg-white p-1 shadow-chip"
        role="tablist"
        aria-label="분야 그룹"
      >
        {GROUP_TABS.map((g) => {
          const isActive = activeGroup === g.value;
          return (
            <button
              key={g.label}
              role="tab"
              aria-selected={isActive}
              onClick={() => setGroup(g.value)}
              className={
                "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all " +
                (isActive
                  ? "bg-accent text-white shadow-chip"
                  : "text-ink-500 hover:bg-ink-100")
              }
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* ─── ② 카테고리 칩 ─── */}
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        role="tablist"
        aria-label="문제 카테고리"
      >
        {chips.map((it) => {
          const isActive = activeCategory === it.value;
          // 정의 안 된 카테고리가 추가돼도 깨지지 않게 기본값 fallback
          const [idle, on] = CHIP_COLORS[it.label] ?? CHIP_COLORS["전체"];
          return (
            <button
              key={it.label}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCategory(it.value)}
              className={
                "shrink-0 rounded-full border-2 border-transparent px-4 py-1.5 text-sm font-semibold shadow-chip transition-all active:scale-95 " +
                (isActive ? on : idle)
              }
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
