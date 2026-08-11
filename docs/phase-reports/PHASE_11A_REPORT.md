# Phase 11A — Order Fulfillment + Supplier Acceptance — Report

_Status: ✅ Complete & verified. A PAID order now hands off to its suppliers through a per-supplier fulfillment lifecycle — **awaiting_supplier → accepted → preparing → ready_for_next_stage** (or **declined**) — kept strictly SEPARATE from order status and payment status. Each supplier group carries its OWN state (multi-supplier safe). A deterministic status machine, an auditable event history, owner/supplier authorization mirrored in RLS, a supplier acceptance/decline/prepare/ready dashboard, a per-supplier customer timeline, read-only Agent access, and a notification abstraction that RECORDS but never SENDS. Runs fully in Demo Mode; Supabase migrations + RLS are gated. **External paid credits consumed: 0.** All gates green (196 tests). Phase 11B not started._

## 1. Zero-credit confirmation

**External paid API calls: 0 · Paid credits consumed: 0 · Purchases: 0 · Subscriptions: 0 · Real messages sent: 0 · Real payment transactions: 0.** No Higgsfield, no OpenAI/Anthropic/Gemini, no paid MCP/Composio, no external messaging/geocoding, no billing. Everything is local code, deterministic logic, mocks, fixtures, Demo Mode, and free/local skills. The notification layer is a Demo/Log adapter (`delivered:false`) — it never contacts an external service.

## 2. Skills actually used

See `PHASE_11A_SKILLS.md`. Headline: `security-review` (paid-gate, per-group isolation, RLS mirror, agent read-only, §28 abuse matrix), `database-schema` (fulfillments/fulfillment_events + paid trigger + append-only events), `ui-ux-pro-max` + `frontend-design` + `web-design-guidelines` (supplier lifecycle controls, calm per-supplier customer timeline, a11y/RTL), `vercel-react-best-practices` (one pure domain across store/route/test), `localize` + `audit:arabic`, `testing-strategies` (`node:test`). All free/local — **0 credits**.

## 3. Fulfillment domain

`src/lib/fulfillment/` (pure, mostly client-safe):
- **`types.ts`** — `FulfillmentStatus` (awaiting_supplier/accepted/preparing/ready_for_next_stage/declined/cancelled), `Fulfillment` (lean — references the order group by id, no priced-line duplication, §8), `FulfillmentEvent`, `SupplierAcceptance`, `SupplierDecline`, `DeclineReason`, `FulfillmentActor`, `FulfillmentTimeline`.
- **`status-machine.ts`** — allowlisted transitions; `ready_for_next_stage`/`declined`/`cancelled` terminal; `availableSupplierActions(status)` drives the buttons.
- **`fulfillment.ts`** — `canCreateFulfillment` (paid gate), `buildFulfillment` (one per group; seeds `order_paid` + `supplier_notified`), `applyTransition` (gated + idempotent + appends an event), named actions, `buildTimeline`, `summarizeFulfillment`.
- **`authorization.ts`** — customer reads own; supplier reads/manages own group only; customer never writes; `AGENT_CAN_MANAGE_FULFILLMENT = false`.
- **`notifications.ts`** — `FulfillmentNotifier` contract + `demoNotifier` (records, never sends).

Full design in `docs/FULFILLMENT_WORKFLOW.md`.

## 4. Payment → fulfillment boundary (§4)

Order status (`confirmed`), payment status (`paid`), and fulfillment status
(`awaiting_supplier`…) are three separate fields. `canCreateFulfillment` only returns
true for `paid`; the demo store and the `0010` insert trigger both enforce it.

## 5. DB migrations

`0010_fulfillment.sql` — `fulfillment_status` / `fulfillment_decline_reason` /
`fulfillment_event_type` / `fulfillment_actor_role` enums; `fulfillments` (one per
`order_group_id`, references the immutable snapshot; `accepted_at`/`declined_at`/
`decline_reason`/`decline_internal_note`; `is_demo`) with a `assert_order_paid`
insert trigger (defence in depth); `fulfillment_events` (append-only,
`unique(fulfillment_id, type)` for event dedupe/idempotency). `0011_fulfillment_rls.sql`
— customer read-own, supplier read/update/insert own-supplier-only (via
`supplier_members`), events readable to customer-or-supplier and appended by the
supplier only; no update/delete on events (default deny). Gated — no live Supabase.

