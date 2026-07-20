"use client";

import { useEffect } from "react";

const SETTLE_MS = 150;

/*
 * Toggles the `is-scrolling` class on <body> while a scroll is in progress
 * (globals.css consumes it to suspend pointer-events on <main> — see the
 * comment there and docs/adr/006-scroll-rendering-cost.md). No visual
 * output; mounted once at the root.
 */
export function ScrollPointerGate() {
  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      document.body.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, SETTLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      document.body.classList.remove("is-scrolling");
    };
  }, []);

  return null;
}
