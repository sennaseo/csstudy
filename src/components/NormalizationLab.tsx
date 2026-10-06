// =============================================================
// NormalizationLab (정규화 실습)
// - 실무 탭의 두 번째 판. 테이블을 "박스로 묶어" 쪼개고, 다시 JOIN 해서
//   원본이 그대로 돌아오는지 눈으로 확인하는 실험실.
// - 비유: 큰 엑셀 시트를 가위로 오려 작은 시트 여러 장으로 만드는 것.
//   잘 오리면 풀칠(JOIN)했을 때 원본이 그대로 나오고, 잘못 오리면
//   원본에 없던 줄(가짜 행)이 튀어나온다.
//
// 설계 메모
//   - 계산은 전부 utils/normalize.ts 의 순수 함수가 한다. 여기는 그리기만.
//   - 진도는 저장하지 않는다(스토어에 필드를 늘리지 않으려는 결정). 대신
//     App 이 이 컴포넌트를 hidden 으로만 숨겨서, 탭을 오가도 화면 상태는 남는다.
//   - 모바일 우선이라 드래그 대신 "칼럼 탭 → 박스로 묶기 버튼".
// =============================================================

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  NORMALIZATION_LESSONS,
  type AtomicLesson,
  type DecomposeLesson,
  type JoinLesson,
} from "../data/normalizationLessons";
import {
  candidateKeys,
  compareWithOriginal,
  isLossless,
  joinAll,
  naturalJoin,
  nfAtLeast,
  normalForm,
  preservedFds,
  project,
  redundantCells,
  violations,
  type FD,
  type Row,
  type ViolationKind,
} from "../utils/normalize";
import { Confetti } from "./Confetti";

const CARD = "rounded-2xl border border-ink-200 bg-white p-4";
const BTN = "btn-3d rounded-2xl border-2 border-b-4 px-4 py-2.5 text-sm font-extrabold";
const BTN_PRIMARY = BTN + " border-duo-green-dim bg-duo-green text-white hover:brightness-105";
const BTN_PLAIN = BTN + " border-ink-200 bg-white text-ink-700";

/** 조인 결과가 카티션 곱이면 수백 행이 될 수 있어 화면엔 앞부분만 그린다. */
const MAX_ROWS = 40;

const KIND_TEXT: Record<ViolationKind, string> = {
  partial: "키의 일부만으로 정해져요 (부분 종속)",
  transitive: "키가 아닌 칼럼을 거쳐 정해져요 (이행 종속)",
  bcnf: "결정자가 키가 아니에요 (BCNF 위반)",
};

export function NormalizationLab() {
  const [idx, setIdx] = useState(0);
  const lesson = NORMALIZATION_LESSONS[idx];
  const go = (i: number) => {
    setIdx(i);
    document.getElementById("root")?.scrollTo(0, 0);
  };
  const onNext = idx < NORMALIZATION_LESSONS.length - 1 ? () => go(idx + 1) : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* 스테이지 고르기 — 잠금 없이 아무 데나 갈 수 있다 (복습용) */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {NORMALIZATION_LESSONS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => go(i)}
            className={
              "shrink-0 rounded-full border-2 px-3 py-1 text-xs font-extrabold " +
              (i === idx ? "border-accent bg-accent-soft text-accent-dim" : "border-ink-200 bg-white text-ink-500")
            }
          >
            {l.emoji} {i}. {l.title.split(" · ")[0]}
          </button>
        ))}
      </div>

      <div className={CARD}>
        <h2 className="mb-2 text-base font-extrabold text-ink-900">
          {lesson.emoji} {lesson.title}
        </h2>
        {lesson.intro.map((p) => (
          <p key={p} className="mb-1.5 text-sm leading-relaxed text-ink-700 last:mb-0">
            {p}
          </p>
        ))}
      </div>

      {/* key 로 스테이지가 바뀌면 박스·선택 상태가 깨끗이 초기화된다 */}
      {lesson.kind === "join" && <JoinIntro key={lesson.id} lesson={lesson} onNext={onNext} />}
      {lesson.kind === "atomic" && <AtomicIntro key={lesson.id} lesson={lesson} onNext={onNext} />}
      {lesson.kind === "decompose" && <DecomposeLab key={lesson.id} lesson={lesson} onNext={onNext} />}
    </div>
  );
}

// ─── 공용 조각 ──────────────────────────────────────────────

