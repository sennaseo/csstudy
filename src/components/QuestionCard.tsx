// =============================================================
// QuestionCard — 듀오링고식 퀴즈 카드 (다양한 출제 유형판)
//
// 구조 (초보자용 설명):
// - 스토어의 exercise.type 을 보고 유형별 서브 컴포넌트를 골라 렌더링한다.
//   (switch 하나로 분기 — discriminated union 덕분에 타입이 자동으로 좁혀짐)
// - 모든 유형은 채점 순간에 부모가 준 onGrade(correct) 하나만 부른다.
//   → 콤보/하트/사운드/컨페티 로직은 부모에 한 곳만 존재 (중복 제거).
// - 유형별 로컬 상태(고른 단어, 입력값 등)는 <article key={q.id}> 덕분에
//   문제가 바뀔 때 자동으로 리셋된다 (key 가 바뀌면 React 가 새로 마운트).
//
// 🔵 "선택 → 확인" 2단계 플로우 (듀오링고의 핵심 UX)
//   예전엔 보기를 탭하는 순간 바로 채점됐다. 지금은 두 걸음으로 나뉜다:
//     1걸음 = 탭 → "고르기"만 (파란 테두리로 표시, 다시 탭해서 바꿔도 됨)
//     2걸음 = 하단 고정 "확인" 버튼 → 그제서야 채점
//   왜 이렇게? 실수로 눌러서 목숨(하트)이 날아가는 억울함을 없애고,
//   "내가 답을 확정한다"는 통제감을 주기 때문이다.
//
//   구현 요령: 스토어는 손대지 않고 이 파일의 로컬 state(selected) 하나로 처리한다.
//   선택값은 여기(부모)에 두고, 각 유형 컴포넌트에는 값과 "고르는 함수"만 내려준다.
//   확인 버튼을 누르면 그때 기존 handleGrade(...) 를 부른다 → 채점 로직은 그대로.
//
// 📱 레이아웃: 화면 전체 높이를 세로로 3등분한다.
//   [본문(스크롤됨)] + [하단 고정 footer(확인 버튼 / 채점 후엔 피드백 시트)]
//   footer 가 본문을 가리지 않도록 본문 아래에 넉넉한 padding 을 준다.
//
// - 키보드 단축키: 1~4 = 보기 "선택", O/X = 선택, Enter = 확인(또는 계속).
// =============================================================

import { Fragment, useState, useEffect, useRef } from "react";
import { useStudyStore } from "../store/useStudyStore";
import type {
  BlankExercise,
  ChoiceExercise,
  MatchExercise,
  OxExercise,
  Question,
  TypingExercise,
} from "../types";
import { CATEGORY_EMOJI } from "../data/questions";
import { findCharacter, stageOf } from "../data/characters";
import { gradeTyping, shuffle } from "../utils/exercise";
import { Confetti } from "./Confetti";
import { playSound, isMuted, toggleMute, vibrate } from "../utils/sound";

// ─── XP 표시값 — 스토어의 XP_BY_STATUS 와 같은 값을 쓴다 ───
// ⚠️ 스토어의 XP_BY_STATUS 가 export 가 아니라서 지금은 여기 상수로 둔다.
//    (원래는 import 해서 단일 소스로 만드는 게 맞다 — 총괄 판단 대기 중)
//    화면에 찍는 숫자를 여기 한 곳에서만 만들어, 최소한 "+12" 하드코딩이
//    여러 군데 흩어지는 일은 막는다.
const XP_UNDERSTOOD = 12;
const XP_FUZZY = 7;
const XP_UNKNOWN = 4;
/** 지금 이 채점 결과로 실제 기록될 XP. (정답+"몰랐어요" = fuzzy) */
const xpFor = (correct: boolean, unsure: boolean) =>
  !correct ? XP_UNKNOWN : unsure ? XP_FUZZY : XP_UNDERSTOOD;

// ─── 버디 말풍선 대사 — 문제 id 로 정해지는 랜덤(리렌더에도 안 바뀜) ───
const CHEER_IDLE = ["이건 알 것 같은데?", "천천히 읽어봐!", "집중 집중!", "골라볼까?"];
const CHEER_RIGHT = ["완벽해! 🎉", "그거지!!", "역시 천재야!", "찰떡같이 맞혔어!"];
const CHEER_WRONG = ["괜찮아, 다시 보면 돼", "오답도 공부야!", "해설 읽고 가자!", "다음엔 맞힐 수 있어"];

/** 문자열 → 안정적인 인덱스 (같은 문제면 같은 대사). */
function pickLine(lines: string[], seed: string): string {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return lines[h % lines.length];
}

/** 퀴즈 화면에 서 있는 버디 — 채점 결과에 따라 말이 바뀐다. */
function QuizBuddy({ qid, graded, correct }: { qid: string; graded: boolean; correct: boolean }) {
  const activeBuddyId = useStudyStore((s) => s.activeBuddyId);
  const buddies = useStudyStore((s) => s.buddies);

  const character = activeBuddyId ? findCharacter(activeBuddyId) : undefined;
  const record = activeBuddyId ? buddies[activeBuddyId] : undefined;
  if (!character || !record) return null; // 아직 버디가 없으면 조용히 생략

  const art = character.stages[stageOf(record.xp) - 1].art;
  const line = !graded
    ? pickLine(CHEER_IDLE, qid)
    : correct
    ? pickLine(CHEER_RIGHT, qid + "o")
    : pickLine(CHEER_WRONG, qid + "x");

  return (
    <div className="flex items-center gap-3 px-1">
      <pre
        className={
          "shrink-0 text-center font-mono text-sm leading-snug text-ink-900 " +
          (graded && correct ? "animate-bob" : "")
        }
      >
        {art.join("\n")}
      </pre>
      <div
        key={line} /* 대사가 바뀔 때마다 pop 애니메이션 재생 */
        className={
          "buddy-bubble animate-pop rounded-2xl border-2 border-ink-200 bg-white px-3.5 py-2 text-sm font-bold " +
          (!graded ? "text-ink-700" : correct ? "text-duo-green-ink" : "text-duo-red-ink")
        }
      >
        {line}
      </div>
    </div>
  );
}

