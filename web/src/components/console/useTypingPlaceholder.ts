import { useEffect, useState } from "react";

// Prototype cadence: type 34ms/char, hold 2.2s, delete 12ms/char, 300ms gap.
const TYPE_MS = 34;
const DELETE_MS = 12;
const HOLD_MS = 2200;
const GAP_MS = 300;

/*
 * Cycling typed placeholder (spec 003 §2). Starts from the full first phrase —
 * the same one the static facsimile shows — so the hydration swap is
 * invisible; under reduced motion it simply stays there.
 */
export function useTypingPlaceholder(phrases: readonly string[]): string {
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phrase = 0;
    let chars = phrases[0].length;
    let deleting = true; // begin by unwinding the initially-shown phrase
    let timer = 0;
    let visible = true;

    const tick = () => {
      if (!visible) return; // resumes from here once the observer below fires
      const current = phrases[phrase];
      if (!deleting && chars < current.length) {
        chars += 1;
        setText(current.slice(0, chars));
        timer = window.setTimeout(tick, TYPE_MS);
      } else if (!deleting) {
        deleting = true;
        timer = window.setTimeout(tick, HOLD_MS);
      } else if (chars > 0) {
        chars -= 1;
        setText(current.slice(0, chars));
        timer = window.setTimeout(tick, DELETE_MS);
      } else {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        timer = window.setTimeout(tick, GAP_MS);
      }
    };

    // Pause the animation while the hero console is scrolled off-screen —
    // no visible text to animate, no reason to keep the main thread busy.
    // Same #hero-console anchor the dock's own IntersectionObserver uses.
    const host = document.getElementById("hero-console");
    const observer = host
      ? new IntersectionObserver(([entry]) => {
          const wasVisible = visible;
          visible = entry.isIntersecting;
          if (visible && !wasVisible) tick();
        })
      : null;
    if (host && observer) observer.observe(host);

    timer = window.setTimeout(tick, HOLD_MS);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [phrases]);

  return text;
}
