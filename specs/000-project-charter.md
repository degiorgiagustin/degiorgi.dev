# Spec 000 — Project Charter

Status: **Accepted** · Owner: Agustín De Giorgi · Last updated: 2026-07-16

## 1. Vision

degiorgi.dev is the professional portfolio of an Software Engineer moving
between two worlds: banking-grade Java/Spring systems and production LLM
engineering. The site must *demonstrate* both, not describe them.

Positioning line: **"Systems that move money. AI that shows its work."**

The site's signature is an engineer-styled console: a RAG agent over the
owner's real corpus (CV, case studies, ADRs) whose retrieval trace — chunks,
similarity scores, per-stage latency — is exposed to the visitor. The
interaction must read as an engineering tool, never as a generic chatbot.

## 2. Audience & success criteria

Primary: senior technical recruiters and engineering interviewers at fintech /
product companies (LATAM and international). Secondary: tech peers via X,
GitHub, LinkedIn.

Success looks like: a recruiter lands, understands seniority within 10 seconds,
tries the console, opens the trace, and clicks through to a case study or the
repo. The repo itself (specs, ADRs, evals in CI, commit history) is a
first-class deliverable.

## 3. Target architecture (context for all specs)

```
┌────────────────────┐     HTTPS      ┌──────────────────────────┐
│  web/  (Next.js)   │ ─────────────▶ │  agent/  (FastAPI)        │
│  static shell, SSG │                │  LangGraph pipeline       │
│  Vercel edge       │                │  Chroma (embedded)        │
└────────────────────┘                │  Langfuse tracing         │
        ▲                             └──────────▲───────────────┘
        │ build                                  │ index rebuild (CI)
┌───────┴───────────┐               ┌────────────┴─────────────┐
│  content/ (md)    │──────────────▶│  evals/ (Ragas, golden   │
│  case studies, CV │               │  questions — CI gate)     │
└───────────────────┘               └──────────────────────────┘
```

Governing principle: **the static shell never depends on the agent.** If
`agent/` is down or cold, the site is complete and perfect. The console is
progressive enhancement.

## 4. Phasing

| Phase | Scope | Exit criteria |
|-------|-------|---------------|
| **1 — Frontend shell** (current) | Specs 001–003. Site live on Vercel with hero, console against mock adapter, peek section. | Lighthouse ≥ 95 mobile; visual parity with approved prototype; deployed on degiorgi.dev |
| 2 — Content | Case studies (Gastra, platform work, this site) as MDX; About; CV download. | 3 case studies published |
| 3 — Agent | FastAPI + LangGraph + Chroma; real trace; abuse controls; Langfuse; Ragas in CI. | Console live end-to-end; evals green in CI |
| 4 — Polish | GSAP scroll choreography, EN/ES toggle, OG images, blog. | — |

## 5. Decisions already made (do not relitigate)

- Monorepo, public from day one, MIT license.
- Frontend: Next.js/React (market alignment). All AI in Python (market
  alignment). Java expertise is demonstrated via the Gastra repo and case
  studies, NOT by hosting Java services here.
- Chroma embedded in the agent process (corpus is small; removes an infra
  dependency and a network hop). pgvector would be the answer at scale — this
  trade-off is documented in a future ADR.
- Single accent color (muted gold `#e3b34c`); everything else monochrome.
- Copy in English; architecture must allow a future EN/ES toggle.

## 6. Out of scope (entire project)

- CMS of any kind. Content is markdown in the repo.
- User accounts, comments, newsletters.
- Heavy 3D (Three.js scenes). Conflicts with the performance budget and the
  professional positioning.
