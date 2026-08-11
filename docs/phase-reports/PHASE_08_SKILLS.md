# Phase 08 — Skills Used

Per §2, all available skills / agents / MCP servers were inspected, and every one
that materially improved Phase 08 was used. Skill names were not invented.

## Skills discovered (relevant to this phase)

- `frontend-design` — distinctive, production-grade frontend implementation.
- `code-review`, `security-review` — quality + security passes.
- `claude-in-chrome` — browser automation for live QA.
- `claude-api` — Claude/Anthropic + general REST integration reference.
- Many vendor-automation skills (Supabase-adjacent ecosystem, auth providers) —
  inspected. None provides a **credentialed, connected Supabase project** in this
  environment, so none were wired in (a real backend needs real credentials, which
  are absent — see below). No skill named specifically "Supabase schema/RLS
  architecture" exists in the catalog; that work was done with native capability
  guided by the Supabase/PostgreSQL docs conventions.

## Skills actually used

| Skill | Why |
| --- | --- |
| **`frontend-design`** | Loaded before building auth pages, the account, the supplier marketplace, and the dashboard/product form. Its rigor (hierarchy, spacing, restrained motion, honest copy) was applied **within the established Athathi warm-light design system** — §22/§515 require reusing the existing components, not a new SaaS look — so the dashboard and auth screens feel like Athathi, not a template. |

## Native Claude Code capabilities used

- **Database architecture** — the full PostgreSQL/Supabase schema, enums, triggers, indexes, and **Row Level Security** policies (with `security definer` helpers) were authored directly as migration SQL, following Supabase conventions (`auth.users`, `auth.uid()`).
- **Auth (no SDK)** — GoTrue via **server-side `fetch`**, matching the project's established provider pattern; httpOnly cookie sessions via `next/headers`.
- **Security review** — a manual authorization + secret-leak pass: server-side membership guards, RLS mirror, `.next/static` grep for the service-role key / GoTrue tokens / session internals, and a live crafted-cookie authorization matrix.
- **Testing** — Node's built-in `node:test` runner (project convention): 21 new tests for repository/validation/slug/authorization, **no real backend writes**.
- **`claude-api` knowledge** — informed the GoTrue REST request/response shape.
- **HTTP verification** — `curl` route + session + authorization matrix against the running app (used because the browser extension was unavailable).

## Subagents

The prompt (§2) authorized subagents for schema/security/UX/architecture/test/code
review. Given the work stayed coherent in a single context and the review passes
(authorization, RLS, secret-leak, validation) were completed inline with the live
HTTP matrix + 111 unit tests, no subagent was spawned — the reviews were performed
directly rather than adding cold-start overhead. The RLS + authorization design is
documented in `docs/DATABASE.md` and `docs/SUPPLIER_MODEL.md` for an independent
review pass when a Supabase project is available.

## Unavailable capabilities & fallbacks

- **Live Supabase backend.** No project URL/keys are configured, so the DB/RLS/
  GoTrue paths are **built and gated** but not live-exercised. Per §3/§48 this was
  **not faked**: Demo Data Mode is the running mode, the migrations + RLS are ready
  to apply, and setting two env vars activates the backend with no code change.
- **`claude-in-chrome` browser automation.** The extension did not connect (as in
  Phases 04–07). Live device emulation/click-through was unavailable and not faked;
  the fallback was the all-route HTTP matrix + a crafted-cookie authorization matrix
  + responsive/RTL code review.
