import { contactLinks, experience, profile, skillGroups } from "@/lib/portfolio";
import { findProjects, portfolioProjects, projectHref } from "@/lib/projects";
import { dispatchRoom, keyMash } from "@/components/room/room-fx";

export type LineTone = "muted" | "accent" | "good" | "warn" | "error" | "cmd";

export type Line = {
  text: string;
  href?: string;
  tone?: LineTone;
};

export type CommandResult = {
  lines?: Line[];
  clear?: boolean;
  exit?: boolean;
};

type Command = {
  names: string[];
  help?: string;
  run: (args: string) => CommandResult;
};

const pad = (label: string, width = 18) => label.padEnd(width, " ");

function helpLines(): Line[] {
  return [
    { text: "Available commands", tone: "accent" },
    ...commands.filter((command) => command.help).map((command) => ({
      text: `${pad(command.names[0])}${command.help}`,
    })),
  ];
}

function projectLines() {
  return portfolioProjects.map((project) => ({
    text: `${pad(project.name, 22)}${project.tag}`,
    href: projectHref(project),
  }));
}

export const commands: Command[] = [
  { names: ["help"], help: "Show this list", run: () => ({ lines: helpLines() }) },
  {
    names: ["whoami"],
    help: "A short introduction",
    run: () => ({
      lines: [
        { text: `${profile.name} — ${profile.role}`, tone: "accent" },
        { text: profile.summary },
        { text: `${profile.origin} → ${profile.location}`, tone: "muted" },
      ],
    }),
  },
  {
    names: ["experience"],
    help: "Professional timeline",
    run: () => ({
      lines: experience.flatMap((job, index) => [
        ...(index ? [{ text: "│", tone: "muted" as const }] : []),
        { text: `●  ${job.role}`, tone: "accent" },
        { text: `   ${job.company}  ·  ${job.dates}` },
        { text: `   ${job.place}`, tone: "muted" },
        { text: `   ${job.summary}` },
        ...("clients" in job
          ? job.clients.flatMap((client) => [
              { text: `   ●  ${client.role}`, tone: "accent" as const },
              { text: `      ${client.company}  ·  ${client.dates}` },
              { text: `      ${client.place}`, tone: "muted" as const },
              { text: `      ${client.summary}` },
            ])
          : []),
      ]),
    }),
  },
  {
    names: ["ls projects"],
    help: "List projects",
    run: () => ({ lines: [{ text: "projects/", tone: "accent" }, ...projectLines()] }),
  },
  {
    names: ["ls"],
    run: (args) => {
      if (!args || args === ".") {
        return {
          lines: [
            { text: "projects/", tone: "accent" },
            { text: "skills.txt" },
            { text: "" },
            { text: "Try `ls projects` or `cat skills.txt`.", tone: "muted" },
          ],
        };
      }
      if (args === "projects") return { lines: [{ text: "projects/", tone: "accent" }, ...projectLines()] };
      return { lines: [{ text: `ls: ${args}: not found`, tone: "error" }] };
    },
  },
  {
    names: ["open"],
    help: "Open a project by name",
    run: (args) => {
      if (!args) {
        return {
          lines: [
            { text: "usage: open <project>", tone: "warn" },
            { text: "Projects:", tone: "muted" },
            ...projectLines(),
          ],
        };
      }
      const matches = findProjects(args);
      if (matches.length === 1) {
        const href = projectHref(matches[0]);
        window.open(href, "_blank", "noopener,noreferrer");
        return {
          lines: [
            { text: `Opening ${matches[0].name}`, tone: "good" },
            { text: href, href },
          ],
        };
      }
      if (matches.length > 1) {
        return {
          lines: [
            { text: `Several projects match “${args}”. Be more specific:`, tone: "warn" },
            ...matches.map((project) => ({ text: `  ${project.name}`, href: projectHref(project) })),
          ],
        };
      }
      return {
        lines: [
          { text: `Project not found: ${args}`, tone: "error" },
          { text: "Available projects:", tone: "muted" },
          ...portfolioProjects.map((project) => ({ text: `  ${project.name}` })),
        ],
      };
    },
  },
  {
    names: ["cat"],
    help: "Call the cat, or read a file",
    run: (args) => {
      if (!args) {
        dispatchRoom({ type: "cat" });
        return { exit: true, lines: [{ text: keyMash }] };
      }
      if (args === "skills.txt" || args === "skills") {
        return {
          lines: skillGroups.flatMap((group) => [
            { text: group.category, tone: "accent" },
            { text: `  ${group.items.join("  ·  ")}` },
          ]),
        };
      }
      return { lines: [{ text: `cat: ${args}: no such file`, tone: "error" }] };
    },
  },
  {
    names: ["cat skills.txt"],
    help: "Show technical skills",
    run: () => commands.find((command) => command.names[0] === "cat")!.run("skills.txt"),
  },
  {
    names: ["contact"],
    help: "Email and socials",
    run: () => ({
      lines: [
        { text: "Elsewhere", tone: "accent" },
        ...contactLinks.map((link) => ({
          text: `${pad(link.label, 10)}${"display" in link ? link.display : link.href}`,
          href: link.href,
        })),
      ],
    }),
  },
  { names: ["clear"], help: "Clear the screen", run: () => ({ clear: true }) },
  { names: ["exit"], help: "Leave the terminal", run: () => ({ exit: true, lines: [{ text: "Later.", tone: "muted" }] }) },
  {
    names: ["coffee"],
    help: "Steam the mug",
    run: () => {
      dispatchRoom({ type: "coffee" });
      return { lines: [{ text: "Fresh pot. Press Esc and look at the mug.", tone: "good" }] };
    },
  },
  {
    names: ["lights off"],
    help: "Dim the room, keep the monitor on",
    run: () => {
      dispatchRoom({ type: "lights", mode: "off" });
      return { lines: [{ text: "Lights out. The screen stays up.", tone: "muted" }] };
    },
  },
  {
    names: ["lights on"],
    help: "Restore the original lighting",
    run: () => {
      dispatchRoom({ type: "lights", mode: "on" });
      return { lines: [{ text: "Lights back on.", tone: "good" }] };
    },
  },
  {
    names: ["sudo hire jan"],
    run: () => {
      dispatchRoom({ type: "hire" });
      return { lines: [{ text: "Access granted. Excellent decision.", tone: "good" }] };
    },
  },
  {
    names: ["rm -rf /"],
    run: () => {
      dispatchRoom({ type: "melt" });
      return {
        lines: [
          { text: "rm: permission denied... just kidding.", tone: "error" },
          { text: "fsck: restoring workspace.", tone: "muted" },
        ],
      };
    },
  },
  {
    names: ["42"],
    run: () => ({
      lines: [
        { text: "The answer to life, the universe, and everything.", tone: "accent" },
        { text: "Now, what was the question?", tone: "muted" },
      ],
    }),
  },
  {
    names: ["ping barcelona"],
    run: () => {
      dispatchRoom({ type: "weather", place: "barcelona" });
      return { lines: [{ text: "64 bytes from Barcelona: ttl=sun time=22°C", tone: "good" }] };
    },
  },
  {
    names: ["ping utrecht"],
    run: () => {
      dispatchRoom({ type: "weather", place: "utrecht" });
      return { lines: [{ text: "64 bytes from Utrecht: ttl=rain time=grey", tone: "accent" }] };
    },
  },
  {
    names: ["konami"],
    run: () => {
      dispatchRoom({ type: "konami" });
      return { lines: [{ text: "↑↑↓↓←→←→BA unlocked", tone: "good" }] };
    },
  },
  {
    names: ["sudo make me a sandwich"],
    run: () => {
      dispatchRoom({ type: "sandwich" });
      return { lines: [{ text: "Okay.", tone: "good" }] };
    },
  },
];

