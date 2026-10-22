"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { autocomplete, runCommand, type Line } from "@/components/room/terminal-commands";
import { paintTerminalScreen } from "@/components/room/terminal-screen";
import { cn } from "@/lib/utils";

const prompt = "jan@portfolio:~$";

const welcome: Line[] = [
  { text: "Welcome to Jan's workspace.", tone: "accent" },
  { text: "Type help to look around. Esc to leave.", tone: "muted" },
];

const toneClass: Record<NonNullable<Line["tone"]>, string> = {
  muted: "text-white/45",
  accent: "text-[#f2c66d]",
  good: "text-[#c3e88d]",
  warn: "text-[#f78c6c]",
  error: "text-[#f78c6c]",
  cmd: "text-[#82aaff]",
};

function OutputLine({ line }: { line: Line }) {
  const color = line.tone ? toneClass[line.tone] : "text-[#e8e4dc]";
  if (line.href) {
    return (
      <a href={line.href} target={line.href.startsWith("mailto:") ? undefined : "_blank"} rel={line.href.startsWith("mailto:") ? undefined : "noreferrer"} className={cn("underline decoration-white/25 underline-offset-2 hover:decoration-white/70", color)}>
        {line.text}
      </a>
    );
  }
  return <span className={color}>{line.text}</span>;
}

export function RoomTerminal({ active, onExit, onEnter }: { active: boolean; onExit: () => void; onEnter: () => void }) {
  const [lines, setLines] = useState<Line[]>(welcome);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const historyAt = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const painted = useRef<Line[] | null>(null);
  if (painted.current !== lines) {
    painted.current = lines;
    paintTerminalScreen(lines);
  }
  const wasActive = useRef<boolean | null>(null);
  if (wasActive.current !== active) {
    wasActive.current = active;
    queueMicrotask(() => {
      if (active) input.current?.focus({ preventScroll: true });
      else input.current?.blur();
    });
  }

  const submit = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    history.current.push(command);
    historyAt.current = -1;
    const result = runCommand(command);
    if (result.clear) {
      setLines([]);
      setValue("");
      return;
    }
    setLines((current) => [...current, { text: command, tone: "cmd" }, ...(result.lines ?? [])]);
    setValue("");
    if (result.exit) onExit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement | HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      onExit();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      setValue(autocomplete(value));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const log = history.current;
      if (!log.length) return;
      const next = historyAt.current < 0 ? log.length - 1 : Math.max(0, historyAt.current - 1);
      historyAt.current = next;
      setValue(log[next] ?? "");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const log = history.current;
      if (historyAt.current < 0) return;
      const next = historyAt.current + 1;
      if (next >= log.length) {
        historyAt.current = -1;
        setValue("");
        return;
      }
      historyAt.current = next;
      setValue(log[next] ?? "");
    }
  };

  const focusInput = () => input.current?.focus({ preventScroll: true });

  return (
    <form
      className={cn(
        "room-terminal flex h-[360px] w-[640px] flex-col overflow-hidden bg-[#1e1f2b] font-mono text-[13px] leading-snug text-[#e8e4dc]",
        !active && "cursor-pointer select-none",
      )}
      onKeyDown={onKeyDown}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!active) {
          onEnter();
          return;
        }
        submit(value);
      }}
      onMouseDown={(event) => {
        if (!active) event.preventDefault();
      }}
      onClick={() => {
        if (!active) onEnter();
        else focusInput();
      }}
    >
      <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2.5", !active && "pointer-events-none")}>
        <div className="whitespace-pre-wrap">
          {lines.map((line, index) =>
            line.tone === "cmd" ? (
              <div key={`${line.text}-${index}`} className="flex items-baseline gap-2">
                <span className="shrink-0 text-[#c3e88d]">{prompt}</span>
                <span>{line.text}</span>
              </div>
            ) : (
              <div key={`${line.text}-${index}`}>
                <OutputLine line={line} />
              </div>
            ),
          )}
          <div
            ref={(node) => {
              const scroller = node?.parentElement?.parentElement;
              if (scroller) scroller.scrollTop = scroller.scrollHeight;
            }}
            className="flex items-baseline gap-2"
          >
            <span className="shrink-0 text-[#c3e88d]">{prompt}</span>
            <input
              ref={input}
              tabIndex={active ? 0 : -1}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              inputMode="text"
              aria-label="Terminal command"
              className="min-w-0 flex-1 bg-transparent p-0 leading-snug text-[#e8e4dc] caret-[#c3e88d] outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
