# Spec 002 — Frontend Shell & Page Structure

Status: **Accepted (v3)** · Depends on: 000, 001 · Implements first.
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

## 1. Goal

A deployable Next.js application containing the complete single-page site:
global layout, nav, background system, hero (with the console slot — spec 003),
career journey timeline, work section, stack strip, contact section, and the
deployment pipeline. Exit = site live on Vercel behind degiorgi.dev.

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
│   ├── contact/          # ContactSection, HttpStatusBadge
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
   sans, not mono), status pill "Open to senior roles" right. Mobile: wordmark
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
   with kind label, title, summary, "read case study →" affordance (stub links
   in Phase 1). Mobile: single column.
5. **Stack**: header "03 · Stack" + wrapping tag line + mono footnote
   ("// tools change. The discipline doesn't.").
6. **Contact** (`#contact`): gradient headline CTA, subline, actions (gold
   mailto button + ghost LinkedIn/GitHub/X), `GET /contact → 200 OK` badge.
   All URLs from `messages.ts`.
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

## 6. SEO & metadata

A **minimal** `metadata` export (title "Agustín De Giorgi — Software Engineer" +
description) ships in `layout.tsx` from the start — it is intrinsic to the App
Router scaffold. The remaining SEO artifacts are part of the deferred effort in
§7:

- Canonical URL, OG/Twitter card (static placeholder).
- JSON-LD `Person` (name, jobTitle, sameAs from `messages.ts`).
- `robots.txt` + `sitemap.xml`.

## 7. Deployment (deferred — separate effort)

The build phase produces a locally-buildable static shell (`npm run build`
clean). The following are split into a dedicated deployment effort because they
require owner credentials (Vercel account, domain) and are independent of the
shell code:

- Vercel project, root `web/`, production branch `main`, PR previews.
- Custom domain degiorgi.dev + www redirect. Vercel Analytics.
- GitHub Actions `ci.yml`: lint + build on PR (path-filtered `web/**`).
- The SEO artifacts listed in §6 (excluding the minimal `metadata` export).

## 8. Owner-provided data (blockers for content, not for build)

`messages.ts` ships with clearly marked placeholders until the owner supplies:
real timeline dates, email address, LinkedIn/GitHub/X URLs, CV file.

## 9. Acceptance criteria

Shell (this effort):

- [ ] `npm run build` clean (static generation, no runtime server dependency).
- [ ] 390px pass: no horizontal scroll, all targets ≥ 44px, contact reserves
      dock clearance (safe-area), timeline readable, sections verified against
      prototype v2.
- [ ] Timeline progress + node lighting work on scroll; reduced-motion renders
      final state.
- [ ] All interactivity keyboard-operable; AA contrast verified.
- [ ] Zero copy strings hardcoded in components (grep-verified).
- [ ] Console slot present as a fixed-height reserved container (interactivity
      is spec 003).

Deferred to the deployment effort (§7): reachable at degiorgi.dev; Lighthouse
mobile ≥ 95/95/95/100 on `/`; initial JS ≤ 100 kB gzip (bundle report on PR).
