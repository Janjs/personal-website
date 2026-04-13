"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  parts: AboutGlobeEntryPart[];
};

export function AboutGlobeSection({
  items,
  entries,
}: {
  items: AboutGlobeItem[];
  entries: AboutGlobeEntry[];
}) {
  const defaultQuote = "Currently based in Amsterdam, the Netherlands, working in AI consultancy.";
  const defaultItem =
    items.find((item) => item.id === "dutch-bank" || item.place.includes("Amsterdam")) ?? items[0];
  const defaultIndex = Math.max(
    0,
    items.findIndex((item) => item.id === defaultItem.id)
  );
  const overviewLocation: [number, number] = [47, -50];
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [hasSpotlight, setHasSpotlight] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const activeItem = items[activeIndex] ?? defaultItem;
  const spotlightFocusLocation = activeItem.spotlightLocation ?? overviewLocation;
  const globeFocusLocation = hasSpotlight ? spotlightFocusLocation : overviewLocation;
  const activeItemId = hasSpotlight ? activeItem.id : undefined;
  const selectedLocationId = activeItem.id;
  const displayedQuote = hasSpotlight ? activeItem.quote : defaultQuote;
  const itemIndexById = new Map(items.map((item, index) => [item.id, index]));

  const activate = (index: number) => {
    if (pinnedIndex !== null) return;
    setActiveIndex(index);
    setHasSpotlight(true);
  };

  const clearSpotlight = useCallback(() => {
    setPinnedIndex(null);
    setActiveIndex(defaultIndex);
    setHasSpotlight(false);
  }, [defaultIndex]);

  const togglePinned = (index: number) => {
    if (pinnedIndex === index) {
      clearSpotlight();
      return;
    }

    setPinnedIndex(index);
    setActiveIndex(index);
    setHasSpotlight(true);
  };

  const reset = () => {
    if (pinnedIndex !== null) {
      setActiveIndex(pinnedIndex);
      setHasSpotlight(true);
      return;
    }

    setActiveIndex(defaultIndex);
    setHasSpotlight(false);
  };

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

  return (
    <div
      ref={sectionRef}
      className="grid gap-6 sm:items-stretch sm:grid-cols-[minmax(0,1fr)_minmax(16rem,21rem)] sm:gap-8"
    >
      <div
        className="order-1 space-y-4 sm:space-y-5"
        onMouseLeave={reset}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            reset();
          }
        }}
      >
        {entries.map((entry) => {
          const entryItemIds = entry.parts
            .map((part) => part.itemId)
            .filter((itemId): itemId is string => Boolean(itemId));
          const entryHasActiveItem = entryItemIds.includes(activeItemId ?? "");
          const entryUsesInternalSpotlight = entryItemIds.length > 1 && entryHasActiveItem;
          const entryIsDimmed = hasSpotlight && !entryHasActiveItem;

          return (
            <p
              key={entry.id}
              className={cn(
                "max-w-[38rem] whitespace-pre-wrap text-[0.98rem] leading-[1.45] tracking-[-0.015em] text-foreground/92 transition duration-300 sm:text-[1.02rem]",
                entryIsDimmed && !entryUsesInternalSpotlight && "opacity-25 blur-[1.4px]"
              )}
            >
              {entry.parts.map((part, partIndex) => {
                const partIsActive = part.itemId === activeItemId;
                const partIsSoftened = entryUsesInternalSpotlight && !partIsActive;

                if (!part.itemId) {
                  return (
                    <span
                      key={`${entry.id}-${partIndex}`}
                      className={cn(
                        "transition duration-300",
                        partIsSoftened && "opacity-25 blur-[1.4px]"
                      )}
                    >
                      {part.text}
                    </span>
                  );
                }

                const itemIndex = itemIndexById.get(part.itemId);

                if (itemIndex === undefined) {
                  return (
                    <span
                      key={`${entry.id}-${partIndex}`}
                      className={cn(
                        "transition duration-300",
                        partIsSoftened && "opacity-25 blur-[1.4px]"
                      )}
                    >
                      {part.text}
                    </span>
                  );
                }

                const isActive = items[itemIndex]?.id === activeItemId;

                return (
                  <button
                    key={`${entry.id}-${part.itemId}-${partIndex}`}
                    type="button"
                    className={cn(
                      "inline cursor-pointer text-left text-foreground transition duration-300 hover:text-foreground focus-visible:rounded-[0.2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive && "text-foreground",
                      partIsSoftened && "opacity-25 blur-[1.4px]",
                      part.className
                    )}
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
          );
        })}
      </div>

      <div
        className="order-2 relative mt-4 h-[15rem] border-t pt-6 sm:mt-0 sm:h-auto sm:self-stretch sm:border-t-0 sm:pt-0"
        onMouseLeave={reset}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            reset();
          }
        }}
      >
        <div className="absolute -top-10 z-0 aspect-square w-[20rem] sm:-top-30 sm:w-full">
          <Globe
            className="z-0"
            locations={items}
            focusedLocation={globeFocusLocation}
            selectedLocationId={selectedLocationId}
            onLocationSelect={(itemId) => {
              const itemIndex = itemIndexById.get(itemId);

              if (itemIndex !== undefined) {
                togglePinned(itemIndex);
              }
            }}
          />
        </div>

        <blockquote className="pointer-events-none absolute bottom-0 right-0 z-20 w-full max-w-[19rem] rounded-xl bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-sm ring-1 ring-foreground/10">
          <p>
            <span aria-hidden="true">&ldquo;</span>
            {displayedQuote}
            <span aria-hidden="true">&rdquo;</span>
          </p>
        </blockquote>
      </div>
    </div>
  );
}
