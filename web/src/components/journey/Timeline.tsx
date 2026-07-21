"use client";

// Journey timeline (spec 002 §4.3). "use client": owns a scroll listener that
// drives the gold progress rail and lights each node when it crosses 55% of the
// viewport. rAF-throttled; no GSAP (Phase 1 constraint). Reduced motion renders
// the final state (rail filled, all nodes lit) with no listener.
import { useEffect, useRef } from "react";
import { journey } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { PageSection } from "@/components/layout/PageSection";
import { SectionHead } from "@/components/layout/SectionHead";
import { TimelineStep } from "@/components/journey/TimelineStep";

export function Timeline({ locale }: { locale: Locale }) {
  const railRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!rail || !fill) return;
    const steps = stepRefs.current.filter(
      (s): s is HTMLLIElement => s !== null,
    );

    // Reduced motion: skip the listener, render the final state directly.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.style.setProperty("--fill", "100%");
      steps.forEach((step) => step.setAttribute("data-lit", "true"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.55; // spec 002 §4.3
      // All reads before any write: interleaving them (as the previous
      // version did, one getBoundingClientRect() per step right before its
      // own setAttribute()) forces the browser to flush layout on every
      // iteration instead of once per frame.
      const railBox = rail.getBoundingClientRect();
      const stepTops = steps.map((step) => step.getBoundingClientRect().top);
      const filled = Math.min(
        Math.max(threshold - railBox.top, 0),
        railBox.height,
      );
      // Dynamic runtime value passed as a CSS custom property (sanctioned
      // exception to the no-inline-style rule); consumed by .timeline-fill.
      fill.style.setProperty("--fill", `${filled}px`);
      steps.forEach((step, i) => {
        step.setAttribute(
          "data-lit",
          stepTops[i] <= threshold ? "true" : "false",
        );
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Only track scroll while the timeline is near the viewport — this
    // listener previously ran globally, paying for a getBoundingClientRect()
    // per step on every scroll frame anywhere on the page, including while
    // scrolling through unrelated sections.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      // Pre-warm 200px before the rail enters from below (avoids a visible
      // pop on first paint), but detach the instant it exits at the top —
      // symmetric margins here left the listener attached ~200px into the
      // next section (Work), overlapping that section's own scroll cost.
      { rootMargin: "0px 0px 200px 0px" },
    );
    observer.observe(rail);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <PageSection
      id="journey"
      className="py-24 lg:grid lg:grid-cols-3 lg:gap-12"
    >
      {/* Desktop: sticky header column beside the timeline; mobile: on top. */}
      <SectionHead
        eyebrow={{
          index: journey.eyebrow.index,
          label: t(journey.eyebrow.label, locale),
        }}
        headline={t(journey.headline, locale)}
        subline={t(journey.subline, locale)}
        className="mb-10 lg:sticky lg:top-24 lg:col-span-1 lg:mb-0 lg:self-start"
      />

      <ol className="relative lg:col-span-2">
        {/* Rail track + gold progress fill, centered on the node column. */}
        <span
          ref={railRef}
          aria-hidden
          className="bg-line absolute top-1.5 bottom-1.5 left-3 w-px -translate-x-1/2"
        >
          <span
            ref={fillRef}
            className="timeline-fill from-gold to-gold/35 shadow-glow-gold absolute inset-x-0 top-0 block bg-gradient-to-b"
          />
        </span>

        {journey.steps.map((step, i) => (
          <li
            key={`${step.period}-${i}`}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="group relative pb-14 pl-8 last:pb-0"
          >
            {/* Node — lights gold with a glow once its step passes the threshold. */}
            <span
              aria-hidden
              className="border-text-3 bg-bg group-data-[lit=true]:border-gold group-data-[lit=true]:bg-gold group-data-[lit=true]:shadow-glow-gold-strong rounded-pill absolute top-1.5 left-3 size-2.5 -translate-x-1/2 border transition-all duration-400"
            />
            <TimelineStep
              period={step.period}
              role={t(step.role, locale)}
              org={step.org}
              narrative={t(step.narrative, locale)}
              tags={step.tags}
            />
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
