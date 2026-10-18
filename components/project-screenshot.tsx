"use client";

import Image from "next/image";
import type { ComponentProps, SyntheticEvent } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ProjectScreenshotProps = ComponentProps<typeof Image> & {
  wrapperClassName?: string;
};

export function ProjectScreenshot({
  className,
  wrapperClassName,
  fill,
  onLoad,
  ...props
}: ProjectScreenshotProps) {
  const [loaded, setLoaded] = useState(false);

  const markLoaded = () => setLoaded(true);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    markLoaded();
    onLoad?.(event);
  };

  const handleRef = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      markLoaded();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full",
        fill && "size-full min-h-0",
        !loaded && !fill && "min-h-[12.5rem] sm:min-h-[14rem]",
        wrapperClassName
      )}
    >
      {!loaded && (
        <span className={cn("project-screenshot-skeleton", "absolute inset-0")} aria-hidden="true" />
      )}
      <Image
        {...props}
        ref={handleRef}
        fill={fill}
        onLoad={handleLoad}
        className={cn(
          "project-screenshot-image",
          fill ? "object-cover object-top" : "relative z-[1] h-auto w-full",
          loaded && "is-loaded",
          className
        )}
      />
    </div>
  );
}
