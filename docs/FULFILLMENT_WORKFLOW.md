# Fulfillment Workflow (Phase 11A)

Phase 10 ends at **CUSTOMER → ORDER → PAYMENT**. Phase 11A begins **after payment**
and drives supplier acceptance + the order-fulfillment foundation — stopping before
detailed manufacturing / delivery (Phase 11B).

## Three separate domains

Order status, payment status, and fulfillment status are **never collapsed into one
field** (§4). A single order can read:

```
Order status:        confirmed
Payment status:      paid
Fulfillment status:  awaiting_supplier   (per supplier group)
```

Only a **paid** order enters fulfillment (`canCreateFulfillment(paymentStatus)`).

## Per-supplier lifecycle (§6)

An order can span multiple suppliers; **each supplier group carries its own
fulfillment state** — never one state for the whole order.

```
                 ┌──────────────── decline (reason required) ──────────────┐
                 │                                                          ▼
PAID → awaiting_supplier ──accept──▶ accepted ──start preparing──▶ preparing ──mark ready──▶ ready_for_next_stage
                 │                                                          │
                 └───────────────── cancel (system) ────────────────────── ┘
```

- `ready_for_next_stage`, `declined`, `cancelled` are **terminal** for this phase —
  they never regress (§16). `ready_for_next_stage` is the seam to Phase 11B.
- Invalid jumps are rejected by the state machine: `awaiting_supplier →
  ready_for_next_stage` (skips steps), `declined → preparing`,
  `ready_for_next_stage → awaiting_supplier` (regress).

## Domain layer — `src/lib/fulfillment/`

| File | Responsibility |
|---|---|
| `types.ts` | `Fulfillment`, `FulfillmentStatus`, `FulfillmentEvent`, `SupplierAcceptance`, `SupplierDecline`, `DeclineReason`, `FulfillmentTimeline`, `FulfillmentActor`. |
| `status-machine.ts` | Allowlisted transitions; `availableSupplierActions(status)`; terminal detection. |
| `fulfillment.ts` | `canCreateFulfillment` (paid gate), `buildFulfillment` (one per group, seeds `order_paid` + `supplier_notified`), `applyTransition` (gated + idempotent + appends an event), named actions (`accept`/`decline`/`startPreparing`/`markReady`/`cancel`), `buildTimeline`, `summarizeFulfillment`. |
| `authorization.ts` | Customer reads own; supplier reads/manages own group only; customer never writes; `AGENT_CAN_MANAGE_FULFILLMENT = false`. |
| `notifications.ts` | `FulfillmentNotifier` contract + `demoNotifier` (records, **never sends** — §20/§30). |

The fulfillment record is **lean**: it references the order group by
`(orderId, supplierId)` and never duplicates the priced line snapshot, so the
purchase contract stays the single immutable source (§8/§24). Supplier fulfillment
never re-reads current catalog pricing.

## Auditable event history (§9)

Every transition appends an immutable `FulfillmentEvent`
(`id, fulfillmentId, type, actor, at, note?`). A status is never rewritten
silently. The decline **reason** (enum) is customer-safe and travels in the event
`note`; the optional **internal note** is supplier/ops-only and is never placed in an
event or the customer timeline (§12).

## Decline (§12)

Structured reasons: `unable_to_fulfill`, `inventory_issue`, `capacity_issue`,
`delivery_issue`, `other`, plus an optional internal note. The customer sees a short,
safe reason label — never the internal note.

## Customer timeline (§17/§18)

`/[locale]/orders/[id]` shows **one timeline per supplier** (no misleading unified
progress bar). Stages: Payment confirmed → Waiting for supplier → Accepted →
Preparing → Ready for next stage. Each stage is text + icon + date (never
colour-only); the current stage is explicit, future stages subdued; declined /
cancelled render an honest end-state.

## Notifications (§20/§21/§30) — ZERO external

`FulfillmentNotifier` is an adapter/contract only. The **Demo/Log** adapter records
a notification receipt (`delivered: false, channel: "demo-log"`) and never sends
email / SMS / WhatsApp / push. Copy is honest: "recorded in Demo Mode", never
"notified by WhatsApp". A real provider is wired later behind the same interface.

## Agent (§25) — READ-ONLY

`summarize_fulfillment` reports per-supplier progress + the next step. The Agent can
**never** accept, decline, mark preparing, or mark ready — `AGENT_CAN_MANAGE_FULFILLMENT`
is `false` and the system prompt states the boundary.

## Authorization + RLS (§26/§27)

`0011_fulfillment_rls.sql` mirrors the pure rules: the owning **customer** reads
their order's fulfillment (never writes — §28); a **supplier member** reads/updates
**only** their own supplier's fulfillments (A can never touch B); events are readable
to whoever may read the parent and appended only by the owning supplier; the
`0010` insert trigger requires a **paid** order. Public: no access.

## Demo Mode (§29)

Without Supabase, per-supplier fulfillments live in `localStorage`
(`athathi.fulfillments.v1`), mirroring the DB shape and enforcing the same
invariants. Judge scenario: a paid order → supplier opens the dashboard (the
fulfillment is created `awaiting_supplier`) → **Accept** → **Start preparing** →
**Mark ready** → the customer opens the order and sees the timeline updated — with
**no external API and no credits**.

## Persistence

- **Demo (running):** `athathi.fulfillments.v1` in `localStorage`, per browser, labelled.
- **Supabase (gated):** `fulfillments` (one per `order_group_id`, paid-gated by
  trigger) + `fulfillment_events` (append-only, `unique(fulfillment_id, type)`) with
  RLS in `0011`.
