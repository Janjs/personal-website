import { canvasTexture } from "@/components/room/primitives";
import type { Line } from "@/components/room/terminal-commands";
import type { CanvasTexture } from "three";

const width = 640;
const height = 360;
const row = 17;
const left = 14;
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

function paint(ctx: CanvasRenderingContext2D, lines: Line[]) {
  ctx.fillStyle = "#1e1f2b";
  ctx.fillRect(0, 0, width, height);
  ctx.font = "600 13px ui-monospace, SFMono-Regular, Menlo, monospace";
  const max = Math.floor((height - 36) / row);
  const visible = lines.length > max ? lines.slice(-max) : lines;
  let y = 22;
  for (const line of visible) {
    if (line.tone === "cmd") {
      ctx.fillStyle = "#c3e88d";
      const prefix = "jan@portfolio:~$  ";
      ctx.fillText(prefix, left, y);
      ctx.fillStyle = "#e8e4dc";
      ctx.fillText(line.text, left + ctx.measureText(prefix).width, y);
    } else {
      ctx.fillStyle = line.tone ? tones[line.tone] : "#e8e4dc";
      ctx.fillText(line.text, left, y);
    }
    y += row;
  }
  ctx.fillStyle = "#c3e88d";
  ctx.fillText("jan@portfolio:~$", left, y + 6);
}

let texture: CanvasTexture | null = null;

export function getTerminalScreen() {
  texture ??= canvasTexture(width, height, (ctx) => paint(ctx, welcome));
  return texture;
}

export function paintTerminalScreen(lines: Line[]) {
  const screen = getTerminalScreen();
  paint(screen.image.getContext("2d")!, lines);
  screen.needsUpdate = true;
}
