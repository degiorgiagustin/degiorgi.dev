/*
 * Single source of truth for ALL user-facing copy, structured content, and
 * external links (spec 002 §2, §8). No copy may be hardcoded in components.
 *
 * Bilingual (spec 006): every translatable field is `{ en, es }` (the
 * `Localized` type, `@/lib/i18n/locale`), inline next to its English
 * counterpart rather than split across two files — adding a new array item
 * (a journey step, a work card) without its `es` half is a TypeScript error,
 * not a silently-forgotten second file. Proper nouns, URLs, tech/tool names,
 * and tags stay plain strings on purpose (a company name or "Java" doesn't
 * translate). Render with `t(field)` from `@/lib/i18n/locale`.
 *
 * PLACEHOLDER-EQUIVALENT NOTICE: every `es` value currently equals its `en`
 * value — this is spec 006 Phase 1 (infrastructure only). Real Spanish
 * content is Phase 2, tracked separately; nothing here is real translation
 * yet, so don't read the `es` fields as verified copy.
 */

import type { IconSlug } from "@/components/stack/icons";
import type { TraceChunk, TraceMeta } from "@/lib/agent/types";
import type { Localized } from "@/lib/i18n/locale";

export const site = {
  // Split so the TLD can render dimmed, per the prototype wordmark.
  wordmark: { name: "degiorgi", tld: ".dev" },
} as const;

// SEO/metadata source of truth (spec 004 §2): page title/description, canonical
// URL, and JSON-LD Person fields. `links` above supplies `sameAs`.
export const seo = {
  url: "https://degiorgi.dev",
  title: {
    en: "Agustín De Giorgi - Software Engineer",
    es: "Agustín De Giorgi - Software Engineer",
  } satisfies Localized,
  description: {
    en: "Software engineer building banking-grade systems that move money and AI that shows its work.",
    es: "Software engineer building banking-grade systems that move money and AI that shows its work.",
  } satisfies Localized,
  person: {
    name: "Agustín De Giorgi",
    jobTitle: {
      en: "Software Engineer",
      es: "Software Engineer",
    } satisfies Localized,
  },
} as const;

export const nav = {
  links: [
    {
      label: { en: "Journey", es: "Journey" } satisfies Localized,
      href: "#journey",
    },
    { label: { en: "Work", es: "Work" } satisfies Localized, href: "#work" },
    {
      label: { en: "Contact", es: "Contact" } satisfies Localized,
      href: "#contact",
    },
  ],
} as const;

export const hero = {
  eyebrow: {
    en: "Software Engineer · Fintech & AI",
    es: "Software Engineer · Fintech & AI",
  } satisfies Localized,
  headline: {
    lead: {
      en: "Systems that move money.",
      es: "Systems that move money.",
    } satisfies Localized,
    accent: {
      en: "AI that shows its work.",
      es: "AI that shows its work.",
    } satisfies Localized,
  },
  subline: {
    en: "I build banking-grade Java/Spring systems and production LLM applications. I show the retrieval trace behind every answer.",
    es: "I build banking-grade Java/Spring systems and production LLM applications. I show the retrieval trace behind every answer.",
  } satisfies Localized,
  scrollHint: {
    en: "The journey",
    es: "The journey",
  } satisfies Localized,
} as const;

// Shape of one canned exchange served by the MockAgentAdapter (spec 003 §5).
// Readonly here; the adapter copies into fresh AgentResponse objects per call.
export type CannedAnswer = {
  text: Localized;
  sources: readonly string[];
  trace: { chunks: readonly TraceChunk[]; meta: TraceMeta };
};

