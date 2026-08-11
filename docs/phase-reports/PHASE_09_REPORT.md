# Phase 09 — Custom Furniture + Request for Quote (RFQ) — Report

_Status: ✅ Complete & verified. Athathi now takes a customer from "I can't find the furniture I want" → a structured `CustomFurnitureSpec` → matched real suppliers → an RFQ → multiple quotes → a transparent comparison → an explicit customer acceptance ("ready for order"). No payment/manufacturing (that's Phase 10). Runs fully judge-demo-ready in **Demo Data Mode** with deterministic, clearly-labelled Demo Quotes; a Supabase-ready schema + RLS + repository seam is in place and gated. Build/lint/typecheck/tests/audit all green (140 tests); routes + AR rendering verified over HTTP. **No Supabase project is configured**, so the DB path is built + gated, not live-exercised. The Chrome extension did not connect this session (no live click-through)._

## Summary

Phase 09 makes custom furniture feel simple: *I have an idea → Athathi turns it into a specification → suitable suppliers quote it → Athathi helps me compare → I decide.* AI/demo **proposes** structured fields; deterministic application logic **validates**; suppliers provide the real commercial offer; the customer holds **final authority** (nothing is accepted or ordered automatically). Every price/timeline/supplier is real data or a clearly-labelled deterministic Demo Quote — never invented by an LLM.

## Skills used

See `PHASE_09_SKILLS.md`. Headline: `frontend-design` (the premium multi-step custom flow + quote comparison within the established system); native database/RLS design; `claude-api` for the structured-extraction contract; `node:test`; and the Phase 08.1 `audit:arabic` guard run after adding translations.

## Routes

- **`/[locale]/custom`** — the main Custom Furniture experience (start → idea → spec → review → suppliers → quotes). Linked from: the homepage custom teaser, product pages (customizable → "Request a custom version", deep-links `?from=slug`), the design result, the shop no-match empty state, and header nav.
- **`/[locale]/account`** — gains a **Custom furniture requests** section (status + quotes received).
- **`/[locale]/supplier`** — the **Requests** tab is now a real RFQ workspace (New / Quoted / Closed + a validated quote form).

## Custom spec architecture

`src/lib/rfq/` (pure, client-safe): `types.ts` (`CustomFurnitureSpec`, `CustomRequest`, `Quote`, `RFQStatus`, `QuoteStatus`, match/recommendation reasons), `spec-fields.ts` (category-specific field registry → progressive disclosure; 8 custom categories), `validation.ts` (spec + quote validation with bounds), `extract.ts` (deterministic demo extraction), `matching.ts` (supplier matching), `demo-quotes.ts` (deterministic quote generator), `quote-calc.ts` (OMR totals/budget/sort/recommendation), `authorization.ts` (pure RLS-mirror rules), `index.ts`.

The spec is **category-aware** (a sofa shows shape/seats/arms/firmness; a table shows finish/legs; a bed shows mattress size) — never one giant form. Dimensions support an explicit **"ask the supplier"** value so the customer is never forced to invent a measurement (§11).

## Image / reference handling

The reference image stays **local** in demo mode (the flow records only `hasReferenceImage`; the blob is never uploaded — §5/§35). The migration models private `custom_request_images` (Storage object paths) with owner-only RLS + addressed-supplier read, for when Supabase Storage is connected (signed URLs). Reference images are never public.

## AI / demo extraction

`extractSpecFromText` parses the customer's own words into **proposed** fields — dimensions ("240 cm" / "٢٤٠ سم"), colour/material (via the shared Phase 05 mappers, EN + AR), shape, seats, firmness, budget. It extracts **only stated facts**, never a measurement guessed from an image, and is deterministic. The user reviews/edits everything in the spec + review steps before any RFQ (§8/§10/§36). When a real Agent/Vision provider is configured, the Agent proposes the same structured shape server-side; the review step is identical.

## RFQ model

`CustomRequest` (envelope: spec + recipients + `RFQStatus`) → `Quote` per supplier (`base/delivery/installation/total` exact OMR, `manufacturingDays`, `warranty`, `QuoteStatus`, `validUntil`). Statuses match the brief; no manufacturing statuses. Money is `numeric(12,3)` in the DB and numeric throughout TS; `total` is computed in code (`quoteTotal`), never by the LLM (§38).

## Supplier matching

`matchSuppliers` uses **real supplier data + capabilities** (extended in `supplier_capabilities`): only **active** suppliers that **accept custom work in the requested category** are eligible; inactive/suspended/non-custom/wrong-category suppliers are never RFQ recipients (§17). Each match carries transparent, data-backed reasons ("Makes custom sofas", "Works with velvet", "Based in Muscat", "Verified"). `buildRecipients` drops fake/ineligible supplier ids. Demo suppliers gained deterministic capabilities (custom categories, materials, service regions, lead-time ranges).

## Demo quotes

`generateDemoQuotes` produces one **deterministic** Demo Quote per recipient, derived from the spec (category base, material multiplier, size/seat factors, quantity) + the supplier's profile (deterministic ±12% variance, lead-time range) — **same request + same supplier → identical quote** (§44, unit-tested). All are labelled **Sample · Demo Quote**; none is presented as a real factory quotation.

## Live DB status

**No Supabase project configured** → demo mode. `supabase/migrations/0004_custom_furniture_rfq.sql` (schema) + `0005_rfq_rls.sql` (RLS) are ready to apply. The demo RFQ store (`localStorage`, clearly labelled) is the honest fallback with the same shape; setting the env pair + applying migrations switches to DB-backed, RLS-isolated RFQs with no UI change.

## Supplier RFQ dashboard

The Requests tab shows requests **addressed to this supplier only** (New / Quoted / Closed), the requested spec, and a validated **Send quote** form (price/delivery/installation/days/warranty/notes; total computed live in code). A supplier quotes only **as its own supplier** for a request it was **addressed** — enforced by `submitSupplierQuote`'s recipient check (demo) and RLS (Supabase). No fake counts.

## Customer request dashboard

The account **Custom furniture requests** section lists the customer's requests with status + quotes-received count + view/remove — a summary, not a project-management dashboard (§25).

## Quote comparison

A premium comparison of real fields — supplier, total, furniture/delivery/installation breakdown, manufacturing time, warranty, verified status, budget position — as cards that stack on mobile and sit two-up on desktop. **No single opaque "AI score."** Sorting is deterministic (Recommended / Lowest price / Fastest / Within budget).

## Recommendation logic

`recommendQuote` picks a transparent "best value" with **reasons** ("Within your budget", "Lowest total price", "Fastest to make", "Includes free delivery") — deterministic scoring, tie-broken by lowest total then id. A **promoted-listings firewall** is documented and enforced: advertising never affects ranking; the Agent/recommendation uses only actual request fit (§27/§28), with a visible note to the user.

## Approval boundary

Accepting a quote is an **explicit, confirmed customer action** (a dialog showing supplier/total/lead time, stating payment comes later). The Agent may compare/explain/recommend but **never** accepts automatically (§29/§30). On accept, the request becomes **Accepted / Ready for order** and the other quotes are marked "Not chosen"; an accepted quote is **locked** (`isAcceptedLocked`) and cannot be overwritten in place (§16). No payment/order is created.

## Agent tools

The Phase 06 registry gained five deterministic, rfq-backed tools (allowlisted, argument-validated): `create_custom_spec`, `find_custom_suppliers`, `list_quotes`, `compare_quotes`, `recommend_quote`. They never invent a quote/supplier/price/timeline — values come only from the validated spec, real supplier data, or the labelled demo generator; money is computed in code (§31/§32).

## Security / RLS

- **Ownership + isolation (pure, unit-tested + RLS mirror):** a customer reads/accepts only their **own** request + its quotes; a supplier reads only RFQs **addressed** to a supplier it belongs to, and quotes only **as** that supplier (Supplier A can't quote as B); an accepted quote is locked.
- **Validation (§49):** negative/absurd prices, negative fees, negative/oversized dimensions, unknown category, bad quantity — all rejected. Fake supplier/request ids are dropped (recipient + membership checks).
- **Secrets:** the RFQ layer touches no `process.env`/secret; the service-role key is absent from `.next/static` (verified). RLS helpers pin `search_path`.
- `0005_rfq_rls.sql` policies reviewed for escalation (recipient/membership-based, no client-trusted role).

## Arabic / RTL

~230 new bilingual keys (logical Unicode), `npm run audit:arabic` clean (1,584 strings, 0 flagged). EN/AR key parity exact (1,147 keys, 0 diffs); all placeholders (`{count}`/`{value}`/`{min}`/`{max}`/`{supplier}`/`{total}`/`{days}`/`{amount}`) preserved. `/ar/custom` verified server-rendered `dir="rtl"` with correct Arabic and zero reversed strings; forms, chips, selects, comparison cards and the supplier RFQ view mirror correctly.

## Accessibility

Multi-step flow with a labelled progress rail (`aria-current="step"`); radio-group category/start pickers; `aria-pressed` colour + supplier selection (never colour-only); dimension "ask the supplier" checkboxes; native `<select>` for enums; budget/recommended/accepted states carry text + badges (not colour alone); accept is a `role="dialog"` with explicit confirm/cancel; focus-visible throughout; numbers/prices use `dir="ltr"` islands inside RTL.

## Browser QA

Chrome extension offline (as in Phases 04–08.1) — not faked. Fallback: all-route HTTP checks (EN + AR incl. `/custom`, `?from=slug`), `dir="rtl"` + correct-Arabic + zero-reversed render checks, the 24 new deterministic unit tests exercising the whole domain (extraction → matching → quotes → comparison → recommendation → authorization), and RTL/responsive code review. Live DB testing was not performed (no project) and is not claimed.

## Tests

`npm test` → **140 passing** (24 new in `src/lib/rfq/rfq.test.ts`): spec validation + category/dimension-unknown + needs-detail; deterministic extraction (EN + Arabic-Indic; never invents dimensions); matching (active-only, inactive/non-custom/wrong-category rejected, material reasons, fake-recipient drop); deterministic demo quotes (identical on repeat, within lead-time, varied across suppliers); totals/budget/sort/recommendation reasons; quote validation (negative/absurd rejected, free delivery allowed); authorization (customer-owns, supplier-addressed-only, A-can't-quote-as-B, owner-accepts, accepted-locked). No external calls.

## Build / lint / typecheck / audit

- `npm run audit:arabic` → clean. `npm run lint` → 0 warnings. `npm run typecheck` → clean.
- `npm run build` → success, **219 pages** + `/[locale]/custom` (+ existing routes). Existing pages stay static; `/custom`, `/account`, `/supplier` are dynamic.

## Known limitations

- **No live Supabase** → the DB/RLS paths are built + gated, not live-exercised; the demo RFQ store (per-browser, labelled) is the running mode. Applying migrations + setting env vars activates the backend.
- **Demo quotes are deterministic samples**, clearly labelled — never real factory quotations.
- **Reference images stay local** in demo mode (only `hasReferenceImage` is recorded); real private Storage + signed URLs activate with Supabase.
- **Quote versioning is deferred** (§16): an accepted quote is locked rather than versioned; documented for a future workflow.
- **Supplier-side demo quote writes** share the per-browser store; true cross-user supplier↔customer messaging requires the backend.
- No live browser click-through (extension offline); verified via HTTP + tests + code review.

## Judge demo flow (works with no backend)

Open Custom Furniture → describe "L-shaped sofa, dark green velvet, 240 cm, 4 seats, budget OMR 120" → Athathi extracts the fields → confirm the spec → review → matched demo suppliers (with reasons) → **Send Request for Quotes** → 3 deterministic Demo Quotes → compare (sort, Athathi's transparent pick) → **Accept Quote** (explicit confirm) → **Quote Accepted · Ready for order** → STOP (no payment). Works identically in Arabic at `/ar/custom`.

## Recommended Phase 10

**Phase 10 — Orders + Checkout + Payment Architecture.** An accepted quote (and the normal Phase 03 cart) become real orders: `orders`/`order_items`, checkout, and a payment-provider architecture (server-side, no secrets in the client). **Do not start it.**
