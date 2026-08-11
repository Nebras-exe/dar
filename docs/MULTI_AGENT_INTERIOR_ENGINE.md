# Multi-Agent Interior Engine

A server-side orchestration layer that turns a room photo + budget + style + user
instructions into a **catalog-grounded, budget-validated design plan** and a
structured **render specification** for a future image provider. It **composes the
existing Athathi systems** rather than rebuilding them:

- **Room vision** → the existing `src/lib/vision` (Claude/OpenAI/Gemini providers +
  deterministic demo), unchanged.
- **Catalog + variants** → the existing `src/lib/catalog` + `src/lib/catalog-preview`.
- **Budget/money** → the existing OMR helpers (`roundOmr`, `computeSubtotal`).
- **Render hand-off** → the existing `src/lib/visualization` fingerprint + contract.

The AI **only plans**. Deterministic application code owns catalog truth, money, and
fit — the model can never invent a product, price, dimension, supplier, or override a
constraint.

## Pipeline

```
room image + roomType + budget + style + instructions + approved memory
        │
        ▼  1. ROOM VISION AGENT        (src/lib/vision — Claude Vision or demo)
   RoomAnalysis (style, palette, existing furniture keep/replace, features;
                 dimensions always "unknown" — never guessed from one photo)
        │
        ▼  2. INTERIOR DESIGNER AGENT  (Claude, or deterministic Demo provider)
   DesignBrief: intent, keep[], remove[], needs[] (category/style/material/
                colour/maxPrice — a NEED, never a product), preferred colours/materials
        │
        ▼  3. CATALOG AGENT            (deterministic — authoritative)
   CatalogSelection[]: real slug + real variant + authoritative OMR price +
                       dimensions + supplier + reference image
        │
        ▼  4. BUDGET ENGINE            (deterministic — trim to fit, exact OMR)
        ▼  5. LAYOUT ENGINE            (deterministic — FIT_CONFIRMED / FIT_LIKELY /
                                        NEEDS_MEASUREMENT / DOES_NOT_FIT)
        ▼  6. RENDER SPEC              (structured hand-off; NO image generated here)
   RenderSpec: preserve architecture + kept furniture, insert real products,
               palette, hard negative constraints, design fingerprint
```

## Agents / modules (`src/lib/interior-agents/`)

| File | Role |
|---|---|
| `types.ts` | All contracts (`InteriorRunInput`, `DesignBrief`, `ProductNeed`, `CatalogSelection`, `LayoutValidation`/`FitStatus`, `BudgetResult`, `RenderSpec`, `InteriorDesignRun`, `ProviderMeta`). Client-safe, no secrets. |
| `config.ts` | The ONE place the Claude model default + run limits live. |
| `provider.ts` | `DesignerProvider` interface + selection (Claude when configured, else null → Demo). |
| `claude-provider.ts` | **Server-only** Claude planner via the Anthropic Messages REST API (fetch, same pattern as the existing vision provider). Reads the key here only; never logs/returns/exposes it. |
| `demo-provider.ts` | Deterministic planner from the existing room plan — the offline fallback. |
| `prompts.ts` | Versioned, injection-defended prompts. User text/memory are fenced as DATA. |
| `validation.ts` | Validates raw model JSON → typed brief; drops fabricated/out-of-taxonomy values. |
| `catalog-agent.ts` | Grounds each need → real product + variant (deterministic; progressive relaxation; never fabricates). |
| `layout-agent.ts` | Deterministic fit status; `NEEDS_MEASUREMENT` unless a real width is known. |
| `budget.ts` | Deterministic OMR totals + trim-to-fit. |
| `render-spec.ts` | Structured spec + hard negative constraints for a future image provider. |
| `orchestrator.ts` | The bounded run state machine; never throws; demo fallback. |
| `index.ts` | Client-safe barrel (types + validator only — no server pieces). |

## Tool use / catalog grounding

The catalog agent is the deterministic implementation of the "safe tools"
(`search_catalog` / `get_product` / `get_variants` / `check_fit` / `calculate_budget`).
The model requests **needs**; Athathi executes the grounding. Tools never expose DB
admin, raw SQL, the filesystem, payment authority, or supplier writes. (The existing
conversational Agent already exposes the allowlisted `search_catalog`/`get_product`/…
registry; this engine reuses the same catalog queries deterministically rather than
letting the model name products.)

## Run state

`InteriorDesignRun` carries `status`
(`analyzing_room → planning → searching_catalog → validating_layout →
validating_budget → preparing_visualization → complete | failed`), `provider`
(designer + vision mode + model, **never a secret**), the room analysis, brief,
catalog selections, layout + budget results, render spec, and `warnings`
(`dimensions_unknown` / `budget_exceeded` / `no_catalog_match` / `does_not_fit` /
`partial_plan`).

## Provider abstraction + Demo fallback

`resolveDesignerProvider()` returns the Claude provider only when
`ANTHROPIC_API_KEY` is set; otherwise the deterministic **Demo** provider carries the
entire run — **no external call is made**. An invalid model plan retries within a
strict limit, then also falls back to Demo. `interiorDesignerMode()` reports
`"claude" | "demo"` (enum only) to the client badge.

## Render spec → future image provider

The spec reuses the existing `VisualizationProvider` contract idea: `DemoVisualization`
today, a real image-edit provider later. **No paid image API is connected and no
external image-generation call is made.** Claude prepares the spec; the image is
generated later by the visualization layer or a future provider.

## API

`POST /api/interior-agent/run` (Node runtime) — multipart: room image (optional) +
`roomType` / `budget` / `primaryStyle` / `secondaryStyle` / `instructions` / `memory`
/ `knownWidthCm`. Returns `{ ok, run }` with analysis, brief, catalog selections,
budget, fit warnings, render spec, and provider metadata — or a stable safe error
code. `GET` returns `{ designerMode }` (enum only). Image validation mirrors the
vision route (MIME allow-list + size + magic-byte sniff); image bytes/base64 are
never logged.

## Security + cost controls

- The `ANTHROPIC_API_KEY` is read only inside `claude-provider.ts` (server), sent only
  in the `x-api-key` header, and never logged/returned/exposed. Verified absent from
  `.next/static`; no client component imports the server engine.
- Client-supplied prices/product truth are never trusted — the catalog agent is
  authoritative.
- User instructions + memory are DATA (fenced, injection-defended); the budget engine
  is authoritative; deterministic fit is never overridden by the model.
- Bounded per run (`INTERIOR_LIMITS`): max Claude calls, max plan retries, max needs /
  selections, and per-call timeouts — no infinite loops, no fan-out.
- Tests mock the provider; **no real Claude call is ever made in tests or the build**.

See `docs/CLAUDE_API_SETUP.md` for enabling Claude, and
`docs/MULTI_AGENT_INTERIOR_REPORT.md` for the delivery report.
