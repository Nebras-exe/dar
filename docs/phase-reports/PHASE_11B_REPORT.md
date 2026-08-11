# Phase 11B — Custom Manufacturing + Quality Check — Report

_Status: ✅ Complete & verified. Custom furniture now continues from Phase 11A's `ready_for_next_stage` through production and a real quality-check loop to **`ready_for_delivery`** — a fourth SEPARATE domain (order · payment · fulfillment · manufacturing). Ready-stock catalog groups bypass manufacturing entirely. A deterministic state machine, append-only event + QC history (a failed inspection is never overwritten), owner/supplier authorization mirrored in RLS, a premium supplier manufacturing workspace with a working QC + rework flow, a customer-safe manufacturing timeline, read-only Agent access, and a notification abstraction that RECORDS but never SENDS. Runs fully in Demo Mode; Supabase migrations + RLS are gated. Phase 11A and all earlier phases preserved (221 tests, all gates green). **External paid credits consumed: 0.** Phase 12 not started._

## 1. Phase 11B status

Complete and stable. Built only on the current repo state; no previous phase rebuilt; delivery/installation not started.

## 2. Skills actually used

See `PHASE_11B_SKILLS.md`. Headline: `security-review` (custom+ready gate, per-supplier isolation, append-only QC history, RLS mirror, agent read-only, §27 abuse matrix), `database-schema` (manufacturing_jobs/events/quality_checks/quality_issues + custom-ready trigger + append-only), workflow/state-machine design, `ui-ux-pro-max` + `frontend-design` + `web-design-guidelines` (manufacturing workspace, QC checklist, customer timeline, a11y/RTL), `vercel-react-best-practices`, `localize` + `audit:arabic`, `testing-strategies`/`node:test`. All FREE/local — **0 credits**.

## 3. Zero-credit verification

**External paid API calls: 0 · Paid credits consumed: 0 · Purchases: 0 · Subscriptions activated: 0 · Real AI generation calls: 0 · Real messages sent: 0 · Real payment transactions: 0.** No Higgsfield/OpenAI/Anthropic/Gemini/Composio, no paid MCP, no external messaging/geocoding, no billing. Everything is local code, deterministic logic, mocks, fixtures, Demo Mode. The notification layer is a Demo/Log adapter (`delivered:false`).

## 4. Manufacturing domain

`src/lib/manufacturing/` (pure): `types.ts`, `status-machine.ts`, `manufacturing.ts` (factory + transitions + milestones + QC + timeline + summary), `authorization.ts`, `notifications.ts`, `index.ts`. The job references the accepted order-group spec by `(orderId, supplierId)` + `fulfillmentId` and never duplicates or mutates the immutable snapshot (§7/§8). Full design in `docs/MANUFACTURING_WORKFLOW.md`.

## 5. State machine

`not_started → manufacturing → manufacturing_completed → quality_check → qc_passed → ready_for_delivery`, with the failure loop `quality_check → qc_failed → rework → manufacturing_completed → quality_check`. `ready_for_delivery` terminal. Illegal jumps (skip-to-QC-pass, manufacturing→ready, qc_failed→ready, ready→manufacturing) rejected. Unit-tested exhaustively.

## 6. Database / migrations

`0012_manufacturing.sql` — enums (`manufacturing_status`, `manufacturing_event_type`, `manufacturing_actor_role`, `quality_check_status`, `quality_issue_category`, `quality_issue_severity`); `manufacturing_jobs` (one per `order_group_id`, references order/order_group/fulfillment/supplier; `estimate_days`; `milestones text[]`) with an `assert_custom_and_ready` **insert trigger** (custom item + `ready_for_next_stage` fulfillment required); `manufacturing_events` (append-only); `quality_checks` (`unique(job_id, attempt)`); `quality_issues`. `0013_manufacturing_rls.sql` — customer read-own; supplier read/update/insert own-supplier only; events append-only (no update/delete → default deny); quality-issue descriptions supplier-only. Gated (no live Supabase).

