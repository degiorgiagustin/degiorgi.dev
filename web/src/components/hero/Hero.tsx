import { hero } from "@/content/messages";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradientHeadline } from "@/components/hero/GradientHeadline";

// Hero — first viewport (spec 002 §4.2). Server component (no interactivity).
// Layout is height-aware for short screens (e.g. iPhone SE, 375×667): the main
// content centers in the space above a bottom-pinned scroll hint, and the
// reserved console slot shrinks on small viewports so nothing overflows the
// fold. pt-16 clears the fixed nav (h-14).
export function Hero() {
  return (
    <section className="flex min-h-svh flex-col px-4 pt-16 pb-8 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="stage">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </div>

        <GradientHeadline
          lead={hero.headline.lead}
          accent={hero.headline.accent}
          className="stage stage-2"
        />

        <p className="stage stage-3 leading-body text-text-2 max-w-2xl text-base text-pretty">
          {hero.subline}
        </p>

        {/*
         * Reserved console slot (spec 002 §4.2 / spec 003). Empty in this shell;
         * spec 003 mounts the interactive console here. The min-height reserves
         * its footprint (limits CLS on mount) but scales down on short screens
         * so it never pushes the scroll hint below the fold. Final sizing is
         * revisited when 003 lands its own responsive console.
         */}
        <div
          aria-hidden
          data-console-slot
          className="stage stage-4 min-h-32 w-full max-w-2xl sm:min-h-48 lg:min-h-56"
        />
      </div>

      {/* Scroll hint pinned to the bottom of the first viewport. */}
      <a
        href="#journey"
        className="stage stage-5 text-text-3 hover:text-text-2 tracking-label mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-center font-mono text-xs uppercase"
      >
        <span>{hero.scrollHint}</span>
        <span aria-hidden className="animate-drift">
          ↓
        </span>
      </a>
    </section>
  );
}
