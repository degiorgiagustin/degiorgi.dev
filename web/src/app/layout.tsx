import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { DotField } from "@/components/layout/DotField";
import { AmbientGlow } from "@/components/layout/AmbientGlow";
import { Nav } from "@/components/layout/Nav";

// Minimal metadata (spec 002 §6). Remaining SEO artifacts are the deferred
// deployment effort (§7).
export const metadata: Metadata = {
  title: "Agustín De Giorgi — Software Engineer",
  description:
    "Software engineer building banking-grade systems that move money and AI that shows its work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* Fixed background paint (z-0), behind content. */}
        <DotField />
        <AmbientGlow />
        <Nav />
        {/* Content sits above the background layers. #top anchors the wordmark. */}
        <div id="top" className="relative z-10 flex min-h-svh flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
