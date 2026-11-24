// =============================================================
// 3D 마스코트 장면 — DietCalc 앱의 털뭉치 고양이를 그대로 가져와 띄운다.
//
// - 모델·털·표정·먹기: orig/cat.js, orig/eat.js (DietCalc/mascot/src 원본 그대로).
//   움직임(idle / eat / tap / pulse / pet)은 블렌더에서 만든 클립이 GLB 안에 들어 있다.
// - 이 파일: 원본 main.js 를 "앱 화면 안의 한 칸"에서 돌도록 옮긴 것.
//   (원본은 웹뷰 한 장을 통째로 쓰고 React Native 와 메시지로 이야기했다 →
//    여기서는 host 칸에 붙고, 화면(React)과는 onEvent / act() 로 이야기한다.)
// - 만지기: 톡 = 움찔, 꾹 누르기 = 쓰다듬기, 문지르기 = 돌려 보면서 눈웃음.
// =============================================================
import * as THREE from "three";
import { loadCat, buildCat, SHELLS_HIGH, SHELLS_LOW, EXPRESSIONS, type Cat } from "./orig/cat.js";
import { createEater } from "./orig/eat.js";

export type PetEvent =
  | { type: "ready" }
  | { type: "tap"; x: number; y: number }
  | { type: "pet"; x: number; y: number }
  | { type: "wake" }
  | { type: "ate" };

export type PetAction = "snack" | "play" | "sleep" | "wake" | "cheer";

