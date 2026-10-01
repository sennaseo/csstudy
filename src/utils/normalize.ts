// =============================================================
// normalize — "정규화 실습"의 채점기(순수 함수 모음)
//
// 설계 메모
//   비유: 테이블은 "엑셀 시트", 함수 종속(FD)은 "이 칸을 알면 저 칸이 저절로
//   정해진다"는 규칙이다. (학번을 알면 이름이 정해진다 = 학번 → 이름)
//   사용자가 칼럼을 묶어 만든 "박스"는 시트를 가위로 오려 만든 작은 시트다.
//   여기 함수들은 그 작은 시트들이 (1) 다시 붙였을 때 원본이 되는지,
//   (2) 각자 얼마나 깔끔한지(정규형)를 계산한다.
//
//   칼럼이 많아야 5~6개라서 "부분집합을 전부 다 시험해보기"(전수 탐색)로 충분하다.
//   2^6 = 64 가지뿐이라 폰에서도 순식간이다. 영리한 알고리즘보다 읽기 쉬운 게 낫다.
//   (ponytail: 칼럼 15개를 넘기면 2^15 라 느려진다 — 그땐 최소 커버 기반 알고리즘으로.)
// =============================================================

export type Row = Record<string, string>;
/** 함수 종속: lhs(결정자)의 값을 알면 rhs 의 값이 정해진다. */
export type FD = { lhs: string[]; rhs: string[] };
export type NF = "1NF" | "2NF" | "3NF" | "BCNF";
export type Table = { cols: string[]; rows: Row[] };

const NF_ORDER: NF[] = ["1NF", "2NF", "3NF", "BCNF"];
/** a 가 b 이상(같거나 더 깔끔)인가 */
export const nfAtLeast = (a: NF, b: NF) => NF_ORDER.indexOf(a) >= NF_ORDER.indexOf(b);

const isSubset = (a: string[], b: Iterable<string>) => {
  const s = new Set(b);
  return a.every((x) => s.has(x));
};

/** 모든 부분집합(빈 집합 포함)을 작은 것부터. 원래 순서는 유지된다. */
export function subsets<T>(xs: T[]): T[][] {
  const out: T[][] = [[]];
  for (const x of xs) for (const s of out.slice()) out.push([...s, x]);
  return out.sort((a, b) => a.length - b.length);
}

/** 폐포(closure): attrs 를 알 때 규칙을 연쇄로 따라가 "알 수 있게 되는" 칼럼 전부.
 *  도미노처럼 — 학번을 알면 학과가 넘어지고, 학과가 넘어지면 학과사무실이 넘어진다. */
export function closure(attrs: Iterable<string>, fds: FD[]): Set<string> {
  const out = new Set(attrs);
  let changed = true;
  while (changed) {
    changed = false;
    for (const fd of fds) {
      if (!isSubset(fd.lhs, out)) continue;
      for (const b of fd.rhs) {
        if (!out.has(b)) {
          out.add(b);
          changed = true;
        }
      }
    }
  }
  return out;
}

/** 후보키: 박스의 모든 칼럼을 결정하는 "가장 작은" 칼럼 묶음들 (🔑).
 *  작은 부분집합부터 보니까, 이미 찾은 키를 품은 큰 묶음은 건너뛰면 최소성이 지켜진다. */
export function candidateKeys(box: string[], fds: FD[]): string[][] {
  const keys: string[][] = [];
  for (const s of subsets(box)) {
    if (s.length === 0) continue;
    if (keys.some((k) => isSubset(k, s))) continue;
    if (isSubset(box, closure(s, fds))) keys.push(s);
  }
  return keys;
}

/** 박스 안에서 성립하는 규칙(투영된 FD). X → A 를 "A 하나씩", 결정자는 가장 작은 것만 남긴다.
 *  (학번 → 이름 이 있으면 {학번, 과목코드} → 이름 은 군더더기라 빼는 것) */
