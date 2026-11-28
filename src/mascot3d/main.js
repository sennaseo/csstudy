import * as THREE from 'three';
import { loadCat, buildCat, SHELLS_HIGH, SHELLS_LOW, EXPRESSIONS } from './cat.js';
import { createEater } from './eat.js';

const q = new URLSearchParams(location.search);
const TEST = q.has('pose');
if (q.has('bg')) document.body.style.background = '#' + q.get('bg');

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(Number(q.get('seed') || 1));
// 원래는 React Native WebView 로 보내던 것 — 여기선 iframe 을 띄운 앱(부모 창)으로 보낸다.
// 단독으로 열렸을 땐(parent === 자기 자신) 자기한테 메시지가 되돌아오지 않게 아예 안 보낸다.
const post = (msg) => { if (window.parent !== window) window.parent.postMessage({ source: 'mascot3d', ...msg }, '*'); };

// ---------- scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: TEST });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
const canvas = renderer.domElement;
canvas.style.touchAction = 'none';
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
camera.position.set(0, 1.45, 6.0);
camera.lookAt(0, 0.84, 0);

const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3;
let shells = Number(q.get('shells')) || (lowEnd ? SHELLS_LOW : SHELLS_HIGH);
let cat, eater, base, over; // set once the GLB is parsed (start())

// ?px=N: fixed square N×N drawing buffer at pixelRatio 1 (used to export the RN placeholder still)
const FIXED = Number(q.get('px')) || 0;
if (FIXED) renderer.setPixelRatio(1);
function resize() {
  const w = FIXED || window.innerWidth, h = FIXED || window.innerHeight;
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  camera.aspect = w / h;
  // keep the cat fully in view on non-square views
  camera.fov = w >= h ? 28 : 2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(14)) / camera.aspect));
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ---------- state ----------
// Motion = Blender clips (cat.mixer): base layer idle <-> eat (crossfade), additive one-shots tap / pulse, pet loop while held.
// Code adds only what follows the finger or is random: drag rotation, pet tilt, ear twitch, blink, expressions.
const DEG = Math.PI / 180;
const FADE = 0.4;
const spring = (k = 170, c = 11) => ({ x: 0, v: 0, t: 0, k, c });
const S = { rotY: spring(120, 14), rotX: spring(120, 14), rotZ: spring(140, 14) };
let time = 0;
// OS 의 "동작 줄이기"를 켠 사람에겐 처음부터 멈춘 자세로 (부모가 따로 알려줄 필요 없게)
let reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let timedExpr = null, timedUntil = 0;
let nextBlink = 2 + rand() * 4;
let nextTwitch = 8;
let twitchT = -1, twitchEar = 0;
let pointer = null; // {id,x0,y0,t0,mode:'press'|'drag'|'pet'}
let currentExpr = null;
const qTmp = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1);

function setTimed(expr, ms) { timedExpr = expr; timedUntil = time + ms / 1000; }
function stepSpring(s, dt) {
  s.v += ((s.t - s.x) * s.k - s.v * s.c) * dt;
  s.x += s.v * dt;
}
const settled = () => Object.values(S).every((s) => Math.abs(s.x - s.t) < 1e-3 && Math.abs(s.v) < 1e-3);
const playing = () => over.tap.isRunning() || over.pulse.isRunning() || over.pet.isRunning();

function oneShot(a) { if (!reduceMotion) a.reset().play(); }
function tap() {
  post({ type: 'tap' });
  setTimed('squint', 400);
  oneShot(over.tap);
}
function pulse() {
  setTimed('squint', 500);
  oneShot(over.pulse);
}
function petStart() { if (!reduceMotion) over.pet.reset().fadeIn(0.25).play(); }
function petEnd() { if (over.pet.isRunning()) over.pet.fadeOut(0.25); }
function setMode(eat, fade = FADE) {
  if (eat === eater.on && base.current) return;
  eater.set(eat, fade > 0);
  const to = eat ? base.eat : base.idle, from = base.current;
  to.reset().play();
  if (from && from !== to && fade) to.crossFadeFrom(from, fade, false);
  else if (from && from !== to) from.stop();
  base.current = to;
}