export const agentConsole = {
  label: {
    en: "ask my agent: it answers from my real work",
    es: "ask my agent: it answers from my real work",
  } satisfies Localized,
  inputAriaLabel: {
    en: "Ask about my work",
    es: "Ask about my work",
  } satisfies Localized,
  ask: { en: "ask ↵", es: "ask ↵" } satisfies Localized,
  // Cycling typed placeholder (spec 003 §2); reduced motion pins the first.
  placeholders: [
    {
      en: "Ask anything about my work…",
      es: "Ask anything about my work…",
    } satisfies Localized,
    {
      en: '"what would you change in Gastra today?"',
      es: '"what would you change in Gastra today?"',
    } satisfies Localized,
    {
      en: '"walk me through this site\'s architecture"',
      es: '"walk me through this site\'s architecture"',
    } satisfies Localized,
  ],
  thinking: {
    en: "querying the index…",
    es: "querying the index…",
  } satisfies Localized,
  footer: {
    // Technical/mono trace formatting (ms, tokens, chunk counts) stays
    // English-notation in both locales, matching the site's terminal-voice
    // aesthetic (spec 001 §1) — not translated, same as `tags`/tool names.
    stats: (totalMs: number, chunkCount: number) =>
      `${totalMs}ms · ${chunkCount} chunks`,
    showTrace: {
      en: "view retrieval trace",
      es: "view retrieval trace",
    } satisfies Localized,
    hideTrace: { en: "hide trace", es: "hide trace" } satisfies Localized,
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
    placeholder: {
      en: "Ask my agent anything…",
      es: "Ask my agent anything…",
    } satisfies Localized,
    send: { en: "ask", es: "ask" } satisfies Localized,
    close: { en: "✕ close", es: "✕ close" } satisfies Localized,
    cardAriaLabel: {
      en: "Agent answer",
      es: "Agent answer",
    } satisfies Localized,
  },
  // Canned corpus for the mock adapter. Chip labels derive from here so the
  // question→answer mapping has a single source. Trace data is illustrative
  // of the Phase 3 pipeline (files the real index will embed).
  canned: [
    {
      chip: {
        en: "What have you built?",
        es: "What have you built?",
      } satisfies Localized,
      answer: {
        text: {
          en: "Banking-grade platforms and production AI. The short list: retail-banking systems in Java/Spring that move real money at scale, Gastra (an AI product I'm writing up as a case study), and this site, a static Next.js shell with a RAG agent over my actual work. The Selected work section below has the full write-ups.",
          es: "Banking-grade platforms and production AI. The short list: retail-banking systems in Java/Spring that move real money at scale, Gastra (an AI product I'm writing up as a case study), and this site, a static Next.js shell with a RAG agent over my actual work. The Selected work section below has the full write-ups.",
        } satisfies Localized,
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
      chip: {
        en: "How does this site work?",
        es: "How does this site work?",
      } satisfies Localized,
      answer: {
        text: {
          en: "This site is a static Next.js shell. The agent is a separate FastAPI + LangGraph service over an embedded index of my real corpus: case studies, ADRs, CV. Every answer is traced end-to-end; the retrieval trace under this answer is the design, not decoration. If the agent goes down, the site doesn't. That's a deliberate decision.",
          es: "This site is a static Next.js shell. The agent is a separate FastAPI + LangGraph service over an embedded index of my real corpus: case studies, ADRs, CV. Every answer is traced end-to-end; the retrieval trace under this answer is the design, not decoration. If the agent goes down, the site doesn't. That's a deliberate decision.",
        } satisfies Localized,
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
      chip: {
        en: "From banking to AI",
        es: "From banking to AI",
      } satisfies Localized,
      answer: {
        text: {
          en: "The through-line is trust. Banking taught me to ship code where a mistake moves someone's money: reviews, audits, observability, no heroics. Moving into AI I kept the same bar: LLM systems with traced retrieval, measurable behavior, and honest failure modes. The journey section above tells it chapter by chapter.",
          es: "The through-line is trust. Banking taught me to ship code where a mistake moves someone's money: reviews, audits, observability, no heroics. Moving into AI I kept the same bar: LLM systems with traced retrieval, measurable behavior, and honest failure modes. The journey section above tells it chapter by chapter.",
        } satisfies Localized,
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
  ] satisfies readonly { chip: Localized; answer: CannedAnswer }[],
  // Free-text fallback: the mock is honest about being a mock (spec 003 §5).
  generic: {
    text: {
      en: "Straight answer: I'm still the mock adapter. The production retrieval pipeline ships with the agent phase of this site. Right now I only have real answers for the three suggested questions. Try one of those, or skip the middleman entirely.",
      es: "Straight answer: I'm still the mock adapter. The production retrieval pipeline ships with the agent phase of this site. Right now I only have real answers for the three suggested questions. Try one of those, or skip the middleman entirely.",
    } satisfies Localized,
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
    // threshold, and no llm/token stages: retrieval stopped before generation.
    offTopic: {
      trigger: "weather",
      text: {
        en: "That's outside my index. Nothing in Agustín's corpus scores above the relevance threshold for that. Try asking about Gastra, banking platforms, or how this site works.",
        es: "That's outside my index. Nothing in Agustín's corpus scores above the relevance threshold for that. Try asking about Gastra, banking platforms, or how this site works.",
      } satisfies Localized,
      trace: {
        chunks: [{ source: "cv-2026.md", section: "§interests", score: 0.31 }],
        meta: { embedMs: 11, searchMs: 39, totalMs: 50 },
      },
    },
    budgetExhausted: {
      text: {
        en: "That's ten questions. This demo session's budget is spent. The human version has no rate limit.",
        es: "That's ten questions. This demo session's budget is spent. The human version has no rate limit.",
      } satisfies Localized,
    },
    unavailable: {
      text: {
        en: "The agent is unreachable right now, but the site doesn't depend on it by design. Try again in a minute.",
        es: "The agent is unreachable right now, but the site doesn't depend on it by design. Try again in a minute.",
      } satisfies Localized,
    },
  },
} as const;

export type JourneyStep = {
  period: string; // dates read the same in both locales; not translated
  role: Localized;
  org: string; // company/employer names; not translated
  narrative: Localized;
  tags: readonly string[]; // tech terms; not translated
};

export const journey = {
  eyebrow: {
    index: "01",
    label: { en: "The journey", es: "The journey" } satisfies Localized,
  },
  headline: {
    en: "Over 5+ years, one thread: systems people trust.",
    es: "Over 5+ years, one thread: systems people trust.",
  } satisfies Localized,
  subline: {
    en: "Six chapters, from banking-grade systems to production AI.",
    es: "Six chapters, from banking-grade systems to production AI.",
  } satisfies Localized,
  steps: [
    {
      period: "Feb 2020 – Nov 2020",
      role: { en: "Java Developer", es: "Java Developer" } satisfies Localized,
      org: "MobyDigital",
      narrative: {
        en: "Started at 18, the same year I began Systems Engineering at UTN. Built monolithic Java/Spring MVC apps and REST APIs, learning Hibernate and MySQL from the ground up.",
        es: "Started at 18, the same year I began Systems Engineering at UTN. Built monolithic Java/Spring MVC apps and REST APIs, learning Hibernate and MySQL from the ground up.",
      } satisfies Localized,
      tags: ["Java", "Spring MVC", "Hibernate", "MySQL"],
    },
    {
      period: "Nov 2020 – May 2022",
      role: {
        en: "Backend Developer",
        es: "Backend Developer",
      } satisfies Localized,
      org: "MobyDigital (client: ICBC / YOY)",
      narrative: {
        en: "Joined the team building ICBC's new digital bank from zero: REST microservices in Java/Spring Boot for digital onboarding (accounts, card issuance), Oracle PL/SQL, and shared libraries used across the platform.",
        es: "Joined the team building ICBC's new digital bank from zero: REST microservices in Java/Spring Boot for digital onboarding (accounts, card issuance), Oracle PL/SQL, and shared libraries used across the platform.",
      } satisfies Localized,
      tags: ["Java", "Spring Boot", "Microservices", "Oracle PL/SQL"],
    },
    {
      period: "May 2022 – Dec 2022",
      role: {
        en: "Full-Stack Developer",
        es: "Full-Stack Developer",
      } satisfies Localized,
      org: "MobyDigital",
      narrative: {
        en: "Moved into microfrontend architecture (single-spa and Angular), building independently deployable UI modules and a shared component library with the UX/UI team.",
        es: "Moved into microfrontend architecture (single-spa and Angular), building independently deployable UI modules and a shared component library with the UX/UI team.",
      } satisfies Localized,
      tags: ["Angular", "Microfrontends", "single-spa", "TypeScript"],
    },
    {
      period: "May 2022 – Apr 2023",
      role: { en: "Backend Mentor", es: "Backend Mentor" } satisfies Localized,
      org: "MobyDigital",
      narrative: {
        en: "Designed the company's Backend Roadmap and mentored 8+ trainees, including candidates from the government's PIL program. 7 of 8 got hired, several now Senior Devs.",
        es: "Designed the company's Backend Roadmap and mentored 8+ trainees, including candidates from the government's PIL program. 7 of 8 got hired, several now Senior Devs.",
      } satisfies Localized,
      tags: ["Mentorship", "Technical Leadership"],
    },
    {
      period: "Jan 2023 – Present",
      role: { en: "Tech Lead", es: "Tech Lead" } satisfies Localized,
      org: "MobyDigital → ICBC Argentina",
      narrative: {
        en: "Promoted to Tech Lead for YOY's payments and transfers team, later converting to a direct ICBC employee. Maintained 15+ reusable microservices behind transaction flows serving up to 640K logins on peak days. Since Oct 2025, scope expanded into architecture for ICBC's Retail segment: migration roadmaps, C4 diagrams, and ADRs for a platform serving 560K+ monthly active users.",
        es: "Promoted to Tech Lead for YOY's payments and transfers team, later converting to a direct ICBC employee. Maintained 15+ reusable microservices behind transaction flows serving up to 640K logins on peak days. Since Oct 2025, scope expanded into architecture for ICBC's Retail segment: migration roadmaps, C4 diagrams, and ADRs for a platform serving 560K+ monthly active users.",
      } satisfies Localized,
      tags: ["Leadership", "Payments", "Microservices", "Architecture", "ADRs"],
    },
    {
      period: "2025 – Present",
      role: {
        en: "Independent project",
        es: "Independent project",
      } satisfies Localized,
      org: "Gastra",
      narrative: {
        en: "Building a restaurant-recommendation app on the side: hybrid retrieval (pgvector + geolocation + weather) that turns a natural-language query into a ranked result via LLM, hexagonal architecture, local inference via Ollama.",
        es: "Building a restaurant-recommendation app on the side: hybrid retrieval (pgvector + geolocation + weather) that turns a natural-language query into a ranked result via LLM, hexagonal architecture, local inference via Ollama.",
      } satisfies Localized,
      tags: ["RAG", "LLM", "Spring AI", "pgvector", "Hexagonal Architecture"],
    },
  ] satisfies readonly JourneyStep[],
} as const;

export type WorkCard = {
  kind: Localized;
  title: string; // product/site names; not translated
  summary: Localized;
};

export const work = {
  eyebrow: {
    index: "02",
    label: { en: "Selected work", es: "Selected work" } satisfies Localized,
  },
  headline: {
    en: "Case studies, not screenshots.",
    es: "Case studies, not screenshots.",
  } satisfies Localized,
  subline: {
    en: "I've worked on a variety of projects, from banking-grade systems to production AI.",
    es: "I've worked on a variety of projects, from banking-grade systems to production AI.",
  } satisfies Localized,
  cards: [
    {
      kind: { en: "Product · AI", es: "Product · AI" } satisfies Localized,
      title: "Gastra",
      summary: {
        en: "A restaurant-recommendation app with hybrid retrieval (vector search, geolocation, live weather) that turns a natural-language query into a ranked list or a single high-confidence match. Hexagonal architecture, local LLM inference, built under Spec-Driven Development.",
        es: "A restaurant-recommendation app with hybrid retrieval (vector search, geolocation, live weather) that turns a natural-language query into a ranked list or a single high-confidence match. Hexagonal architecture, local LLM inference, built under Spec-Driven Development.",
      } satisfies Localized,
    },
    {
      kind: {
        en: "Platform · Banking",
        es: "Platform · Banking",
      } satisfies Localized,
      title: "Banking at scale",
      summary: {
        en: "Tech Lead for YOY, ICBC's mobile banking app: transaction flows serving up to 640K logins on peak days. Core microservices at scale: fraud prevention (~35M monthly hits), transfers (~13M), bill payments (~4.5M).",
        es: "Tech Lead for YOY, ICBC's mobile banking app: transaction flows serving up to 640K logins on peak days. Core microservices at scale: fraud prevention (~35M monthly hits), transfers (~13M), bill payments (~4.5M).",
      } satisfies Localized,
    },
    {
      kind: {
        en: "Engineering · This site",
        es: "Engineering · This site",
      } satisfies Localized,
      title: "degiorgi.dev",
      summary: {
        en: "This site: a static Next.js shell with a RAG-style console over my own work. Every answer traces back to the source chunk it came from.",
        es: "This site: a static Next.js shell with a RAG-style console over my own work. Every answer traces back to the source chunk it came from.",
      } satisfies Localized,
    },
  ] satisfies readonly WorkCard[],
} as const;

export type StackTool = {
  name: string; // tool/language names; not translated
  icon?: IconSlug; // omitted = no known icon (spec 002 §4.5); label-only chip.
};

export const stack = {
  // Spec 002 §4.5: header + tools grouped by category + footnote, no headline/subline.
  eyebrow: {
    index: "03",
    label: { en: "Stack", es: "Stack" } satisfies Localized,
  },
  categories: [
    {
      label: { en: "languages", es: "languages" } satisfies Localized,
      tools: [
        { name: "Java", icon: "openjdk" }, // Oracle's Java coffee-cup mark isn't available (trademark takedown); OpenJDK stands in.
        { name: "Python", icon: "python" },
        { name: "TypeScript", icon: "typescript" },
      ],
    },
    {
      label: { en: "frameworks", es: "frameworks" } satisfies Localized,
      tools: [
        { name: "Spring", icon: "spring" },
        { name: "Next.js", icon: "nextdotjs" },
        { name: "LangChain", icon: "langchain" },
        { name: "LangGraph", icon: "langgraph" },
        { name: "scikit-learn", icon: "scikitlearn" },
      ],
    },
    {
      label: {
        en: "ai tools & models",
        es: "ai tools & models",
      } satisfies Localized,
      tools: [
        { name: "Claude Code", icon: "claude" },
        { name: "Gemini", icon: "googlegemini" },
        { name: "Cursor", icon: "cursor" },
        { name: "v0", icon: "v0" },
        { name: "Ollama", icon: "ollama" },
      ],
    },
    {
      label: { en: "data", es: "data" } satisfies Localized,
      tools: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MySQL", icon: "mysql" },
        { name: "Oracle SQL" },
      ],
    },
    {
      label: { en: "infra & devops", es: "infra & devops" } satisfies Localized,
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
      label: { en: "observability", es: "observability" } satisfies Localized,
      tools: [
        { name: "Elastic", icon: "elastic" },
        { name: "Kibana", icon: "kibana" },
        { name: "Dynatrace", icon: "dynatrace" },
      ],
    },
  ] satisfies readonly { label: Localized; tools: readonly StackTool[] }[],
  footnote: {
    en: "// tools change. The discipline doesn't.",
    es: "// tools change. The discipline doesn't.",
  } satisfies Localized,
} as const;

export const contact = {
  eyebrow: {
    index: "04",
    label: { en: "Contact", es: "Contact" } satisfies Localized,
  },
  headline: { en: "Let's talk.", es: "Let's talk." } satisfies Localized,
  subline: {
    en: "I like talking shop: fintech, distributed systems, AI engineering. If that's you too, reach out.",
    es: "I like talking shop: fintech, distributed systems, AI engineering. If that's you too, reach out.",
  } satisfies Localized,
  cta: {
    email: "hello@degiorgi.dev", // data (an address), not copy — not translated
    linkedin: { en: "LinkedIn", es: "LinkedIn" } satisfies Localized,
    github: { en: "GitHub", es: "GitHub" } satisfies Localized,
    x: { en: "X", es: "X" } satisfies Localized,
    cv: { en: "Download CV", es: "Download CV" } satisfies Localized,
    copyEmail: {
      en: "Copy email address",
      es: "Copy email address",
    } satisfies Localized,
    copyEmailCopied: { en: "Copied!", es: "Copied!" } satisfies Localized,
  },
  badge: {
    // Deliberately terminal/API-voice, not translated — same call as `tags`
    // and the trace footer above (spec 001 §1's "terminal phosphor" register).
    prefix: "GET /contact →",
    status: "200 OK",
  },
} as const;

// External links consumed by Contact (spec 002 §4.6, §8). Not a page section:
// no eyebrow/headline of its own; that content belongs to `contact` above.
export const links = {
  email: "hello@degiorgi.dev",
  // LinkedIn serves a distinct URL per profile language (not just query-string
  // decoration — omitting ?locale=en-US on the English page lands a Spanish
  // speaker on the Spanish profile by default), so this is genuinely
  // Localized, unlike github/x which don't have a per-language profile.
  linkedin: {
    en: "https://www.linkedin.com/in/agustindegiorgi/?locale=en-US",
    es: "https://www.linkedin.com/in/agustindegiorgi",
  } satisfies Localized,
  github: "https://github.com/degiorgiagustin",
  x: "https://x.com/degiorgiagustin",
  cv: {
    en: "/cv/CV_Agustin_De_Giorgi_en.pdf",
    es: "/cv/CV_Agustin_De_Giorgi_es.pdf",
  } satisfies Localized,
} as const;
