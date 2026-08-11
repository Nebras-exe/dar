# Phase 02 Report — Final Homepage & Product Storytelling

_Athathi (أثاثي) · AI Interior & Furniture Marketplace for Oman · 2026-08-09_

## Summary

Phase 02 turned the Phase 01 foundation into a complete, premium, judge-ready **homepage** that explains Athathi within seconds and tells one coherent story from "I have a room" to "I can buy the design." It adds 14 homepage sections, an original hand-drawn interior illustration, a working before/after comparison, a reusable product card, CSS-only motion, and an upgraded header/footer — all bilingual (English LTR + Arabic RTL) and built on the existing design system. Build, lint, and typecheck pass; the rendered site was inspected in-browser at desktop in both languages.

## Homepage Story

The page is ordered as a single narrative, not disconnected marketing blocks:

1. **Hero** — "Your space. Your taste. Your budget. Athathi handles the rest." with a furnished-room illustration, a budget/style overlay, and a "5 matching pieces · OMR 472" analysis bar (labelled *Sample preview*).
2. **Value strip** — Real products · Budget aware · Keeps what works · Designed for your space.
3. **How Athathi works** — 5 guided steps (upload → budget/style → analyse → adjust → buy).
4. **Design My Space showcase** — the flagship: Room/Budget/Style/Keep inputs → recommendation list with prices → total OMR 260 / remaining OMR 240 (*Sample*).
5. **Keep what works** — Keep / Change / Add columns (the trust differentiator).
6. **Budget intelligence** — budget meter (OMR 500 → design 472 → remaining 28) + abilities.
7. **Before / After** — draggable, direction-aware comparison + "5 pieces from this design" (*Prototype*).
8. **Shop by category** — 10 editorial category previews.
9. **Featured furniture** — 6 sample product cards with OMR prices.
10. **Design by style** — 6 lookbook style cards.
11. **Design from a picture** — reference-image concept (*Coming soon*).
12. **Custom furniture** — spec-from-idea teaser (*Coming later*).
13. **For suppliers** — restrained future-opportunity band (*Coming soon*).
14. **Final CTA + footer** — closing call, Oman-first note, footer nav.

## Sections

Final structure lives in `src/features/home/*` and is composed in `src/app/[locale]/page.tsx`. Every section has a stable `id` (`#top #how #design #keep #budget #before-after #shop #featured #styles #reference #custom #suppliers #final-cta`) so header nav, CTAs, and footer links resolve to real in-page anchors (no broken future routes).

## Arabic Audit

- Confirmed **UTF-8** encoding and **logical Unicode order** across the whole Arabic dictionary — verified programmatically by checking first/last Arabic code points (e.g. `أثاثي` begins with ALEF-WITH-HAMZA and ends with YEH; a manually-reversed `يثاثأ` would begin with YEH). **No manually-reversed strings were found** anywhere (logo, nav, buttons, headings, descriptions, prices, demo notices, metadata, footer, a11y labels).
- Verified **en/ar key parity** (every key present in both) so no string silently falls back to English.
- Arabic prices use Arabic-Indic numerals (e.g. `٣٢٠٫٠٠٠ ر.ع`, `٥٠٠ ر.ع`) with the Arabic decimal separator.
- RTL rendering is handled purely by `dir="rtl"` + logical CSS — never by reversing text.

## Design Decisions

- **Original illustration over stock photography.** No licensing could be confidently established for external interior photos, and AI-generated "futuristic rooms" were explicitly to be avoided. So the visual anchor is a hand-built SVG `RoomIllustration` (furnished "after" / bare "before") drawn from the Athathi palette — honest, consistent, and zero-weight. Production photography is a documented remaining need.
- **In-page anchors for all nav/CTAs.** Future routes (shop, design, suppliers) don't exist yet; linking to them would 404. Every link resolves to a homepage section instead; genuinely unbuilt features (custom furniture, suppliers) use **disabled** CTAs plus a "Coming soon/later" badge — honest, not broken.
- **CSS-only motion.** One orchestrated hero entrance (`fade-up`) plus an `IntersectionObserver` `Reveal` that only dims in its hidden state — so no-JS/reduced-motion users always see content. No animation library added.
- **Server-components-first.** Only 3 client components exist (`Header`, `Reveal`, `BeforeAfterSlider`); every section is a server component, keeping client JS minimal.
- **Honest prototype system.** `Sample` / `Prototype` / `Coming soon` badges mark demo content without cluttering every block.

## Images

