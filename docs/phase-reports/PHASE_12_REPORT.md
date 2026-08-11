# Phase 12 — Delivery + Installation + Tracking — Report

_Status: ✅ Complete & verified. The operational journey now finishes: a ready supplier group (custom `ready_for_delivery` or catalog `ready_for_next_stage`) flows through scheduling → assignment → out-for-delivery → delivered → optional installation → handover → **`completed`** — a FIFTH SEPARATE domain (order · payment · fulfillment · manufacturing · delivery). Each group delivers independently. A deterministic delivery + installation state machine, append-only event + attempt history (failed attempts preserved), an immutable delivery-address snapshot, owner/supplier authorization mirrored in RLS, a premium supplier delivery workspace, a strong customer tracking + slot-picker experience with customer-friendly language and NO fake GPS, read-only Agent access, and a notification abstraction that RECORDS but never SENDS. Runs fully in Demo Mode; Supabase migrations + RLS are gated. All earlier phases preserved (245 tests, all gates green). **External paid API calls: 0. Paid credits consumed: 0.** Phase 13 not started._

## 1. Phase 12 status

Complete and stable. Built only on the current repo state; no previous phase rebuilt; no real GPS/courier; ends at `completed`.

## 2. Skills actually used

See `PHASE_12_SKILLS.md`. Headline: `security-review` (eligibility gate, per-supplier isolation incl. customer phone/address protection, append-only history, address-snapshot immutability, RLS mirror, agent read-only, §35 abuse matrix), `database-schema` (deliveries/events/attempts/installations + eligibility trigger + append-only), state-machine/workflow design, `ui-ux-pro-max` + `frontend-design` + `web-design-guidelines` (delivery workspace, customer tracking, slot picker, a11y/RTL), `vercel-react-best-practices`, `localize` + `audit:arabic`, `testing-strategies`/`node:test`. All FREE/local — **0 credits**.

## 3. Zero-credit verification

**External paid API calls: 0 · Paid credits consumed: 0 · Purchases: 0 · Subscriptions activated: 0 · Real courier bookings: 0 · Real SMS/WhatsApp/email sent: 0 · Real GPS tracking calls: 0 · Real AI generation calls: 0.** No Higgsfield/OpenAI/Anthropic/Gemini/Composio, no maps/geocoding, no courier/logistics API, no billing. Everything is local code, deterministic logic, mocks, fixtures, Demo Mode. Notifications are a Demo/Log adapter (`delivered:false`); assignment is a labelled Demo Delivery Team.

## 4. Delivery domain

`src/lib/delivery/` (pure): `types.ts`, `status-machine.ts`, `slots.ts`, `delivery.ts` (eligibility + factory + transitions + installation + completion rule + tracking + summary), `authorization.ts`, `notifications.ts`, `index.ts`. The delivery references the order group by `(orderId, supplierId)` and carries an immutable address snapshot; it never duplicates the priced line snapshot. Full design in `docs/DELIVERY_INSTALLATION_WORKFLOW.md`.

## 5. Delivery state machine

`awaiting_schedule → scheduled → assigned → out_for_delivery → delivered → completed`, with the failure loop `out_for_delivery → delivery_failed → reschedule_required → scheduled`. `completed`/`cancelled` terminal; `delivered → completed` additionally gated by the completion rule. Illegal jumps rejected. Unit-tested.

## 6. Installation domain

`not_required / awaiting_schedule / scheduled / in_progress / completed / issue`. Required **only when the accepted quote charged an installation fee** (§20) — never auto-claimed. A lightweight model, not a field-service ERP.

## 7. Database / migrations

`0014_delivery.sql` — enums (delivery_status, installation_status, delivery_slot_period, delivery_event_type, delivery_actor_role, delivery_failure_reason, installation_issue_category); `deliveries` (one per `order_group_id`, references order/order_group/fulfillment/(manufacturing_job)/supplier; jsonb address snapshot; slot; demo assignee) with an `assert_delivery_eligible` **insert trigger** (custom → manufacturing ready_for_delivery; catalog → fulfillment ready_for_next_stage); `delivery_events` + `delivery_attempts` (append-only); `installations`; `installation_events` (supplier-only descriptions). `0015_delivery_rls.sql` — customer read-own + slot-only update; supplier read/update/insert own-supplier only; append-only events/attempts; installation issue text supplier-only. Gated (no live Supabase).

