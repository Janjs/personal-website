"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions, type Marker } from "cobe";

import { cn } from "@/lib/utils";

export type GlobeLocation = {
  id: string;
  location: [number, number];
  place: string;
  country: string;
  flag: string;
};

type GlobeProps = {
  className?: string;
  locations: GlobeLocation[];
  focusedLocation: [number, number];
  selectedLocationId?: string;
  onLocationSelect?: (locationId: string) => void;
};

const BASE_CONFIG: Omit<
  COBEOptions,
  | "width"
  | "height"
  | "phi"
  | "theta"
  | "markers"
  | "devicePixelRatio"
  | "dark"
  | "mapBrightness"
  | "mapBaseBrightness"
  | "baseColor"
  | "glowColor"
> = {
  diffuse: 1.1,
  mapSamples: 16000,
  markerColor: [239 / 255, 68 / 255, 68 / 255],
};

const THEME_CONFIG = {
  light: {
    dark: 0,
    mapBrightness: 1.35,
    mapBaseBrightness: 0.05,
    baseColor: [0.86, 0.88, 0.92],
    glowColor: [1, 1, 1],
  },
  dark: {
    dark: 1,
    mapBrightness: 0.65,
    mapBaseBrightness: 0.01,
    baseColor: [0.16, 0.42, 0.82],
    glowColor: [0.075, 0.12, 0.17],
  },
} satisfies Record<
  "light" | "dark",
  Pick<
    COBEOptions,
    "dark" | "mapBrightness" | "mapBaseBrightness" | "baseColor" | "glowColor"
  >
>;

const INTERPOLATION_FACTOR = 0.12;
const DRAG_SENSITIVITY = 0.005;
const MARKER_ELEVATION = 0;
const GLOBE_MARKER_RADIUS = 0.8 + MARKER_ELEVATION;
const FOCUS_BIAS = {
  phi: (-20 * Math.PI) / 180,
  theta: (-20 * Math.PI) / 180,
} as const;
const LABEL_CHIP_CLASS =
  "inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-xs leading-none whitespace-nowrap text-muted-foreground shadow-sm";
const LABEL_LINE_CLASS = "bg-[rgb(239,68,68)] dark:bg-emerald-400";

function getMarkerKey(location: Pick<GlobeLocation, "place" | "country">) {
  return `${location.place}::${location.country}`;
}

function uniqueByMarkerKey(locations: GlobeLocation[]) {
  return locations.filter((item, index, allLocations) => {
    const markerKey = getMarkerKey(item);

    return index === allLocations.findIndex((candidate) => getMarkerKey(candidate) === markerKey);
  });
}

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

function locationToVector([latitude, longitude]: [number, number]) {
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180 - Math.PI;
  const radius = Math.cos(latitudeRadians);

  return [
    -radius * Math.cos(longitudeRadians),
    Math.sin(latitudeRadians),
    radius * Math.sin(longitudeRadians),
  ] as const;
}

function projectLocation(location: [number, number], phi: number, theta: number) {
  const [rawX, rawY, rawZ] = locationToVector(location);
  const x = rawX * GLOBE_MARKER_RADIUS;
  const y = rawY * GLOBE_MARKER_RADIUS;
  const z = rawZ * GLOBE_MARKER_RADIUS;
  const cosTheta = Math.cos(theta);
  const cosPhi = Math.cos(phi);
  const sinTheta = Math.sin(theta);
  const sinPhi = Math.sin(phi);
  const projectedX = cosPhi * x + sinPhi * z;
  const projectedY = sinPhi * sinTheta * x + cosTheta * y - cosPhi * sinTheta * z;
  const isVisible = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z >= 0;

  return {
    x: (projectedX + 1) / 2,
    y: (-projectedY + 1) / 2,
    isVisible,
  };
}