// ─── 유형 공통: 스타일 헬퍼 ─────────────────────────────────

/** 답안 카드의 5단 상태 스타일 (리서치 스펙 5절).
 *  대기 / 선택 / 정답 / 내가 고른 오답 / 나머지(dim)
 *
 *  border-2 border-b-4 조합이 핵심이다:
 *  옆·위는 2px 얇은 선, 아래만 4px 두껍게 → "카드에 두께가 있다"는 착시.
 *  (.btn-3d 는 border-bottom-width 를 4px 로 강제하지만, border-2 를 함께 쓰면
 *   Tailwind 쪽이 이겨서 2px 가 될 수 있으므로 border-b-4 를 명시해준다.) */
// break-keep = 한국어를 단어(어절) 단위로만 줄바꿈. 없으면 "…이다/다" 처럼
// 한 글자만 둘째 줄로 떨어지는 고아 줄바꿈이 생긴다.
// 패딩·글자를 조금 줄여 360px 에서 대부분의 보기가 1줄에 들어가게 했다.
const BTN_BASE =
  "btn-3d w-full break-keep rounded-2xl px-2.5 py-2.5 text-left text-[13px] font-semibold leading-snug transition-colors ";
const BTN_IDLE =
  BTN_BASE + "border-2 border-b-4 border-ink-200 bg-white text-ink-700 hover:bg-ink-100";
/** 선택됨 — Macaw 파랑 테두리 + 아주 옅은 파란 틴트. 아직 채점 전이라는 신호. */
const BTN_PICKED =
  BTN_BASE + "border-2 border-b-4 border-accent bg-accent-soft text-accent-dim";
const BTN_RIGHT =
  BTN_BASE + "border-2 border-b-4 border-duo-green-dim bg-duo-green-soft text-duo-green-ink";
const BTN_WRONG =
  BTN_BASE + "border-2 border-b-4 border-duo-red-dim bg-duo-red-soft text-duo-red-ink";
const BTN_DIM = BTN_BASE + "border-2 border-b-4 border-ink-200 bg-white text-ink-400 opacity-60";

/** 유형별 상단 안내 문구. */
const PROMPT_BY_TYPE: Record<string, string> = {
  choice: "맞는 설명을 골라보세요",
  blank: "빈칸에 들어갈 말을 골라보세요",
  ox: "이 설명이 맞으면 O, 틀리면 X!",
  typing: "빈칸의 용어를 직접 입력해보세요",
  speak: "소리 내어(또는 머릿속으로) 설명해보세요",
  match: "질문과 설명을 짝지어 연결해보세요",
};

/** 하단 키보드 단축키 안내 — 2단계 유형(확인 버튼이 있는 유형)에서만 쓴다.
 *  예전엔 객관식 숫자만 버튼 안에 숨어 있고 OX 의 o/x 는 안내가 아예 없었다. */
const KEY_HINT_BY_TYPE: Record<string, string> = {
  choice: "⌨️ 숫자키 1~4 로 고르고 · Enter 로 확인",
  blank: "⌨️ 숫자키로 단어를 고르고 · Enter 로 확인",
  ox: "⌨️ O / X 키로 고르고 · Enter 로 확인",
};

/** 자체 제출 버튼이 있는 유형(typing/speak/match)의 하단 한 줄.
 *  "위에서 답을 제출해주세요" 같은 빈 안내 대신, 그 유형에서 진짜 필요한 팁을 준다. */
const SUBMIT_HINT_BY_TYPE: Record<string, string> = {
  typing: "⌨️ 입력하고 Enter — 오타 1글자는 정답으로 봐줘요",
  speak: "🎤 입으로 설명해본 뒤 정답을 열어 비교해요",
  match: "🔗 4쌍을 모두 연결하면 자동으로 채점돼요",
};

// ─── ① 객관식 ──────────────────────────────────────────────
// 탭 = 선택만. 채점은 부모의 "확인" 버튼이 한다.

