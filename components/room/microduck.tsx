"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type RefObject } from "react";
import { MathUtils, Plane, Raycaster, Vector3, type Group } from "three";

import { basketballSpot, duckHome, encounterActive, encounterDuration, moveOutsideBox, plantSpot, type EncounterState } from "@/components/room/floor-collision";
import { hipHeight, hipSpread, ikLeg, strideFoot } from "@/components/room/microduck-gait";
import { Part, Pickable, RBox, type ItemProps } from "@/components/room/primitives";

const cream = "#f2ebe0";
const orange = "#f17721";
const metal = "#9ea0a4";
const ink = "#1c1d21";
const sole = "#e8c04a";
const up = new Vector3(0, 1, 0);
const idleYaw = Math.PI / 2;

function shortestTurn(from: number, to: number) {
  const turn = to - from;
  return Math.atan2(Math.sin(turn), Math.cos(turn));
}

function Joint({ color, r, side }: { color: string; r: number; side: number }) {
  return (
    <group>
      <Part color={color} roughness={0.35} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r, r, r * 0.55, 20]} />
      </Part>
      <Part color={metal} roughness={0.4} position={[side * r * 0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r * 0.55, r * 0.55, r * 0.22, 16]} />
      </Part>
    </group>
  );
}

export function Microduck({ active, catPosition, position, encounter, onMet, ...props }: ItemProps & {
  catPosition: RefObject<Vector3>;
  position: RefObject<Vector3>;
  encounter: RefObject<EncounterState>;
  onMet: () => void;
}) {
  const walker = useRef<Group>(null);
  const hips = useRef<Group>(null);
  const head = useRef<Group>(null);
  const upperJaw = useRef<Group>(null);
  const lowerJaw = useRef<Group>(null);
  const heart = useRef<Group>(null);
  const leftHip = useRef<Group>(null);
  const leftKnee = useRef<Group>(null);
  const leftFoot = useRef<Group>(null);
  const rightHip = useRef<Group>(null);
  const rightKnee = useRef<Group>(null);
  const rightFoot = useRef<Group>(null);
  const cursorRay = useRef(new Raycaster());
  const floorPlane = useRef(new Plane());
  const floorOrigin = useRef(new Vector3());
  const cursorTarget = useRef(new Vector3());
  const gait = useRef({ phase: 0, walk: 0 });
  const chatter = useRef({ next: 2.8, until: 0 });
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);
  const metNotified = useRef(false);

  useFrame(({ clock, pointer, camera }, delta) => {
    const duck = walker.current;
    if (!duck) return;
    const t = clock.elapsedTime;
    const cat = catPosition.current;
    const meeting = encounterActive(encounter.current, duck.position, cat, t);
    if (meeting !== speakingRef.current) {
      speakingRef.current = meeting;
      setSpeaking(meeting);
    }
    if (meeting && !metNotified.current) {
      metNotified.current = true;
      onMet();
    }

    let targetX = duck.position.x;
    let targetZ = duck.position.z;
    if (active && duck.parent) {
      duck.parent.getWorldPosition(floorOrigin.current);
      floorPlane.current.setFromNormalAndCoplanarPoint(up, floorOrigin.current);
      cursorRay.current.setFromCamera(pointer, camera);
      if (cursorRay.current.ray.intersectPlane(floorPlane.current, cursorTarget.current)) {
        duck.parent.worldToLocal(cursorTarget.current);
        targetX = MathUtils.clamp(cursorTarget.current.x, -1.82, 1.7);
        targetZ = MathUtils.clamp(cursorTarget.current.z, -0.8, 1.7);
      }
    }

    const moveX = meeting ? cat.x - duck.position.x : targetX - duck.position.x;
    const moveZ = meeting ? cat.z - duck.position.z : targetZ - duck.position.z;
    const distance = Math.hypot(moveX, moveZ);
    const frameTime = Math.min(delta, 0.05);
    const yawError = distance > 0.001 ? shortestTurn(duck.rotation.y, Math.atan2(moveX, moveZ)) : 0;
    if (meeting || (active && distance > 0.03)) {
      duck.rotation.y += yawError * (1 - Math.exp(-frameTime * 7));
    }
    const facingError = distance > 0.001 ? shortestTurn(duck.rotation.y, Math.atan2(moveX, moveZ)) : 0;

    let walking = !meeting && active && distance > 0.04 && Math.abs(facingError) < 0.7;
    if (walking) {
      const previousX = duck.position.x;
      const previousZ = duck.position.z;
      const step = Math.min(distance, frameTime * 0.32);
      moveOutsideBox(duck.position, duck.position.x + (moveX / distance) * step, duck.position.z + (moveZ / distance) * step, cat);
      moveOutsideBox(duck.position, duck.position.x, duck.position.z, basketballSpot, 0.44, 0.44);
      moveOutsideBox(duck.position, duck.position.x, duck.position.z, plantSpot, 0.42, 0.42);
      walking = Math.hypot(duck.position.x - previousX, duck.position.z - previousZ) > 0.0002;
      if (walking) gait.current.phase = (gait.current.phase + step * 0.62 / 0.15) % 1;
    }
    gait.current.walk = MathUtils.damp(gait.current.walk, walking ? 1 : 0, 7, delta);

    const walk = gait.current.walk;
    const meetT = meeting ? t - encounter.current.startedAt : 0;
    const meet = meeting ? Math.sin((meetT / encounterDuration) * Math.PI) : 0;
    if (!meeting && t > chatter.current.next) {
      chatter.current.until = t + 0.55;
      chatter.current.next = t + 3.5 + Math.random() * 5;
    }
    const chomp = meeting
      ? 0.26 + Math.abs(Math.sin(meetT * 11)) * 0.16
      : t < chatter.current.until ? 0.2 * Math.abs(Math.sin((t - (chatter.current.until - 0.55)) * 14)) : 0;
    if (hips.current) hips.current.position.y = hipHeight + Math.abs(Math.sin(gait.current.phase * Math.PI * 2)) * 0.014 * walk + Math.sin(t * 2.2) * 0.005 * (1 - walk) + meet * 0.045 * Math.abs(Math.sin(meetT * 9));
    if (leftHip.current && leftKnee.current && leftFoot.current) ikLeg(leftHip.current, leftKnee.current, leftFoot.current, strideFoot(-1, gait.current.phase, walk), walk);
    if (rightHip.current && rightKnee.current && rightFoot.current) ikLeg(rightHip.current, rightKnee.current, rightFoot.current, strideFoot(1, gait.current.phase, walk), walk);
    if (head.current) {
      head.current.rotation.x = -0.32 + Math.sin(t * 1.5) * 0.03 + meet * 0.18;
      head.current.rotation.y = meet * Math.sin(meetT * 6) * 0.2;
      head.current.rotation.z = Math.sin(t * 1.1) * 0.02 + meet * Math.sin(meetT * 8) * 0.16;
    }
    if (upperJaw.current) upperJaw.current.rotation.x = MathUtils.damp(upperJaw.current.rotation.x, -chomp * 0.4, 14, delta);
    if (lowerJaw.current) lowerJaw.current.rotation.x = MathUtils.damp(lowerJaw.current.rotation.x, chomp, 14, delta);
    if (heart.current) {
      heart.current.visible = meeting;
      heart.current.position.y = 1.22 + (t * 0.25) % 0.28;
    }
    position.current.set(duck.position.x, 0, duck.position.z);
  });

  return (
    <group ref={walker} position={[duckHome.x, 0.016, duckHome.z]} rotation={[0, idleYaw, 0]}>
      {speaking && <Html center position={[0, 0.86, 0]} style={{ pointerEvents: "none" }}><div className="rounded-lg bg-card px-2 py-1 text-sm font-medium text-card-foreground shadow-sm">Quack!</div></Html>}
      <Pickable active={active} {...props} tipY={0.7}>
        <group scale={0.58}>
          <group ref={hips} position={[0, hipHeight, 0]}>
            <group position={[0, 0.12, 0.02]}>
              <RBox color={cream} size={[0.42, 0.22, 0.3]} radius={0.09} />
              <RBox color={metal} size={[0.12, 0.08, 0.1]} radius={0.02} position={[0, 0.04, -0.02]} />
              <RBox color={ink} size={[0.1, 0.16, 0.1]} radius={0.02} position={[0, 0.16, -0.06]} />
              <group ref={head} position={[0, 0.36, 0.04]}>
                <RBox color={cream} size={[0.42, 0.3, 0.48]} radius={0.12} position={[0, 0.02, 0.04]} />
                <RBox color={cream} size={[0.32, 0.2, 0.04]} radius={0.08} position={[0, 0.02, 0.26]} />
                <group position={[0, 0.03, 0.29]}>
                  <Part color={orange} roughness={0.4}>
                    <torusGeometry args={[0.055, 0.018, 12, 24]} />
                  </Part>
                  <Part color="#11141a" roughness={0.08} position={[0, 0, 0.01]} scale={[1, 1, 0.5]}>
                    <sphereGeometry args={[0.048, 20, 14]} />
                  </Part>
                  <Part color="#ffffff" position={[-0.014, 0.018, 0.032]}><sphereGeometry args={[0.008, 10, 8]} /></Part>
                </group>
                <RBox color="#16181c" size={[0.04, 0.014, 0.01]} radius={0.003} position={[0.1, -0.01, 0.272]} />
                <group position={[0, -0.135, -0.06]}>
                  {[-1, 1].map((side) => (
                    <Part key={side} color={orange} position={[side * 0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.028, 0.028, 0.02, 16]} />
                    </Part>
                  ))}
                  <group ref={upperJaw}>
                    <RBox color={orange} size={[0.42, 0.022, 0.3]} radius={0.01} position={[0, 0.012, 0.15]} />
                  </group>
                  <group ref={lowerJaw}>
                    <RBox color={orange} size={[0.42, 0.022, 0.3]} radius={0.01} position={[0, -0.012, 0.15]} />
                  </group>
                </group>
              </group>
            </group>
            {([-1, 1] as const).map((side) => {
              const hip = side < 0 ? leftHip : rightHip;
              const knee = side < 0 ? leftKnee : rightKnee;
              const foot = side < 0 ? leftFoot : rightFoot;
              return (
                <group key={side} ref={hip} position={[side * hipSpread, 0, 0]}>
                  <Joint color={metal} r={0.055} side={side} />
                  <RBox color={ink} size={[0.1, 0.18, 0.11]} radius={0.025} position={[0, -0.1, 0.01]} />
                  <RBox color={cream} size={[0.07, 0.16, 0.13]} radius={0.03} position={[side * 0.045, -0.1, 0.01]} />
                  <group ref={knee} position={[0, -0.2, 0]}>
                    <Joint color={metal} r={0.042} side={side} />
                    <RBox color={ink} size={[0.09, 0.15, 0.1]} radius={0.02} position={[0, -0.08, 0]} />
                    <Part color={metal} roughness={0.35} position={[0, -0.08, 0.02]}>
                      <cylinderGeometry args={[0.018, 0.022, 0.14, 10]} />
                    </Part>
                    <group ref={foot} position={[0, -0.175, 0]}>
                      <RBox color={orange} size={[0.16, 0.07, 0.26]} radius={0.032} position={[0, -0.01, 0.07]} />
                      <RBox color={sole} size={[0.17, 0.032, 0.28]} radius={0.016} position={[0, -0.048, 0.07]} />
                      <RBox color={cream} size={[0.14, 0.04, 0.09]} radius={0.02} position={[0, 0.012, 0.15]} />
                      <Part color="#2a2c30" position={[side * 0.085, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
                      </Part>
                    </group>
                  </group>
                </group>
              );
            })}
          </group>
          <group ref={heart} visible={false} position={[0, 1.22, 0.18]} scale={0.8}>
            {[-0.045, 0.045].map((x) => (
              <Part key={x} color="#e46a7c" position={[x, 0, 0]}><sphereGeometry args={[0.06, 20, 14]} /></Part>
            ))}
            <Part color="#e46a7c" position={[0, -0.07, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.085, 0.12, 20]} /></Part>
          </group>
        </group>
      </Pickable>
    </group>
  );
}
