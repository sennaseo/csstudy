import type * as THREE from "three";
import type { Cat } from "./cat";
export interface Eater {
  readonly on: boolean;
  state: { face: string | null };
  set(on: boolean, popIn?: boolean): void;
  update(dt: number, still: boolean): void;
}
export function createEater(cat: Cat, rand: () => number, action: THREE.AnimationAction): Eater;
