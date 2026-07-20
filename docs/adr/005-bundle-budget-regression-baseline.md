# ADR 005 — Bundle budget: regression baseline instead of a fixed ceiling

Status: **Accepted** · Date: 2026-07-20 · Deciders: Agustín De Giorgi (owner)
Relates to: CLAUDE.md (Performance budget), spec 004 §4 (acceptance criteria)

## Context

CLAUDE.md's hard constraint reads: "initial JS ≤ 100 kB gzip." Spec 004 §4
inherits this as an acceptance criterion for the deployment PR. The number
predates Next.js 16 / React 19; it was never re-measured against them.

A production build of `develop` (Next.js 16.2.10, React 19.2.7) measures
**131,353 bytes gzip** across `rootMainFiles`
(`.next/build-manifest.json`, gzipped with `zlib.gzipSync` — a real
measurement, not an estimate). At the time of measurement, `web/package.json`
declares zero runtime dependencies beyond `next`, `react`, `react-dom`, and
`geist` — Motion and GSAP, the two libraries CLAUDE.md anticipates, are not
yet installed. String-marker inspection of the two largest chunks confirms
one of them contains the React DOM client (`hydrateRoot`/`createRoot`
present) — i.e. the measured total is substantially the React 19 +
Next.js 16 client-runtime floor, not application code.

There is no realistic path back to 100 kB without cutting into framework
internals the project doesn't control. Picking a different fixed number
instead (say, 140 kB) would only relocate the same problem: the next Next.js
or React major bump could push the floor past it again, and nothing in the
repo would notice until someone re-ran the same manual audit that caught this
one.

## Decision

Replace the fixed absolute ceiling with a **regression-gated baseline**:

- `web/bundle-budget.json` records the last consciously-accepted gzip total
  for `rootMainFiles`, plus a small tolerance for build nondeterminism.
- CI (`ci.yml`, spec 004 §3) computes the real gzip total on every PR the
  same way this ADR's figure was measured, and fails the build only if the
  total exceeds `gzipBytes + toleranceBytes` in the checked-in baseline.
- Growing the bundle is not forbidden — it requires updating
  `bundle-budget.json` in the same PR, which puts the new number in the diff
  for review instead of letting it drift in silently.
- The baseline is re-measured deliberately whenever `next`/`react` take a
  major version bump, exactly as it was here.

CLAUDE.md's hard-constraints line and spec 004 §4's acceptance criterion are
both reworded to point at this mechanism instead of "100 kB."

## Consequences

**Positive**
- The gate reflects reality: it can catch a genuine regression (an
  accidentally-bundled dependency, a lost dynamic import) on day one, instead
  of permanently reporting failure against a number nothing can hit.
- Every bundle-growing change is a visible, reviewed line in a diff, not a
  silent creep.
- Survives the next Next.js/React major bump without becoming a new lie —
  the baseline gets re-measured and bumped consciously instead of aging into
  another stale absolute number.

**Negative / trade-offs**
- No longer a single memorable number ("100 kB") to cite; the real budget is
  "don't regress past the last reviewed baseline," which is less quotable in
  a spec or a resume line.
- Relies on someone actually reviewing baseline bumps in PRs rather than
  rubber-stamping them — a regression-gate is only as good as the review
  discipline around the file it gates on.
- Does not, by itself, do anything to shrink the ~131 kB floor. If a future
  phase wants a smaller number, that requires real bundle-reduction work
  (e.g. deferring more hydration, trimming the app-router client graph) as
  its own effort, not something this ADR claims to deliver.

## Alternatives considered

1. **Keep 100 kB and let CI fail permanently.** Rejected: a gate everyone
   knows is unwinnable teaches the team (of one) to ignore CI red, which
   defeats the point of having a gate at all.
2. **Pick a new fixed number instead (e.g. 140 kB).** Rejected: the exact
   problem being fixed — a number chosen once and never revisited going
   stale against the next framework bump. A new fixed ceiling is the same
   failure mode on a delay, not a fix for it.
3. **Percentage-based tolerance instead of a flat byte tolerance.** Considered
   for the `toleranceBytes` field; rejected in favor of a flat 2,048 bytes for
   now — simpler to reason about at this bundle size, and there's no evidence
   yet that build-to-build gzip variance scales with total size enough to
   need a percentage. Revisit if the flat tolerance proves too tight or too
   loose in practice.