function update(dt) {
  time += dt;
  // random blink / ear twitch
  if (!reduceMotion && !TEST) {
    if (time >= nextBlink) { if (!timedExpr && !eater.state.face) setTimed('blink', 110); nextBlink = time + 2 + rand() * 4; }
    if (time >= nextTwitch) { twitchT = 0; twitchEar = rand() < 0.5 ? 0 : 1; nextTwitch = time + 6 + rand() * 4; }
  }
  if (timedExpr && time >= timedUntil) timedExpr = null;

  for (const s of Object.values(S)) stepSpring(s, dt);
  // nodes the code also moves go back to rest first; the mixer then writes whatever its clips bind
  cat.upper.quaternion.identity();
  cat.ears.forEach((e, i) => e.quaternion.copy(cat.earRest[i]));
  if (reduceMotion) { // static pose: clip frame 0 (idle = rest, eat = holding the cookie)
    for (const a of [...Object.values(over), base.idle, base.eat]) if (a !== base.current) a.stop();
    base.current.stopFading().setEffectiveWeight(1).time = 0;
    cat.mixer.update(0);
  } else {
    cat.mixer.update(dt);
  }
  eater.update(dt, reduceMotion);

  cat.root.rotation.set(reduceMotion ? 0 : S.rotX.x, reduceMotion ? 0 : S.rotY.x, 0);
  // pet tilt follows the finger: body + ears only, paws stay planted
  if (!reduceMotion) cat.upper.quaternion.premultiply(qTmp.setFromAxisAngle(zAxis, S.rotZ.x));
  const y = cat.catRoot.position.y * 1.5;
  cat.shadow.scale.setScalar(1 - y * 0.6);
  cat.shadow.material.opacity = 1 - y * 1.2;

  if (twitchT >= 0) {
    twitchT += dt;
    const s = twitchEar ? 1 : -1;
    const w = twitchT < 0.3 ? Math.sin(twitchT / 0.3 * Math.PI * 2) * 0.18 * (1 - twitchT / 0.3) : 0;
    cat.ears[twitchEar].quaternion.premultiply(qTmp.setFromAxisAngle(zAxis, w * s));
    if (twitchT >= 0.3) twitchT = -1;
  }

  const expr = q.get('expr') || (pointer?.mode === 'pet' ? 'happy' : timedExpr || eater.state.face || 'normal');
  if (expr !== currentExpr && EXPRESSIONS.includes(expr)) {
    currentExpr = expr;
    cat.setExpr(expr);
  }
}

// ---------- input ----------
function local(e) {
  const r = canvas.getBoundingClientRect();
  return { nx: ((e.clientX - r.left) / r.width) * 2 - 1, ny: ((e.clientY - r.top) / r.height) * 2 - 1, r };
}
// Android WebView long-press = text selection / context menu, which cancels the pointer
document.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerdown', (e) => {
  if (pointer || !cat) return;
  canvas.setPointerCapture(e.pointerId);
  pointer = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), mode: 'press' };
  post({ type: 'touch', active: true });
  kick();
});
canvas.addEventListener('pointermove', (e) => {
  if (!pointer || e.pointerId !== pointer.id) return;
  const dx = e.clientX - pointer.x0, dy = e.clientY - pointer.y0;
  const { nx, r } = local(e);
  if (pointer.mode === 'press' && Math.hypot(dx, dy) > 8) pointer.mode = 'drag';
  if (pointer.mode === 'drag') {
    S.rotY.t = THREE.MathUtils.clamp((dx / r.width) * 2, -1, 1) * 35 * DEG;
    S.rotX.t = THREE.MathUtils.clamp((dy / r.height) * 2, -1, 1) * 15 * DEG;
  } else if (pointer.mode === 'pet') {
    S.rotZ.t = -THREE.MathUtils.clamp(nx, -1, 1) * 10 * DEG;
  }
});
function release(e) {
  if (!pointer || e.pointerId !== pointer.id) return;
  if (pointer.mode === 'press' && e.type === 'pointerup') tap();
  if (pointer.mode === 'pet') petEnd();
  pointer = null;
  S.rotX.t = S.rotY.t = S.rotZ.t = 0;
  post({ type: 'touch', active: false });
  kick();
}
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);
canvas.addEventListener('lostpointercapture', release);
function checkHold() {
  if (pointer?.mode === 'press' && performance.now() - pointer.t0 >= 300) {
    pointer.mode = 'pet';
    petStart();
    post({ type: 'pet' });
  }
}

// ---------- messages from RN ----------
window.handleMessage = (msg) => {
  try {
    const m = typeof msg === 'string' ? JSON.parse(msg) : msg;
    if (!cat) return; // RN only talks after 'ready'
    if (m.type === 'pulse') pulse();
    else if (m.type === 'reduceMotion') reduceMotion = !!m.value;
    else if (m.type === 'mode') setMode(m.value === 'eat');
    else if (m.type === 'pause') pause();
    else if (m.type === 'resume') resume();
    kick();
  } catch (err) { /* ignore malformed */ }
};
// 에러도 부모로 올려 보낸다 (iframe 안 콘솔은 앱 쪽에서 안 보이니까)
window.addEventListener('error', (e) => post({ type: 'error', message: e.message }));
// 부모 창(앱)이 보낸 것만 받는다 — 다른 창/확장 프로그램이 쏜 메시지로 조종되지 않게
const onMsg = (e) => { if (e.source === window.parent && e.source !== window) window.handleMessage(e.data); };
window.addEventListener('message', onMsg);