function rankedNames() {
  return commands
    .flatMap((command) => command.names.map((name) => ({ command, name })))
    .sort((a, b) => b.name.length - a.name.length);
}

export function matchCommand(input: string) {
  const raw = input.trim();
  const lower = raw.toLowerCase();
  if (!lower) return null;
  for (const { command, name } of rankedNames()) {
    if (lower === name) return { command, args: "" };
    if (lower.startsWith(`${name} `)) return { command, args: raw.slice(name.length).trim() };
  }
  return null;
}

export function runCommand(input: string): CommandResult {
  const match = matchCommand(input);
  if (!match) {
    return { lines: [{ text: `command not found: ${input.trim()}. Type help.`, tone: "error" }] };
  }
  return match.command.run(match.args);
}

export function publicCommandNames() {
  return commands.filter((command) => command.help).flatMap((command) => command.names);
}

export function autocomplete(input: string) {
  const raw = input;
  const lower = raw.toLowerCase();
  if (lower.startsWith("open ")) {
    const query = raw.slice(5);
    const hits = portfolioProjects.filter((project) => {
      const name = project.name.toLowerCase();
      const slug = project.github.toLowerCase();
      const q = query.toLowerCase();
      return name.startsWith(q) || slug.startsWith(q) || name.includes(q);
    });
    if (hits.length === 1) return `open ${hits[0].name}`;
    if (hits.length > 1) {
      const names = hits.map((project) => project.name);
      const shared = names.reduce((prefix, name) => {
        let i = 0;
        while (i < prefix.length && prefix[i]?.toLowerCase() === name[i]?.toLowerCase()) i += 1;
        return prefix.slice(0, i);
      });
      if (shared.length > query.length) return `open ${shared}`;
    }
    return raw;
  }
  const names = publicCommandNames();
  const hits = names.filter((name) => name.startsWith(lower));
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) {
    const shared = hits.reduce((prefix, name) => {
      let i = 0;
      while (i < prefix.length && prefix[i] === name[i]) i += 1;
      return prefix.slice(0, i);
    });
    if (shared.length > raw.length) return shared;
  }
  return raw;
}

if (process.env.NODE_ENV === "development") {
  console.assert(matchCommand("OPEN stroop")?.command.names[0] === "open", "open match");
  console.assert(matchCommand("ls projects")?.command.names[0] === "ls projects", "ls projects match");
  console.assert(matchCommand("cat skills.txt")?.args === "skills.txt" || matchCommand("cat skills.txt")?.command.names[0] === "cat skills.txt", "cat skills");
  console.assert(findProjects("stroop")[0]?.name === "Stroop", "project stroop");
  console.assert(findProjects("3D Seat Selection")[0]?.github === "cinema-3d-seat-selection", "project spaces");
  console.assert(findProjects("this website")[0]?.github === "personal-website", "this website");
  console.assert(autocomplete("who") === "whoami", "autocomplete whoami");
  console.assert(matchCommand("lights off")?.command.names[0] === "lights off", "lights off");
  console.assert(!publicCommandNames().some((name) => /party|gravity|guitar|matrix/.test(name)), "removed scene commands");
  console.assert(runCommand("party").lines?.[0]?.text.includes("not found"), "party gone");
}