function ChoiceView({
  ex,
  picked,
  onPick,
  onGiveUp,
}: {
  ex: ChoiceExercise;
  /** 지금 고른 보기의 qid (아직 안 골랐으면 null) */
  picked: string | null;
  onPick: (qid: string) => void;
  /** "모르겠어요" — 즉시 오답 처리. */
  onGiveUp: () => void;
}) {
  const graded = useStudyStore((s) => s.graded);
  const selectedQid = useStudyStore((s) => s.selectedQid);

  const cls = (c: { qid: string; correct: boolean }) => {
    if (!graded) return c.qid === picked ? BTN_PICKED : BTN_IDLE;
    if (c.correct) return BTN_RIGHT;
    if (c.qid === selectedQid) return BTN_WRONG;
    return BTN_DIM;
  };

  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="보기 목록">
      {ex.choices.map((c, i) => (
        <button
          key={c.qid}
          onClick={() => !graded && onPick(c.qid)}
          disabled={graded}
          // 색만으로 선택 상태를 알리면 스크린리더 사용자는 알 수 없다 → radio 시맨틱.
          role="radio"
          aria-checked={c.qid === picked}
          className={cls(c)}
        >
          {/* 번호 배지 = 1~4 단축키 힌트. 물리 키보드가 있는 sm 이상에서만 보인다.
              좁은 폰에서는 배지 폭(≈25px)이 첫 줄을 잘라먹어 요약문이 2줄로
              넘어가는 원인이었는데, 정작 모바일엔 누를 숫자키도 없다. */}
          <span className="mr-2 hidden rounded-md border border-current px-1.5 py-0.5 font-round text-[10px] font-bold opacity-60 sm:inline-block">
            {i + 1}
          </span>
          {c.text}
          {graded && c.correct && <span className="ml-1.5">✓</span>}
          {graded && !c.correct && c.qid === selectedQid && <span className="ml-1.5">✕</span>}
        </button>
      ))}

      {/* 보기 목록과 분리된 "모르겠어요" — 찍기를 강요하지 않는 탈출구.
          보기 배열에 5번째로 끼워넣지 않는 이유: 채점이 'qid === 문제 id' 라
          가짜 qid 를 넣으면 채점·숫자 단축키가 다 꼬인다.
          누르면 바로 오답 처리 → 해설을 보고 넘어간다. */}
      {!graded && (
        <button
          onClick={onGiveUp}
          className="mt-1 self-center rounded-xl px-4 py-2 text-sm font-extrabold text-ink-500 underline decoration-ink-300 underline-offset-4 hover:text-ink-700"
        >
          모르겠어요
        </button>
      )}
    </div>
  );
}

// ─── ② 빈칸 채우기 ─────────────────────────────────────────