## 6. Supplier acceptance (§11/§13)

The supplier dashboard **Orders** tab shows NEW PAID orders (own products, quantities,
options/colour, custom spec, group total, **Paid**, date, fulfillment status). For
`awaiting_supplier` the supplier sees explicit **Accept order** / **Decline** actions —
never auto-accept. Accept opens an inline confirmation, then transitions
`awaiting_supplier → accepted`, records `SupplierAcceptance` + an event, and records a
Demo-Mode customer notification.

## 7. Decline flow (§12)

Decline opens an accessible form: a `<fieldset>` of structured reasons
(`unable_to_fulfill`/`inventory_issue`/`capacity_issue`/`delivery_issue`/`other`) + an
optional **internal note**. The customer sees only the safe reason label; the internal
note is never placed in an event or the customer timeline (unit-tested).

## 8. Preparing flow (§14)

From `accepted`, **Start preparing** → `preparing`. Generic (pick/prepare/pack/
coordinate) — no faked manufacturing progress; custom-furniture manufacturing detail is
deferred to Phase 11B.

## 9. Ready flow (§15)

From `preparing`, **Mark ready** → `ready_for_next_stage` (terminal here). Labelled
"Ready for next stage" — never "Out for delivery"; no shipping is started. For custom
orders the ready note says the manufacturing workflow can begin (a later stage).

## 10. Multi-supplier handling (§6)

Each supplier group has an independent fulfillment (unit-tested: A `accepted` while B
`awaiting_supplier`). The customer timeline renders one timeline per supplier; the
account card shows a deterministic summary ("2 of 3 suppliers accepted") — never a
single misleading unified bar.

## 11. Customer timeline (§17/§18)

`/[locale]/orders/[id]` gains an **Order progress** card: per-supplier vertical
timelines (Payment confirmed → Waiting for supplier → Accepted → Preparing → Ready),
each stage text + icon + date (not colour-only), current stage explicit with a
"Current" chip, future stages subdued, declined/cancelled shown honestly.

## 12. Supplier UI

Rebuilt the supplier order row around fulfillment: payment (Paid/Awaiting) + fulfillment
status chips, own-portion item list with quantities/options/custom spec, delivery
wilayat/governorate, and state-driven lifecycle controls. Unpaid orders show
"Awaiting payment" with no fulfillment actions. Another supplier's products/totals are
never shown.

## 13. Notification abstraction (§20/§21/§30)

`FulfillmentNotifier` interface + `demoNotifier` (Demo/Log). On create/accept/decline/
preparing/ready it records a receipt (`delivered:false, channel:"demo-log"`) — no
email/SMS/WhatsApp/push. Honest wording: "recorded in Demo Mode".

## 14. Agent boundary (§25)

`summarize_fulfillment` (allowlisted, deterministic, read-only): reports per-supplier
counts + the next step + `agentCanManage:false`. It never accepts/declines/prepares/
marks ready. The system prompt gained an explicit fulfillment read-only rule.

## 15. Security / RLS — §28 verification matrix

