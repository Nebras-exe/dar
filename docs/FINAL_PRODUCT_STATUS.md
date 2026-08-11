# Athathi — Final Product Status

An honest map of what is **competition-ready** vs **demo-only** vs **architecture-ready** vs
**future**, per capability. Nothing demo is called production. Everything runs today with
**zero external services and zero credits**.

Legend:
- **COMPETITION-READY** — real product logic, polished, demonstrable end-to-end today.
- **DEMO-ONLY** — a deterministic Demo provider stands in for a future external service; the
  logic and UX are real, the provider is not.
- **ARCHITECTURE-READY** — the interface/adapter + gated DB schema/RLS exist; wiring a real
  provider is additive and doesn't change the product surface.
- **FUTURE** — roadmap; not built.

---

## Discover & design

| Capability | Status | Notes |
|---|---|---|
| Furniture catalog (79 demo products, 15 categories) | **COMPETITION-READY** | Pure typed catalog; search/facets/sort; SVG "studio" product art. Clearly-labelled demo catalog. |
| Product detail (gallery, dimensions, materials, colours, customization) | **COMPETITION-READY** | — |
| AI Designer wizard (room → budget → style → existing → analysis → tiers) | **COMPETITION-READY** | Catalog-grounded; budget computed in code; three deterministic tiers. |
| Room photo analysis (vision) | **DEMO-ONLY** / ARCHITECTURE-READY | Honest Demo analysis (photo never uploaded); real provider behind `src/lib/vision` when a key is set. Never claims to detect furniture from the photo. |
| Before/After visualization | **DEMO-ONLY** / ARCHITECTURE-READY | Deterministic Demo Preview over the room photo (stays in-browser); `REAL_PROVIDERS` empty — no faked AI render. |
| AI Agent (adjust design / budget / replace) | **COMPETITION-READY** (Demo Agent) / ARCHITECTURE-READY (LLM) | Deterministic Demo Agent handles judge intents with no key; LLM path exists behind the same interface. Read-only on all operations. |
| User memory / personalization | **COMPETITION-READY** | Opt-in, editable, deletable; stores only design context; safe agent context. |
| Agent follow-up (next-action) | **COMPETITION-READY** | Deterministic priority engine over real order state; recommend-only. |

## Buy

| Capability | Status | Notes |
|---|---|---|
| Cart + favourites | **COMPETITION-READY** | — |
| Unified checkout (cart + accepted quote) | **COMPETITION-READY** | Server-authoritative totals; Oman address. |
| Payment | **DEMO-ONLY** / ARCHITECTURE-READY | **Demo Payment** — provider-agnostic; server amount authority; idempotency; no card fields. A certified gateway drops in without touching checkout. |
| Custom furniture RFQ (spec → suppliers → quotes → accept) | **COMPETITION-READY** | Deterministic Demo Quotes; transparent comparison; real supplier matching. |

## Fulfil

| Capability | Status | Notes |
|---|---|---|
| Supplier acceptance + fulfillment | **COMPETITION-READY** | Per-supplier state machine; auditable events. |
| Custom manufacturing + quality check | **COMPETITION-READY** | Production milestones + a real QC checklist + rework loop; append-only QC history. |
| Delivery + installation + tracking | **DEMO-ONLY** / ARCHITECTURE-READY | Real state machines + customer tracking; **Demo Delivery Team**, no courier/GPS. |
| In-app notifications | **COMPETITION-READY** | Real per-user feed, deduped, deep links. Email/WhatsApp/push = **FUTURE** (shown "Not connected"). |

## Platform

| Capability | Status | Notes |
|---|---|---|
| Bilingual EN/AR, full RTL | **COMPETITION-READY** | Structural RTL; `audit:arabic` guard + parity test. |
| Auth + account | **COMPETITION-READY** (Demo) / ARCHITECTURE-READY (Supabase) | Demo local session; GoTrue path gated. |
| Supplier marketplace + dashboard | **COMPETITION-READY** | Marketplace pages + a real supplier workspace (9 tabs). |
| Accessibility (keyboard, focus, aria, reduced-motion, text+icon) | **COMPETITION-READY** | — |
| Responsive (390/768/1024/1440) | **COMPETITION-READY** | Logical properties; no horizontal overflow by design. |
| SEO / social metadata | **COMPETITION-READY** | Titles, descriptions, OG/Twitter, canonical + `hreflang` (en/ar). OG **image** = ARCHITECTURE-READY. |
| Branded 404 / error boundary | **COMPETITION-READY** | Bilingual, in-shell; demo never shows an unstyled crash. |
| Persistence | **DEMO-ONLY** (localStorage) / ARCHITECTURE-READY (Supabase) | 19 migrations + RLS exist and are gated; demo stores mirror the schema. |

---

## Backend / data mode

- **Running mode:** Demo Mode — per-browser `localStorage` stores, deterministic demo data, no cloud.
- **Supabase:** the full schema (`supabase/migrations/0001`–`0019`) + Row Level Security exist and are **gated** (no project configured). Setting the public + service env vars flips `backendMode()` to Supabase; the pure domains + RLS mirrors already match.

## External integrations — all FUTURE (interfaces exist today)

| Integration | Interface today | Status |
|---|---|---|
| Real LLM (Anthropic/OpenAI/Gemini) | `src/lib/agent/providers/*`, vision, visualization | FUTURE (keys later) |
| Real payment gateway | `src/lib/payments/providers` (empty `REAL_PROVIDERS`) | FUTURE |
| Real courier / logistics + GPS | `DeliveryProvider` + demo assignment | FUTURE |
| Email / WhatsApp / SMS / push | `NotificationSink` (in-app only connected) | FUTURE |
| Real Supabase project | migrations + RLS + repository adapter | ARCHITECTURE-READY |

## Roadmap (explicitly NOT built)

AR / camera overlay · LiDAR room capture · advanced 3D · real payment provider · real logistics
& tracking · full B2B procurement · GCC multi-market expansion.

---

## Zero-credit guarantee

Athathi consumes **no paid credits and makes no external API calls** in any mode it ships in.
Every "AI", "payment", "delivery", and "notification" capability shown is either real local
product logic or a clearly-labelled deterministic Demo provider. External providers are wired
later behind the interfaces above.
