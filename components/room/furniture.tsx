"use client";

import { Select } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef, useState } from "react";
import { BackSide, CatmullRomCurve3, LatheGeometry, TubeGeometry, Vector2, Vector3, type Group, type PointLight } from "three";

import { plantSpot } from "@/components/room/floor-collision";
import { getRoomFx } from "@/components/room/room-fx";
import { Part, RBox } from "@/components/room/primitives";

const books = [
  [0.35, "#a3553f"],
  [0.3, "#5f7a8c"],
  [0.38, "#d9b25f"],
  [0.28, "#7d8f62"],
  [0.33, "#c98a6b"],
] as const;

const floorBoards = ["#c9ad88", "#d2b995", "#c5a57f", "#d8c09e", "#cbae88", "#d4ba96", "#c2a17a", "#d1b58e", "#c7a781", "#d6bd99"];

const leaves = Array.from({ length: 11 }, (_, index) => ({
  angle: index * 2.4,
  tilt: 0.35 + (index % 3) * 0.25,
  length: 0.22 + (index % 4) * 0.04,
  color: index % 2 ? "#7f9a63" : "#6d8a55",
}));

function Plant() {
  const pot = useMemo(() => new LatheGeometry([
    [0, 0], [0.16, 0], [0.2, 0.32], [0.23, 0.33], [0.23, 0.38], [0.2, 0.38], [0.2, 0.36], [0, 0.36],
  ].map(([x, y]) => new Vector2(x, y)), 48), []);

  return (
    <group position={[plantSpot.x, 0, plantSpot.z]}>
      <mesh geometry={pot} castShadow receiveShadow>
        <meshStandardMaterial color="#c46f4b" roughness={0.8} />
      </mesh>
      <Part color="#5a4232" position={[0, 0.365, 0]}><cylinderGeometry args={[0.19, 0.19, 0.01, 48]} /></Part>
      {leaves.map(({ angle, tilt, length, color }) => (
        <group key={angle} position={[0, 0.37, 0]} rotation={[0, angle, 0]}>
          <group rotation={[tilt, 0, 0]}>
            <Part color="#6b7f4f" position={[0, length / 2, 0]}><cylinderGeometry args={[0.006, 0.008, length, 8]} /></Part>
            <Part color={color} roughness={0.6} position={[0, length + 0.12, 0]} scale={[0.5, 1, 0.12]}><sphereGeometry args={[0.13, 32, 16]} /></Part>
          </group>
        </group>
      ))}
    </group>
  );
}

const stringBulbs = Array.from({ length: 14 }, (_, index) => {
  const t = index / 13;
  const span = index % 4;
  return [-1.98, 2.95 - (span === 1 || span === 2 ? 0.14 : 0) - t * 0.08, -1.75 + t * 3.45] as const;
});

