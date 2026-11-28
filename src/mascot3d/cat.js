import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// ?url: 735KB 짜리라 번들에 박지 않고 dist/assets 에 해시 파일로 떨군다 (SW 프리캐시가 자동으로 줍는다).
import glbUrl from './cat.glb?url';

// 이 고양이(cat.js·eat.js·main.js·cat.glb)는 calorie-clicker 프로젝트에서 가져왔다.
// 모양·표정·동작은 그쪽 Blender 파일에서 만들고 GLB 도 그쪽에서 다시 뽑는다 —
// 고칠 일이 생기면 거기서 재생성한 cat.glb 를 이 폴더에 덮어쓰기만 하면 된다.
// Here: fur (shell shader over the GLB's body/ears/paws), face materials, shadow. Blender meters x SCALE = app units.
const SCALE = 1.5;

export function loadCat() {
  return new GLTFLoader().loadAsync(glbUrl);
}

// Blush = round blob on each cheek (reference sheet), centered where Blender painted it (COLOR_0, see cheeks()).
const blushGLSL = /* glsl */ `
float blushW(vec3 p){
  vec3 s = vec3(1.0/1.3, 1.0, 1.0); // wider than tall (= shape_tripo.py CHEEK stretch)
  return smoothstep(uCheekRad.y, uCheekRad.x, min(length((p-uCheekL)*s), length((p-uCheekR)*s)));
}`;

// Ear pink = soft oval on the ear's front face (ear-local: +z = front, +y = up), painted inside the ear's own fur:
// no separate mesh -> no hard edge; fades out into the white rim, deepest low in the hollow.
const earPinkGLSL = /* glsl */ `
float earPinkW(vec3 p, vec3 n){
  float t = clamp((p.y - uPinkC.y)/uPinkR.y, -1.0, 1.0); // narrower toward the tip = follows the ear's triangle
  vec2 d = (p.xy - uPinkC.xy)/(uPinkR*vec2(1.0 - 0.75*max(t, 0.0), 1.0));
  return smoothstep(1.0, 0.5, length(d))*smoothstep(-0.2, 0.5, n.z);
}`;

// Shell-textured fur. Each part = opaque base mesh + InstancedMesh of N shells
// (gl_InstanceID -> shell height), drawn inside-out in one call. Positions are the GLB's local meters.
// COLOR_0 = color x baked AO (cream / blush / pink all have R = 1, so ao = R and albedo = rgb / R).
const vert = /* glsl */ `
uniform float uLayers, uThick, uShell, uLump, uGrav, uFaceOn, uFurK, uTop, uSide, uTuftL, uFront, uEyeRad, uFloor, uCurl, uCurlF;
uniform vec3 uEyeL, uEyeR, uMouth, uCheekL, uCheekR, uPinkC; uniform vec2 uCheekRad, uPinkR;
varying vec3 vBase; varying vec3 vN; varying vec3 vNV; varying vec3 vView; varying vec3 vCol;
varying float vH, vAO, vBlush, vCurl;
float lump(vec3 p){
  return 0.6*sin(p.x*6.1+1.3*sin(p.y*4.7))*sin(p.y*5.9+p.z*2.3)*sin(p.z*5.3+p.x*3.1)
       + 0.6*sin(p.x*3.3+p.z*1.7)*sin(p.y*3.1+1.0)*sin(p.z*2.9+p.y*1.3);
}
float faceD(vec3 p){ return min(min(length(p-uEyeL), length(p-uEyeR)) - uEyeRad, length(p-uMouth) - 0.09); } // uEyeRad: smaller when the eyes are closed lines
${blushGLSL}
${earPinkGLSL}
void main(){
  float h = uShell > 0.5 ? (float(gl_InstanceID)+1.0)/uLayers : 0.0;
  vec3 n = normalize(normal);
  vAO = color.r; vCol = color/max(color.r, 1e-3);
  vBlush = uFaceOn > 0.5 ? blushW(position) : 0.0;
  float len = 1.0;
  if (uFaceOn > 0.5) { // same length map as the Blender particle hair (build_fluff.py lenfn)
    float fd = faceD(position);
    len = (1.0 + uSide*smoothstep(0.3, 0.62, abs(position.x)) + 0.5*smoothstep(0.16, 0.0, length(position - vec3(0.0, 0.92, 0.0))) + uTop*smoothstep(0.55, 0.85, position.y))
        * (1.0 - 0.75*smoothstep(0.14, 0.0, fd) - 0.5*vBlush)
        * mix(0.2, 1.0, smoothstep(0.0, uFloor, position.y)); // short fur along the ground -> clean bottom curve, no wisps under the body
  }
  len *= 1.0 - uFront*earPinkW(position, n); // ears: short fur over the pink hollow, full-length white rim around it
  len *= 1.0 + uTuftL*lump(position*7.0); // short-period length variation -> outline reads as soft tufts
  vCurl = lump(position*uCurlF); // one octave finer: small wool clumps (sheep-like), bumps the length and shades the gaps
  len *= 1.0 + uCurl*vCurl;
  vec3 p = position + n*h*(uThick*len*uFurK + uLump*lump(position*1.5));
  if (uFaceOn > 0.5) p.y = max(p.y, 0.0); // body shells never dip below the ground
  vec4 wp = modelMatrix*vec4(p,1.0);
  wp.y -= uGrav*h*h;
  vec4 mv = viewMatrix*wp;
  gl_Position = projectionMatrix*mv;
  vBase = position; vN = n; vNV = normalize(normalMatrix*n); vView = normalize(-mv.xyz); vH = h;
}`;

