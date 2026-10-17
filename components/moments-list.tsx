"use client";

import { Caveat } from "next/font/google";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
});

function MomentLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  );
}

type Moment = {
  caption: ReactNode;
  alt: string;
  width: number;
  height: number;
} & ({ kind: "image"; src: string } | { kind: "video"; src: string; poster: string });

const moments: Moment[] = [
  {
    kind: "video",
    src: "/moments/copy-paste.mp4",
    width: 1280,
    height: 720,
    poster: "/moments/copy-paste.jpg",
    alt: "3D copy and paste LiDAR scanning demo",
    caption: (
      <>
        A 3D copy-paste demo at Trinity that got traction online and led to{" "}
        <MomentLink href="https://github.com/Janjs/scandrop-mcp">Scandrop MCP</MomentLink>
      </>
    ),
  },
  {
    kind: "image",
    src: "/moments/upscale-conf.jpg",
    width: 768,
    height: 1024,
    alt: "AI Video panel on stage at Upscale Conf",
    caption: "At Upscale Conf in Málaga last year, learning from people leading AI",
  },
  {
    kind: "image",
    src: "/moments/utrecht.jpg",
    width: 768,
    height: 1024,
    alt: "Sunny canal in Utrecht with the Dom tower in the distance",
    caption: "Utrecht, my adoptive city",
  },
  {
    kind: "image",
    src: "/moments/meetup.jpg",
    width: 1024,
    height: 768,
    alt: "Group selfie at a community meetup in a warehouse venue",
    caption: "Tech talk on MCPs at a summer meeting",
  },
  {
    kind: "image",
    src: "/moments/office.jpg",
    width: 768,
    height: 1024,
    alt: "Pointing at a corkboard tracking orders through design and production",
    caption: (
      <>
        Automating my brother&apos;s souvenir company, which inspired{" "}
        <MomentLink href="https://heighliner.app/">Heighliner</MomentLink>
      </>
    ),
  },
  {
    kind: "video",
    src: "/moments/desert-jam.mp4",
    width: 480,
    height: 640,
    poster: "/moments/desert-jam.jpg",
    alt: "Nighttime jam session with guitar and drums",
    caption: (
      <>
        Jamming in the Moroccan desert. I&apos;ve always loved mixing music with tech, i.e:{" "}
        <MomentLink href="https://stroop.app">Stroop</MomentLink> and{" "}
        <MomentLink href="https://chordwise.chat">Chordwise</MomentLink>
      </>
    ),
  },
  {
    kind: "image",
    src: "/moments/graduation.jpg",
    width: 768,
    height: 1024,
    alt: "Graduation portrait in Trinity College courtyard with the Campanile behind",
    caption: "Graduating at Trinity, felt like a Normal People character",
  },
  {
    kind: "image",
    src: "/moments/cat.jpg",
    width: 768,
    height: 1024,
    alt: "Orange tabby cat being petted at sunset",
    caption: "My cat, back home in Barcelona",
  },
];

function MomentMedia({ moment, reduceMotion }: { moment: Moment; reduceMotion: boolean | null }) {
  return moment.kind === "video" ? (
    <video
      src={moment.src}
      poster={moment.poster}
      aria-label={moment.alt}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <Image
      src={moment.src}
      alt={moment.alt}
      fill
      sizes="(max-width: 700px) 100vw, 480px"
      quality={75}
      className="object-cover"
    />
  );
}

export function MomentsList() {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="space-y-6">
      {moments.map((moment) => (
        <li key={moment.src}>
          <div className="relative overflow-hidden rounded-xl bg-muted" style={{ aspectRatio: `${moment.width} / ${moment.height}` }}>
            <MomentMedia moment={moment} reduceMotion={reduceMotion} />
          </div>
          <p className={`${handwritten.className} pt-3 text-center text-xl leading-snug font-medium`}>{moment.caption}</p>
        </li>
      ))}
    </ul>
  );
}
