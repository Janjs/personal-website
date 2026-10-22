"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode, type Ref } from "react";
import type { Group, Object3D } from "three";

import { getRoomFx } from "@/components/room/room-fx";
import { armTerminalKeyboard } from "@/components/room/terminal-keyboard";
import { getTerminalScreen } from "@/components/room/terminal-screen";
import { Part, Pickable, RBox, canvasTexture, type ItemProps } from "@/components/room/primitives";

const screenPx = [640, 360] as const;
const screenSize = [0.91, 0.51] as const;

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
          <RBox color="#b7afa3" size={[0.05, 0.035, 0.3]} radius={0.012} position={[0, 0.07, 0.15]} />
          <Part color="#8f887f" position={[0, 0.03, 0.29]}><sphereGeometry args={[0.03, 16, 12]} /></Part>
        </group>
      ))}
      <Part color="#c8c0b5" roughness={0.3} position={[0, 0.27, 0]}><cylinderGeometry args={[0.025, 0.03, 0.4, 16]} /></Part>
      <RBox color="#d8d1c4" size={[0.55, 0.09, 0.52]} radius={0.04} position={[0, 0.5, 0]} />
      <RBox color="#b7afa3" size={[0.05, 0.42, 0.04]} radius={0.015} position={[0, 0.68, 0.27]} />
      <RBox color="#d8d1c4" size={[0.5, 0.58, 0.07]} radius={0.04} position={[0, 1.02, 0.27]} rotation={[0.08, 0, 0]} />
    </group>
  );
}

function Sandwich() {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = getRoomFx().sandwich;
  });

  return (
    <group ref={ref} visible={false} position={[0.18, 0.03, 0.08]}>
      <RBox color="#e8d2a8" size={[0.09, 0.012, 0.07]} radius={0.004} position={[0, 0, 0]} />
      <RBox color="#6a9a4a" size={[0.082, 0.008, 0.062]} radius={0.003} position={[0, 0.01, 0]} />
      <RBox color="#c45c3a" size={[0.078, 0.01, 0.058]} radius={0.003} position={[0, 0.018, 0]} />
      <RBox color="#f0e2c4" size={[0.09, 0.012, 0.07]} radius={0.004} position={[0, 0.028, 0]} />
    </group>
  );
}

function DeskPeripherals({ dark, monitorRef, onOpenMonitor, terminal, hot }: { dark: boolean; monitorRef?: Ref<Object3D>; onOpenMonitor?: () => void; terminal?: ReactNode; hot?: boolean }) {
  const screen = useMemo(() => getTerminalScreen(), []);
  const keys = useMemo(() => keyboardTexture(), []);

  return (
    <>
      <group
        position={[0, 0, -0.27]}
        onPointerDown={(event) => {
          event.stopPropagation();
          armTerminalKeyboard();
          onOpenMonitor?.();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onOpenMonitor?.();
        }}
      >
        <RBox color="#2b2b2e" size={[0.3, 0.02, 0.2]} radius={0.008} position={[0, 0.01, 0]} />
        <RBox color="#2b2b2e" size={[0.06, 0.3, 0.035]} radius={0.01} position={[0, 0.17, -0.03]} />
        <RBox color="#232326" size={[0.95, 0.56, 0.035]} radius={0.015} position={[0, 0.4, 0]} />
        <group position={[0, 0.405, 0.018]}>
          <mesh ref={monitorRef}>
            <planeGeometry args={[0.91, 0.51]} />
            <meshBasicMaterial map={screen} toneMapped={false} color={dark ? "#ffffff" : "#d9d9d9"} />
          </mesh>
          {terminal ? (
            <Html
              transform
              distanceFactor={400}
              position={[0, 0, 0.001]}
              scale={[screenSize[0] / screenPx[0], screenSize[1] / screenPx[1], 1]}
              pointerEvents={hot ? "auto" : "none"}
              zIndexRange={[40, 0]}
              style={{ background: "transparent" }}
            >
              {terminal}
            </Html>
          ) : null}
        </group>
      </group>
      <group position={[-0.05, 0, 0.25]}>
        <RBox color="#d9d4ca" size={[0.62, 0.025, 0.2]} radius={0.008} position={[0, 0.0125, 0]} />
        <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.19]} />
          <meshStandardMaterial map={keys} roughness={0.6} />
        </mesh>
      </group>
      <RBox color="#3a3f4a" size={[0.3, 0.006, 0.24]} radius={0.002} position={[0.47, 0.003, 0.25]} />
      <Part color="#e8e4dc" roughness={0.4} position={[0.47, 0.02, 0.25]} scale={[0.75, 0.45, 1.1]}><sphereGeometry args={[0.045, 32, 16]} /></Part>
      <Sandwich />
    </>
  );
}

export function Desk({ dark, monitorRef, onOpenMonitor, terminal, hot, ...props }: ItemProps & { dark: boolean; monitorRef?: Ref<Object3D>; onOpenMonitor?: () => void; terminal?: ReactNode; hot?: boolean }) {
  return (
    <>
      <Pickable {...props} tipY={0.62} position={[-0.45, 1.15, -1.45]}>
        <DeskPeripherals dark={dark} monitorRef={monitorRef} onOpenMonitor={onOpenMonitor} terminal={terminal} hot={hot} />
      </Pickable>
      <OfficeChair />
    </>
  );
}
