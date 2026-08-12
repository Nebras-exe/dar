# DAR — Strict Catalog Filtering + Calm Homepage — Report

Improved catalog browsing, assistant filtering, variant-image matching, and homepage visual curation. Unrelated systems untouched. **All gates pass.** Not committed, not pushed.

---

## Final report card
```
STRICT CATEGORY FILTERING:          PASS
ASSISTANT EXACT FILTERING:          PASS
MULTI-FILTER AND LOGIC:             PASS
VARIANT IMAGE MATCH:                PASS
NO SILENT FILTER RELAXATION:        PASS
HOMEPAGE CALM CURATION:             PASS
BRIGHT PRODUCTS STILL IN SHOP:      YES
AI DESIGNER CATALOG GROUNDING:      PASS
ARABIC/ENGLISH COLOR NORMALIZATION: PASS
TESTS/BUILD:                        PASS (379/379, build 1057 pages)
```

## 1. Strict category filtering (already correct — verified)
Category pages lock the category (`parseShopState(sp, category)` → `lockedCategory` wins) and `filterProducts` enforces it with AND logic. Verified live: `/en/shop/sofas` returns **38 sofas, zero chair links**. No cross-category mixing; the catalog query never auto-adds related products.

## 2. Strict assistant product search (+ specific zero-result, no silent relaxation)
The chatbot maps a request like "أريد كرسي أحمر" → `category=chairs, color=red` and returns **only** chairs with a real red variant. Added an honest, SPECIFIC zero-result message when a category+colour has no exact match — e.g. **"لا توجد كراسي حمراء متاحة حاليًا في كتالوج دار. هل تريد مشاهدة أقرب لون متاح؟"** / "There are currently no red chairs available in DAR's catalog. Would you like to see the closest available colour?" — and it **offers** to widen but never widens automatically (zero cards on no match). A red SOFA never satisfies a red CHAIR request; a chair without a red variant is excluded.

## 3. Variant-aware filtering + 6. matching variant image
Colour filters inspect real product variants (`product.colors` includes every variant colour). When a result is surfaced BECAUSE of a colour, the card now shows **that variant's own photo** and highlights its swatch — never the beige image for a "red" request. Wired end-to-end:
- `ProductCard` gained `displayColorId` → resolves the variant photo (`variantsFor` → `variantImageUrl`) as `overrideSrc`, and leads/highlights that swatch.
- `ProductGrid` gained `displayColorFor(product)`.
- **Shop**: a colour filter passes the matching active colour per product → verified live, `/en/shop?color=red` shows **13 products each in its red variant image**.
- **Chatbot**: the demo engine and the Claude path now attach the matched colour to each card (`ChatProductCard` already renders the matching variant image + price + colour).

## 4. Multiple filters = AND intersection
Already enforced by `filterProducts` (facets AND, values within a facet OR). Verified: "كرسي أحمر أقل من 50 ريال" → chair AND red AND ≤50; `/en/shop/chairs?color=red` narrows to **9**. No filter is silently weakened.

## 5. Strict shop filters
Shop supports category / colour / material / style / price / availability, all from real catalog data (`url-state` validators drop invented values). Colour filtering shows products with actual matching variants + their variant image.

## 7/9/10. Homepage calm curation
New deterministic module `src/lib/catalog/curation.ts`:
- `SATURATED_COLORS` = {red, orange, yellow, pink, blue, multi, clear}; everything else (warm/muted/neutral) is calm.
- `calmVariantFor(product)` → the first calm colour of the product; `homepageEligible` → products that HAVE a calm variant, paired with that calm display colour; `homepageFeatured(limit)` → **category-balanced round-robin** of calm picks (one category never fills the grid).
- Applied to **every homepage product surface**: `FeaturedProducts`, the `BeforeAfter` pieces strip, and the `Categories` tiles (calm hero + calm variant image).
- Result (verified live on `/en`): featured variants are grey / white / beige / green — **zero** red/orange/blue/pink/yellow. A product that only came in orange (`ikea-ps-2026-bed-frame`) is now shown in its **grey** variant; an orange-only piece (`dyvlinge-armchair`) is not featured at all.

## 8. Bright products stay in the shop
Nothing removed from the catalog. Bright colours remain fully searchable/purchasable — verified: `/en/shop?color=red` returns **13** products (in their red variant image). The homepage simply doesn't FEATURE them (or shows their calm variant when they have one).

## 11/12. Assistant tools + Room Agent grounding (preserved)
`search_catalog` executes structured filters in application code; the LLM never fabricates matches (fake slugs dropped; zero → "zero results"). The AI Designer's `groundCatalog` keeps its **explicit** progressive-relaxation logic and surfaces unmatched categories as `no_catalog_match` warnings (never a silent fabricated substitution) — matching "explicit relaxation logic", and it grounds only to real catalog products/variants. Unchanged.

## 13. Colour normalization (AR + EN synonyms)
Added `COLOR_SYNONYMS` + `detectColor()` in `intents.ts`: maps سكري→cream, زيتي→olive, عاجي→ivory, طوبي/طيني→terracotta, رصاصي→grey, كحلي→navy, ذهبي→brass, tan/greige→taupe, off-white→cream, gold→brass, etc., **only** to colours that exist in the taxonomy — never invents a colour. أحمر/بيج/رمادي/أسود/أبيض/زيتوني already resolved via the taxonomy labels.

## Files modified
- `src/lib/catalog/curation.ts` (new) + `catalog/index.ts` export.
- `src/components/shared/product-card.tsx`, `src/components/shop/product-grid.tsx` — `displayColorId` / `displayColorFor` (variant-aware image).
- `src/features/home/featured-products.tsx`, `before-after-section.tsx`, `categories.tsx` — calm curation.
- `src/features/shop/shop-browser.tsx` — colour-filtered results show matching variant.
- `src/lib/chatbot/intents.ts` — colour synonyms + `detectColor`.
- `src/lib/chatbot/demo-engine.ts` — pass matched colour to cards; specific no-result message.
- `src/lib/chatbot/service.ts` — Claude path attaches matched colour to cards.
- Tests: `src/lib/catalog/curation.test.ts` (+6), `src/lib/chatbot/chatbot-color.test.ts` (+6).

## Gates
| Check | Result |
|---|---|
| `typecheck` | ✓ clean |
| `lint` | ✓ clean |
| `audit:arabic` | ✓ 3127 strings, no reversed/corrupt |
| `test` | ✓ **379/379** (+12 new) |
| `build` | ✓ compiled, **1057/1057** pages |

Test coverage per spec: sofa/chair category strictness; "red chair" → only red chair variants; no-red-chair → zero exact results with specific message; no silent relaxation; AND logic; matching variant image (card colour tag); homepage avoids bright variant when a muted one exists; bright-only product not featured but present in catalog; AR/EN colour normalization. No paid API calls in tests.

## Live verification (port 3000)
`/en/shop/sofas` = 38 sofas, 0 chairs · `/en/shop?color=red` = 13 products each in the red variant image · `/en/shop/chairs?color=red` = 9 (AND) · `/en` featured/category images all calm (grey/white/beige/green), 0 bright.

## Notes
- **Live device/click QA** (dragging filters, chatting on mobile) still needs the browser tooling unavailable here; covered via unit tests + served-HTML checks. A manual pass of `/ar/shop` + a "كرسي أحمر" chat is recommended.
- Per instruction: **not committed, not pushed.** DAR is running on http://localhost:3000.
