"use client";

import { useEffect, useState } from "react";
import { site, nav } from "@/content/messages";
import { StatusPill } from "@/components/ui/StatusPill";

// Fixed glass navigation bar (spec 002 §4.1, prototype composition). "use
// client": detaches into a floating pill once scrolled, via an
// IntersectionObserver on #nav-sentinel (layout.tsx) — same pattern as
// Dock's #hero-console observer, not raw scroll-position polling. Content
// (wordmark/links/status pill) is identical in both states; only the
// container morphs. One backdrop-blur layer either way (3-blur budget).
// Three zones: wordmark left, anchor links center (desktop only), status
// right. Mobile (<sm): wordmark + status dot only — links are in-page anchors
// reachable by scrolling, so no hamburger in this phase.
// Both states anchor left-1/2 + -translate-x-1/2 — a shared, constant
// centering mechanism (spec 002 §4.1). Only width (symmetric, from that
// fixed center) and top actually animate; nothing ever slides sideways.
const baseClass =
  "fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300";
const restClass = "bg-bg/60 border-line top-0 w-full border-b backdrop-blur-lg";
const floatClass =
  "nav-float border-line-strong bg-glass shadow-panel inset-shadow-bevel rounded-pill border backdrop-blur-lg";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    // Positive rootMargin grows the detection area 24px above the real
    // viewport, giving a real buffer before triggering. A negative value
    // here (the original bug) shrinks it instead, so the sentinel reads as
    // "already scrolled past" the instant the page loads — the pill would
    // never show its resting state or animate the conversion at all.
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "24px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`${baseClass} ${scrolled ? floatClass : restClass}`}>
      <nav
        className={`mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 transition-[height] duration-300 sm:px-6 ${scrolled ? "h-12" : "h-14"}`}
      >
        <a
          href="#top"
          className="text-text justify-self-start font-mono text-sm font-medium"
        >
          {site.wordmark.name}
          <span className="text-text-3">{site.wordmark.tld}</span>
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-text-2 hover:text-text inline-flex min-h-11 items-center text-sm transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-3 justify-self-end">
          <StatusPill label={site.status} />
        </div>
      </nav>
    </header>
  );
}
