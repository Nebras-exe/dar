# Phase 06 — Skills, Agents & Capabilities

Reflects what was actually available and used. No skill names are invented.

## Skills used

| Skill | Outcome | How it was used |
| --- | --- | --- |
| `frontend-design` | **Used** | Review lens for the Agent UI with the explicit brief (§52/§62) to avoid a "ChatGPT clone". Kept it a restrained, integrated control panel inside the design result — a composer + quick commands + check-style tool-activity lines (never raw JSON), with the design result staying the main screen. Confirmed the approval card is clear and the panel doesn't dominate on mobile. |
| `claude-api` | **Consulted** | Referenced for the Anthropic Messages tool-use shape (tool_use / tool_result blocks) used by the Anthropic agent provider, and current model naming. No Claude call runs in this environment (no key); the provider is wired and enable-able. |
| `artifact-design` | **Used** | Loaded before publishing the Agent visual-QA artifact; confirmed a theme-aware, responsive, restrained rendering of the composer/activity/approval flow. |

## Relevant skills evaluated / deferred

| Skill | Decision |
| --- | --- |
| `security-review` / `code-review` | A thorough **manual security review** was performed inline against §41/§43/§61 (tool allowlist, argument + output validation, server-only secrets, prompt-injection defense, cart-approval boundary, payload/message/loop caps, unknown-catalog-ID rejection, error/secret leakage). Findings are enforced in code and verified by tests + the API matrix (see report). A cold subagent would re-derive held context on a small, auditable surface. |
| `webapp-testing` / Playwright | Not installed. The agent engine is covered by 23 unit tests (tools, Demo Agent EN+AR, the judge scenario, and the orchestrator with a scripted mock provider) and the route by an HTTP matrix; the browser tool was attempted for the end-to-end journey but did not connect this session. |
| `localize` | Arabic authored directly in typed dictionaries with compile-time parity (26 new agent keys; 465 total, EN == AR); the Demo Agent's dynamic replies are authored bilingually in code and hand-audited. |
| `higgsfield` / image-gen, `dataviz`, motion libs | Not warranted — the Agent modifies a structured design and explains concisely; no imagery/charts. |
| SDKs (`@anthropic-ai`, `openai`) | **Deliberately not installed** (§21/§699). Server-side `fetch` handles the tool loop cleanly with zero dependencies and keeps the provider abstraction vendor-neutral; an SDK was not justified. Documented in the report. |

## Agents / subagents

- No subagents spawned. Phase 06 is a disciplined, security-sensitive feature on an established codebase; it parallelised as a task list (types/tools/registry → Demo Agent → providers/orchestrator/service/route → UI/i18n → tests → QA/docs). The architecture / tool-contract / security reviews were applied inline against explicit checklists.

## MCP & tooling capabilities

| Capability | Status | Note |
| --- | --- | --- |
| Build / lint / typecheck / test | **Used** | `next build` (199 pages + `/api/agent` + `/api/vision/analyze`), `eslint` (0 warnings), `tsc --noEmit`, `node --test` all pass. |
| `node:test` (built-in runner) | **Used** | 23 new agent tests (73 total). The LLM path is exercised with a **scripted mock provider** — no external/paid calls. |
| Agent API HTTP verification | **Used** | `GET /api/agent` → `{mode:"demo",configured:false}`. `POST`: judge scenario (reduce under target), replace-the-rug, Arabic "خله تحت ٤٠٠" (412→377), prepare-cart (requiresApproval, 5-item proposal). Errors: empty/non-JSON → 400, too-long message → 400, invalid roomType → 400, oversized body → 413. **Fake product slug dropped (catalog truth, not echoed); no keys/system-prompt in client chunks.** |
| **Claude-in-Chrome (browser)** | **Attempted, unavailable this session** | The extension did not connect (as in Phases 02–05). Live click-through of the Agent panel was not possible. |
| Visual review artifact | **Used** | Published an artifact rendering the Agent panel from **real Demo Agent output** across three commands (cheaper → replace rug → add to cart) with the approval card. |
| Live Agent provider | **None configured** | No `ANTHROPIC_API_KEY` / `OPENAI_API_KEY`. Per §22, the provider-ready architecture + orchestrator (mock-tested) + Demo Agent are complete; **no live model call was tested**. Setting a key enables the LLM tool loop with no code change. |

## Net effect

`frontend-design` kept the Agent an integrated control layer (not a chatbot); the manual security review shaped the tool allowlist, argument/output validation, approval boundary and catalog-truth enforcement; and the unit + HTTP verification substituted rigorously for the unavailable browser and the (deliberately) absent live provider.
