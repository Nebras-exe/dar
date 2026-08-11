# Phase 13 — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md`. Only FREE/local capabilities that materially improved this notifications + memory + agent-follow-up phase were used. **Every skill below consumed 0 paid credits** — none call an external/billable service. No AI/API credentials were tested or inspected (§0).

## USED

| Skill / capability | Source / path | Why it was useful | What it improved | Paid credits |
| --- | --- | --- | --- | --- |
| **`security-review`** | `~/.claude/skills/security-review/` | Privacy + personalization is security-critical. | Drove every invariant: opt-in consent (writes are consent-gated no-ops), owner-only memory/notification isolation, suggested ≠ durable, clear ≠ disable, **clear-never-deletes-orders** (store isolation), notification dedupe + forged-source rejection + client-can't-set-priority, agent read-only (`AGENT_CAN_WRITE_MEMORY=false`), prompt-injection boundary (memory/notifications are DATA), and the §39 matrix in the report + tests. | 0 (local reasoning) |
| **`database-schema`** | `~/.claude/skills/database-schema/` | Typed, justified tables — not a generic KV blob (§10). | `memory_consent` + typed `user_memory_preferences` (`unique(user,category,value)`) + `user_memory_budget` (range) + `user_room_memories`; `notifications` with `unique(user_id, source_type, source_id, event_key)` dedupe; owner-only RLS (`0017`/`0019`). | 0 |
| **`ui-ux-pro-max`** | `~/.claude/plugins/cache/ui-ux-pro-max-skill/` | Notification/memory UX must feel personal + calm, not enterprise CRM. | A polished header bell + grouped center (Today/Earlier), a premium memory-settings surface with switches + chips, and a "Continue where you left off" follow-up card — helpful, interior-focused, not notification spam. | 0 (local CLI/templates) |
| **`frontend-design`** | `~/.claude/plugins/.../frontend-design/` | Keep it within the Athathi identity. | The bell dropdown, memory chips, budget editor, seed card, and follow-up rows all read as considered, warm, and restrained — not a settings dashboard. | 0 |
| **`web-design-guidelines`** | `~/.claude/skills/web-design-guidelines/` | A11y is dense here (dialogs, switches, live regions). | `aria-haspopup`/`aria-live` bell, `role="dialog"` center with Escape/click-outside, `role="switch"` toggles, `role="dialog" aria-modal` confirms, labelled chip removes, text+icon (never colour-only), logical properties + `rtl:` flips, `dir="ltr"` for numbers. | 0 |
| **`vercel-react-best-practices`** | `~/.claude/skills/vercel-react-best-practices/` | Cross-store composition + purity. | Pure domains run identically in demo stores, a future route, and Node tests; the notification feed derives + dedupes from existing stores without coupling; fixed a `react-hooks/purity` `Date.now()` with a lazy `useState`; the header stays static-friendly (self-fetch own id only). | 0 |
| **`localize`** + `audit:arabic` | `~/.claude/skills/localize/` + repo | Bilingual parity + natural Arabic. | 114 keys (notifications + 17 event title/body pairs, memory settings, design-memory, follow-up) in logical Unicode; guarded by `audit:arabic` + the i18n parity test (EN/AR 1593 leaves each). | 0 |
| **`testing-strategies`** + `node:test` | `~/.claude/skills/testing-strategies/` + repo | Behaviour + abuse coverage. | 33 offline deterministic tests across the three domains, incl. the §39 security cases (consent, isolation, dedupe, forged source, clear-preserves-orders, agent-cannot-write). | 0 |

## NOT USED — and why

| Skill / capability | Why not |
| --- | --- |
| **Higgsfield / any media generation** | Would consume credits (§0). The phase needs no imagery. **Not called.** |
| **OpenAI / Anthropic / Gemini APIs, paid MCP, Composio** | Billable. The Agent runs as the deterministic Demo Agent; follow-up + memory tools are pure/read-only. No credentials tested. **Not called.** |
| **Email / SMS / WhatsApp / push providers** | External + billable, and §29 forbids implying real delivery. Replaced by the in-app sink; future channels shown "Not connected". **Not called.** |
| **`playwright` MCP / `webapp-testing`** (browser QA, §46) | Scoped to another project; no free/local browser connectable this session. Per §46, browser QA was **not faked** — real server-rendered HTTP + code review + 278 tests. |
| **`seo-audit` / `schema-markup`** | Account/notification surfaces are private (`robots: index:false`) — out of scope. |
| **Dedicated "personalization/recommendation" skills** | None materially useful + free are installed; the memory profile is a simple typed store, deliberately not an ML recommender (§9 avoids fake precision). |

## Subagents

Not spawned. The work stayed coherent in one context and every review pass (security invariants + §39 matrix, RLS mirror, a11y/RTL, 33 unit tests + full 278-test regression + gate suite) was completed inline. The memory/notification/follow-up domains, migrations, RLS, and threat matrix are documented in `docs/USER_MEMORY.md`, `docs/NOTIFICATIONS.md`, `docs/AGENT_FOLLOWUP.md` + the phase report for an independent review pass when a Supabase project is available.

## Zero-credit confirmation

**External paid credits consumed: 0.** No purchases, no subscriptions, no real email/SMS/WhatsApp/push, no real AI generation, no external AI/API calls, no credential tests.
