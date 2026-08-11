# Phase 11B — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md`. Only FREE/local capabilities that materially improved this manufacturing + QC phase were used. **Every skill below consumed 0 paid credits** — none call an external/billable service. Higgsfield and every paid AI/API/MCP were deliberately NOT used (§0 zero-credit rule).

## USED

| Skill / capability | Source | What it improved | Paid credits |
| --- | --- | --- | --- |
| **`security-review`** (manual pass) | `~/.claude/skills/security-review/` | The centrepiece. Drove every invariant: custom-only + fulfillment-ready creation gate (`canCreateManufacturing` + `assert_custom_and_ready` trigger), per-supplier isolation (A can never read/mutate B), customer-never-writes, safe state machine (no skipped/regressed steps, QC-pass gate, ready-for-delivery gate), append-only QC history (a failed inspection is never overwritten), quality-issue descriptions supplier-only, agent read-only, and the §27 abuse matrix in the report + tests. | 0 (local reasoning) |
| **`database-schema`** (know-how) | `~/.claude/skills/database-schema/` | `manufacturing_jobs` (one per `order_group_id`, references the snapshot + fulfillment, custom+ready insert trigger) + `manufacturing_events` (append-only) + `quality_checks` (`unique(job_id, attempt)` — no overwrite) + `quality_issues`, and the `0013` RLS split (customer read-own; supplier read/update/insert own-only; events append-only; issue descriptions supplier-only). | 0 |
| **workflow / state-machine design** (via `security-review` + domain modelling) | local reasoning | The deterministic manufacturing + QC + rework machine (`status-machine.ts`) with an explicit failure loop and terminal `ready_for_delivery`; `availableActions` as the single source of truth for the dashboard controls. | 0 |
| **`ui-ux-pro-max`** (plugin 2.5.0) | `~/.claude/plugins/cache/ui-ux-pro-max-skill/` | The manufacturing workspace UX: a stage-grouped job board (To start / In production / Quality check / Needs rework / Ready), a progressive-disclosure job detail (spec → timeline → QC), and a QC checklist + issue flow that reads like a considered furniture studio tool, not a generic ERP. | 0 (local CLI/templates) |
| **`frontend-design`** (official plugin) | `~/.claude/plugins/.../frontend-design/` | Kept the job cards, spec panel, QC history, and customer manufacturing timeline within the established Athathi identity (warm, restrained, furniture-first) — refined, not templated. | 0 |
| **`web-design-guidelines`** (Vercel) | `~/.claude/skills/web-design-guidelines/` | A11y/RTL QA: `<fieldset>`/`<legend>` + checkboxes for QC criteria & milestones, labelled selects/radios/textarea for issues, timeline as an ordered list with text + icon (never colour-only) + "Current" chip, `role="status"` review notes, logical properties + `rtl:` flips, focus-visible. | 0 |
| **`vercel-react-best-practices`** (know-how) | `~/.claude/skills/vercel-react-best-practices/` | The pure manufacturing domain runs identically in the demo `localStorage` store, a future server route, and Node tests — one set of invariants, three call sites. Create-on-open in a guarded effect; the store composes cleanly with the fulfillment + order stores. | 0 |
| **`localize`** (approach) + `audit:arabic` | `~/.claude/skills/localize/` + repo | 121 bilingual keys added in logical Unicode + guarded by `audit:arabic` and the i18n parity test (EN/AR 1352 leaves each). | 0 |
| **`testing-strategies`** + `node:test` | `~/.claude/skills/testing-strategies/` + repo | 25 offline, deterministic manufacturing/QC tests (transitions, QC pass/fail, rework, history, guards, isolation, agent boundary, notifier, §27). No external/paid calls. | 0 |

## NOT USED — and why

| Skill / capability | Why not |
| --- | --- |
| **Higgsfield / any media generation** | Would consume credits (§0). The phase needs no imagery. **Not called.** |
| **OpenAI / Anthropic / Gemini APIs, paid MCP, Composio** | Billable. The Agent runs as the deterministic Demo Agent; the manufacturing notifier is a local Demo/Log adapter. **Not called.** |
| **`playwright` MCP / `webapp-testing`** (browser QA, §34) | The Playwright MCP is scoped to another project and no free/local browser was connectable this session. Per §34, browser QA was **not faked** — verification was real server-rendered HTTP + code review + 221 tests. (Would be free if available; the exclusion is availability, not cost.) |
| **`seo-audit` / `schema-markup`** | Supplier/manufacturing/order pages are `robots: index:false` (private) — out of scope. |
| **Email/SMS/WhatsApp/push providers** | External + billable. Replaced by the `ManufacturingNotifier` Demo/Log adapter that records but never sends (§24). |

## Subagents

Not spawned. The work stayed coherent in one context and every review pass (security invariants + §27 matrix, RLS mirror, a11y/RTL, 25 unit tests + full 221-test regression + gate suite) was completed inline. The manufacturing domain, migrations, RLS, and threat matrix are documented in `docs/MANUFACTURING_WORKFLOW.md` + the phase report for an independent review pass when a Supabase project is available.

## Zero-credit confirmation

**External paid credits consumed: 0.** No purchases, no subscriptions, no real messages, no real AI generation, no real payment transactions, no external AI/API calls.
