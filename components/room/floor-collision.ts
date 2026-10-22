import { Vector3 } from "three";

export const duckHome = new Vector3(-1.8, 0, 1.4);
// Follow the left wall in room space, with enough clearance for each object.
export const basketballSpot = new Vector3(-1.7, 0, 0.75);
export const plantSpot = new Vector3(-1.72, 0, 0.05);

const catDuckGapX = 0.42;
const catDuckGapZ = 0.44;
export const encounterDuration = 1.6;
export type EncounterState = { startedAt: number; touching: boolean; met: boolean };

export function charactersTouch(a: Vector3, b: Vector3) {
  return Math.abs(a.x - b.x) < catDuckGapX + 0.05 && Math.abs(a.z - b.z) < catDuckGapZ + 0.05;
}

export function encounterActive(state: EncounterState, a: Vector3, b: Vector3, time: number) {
  const touching = charactersTouch(a, b);
  if (state.met) {
    state.touching = touching;
    return false;
  }
  if (touching && !state.touching) state.startedAt = time;
  const live = touching && time - state.startedAt < encounterDuration;
  if ((touching && !live) || (state.touching && !touching)) state.met = true;
  state.touching = touching;
  return live;
}

export function moveOutsideBox(position: Vector3, nextX: number, nextZ: number, other: Vector3, gapX = catDuckGapX, gapZ = catDuckGapZ) {
  const overlapX = gapX - Math.abs(nextX - other.x);
  const overlapZ = gapZ - Math.abs(nextZ - other.z);
  if (overlapX > 0 && overlapZ > 0) {
    if (overlapX < overlapZ) {
      nextX = other.x + (Math.sign(position.x - other.x) || 1) * gapX;
    } else {
      nextZ = other.z + (Math.sign(position.z - other.z) || 1) * gapZ;
    }
  }
  position.x = nextX;
  position.z = nextZ;
}
