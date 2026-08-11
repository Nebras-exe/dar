# Multi-Agent Interior Engine + Claude Integration — Report

_Status: ✅ Implemented & wired into the existing Design My Space flow; all local gates green. The Claude provider + env slot exist but **no real Anthropic API call was made** — no key was read, printed, tested, or exposed. With no key, the whole engine runs the deterministic Demo path. Awaiting the user's key in `.env.local` + explicit approval for the first live test._

## 1. Multi-agent architecture

A server-side orchestration layer (`src/lib/interior-agents/`) that composes the
existing Vision, catalog, variant, budget, and visualization systems into one run:
room image → Vision → Designer (Claude/Demo) → deterministic catalog grounding →
deterministic budget + layout validation → structured render spec. The AI only plans;
deterministic code owns catalog truth, money, and fit. Full design in
`docs/MULTI_AGENT_INTERIOR_ENGINE.md`.

## 2. Agents created

- **Room Vision agent** — reuses `src/lib/vision` (Claude Vision provider already
  existed; unchanged). Never claims measurements; dimensions stay "unknown".
- **Interior Designer agent** — `claude-provider.ts` (live plan) + `demo-provider.ts`
  (deterministic fallback), behind a `DesignerProvider` interface.
- **Catalog agent** — `catalog-agent.ts`, deterministic grounding to real products +
  variants (never fabricates id/price/dimension/supplier).
- **Layout agent** — `layout-agent.ts`, deterministic fit status.
- **Budget engine** — `budget.ts`, authoritative OMR totals.
- **Render-spec agent** — `render-spec.ts`, structured hand-off + negative constraints.

## 3. Orchestrator

`orchestrator.ts` → `runInteriorDesign(input, options)` — a typed `InteriorDesignRun`
state machine (`analyzing_room → planning → searching_catalog → validating_layout →
validating_budget → preparing_visualization → complete | failed`). Never throws;
bounded by `INTERIOR_LIMITS`; falls back to Demo on any planning failure.

## 4. Claude Vision provider

Room analysis reuses the existing `src/lib/vision/providers/anthropic.ts` (Messages
REST API, server-side key, no SDK, no logging). The new designer `claude-provider.ts`
follows the same pattern for planning. **No call is made without a key at runtime.**

## 5. Tool use / catalog grounding / variant grounding

The catalog agent is the deterministic implementation of the safe tools
(search/get/variants/fit/budget). The model requests **needs**; Athathi grounds them.
Variants use the local variant layer, preserving `productId`, real `variantId`/colour,
authoritative price, and reference image. Fabricated products are impossible — every
selection is a real catalog slug (tested).

## 6. Layout validation

Deterministic `FIT_CONFIRMED / FIT_LIKELY / NEEDS_MEASUREMENT / DOES_NOT_FIT`.
`NEEDS_MEASUREMENT` unless the user supplied a real width — the model never overrides
this and no fit is claimed from a photo alone.

## 7. Budget validation

Deterministic exact 3-decimal OMR (`roundOmr`/`computeSubtotal`), with trim-to-fit;
the model never computes authoritative totals.

## 8. Render specification

Structured spec: room image reference, architecture + kept furniture to preserve, real
products to insert (with variant + reference image), palette, hard negative constraints
(`do_not_change_floor`, `do_not_change_selected_product_colour`, …), and the design
fingerprint. **No image is generated here** — it hands off to the visualization layer /
a future image provider.

## 9. Existing AI Designer integration

Wired into the EXISTING `/[locale]/design` wizard — **no second design page**. An
additive honest **provider badge** ("Claude Vision" vs "Demo Analysis") reads the
`GET /api/interior-agent/run` capability (enum only). Bilingual step labels are ready
(`design.engine.steps`). The existing Demo flow is unchanged and still works with no key.

## 10. Demo fallback

With no key, `resolveDesignerProvider()` returns null and the deterministic Demo
provider carries the full pipeline — end to end, offline, no external call.

## 11. API key setup location

Only in `D:\Athathi\.env.local` (git-ignored). Placeholders (empty) added to
`.env.example`: `ANTHROPIC_API_KEY=` + `ANTHROPIC_MODEL=`. Steps in
`docs/CLAUDE_API_SETUP.md`.

## 12. Security controls

- Key read only in `claude-provider.ts` (server); never logged/returned/exposed; not
  `NEXT_PUBLIC_*`. **Verified absent from `.next/static`; no client component imports
  the server engine; the run output contains no key/secret field (tested).**
- Client prices/product truth never trusted (catalog agent authoritative).
- User instructions + memory fenced as DATA; prompt-injection defended (tested).
- Image upload validated (MIME allow-list + size + magic-byte sniff); bytes never logged.
- No DB admin / raw SQL / filesystem / payment / supplier-write exposure.

## 13. Call / cost limits

`INTERIOR_LIMITS`: `maxClaudeCalls` 3, `maxPlanRetries` 1, `maxNeeds`/`maxSelections`
12, plan/vision timeouts 30 s. Bounded run; no infinite loops (tested).

## 14. Tests / build

`src/lib/interior-agents/interior-agents.test.ts` — **15 tests, provider MOCKED, zero
real Claude calls**: missing-key demo fallback, catalog grounding, fabricated-product
rejection, variant grounding, budget authority, layout guard, structured-output
validation, prompt-injection boundary, max-loop guard, provider selection, render-spec
correctness, key-never-in-output. Full suite: **299 tests pass**, lint 0, typecheck
clean, `npm run build` success (223 pages, `/api/interior-agent/run` registered),
`audit:arabic` clean, EN/AR parity 1613.

## 15. Known limitations / honest notes

- No live API call made yet (by design). The Claude path is exercised only via mocks.
- The render spec is prepared for a future image-edit provider; no paid image API is
  connected and no image-generation call is made.
- The Demo designer produces a sensible catalog-grounded plan but is heuristic (room
  category plan + preferences), not a creative model.
- Vision still never yields real measurements from a single photo.

## Next step (do NOT skip)

**Claude integration is ready.** Add your key to `D:\Athathi\.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-sonnet-5
```

Restart `npm run dev`, then **explicitly ask** to run the first live test.
