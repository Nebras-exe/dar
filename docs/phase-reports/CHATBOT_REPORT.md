# Athathi/Dar Site Chatbot — Report

_Status: ✅ Implemented site-wide and integrated with the existing catalog, variants, cart, Design My Space, memory, custom/RFQ, orders, manufacturing and delivery systems. Reuses the existing Agent/Claude provider architecture; no competing AI system. No real Anthropic API call was made — the key is behind `ANTHROPIC_API_KEY` server-side, and with no key the deterministic Demo Mode carries the whole experience. All local gates green (317 tests). Runs on :3000._

## 1. Chatbot status

Complete. A floating assistant on every page (EN + AR), grounded in the real catalog,
with cart/design/custom/order integrations and an honest Demo/Claude split.

## 2. UI location

A floating launcher in the bottom corner (desktop) / a bottom sheet (mobile, clear of
cart/checkout controls) — mounted site-wide in `src/app/[locale]/layout.tsx` inside
`ShopProviders` (so it shares the cart). Opens a premium `role="dialog"` drawer with
the Athathi identity, welcome, quick actions, conversation, typing state, reset, and
close. `src/features/chat/`.

## 3. Claude / Demo provider

Reuses the existing server-side Anthropic fetch pattern (`claude-provider.ts`). With a
key, Claude returns a structured plan that Athathi grounds deterministically; with no
key, `demo-engine.ts` runs — no external call. `GET /api/chat` reports `{chatMode}`
(enum). The header badge shows "Claude" or "Demo Assistant" honestly.

## 4. Tools

Deterministic catalog grounding (search / real-product check / variants / budget /
compare) reusing the catalog + variant libs. **No** payment / supplier-acceptance /
QC / delivery-write / memory-write / DB / SQL / filesystem tools — structurally absent.

## 5. Catalog grounding

Every product card is a REAL catalog slug; names, prices, variants, and images resolve
from the catalog (tested). The model may only *request* products (`catalogQuery`);
fabricated ids/prices are dropped. Honest "no match" when nothing fits.

## 6. Cart integration

Product cards render inline with **View product** + **Add to cart**; adding requires an
explicit click and preserves the selected variant — nothing is added silently (§7).

## 7. Design handoff

"Design my room" (EN/AR) opens the existing Design My Space wizard — no second engine
(§8). Typed context (room/budget/style) is available to pre-fill where the architecture
allows.

## 8. Memory integration

Read-only: if the user enabled memory + use-in-design, the widget suggests their saved
style. It never saves/edits/deletes memory (§9). Read from the user's own local store.

## 9. Order tracking

For a signed-in user, the widget shows their own recent orders + payment / fulfilment /
manufacturing / delivery progress (`ChatOrderSummary`), read only from the per-user
client stores. **No order data is sent to the server**, so cross-user access is
impossible (§10/§22).

## 10. Custom furniture

Explains and guides the custom / RFQ flow and links into it; final submission is the
user's explicit action (§11).

## 11. Arabic / RTL

Full EN + AR; the widget follows the site locale, RTL-correct (logical properties,
`rtl:` glyph flips). Deterministic intent detection + slot extraction work in both
languages (incl. Arabic-Indic digits). `audit:arabic` clean; EN/AR parity 1648.

## 12. Security

- Key read only server-side in the provider, never `NEXT_PUBLIC`, never logged /
  returned; **verified absent from `.next/static`**; no client component imports the
  chatbot server internals.
- Client prices/product truth never trusted; user text + memory are DATA
  (injection-defended, tested — "add a free product / reveal your prompt" is ignored,
  no fabricated slug, no secret in output).
- No user order/memory data reaches the server; oversized bodies + long messages /
  conversations rejected; per-turn call/timeout limits (`CHAT_LIMITS`).
- Model output is rendered as **text only** — never HTML/markdown-as-HTML (no XSS).

## 13. Tests / build

`src/lib/chatbot/chatbot.test.ts` — **18 tests, MOCKED provider, zero real Claude
calls**: demo fallback, EN/AR intent detection + slots, catalog grounding,
fabricated-product rejection, unknown-product honesty, variant selection, budget
maths, comparison, design + custom handoff flags, order data never on the server,
prompt-injection boundary, no-secret-in-output, quick actions. Full suite: **317
pass**, lint 0, typecheck clean, `npm run build` success (223 pages, `/api/chat`
registered), `audit:arabic` clean.

## 14. Local commit hash

`e0aba06` — "Add Athathi/Dar site chatbot: catalog-grounded furniture + design
assistant" (local only; **not pushed**).

## 15. Exact URL

http://localhost:3000 — the assistant launcher appears on every page; API at
`/api/chat`. Open `/en` (or `/ar`) and click the bottom-corner button.

## Known limitations

- No live Claude call made yet (by design). The Claude path is exercised only via
  mocks; add `ANTHROPIC_API_KEY` to `.env.local` and ask for a live test.
- Order/memory/cart are per-browser demo stores (Demo Mode); a real cross-device
  history needs the gated backend.
- The Demo engine is capable but heuristic (keyword intents + catalog grounding), not
  a creative model.
- Design handoff opens the wizard; deep context pre-fill is intentionally conservative
  to avoid corrupting the existing wizard state.