/** 좁은 화면(360px)에서도 깨지지 않게 표는 항상 가로 스크롤 상자 안에 넣는다. */
function MiniTable({
  cols,
  rows,
  cellClass,
  rowClass,
  onRowClick,
  keyCols = [],
}: {
  cols: string[];
  rows: Row[];
  cellClass?: (i: number, c: string) => string;
  rowClass?: (i: number) => string;
  onRowClick?: (i: number) => void;
  keyCols?: string[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-ink-100">
            {cols.map((c) => (
              <th key={c} className="whitespace-nowrap border-b-2 border-ink-200 px-2 py-1.5 text-left font-extrabold text-ink-700">
                {keyCols.includes(c) && "🔑"}
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, MAX_ROWS).map((r, i) => (
            <tr
              key={i}
              onClick={onRowClick && (() => onRowClick(i))}
              className={(onRowClick ? "cursor-pointer " : "") + (rowClass?.(i) ?? "")}
            >
              {cols.map((c) => (
                <td key={c} className={"whitespace-nowrap border-t border-ink-100 px-2 py-1.5 text-ink-700 " + (cellClass?.(i, c) ?? "")}>
                  {r[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > MAX_ROWS && (
        <p className="px-2 py-1 text-xs text-ink-400">…외 {rows.length - MAX_ROWS}행 더</p>
      )}
    </div>
  );
}

const Chip = ({ c }: { c: string }) => (
  <span className="rounded-md border border-ink-300 bg-white px-1.5 py-0.5 text-xs font-bold text-ink-700">{c}</span>
);

/** 그림 속 "[학생번호][특강이름] → [교수]" — 결정자는 테두리 박스로 한 덩어리임을 보인다. */
function FdView({ fd }: { fd: FD }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="inline-flex gap-1 rounded-lg border-2 border-ink-900 bg-ink-100 p-1">
        {fd.lhs.map((c) => (
          <Chip key={c} c={c} />
        ))}
      </span>
      <span className="font-extrabold text-ink-500">→</span>
      {fd.rhs.map((c) => (
        <Chip key={c} c={c} />
      ))}
    </span>
  );
}

function NextButton({ onNext }: { onNext?: () => void }) {
  if (!onNext) return <p className="text-center text-sm font-bold text-duo-green-ink">🏁 마지막 스테이지까지 완주!</p>;
  return (
    <button type="button" onClick={onNext} className={BTN_PRIMARY + " w-full"}>
      다음 스테이지 →
    </button>
  );
}

// ─── 0. JOIN 감 잡기 ────────────────────────────────────────

function JoinIntro({ lesson, onNext }: { lesson: JoinLesson; onNext?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { left, right } = lesson;
  // 수강 → 학생 순서로 붙이면 결과 i번째 행 = 수강 i번째 행의 짝 (학번이 학생에서 유일하니까)
  const result = naturalJoin(right, left);
  const pickedId = picked === null ? null : right.rows[picked].학번;
  const lonely = left.rows.filter((s) => !right.rows.some((r) => r.학번 === s.학번));

  return (
    <div className={CARD + " flex flex-col gap-3"}>
      <p className="text-xs font-bold text-ink-500">👆 {right.name} 행을 탭해 보세요</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-extrabold text-ink-700">📋 {right.name}</p>
          <MiniTable
            cols={right.cols}
            rows={right.rows}
            onRowClick={setPicked}
            rowClass={(i) => (i === picked ? "bg-accent-soft" : "")}
          />
        </div>
        <div>
          <p className="mb-1 text-xs font-extrabold text-ink-700">🧑‍🎓 {left.name}</p>
          <MiniTable
            cols={left.cols}
            rows={left.rows}
            rowClass={(i) => (left.rows[i].학번 === pickedId ? "bg-accent-soft" : "")}
          />
        </div>
      </div>
      {pickedId && (
        <p className="text-sm text-ink-700">
          🔗 학번 <b className="text-accent">{pickedId}</b> 가 같아서 두 행이 한 줄로 붙어요.
        </p>
      )}
      <div>
        <p className="mb-1 text-xs font-extrabold text-ink-700">✨ JOIN 결과 (학번으로 연결)</p>
        <MiniTable cols={result.cols} rows={result.rows} rowClass={(i) => (i === picked ? "bg-accent-soft" : "")} />
      </div>
      {lonely.length > 0 && (
        <p className="text-xs leading-relaxed text-ink-500">
          💡 {lonely.map((s) => s.이름).join(", ")}은(는) 수강 기록이 없어서 결과에 없어요. 짝이 없으면 붙지 않아요
          (내부 조인, INNER JOIN).
        </p>
      )}
      <NextButton onNext={onNext} />
    </div>
  );
}

// ─── 1. 1NF 펼치기 ──────────────────────────────────────────

function AtomicIntro({ lesson, onNext }: { lesson: AtomicLesson; onNext?: () => void }) {
  const [flat, setFlat] = useState(false);
  const m = lesson.multiCol;
  const rows = flat
    ? lesson.rows.flatMap((r) => r[m].split(",").map((v) => ({ ...r, [m]: v.trim() })))
    : lesson.rows;

  return (
    <div className={CARD + " flex flex-col gap-3"}>
      <p className="text-xs font-extrabold text-ink-700">
        📋 {flat ? lesson.name.replace("펼치기 전", "펼친 뒤") : lesson.name} — {rows.length}행
      </p>
      <MiniTable
        cols={lesson.cols}
        rows={rows}
        keyCols={flat ? ["학번", m] : []}
        cellClass={(i, c) => (!flat && c === m && rows[i][m].includes(",") ? "bg-duo-bee/30" : "")}
      />
      {!flat && <p className="text-xs text-ink-500">노란 칸 = 한 칸에 값이 여러 개 (1NF 위반)</p>}
      <button type="button" onClick={() => setFlat(!flat)} className={BTN_PLAIN}>
        {flat ? "↩️ 되돌리기" : "🧺 값 펼치기"}
      </button>
      {flat && (
        <>
          <p className="text-sm leading-relaxed text-ink-700">{lesson.after}</p>
          <NextButton onNext={onNext} />
        </>
      )}
    </div>
  );
}

// ─── 2~4. 박스 치기 ─────────────────────────────────────────

function DecomposeLab({ lesson, onNext }: { lesson: DecomposeLesson; onNext?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [boxes, setBoxes] = useState<string[][]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [burst, setBurst] = useState(0);
  const { cols, rows, fds, target } = lesson;

  // 박스 안 칼럼 순서는 원본 순서로 맞춘다 (탭한 순서대로면 표가 매번 뒤죽박죽)
  const ordered = (xs: string[]) => cols.filter((c) => xs.includes(c));
  const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
  const isDup = boxes.some((b) => sameSet(b, selected));

  const toggle = (c: string) =>
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const addBox = () => {
    if (selected.length === 0 || isDup) return;
    setBoxes([...boxes, ordered(selected)]);
    setSelected([]);
  };

  const original = useMemo(
    () => ({ keys: candidateKeys(cols, fds), nf: normalForm(cols, fds), red: redundantCells(rows, cols, fds) }),
    [cols, rows, fds]
  );

  const analysis = useMemo(
    () =>
      boxes.map((box) => {
        const boxRows = project(rows, box);
        return {
          box,
          rows: boxRows,
          keys: candidateKeys(box, fds),
          nf: normalForm(box, fds),
          viol: violations(box, fds),
          red: redundantCells(boxRows, box, fds),
        };
      }),
    [boxes, rows, fds]
  );

  const join = useMemo(() => {
    if (boxes.length < 2) return null;
    const { table, steps } = joinAll(analysis.map((a) => ({ cols: a.box, rows: a.rows })));
    return { table, steps, ...compareWithOriginal(rows, table) };
  }, [analysis, boxes.length, rows]);

  const covered = boxes.length > 0 && cols.every((c) => boxes.some((b) => b.includes(c)));
  const lossless = boxes.length > 0 && isLossless(boxes, cols, fds);
  const preserved = preservedFds(boxes, fds);
  const allNF = boxes.length > 0 && analysis.every((a) => nfAtLeast(a.nf, target));
  const cleared = covered && lossless && allNF && (!lesson.requirePreserve || preserved.every(Boolean));

  // 클리어 순간에만 한 번 축하 (이후 박스를 만지다 다시 클리어하면 또 터진다)
  useEffect(() => {
    if (cleared) setBurst((b) => b + 1);
  }, [cleared]);

  const spuriousN = join ? join.spurious.filter(Boolean).length : 0;

  return (
    <>
      {/* 원본 + 규칙(FD) */}
      <div className={CARD + " flex flex-col gap-3"}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-extrabold text-ink-700">
            📋 원본: {lesson.name} — {rows.length}행
          </p>
          <NfBadge nf={original.nf} ok={nfAtLeast(original.nf, target)} />
        </div>
        <MiniTable
          cols={cols}
          rows={rows}
          keyCols={original.keys[0]}
          cellClass={(i, c) => (original.red.has(`${i}:${c}`) ? "bg-duo-bee/30" : "")}
        />
        <p className="text-xs text-ink-500">
          🔑 후보키: {original.keys.map((k) => `{${k.join(", ")}}`).join(" 또는 ")} · 노란 칸 = 같은 사실이 반복 적힌 곳
        </p>
        <div>
          <p className="mb-1.5 text-xs font-extrabold text-ink-700">📐 규칙 (함수 종속, FD) — 왼쪽을 알면 오른쪽이 정해진다</p>
          <div className="flex flex-col gap-1.5">
            {fds.map((fd, i) => (
              <FdView key={i} fd={fd} />
            ))}
          </div>
        </div>
      </div>

      {/* 박스 치기 */}
      <div className={CARD + " flex flex-col gap-3"}>
        <p className="text-sm font-extrabold text-ink-900">📦 박스 치기 — 칼럼을 탭해 고르고 묶어요</p>
        <div className="flex flex-wrap gap-2">
          {cols.map((c) => {
            const on = selected.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggle(c)}
                aria-pressed={on}
                className={
                  "rounded-xl border-2 px-3 py-1.5 text-sm font-bold " +
                  (on ? "border-accent bg-accent-soft text-accent-dim" : "border-ink-200 bg-white text-ink-700")
                }
              >
                {on ? "☑ " : ""}
                {c}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addBox}
            disabled={selected.length === 0 || isDup}
            className={BTN + " flex-1 border-accent-dim bg-accent text-white disabled:bg-ink-200 disabled:text-ink-500"}
          >
            {isDup ? "이미 있는 박스예요" : "📦 박스로 묶기"}
          </button>
          <button
            type="button"
            onClick={() => {
              setBoxes([]);
              setSelected([]);
            }}
            className={BTN_PLAIN}
          >
            초기화
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setHintCount((h) => Math.min(h + 1, lesson.hints.length))}
            disabled={hintCount >= lesson.hints.length}
            className={BTN_PLAIN + " flex-1 text-xs"}
          >
            💡 힌트 {hintCount}/{lesson.hints.length}
          </button>
          <button
            type="button"
            onClick={() => {
              setBoxes(lesson.answer);
              setSelected([]);
            }}
            className={BTN_PLAIN + " flex-1 text-xs"}
          >
            👀 정답 보기
          </button>
        </div>
        {lesson.hints.slice(0, hintCount).map((h, i) => (
          <p key={i} className="rounded-xl bg-duo-bee/20 px-3 py-2 text-sm leading-relaxed text-ink-700">
            💡 {h}
          </p>
        ))}
      </div>

      {/* 박스들 */}
      {analysis.map((a, i) => (
        <div key={a.box.join("|")} className={CARD + " flex flex-col gap-2"}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-ink-900">
              박스 {i + 1}{" "}
              <span className="font-round text-xs font-bold text-ink-500">
                {rows.length}행 → {a.rows.length}행
              </span>
            </p>
            <div className="flex items-center gap-2">
              <NfBadge nf={a.nf} ok={nfAtLeast(a.nf, target)} />
              <button
                type="button"
                aria-label={`박스 ${i + 1} 삭제`}
                onClick={() => setBoxes(boxes.filter((_, j) => j !== i))}
                className="rounded-full px-2 text-lg leading-none text-ink-400 hover:text-duo-red"
              >
                ✕
              </button>
            </div>
          </div>
          <MiniTable
            cols={a.box}
            rows={a.rows}
            keyCols={a.keys[0]}
            cellClass={(r, c) => (a.red.has(`${r}:${c}`) ? "bg-duo-bee/30" : "")}
          />
          <p className="text-xs text-ink-500">🔑 후보키: {a.keys.map((k) => `{${k.join(", ")}}`).join(" 또는 ")}</p>
          {a.viol.map((v, j) => (
            <p key={j} className="text-xs leading-relaxed text-duo-red-ink">
              ⚠️ {v.fd.lhs.join(", ")} → {v.fd.rhs.join(", ")} : {KIND_TEXT[v.kind]}
            </p>
          ))}
        </div>
      ))}

      {/* 다시 JOIN */}
      {join && (
        <div className={CARD + " flex flex-col gap-2"}>
          <p className="text-sm font-extrabold text-ink-900">🔗 다시 JOIN 해보기</p>
          <ol className="flex flex-col gap-1 text-xs text-ink-700">
            <li>① 박스 1 에서 시작</li>
            {join.steps.map((s, k) => (
              <li key={k} className={s.on.length ? "" : "font-bold text-duo-red-ink"}>
                {"②③④⑤⑥⑦⑧⑨"[k] ?? "·"} 박스 {s.box + 1} 붙이기 —{" "}
                {s.on.length
                  ? `${s.on.join(", ")}(으)로 연결`
                  : "⚠️ 공통 칼럼이 없어요 → 모든 조합이 생김 (카티션 곱)"}
              </li>
            ))}
          </ol>
          <p className="text-xs font-bold text-ink-700">
            원본 {rows.length}행 → 조인 결과 {join.table.rows.length}행
            {spuriousN > 0 && <span className="text-duo-red-ink"> (가짜 행 {spuriousN}개!)</span>}
          </p>
          <MiniTable
            cols={join.table.cols}
            rows={join.table.rows}
            rowClass={(r) => (join.spurious[r] ? "bg-duo-red-soft" : "")}
            cellClass={(r) => (join.spurious[r] ? "text-duo-red-ink font-bold" : "")}
          />
          {spuriousN > 0 && (
            <p className="text-xs leading-relaxed text-duo-red-ink">
              🟥 빨간 줄 = 원본에 없던 가짜 행 (spurious tuple). 연결 칼럼이 행을 하나로 콕 집어주지 못해서 엉뚱한 짝이 붙었어요.
            </p>
          )}
          {join.missing.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-bold text-duo-red-ink">🕳️ 조인 결과에서 사라진 원본 행</p>
              <MiniTable cols={join.table.cols} rows={join.missing} />
            </div>
          )}
        </div>
      )}

      {/* 판정 체크리스트 */}
      {boxes.length > 0 && (
        <div className={CARD + " flex flex-col gap-2 text-sm text-ink-700"}>
          <p className="font-extrabold text-ink-900">📝 판정</p>
          <Check ok={covered}>① 모든 칼럼이 어딘가의 박스에 있음</Check>
          <Check ok={lossless}>
            ② 다시 붙이면 원본 그대로 (무손실 분해)
            <span className="block text-xs text-ink-500">
              이론 판정(chase): {lossless ? "무손실" : "손실"} · 데이터 조인:{" "}
              {join ? (spuriousN > 0 ? `가짜 행 ${spuriousN}개` : "가짜 행 없음") : "박스가 하나라 조인할 게 없음"}
            </span>
          </Check>
          <div>
            <p className={lesson.requirePreserve && !preserved.every(Boolean) ? "font-bold" : ""}>
              ③ 규칙이 한 박스 안에서 검사됨 (종속성 보존){lesson.requirePreserve ? "" : " — 이 스테이지는 경고만"}
            </p>
            <ul className="mt-1 flex flex-col gap-1 pl-2">
              {fds.map((fd, i) => (
                <li key={i} className="flex flex-wrap items-center gap-1.5 text-xs">
                  {preserved[i] ? "✅" : "⚠️"} <FdView fd={fd} />
                  {!preserved[i] && <span className="text-duo-fox-ink">이 규칙은 이제 한 테이블 안에서 검사 못 함</span>}
                </li>
              ))}
            </ul>
          </div>
          <Check ok={allNF}>④ 모든 박스가 {target} 이상</Check>
        </div>
      )}

      {cleared && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-duo-green-dim bg-duo-green-soft p-4">
          <Confetti burstId={burst} />
          <p className="mb-1 text-base font-extrabold text-duo-green-ink">🎉 스테이지 클리어!</p>
          <p className="mb-3 text-sm leading-relaxed text-ink-700">{lesson.outro}</p>
          <NextButton onNext={onNext} />
        </div>
      )}
    </>
  );
}

function Check({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <span>{ok ? "✅" : "❌"}</span>
      <div>{children}</div>
    </div>
  );
}

function NfBadge({ nf, ok }: { nf: string; ok: boolean }) {
  return (
    <span
      className={
        "shrink-0 rounded-full border-2 px-2 py-0.5 font-round text-xs font-extrabold " +
        (ok ? "border-duo-green-dim bg-duo-green-soft text-duo-green-ink" : "border-duo-red-dim bg-duo-red-soft text-duo-red-ink")
      }
    >
      {nf}
    </span>
  );
}
