# Delivery + Installation + Tracking Workflow (Phase 12)

Phase 11B ends a custom item at `ready_for_delivery`; Phase 11A ends a ready-stock
catalog group at `ready_for_next_stage`. Phase 12 completes the operational journey
to **`completed`** — scheduling, assignment, out-for-delivery, delivery, optional
installation, handover — with a customer tracking experience. **No real courier,
no GPS, no paid API** (§16/§28).

## A fifth separate domain (§4)

Order status · payment status · fulfillment status · manufacturing status ·
**delivery status** are five distinct fields — never collapsed.

## Eligibility (§5)

A supplier group enters delivery only when it is genuinely ready:

```
canCreateDelivery(isCustom, fulfillmentStatus, manufacturingStatus):
  custom  → manufacturingStatus === "ready_for_delivery"
  catalog → fulfillmentStatus   === "ready_for_next_stage"
```

Ready-stock catalog is **never** forced through manufacturing. The `assert_delivery_eligible`
insert trigger enforces the same in the DB.

## Delivery state machine (§7)

```
awaiting_schedule → scheduled → assigned → out_for_delivery → delivered → completed
                        ▲                        │
                        │                        ▼
   reschedule_required ◀── delivery_failed ◀─────┘
   (→ scheduled)
most states → cancelled
```

- `completed` / `cancelled` terminal. `delivered → completed` is additionally gated
  by the **completion rule** (§25): any REQUIRED installation must be `completed`.
- Rejected jumps: `awaiting_schedule → delivered`, `scheduled → completed`,
  `delivery_failed → delivered`, `cancelled → out_for_delivery`.
- `availableDeliveryActions(status, installationStatus)` is the single source of
  truth for the dashboard buttons; the store re-checks the machine.

## Installation state machine (§21)

```
not_required            (quote had no install fee)
awaiting_schedule → scheduled → in_progress → completed
                                    │
                                    ▼
                                  issue → (in_progress | scheduled)
```

Installation is **required iff the accepted quote charged an installation fee**
(`installationRequiredFor(group) = group.installationFee > 0`, §20) — never
auto-claimed. On `markDelivered`, a required installation opens at `awaiting_schedule`.

## Domain layer — `src/lib/delivery/`

| File | Responsibility |
|---|---|
| `types.ts` | `Delivery`, `DeliveryStatus`, `DeliveryEvent`, `DeliveryWindow`, `DeliveryAddressSnapshot`, `DeliveryAssignment`, `Installation`, `InstallationStatus`, `HandoverConfirmation`, tracking types. |
| `status-machine.ts` | Delivery + installation transitions; `availableDeliveryActions`; terminal checks. |
| `slots.ts` | Deterministic demo windows (`SLOT_PERIODS`/`SLOT_HOURS`), `isValidSlot` (rejects past/malformed/impossible), `upcomingDays`. |
| `delivery.ts` | Eligibility, `buildDelivery` (+ immutable `snapshotAddress`), the transition helpers, installation helpers, the completion rule (`canComplete`/`confirmHandover`), `buildTracking`, `summarizeDeliveries`. |
| `authorization.ts` | Customer reads own + sets only the slot; supplier reads/manages own supplier only; customer never writes status; `AGENT_CAN_MANAGE_DELIVERY = false`. |
| `notifications.ts` | `DeliveryNotifier` + `deliveryNotifier` (records, never sends) + `demoAssignment` (labelled Demo team, §15). |

## Address snapshot (§10)

`buildDelivery` freezes the order's delivery address into an immutable
`DeliveryAddressSnapshot` (governorate, wilayat, area, building, notes, phone). The
delivery never follows later account-address edits — verified by a test that mutates
the order address afterwards and asserts the snapshot is unchanged. Address changes
would need a future explicit change workflow.

## Scheduling (§11/§12)

The customer picks a demo window (`morning` 9–12, `afternoon` 12–16, `evening` 16–20)
from the next 7 days. `isValidSlot` rejects past dates, bad formats (`2026-13-01`),
calendar overflow (`2026-02-31`), and unknown periods. No live courier availability is
invented; the picker is clearly Demo-labelled. The supplier can also schedule on the
customer's behalf (§30); both go through the same validated `scheduleDelivery`.

