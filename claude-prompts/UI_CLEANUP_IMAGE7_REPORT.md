# DAR — UI Cleanup + Image 7 Report (Phase 05)

Three targeted visual fixes, no unrelated redesign, no functionality changed. **All gates pass** and every change is verified live on port 3000. Not committed, not pushed.

---

## Task 1 — Duplicate «دار» text beside the logo — REMOVED

**Which file/component rendered the duplicate text:** `src/components/shared/logo.tsx`. It rendered the DAR mark image **plus** a separate wordmark text span (`DAR` / `دار`, with an alternate-language line via `showAlternate`). Because the mark image itself already contains «دار», the adjacent text was duplicate branding.

**What was removed:** the entire wordmark text block (both the primary and the alternate `<span>`s) and the `showAlternate` prop. `Logo` now renders **only the mark image** (`Image`, `h-9 w-auto`). The image keeps `alt="DAR"` / `alt="دار"` so assistive tech still announces the brand (alt text is not visible, so it is not a duplicate).

**Applied consistently:** `Logo` is the single brand component, used once by the responsive header (`header.tsx`, serves both desktop and mobile) and once by the footer (`site-footer.tsx`). Updated the footer call to drop `showAlternate`. Verified the header has **no** other standalone brand-text element (all `brand` references there are colour utilities). The logo image itself was **not** modified.

## Task 2 — Image 7 as the AI room preview — DONE

**Final path of image 7:** `public/images/ai/ai-room-preview.webp` (converted from `pic/7.png` via `sharp`, 1600×900, 168 KB, quality 82). Original `D:\Athathi\pic\7.png` preserved.

**Which room-preview component was updated:** the homepage **hero** (`src/features/home/hero.tsx`) — the large "AI interior design" showcase. Its illustrated `RoomIllustration` scene was replaced with `next/image` of image 7 (`fill`, `object-cover`, `priority`, responsive `sizes`) inside the **existing** `ImageFrame` (`ratio="wide"`, `rounded="xl"` — rounded container preserved, no stretch/distortion). The overlay controls that belong above the image — the **Sample preview** badge and the **AI cue** badge — were preserved.

Image 7 is a finished, catalog-annotated warm room (sand walls, olive greenery, terracotta pillow, boucle sofa, oak table with baked-in OMR price tags) — fully consistent with the Terra/DAR system.

`RoomIllustration` was **not** deleted: it is still used by `visualization-preview.tsx`, `visualization-section.tsx`, and the home `before-after.tsx` (before/after placeholders), so it is not orphaned. No AI logic was touched.

## Task 3 — Clean the budget-bar area — DONE

**Which furniture-thumbnail section was removed:** in the hero (same block as Task 2), the **floating product-card row** — a strip of clipped furniture mini-cards (product image + name + OMR price) that sat between the room preview and the budget summary, cluttering the area around **الميزانية / الإجمالي التقديري**.

**Removed:** the floating `figure` cards (`getAllProducts().slice(0,3).map(...)`), the empty absolute-positioned container that held them, and the now-unused imports (`ProductImage`, `getAllProducts`, `formatOmr`, `Product`, `pieces`). The budget strip's top margin was tightened (`mt-10 sm:mt-12` → `mt-6`) now that nothing overlaps it, giving clean whitespace.

**Kept intact:** the budget value (`Budget` / الميزانية + value), the estimated total (`Estimated total` / الإجمالي التقديري + value), the Wallet icon, the summary container, and the honest caption ("Real catalog pieces · real OMR prices"). No calculations, state, or product **data** were removed — only the visual thumbnail row. Furniture in every other section of the site is untouched.

