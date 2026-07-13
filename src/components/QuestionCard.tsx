// =============================================================
// QuestionCard — 듀오링고식 퀴즈 카드 (향상판)
// - 키보드 단축키: 1~4 = 보기 선택, Enter = 계속 (데스크탑용).
// =============================================================

import { useState, useEffect, useRef } from "react";
import { useStudyStore } from "../store/useStudyStore";
import type { QuizChoice } from "../types";
import { CATEGORY_EMOJI } from "../data/questions";
import { findCharacter, stageOf } from "../data/characters";
import { Confetti } from "./Confetti";
import { playSound } from "../utils/sound";

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

export function QuestionCard() {
  const q = useStudyStore((s) => s.currentQuestion);
  const choices = useStudyStore((s) => s.choices);
  const selectedQid = useStudyStore((s) => s.selectedQid);
  const graded = useStudyStore((s) => s.graded);
  const combo = useStudyStore((s) => s.combo);
  const mode = useStudyStore((s) => s.mode);
  const answerQuiz = useStudyStore((s) => s.answerQuiz);
  const continueQuiz = useStudyStore((s) => s.continueQuiz);
  const pickRandom = useStudyStore((s) => s.pickRandom);

  const [burstId, setBurstId] = useState(0);
  const [shake, setShake] = useState(false);
  const [floatText, setFloatText] = useState<string | null>(null);

  useEffect(() => {
    if (graded) {
      const isCorrect = selectedQid === q?.id;
      if (!isCorrect) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    }
  }, [graded, selectedQid, q]);

  if (!q) {
    return (
      <div className="rounded-2xl bg-white p-6 text-ink-500 shadow-card">
        선택된 카테고리에 문제가 없습니다.
        <button
          onClick={pickRandom}
          className="ml-2 font-semibold text-accent underline-offset-2 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const isCorrect = graded && selectedQid === q.id;

  const handleSelect = (c: QuizChoice) => {
    if (graded) return;
    const correct = c.qid === q.id;

    answerQuiz(c.qid);
    // answerQuiz 가 콤보를 갱신하지만, 이 렌더의 combo 는 이전 값이라 직접 계산.
    const nextCombo = correct ? combo + 1 : 0;

    if (correct) {
      setBurstId((b) => b + 1);
      playSound("correct");
      setFloatText(nextCombo >= 2 ? `+12 🔥x${nextCombo}` : "+12");
    } else {
      setShake(true);
      playSound("wrong");
      setFloatText("+4");
    }

    setTimeout(() => {
      setShake(false);
      setFloatText(null);
    }, 1100);
  };

  const handleContinue = () => {
    playSound("click");
    continueQuiz();
  };

  // ── 키보드 단축키 (1~4 = 보기 선택, Enter = 계속) ──
  // 렌더마다 리스너를 새로 달지 않으려고 ref 에 최신 핸들러를 담아둔다.
  const keyCtx = useRef({ graded, choices, handleSelect, handleContinue });
  keyCtx.current = { graded, choices, handleSelect, handleContinue };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const ctx = keyCtx.current;
      if (e.key === "Enter") {
        if (ctx.graded) {
          e.preventDefault();
          ctx.handleContinue();
        }
        return;
      }
      const n = Number(e.key);
      if (!ctx.graded && n >= 1 && n <= ctx.choices.length) {
        ctx.handleSelect(ctx.choices[n - 1]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const choiceClass = (c: QuizChoice): string => {
    const base =
      "btn-3d w-full rounded-2xl px-4 py-3.5 text-left text-sm font-semibold leading-snug transition-colors ";
    if (!graded) {
      return (
        base +
        "border-2 border-b-4 border-ink-200 bg-white text-ink-700 hover:bg-ink-100 active:bg-ink-100"
      );
    }
    if (c.correct) {
      return base + "border-2 border-duo-green-dim bg-duo-green-soft text-duo-green-ink";
    }
    if (c.qid === selectedQid) {
      return base + "border-2 border-duo-red-dim bg-duo-red-soft text-duo-red-ink";
    }
    return base + "border-2 border-ink-200 bg-white text-ink-300 opacity-60";
  };

  return (
    <div className="relative">
      <Confetti burstId={burstId} />

      <div className={shake ? "animate-shake" : ""}>
        <article key={q.id} className="animate-pop flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-500">
              <span>{CATEGORY_EMOJI[q.category]}</span>
              {q.category}
            </span>
            {mode === "random" && (
              <button
                onClick={pickRandom}
                className="rounded-full px-2.5 py-1 text-xs font-medium text-ink-500 transition-colors hover:bg-accent-soft hover:text-accent-dim"
                title="다음 문제"
              >
                건너뛰기 →
              </button>
            )}
          </header>

          {/* 버디가 문제 옆에서 응원한다 (듀오 캐릭터처럼) */}
          <QuizBuddy qid={q.id} graded={graded} correct={isCorrect} />

          <div className="rounded-2xl bg-white px-5 py-6 shadow-card">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
              맞는 설명을 골라보세요
            </p>
            <h2 className="text-lg font-semibold leading-relaxed text-ink-900">
              {q.question}
            </h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {choices.map((c, i) => (
              <button
                key={c.qid}
                onClick={() => handleSelect(c)}
                disabled={graded}
                className={choiceClass(c)}
              >
                {/* 데스크탑 전용 숫자 힌트 — 1~4 키로 바로 선택 가능 */}
                <span className="mr-2 hidden rounded-md border border-current px-1.5 py-0.5 text-[10px] font-bold opacity-50 sm:inline-block">
                  {i + 1}
                </span>
                {c.text}
                {graded && c.correct && <span className="ml-1.5">✓</span>}
                {graded && !c.correct && c.qid === selectedQid && (
                  <span className="ml-1.5">✕</span>
                )}
              </button>
            ))}
          </div>
        </article>

        {graded && (
          <div
            className={
              "feedback-rise mt-4 rounded-2xl p-4 " +
              (isCorrect ? "bg-duo-green-soft" : "bg-duo-red-soft")
            }
          >
            <p
              className={
                "flex items-center gap-2 text-base font-extrabold " +
                (isCorrect ? "text-duo-green-ink" : "text-duo-red-ink")
              }
            >
              <span className="text-xl">{isCorrect ? "🎉" : "💡"}</span>
              {isCorrect ? "정답이에요!" : "아쉬워요 — 해설을 볼까요?"}
            </p>

            <div className="mt-3 rounded-xl bg-white/70 p-4 text-sm leading-relaxed text-ink-700">
              {q.answer}
            </div>

            {q.code && (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-ink-900 p-4 font-mono text-xs leading-relaxed text-ink-100">
                <code>{q.code}</code>
              </pre>
            )}

            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ink-500">
              <span>
                {isCorrect ? "+12 XP" : "+4 XP"}
                {combo >= 2 && (
                  <span className="ml-2 text-accent">🔥 콤보 {combo}연속</span>
                )}
              </span>
              <button
                onClick={handleContinue}
                className="text-accent underline-offset-2 hover:underline"
              >
                계속 →
              </button>
            </div>

            <button
              onClick={handleContinue}
              className={
                "btn-3d mt-4 w-full rounded-2xl px-4 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white " +
                (isCorrect
                  ? "border-duo-green-dim bg-duo-green hover:brightness-105"
                  : "border-duo-red-dim bg-duo-red hover:brightness-105")
              }
            >
              계속
            </button>
          </div>
        )}
      </div>

      {floatText && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-pop text-2xl font-extrabold text-accent">
            {floatText}
          </div>
        </div>
      )}
    </div>
  );
}
