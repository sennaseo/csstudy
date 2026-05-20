// =============================================================
// CategoryFilter
// - 카테고리 칩(chip) 가로 스크롤 영역.
// - "전체" 포함 — null = 전체.
// - 디자인 원칙: 색은 활성/비활성 2단계만. 다른 시각적 자극은 넣지 않는다.
// =============================================================

import { CATEGORIES } from "../data/questions";
import { useStudyStore } from "../store/useStudyStore";
import type { Category } from "../types";

export function CategoryFilter() {
  const active = useStudyStore((s) => s.activeCategory);
  const setCategory = useStudyStore((s) => s.setCategory);

  const items: Array<{ label: string; value: Category | null }> = [
    { label: "전체", value: null },
    ...CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
      role="tablist"
      aria-label="문제 카테고리"
    >
      {items.map((it) => {
        const isActive = active === it.value;
        return (
          <button
            key={it.label}
            role="tab"
            aria-selected={isActive}
            onClick={() => setCategory(it.value)}
            className={
              "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors " +
              (isActive
                ? "bg-accent text-ink-950"
                : "bg-ink-800 text-ink-300 hover:bg-ink-700")
            }
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
