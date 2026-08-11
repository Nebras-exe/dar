# Athathi / Dar — Site Chatbot

A dedicated **furniture + interior-design assistant** embedded across the whole
Athathi site. It reuses the existing catalog, variants, cart, Design My Space flow,
user memory, orders, manufacturing, and delivery systems — it is **not** a second AI
system, and it never becomes the source of truth (the model plans; deterministic
Athathi code grounds every product, price, and variant).

## Architecture

```
Floating button (every page) → premium chat drawer (src/features/chat/chat-widget.tsx)
        │  POST /api/chat  { locale, messages, context }     (no user order/memory data)
        ▼
runChat (src/lib/chatbot/service.ts)
  ├─ Claude configured?  → claude-provider.ts (Messages REST, server-only key)
  │                          returns a PLAN { intent, reply, catalogQuery? }
  │                          → grounded deterministically (real catalog slugs only)
  └─ else / on failure   → demo-engine.ts (deterministic intents + grounding)
        ▼
ChatResponse { mode, intent, message, cards[], actions[], flags, cartProposal? }
        ▼
Widget renders: text bubble + real ChatProductCard[] + quick actions + client-side
  follow-ups (order summary / memory / design + custom handoffs)
```

**Key split (privacy by design):** the server only ever sees the conversation text
+ safe context (a budget/style the user typed). **Order, manufacturing, delivery,
memory, and cart data never leave the browser** — the widget reads the user's own
per-user local stores directly and renders them client-side, so cross-user access is
structurally impossible.

## Modules (`src/lib/chatbot/`)

| File | Role |
|---|---|
| `types.ts` | Client-safe contracts (`ChatMessage`, `ChatResponse`, `ChatIntent`, `ProductCardRef`, `QuickAction`, `ChatFlags`, `ChatRequest`). |
| `config.ts` | The ONE place for the model default + `CHAT_LIMITS` (messages/chars/calls/cards/timeout). |
| `intents.ts` | Deterministic EN + AR intent detection + slot extraction (category/style/colour/material/budget) over the real taxonomy. |
| `prompts.ts` | Versioned, injection-defended system prompt (Athathi/Dar identity; user text = DATA). |
| `tools.ts` | Deterministic catalog grounding (search / real-product check / variants / budget) — reuses the catalog + variant libs. |
| `demo-engine.ts` | Deterministic response builder — the no-key default + fallback. |
| `claude-provider.ts` | **Server-only** Claude planner (fetch; reads the key here only; never logs/exposes/returns it; no call at build/test time). |
| `service.ts` | `runChat()` — provider selection, grounding, bounded, never throws. |
| `index.ts` | Client-safe barrel (types + demo helpers only). |

## Tools + permissions

The assistant can (via deterministic grounding): search the catalog, get a product,
get variants, compute a budget, compare products, propose an add-to-cart, guide into
Design My Space / Custom-RFQ, and (client-side) summarise the signed-in user's own
orders/manufacturing/delivery. It **cannot**: confirm payment, accept a supplier
order, pass/fail QC, mark a delivery complete, write memory, run DB admin / SQL, or
touch the filesystem — those tools are structurally absent.

## What's grounded vs. what the model does

- **Model (Claude or Demo intents):** understands the request, writes the reply, and
  may *request* products via `catalogQuery`.
- **Deterministic code:** turns that query into REAL catalog slugs; resolves names,
  prices, variants, and images from the catalog; computes budgets in exact OMR. The
  model can never state a product id/price/variant — a fabricated one is dropped.

## Cart, design, custom, memory, orders

- **Cart:** the assistant surfaces product cards with an add-to-cart button; adding
  requires an **explicit click** and preserves the selected variant. Nothing is added
  silently.
- **Design handoff:** "design my room" opens the existing Design My Space wizard (no
  second engine); typed context can pre-fill where the architecture allows.
- **Custom / RFQ:** guides the user toward the custom-furniture flow; final submission
  is the user's explicit action.
- **Memory (read-only):** if the user enabled memory + use-in-design, the widget may
  suggest their saved style ("Your saved style leans Modern · Walnut…"). It never
  saves/edits/deletes memory.
- **Orders:** for a signed-in user, the widget shows their own recent orders +
  payment/fulfilment/manufacturing/delivery progress, read from their local stores
  only.

## Bilingual + accessibility

Full EN + AR (RTL); the widget uses the current site locale. Accessible: a labelled
launcher, a `role="dialog" aria-modal` drawer with a focus trap + return, Escape to
close, `aria-live` conversation, labelled quick actions, and keyboard-operable
composer. Responsive: a bottom sheet on mobile (clear of cart/checkout controls), a
corner panel on desktop.

## Claude provider + Demo mode

Uses the shared `ANTHROPIC_API_KEY` (server-side only; same key as the vision/agent/
interior providers). With no key, the deterministic Demo engine carries the whole
experience — no external call. The header badge shows "Claude" or "Demo Assistant"
honestly. See `docs/CLAUDE_API_SETUP.md`.

## Security + cost controls

- Key read only in `claude-provider.ts`, sent only in `x-api-key`, never logged /
  returned / exposed; verified absent from `.next/static`.
- Client prices/product truth never trusted; user text + memory are DATA
  (injection-defended); no user order/memory data is sent to the server.
- Bounded per turn (`CHAT_LIMITS`): message length, conversation length, max Claude
  calls, max cards, timeout. Oversized bodies rejected.
- Model output is rendered as **text only** — never as HTML/markdown-as-HTML (no XSS).
- Tests mock the provider; **no real Claude call is ever made** in tests or the build.

## History

Session history is capped (`athathi.chat.v1`, last 20 turns) in `localStorage`, with
"New conversation" to clear it. Deleted chat is not durable memory.
