import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { DotField } from "@/components/layout/DotField";
import { AmbientGlow } from "@/components/layout/AmbientGlow";
import { Nav } from "@/components/layout/Nav";
import { ScrollPointerGate } from "@/components/layout/ScrollPointerGate";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { seo } from "@/content/messages";

// Full metadata per spec 004 §2: canonical URL, OG/Twitter card (image comes
// from the app/opengraph-image.tsx file convention), JSON-LD Person below.
export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: seo.url,
    siteName: seo.title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <PersonJsonLd />
        <ScrollPointerGate />
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
