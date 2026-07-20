import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site, seo, hero } from "@/content/messages";

// Prerendered once at build (no dynamic params) — the spec 004 §2 "static
// placeholder" OG/Twitter card. Runs through Satori, which renders an
// isolated JSX tree from inline style values only: it never loads
// globals.css, so CSS custom properties and Tailwind classes are inert here.
// The hex values below are the current spec 001 §2 token values, copied
// deliberately — keep them in sync by hand if those tokens change.
export const runtime = "nodejs";
export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDir = join(
  process.cwd(),
  "node_modules/geist/dist/fonts/geist-sans",
);

export default async function OpengraphImage() {
  const [regular, medium] = await Promise.all([
    readFile(join(fontsDir, "Geist-Regular.ttf")),
    readFile(join(fontsDir, "Geist-Medium.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "88px",
        backgroundColor: "#0a0a0c",
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          fontWeight: 400,
          color: "#767b83",
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {site.wordmark.name}
        {site.wordmark.tld}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 500,
          color: "#f2f3f5",
          marginTop: 28,
          letterSpacing: -2,
        }}
      >
        {seo.person.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 34,
          fontWeight: 500,
          color: "#e3b34c",
          marginTop: 12,
        }}
      >
        {seo.person.jobTitle}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 400,
          color: "#9a9fa8",
          marginTop: 36,
          maxWidth: 880,
        }}
      >
        {hero.headline.lead} {hero.headline.accent}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
