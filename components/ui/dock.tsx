"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  useRef,
} from "react";
import {
  motion,
  type MotionProps,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

type DockProps = {
  children: ReactNode;
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
};

type DockIconProps = Omit<MotionProps & HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  mouseY?: MotionValue<number>;
  size?: number;
  magnification?: number;
  distance?: number;
};

export function Dock({
  children,
  className,
  iconSize = 34,
  iconMagnification = 46,
  iconDistance = 80,
}: DockProps) {
  const mouseY = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(event) => mouseY.set(event.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "flex w-[50px] flex-col items-center justify-center gap-1.5 rounded-xl border bg-background/80 p-1.5 shadow-xs backdrop-blur-md",
        className
      )}
    >
      {Children.map(children, (child) =>
        isValidElement<DockIconProps>(child) && child.type === DockIcon
          ? cloneElement(child, {
              mouseY,
              size: iconSize,
              magnification: iconMagnification,
              distance: iconDistance,
            })
          : child
      )}
    </motion.div>
  );
}

export function DockIcon({
  children,
  mouseY,
  size = 40,
  magnification = 56,
  distance = 100,
  className,
  ...props
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackMouseY = useMotionValue(Infinity);
  const cursorDistance = useTransform(mouseY ?? fallbackMouseY, (value) => {
    const bounds = ref.current?.getBoundingClientRect();
    return value - (bounds?.y ?? 0) - (bounds?.height ?? 0) / 2;
  });
  const targetSize = useTransform(
    cursorDistance,
    [-distance, 0, distance],
    [size, magnification, size]
  );
  const animatedSize = useSpring(targetSize, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: animatedSize, height: animatedSize }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