export interface CatScene {
  act(action: PetAction): void;
  dispose(): void;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEG = Math.PI / 180;
const FADE = 0.4;
interface Spring {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
}
const spring = (k = 170, c = 11): Spring => ({ x: 0, v: 0, t: 0, k, c });

export async function createCatScene(
  host: HTMLElement,
  url: string,
  onEvent: (e: PetEvent) => void,
): Promise<CatScene> {
  const rand = mulberry32(1);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:none;";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 1.45, 6.0);
  camera.lookAt(0, 0.84, 0);

  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 3;
  let shells = lowEnd ? SHELLS_LOW : SHELLS_HIGH;

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // 세로로 긴 칸에서도 고양이가 옆으로 잘리지 않게
    camera.fov = w >= h ? 28 : 2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(14 * DEG) / camera.aspect));
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const gltf = await loadCat(url);
  const cat: Cat = buildCat({ gltf, rand, shells });
  const earRest = cat.ears.map((e) => e.quaternion.clone());
  scene.add(cat.root, cat.shadow);
  const action = (n: string, once = false) => {
    const a = cat.mixer.clipAction(cat.clips[n]);
    if (once) {
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = false;
    }
    return a;
  };
  const base = { idle: action("idle"), eat: action("eat"), current: null as THREE.AnimationAction | null };
  const over = { tap: action("tap", true), pulse: action("pulse", true), pet: action("pet") };
  const eater = createEater(cat, rand, base.eat);

  // ── 상태
  const S = { rotY: spring(120, 14), rotX: spring(120, 14), rotZ: spring(140, 14) };
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let time = 0;
  let timedExpr: string | null = null;
  let timedUntil = 0;
  let nextBlink = 2 + rand() * 4;
  let nextTwitch = 8;
  let twitchT = -1;
  let twitchEar = 0;
  let currentExpr: string | null = null;
  let asleep = false;
  let eatUntil = -1; // 간식 다 먹는 시각 (-1 = 안 먹는 중)
  let pointer: null | { id: number; x0: number; y0: number; t0: number; mode: "press" | "drag" | "pet"; lx: number; ly: number; stroke: number; petT: number } = null;
  const qTmp = new THREE.Quaternion();
  const zAxis = new THREE.Vector3(0, 0, 1);

  const setTimed = (expr: string, ms: number) => {
    timedExpr = expr;
    timedUntil = time + ms / 1000;
  };
  const stepSpring = (s: Spring, dt: number) => {
    s.v += ((s.t - s.x) * s.k - s.v * s.c) * dt;
    s.x += s.v * dt;
  };
  const oneShot = (a: THREE.AnimationAction) => {
    if (!reduceMotion) a.reset().play();
  };
  const pulse = () => {
    setTimed("squint", 500);
    oneShot(over.pulse);
  };
  function setMode(eat: boolean, fade = FADE) {
    if (eat === eater.on && base.current) return;
    eater.set(eat, fade > 0);
    const to = eat ? base.eat : base.idle;
    const from = base.current;
    to.reset().play();
    if (from && from !== to && fade) to.crossFadeFrom(from, fade, false);
    else if (from && from !== to) from.stop();
    base.current = to;
  }
  setMode(false, 0);

  function update(dt: number) {
    time += dt;
    if (!reduceMotion) {
      if (time >= nextBlink) {
        if (!timedExpr && !eater.state.face) setTimed("blink", 110);
        nextBlink = time + 2 + rand() * 4;
      }
      if (time >= nextTwitch) {
        twitchT = 0;
        twitchEar = rand() < 0.5 ? 0 : 1;
        nextTwitch = time + 6 + rand() * 4;
      }
    }
    if (timedExpr && time >= timedUntil) timedExpr = null;
    if (eatUntil >= 0 && time >= eatUntil) {
      eatUntil = -1;
      setMode(false);
      setTimed("happy", 900);
      onEvent({ type: "ate" });
    }

    for (const s of Object.values(S)) stepSpring(s, dt);
    // 코드가 같이 움직이는 마디는 먼저 제자리로 — 그다음 믹서가 클립 값을 덮어쓴다
    cat.upper.quaternion.identity();
    cat.ears.forEach((e, i) => e.quaternion.copy(earRest[i]));
    if (reduceMotion) {
      for (const a of [...Object.values(over), base.idle, base.eat]) if (a !== base.current) a.stop();
      base.current!.stopFading().setEffectiveWeight(1).time = 0;
      cat.mixer.update(0);
    } else {
      cat.mixer.update(asleep ? dt * 0.5 : dt); // 잘 때는 숨을 천천히
    }
    eater.update(dt, reduceMotion);

    cat.root.rotation.set(reduceMotion ? 0 : S.rotX.x, reduceMotion ? 0 : S.rotY.x, 0);
    // 쓰다듬는 쪽으로 기울기: 몸·귀만, 발은 바닥에
    if (!reduceMotion) cat.upper.quaternion.premultiply(qTmp.setFromAxisAngle(zAxis, S.rotZ.x));
    const y = cat.catRoot.position.y * 1.5;
    cat.shadow.scale.setScalar(1 - y * 0.6);
    cat.shadow.material.opacity = 1 - y * 1.2;

    if (twitchT >= 0) {
      twitchT += dt;
      const s = twitchEar ? 1 : -1;
      const w = twitchT < 0.3 ? Math.sin((twitchT / 0.3) * Math.PI * 2) * 0.18 * (1 - twitchT / 0.3) : 0;
      cat.ears[twitchEar].quaternion.premultiply(qTmp.setFromAxisAngle(zAxis, w * s));
      if (twitchT >= 0.3) twitchT = -1;
    }

    const expr = pointer?.mode === "pet" ? "happy" : timedExpr || eater.state.face || (asleep ? "blink" : "normal");
    if (expr !== currentExpr && EXPRESSIONS.includes(expr)) {
      currentExpr = expr;
      cat.setExpr(expr);
    }
  }

  // ── 포인터
  const at = (cx: number, cy: number) => {
    const r = host.getBoundingClientRect();
    return { x: cx - r.left, y: cy - r.top };
  };
  const wake = () => {
    asleep = false;
    onEvent({ type: "wake" });
  };
  const onDown = (e: PointerEvent) => {
    if (pointer) return;
    canvas.setPointerCapture(e.pointerId);
    pointer = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), mode: "press", lx: e.clientX, ly: e.clientY, stroke: 0, petT: 0 };
  };
  const onMove = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const dx = e.clientX - pointer.x0;
    const dy = e.clientY - pointer.y0;
    const r = canvas.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const moved = Math.hypot(e.clientX - pointer.lx, e.clientY - pointer.ly);
    pointer.lx = e.clientX;
    pointer.ly = e.clientY;
    if (pointer.mode === "press" && Math.hypot(dx, dy) > 8) pointer.mode = "drag";
    if (pointer.mode === "drag") {
      S.rotY.t = THREE.MathUtils.clamp((dx / r.width) * 2, -1, 1) * 35 * DEG;
      S.rotX.t = THREE.MathUtils.clamp((dy / r.height) * 2, -1, 1) * 15 * DEG;
    } else if (pointer.mode === "pet") {
      S.rotZ.t = -THREE.MathUtils.clamp(nx, -1, 1) * 10 * DEG;
    }
    // 문지른 거리만큼 쓰다듬은 걸로 친다 (끌어서 돌릴 때도, 꾹 누른 채 움직일 때도)
    if (pointer.mode !== "press") {
      pointer.stroke += moved;
      if (pointer.stroke > 70) {
        pointer.stroke = 0;
        if (asleep) wake();
        if (pointer.mode === "drag") setTimed("happy", 600);
        onEvent({ type: "pet", ...at(e.clientX, e.clientY) });
      }
    }
  };
  const release = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    if (pointer.mode === "press" && e.type === "pointerup") {
      if (asleep) wake();
      else onEvent({ type: "tap", ...at(e.clientX, e.clientY) });
      setTimed("squint", 400);
      oneShot(over.tap);
    }
    if (pointer.mode === "pet" && over.pet.isRunning()) over.pet.fadeOut(0.25);
    pointer = null;
    S.rotX.t = S.rotY.t = S.rotZ.t = 0;
  };
  const noMenu = (e: Event) => e.preventDefault(); // 안드로이드: 길게 누르면 뜨는 메뉴가 터치를 끊는다
  canvas.addEventListener("contextmenu", noMenu);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("lostpointercapture", release);

  // ── 매 프레임
  let raf = 0;
  let last = performance.now();
  let frames = 0;
  let probeStart = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // 0.3초 넘게 꾹 누르면 쓰다듬기, 누르고 있는 동안 계속 좋아한다
    if (pointer?.mode === "press" && now - pointer.t0 >= 300) {
      pointer.mode = "pet";
      pointer.petT = now;
      if (asleep) wake();
      if (!reduceMotion) over.pet.reset().fadeIn(0.25).play();
      onEvent({ type: "pet", ...at(pointer.lx, pointer.ly) });
    } else if (pointer?.mode === "pet" && now - pointer.petT >= 550) {
      pointer.petT = now;
      onEvent({ type: "pet", ...at(pointer.lx, pointer.ly) });
    }
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    update(dt);
    renderer.render(scene, camera);
    frames++;
    if (frames === 1) onEvent({ type: "ready" });
    if (frames === 30) probeStart = now; // 처음 몇 장은 준비 시간이라 빼고 잰다
    // 처음에 느리면 털 겹 수를 줄인다
    if (frames === 60 && shells > SHELLS_LOW && (now - probeStart) / 30 > 40) {
      shells = SHELLS_LOW;
      cat.setShells(shells);
    }
  };
  raf = requestAnimationFrame(frame);

  // 화면이 안 보일 땐 그리지 않는다 (배터리)
  const onVis = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener("visibilitychange", onVis);

  return {
    act(a) {
      if (a === "snack") {
        asleep = false;
        setMode(false, 0); // 먹는 중에 또 누르면 새 쿠키로 처음부터
        setMode(true);
        eatUntil = time + Math.max(cat.clips.eat.duration, 3);
      } else if (a === "play" || a === "cheer") {
        asleep = false;
        pulse();
        if (a === "cheer") setTimed("happy", 1500);
      } else if (a === "sleep") {
        if (eatUntil >= 0) {
          eatUntil = -1;
          setMode(false);
        }
        asleep = true;
      } else if (a === "wake") {
        asleep = false;
        oneShot(over.tap);
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      cat.mixer.stopAllAction();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
      });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
