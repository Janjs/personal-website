"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";

import { Pickable, canvasTexture, type ItemProps } from "@/components/room/primitives";

function ballTexture() {
  return canvasTexture(1024, 512, (ctx) => {
    ctx.fillStyle = "#d2652d";
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = "#b9541f";
    for (let i = 0; i < 6000; i++) ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2);
    ctx.strokeStyle = "#2a1a12";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(1024, 256);
    for (const x of [2, 512, 1022]) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
    }
    for (const [center, direction] of [[256, 1], [768, -1]]) {
      ctx.moveTo(center, 0);
      for (let y = 0; y <= 512; y += 4) ctx.lineTo(center + direction * 130 * Math.sin((Math.PI * y) / 512), y);
    }
    ctx.stroke();
  });
}

export function Basketball({ active, ...props }: ItemProps) {
  const ball = useRef<Group>(null);
  const texture = useMemo(() => ballTexture(), []);

  useFrame(({ clock }) => {
    if (!ball.current) return;
    const bounce = Math.abs(Math.sin(clock.elapsedTime * 6));
    ball.current.position.y = active ? bounce * 0.45 : 0;
    ball.current.scale.set(1, active ? 0.9 + 0.1 * Math.min(1, bounce * 4) : 1, 1);
  });

  return (
    <Pickable active={active} {...props} tipY={0.75} position={[-1.3, 0.26, 1.4]}>
      <group ref={ball}>
        <mesh rotation={[0.4, 0.6, 0.2]} castShadow receiveShadow>
          <sphereGeometry args={[0.26, 64, 48]} />
          <meshStandardMaterial map={texture} roughness={0.8} />
        </mesh>
      </group>
    </Pickable>
  );
}