function CoffeeSteam() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const live = performance.now() < getRoomFx().coffeeUntil;
    group.visible = live;
    if (!live) return;
    const t = clock.elapsedTime;
    group.children.forEach((child, index) => {
      const rise = ((t * 0.35 + index * 0.28) % 1);
      child.position.set((index - 1) * 0.018, 0.16 + rise * 0.22, 0);
      child.scale.setScalar(0.4 + rise * 0.8);
      const material = (child as { material?: { opacity: number } }).material;
      if (material) material.opacity = 0.35 * (1 - rise);
    });
  });

  return (
    <group ref={ref} visible={false} position={[-1.25, 1.15, -1.15]}>
      {[0, 1, 2].map((index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshBasicMaterial color="#f4efe6" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function StringLights({ dark }: { dark: boolean }) {
  const lights = useRef<Group>(null);
  const wire = useMemo(
    () => new TubeGeometry(new CatmullRomCurve3(stringBulbs.map(([x, y, z]) => new Vector3(x, y + 0.032, z))), 72, 0.004, 8, false),
    [],
  );

  useFrame(({ clock }) => {
    const { lights: mode, konami } = getRoomFx();
    const party = mode === "party" || konami;
    lights.current?.traverse((object) => {
      if (!("isPointLight" in object) || !object.isPointLight) return;
      const light = object as PointLight;
      if (mode === "off") light.intensity = 0.02;
      else if (party) {
        light.color.setHSL((clock.elapsedTime * 0.18 + light.position.z) % 1, 0.75, 0.6);
        light.intensity = 0.22;
      } else {
        light.color.set("#e8a050");
        light.intensity = dark ? 0.1 : 0;
      }
    });
  });

  return (
    <group ref={lights}>
      <mesh geometry={wire} castShadow>
        <meshStandardMaterial color="#3d352e" roughness={0.8} />
      </mesh>
      {stringBulbs.map(([x, y, z]) => (
        <group key={z} position={[x, y, z]}>
          <Part color="#3d352e" position={[0, 0.022, 0]}><cylinderGeometry args={[0.008, 0.01, 0.018, 12]} /></Part>
          <mesh>
            <sphereGeometry args={[0.022, 16, 12]} />
            {dark ? (
              <meshBasicMaterial color="#c48a38" toneMapped={false} />
            ) : (
              <meshStandardMaterial color="#f6efe2" roughness={0.35} />
            )}
          </mesh>
          {dark && <pointLight intensity={0.1} distance={1.05} decay={2} color="#e8a050" />}
        </group>
      ))}
    </group>
  );
}

function DeskLamp({ dark }: { dark: boolean }) {
  const { setTheme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[0.5, 1.15, -1.28]}
      onClick={(event) => {
        event.stopPropagation();
        if (event.delta > 4) return;
        setHovered(false);
        setTheme(dark ? "light" : "dark");
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      <Select enabled={hovered}>
      <Part color="#e3ded3" roughness={0.85} position={[0, 0.125, 0]}><cylinderGeometry args={[0.025, 0.098, 0.25, 36]} /></Part>
      <Part color="#dbd5c9" roughness={0.7} position={[0, 0.285, 0]}><cylinderGeometry args={[0.007, 0.007, 0.08, 16]} /></Part>
      <Part color="#e3ded3" roughness={0.65} position={[0, 0.34, 0]}><cylinderGeometry args={[0.018, 0.018, 0.04, 24]} /></Part>
      <Part color="#efebe2" roughness={0.6} position={[0, 0.365, 0]}><cylinderGeometry args={[0.034, 0.034, 0.01, 24]} /></Part>
      <mesh position={[0, 0.385, 0]}>
        <sphereGeometry args={[0.024, 16, 12]} />
        {dark ? (
          <meshBasicMaterial color="#ffe8a3" toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#f5efe2" roughness={0.4} />
        )}
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.165, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshStandardMaterial color="#e3ded3" emissive={dark ? "#e8d7b0" : "#000000"} emissiveIntensity={dark ? 0.55 : 0} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.161, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        {dark ? (
          <meshBasicMaterial color="#ffd466" side={BackSide} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#f0e7d5" side={BackSide} roughness={0.6} />
        )}
      </mesh>
      </Select>
      {dark && <pointLight position={[0.06, 0.22, 0.12]} intensity={0.4} distance={2.2} decay={2} color="#ffad47" />}
    </group>
  );
}

export function Furniture({ dark }: { dark: boolean }) {
  return (
    <>
      <Part color="#a98763" position={[-0.1, -0.1, -0.1]}><boxGeometry args={[4.2, 0.2, 4.2]} /></Part>
      {floorBoards.map((color, index) => (
        <Part key={color} color={color} roughness={0.82} position={[-0.1, 0.012, -1.89 + index * 0.4]}>
          <boxGeometry args={[4.16, 0.024, 0.38]} />
        </Part>
      ))}
      <Part color="#e6dccd" castShadow={false} position={[-2.1, 1.65, -0.1]}><boxGeometry args={[0.2, 3.3, 4.2]} /></Part>
      <Part color="#eee5d8" castShadow={false} position={[-0.1, 0.9, -2.1]}><boxGeometry args={[4.2, 1.8, 0.2]} /></Part>
      <Part color="#eee5d8" castShadow={false} position={[-0.1, 3.21, -2.1]}><boxGeometry args={[4.2, 0.18, 0.2]} /></Part>
      <Part color="#eee5d8" castShadow={false} position={[-1.7, 2.46, -2.1]}><boxGeometry args={[1.0, 1.32, 0.2]} /></Part>
      <Part color="#eee5d8" castShadow={false} position={[1.1, 2.46, -2.1]}><boxGeometry args={[1.8, 1.32, 0.2]} /></Part>
      <RBox color="#d8c8b3" castShadow={false} size={[0.04, 0.15, 4]} radius={0.01} position={[-1.98, 0.075, 0]} />
      <RBox color="#d8c8b3" castShadow={false} size={[4, 0.15, 0.04]} radius={0.01} position={[0, 0.075, -1.98]} />

      <Part color="#dfcfb7" castShadow={false} roughness={1} position={[0.35, 0.03, 0.35]}><cylinderGeometry args={[1.1, 1.1, 0.02, 96]} /></Part>

      <RBox color="#cbb391" size={[2.2, 0.08, 1]} radius={0.03} position={[-0.45, 1.11, -1.45]} />
      {[[-1.45, -1.85], [0.55, -1.85], [-1.45, -1.05], [0.55, -1.05]].map(([x, z]) => (
        <RBox key={`${x}${z}`} color="#aa8d6b" size={[0.07, 1.07, 0.07]} radius={0.02} position={[x, 0.535, z]} />
      ))}
      <group position={[-1.25, 1.15, -1.15]}>
        <Part color="#e9e2d6" roughness={0.4} position={[0, 0.06, 0]}><cylinderGeometry args={[0.055, 0.05, 0.12, 32]} /></Part>
        <Part color="#e9e2d6" roughness={0.4} position={[0.06, 0.06, 0]}><torusGeometry args={[0.03, 0.008, 12, 24]} /></Part>
      </group>
      <DeskLamp dark={dark} />

      <RBox color="#d2bea1" size={[1.1, 0.9, 0.9]} radius={0.03} position={[1.4, 0.45, -1.5]} />
      {[0.25, 0.62].map((y) => (
        <group key={y} position={[1.4, y, -1.045]}>
          <RBox color="#e0d1bb" size={[1, 0.32, 0.02]} radius={0.008} />
          <Part color="#8d735a" roughness={0.4} position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.18, 16]} /></Part>
        </group>
      ))}
      <RBox color="#fbf6ee" castShadow={false} size={[2.1, 0.06, 0.3]} position={[-0.45, 1.88, -1.85]} />

      <RBox color="#bfa17c" size={[0.35, 0.05, 1.4]} radius={0.015} position={[-1.82, 2.2, 0.9]} />
      {books.map(([height, color], index) => (
        <RBox key={color} color={color} size={[0.26, height, 0.08]} radius={0.01} position={[-1.85, 2.225 + height / 2, 0.3 + index * 0.09]} />
      ))}
      <StringLights dark={dark} />
      <Plant />
      <CoffeeSteam />
    </>
  );
}
