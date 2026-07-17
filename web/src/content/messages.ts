/*
 * Single source of truth for ALL user-facing copy, structured content, and
 * external links (spec 002 §2, §8). No copy may be hardcoded in components.
 * English (recruiter-facing); the grouped-export shape keeps a future EN/ES
 * toggle a matter of swapping this module.
 *
 * PLACEHOLDER marks owner-provided data still pending (real timeline dates,
 * email, social URLs, CV). These are content blockers, not build blockers.
 */

export const site = {
  // Split so the TLD can render dimmed, per the prototype wordmark.
  wordmark: { name: "degiorgi", tld: ".dev" },
  status: "Open to senior roles",
} as const;

export const nav = {
  links: [
    { label: "Journey", href: "#journey" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const hero = {
  eyebrow: "Software Engineer · Fintech & AI",
  // Second line renders in gold (spec 002 §4.2).
  headline: {
    lead: "Systems that move money.",
    accent: "AI that shows its work.",
  },
  subline:
    "I build banking-grade Java/Spring systems and production LLM applications. I show the retrieval trace behind every answer.",
  scrollHint: "The journey",
} as const;

export type JourneyStep = {
  period: string;
  role: string;
  org: string;
  narrative: string;
  tags: readonly string[];
};

export const journey = {
  eyebrow: { index: "01", label: "The journey" },
  intro: "Six chapters, from banking-grade systems to production AI.", // DRAFT — owner to review

  // PLACEHOLDER — six steps with owner's real periods/orgs/narratives (spec 002 §4.3).
  steps: [
    {
      period: "PLACEHOLDER",
      role: "PLACEHOLDER — role",
      org: "PLACEHOLDER — organization",
      narrative: "PLACEHOLDER — 1–2 sentence narrative of this chapter.",
      tags: ["PLACEHOLDER"],
    },
    {
      period: "PLACEHOLDER",
      role: "PLACEHOLDER — role",
      org: "PLACEHOLDER — organization",
      narrative: "PLACEHOLDER — 1–2 sentence narrative of this chapter.",
      tags: ["PLACEHOLDER"],
    },
    {
      period: "PLACEHOLDER",
      role: "PLACEHOLDER — role",
      org: "PLACEHOLDER — organization",
      narrative: "PLACEHOLDER — 1–2 sentence narrative of this chapter.",
      tags: ["PLACEHOLDER"],
    },
    {
      period: "PLACEHOLDER",
      role: "PLACEHOLDER — role",
      org: "PLACEHOLDER — organization",
      narrative: "PLACEHOLDER — 1–2 sentence narrative of this chapter.",
      tags: ["PLACEHOLDER"],
    },
    {
      period: "PLACEHOLDER",
      role: "PLACEHOLDER — role",
      org: "PLACEHOLDER — organization",
      narrative: "PLACEHOLDER — 1–2 sentence narrative of this chapter.",
      tags: ["PLACEHOLDER"],
    },
    {
      period: "Now",
      role: "PLACEHOLDER — current role",
      org: "PLACEHOLDER — organization",
      narrative: "PLACEHOLDER — what you are building today.",
      tags: ["PLACEHOLDER"],
    },
  ] satisfies readonly JourneyStep[],
} as const;

export type WorkCard = {
  kind: string;
  title: string;
  summary: string;
  href: string;
};

export const work = {
  eyebrow: { index: "02", label: "Selected work" },
  headline: "Case studies, not screenshots.",
  cards: [
    {
      kind: "Product · AI",
      title: "Gastra",
      summary:
        "PLACEHOLDER — DRAFT: one-line outcome-focused summary of the Gastra case study.",
      href: "#", // stub link (Phase 1); real case study lands in the content phase
    },
    {
      kind: "Platform · Banking",
      title: "Banking at scale",
      summary:
        "PLACEHOLDER — DRAFT: one-line summary of the banking-grade systems case study.",
      href: "#",
    },
    {
      kind: "Engineering · This site",
      title: "degiorgi.dev",
      summary:
        "PLACEHOLDER — DRAFT: one-line summary of how this site and its RAG console are built.",
      href: "#",
    },
  ] satisfies readonly WorkCard[],
} as const;

export const stack = {
  eyebrow: { index: "03", label: "Stack" },
  // Grounded in spec 000 (Java/Spring systems + Python LLM engineering).
  tags: [
    "Java",
    "Spring",
    "TypeScript",
    "Next.js",
    "Python",
    "LangGraph",
    "PostgreSQL",
    "Docker",
    "AWS",
  ],
  footnote: "// tools change. The discipline doesn't.",
} as const;

export const contact = {
  headline: "Let's talk.",
  subline:
    "PLACEHOLDER — DRAFT: one line inviting recruiters/engineers to reach out.",
  cta: {
    email: "Email me",
    linkedin: "LinkedIn",
    github: "GitHub",
    x: "X",
  },
  badge: "GET /contact → 200 OK",
} as const;

// External links — (spec 002 §8).
export const links = {
  email: "hello@degiorgi.dev",
  linkedin: "https://www.linkedin.com/in/agustindegiorgi",
  github: "https://github.com/degiorgiagustin",
  x: "https://x.com/degiorgiagustin",
  cv: "/Agustin_De_Giorgi_CV.pdf",
} as const;
