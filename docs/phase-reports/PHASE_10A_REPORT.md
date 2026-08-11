# Phase 10A — Orders + Checkout — Report

_Status: ✅ Complete & verified. One unified order architecture serves BOTH checkout sources — a normal catalog cart and an accepted custom RFQ quote — through a calm three-step checkout to an immutable, supplier-grouped order, then a customer order history and a supplier order view. **No payment is processed** (that's Phase 10B); confirming records a clearly-labelled demo order. Runs fully in Demo Mode with a local order store; a Supabase-ready schema + RLS is provided and gated. Build/lint/typecheck/tests/audit all green (155 tests); routes + auth-gating + security verified live over HTTP. Phase 10B not started._

## Skills used

See `PHASE_10A_SKILLS.md`. Headline: `ui-ux-pro-max` design-intelligence (ecommerce checkout patterns), `frontend-design` + `web-design-guidelines` (calm, trustworthy, RTL-correct checkout), `database-schema` (orders/groups/items + RLS), `security-review` (client-tamper resistance, ownership, isolation), `node:test`.

## Order schema

`src/lib/orders/` (pure, client-safe): `types.ts` (`Order`/`OrderItem` [catalog|custom snapshots] / `SupplierOrderGroup` / `OrderSource` / `OrderStatus` / `CheckoutDraft` / `CheckoutTotals` / `DeliveryAddress`), `totals.ts` (grouping + exact OMR), `snapshot.ts` (build immutable drafts from cart / accepted quote), `validation.ts` (Oman address + cart revalidation + accepted-quote validation), `authorization.ts` (ownership + supplier redaction), `index.ts`. Statuses: `draft/confirmed/processing/cancelled/completed` — **no payment states** (§4/§15).

## Checkout flow

`/[locale]/checkout` — auth-gated (redirects to `/login?next=…`). Three calm steps with a step rail: **Order summary** (supplier-grouped, with price-changed / dropped-item notices) → **Delivery details** (Oman address) → **Review & confirm** (address + groups + an explicit "payment not processed yet" note). A sticky totals card throughout. Desktop two-column, mobile single-column. Confirming creates the order and clears the source.

## Cart checkout

The cart "Checkout" button now links to `/checkout`. On entry the cart is **revalidated**: fake/removed slugs are dropped, quantities clamped, colours kept only if a real variant, and a price change since add-to-cart is surfaced (the order always uses the **current catalog price** — never a silently-changed payable, §11). Items snapshot name/price/dimensions/colour.

## RFQ checkout

An accepted quote's confirmation now offers **"Proceed to checkout"** → `/checkout?source=quote&request=…&quote=…`. The server never trusts those ids: `validateAcceptedQuote` requires the request to be **owned** by the customer and the quote to be **accepted** (§12); otherwise the checkout shows an invalid state. The quote's exact terms (base/delivery/installation/manufacturing-days/warranty + the frozen `CustomFurnitureSpec`) are snapshotted.

## Multi-supplier handling

A cart with products from multiple suppliers splits into one `SupplierOrderGroup` per supplier, each with its own subtotal; the order shows per-supplier groups + an overall total. Deterministic supplier ordering (by id). **No supplier delivery fees are invented** — catalog delivery/installation are 0 and stated honestly ("arranged with the supplier"); only accepted-quote fees (real data) are charged (§13/§14).

## Order snapshots (immutability)

At order time every line copies its data: catalog items snapshot product id/slug/name(EN+AR)/category/colour/material/unit price/quantity/dimensions; custom items snapshot the accepted quote + spec. Snapshots are separate objects from the catalog — a later catalog price change never alters a historical order (unit-tested). Totals are recomputed authoritatively on create — the client never supplies a total.

## Demo orders

With no backend, confirmed orders persist in a labelled `localStorage` store (`athathi.orders.v1`); every order is `isDemo` and shows a **Demo** badge, and the confirmation states plainly that no payment was taken and no real supplier was notified (§16). When Supabase is configured, `orders`/`order_groups`/`order_items` (RLS-scoped) are the source of truth with the same shape.

## Customer orders

The account gains a real **Orders** section (`AccountOrders`) — order number, date, item/supplier counts, status, total, source — with an honest empty state (no fake history). `/[locale]/orders/[id]` shows the full order: status, source, supplier-grouped items, delivery address, total, and the payment-deferred note. The old "orders coming soon" placeholder is removed.

## Supplier orders

The supplier dashboard gains an **Orders** tab (`SupplierOrders`) showing only orders that contain **this supplier's group** — and only that group's items/totals (another supplier's portion is never exposed, enforced by `redactOrderForSupplier` + RLS). Supplier actions: **Acknowledge** (new → acknowledged) and **Mark as processing** (acknowledged → processing) on their own group only — no manufacturing workflow (§20).

## Security / RLS

- **No client-trusted money/ownership.** Totals are always recomputed from snapshots (`recomputeGroups`); the client never sends a price or total. Cart lines are re-resolved against the catalog (fakes dropped, quantity clamped, colour must be a real variant). Accepted-quote checkout requires owned + accepted (never a browser-supplied quote id).
- **Ownership + isolation (pure, unit-tested + RLS mirror):** a customer reads/confirms only their own order; a supplier reads only its own group and can update only its own group's status. `0007_orders_rls.sql` enforces the same via `is_order_supplier` + membership; `order_items` are readable only to the owner OR a member of that item's group's supplier — so cross-supplier line items are never visible.
- **Auth-gating:** `/checkout` and `/orders/[id]` redirect to login when unauthenticated (verified live: `307 → /login?next=…`).
- **Secrets:** the orders layer touches no `process.env`/secret; no service-role key in `.next/static` (verified).
- **Tested §21 cases:** price/quantity tampering, fake slug/quote id, unaccepted quote, cross-customer + cross-supplier access, order-total override — all covered.

## Agent

Added `summarize_checkout` (allowlisted, deterministic): groups the cart by supplier with exact OMR totals and returns `requiresApproval: true`. It summarizes only — it **never confirms** an order (§23); confirmation stays an explicit UI action.

## Arabic / RTL

~130 new bilingual keys (checkout, orders, supplier orders, address fields, errors, empty/confirmed states) in logical Unicode; `audit:arabic` clean, EN/AR parity exact (1277 keys). `/ar/checkout` verified `dir="rtl"` with correct Arabic and zero reversed strings; phone/number inputs use `dir="ltr"` islands.

## Accessibility

Step rail with `aria-current="step"`; real `<label htmlFor>` on every field + native `<select>` for governorate; `aria-invalid` + inline errors; status/notice blocks use `role="alert"`; status carried as text + badge (not colour-only); confirm is an explicit button; focus-visible throughout; icons `aria-hidden`.

## Responsive

Checkout is two-column on desktop (content + sticky totals), single-column on mobile; supplier groups + order detail stack cleanly; no horizontal overflow (logical properties). Verified by responsive code review (device tooling unavailable this session).

## Tests / build

`npm test` → **155 passing** (15 new in `src/lib/orders/orders.test.ts`): cart checkout + grouping, same-supplier merge, fake-slug drop, line totals, snapshot immutability, RFQ draft + accepted-only validation, OMR precision, cart revalidation + price-change surfacing, Oman address, ownership + supplier redaction, order number. `npm run lint` 0 warnings, `npm run typecheck` clean, `npm run build` success (**221 pages** + `/checkout` + `/orders/[id]`), `npm run audit:arabic` clean.

## Known limitations

- **No live Supabase** → the DB/RLS paths are built + gated, not live-exercised; the demo order store (per-browser, labelled) is the running mode.
- **No payment** — by design (Phase 10B). Confirming records an order draft/demo only.
- **Catalog delivery/installation are 0** (honestly stated) — real catalog logistics need supplier data; only accepted-quote fees are charged.
- **Supplier order actions are demo-local** (per-browser store); real cross-user supplier↔customer order flow needs the backend.
- No live browser/device screenshots (tooling unavailable) — verified via HTTP + tests + code review.

## Exact local routes

- `/[locale]/checkout` — unified checkout (cart + `?source=quote&request=…&quote=…`).
- `/[locale]/orders/[id]` — customer order detail.
- `/[locale]/account` — now includes the Orders section.
- `/[locale]/supplier` — now includes the Orders tab.

## Recommended Phase 10B — Payment Architecture

Wire a payment-provider architecture onto the confirmed order: `payments`/`payment_intents`/`refunds`, a server-side provider abstraction (keys server-only, never in the client), order status transitions (`confirmed → paid → …`), and the honest demo/real split. **Do not start it.**
