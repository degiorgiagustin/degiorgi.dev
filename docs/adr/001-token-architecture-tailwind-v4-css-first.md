# ADR 001 — Design tokens via Tailwind v4 CSS-first `@theme`

Status: **Accepted** · Date: 2026-07-17 · Deciders: Agustín De Giorgi (owner)
Relates to: spec 001 (Design System), spec 002 (Frontend Shell)

## Context

Spec 001 mandates that every design token exist "as CSS custom properties on
`:root`, exposed through the Tailwind v4 theme," with zero raw hex values in
components (grep-verified). We need a concrete mechanism for this that:

- keeps a single source of truth for each token (no value duplicated between a
  JS config and a stylesheet),
- lets both plain CSS (`var(--gold)`) and Tailwind utilities (`text-gold`)
  resolve to the same token,
- ships zero runtime cost and no client JS for theming.

Tailwind CSS 4.2 (the pinned version) is **CSS-first**: configuration moved out
of `tailwind.config.js` into an `@theme` block inside the main stylesheet. This
is a genuine architectural choice for the project, not covered verbatim by the
spec, so it is recorded here.

## Decision

Tokens live once in `web/src/app/globals.css`:

1. **Raw values** are declared as CSS custom properties on `:root`
   (`--bg`, `--gold`, `--glass-solid`, …) — the values from spec 001 §2.
2. An **`@theme` block references those variables** to generate Tailwind
   utilities (e.g. `--color-bg: var(--bg)` → `bg-bg`, `text-gold`, etc.).
3. Components consume **only** the generated utilities or `var(--token)` — never
   a raw hex/rgba literal. This is enforced by grep in review.

There is **no `tailwind.config.js`**. The stylesheet is the single source of
truth. Fonts are wired as theme font-family tokens pointing at the `geist`
package's CSS variables.

## Consequences

**Positive**
- One definition per token; changing `--gold` updates both `var(--gold)` usages
  and every `*-gold` utility simultaneously.
- No JS config file to keep in sync; less surface area, faster onboarding.
- Runtime-theme-ready (light/ES variants later) by re-declaring `:root` vars.
- Satisfies the spec's "CSS variables + Tailwind theme entries" acceptance
  criterion directly.

**Negative / trade-offs**
- Team members expecting the Tailwind v3 `tailwind.config.js` mental model must
  learn the `@theme` model (mitigated: it is simpler, and this ADR documents it).
- Some third-party tooling/examples still assume a JS config; we forgo those.
- Arbitrary-value utilities remain forbidden by convention (CLAUDE.md), so any
  new value must be added as a token first — a small deliberate friction.

## Alternatives considered

1. **`tailwind.config.js` with a JS token object (Tailwind v3 style).** Rejected:
   duplicates values between JS and any `:root` vars, adds a config file, and
   fights v4's CSS-first direction.
2. **Raw CSS variables only, no Tailwind theme mapping.** Rejected: components
   would use `var(--token)` in `style`/arbitrary values, losing utility
   ergonomics and the spec's "Tailwind theme entries" requirement.
3. **A JSON/TS design-token file compiled to CSS via a build step
   (Style Dictionary).** Rejected as over-engineered for a single-author
   portfolio at this scale; revisit only if tokens are shared across apps.
