import { links, seo } from "@/content/messages";
import { t, type Locale } from "@/lib/i18n/locale";

// Server component: renders as static inline HTML, zero client JS cost.
// dangerouslySetInnerHTML is the standard Next.js pattern for JSON-LD — the
// payload is fully static site content, never user input.
export function PersonJsonLd({ locale }: { locale: Locale }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seo.person.name,
    jobTitle: t(seo.person.jobTitle, locale),
    url: seo.url,
    sameAs: [t(links.linkedin, locale), links.github, links.x],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