## 7. Supplier manufacturing dashboard

New **Manufacturing** tab (`src/features/supplier/manufacturing-workspace.tsx`): jobs grouped **To start / In production / Quality check / Needs rework / Ready**; refined cards (order number, item, spec category, quantity, estimate, stage, last update). Premium furniture identity — not a generic ERP. Own supplier's jobs only.

## 8. Manufacturing job detail

Opening a job shows: order info, the **immutable accepted specification** (dimensions, material, colour, finish, seats, shape, legs/arms, firmness, storage, reference note, notes) with an "accepted spec — not editable here" note, accepted-quote terms, a production timeline from the event history, optional production milestones (while producing), the QC status/history, and state-gated actions. No unrelated/private customer data.

## 9. QC workflow

Submitting for QC opens a numbered attempt. The checklist has 8 structured furniture criteria; **passing requires all confirmed**. The QC panel offers **Pass** and **Issue found → fail** (with a structured issue form: category, severity, description).

## 10. QC failure / rework

Fail requires ≥1 issue; it records a `qc_failed` attempt (preserved), then **Start rework → Complete rework → Submit for QC again** opens the next attempt. History is append-only — QC #1 (failed, with issues) remains visible alongside QC #2 (passed). Unit-tested + enforced by `unique(job_id, attempt)`.

## 11. Ready-for-delivery gate

`mark_ready_for_delivery` is reachable **only** from `qc_passed`; skipping QC (from `quality_check`, `manufacturing_completed`, etc.) is rejected by the machine and unit-tested. `ready_for_delivery` is terminal — no courier/tracking/installation (Phase 12).

## 12. Customer timeline

The customer order detail weaves manufacturing into the per-supplier timeline for custom items: Manufacturing started → Manufacturing completed → Quality check → Ready for delivery (text + icon + dates, current explicit, future subdued). During `qc_failed`/`rework` it shows calm "Quality review in progress / additional finishing required" — never the failure, QC issues, or internal notes (verified: timeline JSON contains no issue text).

## 13. Multi-supplier / multi-item handling

Each custom group has an independent job; catalog groups keep their Phase 11A fulfillment timeline. A multi-supplier order shows one timeline per supplier — sofa in QC while table in production while ready-stock lamp on its fulfillment state. Never one collapsed state.

## 14. Catalog bypass

`groupNeedsManufacturing` gates on a custom item; catalog-only groups never get a job and render exactly as in Phase 11A. Regression-tested (catalog bypass unit test + full suite green).

## 15. Agent boundary

`summarize_manufacturing` (allowlisted, deterministic, read-only): customer-safe counts + next step + `agentCanManage:false`. Never starts/completes/passes/fails/readies. System prompt gained an explicit manufacturing read-only + calm-wording rule.

## 16. Notifications

`ManufacturingNotifier` + `manufacturingNotifier` (Demo/Log). On create/started/completed/qc-passed/ready it records a receipt (`delivered:false`) — no email/SMS/WhatsApp/push. Honest "recorded in Demo Mode" wording.

## 17. Security / RLS — §27 verification matrix

| # | Abuse case | Mitigation | Verified |
|---|---|---|---|
| 1 | Supplier A modifies Supplier B job | `canManageManufacturing` membership; RLS update policy | Unit test + `0013` |
| 2 | Customer modifies manufacturing | `canCustomerWriteManufacturing` false; no customer write policy | Unit test + `0013` |
| 3 | Customer A reads Customer B job | `canReadManufacturing` owner check; RLS select | Unit test + `0013` |
| 4 | Fake job / supplier id | store lookup returns null → no-op; membership check | Store review + unit test |
| 5 | Skip manufacturing states | state machine rejects illegal jumps | Unit tests |
| 6 | Pass QC before manufacturing complete | `passQualityCheck` requires `quality_check` status | Unit test |
| 7 | Ready for delivery without QC pass | only `qc_passed → ready_for_delivery`; guard tested | Unit test |
| 8 | Overwrite failed QC | append-only attempts; `unique(job_id, attempt)`; history preserved | Unit test + `0012` |
| 9 | Tamper specification / quote snapshot | job references the immutable snapshot; carries no editable spec | Unit test |
| 10 | Duplicate transition | idempotent no-op (no duplicate event) | Unit test |
| 11 | Duplicate QC submission | no second concurrent attempt opened | Unit test |
| 12 | Unauthenticated write | routes/RLS require auth; demo store is per-user local | Review |

