# DAR — Style Images + Logo + Branding Report (Phase 04)

All 10 tasks executed on the real app. Terra-inspired redesign preserved; no functionality, APIs, routing, i18n, or AI behaviour changed. **All gates pass** and the new assets/brand are verified live on port 3000. Not committed, not pushed.

---

## Assets copied

| Source | → Destination | Notes |
|---|---|---|
| `pic/1.png` | `public/images/styles/warm-modern.webp` | 1200×900, 148 KB |
| `pic/2.png` | `public/images/styles/japandi.webp` | 148 KB |
| `pic/3.png` | `public/images/styles/minimal.webp` | 76 KB |
| `pic/4.png` | `public/images/styles/contemporary.webp` | 108 KB |
| `pic/5.png` | `public/images/styles/modern-classic.webp` | 96 KB |
| `pic/6.png` | `public/images/styles/bohemian.webp` | 176 KB |
| `pic/Logo.jpeg` | `public/brand/dar-logo.jpeg` | original lockup (1254×1254) |
| *(derived)* | `public/brand/dar-logo.png` | transparent-bg full lockup |
| *(derived)* | `public/brand/dar-logo-light.png` | cream duotone (for dark surfaces) |
| *(derived)* | `public/brand/dar-mark.png` | **house mark, transparent** — used in the UI |
| *(derived)* | `public/brand/dar-mark-light.png` | house mark, cream — used on the olive footer |

PNG→WebP conversion via `sharp` (quality 82, ratio preserved). The logo's white background was removed from its two-tone pixels to produce transparent + light variants, so the brown mark sits cleanly on the sand background and a cream variant reads on the olive footer. **Originals in `D:\Athathi\pic` are untouched** (1–6.png + Logo.jpeg all present).

## Final asset paths
- Style images: `public/images/styles/{warm-modern,japandi,minimal,contemporary,modern-classic,bohemian}.webp`
- Logo: `public/brand/dar-logo.jpeg` (+ `dar-logo.png`, `dar-logo-light.png`, `dar-mark.png`, `dar-mark-light.png`)

## Confirmation of image mapping (verified in served HTML, exact order)
```
1 → warm-modern.webp   (Warm Modern / مودرن دافئ)
2 → japandi.webp       (Japandi / جاباندي)
3 → minimal.webp       (Minimal / مينمال)
4 → contemporary.webp  (Contemporary / معاصر)
5 → modern-classic.webp(Modern Classic / كلاسيكي مودرن)
6 → bohemian.webp      (Bohemian / بوهيمي)
```
The six-card section (`style-discovery.tsx`) maps images by index over the localization dictionary items, so card labels/descriptions stay dictionary-driven and the selection behaviour (each card links to `/[locale]/design`) is unchanged.

## Files modified
- `src/features/home/style-discovery.tsx` — real `next/image` (`object-cover`, `fill`, `sizes`), landscape 4:3 (matches the 1200×900 assets — no stretch), **subtle warm-dark bottom gradient only** (`from-charcoal/70 via-charcoal/5`), hover **image zoom** (existing `zoomOnHover`, ~340ms) + **card lift** (`.lift`, translateY + shadow), bilingual alt text. Removed the placeholder-gradient imagery.
- `src/components/shared/logo.tsx` — renders the DAR house mark (`dar-mark.png` / `dar-mark-light.png` on inverse) + the `DAR`/`دار` wordmark; preserves aspect ratio, sized `h-8`, sharp.
- `src/app/[locale]/layout.tsx` — `applicationName: "DAR"`; `themeColor` already sand.
- `src/i18n/dictionaries/en.json` — 65× `Athathi`→`DAR` (brand.name, hero, sections, auth, footer, chat, nav, metadata driver).
- `src/i18n/dictionaries/ar.json` — 66× `أثاثي`→`دار` (grammar spot-checked: "ودار يتولّى الباقي", "اسأل دار", "أنشئ حسابك في دار").
- `src/app/[locale]/preview/page.tsx` — 2 user-facing strings rebranded.
- Supplier **display names** (user-facing on product/supplier pages), type-safe: `src/lib/catalog/types.ts`, `products.ts`, `test-fixtures.ts`, `src/lib/repository/demo-suppliers.ts` — "Athathi Studio Collection"→"DAR Studio Collection", "Athathi Demo Supplier"→"DAR Demo Supplier" (+ Arabic names). **Slugs/ids kept** (`athathi-studio-collection`, `demo-athathi-studio`) to avoid breaking supplier URLs/routes.
- AI **system prompts** (assistant self-identity is user-facing): `src/lib/agent/prompts.ts`, `chatbot/prompts.ts`, `interior-agents/prompts.ts`, `vision/prompt.ts`, `visualization/prompt.ts` — brand self-references → DAR/دار. Verified all 348 tests still pass (no test asserts the brand string).
- Test updates for the rename: `src/i18n/i18n.test.ts` (brand assertions → DAR/دار + a guard that no legacy brand remains in either dictionary), `orders.test.ts`, `payments.test.ts` (supplier literals).