- **Used:** an original SVG interior illustration (`RoomIllustration`) for the hero and before/after; palette-driven gradient + line-icon placeholders (`PlaceholderImage`) for categories, featured products, styles, and the reference-image mock. All sample visuals are labelled.
- **Source:** entirely self-authored from the design tokens — no external/stock assets, no fabricated attribution.
- **Remaining production need:** real, licensed interior/furniture photography (warm modern, beige/walnut/cream, Gulf-appropriate) for hero, category, product, and style cards; `next/image` wiring with responsive `sizes`. `higgsfield` image generation is available as one production option but was intentionally not used this phase.

## Components

New/updated reusable pieces:

- `features/home/room-illustration.tsx` — original SVG interior (before/after variants).
- `features/home/before-after.tsx` — accessible, direction-aware drag slider (`role="slider"`, keyboard).
- `components/shared/reveal.tsx` — reduced-motion-safe scroll reveal.
- `components/shared/product-card.tsx` — editorial furniture card (reused across sections).
- `components/shared/placeholder-image.tsx` — relocated from Phase 01's foundation folder.
- `Button` — now polymorphic (renders `<a>` when `href` is set; exports `buttonClasses`).
- Upgraded `Header` (anchor nav + wired CTAs) and `SiteFooter` (brand + 3 link columns + meta).
- 14 section components under `features/home/`.

## Skills

- **Used:** `frontend-design` (identity/composition) and `web-design-guidelines` (a11y/UX checklist).
- No subagents (single coherent build). Full detail + tooling availability in `docs/phase-reports/PHASE_02_SKILLS.md`.

## Responsive QA

- Built mobile-first: hero and all two-column sections collapse to single column; category/product/style grids step `2 → 3 → 5/6` columns; header nav collapses to an accessible mobile menu (`aria-expanded`/`aria-controls`, Escape to close); the before/after container uses `touch-action: pan-y` so vertical page scroll still works on touch.
- **Limitation:** the browser tool captured at a fixed ~1568 px viewport (`resize_window` didn't change the rendered width), so true mobile emulation wasn't possible. Mobile was therefore verified by **responsive code review**, not screenshots — recorded honestly.

## RTL QA

Inspected the Arabic homepage in-browser at desktop: logo/nav mirror to the right, actions/CTA to the left; hero copy right / visual left; budget-style pills and analysis bar mirror correctly; value-strip icons sit on the inline-start (right); the before/after slider is direction-aware (drag + arrow keys inverted for RTL); arrows flip via `rtl:rotate-180`; identifiers carry `translate="no"`. Arabic typography (IBM Plex Sans Arabic) renders cleanly.

## Accessibility

- One `<h1>`; ordered `<h2>`/`<h3>` hierarchy (1 / 12 / 32).
- Skip-to-content link (localized), `<main id="main">`, labelled `<nav>` landmarks, labelled `<footer>` nav.
- Every icon-only control has an `aria-label`; decorative icons are `aria-hidden`.
- Before/after handle is a real `role="slider"` with `aria-valuemin/max/now` and Arrow/Home/End keys.
- Visible `:focus-visible` rings throughout; reduced-motion disables reveals/animation; no `<img>` without alt (SVG/placeholders only).

## Performance

- Static generation for `/en` and `/ar`; self-hosted fonts with `swap` (preloaded woff2).
- Server-components-first — 3 small client components only; no animation/UI libraries; CSS-only motion using compositor-friendly transform/opacity.
- No external image requests; illustrations are inline SVG.

## Testing

| Command | Result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | ✅ 0 errors |
| `npm run lint` | ✅ 0 problems |
| `npm run build` | ✅ Compiled successfully; `/en` and `/ar` prerendered as static HTML; no warnings |
| Runtime smoke | ✅ `/` → 307 (locale redirect); `/en` → 200; `/ar` → 200 |
| en/ar dictionary parity | ✅ identical key sets (checked programmatically) |

## Browser QA

Claude-in-Chrome (connected this phase): reviewed **English desktop** and **Arabic RTL desktop** across the full page — hero, value strip, how-it-works, Design My Space showcase, keep-what-works, budget meter, the **before/after drag** (bare ↔ furnished), categories, featured, and styles. **No console errors** on load. Mobile emulation unavailable (see Responsive QA).

## Known Limitations

- Real interior/furniture **photography** still needed (placeholders/illustration used, all labelled).
- All catalog/design/budget figures are **sample/prototype data**; no backend, AI, cart, or auth (correctly out of scope).
- Header Search/Account/Cart and the Custom/Supplier CTAs are **non-functional shell/coming-soon** (disabled where they imply an action).
- Mobile verified by code review, not screenshots (tool viewport limitation).

## Next Phase

**Phase 03 — Furniture Catalog & Discovery:** real category pages (`/shop`, `/shop/[category]`), product cards/detail (`/product/[slug]`), a structured demo-catalog data layer (50–100+ labelled sample products), search/filtering, and cart foundations. Phase 03 was **not** started.
