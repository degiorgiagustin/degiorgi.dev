import { hero } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradientHeadline } from "@/components/hero/GradientHeadline";
import { HeroConsole } from "@/components/console/HeroConsole";

// Hero — first viewport (spec 002 §4.2). Server component itself: the
// console mounts through its own client island. Layout is height-aware for
// short screens (e.g. iPhone SE, 375×667): the main content centers in the
// space above a bottom-pinned scroll hint. pt-16 clears the fixed nav (h-14).
export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="section-cv flex min-h-svh flex-col px-4 pt-16 pb-8 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="stage">
          <Eyebrow>{t(hero.eyebrow, locale)}</Eyebrow>
        </div>

        <GradientHeadline
          lead={t(hero.headline.lead, locale)}
          accent={t(hero.headline.accent, locale)}
          className="stage stage-2"
        />

        <p className="stage stage-3 leading-body text-text-2 max-w-2xl text-base text-pretty">
          {t(hero.subline, locale)}
        </p>

        {/*
         * Console (spec 003 §2). The wrapper id anchors the dock's
         * IntersectionObserver (spec 003 §3); width per prototype
         * min(640px, 100%). The facsimile inside the island reserves the
         * exact final footprint, so no min-height is needed anymore.
         */}
        <div id="hero-console" className="stage stage-4 w-full max-w-160">
          <HeroConsole locale={locale} />
        </div>
      </div>

      {/* Scroll hint pinned to the bottom of the first viewport. */}
      <a
        href="#journey"
        className="stage stage-5 text-text-3 hover:text-text-2 tracking-label mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-center font-mono text-xs uppercase"
      >
        <span>{t(hero.scrollHint, locale)}</span>
        <span aria-hidden className="animate-drift">
          ↓
        </span>
      </a>
    </section>
  );
}
