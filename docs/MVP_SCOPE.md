# Athathi — Scope by Phase

This document separates the near-term MVP from later ambitions so scope stays honest and the architecture is built to *reach* the later stages without over-building now.

## Phase 01 — Foundation & Design System ✅ (this phase)

- Next.js (App Router) + TypeScript + Tailwind v4 project.
- Design token system (colour, type, spacing, radius, shadow, motion).
- Bilingual architecture: Arabic RTL + English LTR via `/[locale]` routing.
- Premium typography (Fraunces + Hanken Grotesk + IBM Plex Sans Arabic).
- Core reusable UI primitives (Button, Chip, Badge, Input, Card, etc.).
- Header + footer foundation, brand wordmark.
- One polished foundation showcase page proving the visual language.
- Documentation + QA (build, lint, typecheck, rendered inspection).

**Explicitly *not* in Phase 01:** final homepage, shop, catalog, product pages, cart, checkout, AI designer, agent, Supabase, supplier dashboards, before/after, AR/3D.

## Phase 02 — Final Homepage & Product Storytelling (recommended next)

- Editorial marketing homepage (hero, how-it-works, teasers, CTAs, footer).
- Reusable section/marketing components and imagery treatments.
- Motion polish (section reveals, hover states).
- SEO metadata baseline.

## MVP (target — spans Phases 03–06)

1. Home page (done in P02) & responsive navigation.
2. Shop + category architecture (`/shop`, `/shop/[category]`).
3. Product cards + product detail pages (`/product/[slug]`).
4. Demo catalog: 50–100+ structured, clearly-labelled sample products.
5. Basic product customisation (deterministic price config).
6. Cart foundations (`/cart`).
7. AI Room Designer flow (`/design`): image upload → room type → budget → style → preferences.
8. Room analysis **architecture** + **Demo Mode** (honest, labelled).
9. Catalog-backed recommendations with a deterministic scoring/constraint layer.
10. Budget-aware suggestions + budget optimisation.
11. Design result experience + product replacement.
12. **Add Entire Design to Cart.**
13. User dashboard (`/account`: rooms, designs, orders, favourites).
14. Basic supplier dashboard shell.
15. Initial AI agent orchestration over the tool interfaces.

## Phase 07–09 — Delivered beyond the original MVP

- **Phase 07** — Before/After room visualization (provider-agnostic; honest Demo Preview) integrated into the design result.
- **Phase 08** — Backend foundation: Supabase-ready schema + migrations + RLS, an auth foundation (email/password via GoTrue REST + labelled demo session), a customer account, a **public supplier marketplace + dashboard** (products, inventory, customization, analytics), and a catalog repository adapter — all running in Demo Data Mode with no credentials. See `docs/DATABASE.md`, `docs/SUPPLIER_MODEL.md`.
- **Phase 08.1** — Arabic/RTL quality audit + permanent CI guards (`audit:arabic`, i18n tests).
- **Phase 09** — Custom furniture + **RFQ**: idea → structured spec → supplier matching → RFQ → deterministic Demo Quotes → transparent comparison → explicit customer acceptance (no payment). See `docs/RFQ_WORKFLOW.md`, `docs/phase-reports/PHASE_09_REPORT.md`.

## Phase 10+ / Future (architect for, do not build now)

- **Orders + checkout + payment** (**Phase 10**, recommended next) — accepted quote + cart → real orders.
- Inspiration-image style matching.
- Supplier **orders**, leads, and richer analytics (arrive with checkout).
- Manufacturing jobs, delivery/installation logistics, AR/3D/LiDAR (mobile).
- Style profile / taste memory (transparent, user-controlled).
- B2B furnishing (offices, cafes, hotels, Airbnb, clinics).
- AR placement, 3D/360° products, LiDAR room measurement (mobile app).
- Real payments, manufacturing, delivery & installation logistics.

## Guardrails

- Do not implement the whole platform at once.
- Do not fake integrations; build interfaces/abstractions to connect real services later.
- Deterministic business logic validates AI output; the LLM never invents selection logic.
- Always require explicit approval before purchase/order.
