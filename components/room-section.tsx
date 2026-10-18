"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import { portfolioProjects } from "@/lib/projects";
import type { RoomItemId } from "@/components/room/room-scene";

const RoomScene = dynamic(() => import("@/components/room/room-scene").then((m) => m.RoomScene), {
  ssr: false,
});

const projectUrl = (name: string) => portfolioProjects.find((project) => project.name === name)?.liveUrl ?? undefined;

function QuoteLink({ name }: { name: string }) {
  return (
    <a href={projectUrl(name)} target="_blank" rel="noreferrer" className="underline underline-offset-2">
      {name}
    </a>
  );
}

export function RoomSection() {
  const [selected, setSelected] = useState<RoomItemId | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pets, setPets] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);

  const select = (id: RoomItemId | null) => {
    setSelected(id);
    if (id === "cat") setPets((count) => count + 1);
    if (id === "vinyl") setPlaying((spinning) => !spinning);
  };

  const quotes: Record<RoomItemId, ReactNode> = {
    guitar: (
      <>
        I always keep a guitar nearby while my AI agents run. <QuoteLink name="Chordwise" /> helps me practice with AI-generated chord
        progressions, for new ideas or backing tracks.
      </>
    ),
    vinyl: (
      <>
        Strudel is a live-coding music tool I&apos;ve always tinkered with, so that&apos;s why I built <QuoteLink name="Stroop" /> to see how AI
        writes music with it.
      </>
    ),
    cat:
      pets > 3
        ? "Okay, you have a friend for life now."
        : "My cat lives back home in Barcelona, otherwise working from home would be too distracting.",
    poster: (
      <>
        <p>Latest movie I recommend:</p>
        <Image src="/workspace/la-bola-negra.jpg" alt="La Bola Negra poster" width={399} height={501} className="mt-2 h-auto w-full rounded-md" />
        <p className="mt-3">
          I love going to the movies, but I got the wrong seats by mistake too many times. That&apos;s why I built{" "}
          <QuoteLink name="3D Seat Selection" />.
        </p>
      </>
    ),
    basketball: <>I play basketball, so I built <QuoteLink name="Highlights AI" /> to cut highlight reels from game footage with computer vision.</>,
    window: "Outside is Utrecht, my adoptive city. I moved to the Netherlands in 2021 and have been building software here since.",
    barcelona: "From Barcelona, where I grew up and studied Computer Engineering at UPF.",
    seoul: "From my semester at Ajou University in South Korea, still one of the trips that changed how I see the world.",
    dublin: "From Dublin, where I did my MSc at Trinity and got hooked on AR/VR.",
  };

  return (
    <div className="flex min-h-[30rem] w-full flex-1 flex-col gap-3">
      <div className="relative min-h-0 flex-1">
        <div
          role="status"
          aria-hidden={sceneReady}
          className={`absolute inset-0 z-10 flex items-center justify-center bg-background transition-opacity duration-300 ${sceneReady ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <div className="w-52">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Loading workspace</span>
              <span>{Math.round(sceneProgress)}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Loading workspace"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sceneProgress)}
              className="h-1 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out"
                style={{ width: `${sceneReady ? 100 : Math.max(6, sceneProgress)}%` }}
              />
            </div>
          </div>
        </div>
        <RoomScene selected={selected} playing={playing} pets={pets} quotes={quotes} onSelect={select} onProgress={setSceneProgress} onReady={() => setSceneReady(true)} />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="min-[701px]:hidden">*Tip: tap around</span>
        <span className="hidden min-[701px]:inline">*Tip: click around</span>
      </p>
    </div>
  );
}
