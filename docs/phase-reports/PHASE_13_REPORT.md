# Phase 13 — Notifications + User Memory + Agent Follow-Up — Report

_Status: ✅ Complete & verified. Athathi now behaves like an ongoing assistant: it remembers design preferences WITH EXPLICIT CONSENT (opt-in, editable, removable), raises a real in-app notification feed from the whole pipeline (deduped, never external), and surfaces the user's most useful next action from deterministic state. Three new pure domains (`memory`, `notifications`, agent `followup`), owner-only authorization mirrored in RLS, a header notification center, an account memory-settings surface, a design "use my saved style" seed, and an account follow-up card. The Agent gains read-only memory + follow-up tools and can never write memory or perform operational actions. Runs fully in Demo Mode; Supabase migrations + RLS are gated. All earlier phases preserved (278 tests, all gates green). **External paid API calls: 0. Paid credits consumed: 0.** Phase 14 not started._

## 1. Phase 13 status

Complete and stable. Built only on the current repo state; no previous phase rebuilt; no external providers connected; no deploy.

## 2. Skills actually used

See `PHASE_13_SKILLS.md`. Headline: `security-review` (opt-in consent, owner-only isolation, suggested≠durable, clear≠disable, clear-never-deletes-orders, notification dedupe + forged-source rejection, agent read-only, prompt-injection boundary, §39 matrix), `database-schema` (typed memory tables + notifications with dedupe unique key), `frontend-design` + `ui-ux-pro-max` + `web-design-guidelines` (notification center, memory settings, follow-up card, a11y/RTL), `vercel-react-best-practices`, `localize` + `audit:arabic`, `testing-strategies`/`node:test`. All FREE/local — **0 credits**.

## 3. Zero-credit verification

**External paid API calls: 0 · Paid credits consumed: 0 · OpenAI: 0 · Anthropic: 0 · Gemini: 0 · Higgsfield: 0 · Composio paid: 0 · Real email: 0 · Real SMS: 0 · Real WhatsApp: 0 · Real push: 0 · Real AI API calls: 0.** No credentials tested or inspected. Everything is local code, deterministic logic, mocks, fixtures, Demo Mode, and the existing deterministic Agent fallback. Notifications are the in-app sink only; future channels are shown "Not connected".

## 4. Memory architecture

`src/lib/memory/` (pure): `types.ts`, `memory.ts` (consent-gated ops + safe context), `validation.ts` (taxonomy-only values), `authorization.ts`, `index.ts`. Full design in `docs/USER_MEMORY.md`.

## 5. Consent model

Two independent opt-in switches — **Remember my design preferences** (master) + **Use my saved preferences in new designs**. Off by default. Turning off stops use without deleting (§37); **Clear all** wipes memory but keeps consent and **never touches orders/payments/RFQs** (§38 — separate stores; unit-tested).

## 6. Memory categories

Styles / colours / materials (real taxonomy values, deduped, with provenance), a typical budget **range** (OMR, not one value, §7), and saved rooms (user-supplied dimensions only). Every entry has a **source**; a **suggested** preference is never auto-persisted (§8/§9). Never stores passwords/cards/tokens/secrets/raw reasoning (§5).

## 7. Memory persistence

Demo: `athathi.memory.v1` in `localStorage`, keyed per user id. Supabase (gated): `memory_consent` + `user_memory_preferences` (typed, `unique(user, category, value)`) + `user_memory_budget` (range) + `user_room_memories`, owner-only RLS in `0017`.

## 8. Account memory UI

`/[locale]/account` → **Design memory & preferences**: consent switches, editable style/colour/material chips, a budget-range editor, **Clear all** + **Turn off** (with confirm dialogs), honest privacy copy that never claims encryption. Premium, calm, mobile-friendly.

## 9. Design integration

The AI Designer shows a **"Use your saved style?"** card (e.g. *Modern · Walnut · Beige*) with **Use saved preferences** / **Start fresh** — memory is never applied silently (§3/§18); it appears only with consent + useInDesign + usable prefs and reads the user's OWN memory (own session id).

## 10. Notification architecture

`src/lib/notifications/` (pure): `types.ts`, `mapping.ts` (event → category/priority/keys), `notifications.ts` (build/ingest/dedupe/read-state/group/top), `authorization.ts`, `adapter.ts` (in-app sink + not-connected channels). Full design in `docs/NOTIFICATIONS.md`.

## 11. Notification center

Header **bell** + unread badge (`aria-live`) → dropdown center grouped **Today / Earlier**, per item icon + localized title/body + timestamp + unread dot + mark-read + dismiss + deep link, **Mark all as read**, Escape/click-outside to close. Derived deterministically from the user's own orders.

## 12. Notification deduplication

Identity `(userId, sourceType, sourceId, eventKey)` IS the id; `ingest` drops duplicates and preserves read state across reloads/rehydration (§25). Unit-tested (re-ingest keeps count + read state).

## 13. Supplier/customer notifications

The feed is per-user and audience-tagged; customer notifications are derived from the customer's own orders. Supplier operational notifications share the same domain + audience field and the same owner-scoped RLS (a supplier user reads only their own feed) — the customer feed never exposes supplier-internal data.

## 14. Agent memory context

`get_user_memory` returns the SAFE context (approved preference values only — never payment/secret/history, §15); empty unless consent + useInDesign. `suggest_memory_update` validates + proposes but **never persists** (`requiresApproval:true`). `AGENT_CAN_WRITE_MEMORY = false`.

## 15. Agent follow-up context

`src/lib/agent/followup.ts` — `buildFollowUpContext` turns per-user order/quote/design state into prioritized next actions; never invents progress. Full design in `docs/AGENT_FOLLOWUP.md`.