## Assignment (§15/§16)

`demoAssignment` returns a clearly-labelled **Demo Delivery Team** (`isDemo: true`) —
never a fabricated real driver, never a courier API (Aramex/DHL/Asyad/Oman Post/…). A
real `DeliveryProvider` implements the same shape later.

## Failure + reschedule + history (§19)

`markDeliveryFailed(reason)` requires a practical reason
(`customer_unavailable`/`incorrect_address`/`access_issue`/`vehicle_issue`/
`item_issue`/`other`) and records a failed attempt. `reschedule_required → scheduled`
re-opens scheduling. Every attempt (failed + delivered) is **preserved** in
`attempts[]` — a failed attempt is never deleted or overwritten.

## Completion rule (§25)

`canComplete = delivered && (installation not required OR installation completed)`.
`confirmHandover` records a customer-safe handover (no signature, no biometrics — §24)
and transitions to `completed`. Completing early is rejected (`not-delivered` /
`installation-required`).

## Customer tracking (§26/§27) — customer-safe

`/[locale]/orders/[id]` gains a **Delivery & tracking** section: ONE tracker per
supplier (never one status for the whole order). Customer-friendly stages — Preparing
your delivery → Delivery scheduled → On the way → Delivered → (Installation) →
Completed — text + icon + dates, current explicit, future subdued. A slot picker
appears when the item is ready to schedule. A failed attempt reads calmly ("We
couldn't complete this delivery. A new time is being arranged.") — never a raw failure
code (verified: tracking JSON contains no reason code). **No fake GPS / map / "driver
2.3 km away"** (§28) — status + timeline only.

## Multi-supplier (§9)

Each supplier group delivers independently (sofa delivered, lamp out for delivery,
table scheduled tomorrow). The account card shows a deterministic summary ("2 of 3
deliveries completed"); the tracker renders one timeline per supplier.

## Agent (§31) — READ-ONLY

`summarize_delivery` reports per-supplier progress + the customer-safe next step (e.g.
"scheduled for delivery tomorrow afternoon"). The Agent can **never** schedule, change
the address, assign a driver, mark out-for-delivery/delivered, complete installation,
or confirm handover — `AGENT_CAN_MANAGE_DELIVERY` is `false`; the system prompt states
the boundary and forbids claiming a live driver location.

## Notifications (§32) — ZERO external

`DeliveryNotifier` + `deliveryNotifier` (Demo/Log). On ready / scheduled /
out-for-delivery / delivered / installation scheduled+completed / completed it records
a receipt (`delivered:false`) — no SMS/WhatsApp/email/push, no courier API.

## Authorization + RLS (§33/§34)

`0015_delivery_rls.sql` mirrors the pure rules: the owning **customer** reads their own
delivery and may update only the slot columns (never operational status — §33); a
**supplier member** reads/updates/inserts **only** their own supplier's deliveries (A
can never read/mutate B's, including the customer phone/address snapshot — §35);
`delivery_events` + `delivery_attempts` are append-only (no update/delete → default
deny); installation issue descriptions are supplier-only. The `0014` insert trigger
enforces eligibility.

## Demo Mode (§36)

Without Supabase, deliveries live in `localStorage` (`athathi.deliveries.v1`), mirroring
the DB shape and enforcing the same invariants. Judge scenario: custom item reaches
`ready_for_delivery` → customer picks a slot → supplier assigns Demo Delivery Team →
out for delivery → delivered → (if installation required: schedule → start → complete)
→ handover → completed → the customer sees the timeline update. Also: out_for_delivery
→ failed → reschedule → delivered. No external API, no credits.

## Persistence

- **Demo (running):** `athathi.deliveries.v1` in `localStorage`, per browser, labelled.
- **Supabase (gated):** `deliveries` (one per `order_group_id`, eligibility trigger,
  jsonb address snapshot) + `delivery_events` + `delivery_attempts` (append-only) +
  `installations` + `installation_events` with RLS in `0015`.
