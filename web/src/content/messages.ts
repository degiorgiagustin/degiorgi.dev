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
import type { TraceChunk, TraceMeta } from "@/lib/agent/types";

export const site = {
  // Split so the TLD can render dimmed, per the prototype wordmark.
  wordmark: { name: "degiorgi", tld: ".dev" },
  status: "Open to senior roles",
} as const;

// SEO/metadata source of truth (spec 004 §2): page title/description, canonical
// URL, and JSON-LD Person fields. `links` above supplies `sameAs`.
export const seo = {
  url: "https://degiorgi.dev",
  title: "Agustín De Giorgi — Software Engineer",
  description:
    "Software engineer building banking-grade systems that move money and AI that shows its work.",
  person: {
    name: "Agustín De Giorgi",
    jobTitle: "Software Engineer",
  },
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

// Shape of one canned exchange served by the MockAgentAdapter (spec 003 §5).
// Readonly here; the adapter copies into fresh AgentResponse objects per call.
export type CannedAnswer = {
  text: string;
  sources: readonly string[];
  trace: { chunks: readonly TraceChunk[]; meta: TraceMeta };
};

export const agentConsole = {
  label: "ask my agent — it answers from my real work",
  inputAriaLabel: "Ask about my work",
  ask: "ask ↵",
  // Cycling typed placeholder (spec 003 §2); reduced motion pins the first.
  placeholders: [
    "Ask anything about my work…",
    '"what would you change in Gastra today?"',
    '"walk me through this site\'s architecture"',
  ],
  thinking: "querying the index…",
  footer: {
    stats: (totalMs: number, chunkCount: number) =>
      `${totalMs}ms · ${chunkCount} chunks`,
    showTrace: "view retrieval trace",
    hideTrace: "hide trace",
  },
  // Trace meta line. Rejection traces carry a Partial<TraceMeta> (the guardrail
  // stops before the LLM), so absent stages are simply omitted.
  traceMeta: (m: Partial<TraceMeta>) =>
    [
      m.embedMs !== undefined ? `embed ${m.embedMs}ms` : null,
      m.searchMs !== undefined ? `search ${m.searchMs}ms` : null,
      m.llmMs !== undefined ? `llm ${m.llmMs}ms` : null,
      m.tokensIn !== undefined ? `${m.tokensIn} tok in` : null,
      m.tokensOut !== undefined ? `${m.tokensOut} tok out` : null,
    ]
      .filter(Boolean)
      .join(" · "),
  dock: {
    placeholder: "Ask my agent anything…",
    send: "ask",
    close: "✕ close",
    cardAriaLabel: "Agent answer",
  },
  // Canned corpus for the mock adapter. Chip labels derive from here so the
  // question→answer mapping has a single source. Trace data is illustrative
  // of the Phase 3 pipeline (files the real index will embed).
  canned: [
    {
      chip: "What have you built?",
      answer: {
        text: "Banking-grade platforms and production AI. The short list: retail-banking systems in Java/Spring that move real money at scale, Gastra — an AI product I'm writing up as a case study — and this site, a static Next.js shell with a RAG agent over my actual work. The Selected work section below has the full write-ups.",
        sources: [
          "cv-2026.md",
          "case-study-gastra.md",
          "case-study-banking-platform.md",
        ],
        trace: {
          chunks: [
            { source: "cv-2026.md", section: "§experience", score: 0.89 },
            {
              source: "case-study-gastra.md",
              section: "§outcome",
              score: 0.85,
            },
            {
              source: "case-study-banking-platform.md",
              section: "§scale",
              score: 0.81,
            },
          ],
          meta: {
            embedMs: 12,
            searchMs: 38,
            llmMs: 574,
            totalMs: 624,
            tokensIn: 1184,
            tokensOut: 96,
          },
        },
      },
    },
    {
      chip: "How does this site work?",
      answer: {
        text: "This site is a static Next.js shell — the agent is a separate FastAPI + LangGraph service over an embedded index of my real corpus: case studies, ADRs, CV. Every answer is traced end-to-end; the retrieval trace under this answer is the design, not decoration. If the agent goes down, the site doesn't. That's a deliberate decision.",
        sources: [
          "adr-007-site-architecture.md",
          "case-study-site.md",
          "cv-2026.md",
        ],
        trace: {
          chunks: [
            {
              source: "adr-007-site-architecture.md",
              section: "§decision",
              score: 0.91,
            },
            {
              source: "case-study-site.md",
              section: "§hybrid-search",
              score: 0.84,
            },
            { source: "cv-2026.md", section: "§stack", score: 0.79 },
          ],
          meta: {
            embedMs: 11,
            searchMs: 44,
            llmMs: 609,
            totalMs: 664,
            tokensIn: 1312,
            tokensOut: 118,
          },
        },
      },
    },
    {
      chip: "From banking to AI",
      answer: {
        text: "The through-line is trust. Banking taught me to ship code where a mistake moves someone's money — reviews, audits, observability, no heroics. Moving into AI I kept the same bar: LLM systems with traced retrieval, measurable behavior, and honest failure modes. The journey section above tells it chapter by chapter.",
        sources: ["cv-2026.md", "case-study-banking-platform.md"],
        trace: {
          chunks: [
            { source: "cv-2026.md", section: "§journey", score: 0.88 },
            {
              source: "case-study-banking-platform.md",
              section: "§discipline",
              score: 0.8,
            },
            { source: "case-study-gastra.md", section: "§why-ai", score: 0.77 },
          ],
          meta: {
            embedMs: 13,
            searchMs: 41,
            llmMs: 552,
            totalMs: 606,
            tokensIn: 1093,
            tokensOut: 102,
          },
        },
      },
    },
  ] satisfies readonly { chip: string; answer: CannedAnswer }[],
  // Free-text fallback: the mock is honest about being a mock (spec 003 §5).
  generic: {
    text: "Straight answer: I'm still the mock adapter — the production retrieval pipeline ships with the agent phase of this site. Right now I only have real answers for the three suggested questions. Try one of those, or skip the middleman entirely: hello@degiorgi.dev.",
    sources: ["cv-2026.md"],
    trace: {
      chunks: [
        { source: "cv-2026.md", section: "§summary", score: 0.62 },
        {
          source: "adr-007-site-architecture.md",
          section: "§context",
          score: 0.58,
        },
      ],
      meta: {
        embedMs: 12,
        searchMs: 40,
        llmMs: 421,
        totalMs: 473,
        tokensIn: 908,
        tokensOut: 84,
      },
    },
  } satisfies CannedAnswer,
  rejections: {
    // Guardrail demo (spec 003 §5): the trace shows the best chunk BELOW
    // threshold, and no llm/token stages — retrieval stopped before generation.
    offTopic: {
      trigger: "weather",
      text: "That's outside my index — nothing in Agustín's corpus scores above the relevance threshold for that. Try asking about Gastra, banking platforms, or how this site works.",
      trace: {
        chunks: [{ source: "cv-2026.md", section: "§interests", score: 0.31 }],
        meta: { embedMs: 11, searchMs: 39, totalMs: 50 },
      },
    },
    budgetExhausted: {
      text: "That's ten questions — this demo session's budget is spent. The human version has no rate limit: hello@degiorgi.dev, or find me on LinkedIn.",
    },
    unavailable: {
      text: "The agent is unreachable right now — but the site doesn't depend on it, by design. Try again in a minute, or go straight to hello@degiorgi.dev.",
    },
  },
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