## 16. Follow-up priority engine

HIGH: payment failed, delivery reschedule, supplier declined. MEDIUM: unpaid order, awaiting delivery slot, quality review, quote received. LOW: continue design. Deduped + sorted; `top` is the single most useful action.

## 17. Agent next actions

`summarize_followup` surfaces the actions (`canExecute:false`); the account **"Continue where you left off"** card renders the top action + up to three more, each a deep link (Pay → payment page, Choose slot → order, Review quote → account, Continue → designer). The Agent recommends; the user acts — no operational write (§33).

## 18. Privacy / security

Memory stores only design context (never passwords/cards/tokens/secrets/raw reasoning). Honest copy; no false encryption claim. Memory + notifications are treated as DATA, not instructions (§40) — the system prompt forbids stored user text becoming trusted instructions.

## 19. RLS — §39 verification matrix

| # | Abuse case | Mitigation | Verified |
|---|---|---|---|
| 1 | Customer A reads Customer B memory | `canReadMemory` owner check; owner-only RLS | Unit test + `0017` |
| 2 | Supplier reads customer memory | no supplier policy on memory tables (default deny) | `0017` + review |
| 3 | Agent receives wrong user's memory | context read in the user's own session id only; owner-scoped | Store + tool review |
| 4 | Customer A reads Customer B notifications | `forUser`/`canReadNotification` owner scope; owner-only RLS | Unit test + `0019` |
| 5 | Forged notification source id | allowlist + `(user,source,event)` unique + build rejects unknown | Unit test + `0018` |
| 6 | Memory update without consent | writes are consent-gated no-ops | Unit test |
| 7 | Silent Agent memory write | `AGENT_CAN_WRITE_MEMORY=false`; suggest-only tool never persists | Unit test + review |
| 8 | Clear memory deletes orders | clear touches only the memory store; orders are separate keys | Unit test + store isolation |
| 9 | Notification deep-link to unauthorized order | links carry the user's own order id; order routes are auth+owner gated | Route review |
| 10 | Client fabricates high-priority notification | event allowlist + mapped priority (client can't set priority) | Unit test |
| 11 | Duplicate notification replay | dedupe by stable id; read state preserved | Unit test |

## 20. Arabic / RTL

114 new bilingual keys (notifications + events, memory settings, design-memory, follow-up). `audit:arabic` clean (2184 Arabic strings), EN/AR parity exact (**1593 leaves each**). Status/priority carried as text + icon; RTL via logical properties + `rtl:` flips; numbers/hours `dir="ltr"`.

## 21. Accessibility

Notification bell is a labelled `aria-haspopup` trigger with an `aria-live` unread count; the center is a `role="dialog"` with Escape/click-outside close, mark-read/dismiss buttons, focus-visible; memory toggles are `role="switch"` with `aria-checked`; confirm dialogs are `role="dialog" aria-modal`; chips have labelled remove buttons; nothing relies on colour alone; reduced-motion respected (no bespoke animation beyond existing tokens).

## 22. Responsive / browser QA

The notification center is width-clamped (`min(24rem, calc(100vw-1.5rem))`) and scrolls internally — excellent on mobile; memory settings + follow-up card stack cleanly from 390px. **Browser QA:** no free/local Playwright/Chrome is connectable this session (Playwright MCP scoped elsewhere; claude-in-chrome has no browser) — per §46 browser QA was **not faked**; verification was real server-rendered HTTP + code review + the 278-test suite.

## 23. Tests / build

`npm test` → **278 passing** (33 new: 12 memory, 10 notifications, 11 agent follow-up): consent/disabled, save/edit/remove/clear, clear-preserves-orders, categories, budget range, room memory, provenance, suggested-not-persisted, agent read-only; create/dedup/unread/mark-read/deep-link/ownership/cross-user/fabricated-source/mapping/not-connected-channels; and the follow-up priority/next-action/read-only cases. `npm run lint` 0 warnings, `npm run typecheck` clean, `npm run build` success, `npm run audit:arabic` clean. Regression: all earlier-phase suites still green.

## 24. Local commit hash

See the commit created at the end of this phase (local only; not pushed).

## 25. Known limitations

- **No live Supabase** → DB + RLS are built + gated, not live-exercised; the demo `localStorage` stores (per user, labelled) are the running mode.
- **In-app notifications only** — email/WhatsApp/push are shown "Not connected"; no external send (by design).
- **Follow-up input** covers order-derived actions (pay/slot/reschedule/view); pending-quote + active-design surfacing is wired in the domain + tool and left empty in the account card until those stores expose the needed getters (deliberately conservative — no invented state).
- **Memory is browser-local in Demo Mode** — per-user localStorage; a real cross-device profile needs Supabase.
- **No live browser/device screenshots** (tooling unavailable) — verified via HTTP + tests + code review.

## 26. Exact local URLs

- `/[locale]/account` — **Design memory & preferences**, **Continue where you left off** (follow-up), plus the existing orders/lists.
- `/[locale]/design` — the AI Designer with the **"Use your saved style?"** seed.
- Header **notification bell** (signed-in, every page) → the notification center.
- Verified: `/en`, `/ar`, `/en/account`, `/ar/account`, `/en/design`, `/ar/design`, `/en/supplier`, `/ar/supplier`.

## 27. Recommended next phase — Phase 14: Final Competition Polish + Demo + QA

With the assistant experience complete, do a final polish + end-to-end demo pass + QA hardening across the whole journey (catalog → design → RFQ → order → payment → fulfillment → manufacturing → delivery → memory/notifications/follow-up), still zero-credit. **Do not start it.**
