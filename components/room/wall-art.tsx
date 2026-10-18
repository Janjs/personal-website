"use client";

import { MeshPortalMaterial, useTexture } from "@react-three/drei";
import { Suspense } from "react";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { SRGBColorSpace } from "three";

RectAreaLightUniformsLib.init();

import { Canal } from "@/components/room/canal";
import { Pickable, RBox, type ItemProps } from "@/components/room/primitives";

function PosterImage() {
  const texture = useTexture("/workspace/la-bola-negra.jpg", (loaded) => {
    loaded.colorSpace = SRGBColorSpace;
  });

  return (
    <mesh position={[0, 0, 0.021]}>
      <planeGeometry args={[0.85, 1.26]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0} />
    </mesh>
  );
}

function PosterPictureLight({ dark }: { dark: boolean }) {
  return (
    <group position={[0, 0.64, 0.02]}>
      <RBox color="#2a211b" size={[0.7, 0.028, 0.046]} radius={0.005} position={[0, 0.014, 0.016]} />
      <mesh position={[0, -0.01, 0.04]} rotation={[-0.7, 0, 0]}>
        <boxGeometry args={[0.6, 0.008, 0.01]} />
        <meshStandardMaterial color={dark ? "#5c4a32" : "#cfc6b8"} emissive={dark ? "#e8b56a" : "#000000"} emissiveIntensity={dark ? 0.35 : 0} roughness={0.7} />
      </mesh>
      {dark ? (
        <rectAreaLight position={[0, 0.01, 0.04]} rotation={[-0.45, 0, 0]} width={0.58} height={0.06} intensity={6} color="#ffd7a1" />
      ) : null}
    </group>
  );
}

export function Poster({ dark, ...props }: ItemProps & { dark: boolean }) {
  return (
    <Pickable {...props} tipY={0.72} tipMinBottom={500} position={[1.4, 2.2, -1.97]}>
      <RBox color="#2a211b" size={[0.93, 1.34, 0.04]} radius={0.015} />
      <Suspense fallback={null}>
        <PosterImage />
      </Suspense>
      <PosterPictureLight dark={dark} />
    </Pickable>
  );
}

export function Window({ dark, ...props }: ItemProps & { dark: boolean }) {
  return (
    <Pickable {...props} tipY={0.8} position={[-0.45, 2.46, -1.98]}>
      <RBox color="#d8cec0" castShadow={false} size={[1.92, 0.06, 0.24]} position={[0, 0.67, -0.1]} />
      <RBox color="#dfd5c6" castShadow={false} size={[1.92, 0.06, 0.24]} position={[0, -0.67, -0.1]} />
      <RBox color="#d2c7b6" castShadow={false} size={[0.06, 1.38, 0.24]} position={[-0.93, 0, -0.1]} />
      <RBox color="#e5dccf" castShadow={false} size={[0.06, 1.38, 0.24]} position={[0.93, 0, -0.1]} />

      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[1.68, 1.18]} />
        <MeshPortalMaterial events={false}>
          <ambientLight intensity={dark ? 0.45 : 0.9} color={dark ? "#b0c8ff" : "#fff6de"} />
          <directionalLight position={[-2.2, 3, 1.4]} intensity={dark ? 1.6 : 2} color={dark ? "#b0c8ff" : "#fff6de"} />
          <Canal dark={dark} />
        </MeshPortalMaterial>
      </mesh>

      <RBox color="#fbf6ee" size={[1.96, 0.08, 0.1]} position={[0, 0.68, 0.03]} />
      <RBox color="#fbf6ee" size={[1.98, 0.06, 0.16]} position={[0, -0.67, 0.06]} />
      <RBox color="#fbf6ee" size={[0.08, 1.4, 0.1]} position={[-0.94, 0, 0.03]} />
      <RBox color="#fbf6ee" size={[0.08, 1.4, 0.1]} position={[0.94, 0, 0.03]} />
      {[-1.12, 1.12].map((x) => (
        <RBox key={x} color="#e9d3ae" size={[0.28, 1.5, 0.06]} radius={0.025} position={[x, 0, 0.08]} />
      ))}
    </Pickable>
  );
}
