"use client";

import { useEffect, useState } from "react";
import { site, nav, contact, links } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";
import { Icon } from "@/components/stack/Icon";
import { IconLink } from "@/components/ui/IconLink";
import { GlobeIcon } from "@/components/ui/icons";

// Fixed glass navigation bar (spec 002 §4.1, prototype composition). "use
// client": detaches into a floating pill once scrolled, via an
// IntersectionObserver on #nav-sentinel (layout.tsx) — same pattern as
// Dock's #hero-console observer, not raw scroll-position polling. Content
// (wordmark/links/social icons) is identical in both states; only the
// container morphs. One backdrop-blur layer either way (3-blur budget).
// Three zones: wordmark left, anchor links center (desktop only), social
// icons then language switch right, in that order (LinkedIn/GitHub/X
// replaced the status pill, which read as a stray "open to work" signal
// even after its copy was fixed in spec 005; direct links are just more
// useful here). Mobile (<sm): wordmark + icons, nav links hidden — they're
// in-page anchors reachable by scrolling, so no hamburger in this phase.
// Both states anchor left-1/2 + -translate-x-1/2 — a shared, constant
// centering mechanism (spec 002 §4.1). Only width (symmetric, from that
// fixed center) and top actually animate; nothing ever slides sideways.
const baseClass =
  "fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300";
const restClass = "bg-bg/60 border-line top-0 w-full border-b backdrop-blur-lg";
const floatClass =
  "nav-float border-line-strong bg-glass shadow-panel inset-shadow-bevel rounded-pill border backdrop-blur-lg";

// Language switch is a plain link, not client state (spec 006 §2: URL-based
// routing) — swapping locale is just navigating to the other route tree.
// /es isn't linked from the sitemap/production nav yet (Phase 2, real
// content), but the owner needs a way to actually reach and test it now.
// Shows BOTH options (current highlighted, static; other a live link) —
// showing only the target language was ambiguous (read as "this is the
// current language," not "click to switch to this").
const localeHref: Record<Locale, string> = { en: "/", es: "/es" };

export function Nav({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    // Positive rootMargin grows the detection area 24px above the real
    // viewport, giving a real buffer before triggering. A negative value
    // here reads the sentinel as "already scrolled past" the instant the
    // page loads — the pill would never show its resting state or animate
    // the conversion at all.
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
                {t(link.label, locale)}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center justify-self-end">
          <IconLink
            href={t(links.linkedin, locale)}
            label={t(contact.cta.linkedin, locale)}
            external
            icon={<Icon slug="linkedin" className="size-4" />}
          />
          <IconLink
            href={links.github}
            label={t(contact.cta.github, locale)}
            external
            icon={<Icon slug="github" className="size-4" />}
          />
          <IconLink
            href={links.x}
            label={t(contact.cta.x, locale)}
            external
            icon={<Icon slug="x" className="size-4" />}
          />
          <a
            href={locale === "en" ? localeHref.es : localeHref.en}
            title={locale === "en" ? "Switch to Spanish" : "Switch to English"}
            aria-label={
              locale === "en" ? "Switch to Spanish" : "Switch to English"
            }
            className="text-text-3 hover:text-gold ml-1 inline-flex min-h-11 items-center gap-1 font-mono text-xs uppercase transition-colors"
          >
            <GlobeIcon className="size-3.5" aria-hidden />
            {locale}
          </a>
        </div>
      </nav>
    </header>
  );
}
