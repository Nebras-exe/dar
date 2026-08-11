# Phase 11A — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md`. Only FREE/local capabilities that materially improved this fulfillment phase were used. **Every skill below consumed 0 paid credits** — none call an external/billable service. Higgsfield and every paid AI/API/MCP were deliberately NOT used (§0 zero-credit rule).

## USED

| Skill / capability | Source | What it improved | Paid credits |
| --- | --- | --- | --- |
| **`security-review`** (manual pass) | `~/.claude/skills/security-review/` | The centrepiece. Drove every invariant: paid-only entry (`canCreateFulfillment` + `assert_order_paid` trigger), per-supplier isolation (A can never read/mutate B), customer-never-writes, safe state machine (no skipped/regressed steps), append-only auditable events, decline internal-note never exposed, agent read-only, and the §28 cross-tenant abuse matrix in the report + tests. | 0 (local reasoning) |
| **`database-schema`** (know-how) | `~/.claude/skills/database-schema/` | `fulfillments` (one per `order_group_id`, references the immutable snapshot, paid-gated trigger) + `fulfillment_events` (append-only, `unique(fulfillment_id, type)` dedupe) + the `0011` RLS split (customer read-own; supplier read/update/insert own-only; events append-only). | 0 |
| **`ui-ux-pro-max`** (plugin 2.5.0) | `~/.claude/plugins/cache/ui-ux-pro-max-skill/` | Order-management UX: a calm supplier lifecycle (Accept → Start preparing → Mark ready) with inline confirmation + structured decline, and a premium **per-supplier** customer timeline (current stage explicit, future subdued) rather than a misleading unified bar. | 0 (local CLI/templates) |
| **`frontend-design`** (official plugin) | `~/.claude/plugins/.../frontend-design/` | Kept the supplier card, timeline stepper, status chips, and account summary within the established Athathi system (warm, restrained, supplier-grouped) — considered, not templated. | 0 |
| **`web-design-guidelines`** (Vercel) | `~/.claude/skills/web-design-guidelines/` | A11y/RTL QA: `<fieldset>`/`<legend>` + radios for decline reasons, labelled textarea with `aria-describedby`, `role="group"` accept confirmation, `role="status"` regions, status as text + icon (never colour-only), logical properties + `rtl:` flips, focus-visible. | 0 |
| **`vercel-react-best-practices`** (know-how) | `~/.claude/skills/vercel-react-best-practices/` | The pure fulfillment domain (`fulfillment`/`status-machine`/`authorization`) runs identically in the demo `localStorage` store, a future server route, and Node tests — one set of invariants, three call sites. Create-on-open in an effect, guarded against loops. | 0 |
| **`localize`** (approach) + `audit:arabic` | `~/.claude/skills/localize/` + repo | 71 bilingual keys added in logical Unicode + guarded by `audit:arabic` and the i18n parity test (EN/AR 1231 leaves each). | 0 |
| **`testing-strategies`** + `node:test` | `~/.claude/skills/testing-strategies/` + repo | 28 offline, deterministic fulfillment tests (transitions, idempotency, isolation, snapshot, agent boundary, notifier, §28). No external/paid calls. | 0 |

## NOT USED — and why

| Skill / capability | Why not |
| --- | --- |
| **Higgsfield / any media generation** | Would consume credits (§0). The phase needs no imagery. **Not called.** |
| **OpenAI / Anthropic / Gemini APIs, paid MCP, Composio** | Billable. The Agent runs as the deterministic Demo Agent; the fulfillment notifier is a local Demo/Log adapter. **Not called.** |
| **Live browser tooling** (`claude-in-chrome`, `playwright` MCP) | Not connectable/scoped this session (documented since 09.5). QA via real server-rendered HTTP + code review + 196 tests; not faked. (Free if it were available — the exclusion is availability, not cost.) |
| **`seo-audit` / `schema-markup`** | Fulfillment/supplier/order pages are `robots: index:false` (private) — out of scope. |
| **Email/SMS/WhatsApp/push providers** | External + billable. Replaced by the `FulfillmentNotifier` Demo/Log adapter that records but never sends (§20/§30). |

## Subagents

Not spawned. The prompt permitted subagents for schema/UX/security/tests/review; the work stayed coherent in one context and every review pass (security invariants + §28 matrix, RLS mirror, a11y/RTL, 28 unit tests + full gate suite) was completed inline. The fulfillment domain, migrations, RLS, and threat matrix are documented in `docs/FULFILLMENT_WORKFLOW.md` + the phase report for an independent review pass when a Supabase project is available.

## Zero-credit confirmation

**External paid credits consumed: 0.** No purchases, no subscriptions, no real messages, no real payment transactions, no external AI/API calls.
