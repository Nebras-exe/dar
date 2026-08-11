# أثاثي · Athathi

**An AI interior & furniture marketplace for the Sultanate of Oman** — bilingual (Arabic RTL + English LTR), warm and editorial.

Athathi turns a room photo, a budget, and a taste into a real, budget-aware furniture design — built from products that genuinely exist in the catalog. It is not "a furniture store with AI"; it helps a customer **decide, design, budget, and buy an entire space**.

> Core principle: **REAL ROOM · REAL BUDGET · REAL PRODUCTS · AI.** Recommendations always resolve to a real catalog product with a real OMR price — never an invented render. Demo/sample content is always clearly labelled.

---

## What's inside

- **Catalog & shop** — a pure, typed catalog layer (~80 clearly-labelled demo products), URL-driven search / filters / sort, product detail pages, a local cart + favourites.
- **AI Room Designer** (`/design`) — a guided wizard → budget-aware, catalog-backed design plan across three tiers.
- **Room analysis (Vision)** — optional, consent-gated room-photo analysis that pre-fills the wizard (provider-agnostic; honest demo fallback).
- **AI Agent** — a tool-using assistant that adjusts the current design in natural language (EN + AR); the LLM orchestrates, deterministic code validates, the catalog is truth, the user approves the cart.
- **Before/After visualization** — a design preview over the room, with a deterministic "stale" state; never claims exact scale/fit.
- **Backend, auth & supplier marketplace** — a Supabase-ready schema + migrations + Row Level Security, an email/password auth foundation, a customer account, a public supplier marketplace, and a supplier dashboard with product CRUD.
- **Custom furniture + RFQ** (`/custom`) — describe a piece → structured spec → matched suppliers → request for quotes → compare → accept (no payment yet).

Everything runs **fully in Demo Mode with zero credentials** — see below.

---

## Stack

Next.js **16** (App Router, React Server Components) · TypeScript (strict) · Tailwind CSS **v4** · lucide-react · self-hosted fonts (Fraunces + Hanken Grotesk + IBM Plex Sans Arabic). No UI library — a custom warm design system. AI providers are called via **server-side `fetch` (no SDK)**.

---

## Prerequisites

- **Node.js ≥ 20** (developed on Node 24) and npm.
- No cloud account is required to run the app — it works in Demo Mode out of the box.

---

## Getting started

```bash
git clone <this-repo-url> athathi
cd athathi
npm install
npm run dev            # http://localhost:3000 → redirects to /en or /ar
```

Open **http://localhost:3000**. That's it — no environment variables are needed for Demo Mode.

---

## Environment setup

All backend/AI features are **optional**. Copy the template and fill in only what you want to enable:

```bash
cp .env.example .env.local
```

`.env.example` documents every supported variable (all commented out by default):

| Area | Variables | Effect when set |
| --- | --- | --- |
| Vision / Agent / Visualization (LLM) | `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` (+ optional `ATHATHI_*_PROVIDER` / `_MODEL`) | Enables real room analysis + the LLM agent path. Without them, the app uses labelled demo/manual fallbacks. |
| Backend (Supabase) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Switches the repository from the demo catalog to a real database. |
| Backend (server-only) | `SUPABASE_SERVICE_ROLE_KEY` | Admin/service tasks. **Server-only — never exposed to the browser.** |

**Never commit real secrets.** `.env`, `.env.local`, etc. are git-ignored; only `.env.example` (names + comments, no values) is committed.

---

## Demo Mode (default)

With **no** environment variables set, Athathi runs in **Demo Data Mode**:

- The catalog is the built-in ~80-product sample set (every item flagged `isDemo` with a "Sample" badge).
- Vision → a clearly-labelled sample analysis + manual entry. The room photo never leaves the browser.
- The Agent → a deterministic **Demo Agent** (real catalog tools, no LLM).
- Before/After → a labelled **Demo Preview** composed locally (no image upload).
- Auth → a labelled local session (this browser only). Supplier products, saved designs and RFQ requests live in `localStorage`, clearly labelled.
- RFQ → deterministic, labelled **Demo Quotes**.

Nothing in Demo Mode is presented as real supplier data, real inventory, or a real quote.

---

## Supabase setup (optional)

The complete backend is ready but **dormant** until configured — no live database is required for development.

1. Create a Supabase project.
2. Apply the migrations in order (see `supabase/README.md`):
   ```bash
   supabase db reset          # local dev, applies all migrations
   # or, against a linked project / via psql:
   psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql   # …0002 … 0005 in order
   ```
