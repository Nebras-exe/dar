# DAR / Athathi Redesign — Phase 01 Discovery Report

**Scope:** analysis + planning only. No application code was modified in this phase.
**Sources of truth:** the existing Next.js app (routing, functionality, auth, APIs, AI, product logic, data, i18n) vs. the Claude Design export at `design-reference/claude-design` ("Terra Interiors", visual design only).
**Headline finding:** the two systems are already ~85% aligned in visual language (warm, calm, editorial; sand/cream backgrounds; olive + terracotta/clay accents; serif-display + grotesque-sans; pill buttons; soft diffuse shadows). This is a **refinement**, not a rebuild. The redesign is mostly a disciplined token + presentation pass, not a re-architecture.

---

## 1. Current architecture summary

| Area | Detail |
|---|---|
| Framework | **Next.js 16.3** (App Router), **React 19.2**, TypeScript 5. Note: `AGENTS.md` warns this Next has breaking changes vs. training data — read `node_modules/next/dist/docs/` before touching framework APIs. |
| Styling | **Tailwind CSS v4**, CSS-first via `@theme` in `src/app/globals.css` (no `tailwind.config.js`; `postcss.config.mjs` only). All design tokens are CSS custom properties. |
| Routing | `src/app/[locale]/…` — every page is locale-scoped (`en` / `ar`). ~20 page routes + 10 API routes. `generateStaticParams` prerenders both locales; product/category/supplier pages statically generated (~1057 pages at build). |
| i18n / RTL | `src/i18n/` — JSON dictionaries (`en.json`, `ar.json`, type-checked as `typeof en`), `getDirection()`, `dir`/`lang` on `<html>`. Arabic-first, fully bidirectional. `scripts/audit-arabic.mjs` guards against reversed-string corruption. |
| Fonts | `src/lib/fonts.ts` → **Fraunces** (display serif, optical sizing), **Hanken Grotesk** (sans/body), **IBM Plex Arabic** (Arabic). Loaded via `next/font` as CSS variables. |
| Icons | **lucide-react** (only UI dependency beyond React/Next). |
| Animation | **CSS-only, no JS animation library** (no Framer Motion / GSAP). Utilities in `globals.css`: `animate-fade-up`, `animate-fade`, `[data-reveal]` + staggered reveal, `.lift` hover, `value-pop`, `sheen`. All gated behind `prefers-reduced-motion`. |
| UI primitives | `src/components/ui/` — Button, Badge, Card, Chip, Container, Divider, EmptyState, IconButton, ImageFrame, Input, Section, Skeleton, BeforeAfterSlider. |
| Layout | `src/components/layout/` — Header (client; sticky, cart count, locale switcher, notifications, mobile menu), SiteFooter. |
| Features | `src/features/` — home (14 sections), shop (grid/filters/gallery/variant context), cart, checkout, orders, account, auth, custom (RFQ), design (AI wizard + vision + visualization + agent panels), chat (chatbot widget), favorites, supplier, notifications. |
| Domain / AI (must not break) | `src/lib/` — `catalog` (496 imported IKEA-reference products, estimated OMR pricing, variants), `catalog-preview` (per-colour variant photos), `interior-agents` (Claude room → catalog-only plan → RenderSpec), `vision` (Claude room analysis), `visualization` (Before/After: demo composition + Google Gemini image provider), `chatbot`, `agent`, `orders`, `payments`, `repository`, `design`. |
| Money | OMR, 3-decimal, deterministic helpers in `catalog/pricing.ts`. Never format-then-sum. |
| Quality gates | `npm run audit:arabic`, `npm test` (node:test, ~348 tests), `npm run lint`, `npm run typecheck`, `npm run build`. All currently green. |

**Non-negotiable behaviours that must survive the redesign:** locale routing + RTL, catalog-only AI grounding (no fabricated products), estimated-price labelling, variant→image switching, the Before/After live vs. demo distinction, cart/checkout/orders, supplier RFQ, all API contracts, and the Arabic audit.

---

## 2. Design-system summary (Terra Interiors export)