## Logo locations replaced
- **Desktop header** (via `Logo` in `header.tsx`) ✓
- **Mobile header** (same `Logo` component) ✓
- **Footer** (inverse light mark, `dar-mark-light.png`) ✓
- **Navigation** (the header logo links home) ✓
- **Auth screens** — use dictionary brand strings (now DAR/دار); they don't embed the logo image directly, so no image change needed there.
- **Metadata / OG / PWA name** — driven by `brand.name` (now DAR/دار) + `applicationName: "DAR"` ✓

## Old Athathi / أثاثي branding replaced
- **User-facing:** all i18n strings (both locales), page titles, OG/metadata, `applicationName`, supplier display names, preview-page copy, AI-assistant self-identity — **now DAR / دار**. Verified in served HTML: EN `<title>` = "DAR — AI Interior & Furniture Marketplace", AR `<title>` = "دار — منصّة الذكاء الاصطناعي…", **zero** "Athathi"/"أثاثي" in the rendered home HTML for either locale.
- **Intentionally kept (internal, per the brief's "do not rename internal identifiers"):** code/doc comments in `src/lib/**` and some `.tsx` (e.g. `// The DAR/Athathi assistant…` style comments), the project folder `D:\Athathi`, package name, API routes, env vars, supplier **slugs/ids**, and the reversed-text detector fixtures in `i18n.test.ts`. None of these are user-visible.

## Design consistency
Kept the Terra system fully — warm sand background, olive primary, terracotta secondary, Fraunces/Hanken + IBM Plex Arabic, soft shadows, restrained motion. The new imagery and logo were integrated into that system (bright images, subtle gradient, calm hover). No unrelated sections were redesigned; the recent redesign was not reverted.

## Micro-interactions (Task 3)
- **Image zoom on hover** — reused the existing `ImageFrame zoomOnHover` (~340ms, `ease-soft`, scale 1.05 — restrained, not aggressive). No new animation library added.
- **Card elevation** — `.lift` on the card (translateY(−4px) + soft shadow) so image, gradient, and label move together.
- Both are compositor-only and respect `prefers-reduced-motion` (global reduce block neutralises them).

## Test / build results
| Check | Result |
|---|---|
| `audit:arabic` | ✓ 3098 strings, no reversed/corrupt |
| `typecheck` | ✓ clean |
| `lint` | ✓ clean |
| `test` | ✓ **348/348** |
| `build` | ✓ compiled, **1057/1057** static pages |

## Live validation (port 3000)
- All six style images referenced on the home page **in order 1→6**; `warm-modern.webp` → HTTP **200 image/webp**.
- DAR logo mark → HTTP **200 image/png**; rendered in header + footer.
- EN shows **DAR**, AR shows **دار** (titles, hero, sections, auth); **0** residual "Athathi"/"أثاثي" in served home HTML (both locales).
- Style-card selection unchanged (each links to the design flow); RTL/LTR intact; no missing-image errors; all asset paths resolve.

## Remaining public occurrences of the old brand name
**None in user-facing surfaces** (verified: 0 in both served home pages; the i18n test now guards that no `Athathi`/`أثاثي` remains in either dictionary). Remaining `Athathi` strings exist only in **internal code comments** and the reversed-text detector's test fixtures — never rendered to users — deliberately left per the "do not rename internal identifiers" instruction.

---

*Not committed, not pushed. Server running on http://localhost:3000. One QA note: live device-matrix screenshotting (mobile/tablet/desktop) still needs the browser tooling that is unavailable in this environment; the changes are structure-preserving so no responsive regression is expected, but a manual visual pass on the style grid is recommended.*
