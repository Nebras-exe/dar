# Athathi — Competition Demo Guide

**Run:** `npm run dev` → open **http://localhost:3000** (redirects to `/en`; add `/ar` for Arabic).
**Everything runs in Demo Mode** — no external AI, payment, courier, or messaging is called. Every "Demo" label is honest (Demo Payment, Demo Delivery Team, Demo Agent). No credentials or credits are ever used.

---

## The one-line pitch

> **Athathi turns your room, taste, and budget into a design you can actually buy — then carries it all the way through supplier, manufacturing, delivery, and follow-up.**

Not "a furniture store with AI." A full journey: **room photo + style + budget → understand the space → keep useful furniture → real catalog products → design → replace/customize → recalculate budget → buy → custom furniture → supplier → manufacturing → delivery → follow-up.**

---

## Demo sign-in (no real accounts)

In Demo Mode, **any email + any password works** and creates a labelled local session (the user id is derived from the email, so re-login restores the same orders).

- **Customer:** go to `/en/login`, enter e.g. `judge@demo.com` / `demo1234`, sign in.
- **Supplier (role switch):** while signed in, open `/en/supplier` → click **"Open the demo supplier workspace"**. This is a clearly-labelled DEMO-ONLY helper (it redirects to the real application flow when a live backend is configured — never a production bypass).

> Tip: the customer and supplier are the **same demo account** — so an order you place as the customer appears in the supplier dashboard after you switch. Use two browser profiles/windows if you want both open at once.

---

## 3-MINUTE JUDGE DEMO (the AI Designer hero flow)

**Goal: show catalog-grounded, budget-aware, purchasable AI design.**

1. **Homepage** (`/en`) — read the hero: "your room, your taste, your budget." Point out real catalog products with OMR prices floating in the hero. *(~15s)*
2. **Design My Space** → `/en/design`. *(~10s)*
3. **Wizard:** upload any room photo (or skip — Demo analysis works without it) → **Room type** Living room → **Budget 500 OMR** → **Style** Modern → **Existing furniture:** keep the sofa. *(~40s)*
4. **Demo analysis** runs (honest, deterministic — it does *not* claim to detect furniture from the photo). *(~10s)*
5. **Result:** three budget tiers built from the **real catalog**, each product with a bilingual reason and an OMR price; the **budget meter** shows how the plan fits 500 OMR. *(~30s)*
6. **Before / After** slider — the design grounded over the room; drag it. *(~15s)*
7. **Replace a product** (cheaper/similar/upgrade) → the **budget recalculates instantly** in code (never guessed). *(~25s)*
8. **Add entire design to cart** → **Checkout** → **Demo Payment** (labelled; no card fields, no gateway) → order confirmed. *(~35s)*

**Punchline:** "Every product, price, and total is real catalog data — the AI orchestrates, deterministic code decides. And it's a design you can actually buy."

---

## 5-MINUTE JUDGE DEMO (the full lifecycle)

Do the **3-minute flow above (steps 1–8)**, then continue:

9. **Account** (`/en/account`) — the order appears with **Payment: Paid** and a **fulfillment/delivery summary**; the **"Continue where you left off"** card suggests the next action; the **notification bell** shows updates. *(~30s)*
10. **Custom furniture** (`/en/custom`) — quickly show the RFQ: idea → structured spec → matched real suppliers → **Demo Quotes** → transparent comparison → accept. *(~40s)*
11. **Switch to supplier** (`/en/supplier` → Open demo workspace). Show the tabs: **Orders → Manufacturing → Delivery**. *(~20s)*
12. **Fulfillment:** on the paid order, **Accept** → **Start preparing** → **Mark ready**. *(~25s)*
13. **Manufacturing** (custom item): **Start manufacturing → Complete → Submit for QC → Pass the checklist → Mark ready for delivery** (or fail QC once to show the rework loop). *(~40s)*
14. **Delivery:** **Assign Demo Delivery Team → Out for delivery → Delivered**; if installation is included, **Schedule → Start → Complete → Confirm handover → Completed**. *(~40s)*
15. **Back to customer** (`/en/account` → the order) — the **per-supplier tracking timeline** now reflects everything: On the way → Delivered → Completed, with **customer-friendly language** and **no fake GPS**. The **notification center** shows the milestones; the **Agent** can summarize "your order is out for delivery." *(~30s)*
16. **Memory** (`/en/account` → **Design memory & preferences**) — turn on memory, save a style; next time the designer offers **"Use your saved style?"**. Show **Clear all** vs **Turn off** are separate and never touch orders. *(~25s)*

