"use client";

import { useMemo } from "react";
import { LatheGeometry, Vector2 } from "three";

import { DeskSetup } from "@/components/room/desk-setup";
import { Part, RBox } from "@/components/room/primitives";

const books = [
  [0.35, "#a3553f"],
  [0.3, "#5f7a8c"],
  [0.38, "#d9b25f"],
  [0.28, "#7d8f62"],
  [0.33, "#c98a6b"],
] as const;

const floorBoards = ["#c9ad88", "#d2b995", "#c5a57f", "#d8c09e", "#cbae88", "#d4ba96", "#c2a17a", "#d1b58e", "#c7a781", "#d6bd99"];

const leaves = Array.from({ length: 11 }, (_, index) => ({
  angle: index * 2.4,
  tilt: 0.35 + (index % 3) * 0.25,
  length: 0.22 + (index % 4) * 0.04,
  color: index % 2 ? "#7f9a63" : "#6d8a55",
}));

function Plant() {
  const pot = useMemo(() => new LatheGeometry([
    [0, 0], [0.16, 0], [0.2, 0.32], [0.23, 0.33], [0.23, 0.38], [0.2, 0.38], [0.2, 0.36], [0, 0.36],
  ].map(([x, y]) => new Vector2(x, y)), 48), []);

  return (
    <group position={[-1.5, 0, 0.5]}>
      <mesh geometry={pot} castShadow receiveShadow>
        <meshStandardMaterial color="#c46f4b" roughness={0.8} />
      </mesh>
      <Part color="#5a4232" position={[0, 0.365, 0]}><cylinderGeometry args={[0.19, 0.19, 0.01, 48]} /></Part>
      {leaves.map(({ angle, tilt, length, color }) => (
        <group key={angle} position={[0, 0.37, 0]} rotation={[0, angle, 0]}>
          <group rotation={[tilt, 0, 0]}>
            <Part color="#6b7f4f" position={[0, length / 2, 0]}><cylinderGeometry args={[0.006, 0.008, length, 8]} /></Part>
            <Part color={color} roughness={0.6} position={[0, length + 0.12, 0]} scale={[0.5, 1, 0.12]}><sphereGeometry args={[0.13, 32, 16]} /></Part>
          </group>
        </group>
      ))}
    </group>
  );
}

function DeskLamp({ dark }: { dark: boolean }) {
  return (
    <group position={[0.35, 1.15, -1.7]} rotation={[0, -0.5, 0]}>
      <Part color="#3d3a36" roughness={0.4} position={[0, 0.015, 0]}><cylinderGeometry args={[0.09, 0.1, 0.03, 32]} /></Part>
      <Part color="#3d3a36" roughness={0.4} position={[0, 0.2, 0.05]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.38, 12]} /></Part>
      <Part color="#3d3a36" roughness={0.4} position={[0, 0.42, 0.2]} rotation={[-1, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.3, 12]} /></Part>
      <group position={[0, 0.5, 0.33]} rotation={[0.5, 0, 0]}>
        <Part color="#e9b44c" roughness={0.5}><coneGeometry args={[0.09, 0.14, 32, 1, true]} /></Part>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.03, 16, 12]} />
          <meshBasicMaterial color={dark ? "#fff1c9" : "#f6ead0"} />
        </mesh>
        {dark && <pointLight position={[0, -0.1, 0]} intensity={3} distance={4} color="#ffcf8a" />}
      </group>
    </group>
  );
}

export function Furniture({ dark }: { dark: boolean }) {
  return (
    <>
      <Part color="#a98763" position={[-0.1, -0.1, -0.1]}><boxGeometry args={[4.2, 0.2, 4.2]} /></Part>
      {floorBoards.map((color, index) => (
        <Part key={color} color={color} roughness={0.82} position={[-0.1, 0.012, -1.89 + index * 0.4]}>
          <boxGeometry args={[4.16, 0.024, 0.38]} />
        </Part>
      ))}
      <Part color="#e6dccd" position={[-2.1, 1.65, -0.1]}><boxGeometry args={[0.2, 3.3, 4.2]} /></Part>
      <Part color="#eee5d8" position={[-0.1, 1.65, -2.1]}><boxGeometry args={[4.2, 3.3, 0.2]} /></Part>
      <RBox color="#d8c8b3" size={[0.04, 0.15, 4]} radius={0.01} position={[-1.98, 0.075, 0]} />
      <RBox color="#d8c8b3" size={[4, 0.15, 0.04]} radius={0.01} position={[0, 0.075, -1.98]} />

      <Part color="#b99b78" roughness={1} position={[0.35, 0.03, 0.35]}><cylinderGeometry args={[1.1, 1.1, 0.02, 96]} /></Part>
      <Part color="#dfcfb7" roughness={1} position={[0.35, 0.032, 0.35]}><cylinderGeometry args={[0.88, 0.88, 0.02, 96]} /></Part>

      <RBox color="#cbb391" size={[2.2, 0.08, 1]} radius={0.03} position={[-0.45, 1.11, -1.45]} />
      {[[-1.45, -1.85], [0.55, -1.85], [-1.45, -1.05], [0.55, -1.05]].map(([x, z]) => (
        <RBox key={`${x}${z}`} color="#aa8d6b" size={[0.07, 1.07, 0.07]} radius={0.02} position={[x, 0.535, z]} />
      ))}
      <DeskSetup dark={dark} />
      <group position={[-1.25, 1.15, -1.15]}>
        <Part color="#e9e2d6" roughness={0.4} position={[0, 0.06, 0]}><cylinderGeometry args={[0.055, 0.05, 0.12, 32]} /></Part>
        <Part color="#e9e2d6" roughness={0.4} position={[0.06, 0.06, 0]}><torusGeometry args={[0.03, 0.008, 12, 24]} /></Part>
      </group>
      <DeskLamp dark={dark} />

      <RBox color="#d2bea1" size={[1.1, 0.9, 0.9]} radius={0.03} position={[1.4, 0.45, -1.5]} />
      {[0.25, 0.62].map((y) => (
        <group key={y} position={[1.4, y, -1.045]}>
          <RBox color="#e0d1bb" size={[1, 0.32, 0.02]} radius={0.008} />
          <Part color="#8d735a" roughness={0.4} position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.18, 16]} /></Part>
        </group>
      ))}
      <RBox color="#fbf6ee" size={[2.1, 0.06, 0.3]} position={[-0.45, 1.88, -1.85]} />

      <RBox color="#bfa17c" size={[0.35, 0.05, 1.4]} radius={0.015} position={[-1.82, 2.2, 0.9]} />
      {books.map(([height, color], index) => (
        <RBox key={color} color={color} size={[0.26, height, 0.08]} radius={0.01} position={[-1.85, 2.225 + height / 2, 0.3 + index * 0.09]} />
      ))}
      <Plant />
    </>
  );
}
