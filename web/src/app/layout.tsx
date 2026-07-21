import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { DotField } from "@/components/layout/DotField";
import { AmbientGlow } from "@/components/layout/AmbientGlow";
import { ScrollPointerGate } from "@/components/layout/ScrollPointerGate";
import { seo } from "@/content/messages";

// Default (English) metadata per spec 004 §2 — the root layout is shared by
// every locale route (spec 006), so it can't itself be locale-aware; this is
// the fallback until each route's own generateMetadata() (spec 006 Phase 2)
// overrides title/description/canonical/hreflang per locale. Nav and
// PersonJsonLd moved to LocaleLayout (spec 006) since they need t()/locale
// to already be set, which this shared layout can't provide per-route.
export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title.en,
  description: seo.description.en,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seo.title.en,
    description: seo.description.en,
    url: seo.url,
    siteName: seo.title.en,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title.en,
    description: seo.description.en,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang="en" is a Phase 1 simplification (spec 006) — per-route <html lang>
  // needs middleware or a per-locale root, deferred to Phase 2 alongside the
  // rest of real per-locale metadata.
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ScrollPointerGate />
        {/* Fixed background paint (z-0), behind content. */}
        <DotField />
        <AmbientGlow />
        {/* Content sits above the background layers. #top anchors the
            wordmark. Nav/PersonJsonLd render inside {children} now, via each
            route's LocaleLayout — see that component for why. */}
        <div id="top" className="relative z-10 flex min-h-svh flex-col">
          {/* Nav's scroll-detach sentinel (spec 002 §4.1): a zero-visual
              marker at the very top of scrollable content. Nav observes it
              via IntersectionObserver, same pattern Dock uses for
              #hero-console — no raw scroll-position polling. */}
          <div id="nav-sentinel" aria-hidden className="h-px w-full" />
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
