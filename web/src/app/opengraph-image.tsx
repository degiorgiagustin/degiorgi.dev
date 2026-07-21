import { seo } from "@/content/messages";
import { renderOgImage, ogImageSize } from "@/lib/og/render";

// Prerendered once at build (no dynamic params) — the spec 004 §2 "static
// placeholder" OG/Twitter card. English route; see app/es/opengraph-image.tsx
// for the Spanish counterpart. Both call the shared renderOgImage() helper
// (spec 006 §7) — this file only declares the route-segment exports Next.js
// requires per convention.
export const runtime = "nodejs";
export const alt = seo.title.en;
export const size = ogImageSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("en");
}
