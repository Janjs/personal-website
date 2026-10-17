"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

import { portfolioProjects } from "@/lib/projects";
import type { RoomItemId } from "@/components/room/room-scene";

const RoomScene = dynamic(() => import("@/components/room/room-scene").then((m) => m.RoomScene), { ssr: false });

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

  const select = (id: RoomItemId | null) => {
    setSelected(id);
    if (id === "cat") setPets((count) => count + 1);
    if (id === "vinyl") setPlaying((spinning) => !spinning);
  };

  const quotes: Record<RoomItemId, ReactNode> = {
    guitar: <>I like music, so I made <QuoteLink name="Chordwise" /> to practise guitar with backing tracks and come up with chord progressions.</>,
    vinyl: <>I like writing music as code with Strudel, so I built <QuoteLink name="Stroop" /> to generate live-coding patterns with AI.</>,
    cat: pets > 3 ? "Okay, you have a friend for life now." : "My cat lives back home in Barcelona. Keep petting, that's the good spot.",
    poster: <>The Odyssey. I love cinema enough that I built a <QuoteLink name="3D Seat Selection" /> to preview seats from their actual viewpoint.</>,
    basketball: <>I play basketball, so I built <QuoteLink name="Highlights AI" /> to cut highlight reels from game footage with computer vision.</>,
    window: "Outside is Utrecht, my adoptive city. I moved to the Netherlands in 2021 and have been building software here since.",
    barcelona: "From Barcelona, where I grew up and studied Computer Engineering at UPF.",
    seoul: "From my semester at Ajou University in South Korea, still one of the trips that changed how I see the world.",
    dublin: "From Dublin, where I did my MSc at Trinity and got hooked on AR/VR.",
  };

  return (
    <div className="flex min-h-[30rem] w-full flex-1 flex-col gap-3">
      <div className="relative min-h-0 flex-1">
        <RoomScene selected={selected} playing={playing} pets={pets} quotes={quotes} onSelect={select} />
      </div>
      <p className="text-sm text-muted-foreground">*Tip: click around</p>
    </div>
  );
}
