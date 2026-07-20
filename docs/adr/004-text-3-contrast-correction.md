# ADR 004 — Correct `--text-3` to meet WCAG AA contrast

Status: **Accepted** · Date: 2026-07-20 · Deciders: Agustín De Giorgi (owner)
Relates to: spec 001 §2 (Color tokens), spec 003 (Console & Docked Omni-bar),
CLAUDE.md (Accessibility floor: WCAG AA contrast)

## Context

A post-PR audit of spec 003 (`frontend-code-reviewer` agent, PR #3) computed the
actual contrast ratio of `--text-3` (`#5c6168`) against `--bg` (`#0a0a0c`) and
found ~3.17:1 — below the 4.5:1 WCAG AA floor for text at this size. The token
predates spec 003; it was defined in spec 001 and already used across 16 files
(`Nav`, `WorkCard`, `Timeline`, `HttpStatusBadge`, etc.). Spec 003 did not
introduce the failure, but it materially expanded the token's surface area —
the console label, the streaming-activity line, the trace footer stats, and
the dock's muted close button all consume it — onto new, recruiter-facing
content, which is why the audit caught it now.

CLAUDE.md treats `docs/adr/*` and `specs/*` as the source of truth and requires
resolving spec inconsistencies at the source rather than patching around them
silently. `--text-3` failing the project's own accessibility floor is exactly
such an inconsistency: the token's stated purpose (readable tertiary/meta text)
contradicts its measured behavior.

## Decision

Lighten `--text-3` from `#5c6168` to `#767b83`. This is a single-value change
in `globals.css`'s `:root` block and the spec 001 token table — no component
touches a raw hex, so every one of the 16 existing consumers plus spec 003's
new ones update automatically.

The new value was chosen to:
- Clear 4.5:1 against `--bg` with a small margin (~4.64:1), not just scrape by.
- Preserve the token's relative-luminance ordering and cool-gray hue
  (`R < G < B`, same ratio of channel spread as the original) so it still
  reads as "the darkest of the three text tones," just lighter.

## Consequences

**Positive**
- One token fix, applied everywhere at once — no per-component patches, no
  drift between old and new consumers.
- Closes a genuine accessibility gap on already-shipped surfaces (nav, work
  cards, timeline), not just the new console.
- Spec 001's acceptance checklist now has an explicit, verified AA line item
  for this token instead of an implicit assumption.

**Negative / trade-offs**
- Every existing tertiary/meta text on the site becomes marginally lighter.
  This is a visual change outside spec 003's own scope, landing as a side
  effect of that PR's review. Acceptable: it moves the site into compliance
  with its own stated accessibility floor rather than away from it.
- If a future component needs a genuinely low-contrast decorative gray (not
  meant to be read as text), it can no longer reuse `--text-3` for that — a
  new token would be needed. No such use case exists today.

## Alternatives considered

1. **Leave `--text-3` as-is; treat it as known pre-existing debt.** Rejected:
   this PR is exactly the trigger event (expanding the token onto new
   content), and CLAUDE.md's own workflow says to resolve spec inconsistencies
   at the source when found, not defer indefinitely.
2. **Introduce a separate token for on-glass mono metadata, keep `--text-3` at
   its original dark value for other uses.** Rejected for now: no current
   consumer actually needs `--text-3` to fail contrast on purpose; splitting
   the token would add a second tertiary gray to maintain without a concrete
   use case demanding it. Revisit if one appears.
3. **Jump straight to `--text-2`'s value instead of a new intermediate gray.**
   Rejected: would collapse the secondary/tertiary distinction spec 001 §2
   defines; the corrected value keeps three visually distinct text tones.