function BlankView({
  ex,
  picked,
  onPick,
}: {
  ex: BlankExercise;
  /** 지금 고른 단어 (아직 안 골랐으면 null) */
  picked: string | null;
  onPick: (word: string) => void;
}) {
  const graded = useStudyStore((s) => s.graded);

  // 빈칸 표시: 안 골랐으면 밑줄, 골랐으면 그 단어를 넣어서 문장을 미리 읽어볼 수 있게.
  // 채점 전엔 파란 틴트(=가안), 채점 후엔 초록/빨강(=결과)으로 색이 바뀐다.
  const blankEl = !picked ? (
    <span className="mx-1 inline-block min-w-[72px] border-b-4 border-dashed border-accent align-baseline">
      &nbsp;
    </span>
  ) : (
    <span
      className={
        "mx-1 rounded-lg px-2 py-0.5 font-extrabold " +
        (!graded
          ? "bg-accent-soft text-accent-dim"
          : picked === ex.answer
          ? "bg-duo-green-soft text-duo-green-ink"
          : "bg-duo-red-soft text-duo-red-ink line-through")
      }
    >
      {picked}
    </span>
  );

  const wordCls = (w: string) => {
    if (!graded) return (w === picked ? BTN_PICKED : BTN_IDLE) + " !w-auto";
    if (w === ex.answer) return BTN_RIGHT + " !w-auto";
    if (w === picked) return BTN_WRONG + " !w-auto";
    return BTN_DIM + " !w-auto";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-white px-5 py-5 text-[15px] font-semibold leading-relaxed text-ink-900 shadow-card">
        {ex.before}
        {blankEl}
        {ex.after}
        {/* 틀렸을 때 정답 단어를 한 번 더 보여준다 */}
        {graded && picked !== ex.answer && (
          <p className="mt-2 text-sm font-bold text-duo-green-ink">정답: {ex.answer}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="단어 은행">
        {ex.bank.map((w, i) => (
          <button
            key={w}
            onClick={() => !graded && onPick(w)}
            disabled={graded}
            role="radio"
            aria-checked={w === picked}
            className={wordCls(w)}
          >
            <span className="mr-1.5 inline-block rounded-md border border-current px-1.5 py-0.5 font-round text-[10px] font-bold opacity-60">
              {i + 1}
            </span>
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ③ OX 퀴즈 ─────────────────────────────────────────────

function OxView({
  ex,
  picked,
  onPick,
}: {
  ex: OxExercise;
  /** 내가 고른 O(true)/X(false), 아직이면 null */
  picked: boolean | null;
  onPick: (saidTrue: boolean) => void;
}) {
  const graded = useStudyStore((s) => s.graded);

  const btnCls = (isO: boolean) => {
    const base =
      "btn-3d flex-1 rounded-2xl border-2 border-b-4 py-6 text-center text-4xl font-extrabold transition-colors ";
    if (!graded) {
      if (picked === isO) return base + "border-accent bg-accent-soft text-accent-dim";
      return base + "border-ink-200 bg-white text-ink-700 hover:bg-ink-100";
    }
    // 채점 후: 정답 쪽은 초록, 내가 고른 오답은 빨강, 나머지는 흐리게
    if (isO === ex.isTrue) return base + "border-duo-green-dim bg-duo-green-soft text-duo-green-ink";
    if (picked === isO) return base + "border-duo-red-dim bg-duo-red-soft text-duo-red-ink";
    return base + "border-ink-200 bg-white text-ink-400 opacity-60";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-white px-5 py-5 text-[15px] font-semibold leading-relaxed text-ink-900 shadow-card">
        💬 {ex.statement}
      </div>
      <div className="flex gap-3" role="radiogroup" aria-label="맞으면 O, 틀리면 X">
        <button
          onClick={() => !graded && onPick(true)}
          disabled={graded}
          role="radio"
          aria-checked={picked === true}
          aria-label="맞아요 (O)"
          className={btnCls(true)}
        >
          O
        </button>
        <button
          onClick={() => !graded && onPick(false)}
          disabled={graded}
          role="radio"
          aria-checked={picked === false}
          aria-label="틀려요 (X)"
          className={btnCls(false)}
        >
          X
        </button>
      </div>
    </div>
  );
}

// ─── ④ 직접 타이핑 ─────────────────────────────────────────
// 이 유형은 입력창 옆에 자체 "확인" 버튼이 있으므로 2단계 플로우를 따로 만들 필요가 없다.
// (입력 자체가 이미 "선택"이고, 버튼이 "확인"이다.)

function TypingView({
  ex,
  onGrade,
}: {
  ex: TypingExercise;
  onGrade: (correct: boolean) => void;
}) {
  const graded = useStudyStore((s) => s.graded);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const submit = () => {
    if (graded || input.trim() === "") return;
    onGrade(gradeTyping(input, ex.answer));
  };

  const correct = graded && gradeTyping(input, ex.answer);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-white px-5 py-5 text-[15px] font-semibold leading-relaxed text-ink-900 shadow-card">
        {ex.before}
        <span
          className={
            "mx-1 inline-block rounded-lg px-2 py-0.5 font-extrabold " +
            (!graded
              ? "border-b-4 border-dashed border-accent"
              : correct
              ? "bg-duo-green-soft text-duo-green-ink"
              : "bg-duo-red-soft text-duo-red-ink")
          }
        >
          {graded ? input : "?"}
        </span>
        {ex.after}
        {graded && !correct && (
          <p className="mt-2 text-sm font-bold text-duo-green-ink">정답: {ex.answer}</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation(); // 전역 Enter(확인/계속)와 충돌 방지
              submit();
            }
          }}
          disabled={graded}
          placeholder="용어를 입력하세요 (오타 1글자는 봐줘요)"
          className="w-full rounded-2xl border-2 border-ink-200 bg-white px-4 py-3.5 text-sm font-semibold text-ink-900 outline-none transition-colors focus:border-accent disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={graded || input.trim() === ""}
          className={
            "btn-3d shrink-0 rounded-2xl border-2 border-b-4 px-5 text-sm font-extrabold tracking-wide " +
            // 비활성은 opacity 가 아니라 "진짜 회색"으로 갈아끼운다 (듀오링고 규칙).
            (graded || input.trim() === ""
              ? "border-ink-300 bg-ink-200 text-ink-400"
              : "border-duo-green-dim bg-duo-green text-white hover:brightness-105")
          }
        >
          확인
        </button>
      </div>
    </div>
  );
}

// ─── ⑤ 말하기 (셀프 설명) ──────────────────────────────────

function SpeakView({ q, onGrade }: { q: Question; onGrade: (correct: boolean) => void }) {
  const graded = useStudyStore((s) => s.graded);
  const [revealed, setRevealed] = useState(false); // 정답을 열어봤는지

  if (graded) return null; // 채점 후에는 하단 피드백 시트가 정답을 보여준다

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-dashed border-accent bg-accent-soft px-5 py-5 text-sm font-semibold leading-relaxed text-ink-700">
        🎤 면접이라고 생각하고 <b>입으로 소리 내어</b> 설명해보세요.
        <br />
        말로 설명이 되면 진짜 아는 것! 다 말했으면 정답을 열어 비교해요.
      </div>

      {!revealed ? (
        <button
          onClick={() => {
            playSound("click");
            setRevealed(true);
          }}
          className="btn-3d w-full rounded-2xl border-2 border-b-4 border-accent-dim bg-accent px-4 py-3.5 text-sm font-extrabold tracking-wide text-white hover:brightness-105"
        >
          다 말했어요 — 정답 확인 🔍
        </button>
      ) : (
        <>
          <div className="rounded-2xl bg-white px-5 py-5 text-sm font-semibold leading-relaxed text-ink-700 shadow-card">
            {q.answer}
          </div>
          <p className="text-center text-xs font-bold text-ink-500">
            내 설명, 핵심을 짚었나요? (솔직하게! 그래야 복습 큐가 똑똑해져요)
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onGrade(true)}
              className="btn-3d flex-1 rounded-2xl border-2 border-b-4 border-duo-green-dim bg-duo-green py-3.5 text-sm font-extrabold text-white hover:brightness-105"
            >
              😎 맞게 설명했어요
            </button>
            <button
              onClick={() => onGrade(false)}
              className="btn-3d flex-1 rounded-2xl border-2 border-b-4 border-duo-red-dim bg-duo-red py-3.5 text-sm font-extrabold text-white hover:brightness-105"
            >
              😅 아직 헷갈려요
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── ⑥ 선 연결하기 (매칭) ──────────────────────────────────

function MatchView({ ex, onGrade }: { ex: MatchExercise; onGrade: (correct: boolean) => void }) {
  const graded = useStudyStore((s) => s.graded);
  // 좌(질문)/우(설명)를 서로 다른 순서로 섞는다 — 첫 렌더에만 (lazy init).
  const [left] = useState(() => shuffle(ex.pairs));
  const [right] = useState(() => shuffle(ex.pairs));
  const [pickedLeft, setPickedLeft] = useState<string | null>(null); // 고른 왼쪽 qid
  const [matched, setMatched] = useState<Set<string>>(new Set()); // 완성된 qid 들
  const [wrongFlash, setWrongFlash] = useState<string | null>(null); // 방금 틀린 우측 qid
  // ref 가 아니라 state 다 — ref 를 바꿔도 React 는 다시 그리지 않아서
  // "실수 N번" 문구가 다음 리렌더까지 옛날 숫자로 남아 있었다.
  const [mistakes, setMistakes] = useState(0);

  const pickRight = (qid: string) => {
    if (graded || !pickedLeft || matched.has(qid)) return;
    if (qid === pickedLeft) {
      // 짝 완성!
      playSound("click");
      const next = new Set(matched);
      next.add(qid);
      setMatched(next);
      setPickedLeft(null);
      // 전부 연결 → 실수 없이 끝냈을 때만 정답 처리
      if (next.size === ex.pairs.length) onGrade(mistakes === 0);
    } else {
      setMistakes((m) => m + 1);
      vibrate([60, 40, 60]);
      setWrongFlash(qid);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  const sideCls = (qid: string, isPicked: boolean, isWrong: boolean) => {
    // h-full = 같은 행의 좌/우가 그 행에서 제일 높은 쪽에 맞춰 늘어난다.
    // (예전엔 좌우가 따로 노는 flex 열이라 3줄짜리 카드 하나가 아래 행 전체를 밀어냈다.)
    // 글자는 11px → 12px 이상(text-xs). 손글씨 폰트라 11px 은 읽기 어렵다.
    const base =
      "h-full w-full break-keep rounded-xl border-2 px-2 py-2 text-left text-xs font-semibold leading-snug transition-all sm:px-3 sm:py-2.5 sm:text-[13px] ";
    if (matched.has(qid))
      return base + "border-duo-green-dim bg-duo-green-soft text-duo-green-ink opacity-70";
    if (isWrong) return base + "animate-shake border-duo-red-dim bg-duo-red-soft text-duo-red-ink";
    if (isPicked) return base + "border-accent bg-accent-soft text-accent-dim";
    return base + "border-ink-200 bg-white text-ink-700 hover:bg-ink-100";
  };

  return (
    <div className="flex flex-col gap-3">
      {mistakes > 0 && !graded && (
        <p className="text-center text-xs font-bold text-duo-red-ink" aria-live="polite">
          앗, 실수 {mistakes}번 — 그래도 끝까지 연결해보자!
        </p>
      )}
      {/* 좌/우를 각각 flex 열로 두면 열마다 높이가 따로 놀아서 행이 어긋난다.
          → 한 그리드에 좌·우를 번갈아 넣어 "같은 행"으로 만든다.
            (items-stretch 는 grid 기본값 + 버튼의 h-full 로 행 높이가 맞춰진다)
          320px 대응: 좁은 화면에선 간격·글자를 줄여 8개 버튼이 한 화면에 들어오게. */}
      <div className="grid grid-cols-2 items-stretch gap-1.5 sm:gap-2">
        {left.map((l, i) => {
          const r = right[i];
          return (
            <Fragment key={l.qid}>
              {/* 왼쪽: 질문 */}
              <button
                disabled={graded || matched.has(l.qid)}
                onClick={() => setPickedLeft(pickedLeft === l.qid ? null : l.qid)}
                className={sideCls(l.qid, pickedLeft === l.qid, false)}
              >
                {l.term}
              </button>
              {/* 오른쪽: 한 줄 설명 (같은 행) */}
              <button
                disabled={graded || matched.has(r.qid) || !pickedLeft}
                onClick={() => pickRight(r.qid)}
                className={sideCls(r.qid, false, wrongFlash === r.qid)}
              >
                {r.def}
              </button>
            </Fragment>
          );
        })}
      </div>
      {!pickedLeft && !graded && (
        <p className="text-center text-[11px] font-semibold text-ink-500">
          왼쪽 질문을 먼저 누르고 → 어울리는 오른쪽 설명을 눌러요
        </p>
      )}
    </div>
  );
}

// ─── 본체 ──────────────────────────────────────────────────

/** 2단계 플로우를 쓰는 유형들 — 이 유형일 때만 하단 "확인" 버튼이 뜬다.
 *  나머지(typing/speak/match)는 유형 안에 이미 자기만의 제출 단계가 있다. */
const TWO_STEP_TYPES = ["choice", "blank", "ox"] as const;

export function QuestionCard() {
  const q = useStudyStore((s) => s.currentQuestion);
  const exercise = useStudyStore((s) => s.exercise);
  const graded = useStudyStore((s) => s.graded);
  const lastCorrect = useStudyStore((s) => s.lastCorrect);
  const combo = useStudyStore((s) => s.combo);
  const mode = useStudyStore((s) => s.mode);
  const gradeExercise = useStudyStore((s) => s.gradeExercise);
  const continueQuiz = useStudyStore((s) => s.continueQuiz);
  const unsure = useStudyStore((s) => s.unsure);
  const toggleUnsure = useStudyStore((s) => s.toggleUnsure);
  const pickRandom = useStudyStore((s) => s.pickRandom);

  const [burstId, setBurstId] = useState(0);
  const [shake, setShake] = useState(false);
  const [floatText, setFloatText] = useState<string | null>(null);
  // 음소거 — 진짜 값은 sound.ts 가 들고 있고(localStorage 에 저장), 여기선 화면 갱신용 사본만 둔다.
  const [muted, setMuted] = useState(isMuted);

  // 🔵 2단계 플로우의 심장 — "아직 채점 안 한, 내가 고른 답".
  //   choice → 보기의 qid(string) / blank → 단어(string) / ox → O인지(boolean)
  //   한 화면에 유형은 하나뿐이라 이 칸 하나를 셋이 돌려 쓴다.
  //   문제가 바뀔 때(q.id 변경) useEffect 로 비워준다.
  const [selected, setSelected] = useState<string | boolean | null>(null);
  useEffect(() => setSelected(null), [q?.id]);

  const isCorrect = graded && lastCorrect === true;
  const isTwoStep = !!exercise && (TWO_STEP_TYPES as readonly string[]).includes(exercise.type);
  /** q.question 을 큰 제목으로 띄워도 되는 유형인가. (match·ox 는 안 된다 — 아래 주석) */
  const showTitle = !!exercise && exercise.type !== "match" && exercise.type !== "ox";

  /** 모든 유형이 공유하는 채점 처리 — 사운드/컨페티/XP 플로트까지 한 곳에서. */
  const handleGrade = (correct: boolean, selectedQid?: string) => {
    if (graded) return;
    gradeExercise(correct, selectedQid ?? null);
    const nextCombo = correct ? combo + 1 : 0;

    // 이 시점의 unsure 는 항상 false(문제가 바뀔 때 스토어가 초기화한다) →
    // 뜨는 숫자는 "지금 기록될 XP" 와 일치한다. 이후 "몰랐어요"를 누르면
    // 아래 피드백 시트의 XP 표시가 unsure 를 반영해 다시 계산된다.
    const xp = xpFor(correct, false);

    if (correct) {
      setBurstId((b) => b + 1);
      playSound("correct");
      vibrate(30);
      setFloatText(nextCombo >= 2 ? `+${xp} 🔥x${nextCombo}` : `+${xp}`);
    } else {
      setShake(true);
      playSound("wrong");
      vibrate([60, 40, 60]);
      setFloatText(`+${xpFor(false, false)}`);
    }
    setTimeout(() => {
      setShake(false);
      setFloatText(null);
    }, 1100);
  };

  /** 하단 "확인" 버튼 — 로컬 selected 를 실제 채점으로 넘기는 다리.
   *  유형마다 "정답이란 무엇인가"가 다르므로 여기서 한 번씩 번역해준다. */
  const handleCheck = () => {
    if (graded || selected === null || !q || !exercise) return;
    switch (exercise.type) {
      case "choice":
        // 보기의 qid 가 현재 문제의 id 와 같으면 정답 (원래 그 문제의 답이니까).
        handleGrade(selected === q.id, selected as string);
        break;
      case "blank":
        handleGrade(selected === exercise.answer);
        break;
      case "ox":
        handleGrade(selected === exercise.isTrue);
        break;
    }
  };

  const handleContinue = () => {
    playSound("click");
    continueQuiz();
  };

  // ── 키보드 단축키 ────────────────────────────────────────
  //  1~4 = 보기/단어 "선택"(즉시 채점 아님), o/x = 선택,
  //  Enter = 채점 전이면 확인 / 채점 후면 계속.
  // 렌더마다 리스너를 새로 달지 않으려고 ref 에 최신 컨텍스트를 담아둔다.
  const keyCtx = useRef({ graded, exercise, q, selected, setSelected, handleCheck, handleContinue });
  keyCtx.current = { graded, exercise, q, selected, setSelected, handleCheck, handleContinue };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // input 에 타이핑 중이면 전역 단축키는 잠시 꺼둔다 (타이핑 유형 보호).
      if (e.target instanceof HTMLInputElement) return;
      const ctx = keyCtx.current;
      if (e.key === "Enter") {
        e.preventDefault();
        if (ctx.graded) ctx.handleContinue();
        else if (ctx.selected !== null) ctx.handleCheck();
        return;
      }
      if (ctx.graded || !ctx.exercise || !ctx.q) return;

      const ex = ctx.exercise;
      const n = Number(e.key);
      // 객관식: 숫자키로 그 보기를 "고른다" (다시 눌러 바꿔도 됨)
      if (ex.type === "choice" && n >= 1 && n <= ex.choices.length) {
        ctx.setSelected(ex.choices[n - 1].qid);
      }
      // 빈칸: 숫자키로 단어 은행에서 고른다
      if (ex.type === "blank" && n >= 1 && n <= ex.bank.length) {
        ctx.setSelected(ex.bank[n - 1]);
      }
      // OX 는 o/x 키로도 (한/영 상관없이 소문자 비교)
      if (ex.type === "ox") {
        const k = e.key.toLowerCase();
        if (k === "o") ctx.setSelected(true);
        if (k === "x") ctx.setSelected(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ⚠️ 조기 return 은 반드시 "모든 useState/useEffect 아래"에 둔다.
  //    React 는 렌더마다 훅이 같은 순서·같은 개수로 불리는 걸 전제로 동작하는데,
  //    훅보다 위에서 return 해버리면 어떤 렌더엔 훅이 3개, 어떤 렌더엔 5개가 되어 터진다.
  //    (비유: 출석을 늘 같은 순서로 불러야 이름과 번호가 안 엉킨다.)
  if (!q || !exercise) {
    return (
      <div className="rounded-2xl bg-white p-6 font-semibold text-ink-500 shadow-card">
        선택된 카테고리에 문제가 없습니다.
        <button
          onClick={pickRandom}
          className="ml-2 font-bold text-accent underline-offset-2 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  /** 유형별 본문 렌더링 — discriminated union 이라 각 분기에서 타입 자동 확정. */
  const renderExercise = () => {
    switch (exercise.type) {
      case "choice":
        return (
          <ChoiceView
            ex={exercise}
            picked={typeof selected === "string" ? selected : null}
            onPick={setSelected}
            onGiveUp={() => handleGrade(false)}
          />
        );
      case "blank":
        return (
          <BlankView
            ex={exercise}
            picked={typeof selected === "string" ? selected : null}
            onPick={setSelected}
          />
        );
      case "ox":
        return (
          <OxView
            ex={exercise}
            picked={typeof selected === "boolean" ? selected : null}
            onPick={setSelected}
          />
        );
      case "typing":
        return <TypingView ex={exercise} onGrade={handleGrade} />;
      case "speak":
        return <SpeakView q={q} onGrade={handleGrade} />;
      case "match":
        return <MatchView ex={exercise} onGrade={handleGrade} />;
    }
  };

  return (
    // 부모(App)가 만든 flex-col 안에서 이 컴포넌트가 "본문 + 하단 footer" 두 층을 담당한다.
    // flex-1 min-h-0 = 남는 세로 공간을 다 차지하되, 넘치면 안쪽에서 스크롤 (min-h-0 이 없으면
    // flex 자식이 내용 높이만큼 부풀어서 스크롤이 안 생긴다 — flexbox 의 유명한 함정).
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Confetti burstId={burstId} />

      {/* ── 본문: 여기만 스크롤된다 ── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={shake ? "animate-shake" : ""}>
          <article key={q.id} className="animate-pop flex flex-col gap-4">
            <header className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-ink-500">
                <span>{CATEGORY_EMOJI[q.category]}</span>
                {q.category}
              </span>
              <div className="flex items-center gap-1">
                {mode === "random" && (
                  <button
                    onClick={pickRandom}
                    className="rounded-full px-2.5 py-1 text-xs font-bold text-ink-500 transition-colors hover:bg-accent-soft hover:text-accent-dim"
                    title="다음 문제"
                  >
                    건너뛰기 →
                  </button>
                )}
                {/* 🔇 음소거 — 지하철/도서관용. 설정은 새로고침해도 남는다. */}
                <button
                  onClick={() => setMuted(toggleMute())}
                  aria-label={muted ? "소리 켜기" : "소리 끄기"}
                  aria-pressed={muted}
                  title={muted ? "소리 켜기" : "소리 끄기"}
                  className="rounded-full px-2 py-1 text-base transition-colors hover:bg-accent-soft"
                >
                  {muted ? "🔇" : "🔊"}
                </button>
              </div>
            </header>

            {/* 버디가 문제 옆에서 응원한다 (듀오 캐릭터처럼) */}
            <QuizBuddy qid={q.id} graded={graded} correct={isCorrect} />

            {/* 큰 제목을 생략하는 유형:
                - match: 질문이 4개라 하나만 크게 띄울 수 없다.
                - ox: 판정 문장이 "다른 문제의 요약"일 수 있다(buildOxExercise).
                      그때 q.question 을 제목으로 띄우면 전혀 다른 주제가 나란히 떠서
                      무엇을 판단하라는 건지 알 수 없다 → 판정 문장 하나만 보여준다.
                제목이 없으면 흰 카드는 한 줄짜리 빈 상자가 되므로, 안내 문구만
                맨몸으로 둔다 (작은 화면에서 60px 을 벌어 보기가 화면 안에 들어온다). */}
            {showTitle ? (
              <div className="rounded-2xl bg-white px-5 py-6 shadow-card">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-accent">
                  {PROMPT_BY_TYPE[exercise.type]}
                </p>
                <h2 className="text-lg font-extrabold leading-relaxed text-ink-900">
                  {q.question}
                </h2>
              </div>
            ) : (
              <p className="text-xs font-extrabold uppercase tracking-wider text-accent">
                {PROMPT_BY_TYPE[exercise.type]}
              </p>
            )}

            {renderExercise()}
          </article>
        </div>
        {/* footer 에 가려지는 걸 막는 여백.
            채점 전엔 확인 버튼 한 개뿐이라 조금만, 채점 후엔 시트가 두꺼우니 더 준다.
            h-40 고정이던 걸 상황별로 나눴다 — 그래야 문제 지문이 덜 밀린다. */}
        <div className={graded ? "h-24" : "h-16"} aria-hidden />
      </div>

      {/* ── 하단 고정 footer ──
          채점 전 = "확인" 버튼 한 개.
          채점 후 = 듀오링고식 피드백 시트(초록/빨강 + 해설 + 계속).
          -mx-4 px-4 로 좌우 여백을 뚫고 나가 화면 폭을 꽉 채운다
          (부모 main 이 px-4 를 주고 있어서, 그만큼 음수 마진으로 되돌리는 흔한 기법). */}
      {/* 시트가 화면을 다 먹지 않도록 전체 높이에 상한을 건다.
          dvh = "지금 실제로 보이는 화면 높이" (모바일 주소창이 접혔다 펴져도 정확).
          55dvh 로 묶으면 667px 짜리 작은 폰에서도 위쪽 문제 지문이 두 줄 이상 남는다. */}
      <div className="-mx-4 flex max-h-[55dvh] shrink-0 flex-col border-t-2 border-ink-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        {!graded ? (
          isTwoStep ? (
            <>
              <button
                onClick={handleCheck}
                disabled={selected === null}
                className={
                  "btn-3d w-full rounded-2xl border-2 border-b-4 px-4 py-3.5 text-base font-extrabold tracking-wide " +
                  // 비활성은 opacity 트릭이 아니라 진짜 회색으로 갈아끼운다.
                  // (opacity 로 흐리게 하면 배경이 비쳐서 "고장난 버튼"처럼 보인다.)
                  (selected === null
                    ? "border-ink-300 bg-ink-200 text-ink-400"
                    : "border-duo-green-dim bg-duo-green text-white hover:brightness-105")
                }
              >
                확인
              </button>
              {/* 키보드 힌트 — 물리 키보드가 있을 때만 의미가 있어서 sm 이상에서만.
                  유형별로 실제 동작하는 키를 그대로 안내한다 (보기 번호는 버튼 안 배지). */}
              <p className="mt-1.5 hidden text-center text-[11px] font-bold text-ink-400 sm:block">
                {KEY_HINT_BY_TYPE[exercise.type]}
              </p>
            </>
          ) : (
            // typing/speak/match 는 본문 안에 자기 제출 버튼이 있다.
            // 빈 안내문 대신 이 유형에서 실제로 도움이 되는 한 줄을 보여준다.
            <p className="py-2 text-center text-xs font-bold text-ink-500">
              {SUBMIT_HINT_BY_TYPE[exercise.type]}
            </p>
          )
        ) : (
          <div
            className={
              "feedback-rise -mx-4 -mb-[max(0.75rem,env(safe-area-inset-bottom))] -mt-3 flex min-h-0 flex-col px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 " +
              (isCorrect ? "bg-duo-green-soft" : "bg-duo-red-soft")
            }
          >
            <div className="mx-auto flex min-h-0 w-full max-w-xl flex-col gap-3">
              {/* aria-live: 스크린리더가 "정답/오답"을 소리로 알려준다.
                  (지금까지는 색만 바뀌어서 눈으로 봐야만 알 수 있었다) */}
              <p
                aria-live="polite"
                className={
                  "flex items-center gap-2 text-lg font-extrabold " +
                  (isCorrect ? "text-duo-green-ink" : "text-duo-red-ink")
                }
              >
                <span className="text-2xl" aria-hidden>
                  {isCorrect ? "🎉" : "💡"}
                </span>
                {isCorrect ? "정답이에요!" : "아쉬워요"}
              </p>

              {/* 해설 — 시트에 남는 공간만 쓰고, 넘치면 여기 안에서만 스크롤한다.
                  (max-h-[30vh] 고정이던 걸 flex-1 min-h-0 으로 바꿔서
                   시트 전체 상한 55dvh 안에 알아서 들어가게 했다.) */}
              <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-white/70 p-4 text-sm font-semibold leading-relaxed text-ink-700">
                {q.answer}
                {q.code && (
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-ink-900 p-4 font-mono text-xs leading-relaxed text-ink-100">
                    <code>{q.code}</code>
                  </pre>
                )}
              </div>

              {/* XP 표시는 xpFor() 한 곳에서만 만든다 — "몰랐어요"를 켜면 즉시 +7 로 바뀐다.
                  (예전엔 +12 가 하드코딩이라 실제 기록값과 어긋날 수 있었다) */}
              <div className="flex shrink-0 items-center gap-2 text-xs font-extrabold">
                <span className={"font-round " + (isCorrect ? "text-duo-green-ink" : "text-duo-red-ink")}>
                  +{xpFor(isCorrect, unsure)} XP
                </span>
                {combo >= 2 && (
                  <span className="font-round text-duo-fox-ink">🔥 콤보 {combo}연속</span>
                )}
              </div>

              {/* 찍어서 맞춘 경우용 자수 버튼.
                  맞혔을 때만 뜬다 — 틀렸으면 이미 '모름'으로 기록되니 의미가 없다.
                  누르면 understood 대신 fuzzy 로 기록돼 복습 큐에 계속 남는다. */}
              {isCorrect && (
                <button
                  onClick={toggleUnsure}
                  aria-pressed={unsure}
                  className={
                    "w-full shrink-0 rounded-xl border-2 px-4 py-2.5 text-sm font-extrabold transition " +
                    (unsure
                      ? "border-duo-fox bg-duo-fox text-white"
                      : "border-ink-300 bg-white/70 text-ink-500 hover:bg-white")
                  }
                >
                  {unsure ? "✓ 사실 몰랐어요 — 다시 복습할게요" : "🤔 사실 몰랐어요 (찍었어요)"}
                </button>
              )}

              <button
                onClick={handleContinue}
                className={
                  "btn-3d w-full shrink-0 rounded-2xl border-2 border-b-4 px-4 py-3.5 text-base font-extrabold tracking-wide text-white hover:brightness-105 " +
                  (isCorrect
                    ? "border-duo-green-dim bg-duo-green"
                    : "border-duo-red-dim bg-duo-red")
                }
              >
                계속
              </button>
            </div>
          </div>
        )}
      </div>

      {/* XP 플로트 — "+12" 가 위로 떠오르며 사라진다 (게임에서 데미지 숫자 뜨는 그것).
          Bee 노랑(#FFC800)은 흰 배경에서 너무 흐려 보여서 Fox 주황을 썼다. */}
      {floatText && (
        <div className="pointer-events-none absolute left-1/2 top-1/3 z-10 -translate-x-1/2">
          <div className="float-up font-round text-3xl font-extrabold text-duo-fox-ink">
            {floatText}
          </div>
        </div>
      )}
    </div>
  );
}
