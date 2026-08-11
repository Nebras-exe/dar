# Phase 07 — Skills Used

Per §1, all skills/capabilities available in this Claude Code environment were inspected, and every skill that materially improved this phase was loaded and used. Skill names were not invented.

## Skills discovered (relevant to this phase)

The environment exposes a very large skill catalog. The candidates relevant to Phase 07's needs (frontend, UI/UX, image/vision, React/Next, accessibility, security, testing, browser/visual review) were:

- `frontend-design` — distinctive, production-grade frontend implementation.
- `artifact-design` — design fundamentals for published artifacts (visual review deliverable).
- `code-review`, `security-review` — quality/security passes.
- `claude-in-chrome` — browser automation for live visual QA.
- `dataviz`, `artifact-capabilities` — inspected, not applicable here.
- Numerous provider/vendor automation skills (image models, etc.) — inspected; none provide a **verified, credentialed** image-generation model in this environment, so none were used to avoid faking a live render.

## Skills actually used

| Skill | Why |
| --- | --- |
| **`frontend-design`** | Loaded before building the visualization UI. Its rigor (type hierarchy, restrained motion, atmosphere, spacing, theme discipline) was applied **within the established Athathi warm-light design system** — §23 explicitly forbids inventing a new aesthetic, so the skill's "be bold/new identity" guidance was deliberately subordinated to reusing Athathi's tokens/components. It informed the premium, calm treatment of the before/after frame, the demo mood-wash, the product cards, and the state gallery. |
| **`artifact-design`** | Loaded before publishing the visual-QA artifact. Since a project design system exists, the skill's "honor what's already there" rule governed: the app panels reproduce Athathi's committed warm-light theme faithfully, while the surrounding review-page chrome is theme-aware (light/dark). It shaped the palette, serif/body pairing, spacing, and honest copy of the review deliverable. |

## Native Claude Code capabilities used

- **Testing** via Node's built-in `node:test` runner (the project's convention) — 17 new tests, mock provider, no paid calls.
- **Security review** — a manual, thorough pass (server boundary, catalog truth, MIME sniff, injection defense, no-leak grep of `.next/static`, live error/security matrix over HTTP).
- **`claude-api` knowledge** — informed the image-provider prompt/request contract shape for the (dormant, honestly-gated) real-provider seam.
- **HTTP verification** — `curl` + a Node `fetch`/`FormData` harness against the running app for the API + security matrix (used because the browser extension was unavailable).

## Unavailable capabilities & fallbacks

- **Live image-generation provider (vision/image editing).** No verified, credentialed image model + supported endpoint is configured in this environment. Per §6 the phase does **not** fake a live render: it ships a deterministic, clearly-labelled **Demo Preview** and leaves a one-file `VisualizationProvider` seam for a real provider. Provider/vendor automation skills exist in the catalog but do not constitute a credentialed in-app image model, so they were not wired in.
- **`claude-in-chrome` browser automation.** The Chrome extension did not connect this session (consistent with Phases 04–06). Live device emulation/click-through was therefore unavailable and was **not faked**. Fallback (§27): all-route HTTP 200 checks, the live API + full security/error matrix, responsive/RTL code review, and a **published `artifact-design` artifact** reproducing the before/after slider (interactive, LTR + RTL), the colour-select product cards, and every UI state from the **real demo output**.
