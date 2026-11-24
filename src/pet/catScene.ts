// =============================================================
// 3D 마스코트 장면 — public/mascot3d/cat.glb (DietCalc 용으로 만든 털뭉치 고양이)를
// three.js 로 띄우고, 만지면 반응하게 한다.
//
// - 털: GLB 에는 매끈한 몸통만 들어 있다(블렌더 털은 내보내지지 않는다).
//   그래서 몸·귀·발을 "껍질 겹치기(shell fur)"로 다시 그린다 — 같은 모양을 바깥으로
//   조금씩 부풀려 여러 겹 그리고, 겹마다 점무늬로 구멍을 내면 털처럼 보인다.
// - 만지기: 톡(tap) = 폴짝, 문지르기(pet) = 눌리면서 눈웃음, 몸 밖을 끌면 좌우로 돌려 보기.
// - 화면(React)과는 이벤트로만 이야기한다: onEvent / act().
// =============================================================
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

const SHELLS = 26;
const ZERO = new THREE.Vector2();
const CENTER = new THREE.Vector3(0, 0.47, 0.02); // 몸통 가운데 (모델 좌표)
const FACE = new THREE.Vector3(0, 0.44, 0.58); // 얼굴 가운데 — 이 근처는 털을 짧게

const FUR_VERT = /* glsl */ `
uniform float uShells, uLen;
uniform vec3 uCenter, uFace, uTouch, uSway;
uniform float uPress, uFaceR, uFaceShort;
uniform mat4 uRootInv, uRoot;
attribute vec3 color;
varying float vH;
varying vec3 vDir, vN, vCol;
void main() {
  float h = float(gl_InstanceID) / (uShells - 1.0);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec3 wn = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
  // 루트(고양이 전체) 기준 좌표로 옮겨서 계산 — 폴짝 뛰거나 돌아도 얼굴·손끝 위치가 따라온다
  vec3 rp = (uRootInv * wp).xyz;
  vec3 rn = normalize(mat3(uRootInv) * wn);
  float len = uLen;
  len *= 1.0 - uFaceShort * (1.0 - smoothstep(uFaceR * 0.45, uFaceR, distance(rp, uFace)));
  float pr = uPress * (1.0 - smoothstep(0.0, 0.42, distance(rp, uTouch)));
  rp -= rn * pr * 0.05;
  len *= 1.0 - 0.6 * pr;
  rp += rn * len * h;
  rp += (vec3(0.0, -0.025, 0.0) + uSway) * h * h; // 털끝이 살짝 처지고, 움직이면 늦게 따라온다
  vH = h;
  vDir = normalize(position - uCenter);
  vN = rn;
  vCol = color;
  gl_Position = projectionMatrix * viewMatrix * uRoot * vec4(rp, 1.0);
}`;

const FUR_FRAG = /* glsl */ `
precision highp float;
uniform float uDensity;
varying float vH;
varying vec3 vDir, vN, vCol;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// 구 방향 → 평면 (팔면체 펼치기). 극점에서 무늬가 뭉치지 않는다.
vec2 oct(vec3 n) {
  vec3 a = abs(n);
  vec2 o = n.xz / (a.x + a.y + a.z);
  if (n.y < 0.0) o = (1.0 - abs(o.yx)) * vec2(o.x >= 0.0 ? 1.0 : -1.0, o.y >= 0.0 ? 1.0 : -1.0);
  return o;
}
void main() {
  vec2 uv = oct(normalize(vDir)) * uDensity;
  vec2 cell = floor(uv);
  vec2 f = fract(uv) - 0.5;
  float r = hash(cell);
  vec2 off = (vec2(hash(cell + 7.3), hash(cell + 3.1)) - 0.5) * 0.5;
  float strand = 0.35 + 0.65 * r; // 가닥마다 길이가 다르다
  if (vH > 0.001) {
    if (vH > strand) discard;
    if (length(f - off) > 0.62 * (1.0 - vH / strand)) discard;
  }
  vec3 n = normalize(vN);
  float light = dot(n, normalize(vec3(-0.35, 0.8, 0.55))) * 0.5 + 0.5;
  vec3 c = vCol * mix(0.80, 1.0, pow(vH, 0.6)); // 뿌리는 어둡게 = 털 사이 그늘
  c *= mix(0.86, 1.08, light);
  c = mix(c, vec3(1.0, 0.80, 0.86), smoothstep(0.0, -1.0, n.y) * 0.35); // 아래쪽은 분홍 그늘
  c += vec3(0.05) * pow(vH, 3.0) * r; // 털끝 반짝
  gl_FragColor = vec4(min(c, 1.0), 1.0);
}`;

