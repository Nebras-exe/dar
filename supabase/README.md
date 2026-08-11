# Athathi — Supabase backend

Phase 08 ships the **complete, Supabase-ready** database foundation. Athathi runs
fully in **Demo Mode** with no backend; these files activate the real backend when
you provide credentials. Nothing here is required to run the app locally.

## Files

- `migrations/0001_init.sql` — schema (enums, tables, indexes, `updated_at` triggers). OMR money is `numeric(12,3)`.
- `migrations/0002_rls.sql` — Row Level Security + `is_supplier_member` / `can_manage_product` helpers.
- `migrations/0003_seed_demo.sql` — categories + demo suppliers/products, all tagged `is_demo = true`.

## Apply

**Supabase CLI (recommended):**

```bash
supabase db reset            # local dev DB, applies all migrations in order
# or against a linked project:
supabase db push
```

**Or via the SQL editor / psql** — run the three files in numeric order:

```bash
psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
psql "$DATABASE_URL" -f supabase/migrations/0002_rls.sql
psql "$DATABASE_URL" -f supabase/migrations/0003_seed_demo.sql
```

## Configure the app

Copy the project URL + anon key into `.env.local` (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server-only; NEVER exposed to the browser
```

With both public vars set, `backendMode()` returns `"supabase"` and the repository
resolves DB-backed active products. Without them, the app stays in Demo Mode.

See `docs/DATABASE.md` for the full schema, RLS rationale, seeding a full catalog,
and the documented future tables (orders, RFQ, …) that are intentionally not built yet.