- **Origin (important caveat):** built from a **single static inspiration image** (no Figma, no codebase). Colours/spacing/type are *close visual estimates, not extracted values* (per `readme.md` + `SKILL.md`). It covers **one surface only — a marketing homepage** — with a from-scratch primitive set. It has **no Arabic/RTL, no ecommerce, no app/dashboard** surfaces.
- **Brand feel:** warm, calm, plain-spoken, editorial. Cream/sand canvases; **olive green as the primary accent** (buttons, icon circles, dark blocks); **terracotta as a sparse secondary accent**; warm near-black brown text (never pure black); two accents max on screen.
- **Type:** serif display (**Lora**) + grotesque sans (**Karla**); headlines mix roman + italic on one line for emphasis (one italic word, never the whole line); small-caps tracked eyebrows.
- **Shape language:** generous radii; **pill buttons**; large card/photo radius (~28px); organic asymmetric **"blob" radii** for section dividers; soft diffuse shadows on cards + sticky nav only; hairline borders are rare (separation via whitespace + colour blocking).
- **Motion:** minimal — standard easing `cubic-bezier(.4,0,.2,1)` ~150–240ms; hover = darken (olive→darker), links underline, cards lift slightly (shadow, **no scale**); no bounce/spring, no parallax.
- **Components provided (JSX + prompt.md + .d.ts):** Button, Badge, Tag, Input, Card, NavBar, Tabs, Accordion, SectionHeading. Plus `ui_kits/website/Homepage.jsx` (full homepage recreation) and guideline specimen cards.
- **Assets:** Lucide icons (flagged substitution), the reference mockup jpg, no real logo (type-only wordmark), no illustration files.

### Existing app vs. Terra — the real deltas

| Dimension | Existing Athathi | Terra export | Verdict |
|---|---|---|---|
| Backgrounds | ivory `#f5f1ea` / surface `#fbf8f3` / white | sand-100 `#F8F3EC` / cream-white `#FDFBF8` | Near-identical — negligible shift |
| Text | espresso `#262019` / muted `#766c60` | ink-900 `#2B2621` / ink-500 `#6E6559` | Near-identical |
| **Primary accent** | **clay/sienna `#9a5b3b`** (brand) | **olive-700 `#4F5A3E`** | **KEY DECISION — hierarchy is swapped** |
| **Secondary accent** | olive/sage `#5e6a53` | terracotta-500 `#B15E39` | Swapped counterpart of the above |
| Type pairing | Fraunces + Hanken (+ IBM Plex Arabic) | Lora + Karla | Both serif+grotesque; app pairing is arguably richer and has Arabic |
| Buttons | pill, brand fill, subtle shadow, `active:translate-y-px` | pill, olive fill, hover-darken, no shrink | Structurally identical |
| Radii | sm .375 / md .625 / lg .875 / xl 1.25 / 2xl 1.75 | s 6px / m 14px / l 28px / pill / **blob** | Aligned; app lacks the "blob" divider shape |
| Shadows | soft warm-tinted xs→lg | soft `--shadow-card` / `--shadow-hover` | Aligned philosophy |
| Motion | CSS fade/reveal/stagger/lift, reduced-motion aware | standard ease, hover-darken, no bounce | Aligned; app is slightly more expressive |

**The single most consequential design decision:** Terra leads with **olive primary + terracotta secondary**; Athathi currently leads with **clay/sienna primary + olive secondary**. Adopting Terra literally means promoting olive to primary. This must be an explicit, user-approved choice in Phase 02 because it re-tints every CTA, link, focus ring, badge, and the AI accenting across the whole app. **Recommendation:** treat Terra as the source of the *palette and shape language*, but confirm accent hierarchy with the user before flipping — a clay-forward Omani furniture brand may be intentional.

---

## 3. Important design tokens (from `_ds_manifest.json` / `tokens/*.css`)

