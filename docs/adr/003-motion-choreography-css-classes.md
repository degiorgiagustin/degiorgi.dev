# ADR 003 — Motion choreography as global CSS classes (`.stage` / `.rv`)

Status: **Accepted** · Date: 2026-07-17 · Deciders: Agustín De Giorgi (owner)
Relates to: spec 001 §4 (Motion language), spec 002 §4 (scroll reveals),
ADR 002 (precedent for scoped exceptions to utility-first)

## Context

Spec 001 §4 defines two site-wide motion behaviors, both present in the
approved prototype and part of its perceived quality:

1. **Entrance** — a once-per-load staggered fade-up of the hero elements
   (18px rise, 0.8s ease, delays ~0.1–0.46s).
2. **Scroll reveal** — section heads and cards fade up (26px, 0.7s) the first
   time they intersect the viewport (threshold 0.12, once).

Neither maps onto per-component Tailwind utilities cleanly: the entrance
requires a keyframe plus a *stagger family* of animation delays, and the reveal
requires a hidden initial state toggled by a runtime class (`.in`) added by an
IntersectionObserver. Expressing delays/initial states as arbitrary values is
forbidden (CLAUDE.md), and duplicating keyframe wiring across components would
scatter one animation language over many files.

## Decision

Encode the motion language once in `globals.css` as small global classes:

- `.stage` + `.stage-2…-5` — entrance keyframe (`stage-in`) with the prototype's
  stagger delays. Applied by server components (hero) — zero JS.
- `.rv` / `.rv.in` — scroll-reveal initial/final states. The `in` class is added
  by the shared `Reveal` client component
  (`web/src/components/layout/Reveal.tsx`), the only JS involved.
- A `prefers-reduced-motion` block forces both to their final, fully visible
  state (spec 001 §4: reduced motion renders content in final state).

This extends the ADR-002 exception category: cross-cutting, non-tokenizable
CSS (background paint, motion choreography) lives in `globals.css`; everything
component-shaped stays utility-first.

## Consequences

**Positive**
- One definition of the motion language; retiming it is a one-file change
  (matches how the prototype itself is written).
- Hero entrance costs no JavaScript; only `Reveal` ships a (tiny) client bundle.
- Reduced-motion behavior is enforced centrally and cannot be forgotten
  per-component.

**Negative / trade-offs**
- Two more global class families outside utility-first; bounded and documented
  here, referenced from a `globals.css` comment.
- `.stage-N` ordering is manual at the call site (hero); acceptable at this
  scale (5 elements, one section).

## Alternatives considered

1. **Tailwind arbitrary values** (`[animation-delay:.32s]`, `[&.in]:opacity-100`).
   Rejected: forbidden by the no-arbitrary-values rule and unreadable.
2. **Tokenize each delay and build utility variants.** Rejected: five one-off
   choreography constants are not design tokens; would bloat the theme.
3. **Motion (Framer Motion) components.** Rejected: spec 002 §5 explicitly
   forbids Motion/GSAP in this phase ("CSS + IntersectionObserver + rAF only"),
   and it would ship JS for an effect CSS does for free.
4. **Per-component `<style>` or CSS modules.** Rejected: fragments a single
   animation language across files; harder to keep consistent with spec 001 §4.
