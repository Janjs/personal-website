"use client";

import { useMemo } from "react";

import { Part, RBox, canvasTexture } from "@/components/room/primitives";

const codeLines = [[0, 180, "#c792ea"], [1, 260, "#82aaff"], [2, 140, "#c3e88d"], [1, 300, "#f2c66d"], [2, 220, "#82aaff"], [3, 160, "#c3e88d"], [2, 240, "#f78c6c"], [1, 120, "#c792ea"], [0, 90, "#82aaff"], [1, 280, "#c3e88d"], [2, 200, "#f2c66d"], [1, 150, "#c792ea"]] as const;

function screenTexture() {
  return canvasTexture(640, 360, (ctx) => {
    ctx.fillStyle = "#1e1f2b";
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = "#272838";
    ctx.fillRect(0, 0, 120, 360);
    ctx.fillRect(0, 0, 640, 24);
    ctx.fillStyle = "#3a3c52";
    for (let y = 44; y < 200; y += 22) ctx.fillRect(16, y, 70 + (y % 3) * 10, 8);
    codeLines.forEach(([indent, width, color], index) => {
      const y = 44 + index * 24;
      ctx.fillStyle = "#4b4d66";
      ctx.fillRect(132, y, 14, 8);
      ctx.fillStyle = color;
      ctx.fillRect(160 + indent * 24, y, width, 8);
    });
  });
}

function keyboardTexture() {
  return canvasTexture(620, 200, (ctx) => {
    ctx.fillStyle = "#d9d4ca";
    ctx.fillRect(0, 0, 620, 200);
    ctx.fillStyle = "#f7f4ee";
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 14; col++) ctx.fillRect(12 + col * 43, 14 + row * 44, 36, 36);
    }
    ctx.fillRect(12, 146, 122, 36);
    ctx.fillRect(141, 146, 338, 36);
    ctx.fillRect(486, 146, 122, 36);
  });
}

function OfficeChair() {
  return (
    <group position={[-0.5, 0, -0.45]} rotation={[0, -0.15, 0]}>
      {Array.from({ length: 5 }, (_, index) => (
        <group key={index} rotation={[0, (index * Math.PI * 2) / 5, 0]}>
          <RBox color="#2f2c2a" size={[0.05, 0.035, 0.3]} radius={0.012} position={[0, 0.07, 0.15]} />
          <Part color="#1f1d1c" position={[0, 0.03, 0.29]}><sphereGeometry args={[0.03, 16, 12]} /></Part>
        </group>
      ))}
      <Part color="#8f8f8f" roughness={0.3} position={[0, 0.27, 0]}><cylinderGeometry args={[0.025, 0.03, 0.4, 16]} /></Part>
      <RBox color="#3b3633" size={[0.55, 0.09, 0.52]} radius={0.04} position={[0, 0.5, 0]} />
      <RBox color="#2f2c2a" size={[0.05, 0.42, 0.04]} radius={0.015} position={[0, 0.68, 0.27]} />
      <RBox color="#3b3633" size={[0.5, 0.58, 0.07]} radius={0.04} position={[0, 1.02, 0.29]} rotation={[-0.1, 0, 0]} />
    </group>
  );
}

export function DeskSetup({ dark }: { dark: boolean }) {
  const screen = useMemo(() => screenTexture(), []);
  const keys = useMemo(() => keyboardTexture(), []);

  return (
    <>
      <group position={[-0.45, 1.15, -1.72]}>
        <RBox color="#2b2b2e" size={[0.3, 0.02, 0.2]} radius={0.008} position={[0, 0.01, 0]} />
        <RBox color="#2b2b2e" size={[0.06, 0.3, 0.035]} radius={0.01} position={[0, 0.17, -0.03]} />
        <RBox color="#232326" size={[0.95, 0.56, 0.035]} radius={0.015} position={[0, 0.4, 0]} />
        <mesh position={[0, 0.405, 0.018]}>
          <planeGeometry args={[0.91, 0.51]} />
          <meshBasicMaterial map={screen} toneMapped={false} color={dark ? "#ffffff" : "#d9d9d9"} />
        </mesh>
      </group>
      <group position={[-0.5, 1.15, -1.2]}>
        <RBox color="#d9d4ca" size={[0.62, 0.025, 0.2]} radius={0.008} position={[0, 0.0125, 0]} />
        <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.19]} />
          <meshStandardMaterial map={keys} roughness={0.6} />
        </mesh>
      </group>
      <RBox color="#3a3f4a" size={[0.3, 0.006, 0.24]} radius={0.002} position={[0.02, 1.153, -1.2]} />
      <Part color="#e8e4dc" roughness={0.4} position={[0.02, 1.17, -1.2]} scale={[0.75, 0.45, 1.1]}><sphereGeometry args={[0.045, 32, 16]} /></Part>
      <OfficeChair />
    </>
  );
}
