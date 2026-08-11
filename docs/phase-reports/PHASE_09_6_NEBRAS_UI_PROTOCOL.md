# Phase 09.6 — Nebras UI Protocol (Premium UI Rebuild Pass) — Report

_Status: ✅ Complete & verified. A focused, aggressive design-language rebuild after the user judged the Phase 09.5 pass "not noticeable enough". No business logic changed; all 140 tests pass; lint/typecheck/build/audit:arabic green. Finished running on **port 3000**. Phase 10 not started._

## Previous UI workflow discovered

Searched `~/.claude/` (skills, plugins, projects), `~/.claude.json`, and the repo for a "Nebras/Nibras protocol" or prior UI workflow. **No `Nebras`/`protocol` skill or workflow file exists** — so, per the prompt's instruction ("If 'Nebras Protocol' is not an actual file/skill, do NOT invent it"), this phase's workflow was defined from the **verified installed skills** (`docs/ALL_LOCAL_SKILLS_INVENTORY.md`): `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines`, `vercel-react-best-practices`, plus the existing Athathi design system.

## Tooling status (honest)

Verified this session — not assumed:

- **`magic-21st` MCP** — configured in `~/.claude.json` (global) but its tools **do not surface** in this session; **not operational** here. Not used.
- **`playwright` MCP** — scoped only to the `a different local` project in `~/.claude.json`, so it is **not loaded** in the Athathi session; could not be invoked.
- **`claude-in-chrome`** — `list_connected_browsers` returned `[]`; **no browser connected**.
- **`higgsfield` MCP** — available, but the account balance is **0 credits (free plan)**; generating an image library would require a purchase, which was **not initiated** (a financial action on the user's behalf). No external images generated.

**Consequence:** no live screenshots and no externally-generated photography were possible. Rather than fake either, the improvement was delivered as a **code-level design-language rebuild** (the highest-leverage lever available) and verified against the **real server-rendered output** + a **published reconstruction artifact**.

## Exact skills used

| Skill | Path / source | How it was applied |
| --- | --- | --- |
| **`ui-ux-pro-max`** (plugin 2.5.0) | `~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/` | Ran its **design-intelligence CLI** (`search.py`) for `typography` (query: premium furniture editorial luxury) and `landing` (luxury furniture hero). Findings applied: (1) it confirmed the **editorial serif + clean sans** pairing for luxury/premium — Athathi already uses Fraunces + Hanken Grotesk, so the actionable takeaway was to **increase heading↔body contrast** (bigger, more editorial display); (2) its "AI-Driven Dynamic Landing" pattern ("Prompt/Input Hero → Generated Result Preview → How it Works", "show, don't tell", "immediate value demonstration") directly shaped the new hero. |
| **`frontend-design`** (built-in + plugin) | `~/.claude/plugins/.../frontend-design/` | Primary creative direction for the hero composition, category rebuild, typographic scale, and shape language — kept within Athathi's committed warm-light system (no new identity). |
| **`web-design-guidelines`** (Vercel) | `~/.claude/skills/web-design-guidelines/SKILL.md` | Its rules governed the QA pass: hover states that don't fight keyboard focus, `prefers-reduced-motion` on all motion, colour-not-only state, logical properties for RTL, legible label contrast (scrim over category images). |
| **`vercel-react-best-practices`** (know-how) | `~/.claude/skills/vercel-react-best-practices/` | Kept the new work **server-rendered** — the hero and category grid remain server components (no new client bundles); imagery stays inline SVG (no external requests, no layout shift). |
| `node:test` + `scripts/audit-arabic.mjs` | repo | Gates (140 tests + Arabic guard). |

## magic-21st usage

**None** — not operational this session (documented above). No components were imported from it.

## UI/UX Pro Max recommendations applied

1. **Editorial serif + clean sans, high contrast** → bumped the display scale dramatically (`.text-display` clamp `2.75rem→5.25rem`, tighter `-0.028em` tracking, Fraunces `opsz` 144 optical sizing) and enlarged section titles.
2. **"Show, don't tell" AI landing hero** → the hero now shows a real room + real catalog pieces with OMR prices + the AI/budget cue, not an abstract rectangle.
3. **Immediate value demonstration** → the 3-beat promise strip (Show your room → Set budget & taste → Buy the real design) sits directly under the headline.

## frontend-design decisions

- **Oversized editorial display type** as the single most obvious change.
- **Hairline "kicker" section markers** (`kicker` — an eyebrow with a leading rule) replacing plain uppercase eyebrows, for an interior-magazine feel.
- **Image-led category grid** (real furniture art + gradient scrim label + count + a bento featured tile) replacing generic gradient-and-icon tiles.
- **Reduced "rounded-card syndrome":** editorial hairline rules (`.rule-hair`), open composition, ambient washes (`.bg-linen`, radial glow) instead of everything boxed.

## Animation skills used / motion

No JS animation library (CSS-only, per `vercel-react-best-practices` + the phase-09.5 system). Reused/extended: hero staggered entrance (`animate-fade-up` with delays), category **image zoom on hover** + arrow micro-interaction, the 09.5 `.lift`/value-pop/quote-stagger. All `prefers-reduced-motion`-safe (guard confirmed in the built CSS bundle).

## Imagery skills / provider used

- **No external image provider** (higgsfield unfunded; documented). 
- Imagery is the **owned generated-art system** (upgraded in 09.5) now used far more prominently: the **hero** floats 3 real pieces, the **category grid** shows a real representative piece per category, and the **product gallery** already uses 4 art variants. This makes furniture visibly present across the homepage without external assets.

## Images created

- **No binary image files** were added (kept offline/deterministic/license-clean).
- QA: real server-rendered HTML snapshots in `docs/qa/phase-09-6/after/` (7 routes) + a published reconstruction artifact of the new hero + categories.

## Homepage changes

- **Hero fully rebuilt** (`features/home/hero.tsx`): oversized `.text-display` headline; 3-beat promise; dual CTA; an immersive room centrepiece with a **sample badge**, an **AI "5 matching pieces" cue**, **3 floating real product cards** (art + name + OMR price), and a **budget/estimated-total strip** + "real catalog pieces · real OMR prices" caption.
- **Categories rebuilt** (`features/home/categories.tsx`): image-led tiles with real product art, gradient scrim labels + counts, a **featured 2×2 tile**, and a "Explore Furniture" affordance. (The homepage now renders **21 real product-art SVGs** vs the old generic gradient tiles.)
- **Section headers** (`components/ui/section.tsx`): kicker markers + larger display titles across every homepage section.
- **New tokens/utilities** (`globals.css`): `.text-display`, `.kicker`, `.rule-hair`, `.measure`, `.bg-linen`, editorial heading tuning.

## Shop / product-detail changes

- Every product surface inherits the bolder cards (09.5) + new section headers.
- **Product detail:** the image gallery is now **sticky on desktop** (`lg:sticky`), so the piece stays in view while reading specs.

## Designer / Agent / custom / supplier changes

- These pages inherit the new **section-header + typography + card** language automatically (shared components). No logic touched. The Agent value-pop and RFQ quote-stagger from 09.5 remain. Deeper per-flow reworks (wizard visuals, custom studio) were scoped for a later pass to keep this change safe and obvious rather than sprawling.

## Desktop / mobile QA

Verified via real rendered HTML at the structural level (browser tooling unavailable): the hero grid collapses to one column under `lg`, the floating product cards hide the middle card on small screens (`hidden sm:flex`), the category grid steps 2→3→4 columns, and no physical-direction classes were introduced (logical properties throughout). Pixel-level device screenshots were **not** possible and are not claimed.

## Arabic / RTL QA

`/ar` verified `dir="rtl"` with the new hero rendering correct Arabic (`اعرض غرفتك` etc.), zero reversed strings, `audit:arabic` clean, EN/AR parity exact (added `hero.step1–3`, `hero.realCaption`, `categories.count`, `shop.card.customizable` to both). Arrows/scrims use logical properties; the display type drops negative tracking + optical axis for Arabic.

## Playwright screenshots

**Not available** (Playwright MCP not in this project's scope; Chrome extension offline). Not faked. Substituted with real server-rendered HTML snapshots (`docs/qa/phase-09-6/after/`) + a published homepage-reconstruction artifact built from the live SVG output.

## Performance

- Hero + categories stay **server components**; no new client bundles.
- Imagery is inline generated SVG — **no image downloads, no layout shift, no bundle growth**.
- Motion is transform/opacity/box-shadow only. Build shape unchanged: **219 pages**, static/dynamic boundary preserved.

## Tests / gates

`npm run audit:arabic` → clean · `npm test` → **140 passing** · `npm run lint` → 0 warnings · `npm run typecheck` → clean · `npm run build` → success (219 pages). Running on **http://localhost:3000**.

## Limitations

- **No live browser QA or device screenshots** (Playwright/Chrome/magic-21st all unavailable this session) — verified via real rendered output + artifact + code review, honestly documented.
- **No externally-generated photography** (higgsfield unfunded; a purchase was not initiated). Furniture presence was increased via the owned generated-art system; real photography remains the eventual upgrade behind the unchanged `ProductImage` seam.
- Designer-wizard and custom-studio deep visual reworks were intentionally deferred to keep this pass focused and low-risk.

## Recommendation before Phase 10

The homepage/hero/categories now read as a premium editorial furniture product. Before Phase 10, the two highest-value follow-ups both depend on external access this session lacked: (1) **fund higgsfield (or connect a real image provider)** to drop true photography into the ready `ProductImage`/`VisualizationProvider` seam, and (2) **connect Playwright/Chrome** for real device/RTL screenshot QA. **Do not start Phase 10.**

## Viewable evidence

- Homepage rebuild artifact (real rendered output): the published Phase 09.6 artifact.
- Route HTML snapshots: `docs/qa/phase-09-6/after/`.