**Punchline:** "One continuous product — the same order flows through payment, supplier acceptance, manufacturing, quality check, and delivery, and the customer is kept informed the whole way."

---

## Exact routes

| Surface | Route |
|---|---|
| Home | `/en` · `/ar` |
| Shop / category / product | `/en/shop` · `/en/shop/sofas` · `/en/product/luna-modular-sofa` |
| AI Designer | `/en/design` |
| Custom furniture / RFQ | `/en/custom` |
| Supplier marketplace | `/en/suppliers` · `/en/suppliers/athathi-studio-collection` |
| Cart / checkout | `/en/cart` · `/en/checkout` |
| Account (orders, memory, follow-up) | `/en/account` |
| Order detail (tracking) | `/en/orders/<id>` |
| Payment | `/en/orders/<id>/payment` |
| Supplier dashboard | `/en/supplier` (Overview/Products/Inventory/Orders/Manufacturing/Delivery/Requests/Analytics/Settings) |
| Login / signup | `/en/login` · `/en/signup` |

Arabic: swap `/en` → `/ar` anywhere. The whole app is fully RTL.

---

## Strongest talking points (differentiators)

1. **Catalog-grounded AI** — the AI never invents a product, price, or dimension; every value resolves to a real catalog item via a tool.
2. **Budget-aware design** — three deterministic budget tiers; the budget meter recalculates in code, not by the model.
3. **Keeps useful existing furniture** — the design works *around* what the user chooses to keep.
4. **A purchasable room design** — "add entire design to cart," not just inspiration.
5. **Custom furniture RFQ** — idea → structured spec → real suppliers → transparent quote comparison (no opaque score).
6. **Supplier + manufacturing + QC workflow** — a real per-supplier operational pipeline with an auditable quality-check + rework loop.
7. **Full order lifecycle** — payment → fulfillment → manufacturing → delivery → installation → completion, as **separate auditable domains**, never one collapsed status.
8. **User-controlled memory** — opt-in, transparent, editable, deletable; stores only design context, never card/payment data.
9. **An Agent that follows the project** — reads deterministic state, surfaces the next action, and is strictly read-only on operations.
10. **A marketplace business model** — real local suppliers/workshops, not a single store.

---

## Honest Demo vs live architecture

| Shown as | It is |
|---|---|
| **Demo Payment** | A deterministic provider behind a real payment-provider abstraction. No card fields, no gateway. A certified gateway drops in without changing checkout. |
| **Demo Delivery Team** | A clearly-labelled demo assignee. No courier API, no GPS. |
| **Demo Agent** | The deterministic fallback that handles the judge-critical intents when no LLM key is set. The real LLM path exists behind the same interface. |
| **Demo Quotes / suppliers** | Clearly-fictional demo suppliers (e.g. "Athathi Studio Collection"). Never a real company presented as a partner. |
| **Notifications** | Real **in-app** feed. Email/WhatsApp/push are shown "Not connected" — never faked. |
| **Demo Mode data** | Per-browser `localStorage` stores that mirror the gated Supabase schema + RLS exactly. |

Full separation is in `docs/FINAL_PRODUCT_STATUS.md`.

---

## Fallback if something misbehaves during judging

- **The whole app runs in Demo Mode** — there is no external dependency to fail. If a screen looks empty, it's an honest empty state (no data yet), not an error.
- **Data is per-browser.** If you want a clean slate, use a fresh browser profile or clear site data for `localhost:3000`.
- **If a page ever errors,** the branded error boundary shows a calm "Try again" — click it, or navigate home; the demo continues.
- **To re-see a placed order as a supplier,** make sure you switched roles on the **same** demo account (same email).
- **Quickest reliable path** if time is short: run only the **3-minute AI Designer flow** — it's the strongest single moment and needs no role switching.
