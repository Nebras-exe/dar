# User Memory / Personalization (Phase 13)

Athathi can remember a user's design preferences **with explicit consent**, so the AI
Designer + Agent offer continuity later. Memory is **opt-in, transparent, editable,
and removable** — and stores only useful product/design context, never sensitive data.

## What is (and isn't) stored

**Stored (only with consent):** preferred styles / colours / materials (real taxonomy
values), a typical budget **range** (OMR), and saved room/project context (name, type,
chosen style, user-supplied dimensions, kept categories, linked design id).

**Never stored (§5):** passwords, payment/card data, CVV, bank info, auth tokens, API
keys, precise unnecessary personal info, or raw AI reasoning. The account UI states
this plainly.

## Consent model (§4/§37) — two independent switches

- **Remember my design preferences** (`enabled`) — the master opt-in. Off by default.
- **Use my saved preferences in new designs** (`useInDesign`) — whether memory seeds
  the design flow + agent context.

Turning the master switch **off stops use without deleting** (§37); **Clear all** wipes
saved preferences + rooms but keeps the consent settings — the two are separate,
unambiguous actions. Crucially, clearing memory **never touches orders, payments, or
RFQs** (§38) — those live in different `athathi.*` stores this domain never reads.

## Provenance + confidence (§8/§9)

Every saved preference carries a **source** (`explicit_user_choice`, `style_onboarding`,
`approved_design`, `completed_purchase`, `room_project`) and a **confidence**
(`explicit` vs `suggested`). A **suggested** preference is a transient proposal surfaced
in the UI — it is **never persisted automatically**. The Agent may *suggest* ("save
walnut as a preferred material?"), but only deterministic app code saves it, and only
after the user approves. No fake precision (no "Modern 73.42%").

## Domain layer — `src/lib/memory/`

| File | Responsibility |
|---|---|
| `types.ts` | `UserMemoryProfile`, `MemoryEntry`, `BudgetPreference`, `RoomMemory`, `MemoryConsent`, `MemorySource`, `MemoryContext`, `MemorySuggestion`. |
| `memory.ts` | Consent-gated operations (`rememberPreference`/`forgetPreference`/`rememberBudget`/`rememberRoom`/`setConsentEnabled`/`setUseInDesign`/`clearAllMemory`), the safe `buildMemoryContext`, `hasUsableMemory`. |
| `validation.ts` | `isValidMemoryValue` — only real catalog taxonomy values may be stored (the Agent can't persist an invented "fact"). |
| `authorization.ts` | Owner-only read/write; `AGENT_CAN_WRITE_MEMORY = false`. |

## Safe Agent/design context (§15)

`buildMemoryContext(profile)` returns **approved preference values only** — styles,
colours, materials, typical budget, saved-room count — and only when consent is enabled
**and** useInDesign is on. It never contains payment info, secrets, private supplier
data, or history. Empty when memory is off.

## Design integration (§18)

On the AI Designer, a **"Use your saved style?"** card surfaces the saved summary
(e.g. *Modern · Walnut · Beige*) with **Use saved preferences** / **Start fresh**.
Memory is **never applied silently** — the user chooses. The card appears only with
consent + useInDesign + usable preferences.

## Account UI (§13/§36)

`/[locale]/account` → **Design memory & preferences**: the two consent switches,
editable chips for styles/colours/materials, a budget-range editor, **Clear all saved
memory**, and **Turn off memory** (with confirm dialogs). Premium, calm, transparent;
honest privacy copy that never claims encryption.

## Authorization + RLS (§11/§39)

A user reads/creates/updates/deletes **only their own** memory. Suppliers have **no
access** to private user memory; public has none. `0017_user_memory_rls.sql` has
owner-only policies on every memory table and no supplier/public policy (default deny).
The Agent reads memory only in the user's own authenticated context and can never write.

## Demo Mode (§12)

Without Supabase, memory lives in `localStorage` (`athathi.memory.v1`), **keyed per
user id** so two accounts on one browser never share memory. Save / update / remove /
clear-all / consent on-off all work locally; nothing is sent anywhere.

## Persistence

- **Demo (running):** `athathi.memory.v1` (per user, browser-local, labelled).
- **Supabase (gated):** `memory_consent`, `user_memory_preferences` (typed, deduped),
  `user_memory_budget` (range), `user_room_memories`, with owner-only RLS in `0017`.
