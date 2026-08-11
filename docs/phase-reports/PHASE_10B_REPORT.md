# Phase 10B — Payment Architecture — Report

_Status: ✅ Complete & verified. A confirmed order now flows **CONFIRMED → PAYMENT INTENT → (server-side verify) → PAID → receipt** through a provider-agnostic payment layer. No live gateway is configured, so payment runs through an honest, deterministic **Demo Payment** provider that moves no real money and is clearly labelled — never a faked gateway and never a card/CVV/bank field. Server/order amount authority, idempotency, client-untrusted verification, safe status transitions, owner-only visibility, and an Agent that is strictly read-only are all enforced and unit-tested. The architecture accepts a real, hosted/tokenized gateway with no rewrite of checkout, orders, or the payment UI. All gates green (168 tests). Phase 11 not started._

## Skills used

See `PHASE_10B_SKILLS.md`. Headline: `ui-ux-pro-max` (payment/checkout UX patterns, trust cues), `frontend-design` + `web-design-guidelines` (calm, honest payment surface, RTL-correct), `database-schema` (payment_intents/attempts/events + RLS), `security-review` (amount authority, idempotency, verification, isolation, secret hygiene — §28 matrix below), `node:test`.

## Payment domain

`src/lib/payments/` (pure, mostly client-safe):

- **`types.ts`** — `PaymentStatus` (`not_started/pending/requires_action/authorized/paid/failed/cancelled/expired`), `PaymentMethod` (`demo/card/wallet/bank_transfer`), `PaymentIntent` (order-derived `amount`, safe `providerReference`, `idempotencyKey`, `isDemo`), `PaymentAttempt` (safe refs + `failureCode`), `PaymentProvider` interface, `PaymentConfirmation` (a **receipt**, explicitly not a tax invoice).
- **`status-machine.ts`** — the only allowed transitions; `paid`/`cancelled` terminal; `failed`/`expired` → `pending` (retry). `paid → pending` is impossible without a documented refund. `canTransition/transition/isTerminal/canRetry/isPaid`.
- **`intent.ts`** — `buildIntent` sets `amount = order.totals.grandTotal` (server/order authority); `assertOrderAmount` rejects a tampered/mistyped client amount; `findReusableIntent` (idempotency — a `paid` intent is always returned, never re-created); `applyStatus` gated by the machine.
- **`authorization.ts`** — `canPayOrder`/`canReadIntent` (owner-only), `supplierPaymentView` (paid/awaiting only), `AGENT_CAN_PAY = false`.
- **`providers/demo.ts`** — `demoPaymentProvider`: deterministic, offline, no card fields; encodes the demo outcome in a safe reference. **`providers/index.ts`** — `resolveProvider` (real if configured, else demo), `isLivePaymentConfigured`, `paymentMode`; `REAL_PROVIDERS` intentionally empty.

Full design in `docs/PAYMENT_ARCHITECTURE.md`.

## Payment status is separate from order status

`Order.status` (`confirmed/processing/…`) is untouched. Payment lives entirely in the
`PaymentIntent` domain — the two concerns are never overloaded onto one field (§6).

## Demo Payment provider (honest, not faked)

With no certified gateway configured (verified — `REAL_PROVIDERS` empty, no provider env set),
`paymentMode()` is `"demo"`. `demoPaymentProvider.createIntent` returns a safe reference
encoding the chosen outcome; `verify` resolves deterministically to `paid` (approve) or
`failed`+`declined` (decline). No randomness, no network, no card, no secret. Every intent is
`isDemo`, the UI is labelled **Demo Payment**, and the receipt states it is a demo receipt,
not a tax invoice. Athathi never claims a real charge occurred.

## Demo payment store

`src/features/orders/payment-store.ts` — `usePayment(order)` (intents in `localStorage`,
`athathi.payments.v1`) enforces the SAME invariants a server route would: amount from the
order (never a client value), one active intent per order (paid never re-created), and `paid`
set only via `provider.verify()` gated by the status machine. `usePaymentStatus(orderId)`
feeds the order/account/supplier status views.

## API boundary + webhook foundation

`src/app/api/payments/` — the real-mode server boundary, gated:

- **`create-intent`** — auth + owner required; the amount is **never** read from the body
  (derived from the order server-side); oversized/bad JSON rejected; returns only safe codes.
  With no gateway → `provider-unavailable, mode:"demo"` (the client runs the demo flow).
- **`verify`** — server-side verification only; documents that `paid` is set via
  `provider.verify()` + the status machine, never a client `?success`/localStorage flag.
- **`status`** — capability (`configured`/`mode`) + owner-gated order status; booleans/enum only.
- **`webhook/[provider]`** — a **documented foundation** (returns 404 while no gateway exists),
  specifying: verify signature over the raw body → timestamp/replay window → dedupe by
  `(provider, event_id)` → safe status-machine transitions → 2xx without leaking errors.

## Payment UI

`/[locale]/orders/[id]/payment` (auth-gated) + `PaymentExperience`: a **Demo Payment** badge,
an honest "this is a demo payment / no card / no money moves" notice, an amount-due card
(derived from the order), a deterministic **Approve / Decline** demo-outcome selector, a
two-step **Pay in demo mode → Verify payment** flow (modelling a hosted-gateway
create → return → verify), a **paid receipt** (reference/method/date/amount + demo-receipt
note), and a **failed → try again** path. **No card/CVV/PIN/bank field exists anywhere.**
Checkout's confirmation now leads with **Continue to payment** (with a "you can pay later from
your order page" note).

