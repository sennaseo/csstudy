import * as THREE from 'three';

// 'eat' mode: the Blender clip 'eat' (3.6s loop) moves the cookie + front paws: rest -> lift -> bite -> 3 munches -> lower.
// Here, keyed off that clip's time: face, bite notches + crumbs, and after BITES bites the cookie is gone
// -> happy face -> a new cookie pops in (during the rest part of the loop).
const BITES = 4;
const BITE_AT = [[0.55, 0.83], [0.2, 0.98], [0.85, 0.5], [-0.15, 0.97]]; // edge points (unit circle), upper side
const T_LIFT = 1.2, T_BITE = 1.65, T_CHEW_END = 2.61, T_LOWERED = 3.01, MUNCH = 0.32; // = export_glb.py eat clip
const R = 0.33; // cookie radius (app units)
const HIGH = { y: 0.512, z: 0.887 }; // cookie at the mouth (app units) = export_glb.py eat HIGH

const vert = /* glsl */ `
varying vec3 vP; varying vec3 vN; varying vec3 vV;
void main(){
  vP = position; vN = normalize(normalMatrix*normal);
  vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv;
}`;
const frag = /* glsl */ `
uniform vec3 uBites[4]; uniform int uCount;
varying vec3 vP; varying vec3 vN; varying vec3 vV;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  for (int i = 0; i < 4; i++) {
    if (i >= uCount) break;
    if (distance(vP.xy, uBites[i].xy) < uBites[i].z) discard;
  }
  vec3 base = vec3(0.86,0.6,0.3);
  float side = 1.0 - abs(vP.z);           // rim of the disc is a little toasted
  base = mix(base, vec3(0.7,0.43,0.2), smoothstep(0.55,1.0,side)*0.6);
  base *= 0.88 + 0.16*h(floor(vP.xy*28.0)); // baked speckles
  if (!gl_FrontFacing) base = vec3(0.93,0.76,0.5); // inside of a bite
  vec3 N = normalize(gl_FrontFacing ? vN : -vN);
  float d = dot(N, normalize(vec3(-0.35,0.75,0.55)))*0.5+0.5;
  vec3 col = base*(0.55+0.55*d) + vec3(0.25)*pow(1.0-clamp(dot(N,vV),0.0,1.0),3.0);
  gl_FragColor = vec4(col,1.0);
  #include <colorspace_fragment>
}`;

const ease = (x) => x * x * (3 - 2 * x);

export function createEater(cat, rand, action) {
  const bites = Array.from({ length: 4 }, () => new THREE.Vector3());
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, side: THREE.DoubleSide,
    uniforms: { uBites: { value: bites }, uCount: { value: 0 } },
  });
  cat.cookieDisc.material = mat; // GLB cookie = unit sphere scaled flat -> uBites are in unit-sphere space
  const rDisc = cat.cookieDisc.scale.x;
  const chipMat = new THREE.MeshBasicMaterial({ color: 0x4a2a1a });
  for (const c of cat.chips) {
    c.material = chipMat;
    c.userData.unit = new THREE.Vector2(c.position.x / rDisc, c.position.y / rDisc);
  }
  const cookie = cat.cookie;
  const cookieScale = cookie.scale.clone();
  cookie.visible = false;

  // crumbs live in app units (x1/1.5 back to the GLB's meters)
  const crumbBox = new THREE.Group();
  crumbBox.scale.setScalar(1 / 1.5);
  cat.squash.add(crumbBox);
  const crumbGeo = new THREE.SphereGeometry(1, 6, 4);
  const crumbs = Array.from({ length: 7 }, (_, i) => {
    const m = new THREE.Mesh(crumbGeo, new THREE.MeshBasicMaterial({ color: i % 2 ? 0xc98f4e : 0xeac28a, transparent: true }));
    m.visible = false;
    m.userData.v = new THREE.Vector3();
    crumbBox.add(m);
    return m;
  });

  let on = false, count = 0, prev = 0, doneT = -1, appearT = -1;
  const st = { face: null };

  function setBites(k) {
    count = k;
    mat.uniforms.uCount.value = k;
    for (let i = 0; i < k; i++) {
      const [x, y] = BITE_AT[i];
      bites[i].set(x * 1.02, y * 1.02, 0.36 + i * 0.03);
    }
    for (const c of cat.chips) c.visible = !bites.slice(0, k).some((b) => c.userData.unit.distanceTo(new THREE.Vector2(b.x, b.y)) < b.z + 0.08);
  }

  function crumbsOut() {
    for (const m of crumbs) {
      m.visible = true;
      m.material.opacity = 1;
      m.position.set((rand() - 0.5) * 0.18, HIGH.y + R * 0.9, HIGH.z + 0.05);
      m.userData.v.set((rand() - 0.5) * 0.8, 0.3 + rand() * 0.5, 0.2 + rand() * 0.4);
      m.userData.life = 0.9 + rand() * 0.4;
      m.scale.setScalar(0.018 + rand() * 0.016);
    }
  }

  return {
    state: st,
    get on() { return on; },
    set(v, popIn = true) {
      on = !!v;
      cookie.visible = on;
      setBites(0);
      doneT = -1;
      appearT = on && popIn ? 0 : -1; // the cookie pops in (not on page load: the RN placeholder still already shows it)
      prev = 0;
      st.face = null;
      for (const m of crumbs) m.visible = false;
      cookie.scale.copy(cookieScale);
    },
    update(dt, still) {
      if (!on) return;
      st.face = null;
      if (still) { // reduceMotion: hold the cookie, no motion (main.js keeps the clip at t=0)
        cookie.scale.copy(cookieScale);
        return;
      }
      const t = action.time;
      const crossed = (at) => (prev < at && t >= at) || (t < prev && (prev < at || t >= at)); // also across the loop wrap
      if (crossed(T_BITE) && count < BITES && doneT < 0 && appearT < 0) { setBites(count + 1); crumbsOut(); }
      if (crossed(T_LOWERED) && count >= BITES) doneT = 0;
      prev = t;
      if (t >= T_LIFT + 0.55 * (T_BITE - T_LIFT) && t < T_BITE) st.face = 'bite';
      else if (t >= T_BITE && t < T_CHEW_END) st.face = ((t - T_BITE) % MUNCH) / MUNCH < 0.5 ? 'chewA' : 'chewB';
      let pop = 1;
      if (doneT >= 0) { // cookie finished: happy, shrink away, then a new one pops in
        doneT += dt;
        st.face = 'happy';
        pop = Math.max(0, 1 - doneT * 5);
        if (doneT >= 1) { doneT = -1; setBites(0); appearT = 0; pop = 0; }
      } else if (appearT >= 0) {
        appearT += dt;
        const p = Math.min(appearT / 0.35, 1);
        pop = ease(p) * (1 + 0.15 * Math.sin(p * Math.PI));
        if (p >= 1) appearT = -1;
      }
      cookie.scale.copy(cookieScale).multiplyScalar(pop);
      for (const m of crumbs) {
        if (!m.visible) continue;
        const u = m.userData;
        u.life -= dt;
        u.v.y -= 3.2 * dt;
        m.position.addScaledVector(u.v, dt);
        if (m.position.y < 0.02) { m.position.y = 0.02; u.v.set(0, 0, 0); }
        m.material.opacity = Math.min(1, u.life * 3);
        if (u.life <= 0) m.visible = false;
      }
    },
  };
}
