# ADR 006 — Scroll rendering cost: content-visibility, pointer suspension, nav blur

Status: **Accepted** · Date: 2026-07-20 · Deciders: Agustín De Giorgi (owner)
Relates to: spec 001 §2/§4 (blur budget, motion language), spec 002 §4
(section composition), CLAUDE.md (performance budget, mobile-first)

## Context

A performance investigation (Chrome DevTools Performance panel, several
recordings against both `npm run dev` and a production build, analyzed via
raw trace-event parsing) found dropped-frame rates of 50-60% while scrolling
the full site at desktop viewport widths, versus ~14% at a 390×844 mobile
viewport — same code, same build, only the viewport size and consequently
the amount of on-screen, hover-reactive content differed.

Once dev-mode noise (React's development scheduler overhead) was excluded
by testing a production build, the dominant cost was the browser's own
rendering pipeline — style recalculation, pre-paint, and hit-testing —
not application JavaScript. Two concrete drivers were isolated:

1. Every section's styles, sticky positioning, and hover state were being
   tracked by the browser on every scroll frame regardless of whether that
   section was anywhere near the viewport.
2. The bulk of the style-recalculation work was many small, frequent passes
   (a majority touching 5 or fewer elements each) — consistent with the
   browser re-resolving `:hover` state on every scroll frame as page content
   slides underneath a stationary cursor, which requires hit-testing.
   Desktop's wider, multi-column layouts put more hoverable elements on
   screen simultaneously than the single-column mobile layout, which is
   also why the mobile viewport measured so much better.

A controlled test (temporarily removing the nav's `backdrop-blur-lg`,
re-measuring) confirmed blur was a real but minor contributor (~29% of
paint cost), not the dominant one.

## Decision

Two changes, kept — both invisible; and one change tried and reverted by
explicit owner choice:

1. **`content-visibility: auto` on every page section** (`.section-cv`,
   applied via `PageSection` and directly on `Hero`). The browser skips
   style/layout/paint work for a section entirely while it isn't near the
   viewport, instead of continuously tracking all five sections on every
   scroll frame. `contain-intrinsic-size: auto 900px` gives it a
   placeholder height before first render so the page doesn't jump; the
   real measured height takes over afterward (the platform's own
   "remembered size" behavior).
2. **Suspend pointer interaction on `<main>` while actively scrolling**
   (`ScrollPointerGate.tsx` toggles `body.is-scrolling`, consumed by a
   `pointer-events: none` rule scoped to `<main>`, 150ms settle after
   scroll stops). This directly removes the dominant measured cost: hover
   can't meaningfully register mid-scroll anyway, so nothing is lost.
   Scoped to `<main>` only — Nav is a sibling in the DOM, and the dock
   explicitly sets its own `pointer-events` in both states, so neither is
   affected by inheritance from this rule.
3. **Nav's blur was tried as both a static solid-fallback swap and a
   scroll-adaptive toggle (true blur at rest, solid while `.is-scrolling`),
   and both were reverted.** The static swap measured ~29% less paint
   self-time — real, but a minor slice next to (1) and (2). The adaptive
   version preserved that saving while keeping full glassmorphism at rest,
   but the owner found the visible transition between states while
   scrolling looked wrong in practice and asked for it to be dropped.
   **Nav keeps `backdrop-blur-lg` unconditionally, unchanged from before
   this ADR** — the measured win wasn't worth the visual cost either way it
   was tried.

## Consequences

**Positive**
- Directly targets the two measured, dominant causes rather than guessing;
  each was verified with trace data before and after the corresponding
  change (nav blur) or the underlying mechanism (content-visibility,
  pointer suspension) is a standard, widely-documented browser behavior
  rather than a novel technique.
- Zero visual change from either kept fix (1, 2). (3) was tried twice and
  explicitly declined by the owner in favor of keeping the design fully
  intact — the tradeoff was made deliberately, not skipped by default.
- No new dependencies; no change to component APIs or the AgentAdapter
  contract; no change to any spec's acceptance criteria.

**Negative / trade-offs**
- `content-visibility: auto` is a new pattern in this codebase (a scoped
  exception to utility-first styling, same category as `.dot-field`/
  `.timeline-fill`/`.rv` — see ADRs 002/003). `contain-intrinsic-size`'s
  placeholder height is a guess for content never yet rendered; a section
  far taller or shorter than 900px will show a brief size correction on its
  first-ever render, never again after (measured size is remembered).
- Suspending pointer-events during scroll means a click that lands within
  ~150ms of the last scroll event on `<main>` is dropped. This is standard,
  imperceptible behavior in practice (momentum scrolling already makes
  precise clicks unreliable in that window on every platform) but is a
  real, deliberate behavior change worth naming.
- Nav's blur remains the one standing blur layer present for the entire
  session (vs. console/dock blur, only present in specific view states);
  it's a small, known, accepted cost in exchange for keeping the design.

## Alternatives considered

1. **`will-change: transform` on hover-reactive elements.** Rejected as the
   primary fix: it promotes elements to their own compositor layer for
   cheaper *paint*, but does nothing for the *hit-testing* cost of
   resolving which element is hovered as content moves under the cursor —
   the actual dominant cost measured.
2. **Remove hover effects entirely at desktop widths.** Rejected: throws
   away real design value for a smaller win than content-visibility +
   pointer suspension already deliver, and directly conflicts with "keep
   the design" as a stated goal.
3. **Manual IntersectionObserver-gated mount/unmount per section.** Rejected:
   `content-visibility: auto` is the platform-native version of the same
   idea, with automatic size memory and no React state/re-render involved.
