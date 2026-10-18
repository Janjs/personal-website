"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ColumnHeading({ id, title }: { id: string; title: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const section = document.getElementById(id);
    const update = () => setScrolled((section?.scrollTop ?? 0) > 48);
    update();
    section?.addEventListener("scroll", update, { passive: true });
    return () => section?.removeEventListener("scroll", update);
  }, [id]);

  return (
    <>
      <div className="column-scroll-top">
      <button className={`scroll-top ${scrolled ? "is-visible" : ""}`} type="button" tabIndex={scrolled ? 0 : -1} aria-label={`Back to top of ${title}`} onClick={() => {
        document.getElementById(id)?.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      }}><ArrowUp size={18} aria-hidden="true" /><span>{title}</span></button>
      </div>
      <header className="column-heading">
        <h2 id={`${id}-title`}>{title}</h2>
      </header>
    </>
  );
}
