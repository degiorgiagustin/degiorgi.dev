import { seo } from "@/content/messages";
import { renderOgImage, ogImageSize } from "@/lib/og/render";

// Spanish counterpart to app/opengraph-image.tsx (spec 006 §7). Same
// renderOgImage() helper, just the other locale — see that file for the
// shared rendering logic.
export const runtime = "nodejs";
export const alt = seo.title.es;
export const size = ogImageSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("es");
}