export function projectFds(box: string[], fds: FD[]): FD[] {
  const out: FD[] = [];
  for (const X of subsets(box)) {
    if (X.length === 0) continue;
    const c = closure(X, fds);
    for (const a of box) {
      if (X.includes(a) || !c.has(a)) continue;
      if (out.some((f) => f.rhs[0] === a && isSubset(f.lhs, X))) continue;
      out.push({ lhs: X, rhs: [a] });
    }
  }
  return out;
}

export type ViolationKind = "partial" | "transitive" | "bcnf";
export type Violation = { fd: FD; kind: ViolationKind };

/** 박스 안의 "키가 아닌 결정자" 규칙들 = 중복과 이상현상의 원인.
 *  - partial    : 키의 일부만으로 결정됨 (부분 종속) → 2NF 위반
 *  - transitive : 키 아닌 칼럼을 거쳐 결정됨 (이행 종속) → 3NF 위반
 *  - bcnf       : 결정되는 쪽이 키의 일부라 3NF 는 봐주지만 BCNF 는 안 봐줌 */
export function violations(box: string[], fds: FD[]): Violation[] {
  const keys = candidateKeys(box, fds);
  const prime = new Set(keys.flat());
  const out: Violation[] = [];
  for (const fd of projectFds(box, fds)) {
    if (isSubset(box, closure(fd.lhs, fds))) continue; // 결정자가 슈퍼키면 문제 없음
    const kind: ViolationKind = prime.has(fd.rhs[0])
      ? "bcnf"
      : keys.some((k) => isSubset(fd.lhs, k))
        ? "partial"
        : "transitive";
    out.push({ fd, kind });
  }
  return out;
}

/** 정규형 판정 — 가장 심한 위반이 등급을 정한다. */
export function normalForm(box: string[], fds: FD[]): NF {
  const kinds = new Set(violations(box, fds).map((v) => v.kind));
  if (kinds.has("partial")) return "1NF";
  if (kinds.has("transitive")) return "2NF";
  if (kinds.has("bcnf")) return "3NF";
  return "BCNF";
}

/** 무손실 분해 판정 — chase(추적) 알고리즘.
 *  비유: 박스마다 "내가 아는 칸(a)"과 "모르는 칸(b)"이 적힌 줄을 하나씩 만든다.
 *  규칙(FD)으로 "이 두 줄은 lhs 가 같으니 rhs 도 같아야 해"를 반복 적용해 모르는 칸을 채운다.
 *  어떤 줄이 전부 a 로 채워지면 = 조각들을 붙여 원본 한 행을 정확히 되살릴 수 있다 = 무손실. */
export function isLossless(boxes: string[][], allAttrs: string[], fds: FD[]): boolean {
  const T = boxes.map((b, i) =>
    Object.fromEntries(allAttrs.map((a) => [a, b.includes(a) ? "a" : `b${i}`])) as Row
  );
  let changed = true;
  while (changed) {
    changed = false;
    for (const fd of fds) {
      for (const r of T) {
        for (const s of T) {
          if (r === s || !fd.lhs.every((a) => r[a] === s[a])) continue;
          for (const a of fd.rhs) {
            if (r[a] === s[a]) continue;
            // a(아는 칸)가 이긴다. 둘 다 b 면 아무거나 하나로 통일.
            const keep = r[a] === "a" || s[a] === "a" ? "a" : r[a];
            const drop = keep === r[a] ? s[a] : r[a];
            for (const t of T) if (t[a] === drop) t[a] = keep;
            changed = true;
          }
        }
      }
    }
  }
  return T.some((r) => allAttrs.every((a) => r[a] === "a"));
}

/** 각 규칙이 분해 뒤에도 "박스들 안에서" 검사 가능한지 (종속성 보존).
 *  Z 를 lhs 로 시작해, 박스마다 Z∩박스 의 폐포 중 그 박스 안 칼럼만 주워 담는다.
 *  rhs 까지 다 주워지면 그 규칙은 지켜진다. */