**Colours**
- Sand neutrals: `#FBF7F1 #F8F3EC #F1E9DD #E4D7C3 #DCD0BE` · cream-white `#FDFBF8`
- Ink text: `#2B2621 #4A4338 #6E6559`
- Olive: `#3C4530 #4F5A3E #6B7857 #9BA687` (primary accent = olive-700 `#4F5A3E`, hover olive-900 `#3C4530`)
- Terracotta: `#9B4E2E #B15E39 #D69A72` (secondary accent = terracotta-500 `#B15E39`, hover `#9B4E2E`)
- Semantic aliases: `--bg-page`=sand-100, `--bg-surface`=cream-white, `--bg-inverse`=olive-900, `--border-subtle`=sand-400, `--text-eyebrow`=olive-500.

**Typography** — Lora (display) / Karla (body); eyebrow 12px / tracking 0.14em; scale `display-xl 56 · display-l 40 · display-m 30 · heading-l 24 · heading-m 20 · body-l 18 · body-m 16 · body-s 14 · caption 12`; line-height tight 1.1 / snug 1.3 / normal 1.55; weights 400/500/600.

**Spacing** — 4px base: `4 8 12 16 24 32 48 64 96 128` (`space-1…space-10`).

**Radius** — `s 6 · m 14 · l 28 · pill 999 · blob 2rem 6rem 2rem 6rem`.

**Effects** — `shadow-card 0 1px 2px /.04 + 0 8px 24px /.07` · `shadow-hover` (deeper) · `shadow-inset`. Motion: `ease-standard cubic-bezier(.4,0,.2,1)` · `duration-fast 150ms` · `duration-standard 240ms`.

*Mapping note:* these map almost 1:1 onto the app's existing `@theme` variables in `globals.css`. The redesign updates **values**, not the token architecture — so no call site needs to change token names.

---

## 4. Skills selected (available in this environment)

The design export ships its own user-invocable skill, and several relevant Claude Code skills are available. Shortlist and intended use:

| Skill | Use in this redesign |
|---|---|
| **`terra-interiors-design`** (from `design-reference/claude-design/SKILL.md`) | Primary design authority — brand voice, palette, type, component appearance, motion rules. Read first when styling any surface; treat its "Caveats" as real (estimates, not pixel-exact). |
| **`frontend-design`** (+ `frontend-design:frontend-design`) | General premium frontend implementation guidance for the component refactors (Header, cards, hero, forms). |
| **`ui-ux-pro-max`** | UX polish pass — hierarchy, spacing rhythm, states, empty/loading/error states across ecommerce + AI flows. |
| **`web-design-guidelines`** / **`design-review`** / **`design-system`** | Token consolidation, component-appearance review, and a design QA checklist per surface. |
| **`microinteractions`** / **`make-interfaces-feel-better`** / **`css-animations`** | Subtle motion (hover, reveal, Before/After, loading stages) using the existing CSS-only approach — no new animation dependency. |
| **`tailwind`** | Tailwind v4 `@theme` / utility idioms specific to this CSS-first setup. |
| **`webapp-testing`** / **`claude-in-chrome`** (browser QA) | Real visual verification of `/ar` + `/en` at desktop/tablet/mobile, RTL correctness, and Before/After. |
| **`code-review`** (`/code-review`) | Review the diff of each redesign PR before it lands (correctness + a11y regressions). |
| **`localize`** | Only if new UI copy is introduced — keep EN/AR parity and pass `audit:arabic`. |

*Deliberately not selected:* `gsap`, `animejs`, `three`, `lottie` — they'd add a dependency and contradict the calm, minimal-motion brief and the app's CSS-only animation stack. `dataviz` — no charts in scope.

---

## 5. Component mapping (current → design ref → change → keep functionality?)