## Status across the app

- **Account orders** and **order detail** show the payment status as a text+icon chip (never
  colour-only) plus a **Pay now / Retry / View receipt** action on the order detail totals card.
- **Supplier orders** show only **Customer paid / Awaiting payment** — never a failure reason,
  provider reference, method, or attempted amount (`supplierPaymentView`, §8/§23).

## Agent (read-only on payments)

Added `summarize_payment` (allowlisted, deterministic, read-only): reports `mode`, the order's
payment `status`, `isPaid`, and `agentCanPay: false`. It never pays, verifies, completes,
refunds, or changes a method. The system prompt gained an explicit **payment read-only** rule
(never ask for/accept card, CVV, PIN, or bank details).

## Security — §28 verification matrix

| # | Risk | Mitigation | Verified |
|---|---|---|---|
| 1 | Raw card/CVV/PIN captured | No such field exists anywhere; real path must be hosted/tokenized | Code review + test (`no card fields`) |
| 2 | Client-tampered amount | `buildIntent` uses `order.totals.grandTotal`; `assertOrderAmount` rejects mismatch; API ignores body amount | Unit tests + route review |
| 3 | Duplicate intents / double charge | `unique(order_id)` + `findReusableIntent`; `paid` intent returned as-is | Unit tests (idempotency + paid-replay) |
| 4 | Trusting `?success`/localStorage | `paid` only via `provider.verify()` + status-machine gate | Store + route review, unit test |
| 5 | Illegal status jump (`paid → pending`) | `canTransition` blocks it; `paid`/`cancelled` terminal | Unit tests (invalid transitions) |
| 6 | Cross-user intent read | `canReadIntent` owner-only; RLS owner-all; supplier status-read only | Unit tests + `0009` RLS |
| 7 | Supplier sees payment detail | `supplierPaymentView` → paid/awaiting only | Unit test + UI review |
| 8 | Agent pays/verifies | `AGENT_CAN_PAY=false`; `summarize_payment` read-only; prompt rule | Unit test + review |
| 9 | Secret leakage to client | Providers server-only; routes return booleans/enum + safe codes; no secret printed | Route review + build scan |
| 10 | Faked gateway | `REAL_PROVIDERS` empty → honest demo; receipt labelled non-invoice | Review |
| 11 | Webhook forgery/replay | Documented signature + timestamp + `(provider,event_id)` dedupe; 404 while inactive | Route review + `payment_events` unique |

## Persistence / RLS

`0008_payments.sql` — `payment_status`/`payment_method` enums; `payment_intents`
(`amount numeric(12,3)` snapshot, safe-only `provider_reference`, `idempotency_key`,
`unique(order_id)`, `is_demo`); `payment_attempts` (safe refs, `failure_code`);
`payment_events` (`unique(provider,event_id)` webhook dedupe); refunds documented, not built.
`0009_payments_rls.sql` — intents owner-all; supplier status-read via order-group match;
attempts owner-only; events service-role only (default deny). Gated (no live Supabase).

## Arabic / RTL

49 new bilingual payment keys + `checkout.confirmed.payNow`/`payLaterNote`. `audit:arabic`
clean (1754 Arabic strings scanned), EN/AR parity exact (**1160 leaves each**). Status is
carried as text+icon (not colour-only); numeric/reference values use `dir="ltr"` islands.

## Accessibility

Live status region (`role="status" aria-live="polite"`); the demo-outcome selector is a real
`<fieldset>`/`<legend>` with radio `<input>`s and visible labels; buttons have `loading`
states and explicit text; payment status is text+icon everywhere (never colour-only); receipt
is a `<dl>`; focus-visible throughout; icons `aria-hidden`.

## Tests / build

`npm test` → **168 passing** (14 in `src/lib/payments/payments.test.ts`): amount = order total,
`assertOrderAmount` rejects tampering, idempotency reuse + paid-always-returned, demo
success/failure determinism, no card fields, valid/invalid transitions, paid-replay rejected,
owner-only, supplier-safe view, `AGENT_CAN_PAY=false`. `npm run lint` 0 warnings,
`npm run typecheck` clean, `npm run build` success (payment page + 4 API routes emitted),
`npm run audit:arabic` clean.

## Known limitations

- **No live gateway / Supabase** → the real provider path, DB, and RLS are built + gated, not
  live-exercised; the demo payment store (per-browser, labelled) is the running mode.
- **Refunds documented, not implemented** — by design; a refund must be a separate auditable flow.
- **Webhook is a documented foundation**, inactive (404) until a certified provider is registered.
- No live browser/device screenshots (tooling unavailable) — verified via HTTP + tests + code review.

## Exact local routes

- `/[locale]/orders/[id]/payment` — the payment page (Demo Payment).
- `/api/payments/create-intent`, `/api/payments/verify`, `/api/payments/status`,
  `/api/payments/webhook/[provider]` — the gated real-mode boundary.
- `/[locale]/checkout` — confirmation now leads to payment.
- `/[locale]/orders/[id]`, `/[locale]/account`, `/[locale]/supplier` — now show payment status.

## Recommended Phase 11A — Order Fulfillment + Supplier Acceptance

Build the post-payment lifecycle: once an order is **paid**, drive a supplier acceptance +
fulfillment workflow (accept → prepare → ready/handover) with customer-visible milestones,
keeping payment and fulfillment as separate, auditable domains. **Do not start it.**
