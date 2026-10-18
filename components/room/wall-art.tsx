"use client";

import { useTexture } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { SRGBColorSpace } from "three";

import { Pickable, RBox, canvasTexture, type ItemProps } from "@/components/room/primitives";

function PosterImage() {
  const texture = useTexture("/workspace/la-bola-negra.jpg", (loaded) => {
    loaded.colorSpace = SRGBColorSpace;
  });

  return (
    <mesh position={[0, 0, 0.021]}>
      <planeGeometry args={[0.95, 1.4]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}

export function Poster(props: ItemProps) {
  return (
    <Pickable {...props} tipY={0.8} tipMinBottom={500} position={[1.4, 2.2, -1.97]}>
      <RBox color="#2a211b" size={[1.03, 1.48, 0.04]} radius={0.015} />
      <Suspense fallback={null}>
        <PosterImage />
      </Suspense>
    </Pickable>
  );
}

const gables = [90, 120, 70, 110, 85, 130, 95];

export function Window({ dark, ...props }: ItemProps & { dark: boolean }) {
  const texture = useMemo(() => canvasTexture(600, 400, (ctx) => {
    const sky = ctx.createLinearGradient(0, 0, 0, 400);
    sky.addColorStop(0, dark ? "#1d2742" : "#a9cfe8");
    sky.addColorStop(1, dark ? "#46466e" : "#f6e4c4");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = dark ? "#f1ead8" : "#fff4d6";
    ctx.beginPath();
    ctx.arc(470, 90, dark ? 28 : 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = dark ? "#2a2a40" : "#b39c82";
    ctx.fillRect(250, 120, 60, 280);
    ctx.fillRect(260, 80, 40, 40);
    ctx.beginPath();
    ctx.moveTo(262, 80);
    ctx.lineTo(280, 30);
    ctx.lineTo(298, 80);
    ctx.fill();
    gables.forEach((height, index) => {
      const x = index * 88 - 10;
      ctx.fillStyle = dark ? "#23233a" : index % 2 ? "#a7685a" : "#8f7a66";
      ctx.fillRect(x, 400 - height, 80, height);
      ctx.beginPath();
      ctx.moveTo(x, 400 - height);
      ctx.lineTo(x + 40, 360 - height);
      ctx.lineTo(x + 80, 400 - height);
      ctx.fill();
      if (dark) {
        ctx.fillStyle = "#f2c66d";
        ctx.fillRect(x + 30, 420 - height, 18, 22);
      }
    });
  }), [dark]);

  return (
    <Pickable {...props} tipY={0.75} position={[-0.45, 2.5, -1.98]}>
      <mesh>
        <planeGeometry args={[1.8, 1.2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <RBox color="#fbf6ee" size={[1.96, 0.08, 0.08]} position={[0, 0.64, 0.04]} />
      <RBox color="#fbf6ee" size={[0.08, 1.28, 0.08]} position={[-0.94, 0, 0.04]} />
      <RBox color="#fbf6ee" size={[0.08, 1.28, 0.08]} position={[0.94, 0, 0.04]} />
      <RBox color="#fbf6ee" size={[0.04, 1.2, 0.04]} radius={0.01} position={[0, 0, 0.02]} />
      <RBox color="#fbf6ee" size={[1.8, 0.04, 0.04]} radius={0.01} position={[0, 0, 0.02]} />
      {[-1.12, 1.12].map((x) => (
        <RBox key={x} color="#e9d3ae" size={[0.28, 1.45, 0.06]} radius={0.025} position={[x, 0, 0.08]} />
      ))}
    </Pickable>
  );
}
