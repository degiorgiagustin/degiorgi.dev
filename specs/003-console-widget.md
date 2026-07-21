# Spec 003 — Console & Docked Omni-bar

Status: **Accepted (v2)** · Depends on: 001, 002 · The signature feature.
Changelog v2: simplified anatomy (single prompt line, no terminal chrome),
trace demoted to progressive disclosure inside answers, NEW docked omni-bar
that persists while scrolling, mobile behaviors specified.

## 1. Goal

One agent, two surfaces:

- **Hero console**: the full-size entry point in the hero.
- **Dock**: a compact pill-shaped omni-bar fixed to the bottom of the viewport,
  appearing when the hero console scrolls out of view — the agent stays one
  glance away during the whole journey.

Both run against the same adapter and share session state. Phase 1 uses a
**mock adapter** with the exact interface the real agent implements in Phase 3;
the UI must not change when the backend becomes real.

## 2. Hero console anatomy (simplified)

```
        · ask my agent — it answers from my real work        ← label (mono, dot)
┌───────────────────────────────────────────────┐
│ ~ %  <input, animated placeholder>    [ask ↵] │            ← prompt line
│  [chip]  [chip]  [chip]                        │            ← 3 curated chips
│ ── answer area (hidden until first question) ──│
└───────────────────────────────────────────────┘
```

- Glass panel per spec 001 with the specular pointer-tracking border
  (desktop-only enhancement; static border on touch).
- No terminal chrome (no traffic lights, no top bar): ONE visual idea — the
  prompt line.
- Animated cycling placeholder (typing effect; static first phrase under
  reduced motion).
- Chips (from `messages.ts`): "What have you built?" / "How does this site
  work?" / "From banking to AI". Click = submit.

### Answers & progressive trace disclosure

- Answer renders inside the console, streamed. Footer row (mono, small):
  `<totalMs>ms · <n> chunks` + a `view retrieval trace` text button.
- The trace detail (chunks with source · section + gold score, latency/token
  meta) is collapsed by default and toggles inline. Non-technical visitors
  never see it; technical ones find it in one click. This replaces v1's
  always-visible trace toggle.

## 3. Dock (omni-bar) behavior

- **Appear/hide**: IntersectionObserver on the hero console wrapper. Out of
  view → dock slides up (translateY + opacity, ~450ms, `cubic-bezier(.32,.72,.28,1)`);
  back in view → dock hides. Reduced motion: instant toggle.
- **Geometry**: fixed, bottom-centered; `width: min(560px, 100% - 32px)`;
  `bottom: max(16px, env(safe-area-inset-bottom) + 8px)` (iOS home indicator).
- **Anatomy**: pill glass bar — `~ %` prefix, input, gold "ask" button
  (≥ 44px target).
- **Answers**: render in a floating card ABOVE the bar (same width), with a
  close button and the same footer/trace pattern as the hero console. Card is
  dismissed on close, on Esc, and on submitting a new question (replaced).
- **Mobile keyboard**: when the input focuses and the virtual keyboard opens,
  the dock must remain visible above the keyboard (verify with
  `visualViewport`; adjust `bottom` if the fixed positioning is obscured on
  iOS Safari). This is an explicit test case, not an afterthought.
- **Page clearance**: the last section (`contact`) gets bottom padding ≥ dock
  height + 24px so the dock never covers final content.
- Only one blurred dock layer counts toward the 3-blur budget; if answer card
  + bar + nav exceed it on mobile, the answer card uses `--glass-solid`
  (near-opaque) instead of blur.

## 4. Shared session model

- `AgentSession` (client-side module, not a state library): holds sessionId,
  question count, and last answer. Hero console and dock are two views over it —
  a question asked in the dock counts toward the same session cap.

## 5. Agent adapter contract

