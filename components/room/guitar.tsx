"use client";

import { useMemo } from "react";
import { ExtrudeGeometry, Shape } from "three";

import { Part, Pickable, RBox, type ItemProps } from "@/components/room/primitives";

function bodyGeometry() {
  const shape = new Shape();
  shape.moveTo(0, -0.45);
  shape.bezierCurveTo(0.34, -0.45, 0.36, -0.12, 0.2, -0.02);
  shape.bezierCurveTo(0.28, 0.06, 0.28, 0.3, 0, 0.3);
  shape.bezierCurveTo(-0.28, 0.3, -0.28, 0.06, -0.2, -0.02);
  shape.bezierCurveTo(-0.36, -0.12, -0.34, -0.45, 0, -0.45);
  return new ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 5, curveSegments: 64 });
}

const frets = Array.from({ length: 10 }, (_, index) => 0.33 + index * 0.055);
const strings = [-0.021, -0.013, -0.004, 0.004, 0.013, 0.021];

export function Guitar(props: ItemProps) {
  const body = useMemo(() => bodyGeometry(), []);

  return (
    <Pickable {...props} tipY={1.15} position={[-1.97, 1.95, -0.6]} rotation={[0.1, 0, 0]}>
      <mesh geometry={body} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" color="#e6bd82" roughness={0.45} />
        <meshStandardMaterial attach="material-1" color="#8a4f2a" roughness={0.45} />
      </mesh>
      <Part color="#2b1d14" position={[0.086, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.002, 48]} /></Part>
      <Part color="#7a4a2a" position={[0.086, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.085, 0.007, 8, 48]} /></Part>
      <RBox color="#3b2a1e" size={[0.02, 0.04, 0.17]} radius={0.008} position={[0.095, -0.26, 0]} />
      <RBox color="#7b4a28" size={[0.05, 0.66, 0.07]} radius={0.015} position={[0.05, 0.6, 0]} />
      <RBox color="#2e211a" size={[0.012, 0.62, 0.062]} radius={0.005} position={[0.08, 0.6, 0]} />
      {frets.map((y) => (
        <Part key={y} color="#d9d4c8" roughness={0.3} position={[0.087, y, 0]}><boxGeometry args={[0.003, 0.004, 0.062]} /></Part>
      ))}
      <RBox color="#2e211a" size={[0.035, 0.2, 0.1]} radius={0.012} position={[0.05, 1.02, 0]} />
      {[0.97, 1.03, 1.09].flatMap((y) => [-0.06, 0.06].map((z) => (
        <Part key={`${y}${z}`} color="#d9d4c8" roughness={0.3} position={[0.05, y, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 0.03, 12]} /></Part>
      )))}
      {strings.map((z) => (
        <Part key={z} color="#efe9dd" roughness={0.3} position={[0.1, 0.33, z]}><cylinderGeometry args={[0.0012, 0.0012, 1.18, 6]} /></Part>
      ))}
    </Pickable>
  );
}