3. Put `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and server-only `SUPABASE_SERVICE_ROLE_KEY`) in `.env.local`.
4. Restart. `backendMode()` becomes `"supabase"` and the repository serves DB-backed data — no code change.

Row Level Security enforces isolation (customers own their data; a supplier can only manage its own products/RFQs). See `docs/DATABASE.md`, `docs/SUPPLIER_MODEL.md`, `docs/RFQ_WORKFLOW.md`.

> Status in this repo: no Supabase project is bundled — the schema/RLS/migrations are provided and gated. The app is fully functional in Demo Mode.

---

## Scripts

```bash
npm run dev            # start the dev server (http://localhost:3000)
npm run build          # production build
npm run start          # serve the production build
npm test               # node:test — catalog/design/vision/agent/visualization/repository/auth/i18n/rfq (140 tests)
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run audit:arabic   # detector for reversed/corrupted Arabic strings (0 = clean)
```

All of `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run audit:arabic` are expected to pass green. Tests use Node's built-in runner (no test framework) and make **no external/paid API calls** (providers are exercised with mocks).

---

## Important routes

Locale is in the URL (`/en`, `/ar`); every page mirrors in both.

| Route | Purpose |
| --- | --- |
| `/[locale]` | Home |
| `/[locale]/shop` · `/shop/[category]` · `/product/[slug]` | Catalog, category, product detail |
| `/[locale]/cart` | Local cart |
| `/[locale]/design` | AI Room Designer + Agent + Before/After |
| `/[locale]/custom` | Custom furniture + RFQ |
| `/[locale]/login` · `/signup` · `/account` | Auth + customer account |
| `/[locale]/suppliers` · `/suppliers/[slug]` · `/suppliers/apply` | Public supplier marketplace + apply |
| `/[locale]/supplier` | Supplier dashboard (products, inventory, RFQs) |
| `/api/vision/analyze` · `/api/agent` · `/api/visualization/generate` · `/api/auth/session` | Server routes (capability probes + processing) |

---

## Project structure

```
src/
  app/[locale]/…          # locale-scoped routes (sets <html lang dir>)
  app/api/…               # server routes (Node runtime; provider keys stay server-side)
  components/{ui,shop,layout,shared}   # design-system primitives + shared components
  features/{home,shop,cart,favorites,design,custom,supplier,account,auth}  # feature UIs
  lib/
    catalog/    # pure, framework-free catalog (source of product truth)
    design/     # design recommendation engine (Phase 04)
    vision/     # provider-agnostic room analysis (Phase 05)
    agent/      # tool-using agent + allowlisted tool registry (Phase 06)
    visualization/  # before/after preview (Phase 07)
    backend/ repository/ auth/   # backend mode, repo adapter, auth (Phase 08)
    rfq/        # custom furniture + RFQ (Phase 09)
  i18n/         # typed dictionaries (en.json = source of truth; ar.json must match)
supabase/migrations/      # SQL schema + RLS + demo seed
scripts/                  # ts test resolver, arabic audit, offline art preview
docs/                     # architecture, database, design system, phase reports
```

Business logic in `lib/` is framework-agnostic and covered by tests, so the same code runs in a server component, a route handler, or a Node test.

---

## Collaboration workflow

- **Branch** off `main` for changes; open a PR. Don't commit to `main` directly.
- **Before pushing**, run the full gate suite: `npm run audit:arabic && npm test && npm run lint && npm run typecheck && npm run build`.
- **Bilingual parity:** `en.json` defines the dictionary shape; `ar.json` must satisfy it (a missing key is a compile error). Keep placeholders (`{count}`, `{total}`, …) identical across locales. Write Arabic in **logical Unicode order** — never reverse text manually (RTL is handled by `dir`/CSS). `npm run audit:arabic` guards this.
- **Money** is numeric OMR (3 decimals) throughout — never store formatted strings.
- **Secrets** never enter the client bundle or the repo; only `.env.example` is committed.
- Conventional, descriptive commit messages.

---

## Documentation

See `docs/` — `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `DATABASE.md`, `SUPPLIER_MODEL.md`, `RFQ_WORKFLOW.md`, `MVP_SCOPE.md`, and per-phase reports under `docs/phase-reports/`.

---

## License & data

Prototype / internal build. All catalog products, suppliers, prices, and imagery are **sample/demo data** — no real inventory, suppliers, ratings, or availability are represented. Generated product artwork is original and offline (no third-party photography).
