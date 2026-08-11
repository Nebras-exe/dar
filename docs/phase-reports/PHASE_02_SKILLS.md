# Phase 02 — Skills, Agents & Capabilities

Reflects what was actually available and used. No skill names are invented.

## Skills used

| Skill | Outcome | How it was used |
| --- | --- | --- |
| `frontend-design` | **Used** | Kept the homepage away from generic AI/SaaS aesthetics: committed to the warm editorial "interior studio" direction, distinctive display typography (Fraunces), intentional composition, and original illustration over stock clichés. Directly shaped the hero, before/after, and section rhythm. |
| `web-design-guidelines` | **Used** | The Vercel Web Interface Guidelines (fetched in Phase 01, applied again here) served as the build + review checklist: icon-button `aria-label`, `:focus-visible`, skip link, semantic headings/landmarks, `role="slider"` with keyboard support, `tabular-nums`, `text-wrap: balance`, `translate="no"`, reduced-motion, no `transition: all`, touch-action for the drag slider. |

## Relevant skills evaluated / deferred

| Skill | Decision |
| --- | --- |
| `code-review`, `ui-ux-pro-max` | The homepage is presentational; `frontend-design` + the guidelines checklist covered the design review inline. `code-review` is better reserved for a phase with substantial logic (catalog/agent). |
| `webapp-testing`, Playwright | No E2E suite in scope for a marketing homepage; QA used build/lint/typecheck + live browser inspection + rendered-DOM checks. Adopt when interactive flows (designer, cart) exist. |
| `localize` | Bilingual architecture is hand-built and the homepage copy is authored directly in typed dictionaries; a bulk-translation tool wasn't needed. |
| `dataviz`, motion libraries (`gsap`, `three`, `lottie`) | Not warranted — motion is CSS-only (fade-up + IntersectionObserver reveal) to protect performance. |

## Agents / subagents

- No subagents spawned. The homepage is a single coherent build; the design review was performed inline against the guidelines checklist and live screenshots. A dedicated design-review/QA subagent would not have added value here (and could not screenshot any better).

## MCP & tooling capabilities

| Capability | Status | Note |
| --- | --- | --- |
| Build / lint / typecheck | **Used** | `next build`, `eslint`, `tsc --noEmit` all pass. |
| **Claude-in-Chrome (browser)** | **Available & used this phase** | Unlike Phase 01, the extension connected. Captured and reviewed **English desktop** and **Arabic (RTL) desktop** across the full page (hero, design showcase, budget, before/after drag, styles, value strip). Confirmed no console errors on load. |
| Browser mobile emulation | **Limited** | `resize_window` did not change the rendered viewport width — screenshots always captured at ~1568 CSS px. True mobile emulation wasn't possible, so **mobile was verified via mobile-first responsive code review** (documented as a limitation). |
| higgsfield image generation | **Available, not used** | Could generate interior imagery, but licensing/asset-pipeline and the risk of "generic AI rooms" made labelled original illustration + placeholders the honest choice for Phase 02. Flagged as a production-imagery option. |
| Playwright | **Not installed** | Deferred. |

## Net effect

`frontend-design` drove an original, warm identity (the hand-drawn `RoomIllustration` is the visual anchor rather than stock photos), and `web-design-guidelines` gave a concrete accessibility/UX bar that the new interactive pieces (before/after slider, reveal animations, header) were built and checked against.
