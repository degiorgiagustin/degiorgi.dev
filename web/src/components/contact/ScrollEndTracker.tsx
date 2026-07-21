"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

// Fires once when the visitor scrolls far enough to see the Contact
// section's actual content (spec 005). A bare measurement sentinel, not a
// Reveal-style visual reveal — renders nothing itself, unobserves after the
// first hit so it can't fire twice in one visit.
export function ScrollEndTracker() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("scroll_end");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <span ref={ref} aria-hidden className="block h-px" />;
}
