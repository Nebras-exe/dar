# Phase 04 — AI Designer UX — Report

_Status: ✅ Complete & verified (build/lint/typecheck/tests green; routes + RTL verified over HTTP; result visually reviewed via a published engine-output artifact). Live in-browser click-through was not possible this session — the Chrome extension did not connect._

## Summary

Phase 04 makes the core Athathi idea tangible with a real, guided **AI Designer** at `/[locale]/design`: the user gives a room, budget, style, keep/replace choices and preferences, and Athathi returns a **catalog-backed, budget-aware design plan** — real demo products, per-product reasons, an editable result (replace / remove), and the flagship **Add entire design to cart** that reuses the Phase 03 cart. Everything is **Demo Mode**, clearly and honestly labelled: no image is uploaded or analysed, and the recommendation is deterministic (no LLM). The architecture is built so a Phase 05 agent can replace Demo Mode without rewriting the UI.

## Route Built

`/[locale]/design` (EN LTR + AR RTL), prerendered for both locales; `robots: noindex` (a per-session interactive tool). The homepage "Design My Space" CTAs — hero, header nav + button, budget-intelligence, the Design-showcase card, style tiles, reference section, final CTA, and footer — now route here (14 links verified) instead of the Phase 02 in-page `#design` anchor. The showcase section keeps its `id="design"` as a homepage landmark; no CTA points at it any more.

## Wizard Flow

A 7-step brief → honest Demo analysis → editable result, in three phases (`brief` → `analysis` → `result`) held in a single `useReducer` + `localStorage` (survives step nav and refresh; no Redux). Steps: **1** Room photo · **2** Room type · **3** Budget · **4** Style · **5** Keep · **6** Preferences · **7** Review. Desktop shows a labelled step rail (numbers → checks, visited steps clickable); mobile shows a compact "Step n of m" line + progress bar. Each step has one clear action with Back/Continue; per-step validation gates Continue.

## Upload UX

Local-only room photo: drag & drop **or** click, keyboard-accessible drop zone, live preview, replace, remove, and invalid-type / too-large (>12 MB) states. JPEG/PNG/WEBP. The image **never leaves the browser** — only its file name enters wizard state, and the preview object URL is revoked on cleanup. A clear demo note states analysis is Demo Mode only; a photo is optional.

## Room Types

Living Room, Bedroom, Majlis, Dining Room, Office, Kids Room, Outdoor — visual cards in an accessible `radiogroup`. Each maps to a catalog `RoomType` (Kids Room → bedroom products with a storage-forward plan) so the future AI/catalog reuses the same machine values.

## Budget

Numeric OMR: a labelled text input (LTR-forced digits) with quick chips (200/350/500/750/1000). Validated for empty / non-positive / too-low (< 30) / too-high (> 100,000), with inline `role=alert` errors. No inaccessible slider. Arabic renders Eastern-Arabic digits.

## Style

Reuses the **exact Phase 03 style taxonomy** (`warm-modern, modern, japandi, minimal, contemporary, classic-modern, boho`) as visual cards: one required primary style + an optional secondary. No separate style vocabulary.

## Existing Furniture

For the room's categories, the user sets **Keep / Replace / Not sure** (accessible segmented control; Keep is success-coloured but also labelled). "Keep" removes that category from the design (demonstrating the trust principle); an honest note says these are user-chosen in Demo Mode, not detected from the photo.

## Preferences

Optional preferred **colours** (labelled swatches) and **materials** (chips) from the Phase 03 taxonomy, plus a free-text "Anything else?" note (stored as input only, with a note that it is not AI-interpreted yet). A review step summarises the whole brief with per-row **Edit** jump-backs before generating.

## Demo Mode

After **Generate my design**, a polished progress panel reveals the six deterministic steps the engine actually performed (received input → checked budget → matched style → searched catalog → checked prices → built bundle), badged **Demo Mode**, with an explicit "no AI room analysis in this phase" note. The reveal is a short bounded stagger (≈0.4 s/step), not a fake multi-second timer; reduced-motion users see it completed at once. The result is generated deterministically from the selections + catalog before the animation.

## Recommendation Architecture

A pure, framework-free domain layer in `src/lib/design/` built **entirely on the Phase 03 catalog** (`filterProducts`, catalog queries, `computeSubtotal`) — one product source of truth, no second catalog:

- `types.ts` — `DesignInput`, `FurnitureDecision`, `DesignItem`, `DesignOption`, `BudgetSummary`, `DesignRecommendation`, `ReplacementMode`.
- `room-needs.ts` — per-room ordered category plans (essentials first) + catalog-room mapping.
- `recommend.ts` — `buildDesignRecommendation(input)` (3 tiers), `getCandidates`, `buildOption`, `summarize`, `findReplacements`/`pickReplacement`.
- `reasons.ts` — deterministic bilingual reasons from real matching conditions (style → colour → material → budget → room fit).
- `demo-service.ts` — the boundary: `generateDemoDesign(input) → DesignRecommendation`. A future `generateAgentDesign(input)` returns the **same shape**, so Demo Mode swaps for an agent without touching the UI.

## Budget Optimizer

