"use client";

import { Html, RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import { useState, type ComponentProps, type ReactNode } from "react";
import { CanvasTexture, SRGBColorSpace, Vector3 } from "three";

export type ItemProps = { active: boolean; onSelect: () => void; tip: ReactNode };

export function Part({ color, roughness = 0.75, children, ...props }: ThreeElements["mesh"] & { color: string; roughness?: number }) {
  return (
    <mesh castShadow receiveShadow {...props}>
      {children}
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

export function RBox({ size, radius = 0.02, color, ...props }: Omit<ComponentProps<typeof RoundedBox>, "args"> & { size: [number, number, number]; radius?: number; color: string }) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={4} castShadow receiveShadow {...props}>
      <meshStandardMaterial color={color} roughness={0.75} />
    </RoundedBox>
  );
}

const projected = new Vector3();
const TIP_HALF_WIDTH = 128;
const TIP_MIN_BOTTOM = 150;

export function Pickable({
  active,
  onSelect,
  tip,
  tipY = 0.5,
  tipMinBottom = TIP_MIN_BOTTOM,
  children,
  ...props
}: ThreeElements["group"] & ItemProps & { tipY?: number; tipMinBottom?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      {...props}
      onClick={(event) => {
        event.stopPropagation();
        if (event.delta > 4) return;
        onSelect();
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
      <Select enabled={hovered || active}>{children}</Select>
      {active && (
        <Html
          position={[0, tipY, 0]}
          zIndexRange={[30, 0]}
          calculatePosition={(object, camera, size) => {
            projected.setFromMatrixPosition(object.matrixWorld).project(camera);
            const x = ((projected.x + 1) / 2) * size.width;
            const y = ((1 - projected.y) / 2) * size.height;
            return [Math.min(Math.max(x, TIP_HALF_WIDTH + 8), size.width - TIP_HALF_WIDTH - 8), Math.max(y, tipMinBottom)];
          }}
        >
          <blockquote className="w-64 max-[700px]:hidden -translate-x-1/2 -translate-y-full rounded-xl bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-sm ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95">
            {tip}
          </blockquote>
        </Html>
      )}
    </group>
  );
}

export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
