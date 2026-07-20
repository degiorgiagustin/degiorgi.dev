# Spec 004 — Deployment, SEO & Metadata

Status: **Accepted** · Depends on: 002 (frontend shell), 003 (console & dock) ·
Extracted from spec 002 §6-7 (v3) now that the shell is complete and merged to
`develop`. Split out as its own spec so deployment/SEO work can be tracked
independently once spec 003 also lands — the site should go live with its
full intended feature set, not a console-less partial version.

## 1. Goal

Take the static shell (spec 002) plus the console/dock (spec 003) live at
degiorgi.dev, with the remaining SEO artifacts and CI gating in place. Exit =
site reachable at degiorgi.dev, Lighthouse/bundle budgets verified in
production, `develop → main` merged.

## 2. SEO & metadata

A minimal `metadata` export (title "Agustín De Giorgi — Software Engineer" +
description) already ships in `layout.tsx` as of spec 002 — it was intrinsic
to the App Router scaffold and not worth deferring. Remaining here:

- Canonical URL, OG/Twitter card (static placeholder).
- JSON-LD `Person` (name, jobTitle, sameAs from `messages.ts`).
- `robots.txt` + `sitemap.xml`.

## 3. Deployment

- Vercel project, root `web/`, production branch `main`, PR previews.
- Custom domain degiorgi.dev + www redirect. Vercel Analytics.
- GitHub Actions `ci.yml`: lint + build on PR (path-filtered `web/**`).
- The SEO artifacts listed in §2.

## 4. Acceptance criteria

- [ ] Reachable at degiorgi.dev.
- [ ] Lighthouse mobile ≥ 95/95/95/100 on `/`.
- [ ] Initial JS gzip size does not regress past the reviewed baseline in
      `web/bundle-budget.json` (bundle report posted on every PR; see
      `docs/adr/005-bundle-budget-regression-baseline.md` for why this
      replaced a fixed 100 kB ceiling that predated Next.js 16/React 19).
- [ ] CI (`ci.yml`) green on PR: lint + build, path-filtered `web/**`.
- [ ] JSON-LD `Person` validates; `robots.txt`/`sitemap.xml` reachable.
