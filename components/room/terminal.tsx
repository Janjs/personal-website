"use client";

import { useEffect, useRef, useState } from "react";

import { autocomplete, runCommand, type Line } from "@/components/room/terminal-commands";
import { getRoomFx } from "@/components/room/room-fx";
import { armTerminalKeyboard, blurTerminalKeyboard, terminalKb } from "@/components/room/terminal-keyboard";
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
  const [value, setValue] = useState(() => terminalKb.node?.value ?? "");
  const history = useRef<string[]>([]);
  const historyAt = useRef(-1);
  const [mashing, setMashing] = useState(false);
  if (!active && mashing) setMashing(false);
  useEffect(() => {
    if (!active || !mashing) return;
    const id = window.setInterval(() => {
      setLines((current) => {
        const last = current[current.length - 1];
        if (last && last.text.length < 72 && /^a+$/.test(last.text)) {
          const next = current.slice();
          next[next.length - 1] = { text: last.text + "a" };
          return next;
        }
        return [...current, { text: "a" }];
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [active, mashing]);
  const painted = useRef(false);
  if (!painted.current) {
    painted.current = true;
    paintTerminalScreen([], false);
  }
  const wasActive = useRef<boolean | null>(null);
  if (wasActive.current !== active) {
    const prev = wasActive.current;
    wasActive.current = active;
    if (active) armTerminalKeyboard();
    else if (prev === true) blurTerminalKeyboard();
  }

  const submit = (raw: string) => {
    if (mashing) return;
    const command = raw.trim();
    if (!command) return;
    history.current.push(command);
    historyAt.current = -1;
    const before = getRoomFx().catToken;
    const result = runCommand(command);
    if (result.clear) {
      setLines([]);
      setValue("");
      return;
    }
    setLines((current) => [...current, { text: command, tone: "cmd" }, ...(result.lines ?? [])]);
    setValue("");
    if (getRoomFx().catToken !== before) setMashing(true);
    if (result.exit) onExit();
  };

  const node = terminalKb.node;
  if (node) {
    node.oninput = () => {
      if (mashing) {
        node.value = "";
        return;
      }
      setValue(node.value);
    };
    node.onkeydown = (event) => {
      event.stopPropagation();
      if (mashing && event.key !== "Escape") {
        event.preventDefault();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        submit(node.value);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onExit();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        const next = autocomplete(node.value);
        node.value = next;
        setValue(next);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const log = history.current;
        if (!log.length) return;
        const next = historyAt.current < 0 ? log.length - 1 : Math.max(0, historyAt.current - 1);
        historyAt.current = next;
        node.value = log[next] ?? "";
        setValue(node.value);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const log = history.current;
        if (historyAt.current < 0) return;
        const at = historyAt.current + 1;
        if (at >= log.length) {
          historyAt.current = -1;
          node.value = "";
          setValue("");
          return;
        }
        historyAt.current = at;
        node.value = log[at] ?? "";
        setValue(node.value);
      }
    };
    if (node.value !== value) node.value = value;
  }

  return (
    <form
      className={cn(
        "room-terminal flex h-[360px] w-[640px] flex-col overflow-hidden bg-transparent font-mono text-[13px] leading-[17px] text-[#e8e4dc]",
        !active && "cursor-pointer select-none",
      )}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!active) {
          onEnter();
          return;
        }
        if (mashing) return;
        submit(value);
      }}
      onPointerDown={(event) => {
        if (!active) {
          event.preventDefault();
          return;
        }
        armTerminalKeyboard();
      }}
      onClick={() => {
        if (!active) onEnter();
        else armTerminalKeyboard();
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
              if (!scroller || scroller.clientHeight < 8) return;
              if (scroller.scrollHeight > scroller.clientHeight + 1) scroller.scrollTop = scroller.scrollHeight;
            }}
          >
            {mashing ? null : (
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 text-[#c3e88d]">{prompt}</span>
                <span className="text-[#e8e4dc]">
                  {value}
                  {active ? <span className="ml-px inline-block h-[1em] w-[2px] align-text-bottom animate-pulse bg-[#c3e88d]" /> : null}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