interface Spring {
  v: number; // 값
  s: number; // 속도
}
function step(sp: Spring, target: number, k: number, d: number, dt: number) {
  sp.s += ((target - sp.v) * k - sp.s * d) * dt;
  sp.v += sp.s * dt;
}

export async function createCatScene(
  host: HTMLElement,
  url: string,
  onEvent: (e: PetEvent) => void,
): Promise<CatScene> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:none;";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.95, 4.6);
  camera.lookAt(0, 0.42, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffd9e6, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-2, 3, 3);
  scene.add(key);

  const gltf = await new GLTFLoader().loadAsync(url);
  const root = new THREE.Group(); // 발바닥(y=0)이 중심 — 눌리면 바닥에 붙은 채 납작해진다
  scene.add(root);
  root.add(gltf.scene);

  // 블렌더 장면에 딸려 온 카메라·조명·바닥은 뺀다
  const drop: THREE.Object3D[] = [];
  gltf.scene.traverse((o) => {
    if ((o as THREE.Light).isLight || (o as THREE.Camera).isCamera || o.name === "ENV_floor") drop.push(o);
  });
  drop.forEach((o) => o.removeFromParent());

  const node = (name: string) => gltf.scene.getObjectByName(name) as THREE.Object3D;
  const earL = node("CAT_ear_L");
  const earR = node("CAT_ear_R");
  const eyeL = node("CAT_eye_L");
  const eyeR = node("CAT_eye_R");
  const mouth = node("CAT_mouth");
  const tongue = node("CAT_tongue");
  const pawL = node("CAT_paw_FL");
  const pawR = node("CAT_paw_FR");
  const earRest = [earL.rotation.z, earR.rotation.z];
  const eyeRest = eyeL.scale.clone();
  const mouthRest = mouth.scale.clone();
  const tongueRest = tongue.scale.clone();
  const pawRest = [pawL.position.clone(), pawR.position.clone()];

  // ── 털 입히기
  const shared = {
    uShells: { value: SHELLS },
    uFace: { value: FACE },
    uTouch: { value: new THREE.Vector3(0, 9, 0) },
    uPress: { value: 0 },
    uSway: { value: new THREE.Vector3() },
    uRootInv: { value: new THREE.Matrix4() },
    uRoot: { value: new THREE.Matrix4() },
  };
  const disposables: { dispose(): void }[] = [renderer];
  const furOf = (name: string): [number, number, number, number] | null => {
    // [털 길이, 무늬 촘촘함, 얼굴 반경, 얼굴에서 줄이는 정도]
    if (name === "CAT_body") return [0.13, 120, 0.66, 0.9];
    if (name.startsWith("CAT_ear_")) return [0.075, 46, 0.0, 0.0];
    if (name.startsWith("CAT_paw_")) return [0.05, 34, 0.0, 0.0];
    return null;
  };
  const furTargets: THREE.Mesh[] = [];
  gltf.scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && furOf(m.name)) furTargets.push(m);
  });
  for (const m of furTargets) {
    const [len, density, faceR, faceShort] = furOf(m.name)!;
    const mat = new THREE.ShaderMaterial({
      vertexShader: FUR_VERT,
      fragmentShader: FUR_FRAG,
      uniforms: {
        ...shared,
        uLen: { value: len },
        uDensity: { value: density },
        uFaceR: { value: faceR },
        uFaceShort: { value: faceShort },
        uCenter: { value: m.name === "CAT_body" ? CENTER : new THREE.Vector3() },
      },
    });
    const fur = new THREE.InstancedMesh(m.geometry, mat, SHELLS);
    fur.frustumCulled = false;
    fur.name = m.name + "_fur";
    m.add(fur);
    // 원래 매끈한 면은 숨긴다 (자식인 털은 계속 그려지게 재질만 끈다)
    (m.material as THREE.Material).visible = false;
    disposables.push(mat);
  }

  // ── 눈웃음(^ ^) / 잠든 눈(‿ ‿) — 눈 자리에 얹는 반원
  const ink = new THREE.MeshBasicMaterial({ color: 0x3a1a12 });
  const arcGeo = new THREE.TorusGeometry(0.062, 0.014, 8, 20, Math.PI);
  disposables.push(ink, arcGeo);
  const arcs = [eyeL, eyeR].map((eye) => {
    const arc = new THREE.Mesh(arcGeo, ink);
    arc.position.copy(eye.position);
    arc.position.z += 0.035;
    arc.position.y -= 0.02;
    arc.visible = false;
    eye.parent!.add(arc);
    return arc;
  });

  // ── 쿠키 (간식)
  const cookie = new THREE.Group();
  const dough = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.035, 24),
    new THREE.MeshStandardMaterial({ color: 0xd9a05b, roughness: 0.9 }),
  );
  dough.rotation.x = Math.PI / 2;
  cookie.add(dough);
  const chipMat = new THREE.MeshStandardMaterial({ color: 0x5a2d1a, roughness: 0.8 });
  const chipGeo = new THREE.SphereGeometry(0.018, 8, 6);
  [[-0.05, 0.04], [0.04, 0.05], [0.0, -0.03], [0.06, -0.04], [-0.06, -0.04]].forEach(([x, y]) => {
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(x, y, 0.02);
    cookie.add(chip);
  });
  cookie.position.set(0, 0.3, 0.74);
  cookie.visible = false;
  root.add(cookie);
  disposables.push(dough.geometry, dough.material as THREE.Material, chipMat, chipGeo);

  // ── 바닥 그림자
  const sc = document.createElement("canvas");
  sc.width = sc.height = 128;
  const g = sc.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, "rgba(150,90,130,0.38)");
  grad.addColorStop(1, "rgba(150,90,130,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(sc);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const shadowGeo = new THREE.PlaneGeometry(2.3, 1.3);
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.005, 0.1);
  scene.add(shadow);
  disposables.push(shadowTex, shadowMat, shadowGeo);

  // ── 손가락이 닿았는지 재는 보이지 않는 타원
  const proxyGeo = new THREE.SphereGeometry(1, 16, 12);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
  const proxy = new THREE.Mesh(proxyGeo, proxyMat);
  proxy.position.copy(CENTER);
  proxy.scale.set(0.82, 0.6, 0.72);
  root.add(proxy);
  disposables.push(proxyGeo, proxyMat);

  // ── 상태
  type Mode = "idle" | "sleep" | "eat";
  let mode: Mode = "idle";
  let eatT = 0;
  let jumpT = -1; // 폴짝 진행 시간 (-1 = 안 뛰는 중)
  let jumpH = 0.22;
  let spinT = -1;
  let happyT = 0; // 남은 "기분 좋음" 시간 — 눈웃음 유지
  let blinkT = 2;
  let blinking = 0;
  let earT = 3;
  let earKick = 0;
  const squash: Spring = { v: 0, s: 0 };
  const yaw: Spring = { v: 0, s: 0 };
  const tilt: Spring = { v: 0, s: 0 };
  let yawTarget = 0;
  let press = 0;
  let pressTarget = 0;
  const look = new THREE.Vector2();
  const lookTarget = new THREE.Vector2();
  const sway = new THREE.Vector3();
  let prevY = 0;
  let prevYaw = 0;

  // ── 포인터
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down: null | { x: number; y: number; t: number; onCat: boolean; moved: number; stroke: number; lx: number; ly: number } = null;
  const hit = (e: PointerEvent): THREE.Vector3 | null => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObject(proxy, false)[0];
    return h ? root.worldToLocal(h.point.clone()) : null;
  };
  const local = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onDown = (e: PointerEvent) => {
    canvas.setPointerCapture(e.pointerId);
    const p = hit(e);
    down = { x: e.clientX, y: e.clientY, t: performance.now(), onCat: !!p, moved: 0, stroke: 0, lx: e.clientX, ly: e.clientY };
    if (p && mode !== "sleep") {
      shared.uTouch.value.copy(p);
      pressTarget = 1;
    }
  };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    lookTarget.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (!down) return;
    const d = Math.hypot(e.clientX - down.lx, e.clientY - down.ly);
    down.moved += d;
    down.lx = e.clientX;
    down.ly = e.clientY;
    if (!down.onCat) {
      yawTarget = THREE.MathUtils.clamp((e.clientX - down.x) / 120, -0.9, 0.9);
      return;
    }
    if (mode === "sleep") return;
    const p = hit(e);
    if (p) {
      shared.uTouch.value.copy(p);
      pressTarget = 1;
      if (down.moved > 14) {
        down.stroke += d;
        happyT = Math.max(happyT, 0.6);
        if (down.stroke > 46) {
          down.stroke = 0;
          onEvent({ type: "pet", ...local(e) });
        }
      }
    } else pressTarget = 0;
  };
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    const quick = performance.now() - down.t < 320 && down.moved < 14;
    if (down.onCat && quick) {
      if (mode === "sleep") {
        setMode("idle");
        onEvent({ type: "wake" });
      } else onEvent({ type: "tap", ...local(e) });
      hop(0.2);
      happyT = Math.max(happyT, 0.7);
    }
    down = null;
    pressTarget = 0;
    yawTarget = 0;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  function hop(h: number) {
    if (jumpT >= 0) return;
    jumpT = 0;
    jumpH = h;
    squash.s -= 1.6; // 뛰기 직전 움찔
  }
  function setMode(m: Mode) {
    mode = m;
    eatT = 0;
    cookie.visible = m === "eat";
    cookie.scale.setScalar(1);
  }

  // ── 크기 맞추기
  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // 세로로 긴 칸에서도 고양이가 옆으로 잘리지 않게 시야각을 넓힌다
    camera.fov = w / h < 1 ? 26 / Math.max(w / h, 0.6) : 26;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // ── 매 프레임
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let announced = false;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;
    const asleep = mode === "sleep";

    press += (pressTarget - press) * Math.min(1, dt * 14);
    shared.uPress.value = press;
    happyT = Math.max(0, happyT - dt);

    // 숨쉬기 + 눌림 + 폴짝
    const breath = Math.sin(t * (asleep ? 1.3 : 2.4)) * (asleep ? 0.03 : 0.014);
    step(squash, -0.1 * press - (asleep ? 0.07 : 0), 170, 13, dt);
    let y = 0;
    if (jumpT >= 0) {
      jumpT += dt;
      const p = jumpT / 0.42;
      if (p >= 1) {
        jumpT = -1;
        squash.s -= 1.9; // 착지 — 철퍽
      } else y = Math.sin(p * Math.PI) * jumpH;
    }
    let spin = 0;
    if (spinT >= 0) {
      spinT += dt;
      const p = Math.min(spinT / 0.8, 1);
      spin = (1 - Math.pow(1 - p, 3)) * Math.PI * 2;
      if (p >= 1) spinT = -1;
    }
    const sy = 1 + squash.v + breath;
    const sxz = 1 - (squash.v + breath) * 0.55;
    step(yaw, yawTarget, 60, 10, dt);
    step(tilt, press * -shared.uTouch.value.x * 0.22, 90, 12, dt);
    root.position.y = y;
    root.scale.set(sxz, sy, sxz);
    root.rotation.set(0, yaw.v + spin, tilt.v);
    shadow.scale.setScalar(1 - y * 0.9);
    shadowMat.opacity = 1 - y * 1.6;

    // 털이 움직임을 늦게 따라온다
    const vy = (y - prevY) / Math.max(dt, 0.001);
    const vyaw = (yaw.v + spin - prevYaw) / Math.max(dt, 0.001);
    prevY = y;
    prevYaw = yaw.v + spin;
    sway.x += (THREE.MathUtils.clamp(-vyaw * 0.02, -0.06, 0.06) - sway.x) * Math.min(1, dt * 8);
    sway.y += (THREE.MathUtils.clamp(-vy * 0.03, -0.05, 0.05) - sway.y) * Math.min(1, dt * 8);
    shared.uSway.value.copy(sway);

    // 눈: 깜빡임 / 눈웃음 / 잠
    const smiling = !asleep && (happyT > 0 || (press > 0.5 && !!down && down.moved > 14));
    blinkT -= dt;
    if (blinkT <= 0) {
      blinking = 0.14;
      blinkT = 2.2 + Math.random() * 3;
    }
    blinking = Math.max(0, blinking - dt);
    const open = !asleep && !smiling;
    eyeL.visible = eyeR.visible = open;
    const lid = blinking > 0 ? 0.12 : 1;
    eyeL.scale.set(eyeRest.x, eyeRest.y * lid, eyeRest.z);
    eyeR.scale.copy(eyeL.scale);
    arcs.forEach((a) => {
      a.visible = !open;
      a.rotation.z = asleep ? Math.PI : 0; // 잠 = 아래로 볼록, 웃음 = 위로 볼록
      a.position.y = (asleep ? 0.03 : -0.02) + eyeL.position.y;
    });
    // 눈동자가 손가락을 따라간다 (눈 전체를 살짝 민다)
    look.lerp(asleep ? ZERO : lookTarget, Math.min(1, dt * 6));
    const baseX = Math.abs(eyeR.position.x);
    eyeL.position.x = -baseX + look.x * 0.012;
    eyeR.position.x = baseX + look.x * 0.012;

    // 귀 쫑긋
    earT -= dt;
    if (earT <= 0) {
      earKick = 1;
      earT = 2.5 + Math.random() * 4;
    }
    earKick = Math.max(0, earKick - dt * 4);
    const wiggle = Math.sin(earKick * Math.PI * 3) * 0.16 * earKick + press * 0.18 + (asleep ? 0.12 : 0);
    earL.rotation.z = earRest[0] + wiggle;
    earR.rotation.z = earRest[1] - wiggle;

    // 입
    let mo = asleep ? 0.25 : smiling ? 1.25 : 0.8 + Math.sin(t * 2.4) * 0.05;
    if (mode === "eat") {
      eatT += dt;
      mo = 0.35 + Math.abs(Math.sin(eatT * 9)) * 1.0;
      const bites = Math.floor(eatT / 0.7);
      cookie.scale.setScalar(Math.max(0, 1 - bites * 0.3));
      cookie.rotation.z = Math.sin(eatT * 9) * 0.08;
      const lift = Math.min(eatT * 4, 1) * 0.16;
      pawL.position.set(pawRest[0].x + 0.07, pawRest[0].y + lift, pawRest[0].z + 0.08);
      pawR.position.set(pawRest[1].x - 0.07, pawRest[1].y + lift, pawRest[1].z + 0.08);
      if (eatT > 2.6) {
        setMode("idle");
        happyT = 1.4;
        hop(0.22);
        onEvent({ type: "ate" });
      }
    } else {
      pawL.position.lerp(pawRest[0], Math.min(1, dt * 8));
      pawR.position.lerp(pawRest[1], Math.min(1, dt * 8));
    }
    mouth.scale.set(mouthRest.x, mouthRest.y * mo, mouthRest.z);
    tongue.scale.set(tongueRest.x, tongueRest.y * Math.min(mo, 1.2), tongueRest.z);
    tongue.visible = mo > 0.5;

    root.updateMatrixWorld(true);
    shared.uRoot.value.copy(root.matrixWorld);
    shared.uRootInv.value.copy(root.matrixWorld).invert();
    renderer.render(scene, camera);
    if (!announced) {
      announced = true;
      onEvent({ type: "ready" });
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
    act(action) {
      if (action === "snack") {
        setMode("eat");
      } else if (action === "play") {
        if (mode !== "idle") setMode("idle");
        hop(0.34);
        spinT = 0;
        happyT = 1.2;
      } else if (action === "cheer") {
        hop(0.3);
        spinT = 0;
        happyT = 2;
      } else if (action === "sleep") {
        setMode("sleep");
      } else if (action === "wake") {
        setMode("idle");
        hop(0.14);
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      gltf.scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
      });
      disposables.forEach((d) => d.dispose());
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
