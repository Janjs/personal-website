"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions, type Marker } from "cobe";

import { cn } from "@/lib/utils";

type GlobeProps = {
  className?: string;
  location: [number, number];
  label?: string;
};

const BASE_CONFIG: Omit<
  COBEOptions,
  "width" | "height" | "phi" | "theta" | "markers" | "devicePixelRatio"
> = {
  dark: 0,
  diffuse: 1.1,
  mapSamples: 16000,
  mapBrightness: 1.35,
  mapBaseBrightness: 0.05,
  baseColor: [0.86, 0.88, 0.92],
  markerColor: [239 / 255, 68 / 255, 68 / 255],
  glowColor: [1, 1, 1],
};

const INTERPOLATION_FACTOR = 0.12;
const DRAG_SENSITIVITY = 0.005;
const FOCUS_BIAS = {
  phi: (-20 * Math.PI) / 180,
  theta: (-20 * Math.PI) / 180,
} as const;

function locationToAngles([latitude, longitude]: [number, number]) {
  return {
    phi: ((-longitude - 90) * Math.PI) / 180 + FOCUS_BIAS.phi,
    theta: (latitude * Math.PI) / 180 + FOCUS_BIAS.theta,
  };
}

function interpolate(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function interpolateAngle(from: number, to: number, amount: number) {
  const fullTurn = Math.PI * 2;
  const shortestDelta = ((to - from + Math.PI) % fullTurn + fullTurn) % fullTurn - Math.PI;

  return from + shortestDelta * amount;
}

export function Globe({ className, location, label }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widthRef = useRef(0);
  const markerLocationRef = useRef(location);
  const targetRotationRef = useRef(locationToAngles(location));
  const currentRotationRef = useRef(locationToAngles(location));
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPhi: number;
    startTheta: number;
  } | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    markerLocationRef.current = location;
    targetRotationRef.current = locationToAngles(location);
  }, [location]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const onResize = () => {
      widthRef.current = canvas.offsetWidth || 1;
    };

    onResize();
    window.addEventListener("resize", onResize);

    const globe = createGlobe(canvas, {
      ...BASE_CONFIG,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: currentRotationRef.current.phi,
      theta: currentRotationRef.current.theta,
      markers: [],
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    });

    let frameId = 0;

    const render = () => {
      const target = targetRotationRef.current;

      currentRotationRef.current.phi = interpolateAngle(
        currentRotationRef.current.phi,
        target.phi,
        INTERPOLATION_FACTOR
      );
      currentRotationRef.current.theta = interpolate(
        currentRotationRef.current.theta,
        target.theta,
        INTERPOLATION_FACTOR
      );
      timeRef.current += 0.04;

      const dot = 0.038 + ((Math.sin(timeRef.current) + 1) / 2) * 0.004;

      const markers: Marker[] = [
        {
          location: markerLocationRef.current,
          size: dot,
          color: [239 / 255, 68 / 255, 68 / 255],
        },
      ];

      globe.update({
        phi: currentRotationRef.current.phi,
        theta: currentRotationRef.current.theta,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        markers,
      });

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPhi: targetRotationRef.current.phi,
      startTheta: targetRotationRef.current.theta,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const canvas = canvasRef.current;

    if (!dragState || !canvas || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    targetRotationRef.current.phi = dragState.startPhi + deltaX * DRAG_SENSITIVITY;
    targetRotationRef.current.theta = dragState.startTheta;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const canvas = canvasRef.current;

    if (!dragState || !canvas || dragState.pointerId !== event.pointerId) {
      return;
    }

    canvas.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;
  };

  return (
    <div className={cn("absolute inset-0", className)}>
      <canvas
        ref={canvasRef}
        aria-label={label ? `Animated globe focused on ${label}` : "Animated globe"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="size-full cursor-grab touch-none opacity-0 transition-opacity duration-700 active:cursor-grabbing [contain:layout_paint_size]"
      />
    </div>
  );
}