## 18. Arabic / RTL

121 new bilingual manufacturing keys (statuses, QC criteria, issue categories/severity, actions, milestones, timeline, detail, summary). `audit:arabic` clean (1946 Arabic strings), EN/AR parity exact (**1352 leaves each**). Status/summary carried as text + icon; RTL via logical properties + `rtl:` flips.

## 19. Accessibility

QC checklist + milestones are real `<fieldset>`/`<legend>` + checkboxes; issue form uses labelled selects/radios/textarea; timeline is an ordered list with per-step text + icon (never colour-only) + "Current" chip; `role="status"` review notes; buttons carry explicit text + icons; focus-visible; icons `aria-hidden`; reduced-motion respected (no bespoke animation added beyond existing tokens).

## 20. Responsive / browser QA

Manufacturing board is a responsive grid (1 → 2 → 3 columns); job detail is two-column on desktop, single-column on mobile; the customer timeline is a mobile-first vertical stepper. No horizontal overflow (logical properties). **Browser QA:** a free/local Playwright/Chrome capability is not available in this session (the Playwright MCP is scoped to another project; claude-in-chrome has no browser) — per §34 browser QA was **not faked**; verification was via real server-rendered HTTP checks + code review + the 221-test suite.

## 21. Tests / build

`npm test` → **221 passing** (25 in `src/lib/manufacturing/manufacturing.test.ts`): custom-only + ready-gated creation, catalog bypass, valid/invalid transitions, completion, QC pass (checklist-complete required), QC fail (issue required), rework loop + second QC + history preservation, ready-for-delivery guard, milestones, snapshot reference, ownership, supplier isolation, customer read-only, agent read-only, demo notifier, and the explicit §27 abuse cases. `npm run lint` 0 warnings, `npm run typecheck` clean, `npm run build` success, `npm run audit:arabic` clean. Regression: all earlier-phase suites (cart/checkout/orders/payment/fulfillment/RFQ/catalog/design/agent/vision/visualization) still green.

## 22. Local commit hash

See the commit created at the end of this phase (local only; not pushed).

## 23. Known limitations

- **No live Supabase** → DB, RLS, and the custom+ready insert trigger are built + gated, not live-exercised; the demo `localStorage` manufacturing store (per browser, labelled) is the running mode.
- **Notifications are Demo/Log only** — recorded, never sent (§24).
- **Milestones are optional + informational** — they don't gate transitions (deliberate; no fake progress).
- **No change-order workflow** — the accepted spec is immutable here; controlled spec edits are a future phase (§8).
- **No delivery/installation/tracking** — `ready_for_delivery` is the terminal Phase 12 seam.
- **No live browser/device screenshots** (tooling unavailable) — verified via HTTP + tests + code review.

## 24. Exact local URLs

- `/[locale]/supplier` — supplier dashboard **Manufacturing** tab (job board + detail + QC/rework).
- `/[locale]/orders/[id]` — customer order detail with the custom manufacturing timeline.
- `/[locale]/account` — account order cards (fulfillment summary; unchanged).
- Verified: `/en`, `/ar`, `/en/account`, `/ar/account`, `/en/supplier`, `/ar/supplier`.

## 25. Recommended next phase — Phase 12: Delivery + Installation + Tracking

Pick up at `ready_for_delivery`: schedule delivery/installation, driver/handover, and customer-facing tracking — as a separate auditable domain layered on manufacturing. **Do not start it.**
