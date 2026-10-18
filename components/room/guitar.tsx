"use client";

import { useMemo } from "react";
import { ExtrudeGeometry, Shape } from "three";

import { Part, Pickable, RBox, type ItemProps } from "@/components/room/primitives";

const SIDES = 20;
const start = [0, -0.32];
const curves = [
  [0.15, -0.32, 0.25, -0.28, 0.25, -0.16],
  [0.25, -0.06, 0.18, -0.03, 0.18, 0.05],
  [0.18, 0.12, 0.195, 0.14, 0.195, 0.2],
  [0.195, 0.29, 0.14, 0.34, 0, 0.34],
];
const strings = [-0.025, -0.015, -0.005, 0.005, 0.015, 0.025];

export function Guitar(props: ItemProps) {
  const body = useMemo(() => {
    const shape = new Shape().moveTo(start[0], start[1]);
    const ends = [start, ...curves.map((c) => c.slice(4))];
    curves.forEach(([a, b, c, d, x, y]) => shape.bezierCurveTo(a, b, c, d, x, y));
    curves.toReversed().forEach(([a, b, c, d], i) => {
      const [x, y] = ends[curves.length - 1 - i];
      shape.bezierCurveTo(-c, d, -a, b, -x, y);
    });
    return new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false, curveSegments: 10 });
  }, []);

  return (
    <Pickable {...props} tipY={1.15} position={[-1.85, 1.6, -0.6]}>
      <mesh geometry={body} position={[-0.124, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" color="#e3c08e" roughness={0.75} />
        <meshStandardMaterial attach="material-1" color="#6e3a26" roughness={0.75} />
      </mesh>
      <group position={[0, 0.155, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Part color="#c9b48a" position={[0, 0.022, 0]}><cylinderGeometry args={[0.085, 0.085, 0.004, SIDES]} /></Part>
        <Part color="#4a2418" position={[0, 0.021, 0]}><cylinderGeometry args={[0.06, 0.06, 0.004, SIDES]} /></Part>
      </group>
      <RBox color="#6b4630" size={[0.04, 0.55, 0.07]} radius={0.01} position={[-0.05, 0.595, 0]} />
      <RBox color="#2e2019" size={[0.012, 0.63, 0.075]} radius={0.004} position={[-0.024, 0.555, 0]} />
      <RBox color="#6b4630" size={[0.03, 0.2, 0.1]} radius={0.01} position={[-0.055, 0.96, 0]} rotation={[0, 0, 0.2]} />
      <RBox color="#6e3524" size={[0.012, 0.04, 0.2]} radius={0.004} position={[-0.02, -0.11, 0]} />
      <Part color="#efe8da" position={[-0.013, -0.105, 0]}><boxGeometry args={[0.004, 0.006, 0.1]} /></Part>
      {strings.map((z) => (
        <Part key={z} color="#d9d4c7" roughness={0.3} position={[-0.01, 0.38, z]}><boxGeometry args={[0.002, 0.98, 0.002]} /></Part>
      ))}
    </Pickable>
  );
}