| Current component/page | Design reference | Required change | Keep functionality? |
|---|---|---|---|
| `globals.css` `@theme` tokens | `tokens/*.css` + manifest | Reconcile palette values (esp. **accent hierarchy decision**), radii (add `blob`), confirm shadow/motion values | Yes — token names unchanged |
| `lib/fonts.ts` (Fraunces/Hanken/Plex Arabic) | Lora + Karla | **Decision:** keep Fraunces/Hanken (richer, has Arabic) *or* adopt Lora/Karla for Latin + keep Plex Arabic. Recommend keep current, borrow Terra's roman+italic headline treatment | Yes |
| `components/layout/header.tsx` | Terra `NavBar.jsx` | Sticky nav, type wordmark, pill CTA on the end side, restrained links; verify RTL mirroring | Yes — cart count, locale switch, auth, notifications, mobile menu all preserved |
| `components/layout/site-footer.tsx` | Homepage footer | Warm inverse (olive-900) footer block, social line, type wordmark | Yes |
| `components/ui/button.tsx` | `Button.jsx` | Already matches (pill, variants, hover-darken). Only re-tint via tokens; keep `href`/loading/a11y | Yes |
| `components/ui/badge.tsx`, `chip.tsx` | `Badge.jsx`, `Tag.jsx` | Align padding/radius/eyebrow-caps styling | Yes |
| `components/ui/input.tsx` | `Input.jsx` | Hairline border, focus ring, calm fill | Yes |
| `components/ui/card.tsx` + `components/shared/product-card.tsx` | `Card.jsx` (service/project variants) | Large radius, soft shadow, no border, generous padding; optional olive icon-badge for service/feature cards; product card keeps price/variant swatches/estimated tag | Yes — variant + estimated-price UI preserved |
| `features/home/hero.tsx` | Terra Hero | Full-bleed warm hero, serif display with one italic word, pill CTA, eyebrow; entrance fade-up | Yes |
| `features/home/*` (14 sections) | Homepage sections (What We Do / Process / Kind Words / Founder) | Apply eyebrow→headline rhythm, section spacing (64–96px), optional blob dividers; map "How it works" to the 5-step process pattern | Yes |
| `components/shop/product-grid.tsx`, `product-image.tsx` | project grid | Radius/shadow/image treatment (warm, sunlit); grid gap rhythm | Yes — catalog data untouched |
| `features/shop/*` (filters, gallery, variant, sort) | (no ref — app-only surface) | Token/appearance polish only; Terra has no ecommerce so **use judgement grounded in Terra's language** | Yes |
| `components/ui/before-after-slider.tsx` + `features/design/visualization-*` | (no ref) | Visual polish of handle/labels; keep live(AI)/demo distinction + staged loading | Yes — provider logic untouched |
| `features/design/*` AI panels, `features/chat/*` | (no ref) | Re-skin to brand; keep catalog-only grounding, RenderSpec, agent wiring | Yes |
| Cart / checkout / orders / account / auth / custom / suppliers | (no ref) | Token + component-appearance polish only | Yes — all flows preserved |

**New/updated shared pieces to consider:** a `SectionHeading` (eyebrow + serif headline with italic-word support) matching Terra; an optional `BlobDivider`/organic-shape utility; an olive **icon-badge** for feature/service cards. Reuse everything else.

---

## 6. Animation plan

Keep the **CSS-only** approach (no new library). Motion budget: calm, quick (150–240ms), intentional; `--ease-soft`/`--ease-out` already match Terra's `ease-standard`. All gated by `prefers-reduced-motion` (already implemented).

| Surface | Motion | Notes |
|---|---|---|
| Hero entrance | `animate-fade-up` on headline/sub/CTA, small stagger | one orchestrated entrance, above the fold |
| Section reveals | `[data-reveal]` on scroll (already built) | subtle rise + fade |
| Card grids | staggered reveal (`--i` index) | ≤70ms steps, cap total |
| Product / service cards | `.lift` on hover (translateY + shadow, **no scale**) | matches Terra "cards lift, no scale" |
| Buttons | token colour transition + `active:translate-y-px` | hover darken, no spring |
| Nav | sticky; link underline on hover; mobile menu slide/fade | mirror correctly in RTL |
| Image / variant swap | `animate-fade` cross-fade | already used on variant switch |
| Before/After | slider drag (existing) + staged loading dots | "Preparing → Generating → Checking → Ready" |
| Modals / sheets / accordions | short fade + height transition | no elaborate motion |

**Avoid:** parallax, long/looping animation, scale-on-hover for cards, bounce/spring, decorative movement. Do **not** over-animate the AI/checkout flows.

---

## 7. RTL / LTR plan

