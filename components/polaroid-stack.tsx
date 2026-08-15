"use client";

import { Caveat } from "next/font/google";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useRef, useState } from "react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
});

function PolaroidLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-neutral-800/50 underline-offset-2 hover:decoration-neutral-800"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {children}
    </a>
  );
}

type Polaroid = {
  label: string;
  caption: ReactNode;
  alt: string;
  captionTilt: number;
  objectPosition?: string;
  href?: string;
} & ({ kind: "image"; src: string } | { kind: "video"; src: string; poster: string });

const polaroids: Polaroid[] = [
  {
    kind: "image",
    src: "/moments/meetup.jpg",
    alt: "Group selfie at a community meetup in a warehouse venue",
    label: "Tech talk on MCPs at Accenture NL's summer meeting",
    caption: "Tech talk on MCPs at Accenture NL's summer meeting",
    objectPosition: "center 40%",
    captionTilt: -2,
  },
  {
    kind: "image",
    src: "/moments/office.jpg",
    alt: "Pointing at a corkboard tracking orders through design and production",
    label: "Automating my brother's souvenir company, which inspired Heighliner",
    caption: (
      <>
        Automating my brother's souvenir company, which inspired{" "}
        <PolaroidLink href="https://heighliner.app/">Heighliner</PolaroidLink>
      </>
    ),
    objectPosition: "42% center",
    captionTilt: -1,
  },
  {
    kind: "video",
    src: "/moments/copy-paste.mp4",
    poster: "/moments/copy-paste.jpg",
    href: "https://www.youtube.com/watch?v=B52r1ccVacU",
    alt: "3D copy and paste LiDAR scanning demo",
    label: "A 3D copy-paste demo at Trinity that got traction online and led to Scandrop MCP",
    caption: (
      <>
        A 3D copy-paste demo at Trinity that got traction online and led to{" "}
        <PolaroidLink href="https://github.com/Janjs/scandrop-mcp">Scandrop MCP</PolaroidLink>
      </>
    ),
    objectPosition: "center",
    captionTilt: -2.5,
  },
  {
    kind: "image",
    src: "/moments/upscale-conf.jpg",
    alt: "AI Video panel on stage at Upscale Conf",
    label: "At Upscale Conf in Málaga last year, learning from people leading AI",
    caption: "At Upscale Conf in Málaga last year, learning from people leading AI",
    objectPosition: "center 35%",
    captionTilt: -0.5,
  },
  {
    kind: "video",
    src: "/moments/desert-jam.mp4",
    poster: "/moments/desert-jam.jpg",
    alt: "Nighttime jam session with guitar and drums",
    label: "Jamming in the Moroccan desert. I've always loved mixing music with tech, i.e. Stroop and Chordwise",
    caption: (
      <>
        Jamming in the Moroccan desert. I've always loved mixing music with tech, i.e:{" "}
        <PolaroidLink href="https://stroop.janjs.dev">Stroop</PolaroidLink> and{" "}
        <PolaroidLink href="https://chordwise.chat">Chordwise</PolaroidLink>
      </>
    ),
    objectPosition: "center",
    captionTilt: 1,
  },
  {
    kind: "image",
    src: "/moments/graduation.jpg",
    alt: "Graduation portrait in Trinity College courtyard with the Campanile behind",
    label: "Graduating at Trinity, felt like a Normal People character",
    caption: "Graduating at Trinity, felt like a Normal People character",
    objectPosition: "42% 30%",
    captionTilt: 1.5,
  },
  {
    kind: "image",
    src: "/moments/utrecht.jpg",
    alt: "Sunny canal in Utrecht with the Dom tower in the distance",
    label: "Utrecht, my adoptive city",
    caption: "Utrecht, my adoptive city",
    objectPosition: "center 45%",
    captionTilt: 2,
  },
  {
    kind: "image",
    src: "/moments/cat.jpg",
    alt: "Orange tabby cat being petted at sunset",
    label: "My cat, back home in Barcelona",
    caption: "My cat, back home in Barcelona",
    objectPosition: "40% center",
    captionTilt: -1.5,
  },
];

const focusPose = { left: "50%", x: "-50%", y: "calc(-50% - 44px)", rotate: 0, scale: 1.18 };
const tilts = [-8, 6, -4, 9, -7, 3, -5, 8, -3];
const dips = [10, -12, 6, -8, 12, -6, 8, -10, 4];

function spread(index: number, count: number) {
  return count <= 1 ? 0 : index / (count - 1);
}

function restPose(index: number, count: number, lift: number) {
  const p = spread(index, count);
  return {
    left: `${p * 100}%`,
    x: `${-p * 100}%`,
    y: `calc(-50% + ${dips[index % dips.length] + lift}px)`,
    rotate: tilts[index % tilts.length],
    scale: 1,
  };
}

function fanPose(slot: number, count: number, lift: number) {
  const t = count <= 1 ? 0 : (slot / (count - 1)) * 2 - 1;
  return {
    left: "50%",
    x: `calc(-50% + ${t * 122}px)`,
    y: `calc(-50% + ${122 + Math.abs(t) * 10 + lift}px)`,
    rotate: t * 9,
    scale: 0.56,
  };
}

function poseFor(index: number, focused: number | null, hovered: boolean) {
  const lift = hovered ? -10 : 0;
  const count = polaroids.length;

  if (focused === null) {
    const rest = restPose(index, count, lift);
    return {
      ...rest,
      rotate: hovered ? rest.rotate * 0.25 : rest.rotate,
      scale: hovered ? 1.05 : rest.scale,
    };
  }

  if (index === focused) {
    return { ...focusPose, y: hovered ? "calc(-50% - 48px)" : focusPose.y };
  }

  const restIndexes = polaroids.map((_, item) => item).filter((item) => item !== focused);
  return fanPose(restIndexes.indexOf(index), restIndexes.length, lift);
}

