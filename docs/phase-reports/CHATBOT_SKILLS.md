# Athathi Chatbot — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md`. Only FREE/local capabilities that materially improved the chatbot were used. **Zero paid credits; no real Claude/Anthropic call was made** (the provider is mocked in tests, and no key was read/tested).

## USED

| Skill / capability | Source | What it improved | Paid credits |
| --- | --- | --- | --- |
| **`security-review`** | `~/.claude/skills/security-review/` | The security spine: key read only server-side (never `NEXT_PUBLIC`, never logged/returned; verified absent from `.next/static`), user text + memory treated as DATA (prompt-injection defended + tested), **no user order/memory data sent to the server** (client-only, no cross-user access), catalog truth authoritative (fabricated ids/prices dropped), oversized-body/message limits, and text-only rendering (no XSS from model output). | 0 |
| **`ui-ux-pro-max`** | `~/.claude/plugins/cache/ui-ux-pro-max-skill/` | Chat UX: a premium assistant drawer (identity, welcome, quick actions, product cards, typing state, reset) that reads as a design consultant inside Athathi — not a generic support widget. | 0 (local) |
| **`frontend-design`** | `~/.claude/plugins/.../frontend-design/` | Kept the launcher, drawer, bubbles, and in-chat product cards within the Athathi identity (warm, restrained), consistent with the rest of the site. | 0 |
| **`web-design-guidelines`** | `~/.claude/skills/web-design-guidelines/` | A11y: labelled launcher, `role="dialog" aria-modal` with a focus trap + return, Escape to close, `aria-live` conversation, labelled quick actions + composer, RTL via logical properties + `rtl:` flips, mobile bottom-sheet clear of cart/checkout controls. | 0 |
| **`vercel-react-best-practices`** | `~/.claude/skills/vercel-react-best-practices/` | The client/server split: a client-safe barrel (types + demo helpers) vs the server-only provider/service/prompts; the widget calls `/api/chat` and never imports secret-reading code; a lazy `useState` initializer for history (avoids a `react-hooks` setState-in-effect); the widget reuses `CartProvider` from the layout. | 0 |
| **AI agent / tool-use design** | (with `security-review`) | The "model plans, deterministic code grounds" pattern (reusing the existing Agent/interior-engine approach) — Claude returns intent + a product *request*; Athathi grounds it to real catalog data, so the model can never supply product truth. | 0 |
| **`localize`** + `audit:arabic` | `~/.claude/skills/localize/` + repo | ~70 bilingual keys (identity/welcome/quick actions/statuses/errors) + deterministic EN + AR intent detection & slot extraction (incl. Arabic-Indic digits); guarded by `audit:arabic` + the parity test (EN/AR 1648). | 0 |
| **`testing-strategies`** + `node:test` | `~/.claude/skills/testing-strategies/` + repo | 18 offline, deterministic tests with a mocked provider — demo fallback, grounding, fabricated-product rejection, variants, budget, comparison, handoffs, order-data-never-on-server, prompt injection, no-secret-in-output. No real API calls. | 0 |

## NOT USED — and why

| Skill / capability | Why not |
| --- | --- |
| **Live Anthropic / OpenAI / Gemini APIs, Higgsfield, Composio, paid MCP** | Billable, and the task forbids any live call now. The chatbot runs the deterministic Demo engine; the Claude path is exercised only via mocks; no key was read or tested. |
| **`playwright` MCP / browser QA** | Not reliably connectable this session; QA via HTTP + code review + 317 tests. Not faked. |
| **`seo-audit` / `schema-markup`** | The assistant is an interactive widget, not indexable content — out of scope. |

## Subagents

Not spawned. The work stayed coherent in one context; the security + a11y + i18n + test passes were completed inline.

## Zero-credit confirmation

**External paid credits consumed: 0.** No real Claude/Anthropic call, no key read/tested, no external service.
