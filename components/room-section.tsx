"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { portfolioProjects } from "@/lib/projects";
import type { RoomItemId } from "@/components/room/room-scene";
import { terminalKb } from "@/components/room/terminal-keyboard";

const RoomScene = dynamic(() => import("@/components/room/room-scene").then((m) => m.RoomScene), {
  ssr: false,
});

const RoomTerminal = dynamic(() => import("@/components/room/terminal").then((m) => m.RoomTerminal), {
  ssr: false,
});

const projectUrl = (name: string) => portfolioProjects.find((project) => project.name === name)?.liveUrl ?? undefined;

function QuoteLink({ name }: { name: string }) {
  return (
    <a href={projectUrl(name)} target="_blank" rel="noreferrer" className="pointer-events-auto underline underline-offset-2">
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
  const [duckIntro, setDuckIntro] = useState(true);
  const [monitor, setMonitor] = useState<"idle" | "in" | "open" | "out">("idle");
  const [booted, setBooted] = useState(false);
  const live = monitor === "in" || monitor === "open";

  const closeMonitor = () => {
    if (monitor !== "open" && monitor !== "in") return;
    queueMicrotask(() => setMonitor("out"));
  };

  const select = (id: RoomItemId | null) => {
    if (monitor !== "idle") {
      if (id !== "desk") closeMonitor();
      return;
    }
    setSelected(id);
    if (id !== "microduck") setDuckIntro(true);
    if (id === "cat") setPets((count) => count + 1);
    setPlaying((playing) => id === "vinyl" && !playing);
  };

  const openMonitor = () => {
    if (live) return;
    void import("@/components/room/terminal");
    setBooted(true);
    setSelected(null);
    setMonitor("in");
  };

  const quotes: Record<RoomItemId, ReactNode> = {
    desk: "This is where I spend most of my time. Click the monitor to open the terminal, and stretch every once in a while.",
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
    microduck: duckIntro ? (
      <>
        <p>
          I&apos;ve always liked robots, so I got a little one for my room. Meet my{" "}
          <a href="https://pollen-robotics.com/microduck/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto font-medium underline underline-offset-2">Microduck</a>.
        </p>
        <p className="mt-2">Click it, then move your pointer around the floor to guide it.</p>
      </>
    ) : null,
    poster: (
      <>
        <p>Latest movie I recommend:</p>
        <Image
          src="/workspace/la-bola-negra.jpg"
          alt="La Bola Negra poster"
          width={399}
          height={501}
          sizes="(max-width: 700px) 85vw, 16rem"
          className="mt-2 h-auto w-full rounded-md object-contain max-[700px]:mx-auto max-[700px]:block max-[700px]:w-auto max-[700px]:max-w-full max-[700px]:max-h-[min(15rem,34vh)]"
        />
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
      <div className="relative z-10 min-h-0 flex-1">
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
        <input
          ref={(node) => {
            terminalKb.node = node;
          }}
          aria-label="Terminal command"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="send"
          inputMode="text"
          spellCheck={false}
          tabIndex={-1}
          className="pointer-events-none absolute bottom-0 left-0 h-6 w-full opacity-[0.01]"
          style={{ fontSize: 16 }}
        />
        <RoomScene
          selected={selected}
          playing={playing}
          pets={pets}
          quotes={quotes}
          focus={monitor === "in" || monitor === "open" ? "monitor" : "room"}
          onSelect={select}
          onDuckMet={() => setDuckIntro(false)}
          onProgress={setSceneProgress}
          onReady={() => setSceneReady(true)}
          onOpenMonitor={openMonitor}
          onFocusSettled={() => setMonitor((state) => (state === "in" ? "open" : state === "out" ? "idle" : state))}
          terminal={booted ? <RoomTerminal active={monitor === "open"} onExit={closeMonitor} onEnter={openMonitor} /> : null}
          terminalHot={monitor === "open"}
        />
        {selected && quotes[selected] && monitor === "idle" ? (
          <blockquote
            className={cn(
              "absolute bottom-0 left-0 z-30 hidden w-full overflow-y-auto overflow-x-hidden rounded-xl bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-sm ring-1 ring-foreground/10 max-[700px]:block",
              selected === "poster" ? "max-[700px]:max-h-[min(26rem,58vh)]" : "max-[700px]:max-h-[min(14rem,40vh)]",
            )}
          >
            {quotes[selected]}
          </blockquote>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="min-[701px]:hidden">*Tip: drag to rotate, tap items, tap the monitor</span>
        <span className="hidden min-[701px]:inline">*Tip: click around, or click the monitor</span>
      </p>
    </div>
  );
}
