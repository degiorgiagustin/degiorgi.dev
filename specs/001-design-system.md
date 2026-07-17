# Spec 001 — Design System

Status: **Accepted (v2)** · Depends on: 000 · Visual reference:
`docs/design-reference/hero-prototype.html` (prototype v2, approved — pixel intent,
not pixel law; where this spec and the prototype disagree, this spec wins).

## 1. Aesthetic thesis

Dark, somber, precise — the "Linear look" grounded in the Vercel blueprint
aesthetic. One warm accent (muted gold) reading both "banking" and "terminal
phosphor". Glassmorphism applied surgically (console, nav, cards), never as a
global treatment. The design should feel like an expensive engineering tool.

## 2. Tokens

Implement as CSS custom properties on `:root`, exposed through the Tailwind v4
theme. Tailwind v4 is CSS-first: the theme lives in an `@theme` block inside
`globals.css` (no `tailwind.config.js`); each token is declared once as a `:root`
variable and referenced from `@theme`. Components must never hardcode raw values.

### Color

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0a0a0c` | Page background (near-black, never pure black) |
| `--surface` | `rgba(255,255,255,0.03)` | Subtle raised surfaces (chips, buttons) |
| `--glass` | `rgba(16,17,20,0.55)` | Glass panels — always with backdrop blur |
| `--glass-solid` | `rgba(18,19,22,0.92)` | Near-opaque glass fallback when the 3-blur budget is exceeded (mobile); used by the dock answer card (spec 003) |
| `--line` | `rgba(255,255,255,0.08)` | Default hairline borders |
| `--line-strong` | `rgba(255,255,255,0.14)` | Hover borders, emphasis rules |
| `--text` | `#f2f3f5` | Primary text |
| `--text-2` | `#9a9fa8` | Secondary text |
| `--text-3` | `#5c6168` | Tertiary / labels / meta |
| `--gold` | `#e3b34c` | THE accent. Cursor, status dot, trace scores, one headline segment, focus rings |
| `--gold-dim` | `rgba(227,179,76,0.14)` | Gold-tinted fills (status pill, source chips) |

Accent discipline is a hard rule: gold never appears on large surfaces, body
text, or more than ~3 elements per viewport.

### Typography

- **Sans**: Geist — weights 300 (body), 400, 500 (headings), 600. Via `next/font`, self-hosted.
- **Mono**: Geist Mono — 400, 500. All "system voice" UI: eyebrows, telemetry,
  console, chips, palette, tags.
- Display headline: `clamp(38px, 6.4vw, 76px)`, weight 500, tracking `-0.035em`,
  line-height 1.06, white→transparent vertical gradient
  (`linear-gradient(180deg, #fff 30%, rgba(255,255,255,0.42))` via background-clip).
- Body: 15–17.5px fluid, line-height 1.65.
- Mono meta text: 10–13.5px, uppercase labels with `letter-spacing: 0.14em`.

### Space, radius, elevation

- Spacing scale: 4px base (Tailwind default is acceptable).
- Radius: 14px panels/cards, 7px buttons, 99px pills, 4–6px kbd/badges.
- Shadows: `0 24px 60px -24px rgba(0,0,0,.85)` for floating panels, plus
  `inset 0 1px 0 rgba(255,255,255,.05)` top bevel on glass.
- Blur: `backdrop-filter: blur(14–18px)` on glass. Maximum 3 blurred layers
  visible simultaneously (mobile GPU budget).

## 3. Signature background

Two fixed, pointer-events-none layers behind everything:

1. **Dot grid**: `radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)`,
   `background-size: 28px 28px`, masked with a radial ellipse so it fades out
   toward edges and bottom.
2. **Ambient light**: a single blurred warm radial glow anchored top-center
   (white→gold at ≤ 5.5% alpha). No animated blobs.

These two layers are implemented as dedicated CSS classes (a scoped exception to
the utility-first rule) — see `docs/adr/002-background-paint-as-css-classes.md`.

## 4. Motion language

- Entrance: staggered fade-up (18px, 0.8s ease, ~100–130ms stagger). Once per load.
- Hover: border-color and color transitions at 180ms ease. No scale-jumps.
- Specular border on the console: radial white gradient following the pointer,
  masked to the 1px border. This is the one "wow" micro-interaction — do not
  replicate it on other components.
- Scroll reveals: fade-up on intersection (Phase 1: IntersectionObserver;
  Phase 4 may re-choreograph with GSAP).
- `prefers-reduced-motion: reduce` disables ALL of the above; content renders
  in final state.
- **Touch**: hover effects (specular border, card lift, link color shifts) are
  desktop enhancements only — on touch devices every component must look
  complete and function identically without them. Interactive targets ≥ 44×44px.

## 5. Component inventory (Phase 1, per prototype v2)

`Nav`, `StatusPill`, `Eyebrow`, `GradientHeadline`, `Console` + `Dock`
(spec 003), `Chip`, `Tag`, `Timeline`/`TimelineStep`, `WorkCard`,
`ContactSection`, `HttpStatusBadge`, `DotField`, `AmbientGlow`. Each consumes
tokens only. All are styled mobile-first (base = 390px, breakpoints add).

## 6. Acceptance criteria

- [ ] All tokens exist as CSS variables and Tailwind theme entries; zero raw
      hex values in components (verified by grep in review).
- [ ] Typography renders with self-hosted Geist/Geist Mono, no layout shift (CLS < 0.02).
- [ ] Side-by-side with the prototype at 1440px, 768px and 390px, an observer
      recognizes them as the same design.
- [ ] Reduced-motion mode verified manually in devtools.
- [ ] AA contrast verified for `--text-2` on `--bg` and gold on `--gold-dim`.