DAR is Arabic-first; Terra provides **no** RTL guidance, so RTL correctness is owned by the app (it already handles it well — this phase must not regress it).

- **Direction:** `dir` + `lang` on `<html>` via `getDirection()`; keep. Use logical properties (`ms-`/`me-`, `ps-`/`pe-`, `start`/`end`) — audit any new/edited component for physical `left/right`/`ml/mr` and convert.
- **Icons/arrows:** directional glyphs (chevrons, "→", back arrows) must flip in RTL (`rtl:-scale-x-100` / `rtl:rotate-180` — pattern already in code). Non-directional icons stay.
- **Typography:** Arabic keeps IBM Plex Arabic, heavier heading weight, no negative tracking, taller line-height (already tuned in `globals.css`). Do **not** apply Terra's Latin roman+italic headline trick to Arabic (italic serif is inappropriate for Arabic) — use it for EN only.
- **Eyebrows:** reduced letter-spacing for AR (already handled via `[lang="ar"] .text-eyebrow`).
- **Components to re-verify in RTL:** nav (CTA on correct end), forms, cards, Before/After slider handle + labels, sliders/carousels, badges, breadcrumbs, product gallery thumbnails.
- **Gate:** `npm run audit:arabic` must stay green; every new AR string authored in logical order with EN/AR parity.