## 8. Delivery scheduling

Demo windows (morning 9–12 / afternoon 12–16 / evening 16–20) over the next 7 days via a shared, accessible `SlotPicker`. `isValidSlot` rejects past dates, malformed dates, calendar overflow, and unknown periods. Clearly Demo-labelled; no invented live availability, no external calendar.

## 9. Multi-supplier behavior

Each supplier group has an independent delivery (sofa delivered while lamp out-for-delivery while table scheduled). The customer tracker renders one timeline per supplier; the account card shows a deterministic "N of M deliveries completed". Never one collapsed status.

## 10. Supplier delivery dashboard

New **Delivery** tab (`src/features/supplier/delivery-workspace.tsx`): deliveries grouped **Awaiting scheduling / Scheduled / Out for delivery / Delivered / Needs attention / Completed**; cards (order number, area, slot, installation-included, status, last update). Detail view: address snapshot (operational, with a "captured at order time" note), items, timeline + attempts, and state-gated actions. Premium furniture identity — no map, no ERP. Own supplier's deliveries only.

## 11. Delivery failure / reschedule

**Report failed delivery** opens a reason form (6 practical reasons; the customer sees a calm status, not the reason). `delivery_failed → reschedule → scheduled` re-opens scheduling; all attempts are preserved in history (unit-tested).

## 12. Installation workflow

When required, after **Delivered**: Schedule installation (slot picker) → Start installation → Complete installation, with an optional **Record installation issue** (category + internal description) while in progress. Customer sees only a safe installation status.

## 13. Handover / completion

**Confirm handover & complete** is available only once the completion rule holds (delivered + any required installation completed). It records a customer-safe handover (no signature/biometrics) and moves the group to `completed`. Completing early is rejected + unit-tested.

## 14. Customer tracking UI

`/[locale]/orders/[id]` gains a **Delivery & tracking** section: one tracker per supplier with customer-friendly stages (Preparing your delivery → Delivery scheduled → On the way → Delivered → Installation → Completed), a slot picker when ready to schedule, calm rework/failure wording, and the chosen window. Text + icon + dates (never colour-only). **No fake GPS/map/distance** (§28).

## 15. Account summary

Account order cards show a deterministic delivery summary ("2 of 3 deliveries completed" / "Out for delivery" / "A delivery needs attention"), preferred over the fulfillment summary once any group reaches delivery.

## 16. Agent boundary

`summarize_delivery` (allowlisted, deterministic, read-only): customer-safe counts + next step + `agentCanManage:false`. Never schedules/assigns/marks/completes/hands-over. System prompt gained an explicit delivery read-only + no-live-location rule.

## 17. Notification abstraction

`DeliveryNotifier` + `deliveryNotifier` (Demo/Log). Records ready/scheduled/out-for-delivery/delivered/installation/completed as `delivered:false` receipts — no SMS/WhatsApp/email/push, no courier API.

## 18. Security / RLS — §35 verification matrix

| # | Abuse case | Mitigation | Verified |
|---|---|---|---|
| 1 | Supplier A modifies Supplier B delivery | `canManageDelivery` membership; RLS update policy | Unit test + `0015` |
| 2 | Customer modifies delivery status | `canCustomerWriteDeliveryStatus` false; customer update is slot-only | Unit test + `0015` |
| 3 | Customer A reads Customer B delivery | `canReadDelivery` owner check; RLS select | Unit test + `0015` |
| 4 | Fake delivery / supplier id | store lookup returns null → no-op; membership check | Store review + unit test |
| 5 | Skip delivery states | machine rejects illegal jumps | Unit tests |
| 6 | Mark delivered before out_for_delivery | only `out_for_delivery → delivered` | Unit test |
| 7 | Mark completed before delivery / required installation | completion rule (`canComplete`) | Unit tests |
| 8 | Duplicate delivered event | idempotent transition; delivered is terminal-ish (only → completed) | Machine + review |
| 9 | Overwrite failed attempt | attempts append-only; history preserved | Unit test + `0014` |
| 10 | Tamper address snapshot | immutable snapshot at creation; frozen from later edits | Unit test |
| 11 | Tamper delivery slot | `isValidSlot` + customer-owns-only slot update (RLS) | Unit tests + `0015` |
| 12 | Unauthenticated write | routes/RLS require auth; demo store is per-user local | Review |
| 13 | Supplier reads another supplier's customer phone/address | address snapshot lives on the delivery row; supplier-read RLS is own-supplier only | Unit test + `0015` |

