# Phase 04 — Skills, Agents & Capabilities

Reflects what was actually available and used. No skill names are invented.

## Skills used

| Skill | Outcome | How it was used |
| --- | --- | --- |
| `frontend-design` | **Used** | Applied as the review lens for the whole AI Designer flow, with the explicit brief (§36) to avoid a "ChatGPT / generic SaaS wizard" look. It drove concrete calls: room/style **cards** instead of dropdowns, a restrained step rail (desktop) + compact bar (mobile) rather than a giant stepper, `Sparkles` used sparingly (no glowing-AI clichés, no purple, no chat bubbles), warm surfaces, and the honest Demo-Mode framing. It also caught a real defect during review: the wizard hid its active step with `opacity-0` until hydration (blanking content for fresh/no-JS users) — fixed to render content-first. |
| `artifact-design` | **Used** | Loaded before publishing the Phase 04 result-preview artifact. Confirmed the utilitarian treatment, theme-aware + responsive layout, and `tabular-nums` for the money columns. |

## Relevant skills evaluated / deferred

| Skill | Decision |
| --- | --- |
| `code-review` | The substance of Phase 04 is the recommendation engine, which is covered by a real 17-test `node:test` suite plus strict `tsc`. A self-review pass ran inline against that. A full `code-review` run is a strong fit for the Phase 05 agent work. |
| `web-design-guidelines` | The accessibility/interaction bar (focus-visible, `role=radiogroup`/`radio`, `aria-current`/`aria-pressed`, `role=progressbar`, labelled inputs, keyboard drop-zone, reduced-motion) was already internalised from Phases 01–03 and applied directly; no re-fetch needed. |
| `webapp-testing` / Playwright | Not installed. The interactive journey is driven entirely by the pure engine (GENERATE → `generateDemoDesign`, replace → `pickReplacement`, remove/edit → `summarize`, add-all → the Phase 03 cart), so it is unit-tested at the logic layer; the browser tool was attempted for E2E but did not connect this session. |
| `localize` | Arabic authored directly in typed dictionaries with a compile-time key-parity guarantee (130 design keys, EN == AR); hand-audited. A bulk-translation tool would reduce quality. |
| `dataviz`, `higgsfield` (image/video), motion libraries | Not warranted. The result is a structured plan, not a chart or a generated room image (explicitly out of scope, §31). Motion is CSS-only and reduced-motion-aware. |

## Agents / subagents

- No subagents spawned. Phase 04 is one coherent feature built on an established codebase; it parallelised naturally as a task list (engine → tests → i18n → wizard → result → route/CTAs → QA/docs) rather than across isolated agents. A cold subagent would have re-derived context already held here.

## MCP & tooling capabilities

| Capability | Status | Note |
| --- | --- | --- |
| Build / lint / typecheck / test | **Used** | `next build` (199 pages), `eslint` (0 warnings), `tsc --noEmit`, and `node --test` all pass. |
| `node:test` (built-in runner) | **Used** | 17 new design tests (32 total with Phase 03) over the pure engine — no test dependency. The resolver hook (`scripts/ts-resolver.mjs`) was extended to map the app's `@/…` path alias so the domain layer runs unchanged under the runner. |
| **Claude-in-Chrome (browser)** | **Attempted, unavailable this session** | The extension did not connect (as in Phases 02–03). Live click-through of the wizard was therefore not possible. |
| Browser QA substitute | **Used** | Verified all routes over HTTP against the running dev server (status 200 for `/en|ar/design` + shop/cart/home; server-rendered RTL `dir="rtl"`; 14 homepage CTAs now resolve to `/[locale]/design`; no leftover `#design` CTA anchors; no runtime errors in the dev log). The interactive journey's logic is covered end-to-end by the unit-tested engine functions the UI dispatches to. |
| Visual review artifact | **Used** | Published a self-contained artifact rendering the **real** engine output for three briefs (incl. a keep-the-sofa case and a very-low-budget case) across all three tiers, so the design result could be visually reviewed despite the browser being offline. |

## Net effect

`frontend-design` kept the flagship experience premium and non-cliché (and surfaced a real hydration/blank-content bug), the extended `node:test` suite gave the deterministic engine a genuine safety net, and the HTTP checks + result artifact substituted rigorously for the unavailable browser.
