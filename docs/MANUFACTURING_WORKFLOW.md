# Manufacturing + Quality Check Workflow (Phase 11B)

Phase 11A ends a supplier group at `ready_for_next_stage`. Phase 11B is the
**custom-furniture** continuation: from a ready fulfillment through production and a
real quality-check loop to **`ready_for_delivery`** — where it stops (delivery /
installation / tracking is Phase 12).

## Custom-only, ready-gated (§4/§22)

A manufacturing job exists **only** for a supplier group that (a) contains a CUSTOM
(RFQ) item and (b) whose Phase 11A fulfillment reached `ready_for_next_stage`.
Ready-stock catalog groups **never** enter manufacturing — they keep their Phase 11A
fulfillment timeline unchanged.

```
groupNeedsManufacturing(group) = group.items.some(kind === "custom")
canCreateManufacturing(fulfillmentStatus, isCustom) = isCustom && fulfillmentStatus === "ready_for_next_stage"
```

Four separate domains now stack: order status · payment status · fulfillment status
· **manufacturing status** — never collapsed into one field.

## State machine (§6)

```
not_started ──▶ manufacturing ──▶ manufacturing_completed ──▶ quality_check ──▶ qc_passed ──▶ ready_for_delivery
                                          ▲                        │
                                          │                        ▼
                                      rework ◀── qc_failed ◀───────┘
```

- Terminal: `ready_for_delivery` (Phase 12 seam) — never regresses.
- Rejected jumps: `not_started → qc_passed`, `manufacturing → ready_for_delivery`,
  `qc_failed → ready_for_delivery`, `ready_for_delivery → manufacturing`.
- `availableActions(status)` drives the dashboard buttons; the store re-checks the
  machine (a hidden button is never the only guard).

## Domain layer — `src/lib/manufacturing/`

| File | Responsibility |
|---|---|
| `types.ts` | `ManufacturingJob`, `ManufacturingStatus`, `ManufacturingEvent`, `QualityCheck`, `QualityCheckStatus`, `QualityIssue`, `QualityIssueCategory/Severity`, `QualityCriterion`, `ManufacturingMilestone`, timeline types. |
| `status-machine.ts` | Allowlisted transitions; `availableActions`; `canEditMilestones`; terminal detection. |
| `manufacturing.ts` | `groupNeedsManufacturing`, `canCreateManufacturing`, `buildManufacturingJob`, transition helpers, `toggleMilestone`, the QC workflow (`submitForQualityCheck`/`passQualityCheck`/`failQualityCheck`), `buildCustomerTimeline`, `summarizeManufacturing`. |
| `authorization.ts` | Customer reads own (safe view); supplier reads/manages own supplier only; customer never writes; `AGENT_CAN_MANAGE_MANUFACTURING = false`. |
| `notifications.ts` | `ManufacturingNotifier` contract + `manufacturingNotifier` (records, **never sends** — §24). |

The job is **lean**: it references the accepted order-group spec by
`(orderId, supplierId)` + `fulfillmentId` and never duplicates or mutates the
immutable snapshot (§7/§8). The manufacturing contract IS the accepted spec — later
edits would need a future explicit change-order (not implemented).

## Production milestones (§12)

Optional, supplier-entered milestones — `materials_prepared`, `frame`, `assembly`,
`upholstery_finish`, `final_finishing` — toggled only while producing. Progress reads
"3 of 5 milestones" — a **genuine, milestone-based** signal, never a fabricated
percentage or fake sensor/live-factory data.

## Quality check (§14–§18)

A real, manual (supplier) QC — never "AI inspected the furniture". Submitting for QC
opens a numbered attempt (QC #1, QC #2, …). To **pass**, the inspector must confirm
**all** structured criteria (dimensions, material, colour, finish, construction,
no-damage, components, customization). To **fail**, at least one structured
**issue** (category + severity `minor`/`major` + description) is recorded.

QC history is **append-only** — a failed attempt is preserved forever; a rework +
resubmit opens the next attempt. Example:

```
QC #1 — Failed · finish (major): wrong sheen
Rework → Complete rework → Submit again
QC #2 — Passed
```

The `unique(job_id, attempt)` DB constraint + append-only events guarantee no
inspection is overwritten (§17/§18).

## Customer timeline (§20) — customer-safe

The customer order detail extends the per-supplier fulfillment timeline for custom
items with: Manufacturing started → Manufacturing completed → Quality check → Ready
for delivery. During `qc_failed`/`rework` it shows **calm** wording — "Quality review
in progress" / "additional finishing required" — and **never** the failure, the QC
issues, or internal notes. `buildCustomerTimeline` derives this; it is verified to
contain no issue text.

## Multi-supplier / multi-item (§21)

Each custom group has its own independent job (supplier A's custom sofa can be in
Quality Check while supplier B's custom table is in Manufacturing and supplier C's
ready-stock lamp stays on its Phase 11A fulfillment state). Never one collapsed
manufacturing state for the whole order.

## Agent (§23) — READ-ONLY

`summarize_manufacturing` reports customer-safe progress + the next step (e.g. "your
custom sofa has completed manufacturing and is undergoing quality review"). The Agent
can **never** start/complete manufacturing, pass/fail QC, invent a QC result, or mark
ready for delivery — `AGENT_CAN_MANAGE_MANUFACTURING` is `false` and the system
prompt states the boundary.

## Notifications (§24) — ZERO external

`ManufacturingNotifier` + `manufacturingNotifier` (Demo/Log). On create / manufacturing
started / completed / qc passed / ready-for-delivery it records a receipt
(`delivered:false, channel:"demo-log"`) — no email / SMS / WhatsApp / push. A real
provider drops in behind the same interface later.

## Authorization + RLS (§25/§26)

`0013_manufacturing_rls.sql` mirrors the pure rules: the owning **customer** reads a
safe view (never writes — §25); a **supplier member** reads/updates/inserts **only**
their own supplier's jobs (A can never touch B); events + QC attempts are append-only
(no update/delete on events → default deny, no silent rewrite); **quality-issue
descriptions are supplier-only** (the app never selects them for a customer). The
`0012` insert trigger requires a custom + `ready_for_next_stage` fulfillment.

## Demo Mode (§28)

Without Supabase, jobs live in `localStorage` (`athathi.manufacturing.v1`), mirroring
the DB shape and enforcing the same invariants. Judge scenario: a paid custom order →
supplier accepts + readies it (11A) → the job appears → **Start manufacturing** →
**Manufacturing complete** → **Submit for QC** → **Pass** → **Mark ready for
delivery** → the customer sees the timeline update. Also: **fail QC → rework → QC
again → pass**. No external API, no credits.

## Persistence

- **Demo (running):** `athathi.manufacturing.v1` in `localStorage`, per browser, labelled.
- **Supabase (gated):** `manufacturing_jobs` (one per `order_group_id`, custom+ready
  trigger) + `manufacturing_events` (append-only) + `quality_checks`
  (`unique(job_id, attempt)`) + `quality_issues` with RLS in `0013`.
