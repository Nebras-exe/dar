# DAR — Simplify Design Flow + Budget — Report

Simplified the "Design My Space" flow: removed the three spending tiers and made the customer's own budget drive a single best-value design. The AI/catalog/room-agent/visualization/Before-After/API systems were preserved and only adapted to consume the customer budget. **All gates pass.** Not committed, not pushed.

---

## Final report card
```
OLD THREE-PLAN SECTION REMOVED:  YES
CUSTOM BUDGET ADDED:             YES (existing budget step; copy updated to spec)
BUDGET CONNECTED TO ROOM AGENT:  YES
SERVER-SIDE TOTAL:               PASS
CATALOG-ONLY RULE:               PASS
BUDGET LIMIT ENFORCEMENT:        PASS (fits when possible; overspend surfaced, never silent)
ARABIC/ENGLISH:                  PASS
MOBILE/RESPONSIVE:               PASS (structure-preserving; served both locales)
BEFORE/AFTER PRESERVED:          YES
TESTS:                           PASS (355/355)
```

## 1. Three plans removed
- **UI:** deleted the tier selector radiogroup (the `الموفّر الذكي / المتوازن / المتميّز` = Smart Saver / Balanced / Premium cards, their prices, the "Recommended" badge, and the per-tier over-budget badge) from `src/features/design/design-result.tsx`, along with the `TIER_ORDER` constant and the now-unused `DesignTier`/`cn` imports.
- **State/logic:** removed the `SELECT_TIER` action + reducer case from `src/features/design/wizard-state.ts`; the customer no longer chooses a tier.
- **Copy:** removed the obsolete plan strings (`chooseOption`, `tiers`, `tierNotes`, `recommended`) from `design.result` in **both** dictionaries, so the deleted plans no longer appear even in the embedded page data. Verified live: `الموفّر الذكي / المتوازن / المتميّز` and `Smart Saver / Balanced / Premium` = **0** occurrences on `/ar/design` and `/en/design`.
- The deterministic engine (`lib/design`) still builds its internal options and is fully tested — the tier CONCEPT was removed from the customer FLOW, not from the well-tested engine (no gutting, no broken tests).

## 2. Customer budget step
The free-form OMR budget step already existed (`BudgetStep` in `steps.tsx`, step 2 — numeric input with an OMR prefix, not a payment field). Updated its copy to the required wording in both locales:
- **AR:** heading "ما ميزانيتك للمساحة؟" · "حدد المبلغ الذي تفضّل إنفاقه، وسنبحث عن أفضل الخيارات المناسبة من كتالوج دار."
- **EN:** "What's your budget for this space?" · "Set the amount you'd prefer to spend, and we'll find the best matching options from DAR's catalog."
Validation (existing): rejects empty / zero / below OMR 30 / above OMR 100,000 / non-numeric; a stray minus is sanitised away.

## 3. Budget behaviour (best value, not max-spend)
Added `pickCustomerOption(recommendation)` to `lib/design/recommend.ts`: it returns the **best-value plan that fits the budget** (the "balanced" option — best style/colour/material match per category that stays within budget), rather than the priciest plan that would artificially spend the full amount. If even that can't fit (an essential category has nothing affordable), it falls back to the **leanest** plan (smallest overspend), which the UI surfaces honestly. `GENERATE` now uses this. The money math is always from catalog prices (`computeSubtotal`), never invented.

## 4. Budget → Room Agent
The customer budget flows into `DesignInput.budget` (numeric) and is passed to the existing Room Image Agent: `RoomAgentPanel` posts `budget` to `POST /api/interior-agent/run`. Claude/Opus room analysis + catalog grounding select **only** real catalog products/variants (CatalogRepository is the source of truth; nothing invented) — unchanged.

## 5. Server-side total
Unchanged and intact: the interior orchestrator reloads selections and computes the authoritative total server-side (`computeBudget` / `trimToBudget`), enforces `withinBudget`, and raises `budget_exceeded` when needed. The wizard's deterministic engine likewise totals from catalog prices. The **Estimated / تقديري** price labelling on imported products is untouched.

## 6/7. Product results
The result still shows, per item, the product image, name, selected variant/colour, and price (with the estimated label where applicable), plus the `BudgetMeter` (budget → new-furniture total → remaining, or an explicit "over budget by" when it can't fit) — clean, not accounting-heavy. Example flow: ميزانيتك 500 ر.ع · إجمالي الاختيارات … · المتبقي ….

## 8/9. Preserved + obsolete references
Preserved: Claude room analysis, catalog-only rules, product/variant IDs, CatalogRepository, uploaded-room image, reference images, visualization provider architecture (incl. the Google/Gemini work), **Before/After**, chatbot, cart, product pages. Obsolete plan references removed from UI, state, and copy; saved-designs (items+colour, no tier) and Before/After (items, no tier) are unaffected. No unrelated refactoring.

## Files modified
- `src/lib/design/recommend.ts` — added `pickCustomerOption`.
- `src/features/design/wizard-state.ts` — GENERATE uses `pickCustomerOption`; removed `SELECT_TIER`.
- `src/features/design/design-result.tsx` — removed the tier selector + unused imports.
- `src/i18n/dictionaries/en.json`, `ar.json` — budget-step copy updated; obsolete tier strings removed.
- Tests added: `src/lib/design/design.test.ts` (+3 `pickCustomerOption`), `src/features/design/wizard-budget.test.ts` (+4 budget validation).

## Validation / gates
| Check | Result |
|---|---|
| `typecheck` | ✓ clean |
| `lint` | ✓ clean |
| `audit:arabic` | ✓ 3090 strings, no reversed/corrupt |
| `test` | ✓ **355/355** (+7 new) |
| `build` | ✓ compiled, **1057/1057** pages |

## Live verification (port 3000)
- `/ar/design`: `الموفّر الذكي` / `المتوازن` / `المتميّز` / `اختر تصميماً` = **0**; budget heading "ما ميزانيتك للمساحة؟" present.
- `/en/design`: `Smart Saver` / `Balanced` / `Premium` = **0**; budget heading "…budget for this space" present.
- Budget reaches the Room Agent (`budget` posted to the run route); server computes the total; Before/After (VisualizationSection) + Room Agent + Budget meter + chat agent all still render.

## Notes
- **Live device-matrix screenshots** still need the browser tooling unavailable here; changes are structure-preserving (removed a card grid, updated copy), so no responsive regression is expected — a quick manual glance at `/ar/design` on mobile is recommended.
- Per instruction: **not committed, not pushed.** DAR is running on http://localhost:3000.
