# Payment Architecture (Phase 10B)

Athathi turns a **confirmed order** into a **paid order** through a provider-agnostic
payment layer. No live gateway is configured in this environment, so payment runs
through an honest **Demo Payment** provider — clearly labelled, deterministic, and
moving no real money. The architecture is designed so a certified gateway can be
added **without rewriting checkout, orders, or the payment UI**.

## The flow

```
CONFIRMED ORDER
   │  (customer opens the payment page)
   ▼
PAYMENT INTENT           amount = order.totals.grandTotal   (server/order authority — never a client value)
   │  provider.createIntent()                               (one active intent per order — idempotent)
   ▼
PENDING                  provider holds the payment (models a hosted-gateway redirect/return)
   │  provider.verify()   ← server-side verification only; never trusts ?success or localStorage
   ▼
PAID ORDER  ──►  payment status + receipt (a demo receipt, NOT a tax invoice)
   │
   └─ on decline ─►  FAILED  ──►  retry (back to pending → verify)
```

Payment status is **separate** from order status (`Order.status` stays
`confirmed/processing/…`). Payment lives in its own `PaymentIntent` domain so the two
concerns never overload one field.

## Layers

| Layer | Files | Responsibility |
|---|---|---|
| **Contracts** | `src/lib/payments/types.ts` | Pure types: `PaymentIntent`, `PaymentAttempt`, `PaymentStatus`, `PaymentMethod`, `PaymentProvider`, results, `PaymentConfirmation`. No I/O, client-safe. |
| **Status machine** | `status-machine.ts` | The only allowed transitions. `paid`/`cancelled` terminal; `failed`/`expired` may retry → `pending`. `paid → pending` is **forbidden** (a refund would be a separate, documented flow). |
| **Intent core** | `intent.ts` | `buildIntent` (amount from the order), `assertOrderAmount` (rejects a tampered client amount), `findReusableIntent` (idempotency), `applyStatus` (gated by the machine). |
| **Authorization** | `authorization.ts` | `canPayOrder`/`canReadIntent` (owner-only), `supplierPaymentView` (paid/awaiting only), `AGENT_CAN_PAY = false`. |
| **Providers** | `providers/demo.ts`, `providers/index.ts` | `demoPaymentProvider` (deterministic, offline, no card fields); `resolveProvider` (real gateway if configured, else demo); `isLivePaymentConfigured`/`paymentMode`. `REAL_PROVIDERS` is intentionally empty. |
| **Demo store** | `src/features/orders/payment-store.ts` | Client `localStorage` intents (`athathi.payments.v1`) enforcing the SAME invariants a server route would. |
| **API boundary** | `src/app/api/payments/*` | Real-mode server routes (gated), documented webhook foundation. |
| **UI** | `src/features/orders/payment-experience.tsx` + `/[locale]/orders/[id]/payment` | Pay in demo mode, verify, receipt, retry — no card fields. |

## Security invariants

1. **No raw card data, ever.** There is no card / CVV / PIN / OTP / bank field anywhere.
   A real integration must be hosted/tokenized (the provider collects sensitive data on
   its own PCI-compliant surface); Athathi stores only **safe references**.
2. **Server/order amount authority.** The payable is always `order.totals.grandTotal`.
   The API `create-intent` route reads the amount from the order, never from the request
   body; `assertOrderAmount` rejects any mismatched or wrongly-typed client amount.
3. **Idempotency.** One active intent per order (`unique(order_id)` + `findReusableIntent`).
   A `paid` intent is always returned as-is — never re-created or re-charged.
4. **Verification never trusts the client.** `paid` is only ever set by calling
   `provider.verify()` and passing the status-machine gate. A `?success=true` query or a
   localStorage flag is never sufficient.
5. **Safe status transitions.** All changes go through `canTransition`. `paid → pending`
   is impossible without a documented refund flow (not implemented in this phase).
6. **Least-privilege visibility.** A customer sees their own full payment status; a
   supplier sees only **paid / awaiting** for orders containing their group (never a
   failure reason, provider reference, method, or attempted amount); the Agent is
   **read-only** (`summarize_payment`) and can never pay, verify, complete, or refund.
7. **No secrets to the client.** Provider credentials live server-side only; the routes
   return booleans/enums and stable safe codes (`declined`, `provider-unavailable`,
   `verification-failed`, …) — never a raw provider error or a secret.

## Demo Payment provider

`demoPaymentProvider` is deterministic and offline. `createIntent` returns a safe
reference encoding the chosen demo outcome (`DEMO-XXXX:OK` / `DEMO-XXXX:FAILURE`);
`verify` resolves to `paid` (approve) or `failed`+`declined` (decline) from that
reference — no randomness, no network, no card. Every demo intent is `isDemo` and the UI
labels it **Demo Payment**. It is not a fake gateway: it never claims a real charge
occurred and the receipt states it is a demo receipt, not a tax invoice.

## Adding a real gateway (no checkout/UI rewrite)

1. Implement `PaymentProvider` in `src/lib/payments/providers/<name>.ts` — hosted/tokenized,
   reading credentials from `process.env`, returning only safe references.
2. Register it in `REAL_PROVIDERS` (`providers/index.ts`). `resolveProvider` now returns it
   whenever `isConfigured()` is true; `paymentMode()` flips to `"live"`.
3. Fill in the gated real branches already stubbed in `src/app/api/payments/*`: load the
   order server-side, derive the amount, create/verify the intent, persist to
   `payment_intents`/`payment_attempts`, and implement the webhook per the documented steps.

The contracts, status machine, authorization, UI, and orders layer are unchanged.

## Webhook foundation

`/api/payments/webhook/[provider]` is a **documented boundary**, not a live endpoint
(it returns 404 while no gateway is configured). A real integration must, before acting:
verify the provider signature over the **raw** body → enforce a timestamp/replay window →
deduplicate by `(provider, event_id)` via `payment_events` → apply only safe status
transitions through the status machine → return 2xx quickly without leaking internal errors.

## Refunds

Refunds are **documented, not implemented** in this phase. The schema reserves the shape
(`refunds` referenced in `0008_payments.sql` comments) and the status machine treats `paid`
as terminal precisely so a refund must be an explicit, auditable, separate transition —
never an ad-hoc `paid → pending` slide.

## Persistence

- **Demo mode (running):** `athathi.payments.v1` in `localStorage`, per browser, labelled.
- **Supabase mode (gated):** `0008_payments.sql` (`payment_intents` with `amount numeric(12,3)`
  snapshot, safe-only `provider_reference`, `idempotency_key`, `unique(order_id)`, `is_demo`;
  `payment_attempts`; `payment_events` for webhook dedupe) + `0009_payments_rls.sql`
  (owner-all on intents; supplier status-read only via order-group match; attempts owner-only;
  events service-role only, default deny).

## OMR money

The payable is computed in code with the exact 3-decimal OMR helpers (`roundOmr`/`formatOmr`,
`numeric(12,3)`), snapshotted onto the intent at creation. It is never produced by an LLM and
never supplied by the browser.
