// cat.js / eat.js (DietCalc 원본, 자바스크립트)의 타입 선언 — catScene.ts 가 쓰는 만큼만.
import type * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface Cat {
  root: THREE.Object3D;
  model: THREE.Object3D;
  shadow: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  mixer: THREE.AnimationMixer;
  clips: Record<string, THREE.AnimationClip>;
  setExpr(expr: string): void;
  catRoot: THREE.Object3D;
  upper: THREE.Object3D;
  ears: THREE.Object3D[];
  setShells(n: number): void;
}
export const SHELLS_HIGH: number;
export const SHELLS_LOW: number;
export const EXPRESSIONS: string[];
export function loadCat(url: string): Promise<GLTF>;
export function buildCat(o: { gltf: GLTF; rand: () => number; shells: number }): Cat;