## 19. Arabic / RTL

126 new bilingual delivery/installation keys (statuses, slots, actions, failure reasons, installation, handover, tracking stages, customer-friendly language, summaries). `audit:arabic` clean (2071 Arabic strings), EN/AR parity exact (**1479 leaves each**). Status/summary carried as text + icon; RTL via logical properties + `rtl:` flips; hours use `dir="ltr"`.

## 20. Accessibility

The slot picker is real `<fieldset>`/`<legend>` + radios; failure + installation-issue forms use labelled radios/select/textarea; the tracker is an ordered list with per-step text + icon (never colour-only) + "Now" chip; `role="status"` reschedule notes; buttons carry explicit text + icons; focus-visible; icons `aria-hidden`; reduced-motion respected (no bespoke animation beyond existing tokens).

## 21. Responsive / browser QA

Delivery board is a responsive grid (1 → 2 → 3 columns); the detail view is two-column on desktop, single-column on mobile; the customer tracker + slot picker are mobile-first. No horizontal overflow (logical properties). **Browser QA:** a free/local Playwright/Chrome capability is not available this session (Playwright MCP scoped elsewhere; claude-in-chrome has no browser) — per §42 browser QA was **not faked**; verification was real server-rendered HTTP + code review + the 245-test suite.

## 22. Tests / build

`npm test` → **245 passing** (24 in `src/lib/delivery/delivery.test.ts`): eligibility (custom + catalog), installation-required detection, address-snapshot immutability, slot validation, scheduling, the full happy path, the completion rule (delivered + installation), failure + reason + reschedule + attempt history, multi-supplier independence, tracking (installation-conditional + calm rescheduling), summary, ownership, supplier isolation, customer read-only, agent read-only, demo notifier + demo assignment, and the explicit §35 abuse cases. `npm run lint` 0 warnings, `npm run typecheck` clean, `npm run build` success, `npm run audit:arabic` clean. Regression: all earlier-phase suites still green.

## 23. Local commit hash

See the commit created at the end of this phase (local only; not pushed).

## 24. Known limitations

- **No live Supabase / courier** → DB, RLS, and the eligibility trigger are built + gated, not live-exercised; the demo `localStorage` delivery store (per browser, labelled) is the running mode.
- **No real GPS / map / driver location** — by design (§28); tracking is status + timeline only.
- **Assignment is a labelled Demo Delivery Team** — a real `DeliveryProvider` is a later, credentialled step.
- **Notifications are Demo/Log only** — recorded, never sent (§32).
- **Address snapshot is immutable** — controlled address changes need a future change workflow (§10).
- **No live browser/device screenshots** (tooling unavailable) — verified via HTTP + tests + code review.

## 25. Exact local URLs

- `/[locale]/supplier` — supplier dashboard **Delivery** tab (board + detail + failure/reschedule + installation + handover).
- `/[locale]/orders/[id]` — customer order detail with the **Delivery & tracking** section + slot picker.
- `/[locale]/account` — account order cards with the deterministic delivery summary.
- Verified: `/en`, `/ar`, `/en/account`, `/ar/account`, `/en/supplier`, `/ar/supplier`.

## 26. Recommended next phase — Phase 13: Notifications + User Memory + Agent Follow-up

With the operational pipeline complete, wire the notification abstractions (fulfillment/manufacturing/delivery Demo/Log adapters) to a real in-app notification centre + user memory + agent follow-up — behind the same interfaces, still zero-credit until real providers are supplied. **Do not start it.**
