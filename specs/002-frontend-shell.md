# Spec 002 — Frontend Shell & Page Structure

Status: **Accepted (v4) — shell complete, merged to `develop`** · Depends on:
000, 001 · Implements first.
Visual reference: `docs/design-reference/hero-prototype.html` (prototype v2,
approved). Changelog v2: full-page structure (journey/work/stack/contact),
simplified console, docked omni-bar (see spec 003), command palette moved to
Phase 4 backlog, mobile-first requirements formalized.
Changelog v3 (build-time reconciliation, project starting from scratch):
console/dock is a reserved slot in this shell, its interactivity lives in spec
003 (§2, §4.2); stack pinned to actual versions (Next 16.2.10 / Tailwind 4.2,
CSS-first `@theme`); deployment/CI/SEO artifacts split into a separate later
effort (§7, §9); review viewports aligned to 390/768/1440 (§3). See
`docs/adr/001-token-architecture-tailwind-v4-css-first.md`.
Changelog v4: shell implementation complete (all six page sections built and
reviewed phase-by-phase). SEO/metadata and deployment (former §6-7) extracted
to **spec 004** now that they can be tracked against the console/dock (spec
003) landing too, instead of against a still-in-progress shell.
Changelog v5: real content landed via **spec 005** (content & voice pass).
Journey stays at six steps, but the owner corrected two shapes: Full-Stack
Developer and Backend Mentor are independent, concurrent roles rather than
one merged step; the Oct 2025 architecture scope expansion is not a separate
official title, so it's folded into the Tech Lead step's narrative rather
than becoming its own "Software Architect" step. Work cards dropped their
stub-link affordance (no case-study pages exist yet), Contact gained a CV
download button. §4.3, §4.4, §4.6, §6 updated to match.

## 1. Goal

The complete single-page site shell: global layout, nav, background system,
hero (with the console slot — spec 003), career journey timeline, work
section, stack strip, contact section — statically buildable and mobile-first.
Exit = `npm run build` clean, all acceptance criteria in §7 met, merged to
`develop`. Live deployment is spec 004's exit condition, not this spec's.

## 2. Project setup

- `create-next-app` in `web/`: TypeScript, App Router, Tailwind, ESLint,
  `src/` directory, import alias `@/*`. Pinned stack: **Next.js 16.2.10**
  (App Router, Turbopack + React 19 defaults), **Tailwind CSS 4.2** (CSS-first:
  tokens + `@theme` in `globals.css`, no `tailwind.config.js`). Fonts via the
  self-hosted `geist` package (`GeistSans`/`GeistMono`), equivalent to
  `next/font/local`.
- TypeScript `strict: true`. Prettier + `prettier-plugin-tailwindcss`;
  `npm run lint` runs both.
- Directory shape:

```
web/src/
├── app/
│   ├── layout.tsx        # fonts, metadata, background layers, nav
│   ├── page.tsx          # home (all sections)
│   └── globals.css       # tokens from spec 001
├── components/
│   ├── layout/           # Nav, DotField, AmbientGlow
│   ├── hero/             # Eyebrow, GradientHeadline
│   ├── console/          # spec 003 (Console + Dock)
│   ├── journey/          # Timeline, TimelineStep
│   ├── work/             # WorkCard
│   ├── contact/          # Contact, HttpStatusBadge
│   └── ui/               # Chip, Tag, StatusPill, Button
├── content/
│   └── messages.ts       # ALL copy + timeline data + links (single source)
└── lib/
```

## 3. Mobile-first (hard requirement)

- Base styles = 390px experience. Breakpoints (`sm:` 640, `md:` 768, `lg:` 1024)
  only ADD. Never `max-width` overrides to patch mobile after the fact.
- Full-height sections use `svh`, never `vh`.
- Interactive targets ≥ 44×44 px (chips, dock send, timeline anchors, buttons).
- Hover-only effects (specular border, card lift) must be pure enhancement:
  identical functionality without them on touch devices.
- Review order per phase: 390px → 768px → 1440px (the three reference viewports
  used across specs 001/003; Tailwind default breakpoints `sm:640 md:768 lg:1024`
  are the code-level tools that produce them). A phase is not done until the
  390px pass is clean.

## 4. Page sections (top to bottom)

