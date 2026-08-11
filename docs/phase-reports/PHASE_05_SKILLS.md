# Phase 05 — Skills, Agents & Capabilities

Reflects what was actually available and used. No skill names are invented.

## Skills used

| Skill | Outcome | How it was used |
| --- | --- | --- |
| `frontend-design` | **Used** | Review lens for the room-analysis UI with the explicit brief (§26/§43) to avoid a "developer tooling / chatbot / purple-AI" look. It kept the analysis presented as an interior-design review (warm surfaces, swatch chips, labelled confidence bands — never raw decimals or JSON dumps, never colour-only), and confirmed the fallback/consent messaging reads clearly. Also confirmed the design honours the existing Phase 01–04 system rather than inventing a new one. |
| `claude-api` | **Consulted** | Referenced for the Anthropic Messages vision request shape (base64 image block + system prompt) used by the Anthropic provider, and for current model naming. No Claude call is made in this environment (no key configured); the provider is wired and enable-able. |
| `artifact-design` | **Used** | Loaded before publishing the room-analysis-review visual-QA artifact; confirmed a theme-aware, responsive, restrained layout. |

## Relevant skills evaluated / deferred

| Skill | Decision |
| --- | --- |
| `security-review` / `code-review` | A thorough **manual security review** was performed inline against §32/§33 (secrets server-side only, upload validation + magic-byte sniff, safe error codes, no raw provider errors, prompt-injection defense, no secret/PII logging, server/client boundary). Findings drove concrete code (see report). A dedicated `security-review` subagent was not spawned — the surface is small and self-contained, and spawning a cold agent would re-derive context already held; the checklist was applied directly. |
| `webapp-testing` / Playwright | Not installed. The room-analysis pipeline is exercised by 18 unit tests (parser/normalizer/mapping/service with a mock provider) and the route is verified over HTTP (validation + error codes); the browser tool was attempted for the end-to-end journey but did not connect this session. |
| `localize` | Arabic authored directly in typed dictionaries with compile-time key parity (62 new vision keys, EN == AR); hand-audited. |
| `higgsfield` / image-generation, `dataviz`, motion libs | Not warranted. Phase 05 analyses a real photo; it does not generate imagery (explicitly out of scope) and shows structured rows, not charts. |
| Vision MCP capabilities | None relevant/available for this task beyond a first-party model API; the provider abstraction (Anthropic/OpenAI/Gemini via server-side fetch) is the integration path and needs a key to activate. |

## Agents / subagents

- No subagents spawned. Phase 05 is a focused, security-sensitive feature on an established codebase; it parallelised as a task list (schema → providers/service → mapping/route → tests → UI → QA/docs). The architecture/security/schema reviews were performed inline against explicit checklists. A cold subagent would have re-derived held context without improving the small, auditable surface.

## MCP & tooling capabilities

| Capability | Status | Note |
| --- | --- | --- |
| Build / lint / typecheck / test | **Used** | `next build` (199 pages + the `/api/vision/analyze` route), `eslint` (0 warnings), `tsc --noEmit`, `node --test` all pass. |
| `node:test` (built-in runner) | **Used** | 18 new vision tests (50 total). The service is exercised with an injected mock provider — **no external/paid API calls**. The resolver hook already maps `@/` + `.ts`, so the vision modules run unchanged. |
| HTTP route verification | **Used** | `GET /api/vision/analyze` → `{configured:false}` (honest, no secrets); `POST` validated: missing image → 400, bad magic bytes → 415, declared-MIME/sniff mismatch → 415, disallowed type → 415, valid image + no provider → 200 `no-provider`, `mode=demo` → 200 normalized sample. Confirmed **no API-key strings in `.next/static`** client chunks. |
| **Claude-in-Chrome (browser)** | **Attempted, unavailable this session** | The extension did not connect (as in Phases 02–04). Live click-through of the wizard analysis flow was not possible. |
| Visual review artifact | **Used** | Published a self-contained artifact rendering the analysis-review UI from **real demo-provider output through the real validator** (confidence bands, editable keep/replace, honest dimensions), so the vision UI could be reviewed despite the browser being offline. |
| Live Vision provider | **None configured** | No `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` present. Per §3, the full architecture + mocked tests + demo/manual fallback are complete; **no live provider was tested**. Setting one key enables real analysis with no code change. |

## Net effect

`frontend-design` kept the analysis feeling like Athathi (not dev tooling); the manual security review shaped the server boundary, upload validation, prompt-injection defense and safe-error handling; and the unit + HTTP verification substituted rigorously for the unavailable browser and the (deliberately) absent live provider.
