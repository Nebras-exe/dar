# Phase 09.5 — Skills Used

Discovery source: `docs/ALL_LOCAL_SKILLS_INVENTORY.md` (1,282 global skills, 3 installed plugins, MCP servers). Only capabilities that **materially** improved the visual upgrade were used; irrelevant skills were deliberately not activated to inflate a count.

## USED

| Skill / capability | Source / path | What it improved in Athathi |
| --- | --- | --- |
| **`frontend-design`** (built-in + `frontend-design@claude-plugins-official`) | `~/.claude/plugins/.../frontend-design/` | Loaded and applied its calibration (form heuristic, restrained motion, atmosphere/depth, type & spacing discipline) to the generated-art rebuild, the product card, the hero room, and the motion system — kept within Athathi's committed warm-light system rather than a new look. |
| **`web-design-guidelines`** (know-how) | `~/.claude/skills/web-design-guidelines/` | Guided the interaction/a11y decisions: hover states that don't fight keyboard focus, `prefers-reduced-motion` on every new animation, colour-not-only state, focus-visible preserved. |
| **`artifact-design`** (built-in) | session skill | Shaped the published visual-QA artifact (theme-aware, self-contained, honest framing) built from the real rendered SVGs — the standing browser-QA fallback. |
| **`claude-in-chrome`** (MCP) | runtime | Attempted for live browser QA/screenshots (`list_connected_browsers`) — **no browser connected** (see NOT USED). Its unavailability was verified, not assumed. |
| **`node:test`** (project convention) | — | Ran the full 140-test suite to prove no visual change broke logic. |
| **`audit:arabic`** (Phase 08.1 guard) | `scripts/audit-arabic.mjs` | Re-run after the small i18n additions (`shop.card.customizable`) — clean. |

## NOT USED — and why

| Skill / capability | Why not used |
| --- | --- |
| **`higgsfield` MCP + `higgsfield-*` / `nano-banana-prompt` / `codex-imagegen` (image generation)** | These generate **remote** image assets (returned as external URLs). Embedding ~80 remote product photos would (a) break the app's offline, zero-external-asset guarantee, (b) add a hard runtime dependency + latency + licensing/consistency risk, and (c) regress performance and the deterministic demo model. The higher-value, safer path was to rebuild the **owned, offline, deterministic** generated-art system into premium material-aware "studio" illustrations — original imagery, no external calls, keeps the demo disclosure. The higgsfield seam remains available for real product photography / the Phase 07 `VisualizationProvider` later. |
| **`playwright` MCP** | Configured only for the `a different local` project scope in `~/.claude.json`, so it is **not loaded** in the Athathi session; it could not be invoked here. |
| **`ui-ux-pro-max`** (plugin 2.5.0) | Its CLI generates a **separate** design-token/template scaffold; Athathi already has a mature, committed token system (`globals.css`) and component library. Introducing a parallel system would fragment the design language (the opposite of this phase's goal). Its principles informed the manual polish instead. |
| **`security-review` / `code-review` / `testing-strategies`** | This phase changed **presentation only** (SVG art, CSS motion, card markup) — no logic, auth, RLS, money, or data paths. A full security/code review pass would not materially improve a visual-only diff; the existing 140 tests + typecheck + lint + build were the appropriate gate. (These remain the right tools for logic phases like 08/09/10.) |
| **`localize`** | Only one bilingual key was added (`customizable`); the Phase 08.1 `audit:arabic` + i18n parity tests already cover it. A full localization pipeline run was unwarranted for one string. |
| **`seo-audit` / `schema-markup`** | Out of scope for a visual/interaction pass; deferred to a dedicated SEO pass (noted for Phase 10 launch prep). |
| **`css-animations` / `gsap` / `animejs` / `three`** | Athathi is deliberately **CSS-only** for motion (no JS animation runtime, best perf + reduced-motion story). The coherent motion system was built with CSS transitions/keyframes; a JS animation library would add weight against the phase's performance guardrail. |
| **`higgsfield-*` video / `ads-*` / media-ad families** | Marketing-asset generation — post-launch, not app UI. |
| Vendor `*-automation` (832), game-dev, finance skills | Not relevant to a furniture-app visual upgrade. |

## Note on honesty

No skill is claimed as "used" that was not actually invoked. `claude-in-chrome` was genuinely attempted and found unavailable; `higgsfield`/`playwright`/`ui-ux-pro-max` were considered and consciously declined for the documented architectural reasons.