1. **Nav** (fixed, glass): three zones per the prototype — wordmark (mono,
   dimmed TLD) left, anchor links Journey / Work / Contact **centered** (plain
   sans, not mono), status pill (role · focus, e.g. "Tech Lead · Fintech &
   AI" — see spec 005 for why this avoids "open to work" framing) right.
   Mobile: wordmark
   + status dot only (links live as in-page anchors; no hamburger in Phase 1).
2. **Hero** (min-height 100svh, centered): eyebrow → gradient headline
   ("Systems that move money. / AI that shows its work.", second line gold) →
   subline → **console slot** → scroll hint anchoring to #journey. This shell
   ships the slot as a **fixed-height reserved container** (the console's
   footprint) so spec 003 can mount the interactive console into it with zero
   CLS. Console interactivity itself is out of scope for this spec — see 003.
3. **Journey** (`#journey`): section header (eyebrow "01 · The journey") +
   vertical timeline. Left rail with scroll-driven gold progress fill; each
   step has node (lights gold when its top passes 55% viewport height),
   mono period label, role + org, 1–2 sentence narrative, tags. Six steps,
   data from `messages.ts`. Reduced motion: rail fully filled, all nodes lit.
   Implementation Phase 1: scroll listener + rAF (no GSAP).
   Desktop (lg+): two-column composition — a **sticky left header** (eyebrow +
   one-line intro) beside the timeline column, so the section fills wide
   viewports instead of a narrow centered ribbon. Collapses to single column
   (header above the timeline) below lg. Section container width is `max-w-6xl`,
   aligned with the nav.
4. **Work** (`#work`): header ("02 · Selected work", "Case studies, not
   screenshots.") + 3 cards (Gastra / Banking at scale / degiorgi.dev), each
   with kind label, title, summary. Static panels, not links — no case-study
   pages exist yet (content phase, per project roadmap); a "read case study"
   affordance returns when those pages do. Mobile: single column.
5. **Stack**: header "03 · Stack" + tools grouped by category + mono footnote
   ("// tools change. The discipline doesn't."). Categories render as `//
   category` mono comment labels (echoing the footnote's own comment syntax),
   each followed by a wrapped row of icon+label chips. Icons are monochrome
   (`currentColor`, never gold — accent discipline), vendored as local SVG
   path data extracted once from a third-party icon set (no runtime icon
   library dependency); tools without a known icon render label-only. Data
   lives in `messages.ts` as `stack.categories: { label, tools: { name, icon?
   } }[]`.
6. **Contact** (`#contact`): gradient headline CTA, subline, actions (a
   single gold pill with two click zones: email text opens a mail app, an
   inline copy icon copies it, ghost CV download (download icon) /
   LinkedIn / GitHub / X), `GET /contact → 200 OK` badge. All URLs from
   `messages.ts`. The gold pill is hand-built in `Contact.tsx` rather than
   composed from `Button` + `CopyButton` side by side — two adjacent pills
   read as unrelated controls; one pill with an internal divider reads as
   one action with an option. Copy affordance is
   `components/ui/CopyButton.tsx` (spec 005); download/copy icons are
   hand-built glyphs in `components/ui/icons.tsx`, not vendored brand marks
   (contrast §4.5).
7. **Dock** (fixed): specified in spec 003; not built in this shell. The
   contact section still reserves its bottom clearance (§4.6) so 003 adds no CLS.

Scroll reveals: fade-up via IntersectionObserver on section heads and cards.

## 5. Rendering & performance (gate, not guideline)

- Statically generated; no server dependency at runtime.
- Server Components by default. Client components allowed only for: Console,
  Dock, Timeline progress, scroll reveals, specular hover. Each justifies its
  `"use client"` in a one-line comment.
- Budgets: initial JS ≤ 100 kB gzip; LCP < 1.5 s (mobile, slow 4G); CLS < 0.02;
  Lighthouse mobile ≥ 95 all categories.
- Fonts via `next/font` (Geist, Geist Mono) with zero-CLS configuration.
- No Motion/GSAP in this spec: CSS + IntersectionObserver + rAF only.

## 6. Owner-provided data (blockers for content, not for build)

Real timeline dates, email address, LinkedIn/GitHub/X URLs, and CV file are
in. Content sourcing, voice, and remaining gaps are tracked in **spec 005**;
the Contact subline is still `PLACEHOLDER` there.

## 7. Acceptance criteria

- [x] `npm run build` clean (static generation, no runtime server dependency).
- [x] 390px pass: no horizontal scroll, all targets ≥ 44px, contact reserves
      dock clearance (safe-area), timeline readable, sections verified against
      prototype v2.
- [x] Timeline progress + node lighting work on scroll; reduced-motion renders
      final state.
- [x] All interactivity keyboard-operable; AA contrast verified.
- [x] Zero copy strings hardcoded in components (grep-verified).
- [x] Console slot present as a fixed-height reserved container (interactivity
      is spec 003).

SEO/metadata (beyond the minimal `metadata` export), deployment, CI, and
production performance budgets (Lighthouse, bundle size) are **spec 004**'s
acceptance criteria, not this spec's — see `specs/004-deployment-and-seo.md`.
