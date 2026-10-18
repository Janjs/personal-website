"use client";

import { Loader2 } from "lucide-react";
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

  const select = (id: RoomItemId | null) => {
    setSelected(id);
    if (id === "cat") setPets((count) => count + 1);
    if (id === "vinyl") setPlaying((spinning) => !spinning);
  };

  const quotes: Record<RoomItemId, ReactNode> = {
    guitar: <>I like music, so I made <QuoteLink name="Chordwise" /> to practise guitar with backing tracks and come up with chord progressions.</>,
    vinyl: <>I like writing music as code with Strudel, so I built <QuoteLink name="Stroop" /> to generate live-coding patterns with AI.</>,
    cat: pets > 3 ? "Okay, you have a friend for life now." : "My cat lives back home in Barcelona. Keep petting, that's the good spot.",
    poster: (
      <>
        <p>Latest movie I recommend.</p>
        <Image src="/workspace/la-bola-negra.jpg" alt="La Bola Negra poster" width={399} height={501} className="mt-2 h-auto w-full rounded-md" />
        <p className="mt-3">
          I love cinema enough that I built <QuoteLink name="3D Seat Selection" /> to preview seats from their actual viewpoint.
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
          className={`absolute inset-0 z-10 flex items-center justify-center gap-2 bg-background text-sm text-muted-foreground transition-opacity duration-300 ${sceneReady ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <Loader2 className="size-4 animate-spin" />
          Loading workspace…
        </div>
        <RoomScene selected={selected} playing={playing} pets={pets} quotes={quotes} onSelect={select} onReady={() => setSceneReady(true)} />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="min-[701px]:hidden">*Tip: tap around</span>
        <span className="hidden min-[701px]:inline">*Tip: click around</span>
      </p>
    </div>
  );
}
