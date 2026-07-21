import type { Locale } from "@/lib/i18n/locale";
import { Contact } from "@/components/contact/Contact";
import { Hero } from "@/components/hero/Hero";
import { Timeline } from "@/components/journey/Timeline";
import { Work } from "@/components/work/Work";
import { Stack } from "@/components/stack/Stack";
import { DockMount } from "@/components/console/DockMount";

// Home — composes the single-page sections top to bottom (spec 002 §4).
// The dock is a fixed overlay outside the section flow (spec 003 §3);
// Contact's bottom padding reserves its clearance. Shared by both locale
// routes (spec 006) — app/(main)/page.tsx and app/es/page.tsx each render
// this with their own literal `locale`, threaded down explicitly to every
// section (no shared/hidden locale state — see lib/i18n/locale.ts).
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <main className="flex flex-1 flex-col">
      <Hero locale={locale} />
      <Timeline locale={locale} />
      <Work locale={locale} />
      <Stack locale={locale} />
      <Contact locale={locale} />
      <DockMount locale={locale} />
    </main>
  );
}
