"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

import { getRoomFx } from "@/components/room/room-fx";
import { Part, RBox } from "@/components/room/primitives";

const houses = [
  [-1.85, 0.28, 0.5, 0.26, "#c2553e"],
  [-1.55, 0.26, 0.44, 0.24, "#566b82"],
  [-1.26, 0.3, 0.56, 0.26, "#d48557"],
  [-0.96, 0.26, 0.46, 0.24, "#9e7454"],
  [-0.68, 0.28, 0.52, 0.26, "#b55b47"],
  [-0.4, 0.26, 0.46, 0.24, "#6f8760"],
  [-0.12, 0.28, 0.58, 0.26, "#c47c54"],
  [0.16, 0.26, 0.48, 0.24, "#7a8ea3"],
  [0.44, 0.28, 0.54, 0.26, "#c2553e"],
  [0.72, 0.26, 0.46, 0.24, "#566b82"],
  [1.02, 0.28, 0.5, 0.26, "#d48557"],
  [1.3, 0.26, 0.46, 0.24, "#9e7454"],
  [1.58, 0.28, 0.52, 0.26, "#b55b47"],
] as const;

const nearTrees = [-1.7, -1.15, -0.6, -0.05, 0.5, 1.05, 1.6];
const farTrees = [-1.45, -0.85, -0.25, 0.35, 0.95, 1.5];
const span = 4.4;

