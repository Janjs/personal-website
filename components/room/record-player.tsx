"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

import { Part, Pickable, RBox, canvasTexture, type ItemProps } from "@/components/room/primitives";

function vinylTexture() {
  const texture = canvasTexture(512, 512, (ctx) => {
    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 0, 512, 512);
    for (let r = 90; r < 250; r += 3) {
      ctx.strokeStyle = r % 2 ? "#202020" : "#0d0d0d";
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#f4e2c4";
    ctx.beginPath();
    ctx.arc(256, 256, 84, 0, Math.PI * 2);
    ctx.fill();
  });
  const logo = new Image(512, 512);
  logo.onload = () => {
    texture.image.getContext("2d")?.drawImage(logo, 191, 186, 130, 130);
    texture.needsUpdate = true;
  };
  logo.src = "/project-icons/stroop.svg";
  return texture;
}

export function RecordPlayer({ playing, ...props }: ItemProps & { playing: boolean }) {
  const record = useRef<Group>(null);
  const arm = useRef<Group>(null);
  const texture = useMemo(() => vinylTexture(), []);

  useFrame((_, delta) => {
    if (playing && record.current) record.current.rotation.y -= delta * 3.5;
    if (arm.current) arm.current.rotation.y += ((playing ? -0.7 : 0) - arm.current.rotation.y) * (1 - Math.exp(-delta * 6));
  });

  return (
    <Pickable {...props} tipY={0.6} position={[1.4, 0.9, -1.5]}>
      <RBox color="#7a5236" size={[0.82, 0.13, 0.6]} radius={0.03} position={[0, 0.065, 0]} />
      <Part color="#bdbdbd" roughness={0.3} position={[-0.08, 0.14, 0]}><cylinderGeometry args={[0.25, 0.25, 0.02, 64]} /></Part>
      <group ref={record} position={[-0.08, 0.155, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.235, 0.235, 0.008, 64]} />
          <meshStandardMaterial attach="material-0" color="#151515" roughness={0.35} />
          <meshStandardMaterial attach="material-1" map={texture} roughness={0.35} />
          <meshStandardMaterial attach="material-2" color="#151515" />
        </mesh>
      </group>
      <group ref={arm} position={[0.3, 0.13, -0.2]}>
        <Part color="#d6d6d6" roughness={0.25} position={[0, 0.03, 0]}><cylinderGeometry args={[0.035, 0.04, 0.06, 32]} /></Part>
        <Part color="#d6d6d6" roughness={0.25} position={[0, 0.07, 0.14]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.34, 12]} /></Part>
        <Part color="#2a2a2a" position={[0, 0.07, -0.05]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.04, 24]} /></Part>
        <RBox color="#2a2a2a" size={[0.03, 0.02, 0.05]} radius={0.006} position={[0, 0.06, 0.32]} />
      </group>
      {[0.28, 0.34].map((x) => (
        <Part key={x} color="#d6d6d6" roughness={0.25} position={[x, 0.135, 0.22]}><cylinderGeometry args={[0.018, 0.018, 0.02, 24]} /></Part>
      ))}
    </Pickable>
  );
}
