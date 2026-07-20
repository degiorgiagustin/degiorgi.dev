import { links, seo } from "@/content/messages";

// Server component: renders as static inline HTML, zero client JS cost.
// dangerouslySetInnerHTML is the standard Next.js pattern for JSON-LD — the
// payload is fully static site content, never user input.
export function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seo.person.name,
    jobTitle: seo.person.jobTitle,
    url: seo.url,
    sameAs: [links.linkedin, links.github, links.x],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
