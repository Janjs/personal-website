import { MathUtils, type Group } from "three";

export const thighLen = 0.2;
export const shinLen = 0.175;
export const hipSpread = 0.12;
export const hipHeight = 0.38;

export function strideFoot(side: 1 | -1, phase: number, walk: number, stride = 0.15, lift = 0.05, duty = 0.62) {
  const ph = ((phase + (side < 0 ? 0.5 : 0)) % 1 + 1) % 1;
  let z: number;
  let y = 0;
  if (ph < duty) z = stride * (0.5 - ph / duty);
  else {
    const s = (ph - duty) / (1 - duty);
    z = stride * (s - 0.5);
    y = lift * Math.sin(Math.PI * s);
  }
  return {
    x: side * hipSpread,
    y: -hipHeight + 0.05 + y * walk,
    z: 0.025 - z * walk,
  };
}

export function ikLeg(hip: Group, knee: Group, foot: Group, target: { x: number; y: number; z: number }, walk: number) {
  const ly = target.y - hip.position.y;
  const lz = target.z - hip.position.z;
  const lx = target.x - hip.position.x;
  const dist = MathUtils.clamp(Math.hypot(ly, lz), Math.abs(thighLen - shinLen) + 0.002, thighLen + shinLen - 0.002);
  const reach = Math.atan2(lz, -ly);
  const swing = Math.acos(MathUtils.clamp((thighLen * thighLen + dist * dist - shinLen * shinLen) / (2 * thighLen * dist), -1, 1));
  hip.rotation.x = reach - swing;
  hip.rotation.z = Math.atan2(lx, Math.max(0.04, -ly)) * 0.3;
  const kneeBend = Math.PI - Math.acos(MathUtils.clamp((thighLen * thighLen + shinLen * shinLen - dist * dist) / (2 * thighLen * shinLen), -1, 1));
  knee.rotation.x = kneeBend;
  foot.rotation.x = -hip.rotation.x - knee.rotation.x + walk * 0.08;
}