**Responsive breakpoints (align to Tailwind v4 defaults + Terra's ~1200–1280 content column):**
- Content column ~76rem (1216px) — matches Terra's centred column; wide/full-bleed at 90rem.
- Mobile (<640), tablet (640–1024), laptop (1024–1280), desktop (>1280).

---

## 8. Responsive plan

Mobile is **designed, not shrunk**:

- **Header:** desktop = full nav + pill CTA; mobile = logo + cart + hamburger → full-height menu sheet; ensure CTA reachable, locale switch inside menu.
- **Hero:** desktop = large full-bleed with generous type; mobile = shorter viewport, headline clamps (`clamp()` already in `.text-display`), CTA full-width, image reframed (art-directed crop, not letterboxed).
- **Grids:** categories/products 3–4 cols desktop → 2 cols tablet → 1–2 cols mobile with comfortable tap targets (≥44px) and tighter gaps.
- **Two-column split sections (founder/story/keep-what-works):** stack on mobile with image-first or text-first per section intent.
- **Filters (shop):** desktop sidebar/inline → mobile bottom-sheet (existing `filter-sheet.tsx`).
- **Before/After + AI panels:** full-width stacked on mobile; product board scrolls; staged loading legible.
- **Section spacing:** scale 96px→64px→48px down the breakpoints.
- **Verify at:** 360 / 390 (mobile), 768 / 834 (tablet), 1280 (laptop), 1440 (desktop), each in **both** `ar` and `en`.

---

## 9. Files expected to be modified (Phase 02+ — not this phase)

**High-confidence (token + primitive layer):**
- `src/app/globals.css` (token reconciliation — the pivotal file)
- `src/lib/fonts.ts` (only if type pairing decision changes)
- `src/components/ui/button.tsx`, `badge.tsx`, `chip.tsx`, `input.tsx`, `card.tsx`, `section.tsx`, `container.tsx`, `divider.tsx`

**Layout + presentation:**
- `src/components/layout/header.tsx`, `site-footer.tsx`
- `src/components/shared/product-card.tsx`, `logo.tsx`
- `src/components/shop/product-grid.tsx`, `product-image.tsx`, `product-art.tsx`
- `src/features/home/*` (hero, categories, how-it-works, before-after, featured-products, final-cta, value-strip, style-discovery, keep-what-works, budget-intelligence, custom-furniture, supplier-cta, design-showcase)
- `src/components/ui/before-after-slider.tsx`
- `src/features/design/*` and `src/features/chat/*` (re-skin only)
- Cart/checkout/orders/account/auth/custom/suppliers views (appearance polish)

**Possibly new (small, additive):**
- `src/components/ui/section-heading.tsx` (eyebrow + italic-word headline)
- a blob-divider / organic-shape utility (or a `globals.css` class)
- an olive icon-badge for feature/service cards

**Must NOT change:** anything under `src/lib/catalog*`, `interior-agents`, `vision`, `visualization` (provider/service/critic/references), `chatbot`, `agent`, `orders`, `payments`, `repository`; all `src/app/api/**`; `src/i18n` dictionary *keys*; `scripts/*`; `.env*`. Copy edits only via dictionaries with EN/AR parity.

---

## 10. Risks

1. **Accent-hierarchy swap (highest impact):** promoting olive to primary re-tints every CTA/link/focus/badge and the AI accenting. Needs explicit user sign-off; do it token-first so it's one reversible change, not scattered edits.
2. **Design ref is estimate-grade & single-surface:** Terra is one English marketing page built from a static image (its own README says values aren't pixel-exact). It gives **no** guidance for ecommerce, AI panels, cart/checkout, or RTL — most of the app. Over-literal copying would degrade proven surfaces. Mitigation: use Terra for *language*, apply judgement (and `ui-ux-pro-max`) to app-only surfaces.
3. **RTL regressions:** any physical-direction CSS introduced during re-skin breaks Arabic silently. Mitigation: logical properties only; browser-QA both locales; keep `audit:arabic` green.
4. **Typography change scope:** swapping to Lora/Karla touches every heading and needs an Arabic counterpart Terra doesn't provide. Mitigation: prefer keeping Fraunces/Hanken + IBM Plex Arabic; borrow only the roman+italic *treatment* for EN headlines.
5. **Breaking AI / commerce behaviour:** the redesign must be visual-only. Mitigation: never touch `src/lib/**` domain logic or `api/**`; run the full gate (`audit:arabic`, `test`, `lint`, `typecheck`, `build`) per PR; `/code-review` each diff.
6. **Motion creep:** temptation to add a JS animation lib. Mitigation: stay CSS-only; respect the calm brief and reduced-motion.
7. **Tailwind v4 / Next 16 idioms:** CSS-first `@theme`, no config file, framework caveats in `AGENTS.md`. Mitigation: read `node_modules/next/dist/docs/` before framework-level edits; test the build early.
8. **Performance/CLS:** larger radii + full-bleed imagery + reveal animations can shift layout. Mitigation: reserve aspect ratios (`ImageFrame` already does), keep motion compositor-only (transform/opacity).

---

## 11. Recommended implementation order (Phase 02+)

1. **Decisions gate (blocking):** confirm with the user — (a) accent hierarchy (olive-primary Terra literal vs. keep clay-primary), (b) typography (keep Fraunces/Hanken vs. adopt Lora/Karla), (c) whether to introduce blob dividers. Nothing else starts until these are set.
2. **Token reconciliation** in `globals.css` (colours, radii incl. `blob`, shadows, motion) — one PR, visually diff both locales. This is the leverage point; most components inherit automatically.
3. **UI primitives** (Button, Badge, Chip, Input, Card, Section, Divider, Container) — align appearance to Terra; keep all props/a11y.
4. **Shared building blocks** — SectionHeading (eyebrow + italic-word), product-card, logo/wordmark, before-after-slider polish.
5. **Header + Footer** — nav pattern, wordmark, olive-inverse footer; RTL verify.
6. **Homepage sections** — hero first, then the 14 sections in visual priority; apply reveal/stagger; the marquee surface for the new look.
7. **Shop + product surfaces** — grid, filters, gallery, product page (preserve variant/estimated-price UI).
8. **AI + Before/After + chat** — re-skin only; preserve catalog-only grounding, live/demo distinction, staged loading.
9. **Commerce flows** — cart, checkout, orders, account, auth, custom, suppliers — appearance polish.
10. **Cross-cutting QA** — browser QA at all breakpoints in `ar` + `en`; RTL/icon-flip audit; run full quality gates; `/code-review` the cumulative diff; verify no Lighthouse/CLS regressions.

Each step is an isolated, reversible PR that keeps the app shippable and green.

---

*End of Phase 01 Discovery. No application code was modified. Awaiting the Phase 02 decisions gate (§11.1) before any implementation.*