const frag = /* glsl */ `
uniform sampler2D uNoise;
uniform vec3 uShade, uEyeL, uEyeR, uMouth, uBlushCol, uCheekL, uCheekR, uPinkC; uniform vec2 uCheekRad, uPinkR;
uniform float uBlushK, uCurlF, uCurlAO, uEyeRad, uPink, uPinkTop, uDensity, uFaceOn, uShell, uAlpha, uRootAO, uSat, uBright, uStreak, uAOk, uSoft, uThr, uFade, uLift, uEdge, uLayers, uDither, uTuft;
uniform vec3 uTint;
varying vec3 vBase; varying vec3 vN; varying vec3 vNV; varying vec3 vView; varying vec3 vCol;
varying float vH, vAO, vBlush, vCurl;
float uClump;
float faceD(vec3 p){ return min(min(length(p-uEyeL), length(p-uEyeR)) - uEyeRad, length(p-uMouth) - 0.09); } // uEyeRad: smaller when the eyes are closed lines
${blushGLSL}
${earPinkGLSL}
// soft fibers: linear-filtered noise (fine) + low-freq clumps, thresholded by shell height
float strand(vec2 q, float h){
  float n = texture2D(uNoise, q*uDensity/64.0).r;
  float m = texture2D(uNoise, q*uDensity/64.0*0.23+0.37).g;
  float v = mix(n, m, uTuft)*uClump; // uTuft: share of low-freq clumps -> outer shells break into tufts
  return smoothstep(h*uThr, h*uThr+uSoft, v);
}
void main(){
  vec3 n = normalize(vN);
  vec3 b = vBase*1.5; // noise space = app units (keeps the tuned densities)
  float h = vH;
  float kill = 0.0;
  if (uFaceOn > 0.5) kill = max(smoothstep(0.07, 0.0, faceD(vBase)), 0.9*smoothstep(0.06, 0.0, vBase.y));
  vec3 N = normalize(vNV);
  float diff = dot(N, normalize(vec3(-0.35,0.75,0.55)))*0.5+0.5;
  float ndv = clamp(dot(N, normalize(vView)), 0.0, 1.0);
  // Blender look (AgX, particle hair): near-neutral grey-white, soft, with darker clumps of shadowed strands
  float ao = mix(uRootAO, 1.0, pow(h, 0.7)) * mix(1.0, vAO, uAOk*(1.0 - h*0.5));
  float clumpShade = texture2D(uNoise, b.xy*0.11 + b.z*0.05).b*0.6 + texture2D(uNoise, b.yz*0.07+0.5).a*0.4;
  ao *= 1.0 - uStreak*smoothstep(0.35, 0.75, clumpShade)*(1.0 - h*0.6);
  ao *= 1.0 - uCurlAO*smoothstep(0.3, -0.6, vCurl)*(1.0 - h*0.7); // darker between wool clumps
  vec3 alb = mix(vec3(dot(vCol, vec3(0.2126, 0.7152, 0.0722))), vCol, uSat)*uBright*uTint;
  if (uFaceOn > 0.5) alb = mix(alb, uBlushCol, blushW(vBase)*uBlushK); // round cheek blob, per pixel (mesh is too coarse for a crisp edge)
  // ear pink: per pixel, deeper low in the hollow, paler toward the rim and on the fur tips
  if (uPink > 0.0) alb = mix(alb, uBlushCol, uPink*earPinkW(vBase, n)*mix(1.0, uPinkTop, smoothstep(uPinkC.y - 0.04, uPinkC.y + uPinkR.y, vBase.y))*(1.0 - 0.35*h));
  vec3 col = mix(alb*mix(uShade, vec3(1.0), diff)*ao, alb, uLift); // uLift: ears read as soft bumps, not grey slabs
  float a = 1.0;
  if (uShell > 0.5) {
    uClump = 0.85+0.25*sin(b.x*9.0+sin(b.y*7.0))*sin(b.y*8.0+b.z*5.0);
    vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x+w.y+w.z);
    // per-pixel dither of the shell height (+-uDither shell steps): hides the discrete shell layers (rings)
    float hd = h + (fract(52.9829189*fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5)*uDither/uLayers;
    float s = strand(b.yz,hd)*w.x + strand(b.xz,hd)*w.y + strand(b.xy,hd)*w.z;
    a = s*mix(1.0-h*0.5, pow(1.0-h, 1.5), uFade)*(1.0-kill)*uAlpha;
    // shells seen edge-on (silhouette) stack into visible rings -> fade outer shells there
    a *= mix(1.0, smoothstep(0.0, uEdge, ndv), sqrt(h));
    if (a < 0.02) discard;
  }
  col += vec3(1.0)*pow(1.0-ndv, 2.5)*0.3*(0.5+0.5*h);
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;

// face parts (eyes, mouth, lines): flat color + soft key light + optional gloss
const faceVert = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vLP; varying vec3 vMP;
#include <common>
#include <morphtarget_pars_vertex>
void main(){
  #include <begin_vertex>
  #include <morphtarget_vertex>
  vN = normalize(normalMatrix*normal); vLP = position; vMP = transformed;
  vec4 mv = modelViewMatrix*vec4(transformed,1.0); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv;
}`;
const faceFrag = /* glsl */ `
uniform vec3 uColor, uLow, uRimCol; uniform float uGloss, uRim, uEye, uOpen; uniform vec4 uEyeP; uniform vec2 uMS;
varying vec3 vN; varying vec3 vV; varying vec3 vLP; varying vec3 vMP;
void main(){
  vec3 N = normalize(gl_FrontFacing ? vN : -vN);
  vec3 L = normalize(vec3(-0.35,0.75,0.55));
  float d = dot(N, L)*0.5+0.5;
  vec3 col = mix(uLow, uColor, smoothstep(-0.7, 0.3, N.y)) * (0.8 + 0.3*d);
  col += uGloss*pow(max(dot(reflect(-L, N), normalize(vV)), 0.0), 24.0)*0.35;
  col += uGloss*vec3(0.55,0.32,0.22)*pow(1.0-clamp(dot(N, normalize(vV)),0.0,1.0), 3.0);
  if (uEye != 0.0 && uOpen > 0.5) { // bead-eye detail (reference), in the mesh's own (pre-morph) coords. Colors are linear
    vec2 p = vec2(vLP.x*uEye, vLP.y); float r = length(p); // x flipped per eye: +x = toward the nose
    col = mix(col, vec3(0.30, 0.10, 0.055)*(0.8 + 0.35*d), smoothstep(0.05, -0.85, p.y)); // warm lighter-brown lower half (icon)
    col = mix(col, vec3(0.62, 0.30, 0.24), 0.8*uEyeP.y*smoothstep(0.38, 0.0, length((p - vec2(-0.42, -0.5))*vec2(1.0, 1.15)))); // soft warm glow, lower-outer
    col = mix(col, vec3(0.03, 0.01, 0.008), uEyeP.z*smoothstep(0.84, 0.95, r)); // thin dark outline
    float h = length((p - vec2(0.4, 0.5))*vec2(1.0, 0.92));
    col = mix(col, vec3(0.6, 0.64, 0.79), 0.45*uEyeP.w*smoothstep(0.36, 0.24, h)); // big highlight, upper-inner: soft bluish halo + white core
    col = mix(col, vec3(1.0), smoothstep(0.25, 0.22, h));
    col = mix(col, vec3(1.0), smoothstep(0.095, 0.07, length(p - vec2(0.52, 0.08)))); // small dot under it
    col = mix(col, vec3(1.0, 0.93, 0.93), smoothstep(0.22, 0.13, length(p - vec2(-0.42, -0.45)))); // 2nd-largest highlight: soft warm-white glint in the lower-outer glow
  }
  if (uRim > 0.0) { // U outline in the mesh's own (pre-morph, glTF y-up) coords = shape_tripo.py mouth_u(): half-width 0.95, straight sides above y=-0.173 (mouth_u() prints zc), round bottom (radius 0.756 = 0.95*scale x/z) below; the mesh is a bit larger, outside the U is cut away
    vec2 m = vec2(vLP.x/0.95, vLP.y);
    float u = m.y > -0.173 ? abs(m.x) : length(vec2(m.x, (m.y + 0.173)/0.756));
    if (u > 1.0) discard; // visible mouth = exactly this U -> even outline all around
    // nothing above the ω line's centerline (morphed coords; shape_tripo.py omega_tube() prints OMEGA_CLIP: see the constants on the clipY line).
    // The squashed mouth (nom / chewB) otherwise pokes out above the line
    float clipY = 0.541 + 0.286*pow(max(0.0, 0.66 - 0.705*abs(vMP.x))/0.66, 1.8); // OMEGA_CLIP from shape_tripo.py omega_tube(): bottom 0.521 (+0.02), rise 0.286, slope 0.705, low 0.66, power 1.8
    if (vMP.y > clipY) discard;
    float tg = smoothstep(0.05, -0.05, m.y - 0.05 + 0.3*m.x*m.x); // broad round-topped tongue filling most of the U
    col = mix(col, vec3(0.93, 0.42, 0.5)*(0.85 + 0.2*d)*(1.0 - 0.12*smoothstep(0.07, 0.0, abs(m.x))*smoothstep(-0.5, 0.2, m.y)), tg); // + faint center groove
    // outline as thick as the ω tube (uRim = tube diameter / mouth half-width, shape_tripo.py: 2*line_r / (0.95*scale x)), all around.
    // uMS = (x, vertical) scale of the current nom/bite morph, so the stroke keeps its thickness when the mouth is stretched or squashed;
    // at least 30% of the radius stays inside (50% when squashed), otherwise the half-closed mouth (chewB) would be all outline
    vec2 e = m.y > -0.173 ? vec2(1.0, 0.0) : normalize(vec2(m.x, (m.y + 0.173)/0.756) + 1e-5);
    float rs = max(0.3 + 0.2*clamp((1.0 - uMS.y)/0.5, 0.0, 1.0), 1.0 - uRim/length(e*uMS)); // squashed (chewB): keep half of the radius for the tongue, the stroke gets thinner there
    col = mix(col, uRimCol, smoothstep(rs - 0.04, rs + 0.03, u));
    col = mix(col, uRimCol, clamp((1.0 - uMS.y)/0.5, 0.0, 1.0)*smoothstep(clipY - 0.24, clipY - 0.17, vMP.y)); // squashed: the strip right under the ω line joins the outline (no pink specks beside the nose)
  }
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

function faceMat(color, low = color, gloss = 0) {
  return new THREE.ShaderMaterial({
    vertexShader: faceVert, fragmentShader: faceFrag,
    uniforms: { uColor: { value: new THREE.Color(color) }, uLow: { value: new THREE.Color(low) }, uGloss: { value: gloss }, uRim: { value: 0 }, uRimCol: { value: new THREE.Color('#4a2216') }, uMS: { value: new THREE.Vector2(1, 1) }, uEye: { value: 0 }, uOpen: { value: 1 }, uEyeP: { value: new THREE.Vector4(0.88, 1, 1, 1) } },
  });
}

function noiseTexture(rand) {
  const d = new Uint8Array(64 * 64 * 4);
  for (let i = 0; i < d.length; i++) d[i] = rand() * 255;
  const t = new THREE.DataTexture(d, 64, 64);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

// cheek centers = weighted mean of the blush-painted body vertices (COLOR_0 g/r drops on the blush), one per side
function cheeks(geo) {
  const p = geo.attributes.position, c = geo.attributes.color;
  const acc = [new THREE.Vector4(), new THREE.Vector4()];
  for (let i = 0; i < p.count; i++) {
    const w = Math.max(0, 0.9 - c.getY(i) / Math.max(c.getX(i), 1e-3));
    if (w > 0) acc[p.getX(i) < 0 ? 0 : 1].add(new THREE.Vector4(p.getX(i) * w, p.getY(i) * w, p.getZ(i) * w, w));
  }
  return acc.map((a) => new THREE.Vector3(a.x, a.y, a.z).divideScalar(a.w || 1));
}

export const SHELLS_HIGH = 12;
export const SHELLS_LOW = 8;
// fewer shells = wider gaps between them; shorten the fur a bit so the silhouette doesn't show plates
const furK = (n) => (n >= SHELLS_HIGH ? 1 : 0.9);
const EYE_OPEN = 0.09, EYE_SHUT = 0.045; // fur-free radius around each eye (m): round eye vs closed line
export const EXPRESSIONS = ['normal', 'blink', 'happy', 'squint', 'bite', 'chewA', 'chewB'];

const q = (k) => new URLSearchParams(location.search).get(k); // ?sat=&bright=&streak=&aok=&fur= : look tuning (dev)

export function buildCat({ gltf, rand, shells }) {
  const model = gltf.scene;
  const node = (n) => model.getObjectByName(n);
  model.updateMatrixWorld(true);
  const body = node('CAT_body');
  const inBody = (n) => body.worldToLocal(node(n).getWorldPosition(new THREE.Vector3()));
  const cheek = cheeks(body.geometry);
  const shared = {
    uNoise: { value: noiseTexture(rand) },
    uLayers: { value: shells },
    uFurK: { value: furK(shells) },
    uGrav: { value: Number(q('grav') ?? 0.015) },
    uShade: { value: new THREE.Color('#' + (q('shade') ?? 'f2e1d6')) },
    uBlushCol: { value: new THREE.Color('#' + (q('blush') ?? 'f3b4c3')) },
    uSat: { value: Number(q('sat') ?? 0.8) },
    uBright: { value: Number(q('bright') ?? 1.14) },
    uStreak: { value: Number(q('streak') ?? 0) },
    uSoft: { value: Number(q('soft') ?? 0.12) },
    uThr: { value: Number(q('thr') ?? 0.9) },
    uFade: { value: Number(q('fade') ?? 0.6) },
    uEdge: { value: Number(q('edge') ?? 0.35) }, // silhouette fade width (ndv): outer shells fade where seen edge-on (stops ring banding)
    uDither: { value: Number(q('dither') ?? 1.3) },
    uTuft: { value: Number(q('tuft') ?? 0.2) },
    uTuftL: { value: Number(q('tuftl') ?? 0.65) },
    uTint: { value: new THREE.Color('#' + (q('tint') ?? 'fff6f6')) }, // warm pink plush tint
    uTop: { value: Number(q('top') ?? 0.15) },
    uSide: { value: Number(q('side') ?? 0.6) },
    uCurl: { value: Number(q('curl') ?? 0.18) }, // wool-clump length bumps (lump x15)
    uCurlF: { value: Number(q('curlf') ?? 22) }, // wool-clump frequency (higher = finer clumps)
    uBlushK: { value: Number(q('blushK') ?? 0.6) }, // cheek blob strength (pale, soft)
    uCurlAO: { value: Number(q('curlao') ?? 0.1) }, // shade between the clumps
    uFloor: { value: Number(q('floor') ?? 0.22) }, // body fur grows to full length from the ground up to this height (m)
    uEyeRad: { value: EYE_OPEN },
    // fur is cleared around the eyes / mouth (Blender: face_d in build_fluff.py)
    uEyeL: { value: inBody('CAT_eye_L') },
    uEyeR: { value: inBody('CAT_eye_R') },
    uMouth: { value: inBody('CAT_mouth') },
    uCheekL: { value: cheek[0] },
    uCheekR: { value: cheek[1] },
    uCheekRad: { value: new THREE.Vector2(Number(q('blushIn') ?? 0.04), Number(q('blushOut') ?? 0.15)) }, // full pink inside, gone outside (m)
    uFront: { value: 0 },
    uPink: { value: 0 },
    uPinkTop: { value: Number(q('pinkTop') ?? 0.35) }, // pink left at the top of the oval (1 = flat)
    uPinkC: { value: new THREE.Vector3() },
    uPinkR: { value: new THREE.Vector2(1, 1) },
  };
  const shellMeshes = [];

  function fur(mesh, { thick, lump = 0, density, face = 0, alpha = 1, rootAO = 0.8, aoK = 0.35, lift = 0, front = 0, pink = null }) {
    const u = (shell) => ({
      ...shared,
      uShell: { value: shell },
      uThick: { value: thick },
      uLump: { value: lump },
      uDensity: { value: density },
      uFaceOn: { value: face },
      uAlpha: { value: alpha },
      uRootAO: { value: rootAO },
      uLift: { value: lift },
      uFront: { value: front },
      ...(pink && { uPink: { value: pink.k }, uPinkC: { value: pink.c }, uPinkR: { value: pink.r } }),
      uAOk: { value: aoK }, // how much of the baked AO shows (ears / paws: little, they read too grey otherwise)
    });
    // the exporter writes the ear-inner colors as normalized RGBA (no vertex-color node in MAT_pink); the shader wants vec3 color
    const col = mesh.geometry.attributes.color;
    if (col.itemSize === 4) mesh.geometry.setAttribute('color', new THREE.BufferAttribute(Float32Array.from({ length: col.count * 3 }, (_, i) => col.getComponent(i / 3 | 0, i % 3)), 3));
    mesh.material = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: u(0), vertexColors: true });
    const shellMat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, uniforms: u(1), vertexColors: true,
      transparent: true, depthWrite: false,
    });
    const sh = new THREE.InstancedMesh(mesh.geometry, shellMat, SHELLS_HIGH);
    sh.count = shells;
    sh.frustumCulled = false;
    sh.renderOrder = 1;
    shellMeshes.push(sh);
    mesh.add(sh);
  }

  // fur lengths in meters (Blender hair: body 0.1, ears 0.022, paws 0.03). Densities must stay >= 64 / 52 / 140
  // (lower showed a grid / mosaic on the Pixel_6 emulator).
  fur(body, { thick: Number(q('fur') ?? 0.12), lump: Number(q('lump') ?? 0.03), density: Number(q('furD') ?? 110), face: 1 });
  for (const s of ['L', 'R']) {
    // pink hollow centered where Blender put the ear-inner mesh (its node = ear-local position); the mesh itself is not drawn
    const inner = node('CAT_earInner_' + s);
    inner.visible = false;
    const pink = { k: Number(q('pinkK') ?? 0.9), c: inner.position.clone().add(new THREE.Vector3(0, Number(q('pinkDy') ?? -0.035), 0)), r: new THREE.Vector2(Number(q('pinkRx') ?? 0.12), Number(q('pinkRy') ?? 0.11)) };
    fur(node('CAT_ear_' + s), { thick: Number(q('earT') ?? 0.1), density: Number(q('earD') ?? 90), aoK: Number(q('earAO') ?? 0), rootAO: 0.88, lift: Number(q('earLift') ?? 0.3), front: Number(q('earFront') ?? 0.95), pink });
  }
  for (const p of ['FL', 'FR', 'BL', 'BR']) fur(node('CAT_paw_' + p), { thick: Number(q('pawT') ?? 0.05), density: Number(q('pawD') ?? 140), aoK: 0.2, rootAO: 0.88 });
  fur(node('CAT_tail'), { thick: Number(q('tailT') ?? 0.07), density: Number(q('pawD') ?? 140), aoK: 0.2, rootAO: 0.88 }); // pom-pom tail

  // eyes: one material per eye (uEye = +1 / -1 mirrors the painted detail: highlight toward the nose, glint outward)
  const eyes = ['L', 'R'].map((s) => node('CAT_eye_' + s));
  eyes.forEach((e, i) => {
    e.material = faceMat('#2b1712', '#6e3d2a', 0.2);
    e.material.uniforms.uEye.value = i ? -1 : 1;
    if (q('eyeP')) e.material.uniforms.uEyeP.value.fromArray(q('eyeP').split(',').map(Number)); // dev: (unused), glint, outline, halo
  });
  for (const s of ['L0', 'L1', 'R0', 'R1']) node('CAT_eyeShine_' + s).visible = false; // highlight is painted in the eye shader now (soft edge, mirrored)
  const mouth = node('CAT_mouth'), tongue = node('CAT_tongue');
  mouth.material = faceMat('#e47a90', '#d86e84'); // inside of the open mouth: pink, not dark (icon: tongue fills it)
  // dark-brown U outline around the open mouth (reference: the ω line continues around it), from the mesh's base
  // coordinates so it rides along with the nom/bite morphs
  mouth.material.uniforms.uRim.value = Number(q('rim') ?? 0.34); // 2*line_r / (0.95*scale x) = 2*0.0085 / (0.95*0.0525)
  tongue.material = faceMat('#f7acbc', '#eea0b1');
  tongue.visible = false; // the tongue is painted in the mouth shader (rounded, follows the U and the morphs); the mesh poked out of the U in chewB
  node('CAT_mouthLine').material = faceMat('#4e2418', '#3a1a10');
  node('CAT_blushHatch').material = faceMat('#f292ab', '#ec859f'); // 2-stroke hatch, pinker than the blush (icon)

  // ground shadow: soft radial-gradient disc (no shadow maps)
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g2 = c.getContext('2d');
  const grad = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(90,80,120,0.35)');
  grad.addColorStop(0.55, 'rgba(90,80,120,0.18)');
  grad.addColorStop(1, 'rgba(90,80,120,0)');
  g2.fillStyle = grad;
  g2.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 2.2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
  );
  shadow.material.map.colorSpace = THREE.SRGBColorSpace;
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.001;

  const root = new THREE.Group(); // drag rotation (code) around the GLB; clips animate the nodes inside
  root.scale.setScalar(SCALE);
  root.add(model);

  // clips: idle / eat = base layer, tap / pulse / pet = additive on top (frame 0 = rest pose)
  const clips = Object.fromEntries(gltf.animations.map((a) => [a.name, a]));
  for (const n of ['tap', 'pulse', 'pet']) THREE.AnimationUtils.makeClipAdditive(clips[n]);
  const mixer = new THREE.AnimationMixer(model);

  const morph = (m, name, v) => { m.morphTargetInfluences[m.morphTargetDictionary[name]] = v; };
  function setExpr(expr) {
    const chew = expr === 'chewA' || expr === 'chewB';
    for (const e of eyes) {
      morph(e, 'blink', expr === 'blink' ? 1 : 0);
      morph(e, 'happy', expr === 'happy' || chew ? 1 : 0);
      morph(e, 'squint', expr === 'squint' ? 1 : 0);
    }
    for (const e of eyes) e.material.uniforms.uOpen.value = expr === 'normal' || expr === 'bite' ? 1 : 0;
    shared.uEyeRad.value = expr === 'normal' || expr === 'bite' ? EYE_OPEN : EYE_SHUT;
    for (const m of [mouth, tongue]) {
      morph(m, 'nom', expr === 'chewA' ? 1 : expr === 'chewB' ? 0.55 : 0);
      morph(m, 'bite', expr === 'bite' ? 1 : 0);
    }
    // the morphs' scale (export_glb.py mouth_keys(): nom = x 0.8 / height 0.08, bite = x 1.12 / height BITE 1.3) -> outline thickness stays put
    const nom = expr === 'chewA' ? 1 : expr === 'chewB' ? 0.55 : 0, bite = expr === 'bite' ? 1 : 0;
    mouth.material.uniforms.uMS.value.set(1 - 0.2 * nom + 0.12 * bite, 1 - 0.92 * nom + 0.3 * bite);
  }
  setExpr('normal');

  return {
    root, model, shadow, mixer, clips, setExpr,
    catRoot: node('CAT_root'), upper: node('CAT_upper'), squash: node('CAT_squash'),
    ears: ['L', 'R'].map((s) => node('CAT_ear_' + s)),
    cookie: node('CAT_cookie'), cookieDisc: node('CAT_cookieDisc'),
    chips: [0, 1, 2, 3, 4, 5].map((i) => node('CAT_chip' + i)),
    setShells(n) {
      shared.uLayers.value = n;
      shared.uFurK.value = furK(n);
      for (const m of shellMeshes) m.count = n;
    },
  };
}
