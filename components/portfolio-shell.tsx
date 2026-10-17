"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const sections = [
  ["about", "About me"],
  ["projects", "Selected projects"],
  ["moments", "Outside the computer"],
  ["skills", "Skills"],
  ["elsewhere", "Elsewhere"],
];

export function PortfolioShell({ sidebar, footer, children }: { sidebar: ReactNode; footer: ReactNode; children: ReactNode }) {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const pendingSection = useRef<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileHighlightRef = useRef<HTMLSpanElement>(null);

  const goToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    pendingSection.current = id;
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start", inline: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  useLayoutEffect(() => {
    const updateHighlight = (nav: HTMLElement | null, highlight: HTMLSpanElement | null) => {
      if (!nav || !highlight) return;
      const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (!link) return;
      highlight.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
      highlight.style.width = `${link.offsetWidth}px`;
      highlight.style.height = `${link.offsetHeight}px`;
    };
    const updateHighlights = () => {
      updateHighlight(navRef.current, highlightRef.current);
      updateHighlight(mobileNavRef.current, mobileHighlightRef.current);
    };
    updateHighlights();
    const observer = new ResizeObserver(updateHighlights);
    [navRef.current, mobileNavRef.current].forEach(nav => {
      if (!nav) return;
      observer.observe(nav);
      nav.querySelectorAll("a").forEach(link => observer.observe(link));
    });
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const stream = document.querySelector(".portfolio-stream");
    const update = () => {
      setScrolled(window.scrollY > 48);
      const desktop = window.matchMedia("(min-width: 701px)").matches;
      const edge = desktop ? stream?.getBoundingClientRect().left ?? 0 : 100;
      if (pendingSection.current) return;
      const closest = sections.reduce((best, [id]) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        const distance = rect ? Math.abs((desktop ? rect.left : rect.top) - edge) : Infinity;
        return distance < best.distance ? { id, distance } : best;
      }, { id: "about", distance: Infinity });
      setActive(closest.id);
    };
    const cancelPending = () => { pendingSection.current = null; };
    window.addEventListener("wheel", cancelPending, { passive: true });
    window.addEventListener("touchstart", cancelPending, { passive: true });
    stream?.addEventListener("pointerdown", cancelPending);
    window.addEventListener("keydown", cancelPending);
    update();
    stream?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("wheel", cancelPending);
      window.removeEventListener("touchstart", cancelPending);
      stream?.removeEventListener("pointerdown", cancelPending);
      window.removeEventListener("keydown", cancelPending);
      stream?.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="portfolio">
      <a className="skip-link" href="#about">Skip to content</a>
      <header className={`mobile-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mobile-header-top">
          <strong className="mobile-header-name"><a href="#intro">Jan Serra</a></strong>
          <div className="mobile-header-actions">
            <ThemeToggle orientation="horizontal" />
          </div>
        </div>
      </header>
      <aside className="portfolio-sidebar">
        {sidebar}
        <nav ref={navRef} aria-label="Page sections">
          <span ref={highlightRef} className="sidebar-highlight" aria-hidden="true" />
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={event => goToSection(event, id)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">{footer}</div>
      </aside>
      <nav ref={mobileNavRef} className="mobile-section-nav" aria-label="Page sections">
        <span ref={mobileHighlightRef} className="sidebar-highlight" aria-hidden="true" />
        {sections.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={event => goToSection(event, id)}>{label}</a>)}
      </nav>
      <main className="portfolio-stream" aria-label="Portfolio sections">{children}</main>
      <button className={`scroll-top mobile-scroll-top ${scrolled ? "is-visible" : ""}`} type="button" tabIndex={scrolled ? 0 : -1} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>
        <ArrowUp size={18} aria-hidden="true" /><span>Back to top</span>
      </button>
    </div>
  );
}
