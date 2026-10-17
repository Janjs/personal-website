"use client";

import { useMemo } from "react";
import { LatheGeometry, Vector2 } from "three";

import { Part, Pickable, RBox, type ItemProps } from "@/components/room/primitives";

const spires = [[-0.065, 0.2], [-0.035, 0.27], [-0.012, 0.34], [0.012, 0.34], [0.035, 0.27], [0.065, 0.2]];

export function SagradaFamilia(props: ItemProps) {
  return (
    <Pickable {...props} tipY={0.5} position={[-1.82, 2.225, 0.88]} rotation={[0, Math.PI / 2, 0]}>
      <RBox color="#c49a6c" size={[0.2, 0.04, 0.12]} radius={0.01} position={[0, 0.02, 0]} />
      <RBox color="#d8b98a" size={[0.16, 0.08, 0.08]} radius={0.01} position={[0, 0.08, 0]} />
      {spires.map(([x, height]) => (
        <group key={x} position={[x, 0.04, 0]}>
          <Part color="#dcc195" position={[0, height / 2, 0]}><cylinderGeometry args={[0.006, 0.016, height, 24]} /></Part>
          <Part color="#e9b44c" position={[0, height + 0.01, 0]}><sphereGeometry args={[0.01, 16, 12]} /></Part>
        </group>
      ))}
    </Pickable>
  );
}

export function SeoulTower(props: ItemProps) {
  const tower = useMemo(() => new LatheGeometry([
    [0, 0], [0.07, 0], [0.07, 0.03], [0.03, 0.05], [0.014, 0.08], [0.012, 0.27], [0.04, 0.28], [0.045, 0.31], [0.035, 0.33], [0.01, 0.34], [0.006, 0.36], [0, 0.36],
  ].map(([x, y]) => new Vector2(x, y)), 48), []);

  return (
    <Pickable {...props} tipY={0.55} position={[-1.82, 2.225, 1.15]}>
      <mesh geometry={tower} castShadow receiveShadow>
        <meshStandardMaterial color="#ece8e0" roughness={0.5} />
      </mesh>
      <Part color="#7f9a63" position={[0, 0.015, 0]}><cylinderGeometry args={[0.085, 0.09, 0.03, 48]} /></Part>
      <Part color="#d0533f" position={[0, 0.41, 0]}><cylinderGeometry args={[0.003, 0.005, 0.1, 12]} /></Part>
    </Pickable>
  );
}

export function GuinnessPint(props: ItemProps) {
  const glass = useMemo(() => new LatheGeometry([
    [0, 0], [0.04, 0], [0.043, 0.01], [0.05, 0.12], [0.055, 0.15], [0.052, 0.165], [0, 0.165],
  ].map(([x, y]) => new Vector2(x, y)), 48), []);

  return (
    <Pickable {...props} tipY={0.45} position={[-1.82, 2.225, 1.4]}>
      <mesh geometry={glass} castShadow receiveShadow>
        <meshStandardMaterial color="#1d1410" roughness={0.2} />
      </mesh>
      <Part color="#f1e6cf" roughness={0.9} position={[0, 0.18, 0]}><cylinderGeometry args={[0.052, 0.054, 0.03, 48]} /></Part>
    </Pickable>
  );
}
