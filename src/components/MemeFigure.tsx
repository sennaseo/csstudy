// =============================================================
// MemeFigure · MemeBurst — 홈의 밈 캐릭터 그림과 효과선 글자
//
// 왜 그림을 이렇게 "슬롯"으로 두나?
// - 진짜 밈 이미지(고양이 사진 같은 것)는 저작권 때문에 지금은 못 쓴다.
//   그래서 src/data/memes.ts 의 MEME_IMAGES 에 경로가 적혀 있으면 그 그림을,
//   비어 있으면(null) 로고 고양이(logo-cat.png)로 대신한다(= 폴백).
//   나중에 이미지가 생기면 memes.ts 한 줄만 바꾸면 되고 이 파일은 안 건드린다.
// - 예전엔 버디 카오모지(글자 그림)로도 대신했는데 뺐다. 글자는 "그림"처럼 안 터지고,
//   단계마다 폭이 들쭉날쭉해서 칸이 깨졌다. 그래서 지금은 스토어도 안 읽는 순수 <img> 다.
// - 전부 aria-hidden: 그림은 장식이고, 뜻은 옆의 말풍선 글자가 전한다.
// - 이미지 주소 앞에 BASE_URL 을 붙이는 이유: 앱은 "./", 웹(GitHub Pages)은
//   "/csstudy/" 아래에서 돌아서, 그냥 "logo-cat.png" 라고 쓰면 웹에서 길을 잃는다.
// =============================================================

import { MEME_IMAGES } from "../data/memes";

export function MemeFigure({
  slot,
  size,
  className = "",
}: {
  slot: "quest" | "daily";
  size: number;
  /** 놓을 자리(위치·정렬)는 쓰는 쪽이 정한다 — 예: 캐릭터 존 아래 가운데 */
  className?: string;
}) {
  // 슬롯에 경로가 있으면 그 그림, 없으면 로고 고양이.
  const src = MEME_IMAGES[slot] ?? "logo-cat.png";
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

/** 효과선 글자 — 만화의 "쾅!" 같은 짧은 외침. 한 단어만.
 *  빨간 굵은 손글씨 + 흰 외곽선 2px(text-shadow 8방향) + 살짝 기울기로 B급 느낌을 낸다.
 *  흰 외곽선 덕분에 뒤에 집중선·제목이 겹쳐도 글자가 묻히지 않는다.
 *  pointer-events-none: 겹친 자리 아래의 것을 눌러도 이 글자가 가로채지 않게.
 *  장식이라 aria-hidden (같은 뜻이 제목·말풍선에 이미 있다). */
export function MemeBurst({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={
        "pointer-events-none -rotate-6 select-none whitespace-nowrap font-display text-3xl font-bold leading-none text-duo-red-ink [text-shadow:-2px_-2px_0_#fff,2px_-2px_0_#fff,-2px_2px_0_#fff,2px_2px_0_#fff,0_2px_0_#fff,0_-2px_0_#fff] " +
        className
      }
    >
      {children}
    </span>
  );
}