All math is numeric OMR (3-decimal, via `computeSubtotal`/`roundOmr`) — never formatted strings. It walks the room's prioritised categories, skips excluded (kept) categories, and per tier picks: Smart Saver = cheapest that fits, Balanced = best match that fits, Premium = nicest that still fits the **remaining** budget. Essentials are still placed when nothing fits (minimising overspend, which is **surfaced** as "Over budget by …", never silent); non-essentials are skipped when tight. It does not force spending the whole budget. Very low budgets still return a useful high-impact plan with an honest note. The recommended tier is the richest option that stays in budget.

## Product Replacement

Per item: **Find cheaper / Find similar / Upgrade**, resolved deterministically from the catalog (`cheaper` = nearest below; `upgrade` = nearest above; `similar` = within ±30%, best match first), excluding the current item and the rest of the design. Replacing recomputes totals + remaining without resetting the design; when no alternative exists the UI says so honestly. **Remove** drops an item and recalculates. Tier switching re-seeds the working set.

## Add Entire Design to Cart

Adds every recommended item (with its default colour) via the existing Phase 03 cart context — no duplicated cart logic; the header count updates live. A success panel offers **View cart** / **Continue editing**. Kept existing furniture is shown at **OMR 0** and never added. An optional **Save design** persists the brief + design locally (no accounts, no My-Designs dashboard).

## Arabic / RTL

All 130 new design keys are authored bilingually with a compile-time key-parity guarantee (EN == AR) and hand-audited (logical Unicode, never reversed). RTL is structural (logical properties; back/continue arrows flip via `rtl:rotate-180`). Verified server-rendered `<html dir="rtl" lang="ar">` on `/ar/design`. Audited surfaces: progress, upload, room/style cards, budget, keep decisions, preferences, review, Demo progress, result, budget meter, replace controls, add-to-cart, error states.

## Accessibility

`radiogroup`/`radio` for room/style/keep/tier selectors; `aria-pressed` for colour/material toggles; labelled budget input with `aria-invalid` + `role=alert`; keyboard-operable drop zone (Enter/Space) with a real file input; `role=progressbar` on the mobile step bar and budget meter with value text; colour is never the only signal (checks, labels, "Over budget by …" text); visible focus throughout; reduced-motion respected; one `<h1>` per phase.

## Responsive QA

Mobile-first: room/style cards are 2-col on mobile → 3-col up; the progress collapses to a compact bar; budget input and quick chips wrap; the result switches to a single column with the budget meter/actions stacking under the item list; replace menus are reachable. Verified by responsive code review (browser device emulation unavailable this session).

## Skills Used

See `PHASE_04_SKILLS.md`. Headline: `frontend-design` (premium, non-cliché review lens — also caught a real blank-content hydration bug) and `artifact-design` (result-preview artifact). Testing via the built-in `node:test` runner.

## Browser QA

Attempted via Claude-in-Chrome; the extension did not connect this session. Substituted with: all-route HTTP status checks (EN+AR home/design/shop/cart = 200; 404s still correct elsewhere), server-rendered RTL verification, CTA-rewiring verification (14 `/design` links, zero stray `#design` CTAs), a clean dev-log, the full engine covered by 32 unit tests over the exact functions the UI dispatches to, and a published artifact of real engine output across three briefs × three tiers for visual review.

## Tests

`npm test` → **32 passing** (17 new in `src/lib/design/design.test.ts`): room-needs mapping, keep-excludes-category, replace/unsure keeps category, budget respected where feasible + exact totals, no duplicate products/categories, saver ≤ balanced ≤ premium, style/colour ranking, replacement cheaper/upgrade/similar (with exclusions), very-low-budget behaviour + honest overspend, recommended-tier-in-budget, summarize-after-remove, outdoor mapping, and determinism. No new dependency.

## Build / Lint / Typecheck

- `npm run lint` → **clean, 0 warnings** (both `react-hooks/set-state-in-effect` issues fixed properly — hydration moved into the reducer; the analysis reveal uses a lazy initializer — no rules weakened).
- `npm run typecheck` → clean (`tsc --noEmit`, strict).
- `npm run build` → success, **199 pages** (`/design` prerendered per locale).

## Known Limitations

- **No live browser QA this session** — extension offline; verification was HTTP + 32 unit tests + the result artifact + code review. Device emulation remains unavailable.
- Room image is UX-only (never uploaded/analysed); "generated After" imagery is intentionally not built (§31) — the result uses the structured plan + catalog `ProductImage` art.
- Save Design is a local foundation only (no accounts / dashboard).
- Free-text note is stored, not interpreted (Demo Mode).

## Future AI Integration

The seam is `generateDemoDesign(input) → DesignRecommendation`. Phase 05 adds `generateAgentDesign(input)` returning the **same** `DesignRecommendation` shape; the wizard's `GENERATE` action calls the service, and the result UI consumes structured data (items by slug, numeric budget summary, `Localized` reasons, demo steps) — **not** raw LLM prose. So the future flow is: user input → AI room analysis → structured `DesignInput` → the same deterministic recommendation/scoring tools (which can be exposed to the model as functions) → `DesignRecommendation` → the same Phase 04 result UI. Vision (furniture detection) simply pre-fills the keep/replace decisions and preferences that the wizard already models. No UI rewrite required.

## Next Phase

**Recommended: Phase 05 — Room Analysis / Vision AI** (connect real image understanding to pre-fill the structured `DesignInput`, and optionally a real agent orchestrator behind `generateAgentDesign`). Do **not** start it yet.
