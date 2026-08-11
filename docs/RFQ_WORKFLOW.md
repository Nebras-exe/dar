# Athathi — Custom Furniture & RFQ Workflow (Phase 09)

How a customer's idea becomes a comparable set of supplier quotes, and the trust
rules that keep it honest. The domain lives in `src/lib/rfq/` (pure), the UI in
`src/features/custom/` + the supplier dashboard, and the backend in
`supabase/migrations/0004_*` + `0005_*`.

## The flow

```
Reference / idea  →  CustomFurnitureSpec  →  match suppliers  →  CustomRequest (RFQ)
   →  Quotes  →  compare  →  customer accepts  →  Ready for order  →  (Phase 10: order + payment)
```

1. **Start** (`/[locale]/custom`) — from scratch, from a catalog product
   (`?from=slug`), or with a reference image; pick one of 8 custom categories.
2. **Idea** — describe the piece; `extractSpecFromText` proposes structured fields
   from **stated facts only** (never an image-inferred measurement). Deterministic.
3. **Spec** — a **category-specific** form (progressive disclosure). Dimensions can
   be left as **"ask the supplier"**. Validated by `validateSpec`.
4. **Review** — the full spec with "Not specified" / "Ask the supplier" for unset
   fields. Nothing is sent yet.
5. **Suppliers** — `matchSuppliers` lists **eligible** suppliers (active + accept
   custom + right category) with transparent reasons. The customer chooses
   recipients (default: all matched).
6. **Send RFQ** — an explicit, confirmed action showing the summary. Demo mode
   creates the request + deterministic Demo Quotes locally.
7. **Quotes** — a premium comparison (sortable; Athathi's transparent pick). The
   customer **explicitly accepts** one → "Accepted · Ready for order". No payment.

## Data model (`0004_custom_furniture_rfq.sql`)

| Table | Purpose |
| --- | --- |
| `supplier_capabilities` | Per-supplier: `accepts_custom`, `custom_categories[]`, `materials[]`, `service_regions[]`, lead-time range. Drives matching. |
| `custom_requests` | The RFQ envelope: `customer_id`, `category`, `quantity`, `budget numeric(12,3)`, `spec_json` (category-specific extras), `status` (`rfq_status`), `is_demo`. Structured columns for queryable fields; JSON for the rest (§14). |
| `custom_request_images` | Private reference uploads (Storage object paths). Never public (§35). |
| `rfq_recipients` | `(request_id, supplier_id, match_reasons[])` — which suppliers an RFQ was sent to. |
| `quotes` | `base_price/delivery_fee/installation_fee/total numeric(12,3)`, `manufacturing_days`, `warranty_text`, `status` (`quote_status`), `valid_until`, `is_demo`. One active quote per (request, supplier). |

**Future (not built — §12):** `orders`, `order_items`, `manufacturing_jobs`,
`deliveries`. Accepted quote → order is Phase 10.

## Money (§38)

All money is `numeric(12,3)` OMR in the DB and numeric in TS. `total = base +
delivery + installation` is computed by `quoteTotal` in application/DB logic —
**never** by an LLM. Budget position (`within` / `over by X` / `no budget`) is
deterministic (`budgetPosition`).

## Determinism (§44)

Demo Quotes derive from `hash(requestId + supplierId)` folded with the spec
(category base, material multiplier, size/seat factors, quantity) and the
supplier's lead-time range — so **the same request to the same supplier always
yields the same quote**. Unit-tested. No `Math.random`.

## Authorization + RLS (§33/§34)

Pure rules in `src/lib/rfq/authorization.ts` mirror `0005_rfq_rls.sql`:

- **Customer** — reads/accepts only their **own** request + its quotes.
- **Supplier member** — reads only RFQs **addressed** to a supplier they belong to,
  and submits a quote only **as** that supplier for an **addressed** request.
  Supplier A can never read B's private request context or quote as B.
- **Accepted quote is locked** — never overwritten in place (`isAcceptedLocked`);
  versioning is deferred (§16).
- **Public** — no access to any RFQ/quote. Reference images are owner-only (+
  addressed-supplier read).

## Recommendation firewall (§27/§28)

`recommendQuote` returns a "best value" pick **with reasons** (within-budget /
lowest-total / fastest / includes-delivery) — deterministic, never an opaque score.
**Advertising never affects ranking**; recommendations use only actual request fit.
A visible note states this to the customer.

## Agent tools (§31/§32)

The Phase 06 registry gained `create_custom_spec`, `find_custom_suppliers`,
`list_quotes`, `compare_quotes`, `recommend_quote` — allowlisted, argument-
validated, and backed only by the rfq domain (real supplier data + the labelled
demo generator). The Agent never invents a quote, supplier, price, or timeline, and
never accepts a quote — the customer clicks Accept.

## Demo vs Supabase

- **Demo** (default): requests + quotes live in a labelled `localStorage` store
  (`src/features/custom/rfq-store.ts`); Demo Quotes are deterministic; reference
  images stay in the browser.
- **Supabase**: `custom_requests`/`quotes` (RLS-scoped) are the source of truth;
  the same UI is DB-backed; reference images use private Storage + signed URLs.
  Activated by applying `0004`/`0005` and setting the Supabase env vars.