## Confirmation that budget functionality remains intact
The budget/estimated-total display in the hero is static marketing copy (dictionary values `budgetValue`/`totalValue`) — it renders unchanged. The real budget engine (deterministic OMR math in `catalog/pricing.ts`, the design wizard's budget step, `BudgetMeter`, the interior-agent budget computation) was **not** touched; all 348 tests pass, including the budget/orders/payments suites.

## Files modified
- `src/components/shared/logo.tsx` — mark-only (removed wordmark text + `showAlternate`).
- `src/components/layout/site-footer.tsx` — dropped `showAlternate` from the `Logo` call.
- `src/features/home/hero.tsx` — room image = image 7; removed floating furniture cards; cleaned imports + spacing.

## Assets
- Created: `public/images/ai/ai-room-preview.webp` (from `pic/7.png`).
- Originals preserved in `D:\Athathi\pic` (1–7.png + Logo.jpeg all present).

## Validation / test / build results
| Check | Result |
|---|---|
| `typecheck` | ✓ clean |
| `lint` | ✓ clean |
| `audit:arabic` | ✓ 3098 strings, no reversed/corrupt |
| `test` | ✓ **348/348** |
| `build` | ✓ compiled, **1057/1057** static pages |

## Live verification (port 3000)
- Logo image (`dar-mark`) renders in header; **no** standalone «دار»/«DAR» text beside it (Logo has 0 text spans).
- AI room preview now uses **image 7** (`ai-room-preview.webp`) on both `/en` and `/ar`; serves **HTTP 200 image/webp**; the old illustrated room is no longer shown in the hero.
- Furniture-thumbnail strip beneath the budget bar is gone.
- Budget bar works: EN "Estimated total", AR "الإجمالي التقديري" both present.
- Arabic RTL and English LTR intact; no broken image paths.

---

## Task 4 — Replace Before / After demo images — DONE (re-run)

**Component modified:** `src/features/home/before-after.tsx` (the homepage Before/After comparison). It was rendering illustrated `RoomIllustration` scenes as the before/after layers; those were replaced with the real room photography via `next/image`, **inside the same interactive `BeforeAfterSlider`** (`src/components/ui/before-after-slider.tsx`) — the slider component was **not** touched, so drag/touch/keyboard/RTL and the `role="slider"` handle are all preserved.

**Final asset paths:**
- Before: `public/images/before-after/room-before.webp` (from `pic/Before.png`, 1600×900, 36 KB)
- After: `public/images/before-after/room-after.webp` (from `pic/after.png`, 1600×900, 84 KB)

Converted via `sharp` (quality 82). Originals in `D:\Athathi\pic` preserved (`Before.png`, `after.png` present).

**Before/After mapping (correct, not swapped):** `Before.png` → `room-before.webp` → the slider's `before` layer (the **empty** room); `after.png` → `room-after.webp` → the `after` layer (the **furnished** redesign). The two are the SAME room / same camera, so both layers use identical `fill` + `object-cover` + `object-center` and a matched `aspect-[16/9]` frame — they stay perfectly registered as the divider moves (no independent crop, no mismatch, no white bands).

**Interactive slider preserved:** draggable divider, centered handle, mouse + touch (`touch-pan-y`), keyboard (Arrow/Home/End) with RTL-inverted direction, accessible `role="slider"` + `aria-valuenow`, responsive, and the localized **Before / After** · **قبل / بعد** labels (bottom-start / bottom-end). Verified live: `role="slider"` present, both images referenced, labels present in both locales.

**Old illustration removed from this section:** `RoomIllustration` is no longer used by the Before/After comparison. It was **not** deleted, because it is still legitimately used by the Phase 07 AI visualization (`visualization-preview.tsx`, `visualization-section.tsx`).

**AI functionality untouched:** these are demo/preview assets only — no change to AI generation APIs, the Gemini image provider/config, the uploaded-room workflow, generated-result handling, or product recommendation logic.

**Validation:** `typecheck` ✓ · `lint` ✓ · `audit:arabic` ✓ (3098) · `test` **348/348** ✓ · `build` ✓ (1057 pages). Live on :3000 — `room-before.webp` / `room-after.webp` both serve **HTTP 200 image/webp**; EN shows Before/After, AR shows قبل/بعد; no broken paths.

---

## Notes
- **Live device-matrix screenshots** (mobile/tablet visual pass) still need the browser tooling that is unavailable in this environment; changes are structure-preserving (grids, containers, and responsive `sizes` unchanged), so no responsive regression is expected — a manual visual glance at the hero + Before/After on mobile is recommended.
- Tasks 1–3 from the earlier run were verified **still correctly in place** and were not undone.
- Per instruction: **not committed, not pushed.** Server on http://localhost:3000.
