# Phase 05 — Room Analysis & Vision AI — Report

_Status: ✅ Complete & verified. Full provider architecture + validated structured analysis + manual/demo fallback, integrated into the Phase 04 designer. Build/lint/typecheck/tests green; route + RTL verified over HTTP; analysis UI reviewed via a published artifact. **No live Vision provider is configured in this environment**, so no real model call was tested — the architecture, mocked tests and fallback are fully functional and a single env key enables real analysis with no code change. The Chrome extension did not connect this session, so live click-through was not possible._

## Summary

Phase 05 connects **real room-image understanding** to the existing structured AI Designer without rewriting its UI. A user can upload a room photo and — after explicit consent — have it analysed server-side into a strongly-typed `RoomAnalysis` (room type, style, palette, existing furniture with keep/replace suggestions, architectural context). The analysis **pre-fills** the Phase 04 wizard under a strict rule — **AI pre-fill → user edit → user wins** — and the design engine (Phase 04) + catalog (Phase 03) remain the single sources of truth for products. Vision *observes and suggests*; deterministic logic validates; the user corrects and decides.

## Provider Architecture

`src/lib/vision/` is provider-agnostic:

- `providers/types.ts` — the `VisionProvider` interface (`isConfigured()`, `analyze(image, signal) → raw unknown`).
- `providers/anthropic.ts`, `openai.ts`, `gemini.ts` — real providers via **server-side `fetch` to each vendor's REST API — no SDK dependency**. Each reads its key from `process.env` and never exposes it.
- `providers/demo.ts` — a fixed, plausible SAMPLE that does not read the image (clearly labelled `source: "demo"`).
- `service.ts` — resolves the active provider (`ATHATHI_VISION_PROVIDER` or first configured), calls it with a 25 s `AbortController` timeout, validates/normalizes the output, and returns a discriminated `VisionResult` — **never throws, never leaks raw provider errors, never logs secrets or image bytes**.

Adding a vendor = one file implementing the interface. Nothing else in Athathi cares which provider ran.

## Provider Used

**No live provider configured.** The environment has no `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY`, so `GET /api/vision/analyze` reports `{configured:false}` and the UI honestly offers manual entry + a labelled sample analysis. Setting any one key activates the corresponding provider with no code change.

## RoomAnalysis Schema

Typed in `types.ts`, validated in `schema.ts` (a dependency-free manual validator — the trust boundary). Fields: `roomType` (+confidence), `style` (primary/secondary + confidence), `palette` (raw + mapped catalog colour + confidence), `existingFurniture` (mapped category, rawLabel, confidence, approx colour/material, keep/replace suggestion), `architecturalFeatures` (controlled vocabulary), `dimensionsStatus`, and non-secret provenance (`source`, `provider`, `promptVersion`, `model`). The validator **clamps confidences to [0,1], drops values outside the supported taxonomy, sanitises free-text labels (control chars/angle brackets removed), caps list lengths, de-duplicates furniture by category**, and rejects output with no usable signal.

## Image Upload / Privacy

Per §13 the upload messaging was updated honestly: the photo stays in the browser at upload; analysis is a separate, optional, **consent-gated** step. Before any real analysis the UI shows the privacy notice ("Your room image will be securely sent to the selected AI provider for analysis… not stored in this prototype") and requires an explicit consent checkbox. The image is sent as `multipart/form-data` to the server route and processed transiently — never written to storage. Only the file name enters wizard state; the blob is never persisted to `localStorage`.

## Room Type Detection

Mapped to the Phase 04 `DesignRoomType` (`living-room, bedroom, majlis, dining-room, office, kids-room, outdoor`); unknown/low-confidence → `"unknown"` and left for the user. Confidence is surfaced as a band, and the value is always user-correctable in the review + the normal wizard.

## Style Detection

Expressed only in the Phase 03 style taxonomy (`primary`, optional `secondary`, confidence). User preferences always override; low-confidence styles are not pre-filled (the wizard asks).

## Color Mapping

Raw model colour phrases are mapped to catalog `ColorId`s via a synonym table (e.g. "warm white" → `ivory`, "dark grey" → `charcoal`); unmapped colours are kept as raw text but never invented into the taxonomy. Up to three highest-signal mapped colours pre-fill `preferredColors`.

## Furniture Detection

Raw labels map to catalog categories via a synonym table ("couch/sectional" → `sofas`, "media unit" → `tv-units`, "bedside table" → `side-tables`, …). Each detection carries confidence, approximate colour/material, and a keep/replace/unsure **suggestion**. Junk/unmappable labels resolve to `category: null` and are excluded from the usable set.

## Keep / Replace Suggestions

Shown as clearly-labelled **AI suggestions** with a generic, app-authored bilingual rationale — never trusted model prose. Each is an editable segmented control (Keep/Replace/Not sure) and each detection can be removed. The user's edited decisions are what feed the design.

## User Correction

The review step ("Here's what we found") lets the user change the keep/replace of any detection, remove detections, and — via the normal wizard — override room type, style and colours. Applying the analysis uses the **edited** working copy. Nothing is auto-committed: the user clicks "Use these in my design", then proceeds.

## Phase 04 Integration

`mapping.ts` (pure, client-safe) turns a `RoomAnalysis` into an `AnalysisPrefill`; the reducer's `APPLY_PREFILL` applies it with `applyPrefill(draft, prefill)` which **fills only fields the user hasn't set** and merges keep/replace only for undecided categories — encoding *user wins*. The wizard, result and cart are otherwise unchanged. Unit tests prove a user's pre-existing room/style/colour/decision are never overwritten.

