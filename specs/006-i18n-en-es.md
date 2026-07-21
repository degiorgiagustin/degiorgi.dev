# Spec 006 — EN/ES Language Toggle

Status: **Phase 1 + 2 complete** (infrastructure and real Spanish content) ·
Depends on: 001 (design system), 002 (frontend shell), 003 (console widget),
005 (content & voice)

## 1. Goal

Serve the site in English (default) and Spanish, with Spanish reachable at
`/es` and English staying at the existing unprefixed root — no `/en` on the
URL a recruiter would put on a resume. Phase 1 (this spec's current state)
builds the full technical capability with `es` content still equal to `en`
(infrastructure only, not translation); Phase 2 lands real Spanish content
and makes the route discoverable.

## 2. Two decisions made explicitly, not defaulted into

- **URL-based routing, not a client-side toggle.** This site is
  Server-Components-by-default (CLAUDE.md's core architecture rule) — Hero,
  Journey, Work, Stack, and Contact all render on the server. A client-side
  toggle (localStorage, no URL change) can't make Server Components re-render
  with different content; making it work would mean converting nearly every
  content component to a Client Component, a real regression against the
  project's architecture and likely bundle-budget cost. URL-based routing
  keeps every page server-rendered — the server just renders the locale that
  matches the URL.
- **No `/en` prefix.** The owner's stated reason: the URL on a resume/LinkedIn
  should never change. Only non-default locales (`/es`) get a path segment.
  Concretely, this means English routes live at their normal root paths
  (`app/(main)/page.tsx`, a route group — parens don't affect the URL) and
  Spanish gets its own parallel tree (`app/es/page.tsx`), rather than a
  uniform `app/[locale]/...` dynamic segment that would need a rewrite trick
  to hide the default locale's prefix.

## 3. Content architecture: colocated, not split files

Every translatable field is `{ en: string; es: string }` (the `Localized`
type, `lib/i18n/locale.ts`), inline next to its English counterpart in the
single `content/messages.ts` — not two parallel files
(`messages.en.ts`/`messages.es.ts`). This was a deliberate choice over the
simpler-sounding two-file split, per explicit owner requirement: **future
content updates must be hard to get out of sync.** Two files can silently
drift (add a journey step to `en`, forget `es`, nothing catches it). One file
with `{ en, es }` on each field means TypeScript itself refuses to compile a
new array item missing its `es` half — the type requires both keys on the
same object literal, not "remember to update the other file later."

**Not every field is `Localized`.** Proper nouns (company names, product
names), URLs, tech/tool names, and `tags` stay plain strings — translating
"MobyDigital" or "Java" into itself is pointless duplication. The mono/
technical trace formatting (`footer.stats`, `traceMeta`, `contact.badge.*`)
also stays English-notation in both locales deliberately, matching the
site's terminal-voice aesthetic (spec 001 §1) — not an oversight.

**Locale-dependent URLs.** `links.linkedin` and `links.cv` are `Localized`
too, discovered mid-implementation: LinkedIn serves a genuinely different URL
per profile language (`?locale=en-US` vs. the bare Spanish-default URL, not
just decoration), and a real Spanish CV PDF already exists in the repo
(`/cv/CV_Agustin_De_Giorgi_es.pdf`, added alongside the English one earlier).
`github`/`x`/`email` stay plain — no per-language profile exists for those.

## 4. Locale resolution: explicit prop, after two failed shortcuts

`locale: Locale` is passed as a plain, explicit prop from each route file
down through every component that needs it. This is more verbose than a
hidden global, and it was not the first thing tried — two more "elegant"
mechanisms were built and both failed empirically, worth recording honestly
rather than glossing over:

1. **React's `cache()` memoizing a mutable `{ current: Locale }` singleton**,
   set once by a `setLocale()` call and read anywhere via `getLocale()` — the
   same technique `next-intl` and similar libraries use internally. This
   shipped, built cleanly, and *looked* correct. Testing `/es` directly
   revealed it wasn't: Next.js's static build can interleave multiple
   routes' rendering within one build worker process, and a shared mutable
   object doesn't survive that safely. The generated `/es` HTML mixed
   correctly-resolved `"es"` values with stale `"en"` ones left over from
   `/`'s generation happening nearby in the same worker — verified directly
   by grepping the built `.next/server/app/*.html` output, not assumed.
2. **React Context, read via `use()`.** Context is core React machinery,
   correctly scoped per render tree regardless of build scheduling, so this
   looked like the fix for (1)'s race. It failed differently: Next.js
   disallows calling a *function* imported from a `"use client"` module
   directly from server code (`getLocale()`/`t()` needed `"use client"` for
   the `createContext()` call to be renderable as `<LocaleContext value={x}>`
   from a Server Component), and separately, `use()` on a Context object that
   had crossed the client/server boundary errored outright ("Cannot use() an
   already resolved Client Reference"). Splitting the Context object into its
   own `"use client"` file didn't fix the second error.

Both failures are specific to Next.js's Server Component boundary, not
theoretical — each was caught by actually rebuilding and grepping the static
output for the one thing (`links.linkedin`'s two different URLs) that would
visibly differ between `/` and `/es` even with placeholder content. **Every
new locale mechanism should be verified the same way before being trusted:**
`rm -rf .next && npm run build`, then grep `.next/server/app/index.html` vs.
`.next/server/app/es.html` for a value that's supposed to differ.

The explicit-prop version has no such failure mode because there's no shared
state to race or serialize — it's just function arguments.

**Not every component that touches translated content takes `locale`.**
Resolution happens once at each *section*-level component (`Hero`,
`Timeline`, `Work`, `Stack`, `Contact`, `ConsoleFrame`, `Console`, `Dock`,
`AnswerBlock`, `Nav`, `PersonJsonLd` — the ones that import
`content/messages.ts` directly), which then pass already-resolved **plain
strings** to leaf components (`TimelineStep`, `WorkCard`, `PromptInput`).
Those leaves don't import `Locale`/`t` at all — adding a new leaf under an
already-wired section costs nothing extra; it just receives props like any
other component. `lib/agent/mock-adapter.ts` is the one exception that isn't
a component at all (invoked from an event handler, not rendered) — `locale`
reaches it as an explicit field on `AgentQuery` (`lib/agent/types.ts`),
threaded from `Console`/`Dock` through `agentSession.ask(question, locale)`.

## 5. Why Nav and PersonJsonLd moved out of the root layout

The root `app/layout.tsx` renders `<Nav/>` and `{children}` (the page) as
siblings. A layout can't inject props into `{children}` — by the time a
layout receives it, it's an already-constructed React element, not a
function it can call with extra arguments. So `{children}` (the page) has to
know its own `locale` independently, from its own route file
(`app/(main)/page.tsx` hardcodes `"en"`, `app/es/page.tsx` hardcodes `"es"`
— trivially correct, since each file *is* that locale's route) — there's no
ordering trick needed here, just each route file literally knowing what it
is.

`Nav` and `PersonJsonLd` are different: they're rendered *by the layout*, not
by the page, so they get `locale` as a normal prop from `LocaleLayout`
(`components/layout/LocaleLayout.tsx`), which itself receives it as a prop
from `app/(main)/layout.tsx` / `app/es/layout.tsx`. Plain prop passing, no
special ordering concern — this only looked like an ordering problem back
when the plan was a shared mutable/Context value that needed to be *set*
before being *read*; with explicit props there's nothing to set, only to
pass down.

## 6. Nav changes bundled into this pass

Three changes landed alongside the i18n wiring, all requested directly:

- The status pill ("Tech Lead · Fintech & AI") is gone. It read as a stray
  "open to work" signal even after spec 005 rewrote its copy — the owner
  found it ugly and asked for it to be replaced outright, not retuned again.
- Replaced with LinkedIn/GitHub/X icon links (`IconLink`, the same component
  already used in Contact and the agent console's hand-off row) — more
  directly useful than a status badge, and consistent with how those same
  three links already render elsewhere on the page. `site.status` and
  `components/ui/StatusPill.tsx` are deleted, not deprecated — confirmed
  unused anywhere else before removing.
- A language switch link: globe icon + the *current* locale code, borderless,
  navigating to the other locale's root (`/` ↔ `/es`) on click. Went through
  two revisions based on direct feedback: the first version showed the
  *target* language ("ES" while on the English page), which read as
  ambiguous/wrong; a second version showing both options side by side
  ("EN / ES", current one static and gold) fixed the ambiguity but looked
  visually heavy (bordered pill). Landed on the simplest version: one
  element, current language, click to switch — matching the plain, borderless
  style of the rest of Nav's icon links. Not client state — swapping locale
  is just following a link, per §2's routing decision, so it's a plain `<a>`,
  zero JS. Present even though `/es` isn't in the sitemap yet (§8): the owner
  needs a way to actually reach and test the route, not just trust it
  exists. Doesn't yet preserve the current scroll position/section across
  the switch — a nice-to-have, not required.

## 7. Scope landed (Phase 1 + 2)

- `lib/i18n/locale.ts`: `Locale`, `Localized`, `t(field, locale)` — plain,
  no React APIs, works identically anywhere (§4).
- `content/messages.ts`: every translatable field converted to `Localized`,
  with real Spanish content (Phase 2) — not machine-translated wholesale.
  The journey section draws directly from the owner's own dictated Spanish
  career narrative (predates this spec; he wrote it in Spanish specifically
  anticipating this work); everything else is translated/adapted from the
  owner-reviewed English copy (spec 005's voice pass), in neutral
  professional Spanish (not regional voseo), matching the recruiter-facing
  register the English copy already uses. Proper nouns, tags, and the
  terminal/API-voice strings (`contact.badge.*`, trace formatting) stay
  English in both locales deliberately (§3), not oversights.
- Section-level components (`Hero`, `Timeline`, `Work`, `Stack`, `Contact`,
  `ContactActions`, `Nav`, `PersonJsonLd`, `Console`, `Dock`, `ConsoleFrame`,
  `ConsoleFacsimile`, `AnswerBlock`) take `locale` and resolve `t()`
  themselves; leaf components (`TimelineStep`, `WorkCard`, `PromptInput`)
  receive plain resolved strings (§4).
- Fixed a real logic bug this surfaced: `lib/agent/mock-adapter.ts`'s
  canned-chip matching used to compare a question string against the raw
  chip object directly; once `chip` became `Localized`, that comparison
  would never have matched anything. Now compares against `t(c.chip,
  locale)`, with `locale` threaded explicitly via `AgentQuery.locale`
  (`lib/agent/types.ts`) — genuinely part of the port contract, not a
  UI-only concern, since a real Phase 3 backend needs to know what language
  to answer in too.
- Routing: `app/page.tsx` → `app/(main)/page.tsx` + `app/(main)/layout.tsx`
  (English, unprefixed); new `app/es/page.tsx` + `app/es/layout.tsx`
  (Spanish). Both pages render the same extracted `HomePage` component
  (`components/layout/HomePage.tsx`), each passing their own literal
  `locale`.
- `opengraph-image.tsx` split into a shared `lib/og/render.tsx` helper
  (`renderOgImage(locale)`, the Satori/font-loading logic once) plus two thin
  per-locale route files: `app/opengraph-image.tsx` (`"en"`) and
  `app/es/opengraph-image.tsx` (`"es"`), each only declaring the
  route-segment exports (`alt`/`size`/`contentType`) Next.js's file
  convention requires per segment. Fixed the real, visible gap this had
  become once Spanish content existed: a `/es` link shared to
  WhatsApp/Twitter/etc. now shows a Spanish preview card, not an English one.
  Verified empirically, not just by a successful build: `rm -rf .next && npm
  run build`, then compared `.next/server/app/opengraph-image.body` against
  `.next/server/app/es/opengraph-image.body` — different byte sizes, different
  hashes, confirming the two routes render genuinely different images.
- `ConsoleFacsimile` (the pre-hydration stand-in, rendered via
  `next/dynamic`'s `loading` option) is now locale-aware. `loading` being a
  fixed function reference (not re-created per render) is still true, so a
  single `dynamic()` call at module scope can't see a per-render `locale`
  prop — fixed not by creating the component during render (a `useMemo`
  attempt was tried and rejected: `eslint-plugin-react-hooks`'s
  `static-components` rule forbids it outright, since React can drop a
  `useMemo` cache and remount, defeating the whole point of a stable dynamic
  import), but by declaring **two** static, module-scope `dynamic()` calls in
  `HeroConsole.tsx` — one per locale, each with its own `loading` closure —
  and picking between them with a plain ternary on `locale`. Verified
  empirically: grepped the built `index.html` vs. `es.html` for the console's
  `placeholder` attribute — `"Ask anything about my work…"` on `/`,
  `"Pregunta lo que quieras sobre mi trabajo…"` on `/es`.

## 8. Remaining gaps (not yet real content problems, but real omissions)

- `sitemap.ts` entry for `/es`, `hreflang` alternate tags, per-route
  `generateMetadata()` (locale-correct title/description/canonical), and
  `<html lang>` correctness (currently hardcoded `"en"` in the root layout —
  needs middleware or a per-locale root to fix properly). `/es` is
  reachable via the Nav switch but not yet discoverable by search engines.
  This is the one piece of Phase 1's known scope still open.

## 9. Acceptance criteria

- [x] `npm run lint` / `npm run build` clean; both `/` and `/es` routes
      generate statically.
- [x] Bundle budget: no regression (`check-bundle-budget.mjs`).
- [x] Adding a new `Localized` field without its `es` half fails to compile
      (verified structurally by the type design in §3, not a runtime test).
- [x] Status pill removed; LinkedIn/GitHub/X icons render in Nav instead.
- [x] Language switch link present in Nav, navigates `/` ↔ `/es`.
- [x] `links.linkedin`/`links.cv` resolve to the correct locale's URL —
      verified empirically, not just by type-checking: `rm -rf .next && npm
      run build`, then grepped `.next/server/app/index.html` vs.
      `.next/server/app/es.html` for the LinkedIn URL. First two locale
      mechanisms (cache(), Context) both passed the build and both failed
      this exact check; the final explicit-prop version passes it with all
      four occurrences per page consistent (§4).
- [x] Real Spanish content — journey section sourced from the owner's own
      dictated narrative; everything else translated/adapted from the
      owner-reviewed English copy, neutral register, verified against `/es`'s
      built HTML the same way as the LinkedIn URL check above.
- [x] `/es/opengraph-image.tsx` renders distinct Spanish content and
      locale-aware `ConsoleFacsimile` shows the Spanish placeholder on `/es`
      (§7) — both verified empirically against the built output, not just a
      successful build.
- [ ] `/es` discoverable via sitemap + hreflang (§8) — Nav link already
      shipped, so the owner can test the route today; search-engine
      discoverability is the one piece still open.