// ---------- loop ----------
let raf = 0, running = false, last = 0, lastRender = 0, frames = 0, probeStart = 0, ready = false;
let fpsT0 = 0, fpsN = 0; // rendered-frame rate, reported to RN every 5s
function frame(now) {
  raf = requestAnimationFrame(frame);
  checkHold();
  const busy = pointer || playing() || twitchT >= 0 || !settled() || frames < 60;
  // ~30fps idle, 60fps interacting; reduceMotion idle is a static pose -> 2fps is plenty
  const gap = reduceMotion && !timedExpr ? 500 : 32;
  if (!busy && now - lastRender < gap) return;
  const dt = Math.min((now - last) / 1000, 1 / 20);
  last = now;
  update(dt);
  renderer.render(scene, camera);
  lastRender = now;
  frames++;
  fpsN++;
  if (now - fpsT0 >= 5000) { post({ type: 'fps', value: Math.round((fpsN * 1000) / (now - fpsT0)), shells }); fpsT0 = now; fpsN = 0; }
  if (!ready) { ready = true; post({ type: 'ready' }); }
  if (frames === 30) probeStart = now; // skip warm-up frames (shader compile, page load)
  // auto-reduce shells if the first frames are slow
  if (frames === 60 && shells > SHELLS_LOW && (now - probeStart) / 30 > 40) {
    shells = SHELLS_LOW;
    cat.setShells(shells);
  }
}
function kick() { if (running) lastRender = 0; }
let wantRun = !TEST;
function pause() { wantRun = false; running = false; cancelAnimationFrame(raf); }
function resume() {
  wantRun = true;
  if (running || !cat) return;
  running = true;
  last = fpsT0 = performance.now();
  fpsN = 0;
  raf = requestAnimationFrame(frame);
}
window.pause = pause;
window.resume = resume;
document.addEventListener('visibilitychange', () => (document.hidden ? pause() : resume()));

function start(gltf) {
  cat = buildCat({ gltf, rand, shells });
  cat.earRest = cat.ears.map((e) => e.quaternion.clone());
  scene.add(cat.root, cat.shadow);
  const act = (n, once) => {
    const a = cat.mixer.clipAction(cat.clips[n]);
    if (once) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = false; }
    return a;
  };
  base = { idle: act('idle'), eat: act('eat'), current: null };
  over = { tap: act('tap', true), pulse: act('pulse', true), pet: act('pet') };
  eater = createEater(cat, rand, base.eat);
  setMode(q.get('mode') === 'eat', 0);

  if (TEST) {
    // deterministic single frame: ?pose=normal|blink|tap|pet|happy|squint|pulse&t=ms&rotY=deg&rotX=deg[&mode=eat][&expr=...]
    const pose = q.get('pose');
    const t = Number(q.get('t') || 0) / 1000;
    reduceMotion = q.get('reduceMotion') === '1';
    if (pose === 'tap') tap();
    if (pose === 'pulse') pulse();
    if (pose === 'blink') setTimed('blink', 1e6);
    if (pose === 'squint') setTimed('squint', 1e6);
    if (pose === 'happy') setTimed('happy', 1e6);
    if (pose === 'pet') { pointer = { mode: 'pet' }; petStart(); S.rotZ.t = Number(q.get('tilt') ?? -10) * DEG; }
    if (pose === 'twitch') { twitchT = 0; twitchEar = Number(q.get('ear') ?? 0); } // peak ~ t=75
    S.rotY.x = S.rotY.t = Number(q.get('rotY') || 0) * DEG;
    S.rotX.x = S.rotX.t = Number(q.get('rotX') || 0) * DEG;
    const steps = Math.max(1, Math.round(t * 60));
    for (let i = 0; i < steps; i++) update(t ? 1 / 60 : 0);
    // keep presenting the same frame so headless screenshots catch it
    const still = () => { renderer.render(scene, camera); requestAnimationFrame(still); };
    still();
    document.title = 'done';
    // ?dump=1: write the frame as a PNG data URL into the DOM (read back with chrome --dump-dom)
    if (q.has('dump')) {
      renderer.render(scene, camera);
      const pre = document.createElement('pre');
      pre.id = 'png';
      pre.textContent = canvas.toDataURL('image/png');
      document.body.appendChild(pre);
    }
    post({ type: 'ready' });
  } else if (wantRun) {
    resume();
  }
}
loadCat().then(start, (err) => post({ type: 'error', message: 'cat.glb: ' + (err?.message || err) }));
