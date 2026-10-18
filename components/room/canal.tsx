"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BackSide, type Group, type Mesh } from "three";

import { Part, RBox } from "@/components/room/primitives";

const farHouses = [
  [-1.85, 0.34, 0.95, 0.42, "#c2553e"],
  [-1.48, 0.3, 0.78, 0.36, "#566b82"],
  [-1.14, 0.36, 1.08, 0.4, "#d48557"],
  [-0.76, 0.32, 0.86, 0.38, "#9e7454"],
  [-0.4, 0.34, 0.98, 0.42, "#b55b47"],
  [-0.04, 0.3, 0.8, 0.36, "#6f8760"],
  [0.3, 0.36, 1.02, 0.4, "#c47c54"],
  [0.68, 0.32, 0.88, 0.38, "#7a8ea3"],
  [1.04, 0.34, 0.74, 0.36, "#c2553e"],
] as const;

const nearHouses = [
  [-1.7, 0.3, 0.7, 0.32, "#b55b47"],
  [-1.32, 0.28, 0.62, 0.3, "#9e7454"],
  [0.85, 0.32, 0.78, 0.34, "#566b82"],
  [1.2, 0.28, 0.66, 0.3, "#c47c54"],
] as const;

function House({ x, z, w, h, d, color, dark, face }: { x: number; z: number; w: number; h: number; d: number; color: string; dark: boolean; face: number }) {
  return (
    <group position={[x, 0, z]}>
      <RBox color={dark ? (x + z > 0 ? "#4a5078" : "#3f4469") : color} size={[w, h, d]} radius={0.01} position={[0, h / 2, 0]} />
      <Part color={dark ? "#2a2e47" : "#594134"} position={[0, h + 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(w, d) * 0.7, 0.22, 4]} />
      </Part>
      {[0.16, 0.38, 0.6, 0.82].filter((wy) => wy < h - 0.1).map((wy) =>
        [-0.07, 0.07].map((wx) => (
          <mesh key={`${wy}${wx}`} position={[wx, wy, face * (d / 2 + 0.005)]}>
            <planeGeometry args={[0.055, 0.075]} />
            <meshBasicMaterial color={dark ? "#ffd87d" : "#fcf6e8"} toneMapped={false} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Tree({ x, z, dark, scale = 1 }: { x: number; z: number; dark: boolean; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <Part color="#6b4e39" position={[0, 0.12, 0]}><cylinderGeometry args={[0.022, 0.03, 0.24, 8]} /></Part>
      <Part color={dark ? "#4c7a62" : "#6c9452"} position={[0, 0.32, 0]}><sphereGeometry args={[0.13, 16, 12]} /></Part>
      <Part color={dark ? "#3e6a54" : "#c4a24a"} position={[0.06, 0.3, 0.04]}><sphereGeometry args={[0.08, 12, 10]} /></Part>
    </group>
  );
}

export function Canal({ dark }: { dark: boolean }) {
  const boatRef = useRef<Group>(null);
  const waterRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (boatRef.current) {
      boatRef.current.position.x = -0.35 + Math.sin(t * 0.32) * 0.9;
      boatRef.current.position.y = -0.12 + Math.sin(t * 1.7) * 0.012;
      boatRef.current.rotation.z = Math.sin(t * 1.4) * 0.04;
      boatRef.current.rotation.x = Math.sin(t * 1.1) * 0.02;
    }
    const water = waterRef.current;
    if (!water) return;
    const pos = water.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 4.2 + t * 1.1) * 0.012 + Math.sin(y * 3.4 + x + t * 0.85) * 0.01);
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[-0.4, 0.6, -2.4]}>
        <sphereGeometry args={[7, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={dark ? "#17223b" : "#8ec6eb"} side={BackSide} toneMapped={false} />
      </mesh>
      <mesh position={[1.4, 1.35, -3.2]}>
        <circleGeometry args={[dark ? 0.14 : 0.18, 32]} />
        <meshBasicMaterial color={dark ? "#f7efd9" : "#fff5c0"} toneMapped={false} />
      </mesh>

      <directionalLight position={[-2.4, 3.2, 1.2]} intensity={dark ? 1.8 : 2.2} color={dark ? "#b0c8ff" : "#fff6de"} />

      <RBox color={dark ? "#5d5a7a" : "#b09a82"} size={[4.6, 0.1, 0.5]} radius={0.008} position={[0, 0.05, 0.12]} />
      {[-1.55, -0.95, -0.35, 0.25, 0.85].map((x) => (
        <Tree key={x} x={x} z={0.08} dark={dark} scale={0.85 + ((x * 10) % 7) * 0.03} />
      ))}
      <RBox color={dark ? "#44425c" : "#87735f"} size={[4.6, 0.28, 0.16]} radius={0.008} position={[0, -0.09, -0.18]} />

      <mesh ref={waterRef} position={[0, -0.16, -1.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 2.4, 24, 16]} />
        <meshStandardMaterial color={dark ? "#1a628f" : "#2b93c2"} roughness={0.08} metalness={0.28} />
      </mesh>

      <group ref={boatRef} position={[-0.35, -0.12, -0.95]} rotation={[0, 0.08, 0]}>
        <RBox color="#c75236" size={[0.52, 0.08, 0.18]} radius={0.018} />
        <RBox color="#faf2e3" size={[0.26, 0.065, 0.13]} radius={0.01} position={[0, 0.065, 0]} />
      </group>

      <group position={[-0.55, 0.02, -1.35]}>
        <RBox color={dark ? "#6d688f" : "#8a7460"} size={[0.16, 0.12, 2.55]} radius={0.01} position={[0, 0.18, 0]} />
        <RBox color={dark ? "#5a5578" : "#7a6756"} size={[0.5, 0.08, 0.42]} radius={0.01} position={[0, 0.28, 0]} />
        <Part color={dark ? "#17374f" : "#4a3c32"} position={[0, -0.02, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 20, 1, false, 0, Math.PI]} />
        </Part>
        <Part color={dark ? "#17374f" : "#4a3c32"} position={[0, -0.02, -0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 20, 1, false, 0, Math.PI]} />
        </Part>
      </group>

      <RBox color={dark ? "#44425c" : "#87735f"} size={[4.6, 0.28, 0.16]} radius={0.008} position={[0, -0.09, -2.52]} />
      <RBox color={dark ? "#5d5a7a" : "#b09a82"} size={[4.6, 0.1, 0.55]} radius={0.008} position={[0, 0.05, -2.82]} />
      {[-1.4, -0.7, 0.05, 0.7].map((x) => (
        <Tree key={x} x={x} z={-2.72} dark={dark} />
      ))}

      {farHouses.map(([x, w, h, d, color], i) => (
        <House key={`f${x}`} x={x} z={-3.05 - (i % 3) * 0.12} w={w} h={h} d={d} color={color} dark={dark} face={1} />
      ))}
      {nearHouses.map(([x, w, h, d, color]) => (
        <House key={`n${x}`} x={x} z={0.28} w={w} h={h} d={d} color={color} dark={dark} face={-1} />
      ))}

      <group position={[0.15, 0, -3.55]}>
        <RBox color={dark ? "#545a85" : "#cfc6b6"} size={[0.28, 1.35, 0.28]} radius={0.01} position={[0, 0.68, 0]} />
        <RBox color={dark ? "#636a99" : "#ddd4c4"} size={[0.2, 0.28, 0.2]} radius={0.008} position={[0, 1.48, 0]} />
        <Part color={dark ? "#3e4366" : "#b9ae9c"} position={[0, 1.74, 0]}><coneGeometry args={[0.09, 0.28, 8]} /></Part>
      </group>
    </group>
  );
}
