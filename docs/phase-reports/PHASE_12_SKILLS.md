# Phase 12 — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md`. Only FREE/local capabilities that materially improved this delivery + installation + tracking phase were used. **Every skill below consumed 0 paid credits** — none call an external/billable service. Higgsfield, maps/geocoding, couriers, and every paid AI/API/MCP were deliberately NOT used (§0 zero-credit rule).

## USED

| Skill / capability | Source | What it improved | Where applied | Paid credits |
| --- | --- | --- | --- | --- |
| **`security-review`** | `~/.claude/skills/security-review/` | The centrepiece. Drove every invariant: eligibility gate (custom vs catalog readiness) + `assert_delivery_eligible` trigger; per-supplier isolation incl. **customer phone/address protection** on the delivery row; append-only event + attempt history (failed attempts never deleted); **immutable address snapshot**; customer-can-set-slot-only vs supplier operational writes; completion rule; agent read-only; the §35 abuse matrix. | `authorization.ts`, `delivery.ts`, `0014`/`0015`, report matrix, `delivery.test.ts` | 0 (local reasoning) |
| **`database-schema`** | `~/.claude/skills/database-schema/` | `deliveries` (one per `order_group_id`, references order/fulfillment/manufacturing/supplier, jsonb address snapshot, eligibility trigger) + `delivery_events`/`delivery_attempts` (append-only) + `installations`/`installation_events` (supplier-only text); the `0015` RLS split. | `supabase/migrations/0014,0015` | 0 |
| **state-machine / workflow design** | local reasoning (with `security-review`) | Two deterministic machines (delivery + installation) with a failure/reschedule loop, terminal `completed`, and the extra completion-rule gate before completion; `availableDeliveryActions` as the single source of truth for the UI. | `status-machine.ts`, `delivery.ts` | 0 |
| **`ui-ux-pro-max`** | `~/.claude/plugins/cache/ui-ux-pro-max-skill/` | The delivery UX brief: a calm, furniture-focused **tracking timeline + slot picker** (not a courier ERP, not a map clone), a stage-grouped supplier board, and clear installation clarity. | `delivery-workspace.tsx`, `order-views.tsx` tracker, `slot-picker.tsx` | 0 (local CLI/templates) |
| **`frontend-design`** | `~/.claude/plugins/.../frontend-design/` | Kept the delivery board, detail, tracker, and slot picker within the established Athathi identity (warm, restrained, furniture-first) — a premium tracking moment, not templated. | delivery UI | 0 |
| **`web-design-guidelines`** | `~/.claude/skills/web-design-guidelines/` | A11y/RTL QA: `<fieldset>`/`<legend>` + radios for slots/failure reasons, labelled selects/textarea for issues, tracker as an ordered list with text + icon (never colour-only) + "Now" chip, `role="status"` notes, logical properties + `rtl:` flips, `dir="ltr"` for hours, focus-visible. | slot picker, tracker, forms | 0 |
| **`vercel-react-best-practices`** | `~/.claude/skills/vercel-react-best-practices/` | The pure delivery domain runs identically in the demo `localStorage` store, a future server route, and Node tests; create-on-open in guarded effects; a lazy `useState` initializer to keep the slot picker pure (`react-hooks/purity`); the delivery store composes cleanly with fulfillment + manufacturing stores. | `delivery-store.ts`, `slot-picker.tsx` | 0 |
| **`localize`** + `audit:arabic` | `~/.claude/skills/localize/` + repo | 126 bilingual keys added in logical Unicode + guarded by `audit:arabic` and the i18n parity test (EN/AR 1479 leaves each), with customer-friendly Arabic delivery language. | `dictionaries/{en,ar}.json` | 0 |
| **`testing-strategies`** + `node:test` | `~/.claude/skills/testing-strategies/` + repo | 24 offline, deterministic delivery/installation tests (eligibility, machines, completion rule, failure/reschedule, snapshot immutability, isolation, agent boundary, notifier, §35). No external/paid calls. | `delivery.test.ts` | 0 |

## NOT USED — and why

| Skill / capability | Why not |
| --- | --- |
| **Higgsfield / any media generation** | Would consume credits (§0). The phase needs no imagery. **Not called.** |
| **OpenAI / Anthropic / Gemini APIs, paid MCP, Composio** | Billable. The Agent runs as the deterministic Demo Agent; delivery notifications are a local Demo/Log adapter. **Not called.** |
| **Maps / geocoding / courier / logistics APIs** (Aramex, DHL, Asyad, Oman Post, Google Maps, …) | External + billable, and §16/§28 forbid real courier/GPS. Replaced by deterministic demo windows + a labelled Demo Delivery Team + status/timeline tracking (no map). **Not called.** |
| **`playwright` MCP / `webapp-testing`** (browser QA, §42) | Scoped to another project; no free/local browser connectable this session. Per §42, browser QA was **not faked** — real server-rendered HTTP + code review + 245 tests. (Free if available; the exclusion is availability, not cost.) |
| **Email/SMS/WhatsApp/push providers** | External + billable. Replaced by the `DeliveryNotifier` Demo/Log adapter that records but never sends (§32). |
| **`seo-audit` / `schema-markup`** | Supplier/delivery/order pages are `robots: index:false` (private) — out of scope. |

## Subagents

Not spawned. The work stayed coherent in one context and every review pass (security invariants + §35 matrix, RLS mirror, a11y/RTL, 24 unit tests + full 245-test regression + gate suite) was completed inline. The delivery domain, migrations, RLS, and threat matrix are documented in `docs/DELIVERY_INSTALLATION_WORKFLOW.md` + the phase report for an independent review pass when a Supabase project is available.

## Zero-credit confirmation

**External paid credits consumed: 0.** No purchases, no subscriptions, no real courier bookings, no real messages, no real GPS calls, no real AI generation, no external AI/API calls.
