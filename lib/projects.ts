import type { StaticImageData } from "next/image";

import chordwiseScreenshot from "@/public/project-screenshots/chordwise.png";
import highlightsAiScreenshot from "@/public/project-screenshots/highlights-ai.jpeg";
import scandropMcpScreenshot from "@/public/project-screenshots/scandrop-mcp.png";
import stroopScreenshot from "@/public/project-screenshots/stroop.png";
import sunnySpotsScreenshot from "@/public/project-screenshots/sunny-spots.jpeg";
import todaysHarvestScreenshot from "@/public/project-screenshots/todays-harvest.png";

export type ProjectKind = "web" | "mobile" | "mcp";

export type Project = {
  name: string;
  tag: string;
  liveUrl: string | null;
  iconSrc?: string | StaticImageData;
  iconText?: string;
  darkIconText?: string;
  github: string;
  kind: ProjectKind;
  iconWrapperClass?: string;
  stars?: number;
  screenshotSrc?: string | StaticImageData;
  description: string;
  chips: string[];
  techStack: string[];
};

export const portfolioProjects: Project[] = [
  {
    name: "Chordwise",
    tag: "Chord progressions",
    liveUrl: "https://chordwise.chat",
    iconSrc: "/project-icons/chordwise.svg",
    github: "chordwise",
    kind: "web",
    iconWrapperClass:
      "bg-linear-to-br from-white via-[#f8f8f8] to-[#ededed] p-0.5 dark:from-[#1d1d1d] dark:via-[#252525] dark:to-[#2c2c2c]",
    screenshotSrc: chordwiseScreenshot,
    description: "AI-powered chord progression generator for musicians exploring harmony and songwriting ideas.",
    chips: ["Web App", "AI", "Music"],
    techStack: ["Next.js", "TypeScript", "OpenAI API", "Convex"],
  },
  {
    name: "Stroop",
    tag: "Generative Audio",
    liveUrl: "https://stroop.janjs.dev",
    iconSrc: "/project-icons/stroop.svg",
    github: "stroop",
    kind: "web",
    iconWrapperClass:
      "bg-linear-to-br from-white via-[#f4fbfb] to-[#2d8b8f]/10 p-0.5 dark:from-[#173d3f] dark:via-[#1d4c4f] dark:to-[#2d8b8f]/35",
    screenshotSrc: stroopScreenshot,
    description: "Generate and experiment with Strudel live-coding music snippets with AI-assisted prompting.",
    chips: ["Web App", "Audio", "Generative"],
    techStack: ["Next.js", "TypeScript", "Strudel", "Convex"],
  },
  {
    name: "Scandrop MCP",
    tag: "Spatial AI",
    liveUrl: null,
    iconSrc: "/project-icons/scandrop.svg",
    github: "scandrop-mcp",
    kind: "mcp",
    iconWrapperClass:
      "bg-linear-to-br from-white via-[#f4fdf9] to-[#2ea892]/10 p-0.5 dark:from-[#113b34] dark:via-[#154842] dark:to-[#2ea892]/30",
    stars: 39,
    screenshotSrc: scandropMcpScreenshot,
    description: "MCP server that helps LLMs reason about and interact with 3D spatial environments.",
    chips: ["MCP", "Spatial", "3D"],
    techStack: ["TypeScript", "MCP", "3D Processing"],
  },
  {
    name: "Sunny Spots",
    tag: "Find sun in your city",
    liveUrl: "https://sunnyspots.vercel.app",
    iconText: "☀️",
    darkIconText: "🌙",
    iconWrapperClass:
      "bg-linear-to-br from-white via-[#fffaf0] to-[#ffb63a]/12 dark:from-[#0f1f3d] dark:via-[#162a4f] dark:to-[#264a87]/45",
    github: "sunnyspots",
    kind: "web",
    screenshotSrc: sunnySpotsScreenshot,
    description: "Map-based app to discover when parks, cafes, and city spots receive sunlight during the day.",
    chips: ["Web App", "Maps", "Urban"],
    techStack: ["Next.js", "TypeScript", "Mapping APIs"],
  },
  {
    name: "Highlights AI",
    tag: "Sports Vision",
    liveUrl: "https://highlightsai.janjs.dev",
    iconSrc: "/project-icons/highlights-ai.svg",
    github: "highlights-ai",
    kind: "web",
    iconWrapperClass:
      "bg-linear-to-br from-white via-[#fff8ef] to-[#ffb267]/12 p-0.5 dark:from-[#4d2c17] dark:via-[#63381d] dark:to-[#ffb267]/35",
    screenshotSrc: highlightsAiScreenshot,
    description: "Create basketball highlight reels by combining computer vision detections with scene-aware editing.",
    chips: ["Web App", "Sports", "Computer Vision"],
    techStack: ["Next.js", "Python", "Roboflow"],
  },
  {
    name: "Today's Harvest",
    tag: "Seasonal Food",
    liveUrl: null,
    iconSrc: "/project-icons/todays-harvest.png",
    github: "todays-harvest",
    kind: "mobile",
    screenshotSrc: todaysHarvestScreenshot,
    description: "Widget-focused iOS app that shows in-season produce based on your location to support fresher, local eating.",
    chips: ["Mobile App", "Food", "Seasonality"],
    techStack: ["Swift", "iOS", "Location Services"],
  },
];