function House({ x, z, w, h, d, color, dark }: { x: number; z: number; w: number; h: number; d: number; color: string; dark: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <RBox color={dark ? (x > 0 ? "#4a5078" : "#3f4469") : color} size={[w, h, d]} radius={0.008} position={[0, h / 2, 0]} />
      <Part color={dark ? "#2a2e47" : "#594134"} position={[0, h + 0.08, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(w, d) * 0.68, 0.16, 4]} />
      </Part>
      {[0.14, 0.3].filter((wy) => wy < h - 0.08).map((wy) =>
        [-0.055, 0.055].map((wx) => (
          <mesh key={`${wy}${wx}`} position={[wx, wy, d / 2]}>
            <boxGeometry args={[0.04, 0.055, 0.02]} />
            <meshBasicMaterial color={dark ? "#ffd87d" : "#fcf6e8"} toneMapped={false} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Boat() {
  const white = "#f4f1eb";
  const red = "#e04545";
  const deck = "#a67c52";
  const glass = "#1c2026";

  return (
    <group>
      <RBox color={white} size={[0.34, 0.03, 0.13]} radius={0.012} position={[-0.03, 0.015, 0]} />
      <Part color={white} position={[0.13, 0.016, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.34, 0.85, 1]}>
        <sphereGeometry args={[0.065, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </Part>
      <RBox color={red} size={[0.34, 0.016, 0.142]} radius={0.004} position={[-0.03, 0.036, 0]} />
      <Part color={red} position={[0.13, 0.034, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.18, 0.8, 1.08]}>
        <sphereGeometry args={[0.07, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </Part>
      <RBox color={deck} size={[0.22, 0.008, 0.1]} radius={0.002} position={[0.01, 0.046, 0]} />
      <RBox color={white} size={[0.13, 0.07, 0.1]} radius={0.006} position={[-0.1, 0.084, 0]} />
      <Part color={white} position={[-0.035, 0.084, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.07, 16, 1, false, -Math.PI / 2, Math.PI]} />
      </Part>
      <RBox color={red} size={[0.15, 0.014, 0.116]} radius={0.003} position={[-0.1, 0.124, 0]} />
      <Part color={red} position={[-0.028, 0.124, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.014, 16, 1, false, -Math.PI / 2, Math.PI]} />
      </Part>
      {[-0.13, -0.08].map((x) =>
        [1, -1].map((side) => (
          <mesh key={`${x}${side}`} position={[x, 0.086, side * 0.052]}>
            <boxGeometry args={[0.028, 0.026, 0.006]} />
            <meshBasicMaterial color={glass} />
          </mesh>
        )),
      )}
      <mesh position={[-0.01, 0.088, 0.03]} rotation={[0, 0.7, 0]}>
        <boxGeometry args={[0.006, 0.024, 0.022]} />
        <meshBasicMaterial color={glass} />
      </mesh>
      <Part color={white} position={[-0.1, 0.19, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.11, 6]} />
      </Part>
    </group>
  );
}

function Dom({ dark }: { dark: boolean }) {
  const brick = dark ? "#5a4e68" : "#b18462";
  const darkBrick = dark ? "#433a52" : "#8d6848";
  const stone = dark ? "#6a6278" : "#cbb59a";

  return (
    <group>
      <RBox color={darkBrick} size={[0.18, 0.035, 0.18]} radius={0.003} position={[0, 0.018, 0]} />
      <RBox color={brick} size={[0.13, 0.58, 0.13]} radius={0.003} position={[0, 0.32, 0]} />
      {[0.2, 0.38].map((y) => (
        <mesh key={y} position={[0, y, 0.066]}>
          <boxGeometry args={[0.032, 0.09, 0.008]} />
          <meshBasicMaterial color={dark ? "#241c28" : "#3a2c24"} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0.066]}>
        <boxGeometry args={[0.04, 0.04, 0.008]} />
        <meshBasicMaterial color={dark ? "#7f9460" : "#2f6a48"} />
      </mesh>
      <RBox color={stone} size={[0.16, 0.028, 0.16]} radius={0.002} position={[0, 0.62, 0]} />
      <RBox color={brick} size={[0.1, 0.14, 0.1]} radius={0.002} position={[0, 0.7, 0]} />
      {[-0.02, 0.02].map((x) => (
        <mesh key={x} position={[x, 0.7, 0.052]}>
          <boxGeometry args={[0.028, 0.05, 0.016]} />
          <meshBasicMaterial color={dark ? "#ffd87d" : "#fcf6e8"} toneMapped={false} />
        </mesh>
      ))}
      <Part color={stone} position={[0, 0.84, 0]}><sphereGeometry args={[0.055, 16, 12]} /></Part>
    </group>
  );
}

function Tree({ x, z, dark }: { x: number; z: number; dark: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <Part color="#6b4e39" position={[0, 0.08, 0]}><cylinderGeometry args={[0.016, 0.02, 0.16, 8]} /></Part>
      <Part color={dark ? "#4c7a62" : "#6c9452"} position={[0, 0.22, 0]}><sphereGeometry args={[0.09, 14, 10]} /></Part>
      <Part color={dark ? "#3e6a54" : "#c4a24a"} position={[0.04, 0.2, 0.02]}><sphereGeometry args={[0.055, 10, 8]} /></Part>
    </group>
  );
}

function Rain() {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const raining = getRoomFx().weather === "utrecht";
    group.visible = raining;
    if (!raining) return;
    group.children.forEach((child) => {
      child.position.y -= delta * 2.4;
      if (child.position.y < -0.6) child.position.y = 0.7;
    });
  });

  return (
    <group ref={ref} visible={false}>
      {Array.from({ length: 22 }, (_, index) => (
        <mesh key={index} position={[-1.6 + (index % 11) * 0.32, 0.5 - (index % 5) * 0.18, -0.5 - (index % 3) * 0.12]}>
          <boxGeometry args={[0.008, 0.08, 0.008]} />
          <meshBasicMaterial color="#c5d7e8" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export function Canal({ dark }: { dark: boolean }) {
  const boatRef = useRef<Group>(null);
  const sky = useRef<Mesh>(null);
  const sun = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const boat = boatRef.current;
    if (boat) {
      const t = clock.getElapsedTime();
      boat.position.x = Math.sin(t * 0.35) * 0.22;
      boat.rotation.z = Math.sin(t * 1.4) * 0.03;
    }
    const weather = getRoomFx().weather;
    const barcelona = weather === "barcelona";
    const utrecht = weather === "utrecht";
    const skyMat = sky.current?.material as { color?: { set: (color: string) => void } } | undefined;
    const sunMat = sun.current?.material as { color?: { set: (color: string) => void } } | undefined;
    skyMat?.color?.set(barcelona ? "#7ec8f0" : utrecht ? "#6d7f93" : dark ? "#17223b" : "#8ec6eb");
    sunMat?.color?.set(barcelona ? "#ffe27a" : dark ? "#f7efd9" : "#fff5c0");
    if (sun.current) sun.current.scale.setScalar(barcelona ? 1.6 : 1);
  });

  return (
    <group>
      <mesh ref={sky} position={[0, 0.05, -1.7]} frustumCulled={false}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial color={dark ? "#17223b" : "#8ec6eb"} toneMapped={false} />
      </mesh>
      <mesh ref={sun} position={[0.7, 0.55, -1.65]}>
        <circleGeometry args={[dark ? 0.07 : 0.09, 28]} />
        <meshBasicMaterial color={dark ? "#f7efd9" : "#fff5c0"} toneMapped={false} />
      </mesh>
      <Rain />
      <group position={[0, -0.52, 0]}>
      <group position={[0, -0.08, 0]}>
      <RBox color={dark ? "#5d5a7a" : "#b09a82"} size={[span, 0.06, 0.16]} radius={0.006} position={[0, 0.02, -0.06]} />
      {nearTrees.map((x) => (
        <Tree key={x} x={x} z={-0.06} dark={dark} />
      ))}
      <RBox color={dark ? "#44425c" : "#87735f"} size={[span, 0.14, 0.08]} radius={0.006} position={[0, -0.05, -0.14]} />
      </group>

      <mesh position={[0, -0.12, -0.375]}>
        <boxGeometry args={[span, 0.04, 0.5]} />
        <meshStandardMaterial color={dark ? "#1a628f" : "#2b93c2"} roughness={0.12} metalness={0.2} polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>

      <group ref={boatRef} position={[0, -0.07, -0.38]} rotation={[0, 0.15, 0]}>
        <Boat />
      </group>

      <RBox color={dark ? "#44425c" : "#87735f"} size={[span, 0.14, 0.08]} radius={0.006} position={[0, -0.05, -0.6]} />
      <RBox color={dark ? "#5d5a7a" : "#b09a82"} size={[span, 0.06, 0.18]} radius={0.006} position={[0, 0.02, -0.7]} />
      {farTrees.map((x) => (
        <Tree key={x} x={x} z={-0.68} dark={dark} />
      ))}

      {houses.map(([x, w, h, d, color]) => (
        <House key={x} x={x} z={-0.84} w={w} h={h} d={d} color={color} dark={dark} />
      ))}

      <group position={[-0.55, 0, -1.04]}>
        <Dom dark={dark} />
      </group>
      </group>
    </group>
  );
}
