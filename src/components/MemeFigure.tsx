// =============================================================
// MemeFigure · MemeBurst — 홈의 밈 캐릭터 그림과 효과선 글자
//
// 왜 그림을 이렇게 "슬롯"으로 두나?
// - 그림은 마스코트(먼지요정 CSstudy)의 표정·포즈. 어떤 그림을 쓸지는
//   src/data/memes.ts 의 MEME_IMAGES 한 곳에서 정하고 이 파일은 안 건드린다.
//   퀘스트 슬롯은 그날 기분(mood)마다 다른 그림이다.
// - 예전엔 버디 카오모지(글자 그림)로도 대신했는데 뺐다. 글자는 "그림"처럼 안 터지고,
//   단계마다 폭이 들쭉날쭉해서 칸이 깨졌다. 그래서 지금은 스토어도 안 읽는 순수 <img> 다.
// - 전부 aria-hidden: 그림은 장식이고, 뜻은 옆의 말풍선 글자가 전한다.
// - 이미지 주소 앞에 BASE_URL 을 붙이는 이유: 앱은 "./", 웹(GitHub Pages)은
//   "/csstudy/" 아래에서 돌아서, 그냥 "mascot/..." 라고 쓰면 웹에서 길을 잃는다.
// =============================================================

import { MEME_IMAGES, type QuestMood } from "../data/memes";

export function MemeFigure({
  slot,
  mood = "idle",
  size,
  className = "",
}: {
  slot: "quest" | "daily";
  /** quest 슬롯 전용 — 그날 기분에 맞는 표정 */
  mood?: QuestMood;
  size: number;
  /** 놓을 자리(위치·정렬)는 쓰는 쪽이 정한다 — 예: 캐릭터 존 아래 가운데 */
  className?: string;
}) {
  const src = slot === "quest" ? MEME_IMAGES.quest[mood] : MEME_IMAGES.daily;
  return (
    <img
      src={import.meta.env.BASE_URL + src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={"shrink-0 rounded-xl object-contain " + className}
    />
  );
}

/** 빨간 타원 딱지 — 밈 짤의 "조졌다" 스티커. 흰 굴림 굵게 + 살짝 기울기.
 *  빨강(#DC2626) 위 흰 글자는 대비 4.5:1 통과. 모양은 index.css 의 .b-sticker.
 *  pointer-events-none: 겹친 자리 아래의 것을 눌러도 이 딱지가 가로채지 않게.
 *  장식이라 aria-hidden (같은 뜻이 제목·말풍선에 이미 있다). */
export function MemeBurst({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span aria-hidden className={"b-sticker pointer-events-none select-none " + className}>
      {children}
    </span>
  );
}

/** 노란 네 갈래 반짝이 ✦ — 밈 짤 모서리 장식. size 는 px. */
export function Sparkle({ size, className = "" }: { size: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={"b-sparkle pointer-events-none " + className}
      style={{ width: size, height: size }}
    />
  );
}

/** 문장 속 숫자만 "노란 별폭발 + 빨간 글자"로 — 밈 짤의 "인생이 [산]으로". */
export function NumBoom({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d+)/).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="b-boom">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
