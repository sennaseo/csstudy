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
 *  비활성은 옅은 파스텔, 활성은 진한 단색 + 흰 글자. */
const CHIP_COLORS: Record<string, [string, string]> = {
  전체: ["bg-white text-ink-500 hover:bg-ink-100", "bg-ink-900 text-white"],
  CS: ["bg-sky-50 text-sky-600 hover:bg-sky-100", "bg-sky-500 text-white"],
  React: ["bg-cyan-50 text-cyan-600 hover:bg-cyan-100", "bg-cyan-500 text-white"],
  TypeScript: ["bg-blue-50 text-blue-600 hover:bg-blue-100", "bg-blue-500 text-white"],
  구조설계: ["bg-amber-50 text-amber-600 hover:bg-amber-100", "bg-amber-500 text-white"],
  Java: ["bg-orange-50 text-orange-600 hover:bg-orange-100", "bg-orange-500 text-white"],
  SpringBoot: ["bg-emerald-50 text-emerald-600 hover:bg-emerald-100", "bg-emerald-500 text-white"],
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
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold shadow-chip transition-all active:scale-95 " +
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
