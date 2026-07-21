import type { Locale } from "@/lib/i18n/locale";
import { Nav } from "@/components/layout/Nav";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";

/*
 * Locale boundary (spec 006). Passes `locale` as a plain prop to Nav and
 * PersonJsonLd — no Context, no shared global (see lib/i18n/locale.ts for
 * why: two more elaborate approaches both failed empirically). {children}
 * (the page) gets its own locale independently from its own route file
 * (app/(main)/page.tsx / app/es/page.tsx) — a layout can't inject props
 * into already-constructed children, so there's no ordering trick needed
 * here at all, just each route file literally knowing its own locale.
 */
export function LocaleLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <PersonJsonLd locale={locale} />
      <Nav locale={locale} />
      {children}
    </>
  );
}
