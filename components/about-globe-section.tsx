"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Globe, type GlobeLocation } from "@/components/ui/globe";
import { cn } from "@/lib/utils";

export type AboutGlobeItem = GlobeLocation & {
  quote: string;
  spotlightLocation?: [number, number];
};

export type AboutGlobeEntryPart = {
  text: string;
  itemId?: string;
  className?: string;
};

export type AboutGlobeEntry = {
  id: string;
  section?: "education" | "experience";
  date?: string;
  parts: AboutGlobeEntryPart[];
  details?: {
    itemId: string;
    role: string;
    company: string;
    date: string;
  }[];
};

const aboutSections = [
  { id: "education", title: "Education" },
  { id: "experience", title: "Experience" },
] as const;

const TOUR_INTERVAL_MS = 5200;

const linkButtonClass =
  "about-globe-link inline cursor-pointer text-left text-foreground focus-visible:rounded-[0.2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AboutGlobeSection({
  items,
  entries,
}: {
  items: AboutGlobeItem[];
  entries: AboutGlobeEntry[];
}) {
  const defaultItem = items.find((item) => item.id === "current-location") ?? items[0];
  const defaultIndex = Math.max(
    0,
    items.findIndex((item) => item.id === defaultItem.id)
  );
  const overviewLocation: [number, number] = [52.0907, 5.1214];
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [hasSpotlight, setHasSpotlight] = useState(false);
  const [isListHovered, setIsListHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  const activeItem = items[activeIndex] ?? defaultItem;
  const isDefaultView =
    pinnedIndex === null && !hasSpotlight && activeIndex === defaultIndex;
  const spotlightFocusLocation = activeItem.spotlightLocation ?? overviewLocation;
  const globeFocusLocation = hasSpotlight ? spotlightFocusLocation : overviewLocation;
  const activeItemId =
    hasSpotlight || isDefaultView ? activeItem.id : undefined;
  const selectedLocationId = activeItem.id;
  const displayedQuote = activeItem.quote;
  const itemIndexById = new Map(items.map((item, index) => [item.id, index]));

  const tourIndices = useMemo(() => {
    const indexById = new Map(items.map((item, index) => [item.id, index]));
    const ids: string[] = [];

    for (const entry of entries) {
      for (const part of entry.parts) {
        if (part.itemId) ids.push(part.itemId);
      }
      for (const detail of entry.details ?? []) {
        ids.push(detail.itemId);
      }
    }

    return [...new Set(ids)]
      .map((id) => indexById.get(id))
      .filter((index): index is number => index !== undefined);
  }, [entries, items]);

  const activate = (index: number) => {
    if (pinnedIndex !== null) return;
    setActiveIndex(index);
    setHasSpotlight(true);
  };

  const resetToDefault = useCallback(() => {
    setActiveIndex(defaultIndex);
    setHasSpotlight(false);
  }, [defaultIndex]);

  const clearSpotlight = useCallback(() => {
    setPinnedIndex(null);
    resetToDefault();
  }, [resetToDefault]);

  const togglePinned = (index: number) => {
    if (pinnedIndex === index) {
      clearSpotlight();
      return;
    }

    setPinnedIndex(index);
    setActiveIndex(index);
    setHasSpotlight(true);
  };

  const resetGlobeHover = () => {
    if (pinnedIndex !== null) {
      setActiveIndex(pinnedIndex);
      setHasSpotlight(true);
      return;
    }

    resetToDefault();
  };

  useEffect(() => {
    if (pinnedIndex !== null || isListHovered || tourIndices.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const advanceTour = () => {
      setActiveIndex((previous) => {
        if (previous === defaultIndex) {
          return tourIndices[0] ?? previous;
        }

        const currentPosition = tourIndices.indexOf(previous);
        const nextPosition =
          currentPosition === -1 ? 0 : (currentPosition + 1) % tourIndices.length;

        return tourIndices[nextPosition] ?? previous;
      });
      setHasSpotlight(true);
    };

    const intervalId = window.setInterval(advanceTour, TOUR_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [defaultIndex, isListHovered, pinnedIndex, tourIndices]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (pinnedIndex === null) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (!sectionRef.current?.contains(target)) {
        clearSpotlight();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [clearSpotlight, pinnedIndex]);

  useLayoutEffect(() => {
    const list = listRef.current;
    const highlight = highlightRef.current;
    if (!list || !highlight) return;

    const updateHighlight = () => {
      const target = list.querySelector<HTMLElement>('[data-active-highlight="true"]');
      if (!target) {
        highlight.style.opacity = "0";
        return;
      }

      const listRect = list.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      highlight.style.opacity = "1";
      highlight.style.transform = `translate(${targetRect.left - listRect.left}px, ${targetRect.top - listRect.top}px)`;
      highlight.style.width = `${targetRect.width}px`;
      highlight.style.height = `${targetRect.height}px`;
    };

    updateHighlight();
    const observer = new ResizeObserver(updateHighlight);
    observer.observe(list);
    list.querySelectorAll("[data-active-highlight]").forEach((node) => observer.observe(node));
    window.addEventListener("resize", updateHighlight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHighlight);
    };
  }, [activeItemId, entries]);

  return (
    <div
      ref={sectionRef}
      className="relative isolate flex w-full min-w-0 flex-1 flex-col gap-6"
    >
      <div
        ref={listRef}
        className="about-globe-list relative isolate z-10 flex min-w-0 max-w-[38rem] flex-col gap-5"
        data-pinned={pinnedIndex !== null ? "" : undefined}
        onMouseEnter={() => setIsListHovered(true)}
        onMouseLeave={() => {
          setIsListHovered(false);
          if (pinnedIndex === null) {
            resetToDefault();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsListHovered(false);
            if (pinnedIndex === null) {
              resetToDefault();
            }
          }
        }}
      >
        <span ref={highlightRef} className="about-globe-highlight" aria-hidden="true" />
        {aboutSections.map((section) => {
          const sectionEntries = entries.filter(
            (entry) => (entry.section ?? "experience") === section.id
          );
          if (sectionEntries.length === 0) return null;

          return (
            <section key={section.id} aria-labelledby={`about-${section.id}-heading`}>
              <h3
                id={`about-${section.id}-heading`}
                className="mb-1 text-sm font-normal text-muted-foreground"
              >
                {section.title}
              </h3>
              <ul className="space-y-1">
                {sectionEntries.map((entry) => {
                  const entryIsActive = entry.parts.some(
                    (part) => part.itemId !== undefined && part.itemId === activeItemId
                  );
                  const activeDetailId = entry.details?.find(
                    (detail) => detail.itemId === activeItemId
                  )?.itemId;
                  const entryRowIsActive = entryIsActive && activeDetailId === undefined;
                  return (
                    <li
                      key={entry.id}
                      data-active-highlight={entryRowIsActive ? "true" : undefined}
                      className="about-globe-entry relative z-[1] grid max-w-[38rem] grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 whitespace-pre-wrap rounded-lg px-3 py-2.5 -mx-3 text-sm leading-[1.45] tracking-[-0.015em] text-foreground/92"
                    >
                      <p className="col-start-1 row-start-1 min-w-0">
                        {entry.parts.map((part, partIndex) => {
                          const itemIndex = part.itemId ? itemIndexById.get(part.itemId) : undefined;

                          if (itemIndex === undefined) {
                            return <span key={`${entry.id}-${partIndex}`}>{part.text}</span>;
                          }

                          const isActive = items[itemIndex]?.id === activeItemId;

                          return (
                            <button
                              key={`${entry.id}-${part.itemId}-${partIndex}`}
                              type="button"
                              className={cn(linkButtonClass, part.className)}
                              onMouseEnter={() => activate(itemIndex)}
                              onFocus={() => activate(itemIndex)}
                              onClick={() => togglePinned(itemIndex)}
                              aria-pressed={isActive}
                            >
                              {part.text}
                            </button>
                          );
                        })}
                      </p>
                      {entry.date && (
                        <span className="col-start-2 row-start-1 shrink-0 self-start pl-2 text-xs font-normal tracking-tight tabular-nums text-muted-foreground">
                          {entry.date.replace("Present", "")}
                          {entry.date.includes("Present") && (
                            <span className="font-semibold">Present</span>
                          )}
                        </span>
                      )}
                      {entry.details && (
                        <div className="col-span-2 col-start-1 row-start-2 mt-1.5 space-y-1 pl-3">
                          {entry.details.map((detail) => {
                            const itemIndex = itemIndexById.get(detail.itemId);
                            if (itemIndex === undefined) return null;

                            const isActive = items[itemIndex]?.id === activeItemId;

                            return (
                              <div
                                key={detail.itemId}
                                data-active-highlight={isActive ? "true" : undefined}
                                className="about-globe-detail relative z-[1] -mx-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 rounded-md px-2 py-0.5"
                              >
                                <span className="row-start-1 pt-px" aria-hidden="true">
                                  •
                                </span>
                                <button
                                  type="button"
                                  className={cn("col-start-2 row-start-1 min-w-0 text-left", linkButtonClass)}
                                  onMouseEnter={() => activate(itemIndex)}
                                  onFocus={() => activate(itemIndex)}
                                  onClick={() => togglePinned(itemIndex)}
                                  aria-pressed={isActive}
                                >
                                  <span className="font-semibold">{detail.role}</span> at {detail.company}
                                </button>
                                <span className="col-start-3 row-start-1 shrink-0 self-start pl-2 text-xs font-normal tracking-tight tabular-nums text-muted-foreground">
                                  {detail.date.replace("Present", "")}
                                  {detail.date.includes("Present") && (
                                    <span className="font-semibold">Present</span>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div
        className="relative mt-1 shrink-0 h-[min(19rem,calc(100vw-3rem))] sm:mt-2 sm:h-[17rem]"
        onMouseLeave={resetGlobeHover}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            resetGlobeHover();
          }
        }}
      >
        <div className="absolute inset-x-0 -top-10 z-0 mx-auto aspect-square w-[min(18rem,100%)] max-w-[20rem] sm:-top-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-[10%] rounded-full bg-background" />
          <Globe
            className="z-10"
            locations={items}
            focusedLocation={globeFocusLocation}
            selectedLocationId={
              hasSpotlight || isDefaultView ? selectedLocationId : undefined
            }
            idleRotate
            onLocationSelect={(itemId) => {
              const itemIndex = itemIndexById.get(itemId);

              if (itemIndex !== undefined) {
                togglePinned(itemIndex);
              }
            }}
          />
        </div>

        <blockquote className="pointer-events-none absolute bottom-0 z-20 w-full rounded-xl bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-sm ring-1 ring-foreground/10">
          <p>{displayedQuote}</p>
        </blockquote>
      </div>
    </div>
  );
}
