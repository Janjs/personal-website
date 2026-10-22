import { canvasTexture } from "@/components/room/primitives";
import type { Line } from "@/components/room/terminal-commands";
import type { CanvasTexture } from "three";

const width = 640;
const height = 360;
const row = 17;
const fontSize = 13;
const padX = 12;
const padY = 10;
const promptGap = 8;
const prompt = "jan@portfolio:~$";
const tones: Record<NonNullable<Line["tone"]>, string> = {
  muted: "rgba(232,228,220,0.45)",
  accent: "#f2c66d",
  good: "#c3e88d",
  warn: "#f78c6c",
  error: "#f78c6c",
  cmd: "#82aaff",
};

const welcome: Line[] = [
  { text: "Welcome to Jan's workspace.", tone: "accent" },
  { text: "Type help to look around. Esc to leave.", tone: "muted" },
];

function font() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "ui-monospace";
  return `${fontSize}px ${family}, ui-monospace, monospace`;
}

function paint(ctx: CanvasRenderingContext2D, lines: Line[], drawText = true, showPrompt = true) {
  ctx.fillStyle = "#1e1f2b";
  ctx.fillRect(0, 0, width, height);
  if (!drawText) return;
  ctx.font = font();
  ctx.textBaseline = "top";
  const max = Math.floor((height - padY * 2) / row);
  const visible = lines.length > max ? lines.slice(-max) : lines;
  let y = padY + (row - fontSize) / 2;
  const promptW = ctx.measureText(prompt).width;
  for (const line of visible) {
    if (line.tone === "cmd") {
      ctx.fillStyle = "#c3e88d";
      ctx.fillText(prompt, padX, y);
      ctx.fillStyle = "#e8e4dc";
      ctx.fillText(line.text, padX + promptW + promptGap, y);
    } else {
      ctx.fillStyle = line.tone ? tones[line.tone] : "#e8e4dc";
      ctx.fillText(line.text, padX, y);
    }
    y += row;
  }
  if (!showPrompt) return;
  ctx.fillStyle = "#c3e88d";
  ctx.fillText(prompt, padX, y);
}

let texture: CanvasTexture | null = null;

export function getTerminalScreen() {
  texture ??= canvasTexture(width, height, (ctx) => paint(ctx, welcome));
  return texture;
}

export function paintTerminalScreen(lines: Line[], drawText = true, showPrompt = true) {
  const screen = getTerminalScreen();
  paint(screen.image.getContext("2d")!, lines, drawText, showPrompt);
  screen.needsUpdate = true;
}
