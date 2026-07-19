# ADR 002 — Signature background layers as dedicated CSS classes

Status: **Accepted** · Date: 2026-07-17 · Deciders: Agustín De Giorgi (owner)
Relates to: spec 001 §3 (Signature background), spec 002 §2 (DotField/AmbientGlow),
CLAUDE.md (Styling architecture)

## Context

CLAUDE.md's styling architecture is utility-first with three hard rules relevant
here: no arbitrary Tailwind values (every utility derives from the theme), no
`style=""` (except dynamic runtime custom properties), and "reuse lives in
components, not CSS classes." Spec 001 §3 defines two fixed, full-viewport
background paint layers: a masked dot grid and a warm ambient glow. Their visual
is a `radial-gradient` + `mask-image` composition whose numeric parameters
(0.055 dot alpha, `28px` grid, the `ellipse 90% 60% at 50% 18%` mask) are
one-off paint constants from §3, not reusable design tokens.

Expressing these in the utility-first style would force long Tailwind arbitrary
values (`bg-[radial-gradient(...)]`, `[mask-image:...]`) — which the no-arbitrary
rule forbids, which the class sorter can't meaningfully order, and which are
unreadable. Inline `style=""` is also disallowed (the values are static, so the
dynamic-custom-property exception doesn't apply).

## Decision

Implement the two background layers as **dedicated CSS classes** (`.dot-field`,
`.ambient-glow`) in `globals.css`, using the literal values from spec 001 §3
(paired `-webkit-mask` + `mask`). The React components
(`components/layout/DotField.tsx`, `AmbientGlow.tsx`) are thin, aria-hidden
`<div>`s that only attach the class. This is a **scoped exception** to the
utility-first rule, limited to non-tokenizable full-viewport custom paint.

## Consequences

**Positive**
- Readable, single-location definitions that mirror how spec 001 §3 itself
  describes them (as CSS).
- No arbitrary Tailwind values, no `style=""`, no `@apply`.
- The vendor-prefix rule is honored (`-webkit-mask-image` + `mask-image`).

**Negative / trade-offs**
- Two class-based styles exist outside the utility-first convention; a reader
  must know this ADR explains why. Mitigated: the exception is explicitly
  bounded to background paint and documented in `globals.css` comments.
- If a third such layer ever appears, revisit whether a small `@utility`
  abstraction is warranted instead.

## Alternatives considered

1. **Tailwind arbitrary values on the component div.** Rejected: violates the
   no-arbitrary-values rule; unreadable; unsortable.
2. **Inline `style={{ ... }}`.** Rejected: violates the no-`style` rule (values
   are static, not runtime-dynamic).
3. **Tokenize every gradient parameter, then compose via utilities.** Rejected:
   over-tokenizes singletons (a `28px` grid used exactly once is not a design
   token) and still can't express the gradient/mask as utilities.
4. **Tailwind v4 `@utility` custom utilities.** Viable but heavier than needed
   for two singletons; kept as the escape hatch if a third layer appears.