```ts
// lib/agent/types.ts
export interface AgentQuery { question: string; sessionId: string; }

export interface TraceChunk { source: string; section: string; score: number; }
export interface TraceMeta {
  embedMs: number; searchMs: number; llmMs: number; totalMs: number;
  tokensIn: number; tokensOut: number;
}
export interface AgentAnswer {
  kind: "answer";
  text: string;                    // may arrive as a stream of deltas
  sources: string[];
  trace: { chunks: TraceChunk[]; meta: TraceMeta };
}
export interface AgentRejection {
  kind: "rejection";
  reason: "off_topic" | "rate_limited" | "budget_exhausted" | "unavailable";
  text: string;                    // human-readable, on-brand
  trace?: { chunks: TraceChunk[]; meta: Partial<TraceMeta> };
}
export type AgentResponse = AgentAnswer | AgentRejection;

export interface AgentAdapter {
  ask(q: AgentQuery, onDelta?: (chunk: string) => void): Promise<AgentResponse>;
}
```

`MockAgentAdapter` (Phase 1): canned answers for the 3 chips, generic canned
answer for free text, simulated 500–900ms latency with streaming deltas, and a
canned `off_topic` rejection for one hardcoded trigger — the rejection UX is
designed now. Rejection copy example: *"That's outside my index — nothing in
Agustín's corpus scores above the relevance threshold for that. Try asking
about Gastra, banking platforms, or how this site works."* With trace open, it
shows the best-scoring chunk BELOW threshold: the guardrail is part of the demo.

Session cap: after N questions (default 10) the adapter returns
`budget_exhausted`; both surfaces show a friendly lockout pointing to
email/LinkedIn. Client-enforced by the mock in Phase 1; server-enforced in
Phase 3 with identical client copy.

Revised spec 005: this hand-off row isn't exclusive to `budget_exhausted`
anymore. It also renders for `unavailable` and for the mock's own free-text
`generic` fallback, since all three end the exchange by pointing the user at
direct human contact instead of embedding the email as inert prose inside
the answer text. The email is a real `mailto:` link plus an adjacent
`CopyButton` (`components/ui/CopyButton.tsx`), not a link whose click
behavior got silently swapped to copy-only. LinkedIn/GitHub/X render as
borderless icon links (`components/ui/IconLink.tsx`) instead of the plain
text word "LinkedIn" — same monochrome `Icon` component Stack uses, sized to
the 44px touch floor but without Button's bordered ghost treatment (too
heavy for this compact inline row).

Which responses trigger the hand-off is adapter-driven: `AgentAnswer` and
`AgentRejection` both carry an optional `showContact?: boolean`
(`lib/agent/types.ts`), set by `MockAgentAdapter` on `budget_exhausted`,
`unavailable`, and the generic free-text fallback. The UI reads that flag
directly rather than inferring it from `response.text` — text is free-form
copy the real Phase 3 backend won't reproduce verbatim, so a text-equality
check would have silently stopped working the moment the mock was swapped
out. The `AnswerBlock` accessibility region also narrowed: only the
streamed question/answer text is `aria-live="polite"`; the contact row and
trace footer render outside it so settling doesn't dump a growing set of
focusable controls into a live region on every answer.

## 6. States & accessibility

- Idle → typing → submitted (input disabled, subtle activity indicator) →
  streaming → settled. Errors render as `unavailable` rejection, never broken UI.
- Both widgets dynamic-imported; hero renders a static same-size facsimile
  until hydration (zero CLS). The dock renders nothing until hydration (it is
  invisible at load by definition).
- Input reachable by Tab; trace disclosure is a real `<button>`; answer areas
  `aria-live="polite"`; dock answer card focus-managed (focus moves in on open,
  returns to input on close).

## 7. Out of scope (Phase 3+)

Real retrieval, server-side rate limiting, Turnstile, Langfuse, conversation
memory, EN/ES answers, command palette (Phase 4 backlog).

## 8. Acceptance criteria

- [ ] Visual parity with prototype v2 at 390/768/1440.
- [ ] 3 chips produce streamed mock answers; trace disclosure works in both surfaces.
- [ ] Dock appears/hides correctly on scroll in both directions; safe-area respected.
- [ ] Mobile keyboard test passes on iOS Safari and Android Chrome (dock +
      input visible while typing).
- [ ] Off-topic trigger produces rejection UX with sub-threshold trace.
- [ ] Session cap shared across surfaces; lockout state reachable and well-designed.
- [ ] Zero CLS from dynamic imports.
- [ ] Mock and real adapter swappable via a single import site.
