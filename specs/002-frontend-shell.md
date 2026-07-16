# Spec 002 — Frontend Shell & Page Structure

Status: **Accepted (v2)** · Depends on: 000, 001 · Implements first.
Visual reference: `docs/design-reference/hero-prototype.html` (prototype v2,
approved). Changelog v2: full-page structure (journey/work/stack/contact),
simplified console, docked omni-bar (see spec 003), command palette moved to
Phase 4 backlog, mobile-first requirements formalized.

## 1. Goal

A deployable Next.js application containing the complete single-page site:
global layout, nav, background system, hero (with the console slot — spec 003),
career journey timeline, work section, stack strip, contact section, and the
deployment pipeline. Exit = site live on Vercel behind degiorgi.dev.

## 2. Project setup

- `create-next-app` in `web/`: TypeScript, App Router, Tailwind, ESLint,
  `src/` directory, import alias `@/*`.
- TypeScript `strict: true`. Prettier configured; `npm run lint` runs both.
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
- Review order per phase: 390px → 768px → 1440px. A phase is not done until
  the 390px pass is clean.

## 4. Page sections (top to bottom)

1. **Nav** (fixed, glass): wordmark (mono), anchor links Journey / Work /
   Contact, status pill "Open to senior roles". Mobile: wordmark + status dot
   only (links live as in-page anchors; no hamburger in Phase 1).
2. **Hero** (min-height 100svh, centered): eyebrow → gradient headline
   ("Systems that move money. / AI that shows its work.", second line gold) →
   subline → **console** (spec 003) → scroll hint anchoring to #journey.
3. **Journey** (`#journey`): section header (eyebrow "01 · The journey") +
   vertical timeline. Left rail with scroll-driven gold progress fill; each
   step has node (lights gold when its top passes 55% viewport height),
   mono period label, role + org, 1–2 sentence narrative, tags. Six steps,
   data from `messages.ts`. Reduced motion: rail fully filled, all nodes lit.
   Implementation Phase 1: scroll listener + rAF (no GSAP).
4. **Work** (`#work`): header ("02 · Selected work", "Case studies, not
   screenshots.") + 3 cards (Gastra / Banking at scale / degiorgi.dev), each
   with kind label, title, summary, "read case study →" affordance (stub links
   in Phase 1). Mobile: single column.
5. **Stack**: header "03 · Stack" + wrapping tag line + mono footnote
   ("// tools change. The discipline doesn't.").
6. **Contact** (`#contact`): gradient headline CTA, subline, actions (gold
   mailto button + ghost LinkedIn/GitHub/X), `GET /contact → 200 OK` badge.
   All URLs from `messages.ts`.
7. **Dock** (fixed): specified in spec 003.

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

- `metadata` export: title "Agustín De Giorgi — Software Engineer",
  description, canonical, OG/Twitter card (static placeholder Phase 1).
- JSON-LD `Person` (name, jobTitle, sameAs from `messages.ts`).
- `robots.txt` + `sitemap.xml`.

## 7. Deployment

- Vercel project, root `web/`, production branch `main`, PR previews.
- Custom domain degiorgi.dev + www redirect. Vercel Analytics.
- GitHub Actions `ci.yml`: lint + build on PR (path-filtered `web/**`).

## 8. Owner-provided data (blockers for content, not for build)

`messages.ts` ships with clearly marked placeholders until the owner supplies:
real timeline dates, email address, LinkedIn/GitHub/X URLs, CV file.

## 9. Acceptance criteria

- [ ] Deployed and reachable at degiorgi.dev; `npm run build` clean.
- [ ] Lighthouse mobile ≥ 95/95/95/100 on `/`.
- [ ] Initial JS ≤ 100 kB gzip (bundle report attached to PR).
- [ ] 390px pass: no horizontal scroll, all targets ≥ 44px, dock respects
      safe-area, timeline readable, sections verified against prototype v2.
- [ ] Timeline progress + node lighting work on scroll; reduced-motion renders
      final state.
- [ ] All interactivity keyboard-operable; AA contrast verified.
- [ ] Zero copy strings hardcoded in components (grep-verified).