| # | Abuse case | Mitigation | Verified |
|---|---|---|---|
| 1 | Supplier A accepts/declines Supplier B's order | `canManageFulfillment` membership check; RLS update policy | Unit test + `0011` |
| 2 | Supplier A sees Supplier B products | order redaction (10A) + own-group-only render | Review + 10A tests |
| 3 | Customer A reads Customer B fulfillment | `canReadFulfillment` owner check; RLS select | Unit test + `0011` |
| 4 | Fake fulfillment / order-group id | store lookup returns null → no-op | Store review |
| 5 | Client changes supplier id | RLS `with check` pins supplier_id; membership check | `0011` + unit test |
| 6 | Client skips a status step | state machine rejects `awaiting → ready` etc. | Unit tests |
| 7 | Declined order starts preparing | `declined` terminal → rejected | Unit test |
| 8 | Unpaid order fulfillment attempt | `canCreateFulfillment` false + `assert_order_paid` trigger | Unit test + `0010` |
| 9 | Duplicate accept | idempotent no-op (no duplicate event) | Unit test |
| 10 | Duplicate event | `unique(fulfillment_id, type)` + idempotency | Unit test + `0010` |
| 11 | Supplier modifies payment state | fulfillment domain has no payment mutator; separate RLS | Review |
| 12 | Customer modifies fulfillment state | `canCustomerWriteFulfillment` false; no customer write policy | Unit test + `0011` |

## 16. Arabic / RTL

71 new bilingual fulfillment keys (statuses, reasons, supplier actions, decline form,
timeline stages, summaries, demo note). `audit:arabic` clean (1825 Arabic strings),
EN/AR parity exact (**1231 leaves each**). Status/summary carried as text + icon;
numbers use locale formatting; RTL via logical properties + `rtl:` glyph flips.

## 17. Accessibility

Timeline is an ordered list with per-step text + icon (never colour-only) + "Current"
chip; the decline form uses a real `<fieldset>`/`<legend>` + radio `<input>`s and a
labelled textarea with `aria-describedby`; the accept confirmation is a labelled
`role="group"`; status regions use `role="status"`; buttons carry explicit text +
icons; focus-visible throughout; icons `aria-hidden`.

## 18. Responsive

Supplier controls wrap and stack from 390px up (desktop-priority but mobile-usable);
the customer timeline is a single-column vertical stepper that reads well on mobile and
sits inline on desktop. No horizontal overflow (logical properties). Verified by
responsive code review (device tooling unavailable this session).

## 19. Tests / build

`npm test` → **196 passing** (28 in `src/lib/fulfillment/fulfillment.test.ts`):
paid-only creation, unpaid rejection, per-supplier independence, valid/invalid
transitions, terminal states, duplicate-action idempotency, accept + acceptance record,
decline (reason required; internal note never exposed), preparing, ready, timeline
(current/upcoming/declined/cancelled), summary + allReady, ownership, supplier
isolation, spoofed-supplier rejection, event history, custom + catalog snapshot
reference, agent read-only boundary, demo notifier (records, never delivers), and the
explicit §28 cross-tenant abuse cases. `npm run lint` 0 warnings, `npm run typecheck`
clean, `npm run build` success, `npm run audit:arabic` clean.

## 20. Local commit hash

See the commit created at the end of this phase (local only; not pushed).

## 21. Known limitations

- **No live Supabase / gateway** → DB, RLS, and the paid-order trigger are built + gated,
  not live-exercised; the demo `localStorage` fulfillment store (per browser, labelled)
  is the running mode.
- **Notifications are Demo/Log only** — recorded, never sent (by design; §30). A real
  provider is a later, credentialled step.
- **No manufacturing / delivery detail** — `ready_for_next_stage` is the terminal seam to
  Phase 11B; preparation is intentionally generic.
- **No live browser/device screenshots** (tooling unavailable) — verified via HTTP +
  tests + code review.

## 22. Exact local URLs

- `/[locale]/supplier` — supplier dashboard **Orders** tab (accept/decline/prepare/ready).
- `/[locale]/orders/[id]` — customer order detail with the per-supplier fulfillment timeline.
- `/[locale]/account` — account order cards with the deterministic fulfillment summary.
- Verified: `/en`, `/ar`, `/en/account`, `/ar/account`, `/en/supplier`, `/ar/supplier`.

## 23. Recommended Phase 11B — Custom Manufacturing + Quality Check

Pick up at `ready_for_next_stage`: drive custom-furniture manufacturing milestones and a
quality-check gate before delivery handoff, keeping manufacturing a separate auditable
domain layered on fulfillment. **Do not start it.**