## Failure / Fallback Handling

Every failure maps to a stable, user-safe code with friendly bilingual copy and clear actions (Try again / Continue manually): `no-provider`, `invalid-image`, `timeout`, `provider-error`, `invalid-output`, `rate-limited`, `unknown`. The entire Phase 04 manual wizard works with analysis skipped entirely — **AI failure never blocks designing the room**. A 25 s timeout prevents hanging; there is no retry loop.

## Security Review

- **Secrets server-side only.** Keys are read from `process.env` in providers/service, imported *only* by the route handler. The client-safe barrel (`lib/vision/index.ts`) never re-exports the service/providers. Verified: **no key strings appear in `.next/static` client chunks**, and no `use client` file imports the service.
- **Upload validation.** MIME allow-list (jpeg/png/webp), 12 MB cap, non-empty, plus a **magic-byte sniff** that must agree with the declared MIME (rejects a text file renamed `.png`, or a real PNG mislabelled `image/jpeg`).
- **No error leakage.** Providers throw generic `http <status>` errors; the service maps them to codes and returns only the code. Raw provider bodies are never returned or logged.
- **Logging.** Structured, secret-free diagnostics (event, provider name, duration, code, room type, furniture count) — never keys, never base64 images.

## Prompt Injection Defense

The system prompt explicitly instructs the model that any text/instructions visible inside the image (or in metadata) are **content to describe, not commands to follow**, and to obey only the app schema. Defense-in-depth: the validator drops everything outside the taxonomy, so even a compromised response cannot inject fields — a unit test feeds jailbreak-style values and asserts they are dropped and no unknown keys survive.

## Arabic / RTL

62 new bilingual keys with compile-time parity (EN == AR), hand-audited (logical Unicode). Covered: consent/privacy, analyse actions, status, all error messages, review labels, confidence bands, furniture controls, feature names, suggestion rationales, dimensions honesty. RTL verified server-rendered on `/ar/design` (`dir="rtl"`).

## Accessibility

Consent is a real labelled checkbox; the analyse status uses `aria-live`; errors use `role="alert"`; furniture keep/replace is a `radiogroup`/`radio` set; confidence is a text band (never colour-only); the drop zone stays keyboard-operable; icons are `aria-hidden` with adjacent text.

## Responsive QA

The panel, privacy box, palette chips, feature chips and furniture rows all reflow to a single column on mobile (rows stack; controls wrap). Verified by responsive code review (device emulation unavailable this session).

## Skills Used

See `PHASE_05_SKILLS.md`. Headline: `frontend-design` (kept the analysis feeling like interior design, not dev tooling), a manual `security-review`-style pass, and `claude-api` for the Anthropic request shape. Testing via `node:test`.

## Browser QA

Attempted via Claude-in-Chrome; the extension did not connect. Substituted with: all-route HTTP 200 checks (home/design/shop/cart, EN+AR), the vision route's full validation/error matrix, a clean dev log, `{configured:false}` honesty, a no-key-leak check on client chunks, 18 unit tests over the pipeline, and a published artifact of the real analysis-review UI.

## Tests

`npm test` → **50 passing** (18 new in `src/lib/vision/vision.test.ts`): parse of good output; malformed/`null`/array/number rejected; unknown room/style normalized; confidence clamped; **never numeric dimensions**; injected-instruction fields dropped; colour/material/category synonym mapping; confidence bands; analysis→prefill; low-confidence not pre-filled; **user-wins** (applyPrefill); service no-provider / demo / invalid-output / provider-error / timeout / success — all with a mock provider, **no paid calls**.

## API Verification

`GET` → `{configured:false}`. `POST`: missing image → 400 `invalid-image`; bad magic bytes → 415; declared-MIME/sniff mismatch → 415; disallowed type → 415; valid image + no provider → 200 `no-provider`; `mode=demo` → 200 normalized sample analysis. No secrets in responses or logs.

## Build / Lint / Typecheck

- `npm run lint` → clean, **0 warnings** (no `server-only` package is used; the server boundary is structural — see report).
- `npm run typecheck` → clean.
- `npm run build` → success, **199 pages** + the dynamic `/api/vision/analyze` route.

## Known Limitations

- **Dimensions cannot be reliably inferred from one ordinary photo.** `dimensionsStatus` is always `"unknown"` and the validator hard-guarantees no numeric dimensions are ever produced; the UI states this and defers manual/AR entry to later.
- **Confidence is model-reported and approximate**; shown as coarse bands and always user-overridable.
- **Provider dependency:** real analysis needs a configured key. No live provider is set here, so **no real model call was tested this session**; behaviour is covered by mocked tests + the demo/manual fallback.
- No live browser click-through this session (extension offline); verified via HTTP + tests + artifact + code review.
- The demo sample is not derived from the user's photo and is clearly badged as such.

## Next Phase

**Recommended: Phase 06 — Athathi AI Agent / Agent Orchestration.** The pieces now compose cleanly into a tool-using agent: `analyze_room_image → RoomAnalysis` (this phase) → `search_catalog` / `check_budget` / `build_design` (Phase 04 engine, already pure) → `replace_product` → `create_cart` (Phase 03). The vision service already returns the exact structured contract such a tool would expose, and the designer already consumes structured results — so an orchestrator can be layered on without rewriting UI. (Before/After visualization is the alternative, but the agent yields more product value given the current architecture.) **Do not start it.**
