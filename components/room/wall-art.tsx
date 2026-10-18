"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Plane, SRGBColorSpace, Vector3, type Group, type Object3D } from "three";

import { Canal } from "@/components/room/canal";
import { Pickable, RBox, type ItemProps } from "@/components/room/primitives";

function PosterImage() {
  const texture = useTexture("/workspace/la-bola-negra.jpg", (loaded) => {
    loaded.colorSpace = SRGBColorSpace;
  });

  return (
    <mesh position={[0, 0, 0.021]}>
      <planeGeometry args={[0.85, 1.26]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}

export function Poster(props: ItemProps) {
  return (
    <Pickable {...props} tipY={0.72} tipMinBottom={500} position={[1.4, 2.2, -1.97]}>
      <RBox color="#2a211b" size={[0.93, 1.34, 0.04]} radius={0.015} />
      <Suspense fallback={null}>
        <PosterImage />
      </Suspense>
    </Pickable>
  );
}

const clipPoint = new Vector3();

export function Window({ dark, ...props }: ItemProps & { dark: boolean }) {
  const gl = useThree((state) => state.gl);
  const canalRef = useRef<Group>(null);

  const clipPlanes = useMemo(() => [
    new Plane(new Vector3(0, -1, 0), 1.49),
    new Plane(new Vector3(0, 1, 0), -0.15),
    new Plane(new Vector3(1, 0, 0), 1.32),
    new Plane(new Vector3(-1, 0, 0), -0.52),
    new Plane(new Vector3(0, 0, -1), -2.14),
  ], []);

  useFrame(({ camera }) => {
    gl.localClippingEnabled = true;
    const dx = camera.position.x + 0.4;
    const dy = camera.position.y - 0.81;
    const dz = camera.position.z + 2.15;
    const hx = 0.9;
    const hy = 0.65;

    clipPlanes[0].normal.set(0, -dz, dy).normalize();
    clipPlanes[0].constant = -clipPlanes[0].normal.dot(clipPoint.set(-0.4, 0.81 + hy, -2.15));

    clipPlanes[1].normal.set(0, dz, -dy).normalize();
    clipPlanes[1].constant = -clipPlanes[1].normal.dot(clipPoint.set(-0.4, 0.81 - hy, -2.15));

    clipPlanes[2].normal.set(dz, 0, -dx).normalize();
    clipPlanes[2].constant = -clipPlanes[2].normal.dot(clipPoint.set(-0.4 - hx, 0.81, -2.15));

    clipPlanes[3].normal.set(-dz, 0, dx).normalize();
    clipPlanes[3].constant = -clipPlanes[3].normal.dot(clipPoint.set(-0.4 + hx, 0.81, -2.15));

    clipPlanes[4].normal.set(0, 0, -1);
    clipPlanes[4].constant = -2.15;

    canalRef.current?.traverse((child: Object3D) => {
      const mesh = child as Object3D & { material?: { clippingPlanes?: Plane[]; clipShadows?: boolean; needsUpdate?: boolean } };
      if (mesh.material && mesh.material.clippingPlanes !== clipPlanes) {
        mesh.material.clippingPlanes = clipPlanes;
        mesh.material.clipShadows = true;
        mesh.material.needsUpdate = true;
      }
    });
  });

  return (
    <Pickable {...props} tipY={0.8} position={[-0.45, 2.46, -1.98]}>
      <RBox color="#d8cec0" castShadow={false} size={[1.92, 0.06, 0.24]} position={[0, 0.67, -0.1]} />
      <RBox color="#dfd5c6" castShadow={false} size={[1.92, 0.06, 0.24]} position={[0, -0.67, -0.1]} />
      <RBox color="#d2c7b6" castShadow={false} size={[0.06, 1.38, 0.24]} position={[-0.93, 0, -0.1]} />
      <RBox color="#e5dccf" castShadow={false} size={[0.06, 1.38, 0.24]} position={[0.93, 0, -0.1]} />

      <group ref={canalRef} position={[0, -0.38, -0.18]}>
        <Canal dark={dark} />
      </group>

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
