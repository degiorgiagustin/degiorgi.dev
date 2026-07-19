/*
 * Single source of truth for ALL user-facing copy, structured content, and
 * external links (spec 002 §2, §8). No copy may be hardcoded in components.
 * English (recruiter-facing); the grouped-export shape keeps a future EN/ES
 * toggle a matter of swapping this module.
 *
 * PLACEHOLDER marks owner-provided data still pending (real timeline dates,
 * email, social URLs, CV). These are content blockers, not build blockers.
 */

import type { IconSlug } from "@/components/stack/icons";

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
  headline: "Over 5+ years, one thread: systems people trust.",
  subline: "Six chapters, from banking-grade systems to production AI.",
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
  subline:
    "I've worked on a variety of projects, from banking-grade systems to production AI.",
  linkLabel: "read case study →",
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

export type StackTool = {
  name: string;
  icon?: IconSlug; // omitted = no known icon (spec 002 §4.5); label-only chip.
};

export const stack = {
  // Spec 002 §4.5: header + tools grouped by category + footnote, no headline/subline.
  eyebrow: { index: "03", label: "Stack" },
  categories: [
    {
      label: "languages",
      tools: [
        { name: "Java", icon: "openjdk" }, // Oracle's Java coffee-cup mark isn't available (trademark takedown); OpenJDK stands in.
        { name: "Python", icon: "python" },
        { name: "TypeScript", icon: "typescript" },
      ],
    },
    {
      label: "frameworks",
      tools: [
        { name: "Spring", icon: "spring" },
        { name: "Next.js", icon: "nextdotjs" },
        { name: "LangChain", icon: "langchain" },
        { name: "LangGraph", icon: "langgraph" },
        { name: "scikit-learn", icon: "scikitlearn" },
      ],
    },
    {
      label: "ai tools & models",
      tools: [
        { name: "Claude Code", icon: "claude" },
        { name: "Gemini", icon: "googlegemini" },
        { name: "Cursor", icon: "cursor" },
        { name: "v0", icon: "v0" },
        { name: "Ollama", icon: "ollama" },
      ],
    },
    {
      label: "data",
      tools: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MySQL", icon: "mysql" },
        { name: "Oracle SQL" },
      ],
    },
    {
      label: "infra & devops",
      tools: [
        { name: "Docker", icon: "docker" },
        { name: "Kubernetes", icon: "kubernetes" },
        { name: "OpenShift", icon: "redhatopenshift" },
        { name: "GitLab", icon: "gitlab" },
        { name: "GitHub", icon: "github" },
        { name: "Apache Maven", icon: "apachemaven" },
        { name: "Bruno", icon: "bruno" },
      ],
    },
    {
      label: "observability",
      tools: [
        { name: "Elastic", icon: "elastic" },
        { name: "Kibana", icon: "kibana" },
        { name: "Dynatrace", icon: "dynatrace" },
      ],
    },
  ] satisfies readonly { label: string; tools: readonly StackTool[] }[],
  footnote: "// tools change. The discipline doesn't.",
} as const;

export const contact = {
  eyebrow: { index: "04", label: "Contact" },
  headline: "Let's talk.",
  subline:
    "PLACEHOLDER — DRAFT: one line inviting recruiters/engineers to reach out.",
  cta: {
    email: "hello@degiorgi.dev",
    linkedin: "LinkedIn",
    github: "GitHub",
    x: "X",
  },
  badge: { prefix: "GET /contact →", status: "200 OK" },
} as const;

// External links consumed by Contact (spec 002 §4.6, §8). Not a page section —
// no eyebrow/headline of its own; that content belongs to `contact` above.
export const links = {
  email: "hello@degiorgi.dev",
  linkedin: "https://www.linkedin.com/in/agustindegiorgi",
  github: "https://github.com/degiorgiagustin",
  x: "https://x.com/degiorgiagustin",
  cv: "/Agustin_De_Giorgi_CV.pdf",
} as const;
