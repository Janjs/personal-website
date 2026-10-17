"use client";

import { useEffect, useRef, useState } from "react";

const MOVEMENT_KEYS = new Set(["w", "a", "s", "d"]);

function getMoonSurfaceY(bounds: Pick<DOMRect, "left" | "top" | "width" | "height">, x: number) {
  const normalizedX = Math.min(0.98, Math.abs(x - (bounds.left + bounds.width / 2)) / (bounds.width / 2));
  return bounds.top + (1 - Math.sqrt(1 - normalizedX ** 2)) * (bounds.height / 2);
}

if (process.env.NODE_ENV === "development") {
  console.assert(getMoonSurfaceY({ left: 0, top: 10, width: 100, height: 50 }, 50) === 10, "Moon surface calculation failed");
}

export function RocketEasterEgg() {
  const rocketRef = useRef<HTMLButtonElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 28, y: 180 });
  const keys = useRef(new Set<string>());
  const enabled = useRef(false);
  const landedRef = useRef(false);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    let frame = 0;
    let previousTime = performance.now();

    const setRocketPosition = (x: number, y: number, angle = 0) => {
      const rocket = rocketRef.current;
      if (!rocket) return;
      rocket.style.setProperty("--rocket-x", `${x}px`);
      rocket.style.setProperty("--rocket-y", `${y}px`);
      rocket.style.setProperty("--rocket-turn", `${angle}deg`);
    };

    const update = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      const xDirection = Number(keys.current.has("d")) - Number(keys.current.has("a"));
      const yDirection = Number(keys.current.has("s")) - Number(keys.current.has("w"));

      if (!landedRef.current && (xDirection || yDirection)) {
        const magnitude = Math.hypot(xDirection, yDirection);
        position.current.x = Math.min(
          window.innerWidth - 68,
          Math.max(12, position.current.x + (xDirection / magnitude) * 190 * delta)
        );
        position.current.y = Math.min(
          window.innerHeight - 84,
          Math.max(12, position.current.y + (yDirection / magnitude) * 190 * delta)
        );
        const angle = (Math.atan2(yDirection, xDirection) * 180) / Math.PI + 90;
        setRocketPosition(position.current.x, position.current.y, angle);
      }

      const moon = moonRef.current;
      if (moon) {
        const bounds = moon.getBoundingClientRect();
        const rocketCenterX = position.current.x + 28;
        const surfaceY = getMoonSurfaceY(bounds, rocketCenterX);
        const distance = surfaceY - (position.current.y + 64);
        const proximity = 1 - Math.min(1, Math.max(0, distance) / 420);
        moon.style.setProperty("--moon-scale", String(0.82 + proximity * 0.18));

        if (yDirection > 0 && distance > -18 && distance < 18) {
          landedRef.current = true;
          keys.current.clear();
          position.current.y += distance;
          setRocketPosition(position.current.x, position.current.y, 0);
          setLanded(true);
        }
      }

      frame = requestAnimationFrame(update);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const target = event.target as HTMLElement | null;
      if (!enabled.current || !MOVEMENT_KEYS.has(key) || target?.matches("input, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      keys.current.add(key);
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const onBlur = () => keys.current.clear();
    const onResize = () => {
      position.current.x = Math.min(position.current.x, window.innerWidth - 68);
      position.current.y = Math.min(position.current.y, window.innerHeight - 84);
      setRocketPosition(position.current.x, position.current.y);
    };

    setRocketPosition(position.current.x, position.current.y);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <button
        ref={rocketRef}
        type="button"
        aria-label={landed ? "Rocket landed. The astronaut is typing." : "Rocket easter egg. Hover, then use W A S D to fly."}
        className={`rocket group/rocket fixed top-0 left-0 z-30 h-20 w-16 border-0 bg-transparent p-0 text-foreground focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 ${landed ? "is-landed" : ""}`}
        onPointerEnter={() => { enabled.current = true; }}
        onFocus={() => { enabled.current = true; }}
      >
        <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 grid w-max min-w-[4.5rem] -translate-x-1/2 gap-1 rounded-lg border border-foreground/10 bg-background/90 p-2 font-mono text-[9px] leading-none opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover/rocket:opacity-100 group-focus-visible/rocket:opacity-100">
          <span className="text-center text-muted-foreground">fly</span>
          <span className="grid grid-cols-3 gap-0.5">
            <kbd className="col-start-2 rounded border py-0.5 text-center">W</kbd>
            <kbd className="rounded border py-0.5 text-center">A</kbd>
            <kbd className="rounded border py-0.5 text-center">S</kbd>
            <kbd className="rounded border py-0.5 text-center">D</kbd>
          </span>
        </span>
        <svg viewBox="0 0 112 112" className="rocket-drawing h-20 w-20 overflow-visible" aria-hidden="true">
          <g className="rocket-ship" fill="var(--background)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M34 5C21 18 19 39 25 59h18c6-20 4-41-9-54Z" />
            <path d="M24 42 16 55l9-2m19-11 8 13-9-2" />
            <circle cx="34" cy="28" r="6" fill="none" />
            <path d="M28 59h12" />
            {!landed && <path className="rocket-flame" d="M29 62c0 7 5 12 5 12s5-5 5-12" fill="none" />}
          </g>
          {landed && (
            <>
              <g className="rocket-stairs" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7">
                <path d="M43 53 56 67v22m-6-29h10M53 67h7m-4 8h7m-7 8h7" />
              </g>
              <g className="astronaut" fill="var(--background)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
                <circle cx="48" cy="54" r="5" />
                <path d="M44 59v13h8V59m-6 13-2 9m6-9 2 9" />
                <path className="typing-arm" d="m44 62-5 6 7 2m6-8 5 6-7 2" fill="none" />
                <path d="M42 71h18l3 6H45Z" />
                <path d="M48 51c2-1 4-1 5 0" fill="none" opacity=".5" />
              </g>
            </>
          )}
        </svg>
      </button>

      <footer className="moon-footer relative mt-20 h-56 w-full overflow-hidden" aria-label="The moon">
        <div
          ref={moonRef}
          className="moon absolute top-12 left-1/2 h-[30rem] w-[130vw] min-w-[58rem] rounded-[50%] border-2 border-foreground/50 bg-background"
        >
          <span className="moon-crater moon-crater-one" />
          <span className="moon-crater moon-crater-two" />
          <span className="moon-crater moon-crater-three" />
          {landed && <span className="sr-only" aria-live="polite">The rocket has landed.</span>}
        </div>
      </footer>
    </>
  );
}
