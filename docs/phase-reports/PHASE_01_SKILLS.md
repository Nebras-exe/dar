# Phase 01 — Skills, Agents & Capabilities

This document reflects **what was actually available and actually used**. No skill names are invented.

## Skills invoked (loaded into context)

| Skill | Outcome | How it was used |
| --- | --- | --- |
| `frontend-design` | **Used** | Set the aesthetic discipline for the whole phase — commit to a bold, cohesive direction (premium interior studio), avoid generic "AI slop" (Inter/Roboto, purple gradients, cookie-cutter layouts), pick distinctive typography (Fraunces + Hanken Grotesk), and treat backgrounds/motion/spacing with intent. Directly shaped tokens, fonts, and the showcase page. |
| `web-design-guidelines` | **Used** | Fetched the live Vercel Web Interface Guidelines (via WebFetch) and used the full ruleset as the QA checklist while building **and** reviewing: icon-button `aria-label`, `:focus-visible`, form labels/`autocomplete`/`inputmode`, `prefers-reduced-motion`, `tabular-nums`, `text-wrap: balance`, `translate="no"` on identifiers, `theme-color`/`color-scheme`, RTL/logical properties, no `transition: all`. |
| `design-system` | **Evaluated, not applicable** | Loaded to check relevance; it is a **game design document (GDD) generator**, not a web UI/design-token tool. Correctly *not* used. Recorded here for honesty. |

## Relevant skills available but not invoked (and why)

| Skill | Why not invoked this phase |
| --- | --- |
| `ui-ux-pro-max`, `frontend-design:frontend-design`, `code-review:code-review` | The core `frontend-design` skill + Web Interface Guidelines already covered the design and self-review needs for a foundation phase. Reserve `code-review` for a phase with substantial feature logic. |
| `tailwind` | Tailwind v4 token/utility work here was straightforward; no additional guidance needed beyond the design system I authored. |
| `vercel-react-best-practices` | Useful later for data-fetching/server-component patterns; Phase 01 has almost no data/async logic. |
| `localize` | Phase 01 deliberately does **not** translate the whole product; the bilingual *architecture* (routing, dictionaries, RTL) is hand-built. Revisit when translation volume grows. |
| `webapp-testing` | No automated E2E suite is in scope for the foundation; QA was build/lint/typecheck + rendered DOM/CSS inspection. Adopt when interactive flows (designer, cart) exist. |
| `dataviz`, `artifact-design`, `security-review`, motion skills (`css-animations`, `microinteractions`, `gsap`, `three`, `lottie`) | Not material to a foundation phase; several become relevant in later feature/marketing phases. |

## Agents / subagents

- No subagents were spawned. The foundation work is a single coherent build; per the working guidance, cold-start subagent spawns were not warranted here and would have added cost without improving quality. Subagents (e.g. dedicated UI/UX review, accessibility review, QA) are a good fit for later, larger phases.

## MCP & tooling capabilities

| Capability | Status | Note |
| --- | --- | --- |
| Build / lint / typecheck | **Available & used** | `next build`, `eslint`, `tsc --noEmit` all run and pass. |
| WebFetch | **Available & used** | Fetched the live Web Interface Guidelines. |
| Claude-in-Chrome (browser screenshots) | **Unavailable** | The Chrome extension was **not connected** in this environment, so live visual screenshot inspection was not possible. Fallback: thorough rendered-HTML + compiled-CSS inspection against a running production server (verified `lang`/`dir`, headings, ARIA, generated utility CSS, RTL glyph flipping, both locales). |
| Playwright | **Not installed** | Not added in Phase 01; browser-automation testing deferred to a feature phase. |

## Net effect on quality

`frontend-design` pushed the work away from a generic template toward a distinctive, warm, editorial identity; `web-design-guidelines` provided a concrete, testable accessibility/UX bar that the components and page were built and checked against. Together they materially raised the Phase 01 output.
