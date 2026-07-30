"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "about", label: "About me" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

export function SectionNavigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const lockedIndex = useRef<number | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateActiveSection = () => {
      if (lockedIndex.current !== null) {
        setActiveIndex(lockedIndex.current);
        return;
      }

      if (window.scrollY < 8) {
        setActiveIndex(0);
        return;
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActiveIndex(sections.length - 1);
        return;
      }

      const target = window.innerHeight * 0.3;
      const index = sections.reduce((active, section, current) => {
        const top = document.getElementById(section.id)?.getBoundingClientRect().top;
        return top !== undefined && top <= target ? current : active;
      }, 0);

      setActiveIndex(index);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="fixed top-1/2 right-[calc(1rem-var(--scrollbar-compensation,0px))] z-40 -translate-y-1/2 sm:right-[calc(1.5rem-var(--scrollbar-compensation,0px))]"
    >
      <div className="relative flex flex-col gap-3">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={section.label}
            aria-current={index === activeIndex ? "location" : undefined}
            className="group relative flex h-1 w-8 items-center justify-end"
            onClick={(event) => {
              event.preventDefault();
              lockedIndex.current = index;
              setActiveIndex(index);
              if (unlockTimer.current) clearTimeout(unlockTimer.current);
              unlockTimer.current = setTimeout(() => {
                lockedIndex.current = null;
              }, reduceMotion ? 0 : 800);
              document.getElementById(section.id)?.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
              });
              history.replaceState(null, "", `#${section.id}`);
            }}
          >
            <span className="h-1 w-8 rounded-full bg-foreground/25 transition-colors group-hover:bg-foreground/50" />
            <span className="pointer-events-none absolute right-10 rounded bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100">
              {section.label}
            </span>
          </a>
        ))}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-1 w-8 rounded-full bg-foreground"
          animate={{ y: activeIndex * 16 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
        />
      </div>
    </nav>
  );
}
