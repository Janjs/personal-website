"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ColumnHeading({ id, title }: { id: string; title: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const section = document.getElementById(id);
    const update = () => setScrolled(window.matchMedia("(min-width: 701px)").matches
      ? (section?.scrollTop ?? 0) > 48
      : window.scrollY > (section?.offsetTop ?? 0) + 48);
    update();
    section?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      section?.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [id]);

  return (
    <>
      <div className="column-scroll-top">
      <button className={`scroll-top ${scrolled ? "is-visible" : ""}`} type="button" tabIndex={scrolled ? 0 : -1} aria-label={`Back to top of ${title}`} onClick={() => {
        const section = document.getElementById(id);
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
        if (window.matchMedia("(min-width: 701px)").matches) section?.scrollTo({ top: 0, behavior });
        else window.scrollTo({ top: section?.offsetTop ?? 0, behavior });
      }}><ArrowUp size={18} aria-hidden="true" /><span>{title}</span></button>
      </div>
      <header className="column-heading">
        <h2 id={`${id}-title`}>{title}</h2>
      </header>
    </>
  );
}
