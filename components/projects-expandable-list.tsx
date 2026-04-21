"use client";

import { LiveProjectButton } from "@/components/live-project-button";
import { Separator } from "@/components/ui/separator";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { Project, ProjectKind } from "@/lib/projects";
import { Laptop, Smartphone, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type ProjectsExpandableListProps = {
  projects: Project[];
};

function GithubMark({ className }: { className: string }) {
  return (
    <svg fill="currentColor" viewBox="0 -0.5 25 25" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="m12.301 0h.093c2.242 0 4.34.613 6.137 1.68l-.055-.031c1.871 1.094 3.386 2.609 4.449 4.422l.031.058c1.04 1.769 1.654 3.896 1.654 6.166 0 5.406-3.483 10-8.327 11.658l-.087.026c-.063.02-.135.031-.209.031-.162 0-.312-.054-.433-.144l.002.001c-.128-.115-.208-.281-.208-.466 0-.005 0-.01 0-.014v.001q0-.048.008-1.226t.008-2.154c.007-.075.011-.161.011-.249 0-.792-.323-1.508-.844-2.025.618-.061 1.176-.163 1.718-.305l-.076.017c.573-.16 1.073-.373 1.537-.642l-.031.017c.508-.28.938-.636 1.292-1.058l.006-.007c.372-.476.663-1.036.84-1.645l.009-.035c.209-.683.329-1.468.329-2.281 0-.045 0-.091-.001-.136v.007c0-.022.001-.047.001-.072 0-1.248-.482-2.383-1.269-3.23l.003.003c.168-.44.265-.948.265-1.479 0-.649-.145-1.263-.404-1.814l.011.026c-.115-.022-.246-.035-.381-.035-.334 0-.649.078-.929.216l.012-.005c-.568.21-1.054.448-1.512.726l.038-.022-.609.384c-.922-.264-1.981-.416-3.075-.416s-2.153.152-3.157.436l.081-.02q-.256-.176-.681-.433c-.373-.214-.814-.421-1.272-.595l-.066-.022c-.293-.154-.64-.244-1.009-.244-.124 0-.246.01-.364.03l.013-.002c-.248.524-.393 1.139-.393 1.788 0 .531.097 1.04.275 1.509l-.01-.029c-.785.844-1.266 1.979-1.266 3.227 0 .025 0 .051.001.076v-.004c-.001.039-.001.084-.001.13 0 .809.12 1.591.344 2.327l-.015-.057c.189.643.476 1.202.85 1.693l-.009-.013c.354.435.782.793 1.267 1.062l.022.011c.432.252.933.465 1.46.614l.046.011c.466.125 1.024.227 1.595.284l.046.004c-.431.428-.718 1-.784 1.638l-.001.012c-.207.101-.448.183-.699.236l-.021.004c-.256.051-.549.08-.85.08-.022 0-.044 0-.066 0h.003c-.394-.008-.756-.136-1.055-.348l.006.004c-.371-.259-.671-.595-.881-.986l-.007-.015c-.198-.336-.459-.614-.768-.827l-.009-.006c-.225-.169-.49-.301-.776-.38l-.016-.004-.32-.048c-.023-.002-.05-.003-.077-.003-.14 0-.273.028-.394.077l.007-.003q-.128.072-.08.184c.039.086.087.16.145.225l-.001-.001c.061.072.13.135.205.19l.003.002.112.08c.283.148.516.354.693.603l.004.006c.191.237.359.505.494.792l.01.024.16.368c.135.402.38.738.7.981l.005.004c.3.234.662.402 1.057.478l.016.002c.33.064.714.104 1.106.112h.007c.045.002.097.002.15.002.261 0 .517-.021.767-.062l-.027.004.368-.064q0 .609.008 1.418t.008.873v.014c0 .185-.08.351-.208.466h-.001c-.119.089-.268.143-.431.143-.075 0-.147-.011-.214-.032l.005.001c-4.929-1.689-8.409-6.283-8.409-11.69 0-2.268.612-4.393 1.681-6.219l-.032.058c1.094-1.871 2.609-3.386 4.422-4.449l.058-.031c1.739-1.034 3.835-1.645 6.073-1.645h.098-.005zm-7.64 17.666q.048-.112-.112-.192-.16-.048-.208.032-.048.112.112.192.144.096.208-.032zm.497.545q.112-.08-.032-.256-.16-.144-.256-.048-.112.08.032.256.159.157.256.047zm.48.72q.144-.112 0-.304-.128-.208-.272-.096-.144.08 0 .288t.272.112zm.672.673q.128-.128-.064-.304-.192-.192-.32-.048-.144.128.064.304.192.192.32.044zm.913.4q.048-.176-.208-.256-.24-.064-.304.112t.208.24q.24.097.304-.096zm1.009.08q0-.208-.272-.176-.256 0-.256.176 0 .208.272.176.256.001.256-.175zm.929-.16q-.032-.176-.288-.144-.256.048-.224.24t.288.128.225-.224z" />
    </svg>
  );
}

function McpLogoMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path
        d="M18 84.8528L85.8822 16.9706C95.2548 7.59798 110.451 7.59798 119.823 16.9706V16.9706C129.196 26.3431 129.196 41.5391 119.823 50.9117L68.5581 102.177"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M69.2652 101.47L119.823 50.9117C129.196 41.5391 144.392 41.5391 153.765 50.9117L154.118 51.2652C163.491 60.6378 163.491 75.8338 154.118 85.2063L92.7248 146.6C89.6006 149.724 89.6006 154.789 92.7248 157.913L105.331 170.52"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M102.853 33.9411L52.6482 84.1457C43.2756 93.5183 43.2756 108.714 52.6482 118.087V118.087C62.0208 127.459 77.2167 127.459 86.5893 118.087L136.794 67.8822"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProjectsExpandableList({ projects }: ProjectsExpandableListProps) {
  const [active, setActive] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const preloadedScreenshotUrls = useRef<Set<string>>(new Set());

  const getImageSrc = (src: NonNullable<Project["screenshotSrc"]>) => (typeof src === "string" ? src : src.src);

  const chipBaseClass =
    "inline-flex h-8 items-center rounded-full border px-3 text-sm leading-none whitespace-nowrap";
  const neutralChipClass =
    "border-[#c6c6c6] bg-[#ececec] text-[#6f6f6f] dark:border-[#4e4e4e] dark:bg-[#2a2a2a] dark:text-[#c3c3c3]";
  const githubChipClass =
    "border border-[#c6c6c6] bg-[#ececec] text-foreground transition-colors hover:bg-[#dfdfdf] dark:border-[#4e4e4e] dark:bg-[#2a2a2a] dark:hover:bg-[#333333]";
  const starsChipClass =
    "border-[#d0ab2a] bg-[#f5cf49] text-[#5f4300] dark:border-[#c7a633] dark:bg-[#6b5713] dark:text-[#f3e2a5]";
  const liveChipClass =
    "border-[#a9c790] bg-[#d9e8cf] text-[#2f6a18] hover:bg-[#cfe1c2] dark:border-[#4f7a3c] dark:bg-[#1f3920] dark:text-[#9ed18f] dark:hover:bg-[#274828]";

  useOutsideClick(modalRef, () => setActive(null));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    if (active) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.setProperty("--scrollbar-compensation", `${scrollbarWidth}px`);
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "";
      document.body.style.setProperty("--scrollbar-compensation", "0px");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;

    if (connection?.saveData || connection?.effectiveType === "2g") {
      return;
    }

    const screenshotSources = projects.flatMap((project) => (project.screenshotSrc ? [getImageSrc(project.screenshotSrc)] : []));
    if (!screenshotSources.length) {
      return;
    }

    const buildOptimizedImageUrl = (src: string, width: number, quality: number) =>
      `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;

    const preloadScreenshots = () => {
      screenshotSources.forEach((src) => {
        [828, 1200].forEach((width) => {
          const optimizedUrl = buildOptimizedImageUrl(src, width, 60);
          if (preloadedScreenshotUrls.current.has(optimizedUrl)) {
            return;
          }

          const img = new window.Image();
          img.decoding = "async";
          img.src = optimizedUrl;
          preloadedScreenshotUrls.current.add(optimizedUrl);
        });
      });
    };

    if ("requestIdleCallback" in window) {
      const idleCallbackId = window.requestIdleCallback(preloadScreenshots, { timeout: 2000 });
      return () => window.cancelIdleCallback(idleCallbackId);
    }

    const timeoutId = globalThis.setTimeout(preloadScreenshots, 600);
    return () => globalThis.clearTimeout(timeoutId);
  }, [projects]);

  const platformLabel = (kind: ProjectKind) =>
    kind === "mcp" ? "Model Context Protocol Server" : kind === "mobile" ? "Mobile App" : "Web App";

  const actionChips = (project: Project, small = false) => (
    <>
      <span className="group relative inline-flex">
        <span
          className={small ? `inline-flex h-7 w-7 items-center justify-center rounded-2xl ${githubChipClass}` : `${chipBaseClass} ${neutralChipClass}`}
          aria-label={platformLabel(project.kind)}
          title={platformLabel(project.kind)}
        >
          {project.kind === "mcp" ? (
            <McpLogoMark className={small ? "h-3.5 w-3.5 shrink-0" : "mr-1.5 h-3.5 w-3.5 shrink-0"} />
          ) : null}
          {project.kind === "mobile" ? <Smartphone className={small ? "h-3.5 w-3.5" : "mr-1.5 h-3.5 w-3.5"} aria-hidden="true" /> : null}
          {project.kind === "web" ? <Laptop className={small ? "h-3.5 w-3.5" : "mr-1.5 h-3.5 w-3.5"} aria-hidden="true" /> : null}
          {!small ? project.tag : null}
        </span>
        <span className="pointer-events-none absolute top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md bg-foreground px-2 py-1 text-[11px] leading-none whitespace-nowrap text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          {platformLabel(project.kind)}
        </span>
      </span>
      <a
        href={`https://github.com/Janjs/${project.github}`}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center rounded-2xl ${githubChipClass} ${small ? "h-7 w-7" : "h-8 w-8"}`}
        aria-label={`Open ${project.name} on GitHub`}
      >
        <GithubMark className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </a>
      {project.stars ? (
        <span
          className={
            small
              ? `inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs leading-none whitespace-nowrap ${starsChipClass}`
              : `${chipBaseClass} gap-1.5 ${starsChipClass}`
          }
        >
          <Star className={small ? "h-3 w-3 fill-current" : "h-3.5 w-3.5 fill-current"} />
          {project.stars}
        </span>
      ) : null}
      {project.liveUrl ? (
        <LiveProjectButton
          href={project.liveUrl}
          className={`${small ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-sm"} font-medium ${liveChipClass}`}
        />
      ) : null}
    </>
  );

  return (
    <>
      <div className="w-full">
        {projects.map((project, index) => (
          <div key={project.github}>
            <motion.div
              layoutId={`project-card-${project.github}`}
              className="relative py-3 transition-colors hover:bg-accent/20 sm:py-4"
              onClick={() => setActive(project)}
            >
              <div className="relative z-10 flex cursor-pointer items-center gap-2.5">
                <motion.div
                  layoutId={`project-icon-${project.github}`}
                  className={`h-9 w-9 shrink-0 overflow-hidden rounded-lg sm:h-10 sm:w-10 ${project.iconWrapperClass ?? ""}`}
                >
                  {project.iconText ? (
                    <span className="flex h-full w-full items-center justify-center text-lg sm:text-xl" aria-hidden="true">
                      {project.darkIconText ? (
                        <>
                          <span className="dark:hidden">{project.iconText}</span>
                          <span className="hidden dark:inline">{project.darkIconText}</span>
                        </>
                      ) : (
                        project.iconText
                      )}
                    </span>
                  ) : (
                    <Image
                      src={project.iconSrc!}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>

                <motion.div
                  layoutId={`project-title-${project.github}`}
                  className="min-w-0 flex-1 truncate text-sm leading-tight font-medium sm:text-xl sm:tracking-[-0.01em]"
                >
                  {project.name}
                </motion.div>

                <div className="hidden shrink-0 items-center gap-1.5 sm:flex" onClick={(event) => event.stopPropagation()}>
                  {actionChips(project)}
                </div>

                <div className="flex items-center gap-1.5 sm:hidden" onClick={(event) => event.stopPropagation()}>
                  {actionChips(project, true)}
                </div>
              </div>
            </motion.div>
            {index < projects.length - 1 ? <Separator /> : null}
          </div>
        ))}
        <Separator />
      </div>

      {typeof window !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {active ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/30"
                  />
                  <div className="fixed inset-0 z-[60] grid place-items-center p-4">
                    <motion.div
                      ref={modalRef}
                      layoutId={`project-card-${active.github}`}
                      className="w-full max-w-3xl overflow-hidden rounded-2xl border bg-background shadow-2xl"
                    >
                      <div className="max-h-[90vh] overflow-y-auto p-3 sm:p-4">
                        <div className="mb-3 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setActive(null)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted"
                            aria-label="Close expanded project"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="overflow-hidden rounded-lg border bg-background">
                            {active.screenshotSrc ? (
                              <motion.div layoutId={`project-image-${active.github}`}>
                                <Image
                                  src={active.screenshotSrc}
                                  alt={`${active.name} screenshot`}
                                  width={typeof active.screenshotSrc === "string" ? 1200 : active.screenshotSrc.width}
                                  height={typeof active.screenshotSrc === "string" ? 675 : active.screenshotSrc.height}
                                  quality={60}
                                  sizes="(max-width: 768px) 100vw, 768px"
                                  loading="eager"
                                  className="h-auto w-full"
                                />
                              </motion.div>
                            ) : (
                              <div className="flex aspect-[16/9] w-full items-center justify-center text-sm text-muted-foreground">
                                Add screenshot in project data
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <motion.div
                                layoutId={`project-icon-${active.github}`}
                                className={`h-8 w-8 shrink-0 overflow-hidden rounded-lg sm:h-9 sm:w-9 ${active.iconWrapperClass ?? ""}`}
                              >
                                {active.iconText ? (
                                  <span className="flex h-full w-full items-center justify-center text-base" aria-hidden="true">
                                    {active.darkIconText ? (
                                      <>
                                        <span className="dark:hidden">{active.iconText}</span>
                                        <span className="hidden dark:inline">{active.darkIconText}</span>
                                      </>
                                    ) : (
                                      active.iconText
                                    )}
                                  </span>
                                ) : (
                                  <Image
                                    src={active.iconSrc!}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-contain"
                                    aria-hidden="true"
                                  />
                                )}
                              </motion.div>
                              <motion.p layoutId={`project-title-${active.github}`} className="text-sm font-semibold sm:text-base">
                                {active.name}
                              </motion.p>
                            </div>

                            <div className="hidden flex-wrap items-center justify-end gap-1.5 sm:flex">{actionChips(active)}</div>
                            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:hidden">{actionChips(active, true)}</div>
                          </div>

                          <p className="text-sm leading-relaxed text-muted-foreground">{active.description}</p>

                          <div className="flex flex-wrap gap-1.5">
                            {active.techStack.map((tech) => (
                              <span
                                key={`${active.github}-${tech}`}
                                className="inline-flex h-7 items-center rounded-full border border-border bg-background px-2.5 text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
