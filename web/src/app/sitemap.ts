import type { MetadataRoute } from "next";
import { seo } from "@/content/messages";

// Single-page site (Phase 1): one entry for the root. Extend when the
// content phase (spec 000 §4, Phase 2) adds case-study routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: seo.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
