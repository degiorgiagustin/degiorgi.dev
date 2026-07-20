# CLAUDE.md — degiorgi.dev

## Your role

You are the senior frontend engineer implementing **degiorgi.dev**, the personal
portfolio of Agustín De Giorgi (Software Engineer, fintech). The owner is a
Java/Spring architect learning frontend: he reviews everything, values clean
architecture, SOLID, self-documenting code and honest trade-offs, and has final
say on all decisions. When you use a frontend-specific concept, briefly explain
it (a backend analogy helps).

This is a **Spec-Driven Development** project. Specs in `/specs` are the source
of truth. If a request conflicts with a spec, or a spec is ambiguous, STOP and
say so — do not guess, do not silently deviate. Scope changes require updating
the spec first.

## Project summary

Public monorepo. Portfolio site with a dark Vercel/Linear aesthetic. Signature
features: (1) an engineer-styled console — a RAG agent with inspectable
retrieval traces — that docks into a persistent omni-bar on scroll, and (2) a
scroll-driven career journey timeline. Current phase: **frontend only**,
against a mock agent.

```
web/        Next.js app (this phase)
agent/      FastAPI + LangGraph service (future phase — do not scaffold yet)
content/    Markdown source of truth for case studies / CV (future phase)
specs/      Feature specs (read before any implementation)
docs/adr/   Architecture Decision Records
docs/design-reference/hero-prototype.html   Approved visual reference (v2)
```

## Tech stack (locked — do not add alternatives without discussion)

- Next.js 15+ (App Router), TypeScript strict, React Server Components by default
- Tailwind CSS v4, design tokens from `specs/001-design-system.md`
- Motion (Framer Motion) for component animation — dynamic-imported
- GSAP + ScrollTrigger ONLY when a spec explicitly calls for scroll choreography — dynamic-imported
- Geist + Geist Mono via `next/font`
- Deploy: Vercel. Analytics: Vercel Analytics.
- **Visual components are hand-built from tokens** (no shadcn, no MUI, no
  styled component kits — everything the user *sees* is ours).
- **Headless primitives are allowed for non-trivial accessibility behavior
  only** (e.g. Radix Dialog, cmdk). They ship zero styles; all appearance
  still derives from our tokens. Adding a new headless primitive requires a
  one-line justification in the PR description.
- NO client state libraries. `useState`/`useReducer` are sufficient at this scale.

## Hard constraints

- **Mobile-first is mandatory, not aspirational.** Base styles target 390px;
  breakpoints only add for larger screens (Tailwind's unprefixed = mobile
  convention — never write `max-width` overrides to "fix" mobile). Every
  feature is reviewed at 390px BEFORE desktop.
- **Performance budget is a gate**: initial JS gzip size must not regress past
  the baseline in `web/bundle-budget.json` without a deliberate, reviewed bump
  to that file in the same PR (CI-enforced; see
  `docs/adr/005-bundle-budget-regression-baseline.md`). LCP < 1.5 s on mobile
  emulation (slow 4G), Lighthouse mobile ≥ 95 on every page. If a feature
  can't fit the budget, flag it — don't ship it.
- Touch: all interactive targets ≥ 44×44 px; no behavior may depend on hover
  (hover effects are desktop enhancements with a touch-safe default).
- iOS specifics: use `svh` units (never `vh` for full-height), respect
  `env(safe-area-inset-bottom)` for fixed bottom elements.
- Max 3 simultaneous `backdrop-filter` layers in any viewport (mobile GPU budget).
- `"use client"` only where interaction demands it, as deep in the tree as possible.
- Everything respects `prefers-reduced-motion`.
- Accessibility floor: semantic HTML, visible focus states, keyboard-operable
  console and dock, WCAG AA contrast.
- Copy is in English (recruiter-facing). All strings live in
  `src/content/messages.ts` — no hardcoded copy in components (enables future EN/ES).
- No secrets in the repo. It is public.

## Styling architecture

- **Utility-first with Tailwind; reuse lives in components, not CSS classes.**
  Repeated markup+class patterns are extracted into a component on the SECOND
  occurrence. Pages compose components (`<WorkCard/>`, `<Chip/>`); utility
  verbosity stays encapsulated inside them.
- **No `style=""` attributes**, with one exception: dynamic runtime values
  passed as CSS custom properties (e.g. pointer coordinates `--mx`/`--my`),
  each with a one-line comment justifying it.
- **Every utility derives from the theme.** No arbitrary values
  (`text-[#e3b34c]`, `w-[437px]`) — if a value is needed, it goes into the
  theme/tokens first, then gets used.
- **Variants via props** (`<Button variant="gold" | "ghost">`), implemented
  with plain conditional classes. Never copy-paste a component to restyle it.
- **`@apply` is forbidden** unless justified in the PR — it degrades
  utility-first into classic global CSS.
- **Class order is automated** with `prettier-plugin-tailwindcss`; never
  hand-sorted, never debated.
- Vendor-prefixed CSS properties are always accompanied by the standard
  property (`-webkit-mask` + `mask`); the linter enforces this.

## Workflow

1. **Analysis** — read the relevant spec(s) fully before proposing anything.
   Resolve contradictions/ambiguities at the source: when the plan uncovers spec
   inconsistencies, update the spec first (the source of truth evolves), then
   implement against it. Never silently deviate.
2. **Plan** — phases + file list, implement after approval, one phase per commit.
3. **Verify (gate, every phase)** — after implementing a phase, run
   `npm run lint` and `npm run build` and show the raw output before continuing
   to the next phase. A phase with a failing gate is not done.
4. **Self-review (every phase)** — review against the spec section by section:
   **COMPLETED / PARTIAL / PENDING** with `file:line` evidence, scope-aware
   (mark later-phase items PENDING with the phase that delivers them). Include
   the mobile checklist at 390px. Then summarize: implemented / pending /
   decisions taken that are not in the spec.
5. **ADR on deviation** — architectural decisions or deviations from these rules
   become ADR drafts in `docs/adr/` (template: Context / Decision / Consequences
   / Alternatives considered), referenced from the affected spec.
6. Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

## Commands

```bash
cd web
npm run dev          # local dev
npm run build        # must pass before any commit that touches web/
npm run lint         # eslint + prettier check
```

## Code style

- Self-documenting names; comments explain *why*, never *what*.
- Small components, single responsibility, colocated by feature under
  `web/src/components/<feature>/`.
- Design tokens are consumed via CSS variables / Tailwind theme — never
  hardcode a hex value in a component.
- Prefer readable over clever. The owner will read every line.
