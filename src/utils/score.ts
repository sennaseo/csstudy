// =============================================================
// 세션 완료 화면(결과 분석)용 순수 함수
// - scoreOf: 정답률 계산 (0으로 나누기 방지)
// - tierOf: 정답률 구간 → 배지/색상 매핑
// - byCategory: 문제별 정오 배열 → 카테고리별 집계 (첫 등장 순서 유지)
// =============================================================

import type { Category } from "../types";
import { QUESTIONS } from "../data/questions";

export interface Tier {
  /** 배지·카드에 뜨는 문구 */
  label: string;
  /** 링과 숫자에 쓸 텍스트 색 클래스 */
  text: string;
  /** 알약 배지의 배경+글자색 클래스 */
  badge: string;
}

export interface CategoryScore {
  category: Category;
  correct: number;
  total: number;
}

/** qid → category 조회표 (모듈 로드 시 한 번만 생성). */
const CATEGORY_BY_QID = new Map(QUESTIONS.map((q) => [q.id, q.category]));

/** 정답률 0~100 정수. total 이 0이면 0 (NaN 방지). */
export function scoreOf(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/** 정답률 구간별 배지/색상. */
export function tierOf(pct: number): Tier {
  if (pct >= 90) {
    return { label: "최고예요!", text: "text-duo-green-ink", badge: "bg-duo-green-soft text-duo-green-ink" };
  }
  if (pct >= 70) {
    return { label: "좋아요", text: "text-accent", badge: "bg-accent-soft text-accent-dim" };
  }
  if (pct >= 50) {
    return { label: "조금만 더", text: "text-duo-bee-dim", badge: "bg-ink-100 text-duo-bee-dim" };
  }
  return { label: "다시 볼까요?", text: "text-duo-red-ink", badge: "bg-duo-red-soft text-duo-red-ink" };
}

/** 문제별 정오 배열을 카테고리별로 집계 (처음 등장한 순서 유지, 모르는 qid 는 무시). */
export function byCategory(answers: { qid: string; correct: boolean }[]): CategoryScore[] {
  const byCat = new Map<Category, CategoryScore>();
  for (const { qid, correct } of answers) {
    const category = CATEGORY_BY_QID.get(qid);
    if (!category) continue;
    let entry = byCat.get(category);
    if (!entry) {
      entry = { category, correct: 0, total: 0 };
      byCat.set(category, entry);
    }
    entry.total += 1;
    if (correct) entry.correct += 1;
  }
  return [...byCat.values()];
}