export function preservedFds(boxes: string[][], fds: FD[]): boolean[] {
  return fds.map((fd) => {
    const Z = new Set(fd.lhs);
    let changed = true;
    while (changed) {
      changed = false;
      for (const box of boxes) {
        const c = closure(box.filter((a) => Z.has(a)), fds);
        for (const a of box) {
          if (c.has(a) && !Z.has(a)) {
            Z.add(a);
            changed = true;
          }
        }
      }
    }
    return isSubset(fd.rhs, Z);
  });
}

const rowKey = (r: Row, cols: string[]) => JSON.stringify(cols.map((c) => r[c]));

/** 투영: 고른 칼럼만 남기고, 똑같아진 행은 하나로 합친다 (테이블은 "집합"이니까). */
export function project(rows: Row[], cols: string[]): Row[] {
  const seen = new Set<string>();
  const out: Row[] = [];
  for (const r of rows) {
    const k = rowKey(r, cols);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(Object.fromEntries(cols.map((c) => [c, r[c]])));
  }
  return out;
}

/** 자연 조인: 이름이 같은 칼럼의 값이 같은 행끼리 짝지어 붙인다.
 *  같은 칼럼이 하나도 없으면? 짝 조건이 없으니 "모든 조합"이 생긴다 (카티션 곱). */
export function naturalJoin(a: Table, b: Table): Table {
  const on = a.cols.filter((c) => b.cols.includes(c));
  const cols = [...a.cols, ...b.cols.filter((c) => !on.includes(c))];
  const rows: Row[] = [];
  for (const r of a.rows) for (const s of b.rows) if (on.every((c) => r[c] === s[c])) rows.push({ ...r, ...s });
  return { cols, rows };
}

export type JoinStep = { box: number; on: string[] };

/** 박스들을 차례로 붙인다. 다음 짝은 "지금까지 결과와 공통 칼럼이 있는 박스"를 먼저 고른다
 *  (사람이 손으로 붙일 때도 이어지는 조각부터 붙이니까). 없으면 어쩔 수 없이 카티션 곱. */
export function joinAll(tables: Table[]): { table: Table; steps: JoinStep[] } {
  if (tables.length === 0) return { table: { cols: [], rows: [] }, steps: [] };
  let acc = tables[0];
  const left = tables.map((_, i) => i).slice(1);
  const steps: JoinStep[] = [];
  while (left.length) {
    const pick = left.find((i) => tables[i].cols.some((c) => acc.cols.includes(c))) ?? left[0];
    left.splice(left.indexOf(pick), 1);
    steps.push({ box: pick, on: tables[pick].cols.filter((c) => acc.cols.includes(c)) });
    acc = naturalJoin(acc, tables[pick]);
  }
  return { table: acc, steps };
}

/** 조인 결과를 원본과 대조: 원본에 없는 행(가짜 행)과 사라진 원본 행. */
export function compareWithOriginal(original: Row[], joined: Table) {
  const orig = project(original, joined.cols);
  const origKeys = new Set(orig.map((r) => rowKey(r, joined.cols)));
  const joinKeys = new Set(joined.rows.map((r) => rowKey(r, joined.cols)));
  return {
    spurious: joined.rows.map((r) => !origKeys.has(rowKey(r, joined.cols))),
    missing: orig.filter((r) => !joinKeys.has(rowKey(r, joined.cols))),
  };
}

/** 하이라이트할 "중복 칸": 박스 안에서 키가 아닌 결정자 X → A 가 있을 때,
 *  같은 X 값을 가진 행이 2개 이상이면 그 행들의 X·A 칸은 같은 사실을 반복해 적고 있는 것.
 *  반환: "행번호:칼럼" 문자열 집합. */
export function redundantCells(rows: Row[], box: string[], fds: FD[]): Set<string> {
  const out = new Set<string>();
  for (const { fd } of violations(box, fds)) {
    const groups = new Map<string, number[]>();
    rows.forEach((r, i) => {
      const k = rowKey(r, fd.lhs);
      groups.set(k, [...(groups.get(k) ?? []), i]);
    });
    for (const idx of groups.values()) {
      if (idx.length < 2) continue;
      for (const i of idx) for (const c of [...fd.lhs, ...fd.rhs]) out.add(`${i}:${c}`);
    }
  }
  return out;
}
