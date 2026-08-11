# Phase 09 — Skills Used

Per §2, all available skills / agents / MCP servers were inspected, and every one
that materially improved Phase 09 was used. Skill names were not invented.

## Skills discovered (relevant)

- `frontend-design` — the multi-step custom flow + quote comparison.
- `code-review`, `security-review` — quality + authorization/RLS passes.
- `claude-in-chrome` — browser automation for live QA.
- `claude-api` — structured-extraction / agent-tool contract reference.
- Marketplace/ecommerce/Supabase-adjacent automation skills exist in the catalog,
  but none provides a credentialed, connected backend or a linguistic Arabic
  service in this environment; those parts were done with native capability.

## Skills actually used

| Skill | Why |
| --- | --- |
| **`frontend-design`** | Loaded before building the custom experience, the category-specific spec form, the supplier match cards, and the quote comparison. Applied **within the established Athathi warm-light system** (the phase requires reusing components, not a new look) — so the RFQ flow feels like Athathi, and the comparison avoids a single opaque "AI score" in favour of transparent, readable fields. |

## Native Claude Code capabilities used

- **Database / RLS architecture** — the `custom_requests` / `rfq_recipients` / `quotes` / `supplier_capabilities` schema + Row Level Security policies (recipient/membership-scoped, `security definer` helpers) authored directly as migration SQL, extending the Phase 08 model.
- **Structured extraction (deterministic)** — `extractSpecFromText` reuses the Phase 05 colour/material mappers and adds EN + Arabic parsing of stated facts only (never image-inferred measurements), following the `claude-api` structured-output contract for when a real provider is configured.
- **Security review** — a manual ownership/authorization + secret-leak pass: pure RLS-mirror rules (`authorization.ts`) unit-tested, `.next/static` grep for the service-role key, fake supplier/request-id rejection, negative/absurd-value bounds.
- **Testing** — Node's `node:test` runner (project convention): 24 new deterministic tests over the whole domain, **no external calls**.
- **Arabic safeguard** — `npm run audit:arabic` (Phase 08.1) run after adding ~230 translations; EN/AR parity + placeholder checks via the `i18n.test.ts` guard.
- **HTTP/render verification** — `curl` route + `dir="rtl"` + correct-Arabic + zero-reversed checks against the running app (browser extension unavailable).

## Subagents

The prompt authorized subagents for schema/security/UX/test/code review. The work
stayed coherent in one context and the review passes (authorization, RLS mirror,
determinism, validation, RTL) were completed inline with 140 unit tests + the live
HTTP matrix, so no subagent was spawned (avoiding cold-start re-derivation). The
RLS + authorization design is documented in `docs/DATABASE.md` and
`docs/RFQ_WORKFLOW.md` for an independent review when a Supabase project exists.

## Unavailable capabilities & fallbacks

- **Live Supabase backend** — no credentials; the DB/RLS paths are built + gated,
  not live-exercised. Per §47 this was **not faked**: Demo Data Mode runs, the
  migrations + RLS are ready, and two env vars activate the backend.
- **`claude-in-chrome` browser automation** — the extension did not connect (as in
  Phases 04–08.1). Live device rendering was unavailable and not faked; the
  fallback was the all-route HTTP matrix + render checks + 24 unit tests + RTL code
  review, documented as a limitation.
