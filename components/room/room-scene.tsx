"use client";

import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Outline, Selection } from "@react-three/postprocessing";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useState, type ReactNode } from "react";

import { Basketball } from "@/components/room/basketball";
import { Cat } from "@/components/room/cat";
import { Furniture } from "@/components/room/furniture";
import { Guitar } from "@/components/room/guitar";
import { RecordPlayer } from "@/components/room/record-player";
import { GuinnessPint, SagradaFamilia, SeoulTower } from "@/components/room/souvenirs";
import { Poster, Window } from "@/components/room/wall-art";

export type RoomItemId = "guitar" | "vinyl" | "cat" | "poster" | "basketball" | "window" | "barcelona" | "seoul" | "dublin";

function FitZoom() {
  useFrame(({ camera, size }) => {
    const zoom = Math.min(size.width, size.height) / 6.1;
    if (camera.zoom === zoom) return;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  });
  return null;
}

export function RoomScene({ selected, playing, pets, quotes, onSelect }: {
  selected: RoomItemId | null;
  playing: boolean;
  pets: number;
  quotes: Record<RoomItemId, ReactNode>;
  onSelect: (id: RoomItemId | null) => void;
}) {
  const dark = useTheme().resolvedTheme === "dark";
  const glow = dark ? 0xffd28a : 0xffffff;
  const [finePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const pick = (id: RoomItemId) => ({ active: selected === id, onSelect: () => onSelect(id), tip: quotes[id] });

  return (
    <Canvas
      orthographic
      flat
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: [10, 8.5, 10], zoom: 40 }}
      onPointerMissed={() => onSelect(null)}
      role="img"
      aria-label="Isometric 3D workspace with a desk setup, guitar, cat, record player, poster, basketball, and souvenirs"
    >
      <FitZoom />
      <OrbitControls
        enabled={finePointer}
        enableZoom={false}
        enablePan={false}
        minAzimuthAngle={0.2}
        maxAzimuthAngle={Math.PI / 2 - 0.2}
        minPolarAngle={0.55}
        maxPolarAngle={1.35}
        rotateSpeed={0.6}
      />
      <hemisphereLight args={[dark ? "#8f9bd6" : "#fff4e0", dark ? "#3a2f28" : "#c9a77c", dark ? 0.7 : 1.1]} />
      <ambientLight intensity={dark ? 0.35 : 0.5} color="#fff1dc" />
      <directionalLight
        castShadow
        position={[6, 10, 4]}
        intensity={dark ? 0.5 : 1.7}
        color={dark ? "#b8c4ff" : "#ffe2b8"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline blur edgeStrength={8} width={1200} visibleEdgeColor={glow} hiddenEdgeColor={glow} />
        </EffectComposer>
        <group position={[0.05, -1.65, 0.05]}>
          <Furniture dark={dark} />
          <Guitar {...pick("guitar")} />
          <Cat {...pick("cat")} pets={pets} />
          <RecordPlayer {...pick("vinyl")} playing={playing} />
          <Poster {...pick("poster")} />
          <Basketball {...pick("basketball")} />
          <Window {...pick("window")} dark={dark} />
          <SagradaFamilia {...pick("barcelona")} />
          <SeoulTower {...pick("seoul")} />
          <GuinnessPint {...pick("dublin")} />
        </group>
      </Selection>
    </Canvas>
  );
}
