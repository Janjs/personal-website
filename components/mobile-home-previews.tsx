"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  BrowserIcon,
  CloudIcon,
  DatabaseIcon,
  DatabaseSearchIcon,
  PythonIcon,
  ReactIcon,
  SparklesIcon,
  Typescript01Icon,
} from "@hugeicons/core-free-icons";

import { Globe } from "@/components/ui/globe";
import { Badge } from "@/components/ui/badge";
import type { AboutGlobeItem } from "@/components/about-globe-section";
import type { Project } from "@/lib/projects";

const PREVIEW_CITY_INTERVAL_MS = 3400;

const skillsPreviewItems = [
  { name: "TypeScript", icon: Typescript01Icon, left: "6%", top: "10%" },
  { name: "React", icon: ReactIcon, left: "52%", top: "6%", dimmed: true },
  { name: "PostgreSQL", icon: DatabaseIcon, left: "78%", top: "18%", dimmed: true },
  { name: "Next.js", icon: BrowserIcon, left: "24%", top: "28%" },
  { name: "RAG", icon: DatabaseSearchIcon, left: "68%", top: "34%" },
  { name: "LLMs", icon: AiBrain01Icon, left: "10%", top: "52%", dimmed: true },
  { name: "AI", icon: SparklesIcon, left: "44%", top: "48%", main: true },
  { name: "TypeScript", icon: Typescript01Icon, left: "72%", top: "62%", dimmed: true },
  { name: "Azure", icon: CloudIcon, left: "30%", top: "72%" },
  { name: "Python", icon: PythonIcon, left: "58%", top: "78%", dimmed: true },
] as const;

function SkillsPreviewChips({ dimmed }: { dimmed?: boolean }) {
  return (
    <>
      {skillsPreviewItems.map((item, index) => (
        <Badge
          key={`${item.name}-${index}`}
          variant="secondary"
          className={`skills-preview-chip${"main" in item ? " is-main" : ""}${dimmed && "dimmed" in item ? " is-dim" : ""}`}
          style={{ left: item.left, top: item.top }}
        >
          <HugeiconsIcon icon={item.icon} size={"main" in item ? 12 : 11} strokeWidth={2} aria-hidden="true" />
          {item.name}
        </Badge>
      ))}
    </>
  );
}

export function SkillsPreview() {
  return (
    <div className="skills-preview" aria-hidden="true">
      <div className="skills-preview-stage">
        <div className="skills-preview-chips">
          <SkillsPreviewChips dimmed />
        </div>
        <div className="skills-preview-zoom">
          <div className="skills-preview-chips">
            <SkillsPreviewChips />
          </div>
        </div>
        <div className="skills-preview-lens" />
      </div>
    </div>
  );
}

export function AboutPreview({ items }: { items: AboutGlobeItem[] }) {
  const cities = items.filter((item, index) =>
    index === items.findIndex((candidate) => candidate.place === item.place)
  );
  const defaultIndex = Math.max(
    0,
    cities.findIndex((item) => item.id === "current-location")
  );
  const [index, setIndex] = useState(defaultIndex);
  const [homeVisible, setHomeVisible] = useState(false);
  const wasHomeVisibleRef = useRef(false);
  const [reducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const home = document.getElementById("home");
    if (!home) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        setHomeVisible(visible);
        if (visible) {
          wasHomeVisibleRef.current = true;
        } else if (wasHomeVisibleRef.current) {
          setIndex(defaultIndex);
        }
      },
      { root: home.closest(".portfolio-stream"), threshold: [0, 0.5, 1] }
    );

    observer.observe(home);
    return () => observer.disconnect();
  }, [defaultIndex]);

  useEffect(() => {
    if (!homeVisible || reducedMotion || cities.length < 2) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % cities.length),
      PREVIEW_CITY_INTERVAL_MS
    );

    return () => window.clearInterval(timer);
  }, [cities.length, homeVisible, reducedMotion]);

  const city = cities[index] ?? cities[defaultIndex];
  if (!city) return null;

  return (
    <div className="about-preview" aria-hidden="true">
      <div className="about-preview-globe">
        <Globe
          locations={cities}
          focusedLocation={city.location}
          selectedLocationId={city.id}
          idleRotate={false}
        />
      </div>
    </div>
  );
}

export function ProjectsPreview({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.screenshotSrc).slice(0, 9);

  return (
    <div className="projects-preview" aria-hidden="true">
      <div className="projects-preview-collage">
        {[0, 1].map((set) => (
          <div className="projects-preview-set" key={set}>
            {featured.map((project) => (
              <div className="projects-preview-card" key={project.github}>
                <Image src={project.screenshotSrc!} alt="" fill sizes="280px" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspacePreview() {
  return (
    <div className="workspace-preview" aria-hidden="true">
      <Image src="/workspace/preview-light.png" alt="" fill sizes="280px" className="dark:hidden" />
      <Image src="/workspace/preview-dark.png" alt="" fill sizes="280px" className="hidden dark:block" />
    </div>
  );
}
