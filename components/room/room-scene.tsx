"use client";

import { OrbitControls, useProgress } from "@react-three/drei";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DoubleSide, type Group, type Material } from "three";

import { Basketball } from "@/components/room/basketball";
import { Cat } from "@/components/room/cat";
import { Furniture } from "@/components/room/furniture";
import { Guitar } from "@/components/room/guitar";
import { RecordPlayer } from "@/components/room/record-player";
import { GuinnessPint, SagradaFamilia, SeoulTower } from "@/components/room/souvenirs";
import { Poster, Window } from "@/components/room/wall-art";

export type RoomItemId = "guitar" | "vinyl" | "cat" | "poster" | "basketball" | "window" | "barcelona" | "seoul" | "dublin";

function fitZoom(size: { width: number; height: number }) {
  // Keep the room at its original scale inside the canvas's 20% bleed on each side.
  return Math.min(size.width, size.height) / 1.4 / 6.1;
}

function RoomControls({ finePointer }: { finePointer: boolean }) {
  const size = useThree((state) => state.size);
  const fitRef = useRef(0);
  const fit = fitZoom(size);

  useFrame(({ camera, size: frameSize }) => {
    const nextFit = fitZoom(frameSize);
    if (fitRef.current !== nextFit) {
      camera.zoom = nextFit;
      camera.updateProjectionMatrix();
      fitRef.current = nextFit;
    }
  });

  return (
    <OrbitControls
      enabled={finePointer}
      enableZoom={false}
      enablePan={false}
      minZoom={fit}
      maxZoom={fit}
      minAzimuthAngle={0.2}
      maxAzimuthAngle={1.05}
      minPolarAngle={0.55}
      maxPolarAngle={1.35}
      rotateSpeed={0.6}
    />
  );
}

function SceneReady({ onReady }: { onReady: () => void }) {
  const ready = useRef(false);

  useFrame(() => {
    if (ready.current) return;
    ready.current = true;
    requestAnimationFrame(onReady);
  });

  return null;
}

function NoShadowGroup({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    ref.current?.traverse((obj) => {
      if (obj.castShadow) obj.castShadow = false;
    });
  });
  return <group ref={ref}>{children}</group>;
}

function ProgressReporter({ onProgress }: { onProgress: (progress: number) => void }) {
  const { progress } = useProgress();

  useEffect(() => onProgress(progress), [onProgress, progress]);

  return null;
}

export function RoomScene({ selected, playing, pets, quotes, onSelect, onProgress, onReady }: {
  selected: RoomItemId | null;
  playing: boolean;
  pets: number;
  quotes: Record<RoomItemId, ReactNode>;
  onSelect: (id: RoomItemId | null) => void;
  onProgress: (progress: number) => void;
  onReady: () => void;
}) {
  const dark = useTheme().resolvedTheme === "dark";
  const glow = dark ? 0xffd28a : 0xffffff;
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const pick = (id: RoomItemId) => ({ active: selected === id, onSelect: () => onSelect(id), tip: quotes[id] });

  return (
    <>
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        style={{ position: "absolute", inset: "-20%", width: "140%", height: "140%", background: "transparent" }}
        gl={{ alpha: true, stencil: true }}
        orthographic
        flat
        shadows
        dpr={[1, 2]}
        camera={{ position: [10, 8.5, 10], zoom: 40 }}
        onPointerMissed={() => onSelect(null)}
        role="img"
        aria-label="Isometric 3D workspace with a desk setup, guitar, cat, record player, poster, basketball, and souvenirs"
      >
        <SceneReady onReady={onReady} />
        <RoomControls finePointer={finePointer} />
      <hemisphereLight args={[dark ? "#6372b0" : "#fff6e5", dark ? "#332319" : "#d9be98", dark ? 0.52 : 1.35]} />
      <ambientLight intensity={dark ? 0.22 : 0.65} color={dark ? "#ffcf96" : "#fff4e2"} />
      <directionalLight
        castShadow
        position={dark ? [5.5, 9, 4] : [1.4, 4.2, -5.2]}
        intensity={dark ? 0.35 : 1.5}
        color={dark ? "#8da2e8" : "#ffe0b2"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-bias={-0.0002}
        shadow-normalBias={0.01}
      />
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            ref={(effect) => {
              if (effect) (effect as unknown as { maskPass: { overrideMaterial: Material } }).maskPass.overrideMaterial.side = DoubleSide;
            }}
            blur
            edgeStrength={8}
            width={1200}
            visibleEdgeColor={glow}
            hiddenEdgeColor={glow}
          />
        </EffectComposer>
        <group position={[0.05, -1.65, 0.05]}>
          <spotLight
            position={[0.35, 3.2, 0.35]}
            angle={0.7}
            penumbra={1}
            intensity={dark ? 22 : 8}
            distance={7}
            decay={2}
            color={dark ? "#ffe1a8" : "#fff6e5"}
          >
            <object3D attach="target" position={[0.35, 0.03, 0.35]} />
          </spotLight>
          <Furniture dark={dark} />
          <Guitar {...pick("guitar")} />
          <Cat {...pick("cat")} pets={pets} />
          <RecordPlayer {...pick("vinyl")} playing={playing} />
          <Basketball {...pick("basketball")} />
          <NoShadowGroup>
            <Poster {...pick("poster")} dark={dark} />
            <Window {...pick("window")} dark={dark} />
          </NoShadowGroup>
          <SagradaFamilia {...pick("barcelona")} />
          <SeoulTower {...pick("seoul")} />
          <GuinnessPint {...pick("dublin")} />
        </group>
      </Selection>
      </Canvas>
    </>
  );
}
