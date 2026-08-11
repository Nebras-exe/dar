# Phase 09.5 — Full Visual Upgrade — Report

_Status: ✅ Complete & verified. A design/UX/imagery/motion quality pass over the existing product — no business logic, catalog engine, vision, agent, RFQ, backend, or RLS was changed. All 140 tests still pass; lint/typecheck/build/`audit:arabic` green; the site runs on :3000. Live browser QA remains unavailable (no Chrome extension / Playwright in this session's scope) — verified, not faked; QA was done via real server-rendered output + a published artifact + code review. Phase 10 not started._

## Before — problems identified (visual audit)

- **Product imagery was flat.** The generated `ProductArt` drew simple single-tone silhouettes over a flat gradient — readable but placeholder-like, not "premium furniture". Every card, product page, cart line, design item, RFQ preview and supplier grid inherited this flatness.
- **Hover zoom was silently broken.** `ImageFrame`'s `zoomOnHover` targeted only `<img>`, but every card renders **SVG** art — so the documented "subtle image zoom" never fired on any card.
- **Product cards were bare.** No elevation/lift, no customizable indicator, small price, image sat directly on the page background (no "product on a surface" feel).
- **The hero room illustration** was solid-fill and a bit lifeless (no ambient light, thin depth).
- **Motion was minimal** beyond the hero entrance and scroll-reveal — no card lift, no value-change feedback, no staggered reveals for dynamic content (quotes).

## Changes made

### Generated imagery system (biggest lever) — `components/shop/product-art.tsx` (rebuilt)
An original, **offline, deterministic** "studio photography" system used by every product surface:
- warm **studio backdrop** (vertical wash + ambient accent glow + corner vignette),
- a soft **grounding contact shadow**,
- category forms rendered with **depth** — a lit face, a shaded side, a top highlight (sofas, chairs, tables, beds, storage/tv-units, wardrobes, desks, dining, rugs, lighting, mirrors, decor, outdoor),
- **material-aware surfaces**: fabric top-light/seams, wood grain lines, metal sheen gradient, glass translucency + specular streak, marble veining, leather sheen, rattan weave — classified from the product's real `materials[0]`.
- Still seeded per product (same product → same art), unique per product, no external assets, no client JS, and **clearly demo imagery** (the Sample badge + disclosures are unchanged).

### `RoomIllustration` (hero + before/after) — rebuilt
Ambient window light + floor light-spill, layered sofa (base/back/cushions/arms/throw pillow) with soft top-light, a coffee table with a small vase, a richer lamp glow and plant; the "before" now tells a story (lonely stool + waiting moving boxes). Gradient walls/floor + skirting for depth.

### `ImageFrame` — zoom fixed
`zoomOnHover` now targets **both `<img>` and `<svg>`**, so the hover zoom works on the generated art everywhere (and on real photography later). Zoom raised to 1.05.

### `ProductCard` — polished
Image now sits in an **elevated, ring-bordered surface that lifts on hover** (`.lift`), the title shifts to brand colour on hover, swatches enlarge slightly and scale on hover, the **price is larger/heavier**, and a **"Customisable" chip** appears on customizable products. Favourite button keeps its `z-10` independent operability; the whole-card stretched link is preserved.

### Motion system — `globals.css`
Added coherent, compositor-only, **reduced-motion-safe** utilities: `.lift` (hover raise + warm shadow), `[data-reveal-stagger]` (sequenced child entrance via `--i`), `.animate-value-pop` (a brief highlight when a number changes), and a `sheen` keyframe. Applied: **Agent "New total"** pops when the budget changes; **RFQ quote cards** stagger in on reveal. All new motion is disabled under `prefers-reduced-motion` (existing global guard + per-rule fallbacks).

## Routes improved
Every surface that renders products or the hero benefits automatically: `/[locale]` (hero + featured + before/after), `/[locale]/shop` + `/shop/[category]`, `/product/[slug]`, `/cart`, `/design` (result item cards + before/after), `/custom` (RFQ quote reveal + any product art), `/suppliers/[slug]` and `/supplier` (product grids). Both locales.

## Images created / added
- **No external image files** were added (deliberate — see `PHASE_09_5_SKILLS.md`). The imagery upgrade is entirely in the **owned generated-art code**, so it stays offline, deterministic, performant, and license-clean.
- **QA artifact:** `docs/qa/phase-09-5/generated-art.html` — real server-rendered SVGs (15 product arts + 2 rooms), plus a published, theme-aware Artifact reproducing the same for review.

## Animation system
CSS-only, on-brand, restrained: hero entrance (existing) + scroll reveal (existing) + card lift + image zoom + swatch scale + title colour + value-pop + quote stagger. No JS animation library, no parallax, no constant motion. Fully `prefers-reduced-motion` compliant (confirmed present in the built CSS bundle).

## Responsive changes
No layout regressions introduced; the card's new elevated container and larger price reflow within the existing responsive grid (2/3/4 columns). All changes use logical properties already in place.

## RTL changes
No RTL regressions: the art SVGs are direction-neutral; the customizable chip uses `start-3` (logical); the value-pop/stagger are direction-neutral. Verified `/ar/shop` and `/ar/custom` render `dir="rtl"` with correct Arabic and **zero reversed strings**; `audit:arabic` clean after adding one bilingual key (`shop.card.customizable`).

## Performance changes
- Imagery stays **inline SVG generated at render** — no image downloads, no layout shift, no external requests, no bundle growth from assets.
- Motion is transform/opacity/box-shadow only (compositor-friendly).
- Build unchanged in shape: **219 pages**, existing static/dynamic boundary preserved.

## Skills used
See `PHASE_09_5_SKILLS.md` (USED / NOT USED / why). Headline: `frontend-design` + `web-design-guidelines` know-how, `artifact-design` for the QA artifact; higgsfield/playwright/ui-ux-pro-max consciously declined with documented reasons.

## Browser QA
`claude-in-chrome` returned **no connected browser**; the `playwright` MCP is scoped to another project and isn't loaded in this session — both verified, not faked. Fallback used: **real server-rendered SVG** extracted from the running app into `docs/qa/phase-09-5/generated-art.html` + a published theme-aware Artifact, all-route HTTP 200 checks (EN + AR), `dir="rtl"`/correct-Arabic/zero-reversed render checks, reduced-motion-in-bundle check, and responsive/RTL code review.

## Tests / build
- `npm run audit:arabic` → clean. `npm test` → **140 passing**. `npm run lint` → 0 warnings. `npm run typecheck` → clean. `npm run build` → success, **219 pages**.

## Remaining limitations
- **Generated art, not photography.** It is materially more premium and "studio-like", but it remains stylised original imagery — clearly labelled demo. Real photography (or a wired higgsfield/`VisualizationProvider`) is the eventual upgrade; the `ProductImage` seam swaps to `next/image` with a data change only.
- **No live device/visual capture** (browser tooling unavailable). Verified via real rendered SVG + artifact + code review, not pixel screenshots.
- Product-detail gallery, supplier-profile hero imagery, and a full SEO/schema pass were scoped out of this visual pass and remain opportunities.

## Recommendation before Phase 10
Proceed to **Phase 10 (Orders + Checkout + Payment)**. Before or alongside it, two low-risk visual follow-ups: (1) wire a real image provider into the ready `VisualizationProvider`/`ProductImage` seam for genuine photography, and (2) a dedicated SEO/OG/schema pass on the now-premium public pages.
