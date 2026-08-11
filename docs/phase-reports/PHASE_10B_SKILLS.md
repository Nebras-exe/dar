# Phase 10B — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md`. Only capabilities that materially improved this payment-architecture phase were used.

## USED

| Skill / capability | Source | What it improved |
| --- | --- | --- |
| **`security-review`** (manual pass) | `~/.claude/skills/security-review/` | The centrepiece. Drove every hard invariant: server/order amount authority (`assertOrderAmount`, body-amount ignored), idempotency (`unique(order_id)` + `findReusableIntent`, paid never re-created), client-untrusted verification (`paid` only via `provider.verify()` + status machine), safe transitions (`paid → pending` impossible), owner-only + supplier-safe visibility, Agent read-only, no-secret-to-client route hygiene, and the §28 verification matrix in the report. |
| **`database-schema`** (know-how) | `~/.claude/skills/database-schema/` | `payment_intents` / `payment_attempts` / `payment_events` design: `amount numeric(12,3)` snapshot, **safe-only** `provider_reference` (never card data/token), `idempotency_key`, `unique(order_id)`, `unique(provider,event_id)` webhook dedupe, and the RLS split in `0009` (owner-all intents; supplier status-read; attempts owner-only; events service-role only). |
| **`ui-ux-pro-max`** (plugin 2.5.0) | `~/.claude/plugins/cache/ui-ux-pro-max-skill/` | Payment-surface UX: a trustworthy, honest "demo payment" page — clear amount-due card, explicit no-card/no-money notice, a two-step pay → verify flow modelling a real hosted gateway, and a proper receipt — rather than a fake card form. |
| **`frontend-design`** (built-in + plugin) | `~/.claude/plugins/.../frontend-design/` | Kept the payment page, receipt, and status chips within the established Athathi system (warm, calm, supplier-grouped), with restrained state/loading treatment and a success receipt that reads as considered, not templated. |
| **`web-design-guidelines`** (Vercel) | `~/.claude/skills/web-design-guidelines/` | A11y/RTL QA: `role="status" aria-live="polite"` for the live status, a real `<fieldset>`/`<legend>` + radios for the demo outcome, payment status as text+icon (never colour-only), `<dl>` receipt, `dir="ltr"` islands for reference/amount, focus-visible, `aria-hidden` icons. |
| **`vercel-react-best-practices`** (know-how) | `~/.claude/skills/vercel-react-best-practices/` | The API routes are `nodejs`/`force-dynamic`, auth-guarded, returning safe codes; the pure payment domain (`intent`/`status-machine`/`authorization`) runs identically in the client store, a server route, or a Node test — one set of invariants, three call sites. |
| `node:test` + `audit:arabic` | repo | 14 new domain tests (offline, deterministic); Arabic guard after adding 49 payment keys. |

## NOT USED — and why

| Skill / capability | Why not |
| --- | --- |
| **Stripe / PayTabs / provider SDK skills** | No certified gateway is configured in this environment and the prompt forbids faking one. The architecture is provider-agnostic (`PaymentProvider` + empty `REAL_PROVIDERS`); wiring a real SDK is a one-file add-on, out of scope here. |
| **Live browser tooling** (`claude-in-chrome`, Playwright MCP) | Not connectable/scoped this session (documented in Phases 09.5/09.6). QA via real server-rendered HTTP + code review + tests; not faked. |
| **`higgsfield` image generation** | The payment flow needs no imagery. |
| **`localize` (full pipeline)** | 49 keys added directly + guarded by `audit:arabic` + the i18n parity test; a full pipeline run was unwarranted. |
| **`seo-audit` / `schema-markup`** | The payment page is `robots: index:false` (private) — SEO is out of scope. |
| Vendor `*-automation`, game, media skills | Irrelevant to a payment layer. |

## Subagents

Not spawned. The prompt permitted subagents for payment/security/schema/UX/tests/review; the work stayed coherent in one context and every review pass (security invariants + §28 matrix, RLS mirror, a11y/RTL, 14 unit tests + gate suite) was completed inline. The payment domain, routes, RLS, and threat matrix are documented in `docs/PAYMENT_ARCHITECTURE.md` + this report for an independent review pass when a real gateway / Supabase project is available.
