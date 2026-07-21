# Spec 005 — Content & Voice Pass

Status: **Accepted** · Depends on: 002 (frontend shell), 003 (console
widget) · Extracted from a post-launch review: the shell shipped with
AI-generated placeholder copy (spec 002 §6) and, separately, AI-generated
*finished* copy that read more confident/pretentious than the owner's actual
voice. Both are content problems, not build problems — this spec exists to
close them without re-opening the shell's structure or components.

## 1. Goal

Every string a recruiter reads on the live site is either (a) real, sourced
from the owner directly or cross-referenced against his CV, or (b) explicitly
marked `PLACEHOLDER` and tracked here — never AI-invented filler presented as
fact. Exit = zero unmarked placeholders, journey/work content verified
against the owner's CV, remaining gaps enumerated in §5.

## 2. Process

Content was gathered conversationally, not drafted by the assistant from
scratch:

- The owner dictated his career narrative in Spanish; the assistant
  translated into the site's English copy, compressing to fit the shell's
  format (1–2 sentence narratives) while preserving his actual claims and
  register — no invented adjectives, no marketing framing he didn't use.
- `web/public/cv/CV_Agustin_De_Giorgi_en.pdf` (and `_es.pdf`) served as the
  factual source of truth for dates, titles, and metrics once provided —
  resolving ambiguities the dictated narrative left open (exact role
  boundaries, the Oct 2025 architecture promotion status, and where the
  Gastra/AI work fits chronologically relative to the banking career).
- Every compression was shown back to the owner as a draft before landing in
  `messages.ts`, including two corrections: Full-Stack Developer and Backend
  Mentor were initially merged into one journey step; the owner clarified
  they are independent, concurrent roles, so those stayed split. Conversely,
  the Oct 2025 architecture scope expansion was initially drafted as its own
  "Software Architect" step; the owner corrected this — it's not a separate
  official title, so it's folded back into the Tech Lead step's narrative.
  Net effect: the shell's original 6 journey steps stayed 6, reshaped rather
  than expanded (spec 002 §4.3 unchanged in count, updated in content).

## 3. Scope landed this pass

- **Journey** (`messages.ts` → `journey`): all 6 steps real — MobyDigital
  Java Developer → Backend Developer (ICBC/YOY onboarding) → Full-Stack
  Developer → Backend Mentor (concurrent) → Tech Lead, MobyDigital → ICBC
  (narrative folds in the Oct 2025 architecture scope expansion — not a
  separate official title) → Gastra (independent project).
- **Work cards** (`messages.ts` → `work`): all 3 summaries real, sourced from
  the CV's Gastra project section and YOY/ICBC metrics (640K peak logins,
  15M+ monthly microservice executions, 560K+ MAU).
- **Work cards — dead link removed**: all three cards linked to `href: "#"`,
  a stub with no real destination (case-study pages are a future content
  phase per the project roadmap, not built yet). Rather than ship a promise
  with nothing behind it, `WorkCard` now renders as a static panel — no
  `href` field, no "read case study →" affordance. Reintroduce both when real
  case-study pages exist.
- **Contact CV download**: `links.cv` pointed at a file that didn't exist
  (`/Agustin_De_Giorgi_CV.pdf`) and was never rendered anywhere. Fixed to the
  real path (`/cv/CV_Agustin_De_Giorgi_en.pdf`) and wired to a new ghost
  button in `Contact.tsx`, opening in a new tab alongside LinkedIn/GitHub/X.
- **Contact subline**: written by the owner (paraphrased from Spanish),
  deliberately avoiding "opportunities/roles/hiring" language — see §7.
- **Nav status pill** (`site.status`): "Open to senior roles" replaced with
  "Tech Lead · Fintech & AI." Same root cause as the subline above (see §7),
  surfaced independently by the owner earlier in review before the subline
  conversation connected the two. This is a content-only fix; the pill's
  structural behavior (fixed bar → floating on scroll) is a separate,
  not-yet-written spec.

## 4. Explicitly out of scope this pass

- **Hero, SEO, and agent-console copy voice.** The owner's original complaint
  ("all the text sounds too pretentious") applies to this copy too, but it
  wasn't part of the reviewed exchange that produced §3 — rewriting it now
  would mean the assistant inventing "humbler" phrasing unreviewed, the exact
  failure mode this spec exists to avoid. Tracked as a follow-up, not silently
  folded in here.
- **Spanish (`_es`) CV and Spanish copy generally.** The owner dictated
  journey content in Spanish specifically because EN/ES is a planned future
  spec (site-wide language toggle, tracked separately, out of scope here).
  The Spanish CV file already sits in the repo, ready for that spec — the
  Spanish narrative he gave in chat is not yet transcribed anywhere as
  reusable ES copy.
- **Favicon / OG image.** Verified already shipped correctly under spec 004
  (`app/favicon.ico`, `app/opengraph-image.tsx`) — not a gap, despite earlier
  confusion in review.

## 5. Remaining placeholders

None. All `PLACEHOLDER` strings in `messages.ts` are resolved.

## 6. Acceptance criteria

- [x] Journey: 6 real steps, dates/titles/metrics verified against the CV.
- [x] Work: 3 real summaries; dead link affordance removed from `WorkCard`.
- [x] `links.cv` points at a real file; Contact renders a working CV button.
- [x] Spec 002 (§4.1, §4.3, §4.4, §4.6, §6) updated to match — source of
      truth stays accurate.
- [x] `contact.subline` supplied by owner, no "open to work" framing (§7).
- [x] `site.status` (nav pill) carries the same fix, for the same reason (§7).
- [x] `npm run lint` / `npm run build` clean.

## 7. "Open to work" framing — why it was removed

The owner flagged the nav's "Open to senior roles" pill as "weird" early in
review (before this spec existed), then separately, while drafting the
Contact subline, named the actual concern: he is currently employed
(ICBC Tech Lead) and worried that job-search-flavored copy — even softened —
reads to a future employer's HR as "this person is constantly looking."
Both strings shared the same failure mode. The fix isn't softer job-search
language, it's dropping that framing entirely: a portfolio's function is
"here's what I've built," not "please hire me." Both `contact.subline` and
`site.status` now state facts (current role, focus, an invitation to talk
shop) with no "opportunities/roles/hiring/open to" vocabulary anywhere.