export function Globe({
  className,
  locations,
  focusedLocation,
  selectedLocationId,
  onLocationSelect,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const widthRef = useRef(0);
  const locationsRef = useRef(locations);
  const selectedLocationIdRef = useRef(selectedLocationId);
  const hoveredMarkerKeyRef = useRef<string | null>(null);
  const targetRotationRef = useRef(locationToAngles(focusedLocation));
  const currentRotationRef = useRef(locationToAngles(focusedLocation));
  const dragStateRef = useRef<{
    pointerId: number;
    pointerType: string;
    startX: number;
    startY: number;
    startPhi: number;
    startTheta: number;
    isDirectionLocked: boolean;
    isHorizontalDrag: boolean;
  } | null>(null);
  const timeRef = useRef(0);
  const [, setHoveredMarkerKey] = useState<string | null>(null);

  useEffect(() => {
    locationsRef.current = locations;
  }, [locations]);

  useEffect(() => {
    targetRotationRef.current = locationToAngles(focusedLocation);
  }, [focusedLocation]);

  useEffect(() => {
    selectedLocationIdRef.current = selectedLocationId;
  }, [selectedLocationId]);

  const uniqueLocations = uniqueByMarkerKey(locations);
  const selectedLocation = locations.find((item) => item.id === selectedLocationId);
  const selectedMarkerKey = selectedLocation ? getMarkerKey(selectedLocation) : undefined;

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
      ...THEME_CONFIG[
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      ],
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: currentRotationRef.current.phi,
      theta: currentRotationRef.current.theta,
      markers: [],
      markerElevation: MARKER_ELEVATION,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    });

    let frameId = 0;

    const render = () => {
      const target = targetRotationRef.current;
      const isDark = document.documentElement.classList.contains("dark");

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

      const selectedItem = locationsRef.current.find(
        (item) => item.id === selectedLocationIdRef.current
      );
      const currentSelectedMarkerKey = selectedItem ? getMarkerKey(selectedItem) : undefined;
      const markers: Marker[] = uniqueByMarkerKey(locationsRef.current).map((item) => {
        const markerKey = getMarkerKey(item);
        const isSelected = markerKey === currentSelectedMarkerKey;
        const isHovered = markerKey === hoveredMarkerKeyRef.current;
        const pulse = (Math.sin(timeRef.current + item.location[0]) + 1) / 2;
        const emphasis = isSelected ? 1 : isHovered ? 0.6 : 0;
        const size = 0.026 + pulse * 0.003 + emphasis * (0.02 + pulse * 0.001);

        return {
          location: item.location,
          size,
          color: isDark
            ? isSelected || isHovered
              ? [52 / 255, 211 / 255, 153 / 255]
              : [110 / 255, 231 / 255, 183 / 255]
            : isSelected || isHovered
              ? [239 / 255, 68 / 255, 68 / 255]
              : [15 / 255, 23 / 255, 42 / 255],
        };
      });

      globe.update({
        ...THEME_CONFIG[isDark ? "dark" : "light"],
        phi: currentRotationRef.current.phi,
        theta: currentRotationRef.current.theta,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        markers,
      });

      for (const item of uniqueByMarkerKey(locationsRef.current)) {
        const markerElement = markerRefs.current[getMarkerKey(item)];

        if (!markerElement) {
          continue;
        }

        const projected = projectLocation(
          item.location,
          currentRotationRef.current.phi,
          currentRotationRef.current.theta
        );

        markerElement.style.left = `${projected.x * 100}%`;
        markerElement.style.top = `${projected.y * 100}%`;
        markerElement.style.opacity = projected.isVisible ? "1" : "0";
        markerElement.style.pointerEvents = projected.isVisible ? "auto" : "none";
      }

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

    if (event.pointerType !== "touch") {
      canvas.setPointerCapture(event.pointerId);
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      startPhi: targetRotationRef.current.phi,
      startTheta: targetRotationRef.current.theta,
      isDirectionLocked: false,
      isHorizontalDrag: true,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const canvas = canvasRef.current;

    if (!dragState || !canvas || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (dragState.pointerType === "touch" && !dragState.isDirectionLocked) {
      const movementThreshold = 6;

      if (Math.abs(deltaX) < movementThreshold && Math.abs(deltaY) < movementThreshold) {
        return;
      }

      dragState.isDirectionLocked = true;
      dragState.isHorizontalDrag = Math.abs(deltaX) >= Math.abs(deltaY);

      if (dragState.isHorizontalDrag) {
        canvas.setPointerCapture(event.pointerId);
      } else {
        dragStateRef.current = null;
      }
    }

    if (dragState.pointerType === "touch" && !dragState.isHorizontalDrag) {
      return;
    }

    targetRotationRef.current.phi = dragState.startPhi + deltaX * DRAG_SENSITIVITY;
    targetRotationRef.current.theta = dragState.startTheta;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    const canvas = canvasRef.current;

    if (!dragState || !canvas || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
  };

  return (
    <div className={cn("absolute inset-0", className)}>
      <canvas
        ref={canvasRef}
        aria-label="Animated globe with selectable locations"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="size-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-700 active:cursor-grabbing [contain:layout_paint_size]"
      />
      <div className="pointer-events-none absolute inset-0 z-10">
        {uniqueLocations.map((item) => {
          const isSelected = getMarkerKey(item) === selectedMarkerKey;

          return (
            <button
              key={getMarkerKey(item)}
              ref={(node) => {
                markerRefs.current[getMarkerKey(item)] = node;
              }}
              type="button"
              className="pointer-events-auto absolute left-0 top-0 size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full focus-visible:outline-none"
              onMouseEnter={() => {
                const markerKey = getMarkerKey(item);
                hoveredMarkerKeyRef.current = markerKey;
                setHoveredMarkerKey(markerKey);
              }}
              onMouseLeave={() => {
                hoveredMarkerKeyRef.current = null;
                setHoveredMarkerKey(null);
              }}
              onFocus={() => {
                const markerKey = getMarkerKey(item);
                hoveredMarkerKeyRef.current = markerKey;
                setHoveredMarkerKey(markerKey);
              }}
              onBlur={() => {
                hoveredMarkerKeyRef.current = null;
                setHoveredMarkerKey(null);
              }}
              onClick={() => onLocationSelect?.(item.id)}
              aria-label={`Select ${item.place}, ${item.country}`}
              aria-pressed={isSelected}
            >
              <span className="absolute inset-1 rounded-full" />
              <span
                className={cn(
                  "pointer-events-none absolute left-1/2 bottom-1/2 flex -translate-x-1/2 flex-col-reverse items-center transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  isSelected ? "opacity-100" : "opacity-0"
                )}
              >
                <span
                  className={cn(
                    "h-9 w-px origin-bottom transition-transform duration-500 ease-out motion-reduce:transition-none",
                    LABEL_LINE_CLASS,
                    isSelected ? "scale-y-100" : "scale-y-0"
                  )}
                />
                <span
                  className={cn(
                    "mb-0 flex items-baseline transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:delay-0",
                    LABEL_CHIP_CLASS,
                    isSelected
                      ? "translate-y-0 scale-100 delay-200"
                      : "translate-y-1 scale-95 delay-0"
                  )}
                >
                  <span className="font-medium leading-none text-foreground">
                    {item.place}
                  </span>
                  <span className="text-sm leading-none" aria-hidden="true">
                    {item.flag}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