function PolaroidMedia({
  polaroid,
  reduceMotion,
}: {
  polaroid: Polaroid;
  reduceMotion: boolean | null;
}) {
  if (polaroid.kind === "video") {
    return (
      <video
        src={polaroid.src}
        poster={polaroid.poster}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: polaroid.objectPosition }}
      />
    );
  }

  return (
    <Image
      src={polaroid.src}
      alt={polaroid.alt}
      fill
      sizes="(max-width: 768px) 248px, 264px"
      quality={75}
      className="object-cover"
      style={{ objectPosition: polaroid.objectPosition }}
    />
  );
}

const polaroidChrome =
  "rounded-[2px] bg-[#f7f4ee] p-2.5 pb-0 text-left shadow-[0_12px_28px_rgba(28,22,12,0.16)] ring-1 ring-black/5";

function PolaroidFace({
  polaroid,
  reduceMotion,
  captionTilt,
}: {
  polaroid: Polaroid;
  reduceMotion: boolean | null;
  captionTilt: number;
}) {
  return (
    <>
      <span className="relative block aspect-square overflow-hidden bg-muted">
        <PolaroidMedia polaroid={polaroid} reduceMotion={reduceMotion} />
      </span>
      <span
        className={`${handwritten.className} block px-1.5 py-2.5 text-center text-[0.95rem] leading-snug font-medium text-neutral-800 sm:text-[1.05rem]`}
        style={{ transform: `rotate(${captionTilt}deg)` }}
      >
        {polaroid.caption}
      </span>
    </>
  );
}

function PolaroidCarousel({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "-mx-6 overflow-x-auto overscroll-x-contain px-0 pt-3 pb-8 [overflow-anchor:none] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 md:hidden",
        focused !== null && focused !== 0 && "snap-x snap-proximity"
      )}
    >
      <ul className="flex w-max items-start pl-6 pr-[max(2rem,calc(50%-7.75rem))]">
        {polaroids.map((polaroid, index) => {
          const isFocused = focused === index;
          const isFirst = index === 0;

          return (
            <li
              key={polaroid.src}
              className={cn(
                "relative w-[15.5rem] shrink-0 transition-[transform,box-shadow] duration-200",
                isFirst || !isFocused ? "snap-start" : "snap-center",
                index > 0 && "-ml-[4.75rem]"
              )}
              style={{
                zIndex: isFocused ? 20 : polaroids.length - index,
                transform: `rotate(${tilts[index % tilts.length] * 0.4}deg)`,
              }}
            >
              <article
                className={cn(
                  polaroidChrome,
                  "cursor-pointer",
                  isFocused && "shadow-[0_16px_32px_rgba(28,22,12,0.22)]"
                )}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a")) return;
                  if (isFocused && polaroid.href) {
                    window.open(polaroid.href, "_blank", "noopener,noreferrer");
                    return;
                  }
                  setFocused(index);
                  if (isFirst) return;
                  event.currentTarget.closest("li")?.scrollIntoView({
                    inline: "center",
                    block: "nearest",
                    behavior: reduceMotion ? "auto" : "smooth",
                  });
                }}
              >
                <PolaroidFace
                  polaroid={polaroid}
                  reduceMotion={reduceMotion}
                  captionTilt={isFocused ? 0 : polaroid.captionTilt}
                />
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PolaroidStack() {
  const reduceMotion = useReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.5, bounce: 0.18 };

  const focusAt = (index: number) => {
    const next = (index + polaroids.length) % polaroids.length;
    setFocused(next);
    cardRefs.current[next]?.focus();
  };

  useOutsideClick(stackRef, () => setFocused(null));

  return (
    <>
      <PolaroidCarousel reduceMotion={reduceMotion} />
      <div
        ref={stackRef}
        className="pointer-events-none relative -mx-3 hidden h-[28rem] w-[calc(100%+1.5rem)] sm:-mx-4 sm:w-[calc(100%+2rem)] md:block"
      >
        {polaroids.map((polaroid, index) => {
          const isFocused = focused === index;
          const isHovered = hovered === index;
          const pose = poseFor(index, focused, isHovered);

          return (
            <motion.div
              key={polaroid.src}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              tabIndex={0}
              aria-label={polaroid.label}
              aria-pressed={isFocused}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a")) return;
                if (isFocused) {
                  setFocused(null);
                  return;
                }
                focusAt(index);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  if (isFocused) {
                    setFocused(null);
                    return;
                  }
                  focusAt(index);
                  return;
                }

                if (focused === null) return;

                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  focusAt(focused + 1);
                }

                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  focusAt(focused - 1);
                }
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setHovered(index);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setHovered(null);
              }}
              className={cn(
                "pointer-events-auto absolute top-1/2 w-56 origin-center cursor-pointer outline-none transition-shadow duration-200 select-none focus-visible:ring-3 focus-visible:ring-ring/50",
                polaroidChrome,
                (isFocused || isHovered) && "shadow-[0_24px_44px_rgba(28,22,12,0.26)]"
              )}
              style={{ zIndex: isFocused ? 20 : polaroids.length - index }}
              initial={false}
              animate={pose}
              transition={spring}
            >
              <PolaroidFace
                polaroid={polaroid}
                reduceMotion={reduceMotion}
                captionTilt={isFocused ? 0 : polaroid.captionTilt}
              />
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
