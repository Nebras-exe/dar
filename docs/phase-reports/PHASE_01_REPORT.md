# Phase 01 Report — Foundation & Design System

_Athathi (أثاثي) · AI Interior & Furniture Marketplace for Oman · 2026-08-09_

## Summary

Phase 01 established a world-class technical and visual foundation for Athathi. Starting from an essentially empty workspace, I scaffolded a modern Next.js (App Router) + TypeScript + Tailwind v4 project, authored a complete CSS-variable design-token system, wired a bilingual **Arabic RTL + English LTR** architecture via `[locale]` routing, built a library of custom premium UI primitives, and shipped one polished **foundation showcase page** that proves the visual language in both languages. Build, lint, and typecheck all pass. The look is a warm, editorial "premium interior studio" — deliberately not a generic AI/SaaS template.

The foundation is intentionally scoped: **no** final homepage, shop, catalog, cart, AI designer, agent, or backend. It is the base later phases build on.

## Environment

- **Node** v24.18.0 · **npm** 11.16.0 · **git** 2.54.0 (workspace was not a repo; the scaffold initialised one).
- **Next.js** 16.3.0 · **React** 19.2.8 · **Tailwind CSS** v4 · **TypeScript** 5 · **ESLint** 9.
- Platform: Windows. Package manager: npm (no pnpm/yarn present).

## Skills

- **Used:** `frontend-design` (aesthetic direction — bold, cohesive, non-generic; drove typography, tokens, and composition) and `web-design-guidelines` (fetched the live Vercel Web Interface Guidelines and used them as the build/QA checklist).
- **Evaluated, not applicable:** `design-system` (it is a game-GDD generator, not a web design-token tool).
- **Deferred (relevant later):** `code-review`, `ui-ux-pro-max`, `vercel-react-best-practices`, `localize`, `webapp-testing`, motion skills.
- **Agents:** none spawned — a single coherent foundation build did not warrant cold-start subagents.
- Full detail + tooling availability in `docs/phase-reports/PHASE_01_SKILLS.md`.

## Architecture

Major decisions (rationale in `docs/ARCHITECTURE.md`):

- **`[locale]` URL routing** (`/en`, `/ar`) with `src/proxy.ts` negotiating `Accept-Language` (never IP). `<html lang dir>` is set on the server → correct direction on first paint, deep-linkable locales.
- **Typed dictionaries** — `en.json` defines the `Dictionary` type; other locales must satisfy it (missing key = compile error).
- **Custom design system, no component library** — to avoid a template look and match the premium brief.
- **Single warm light theme** as CSS variables mapped into Tailwind v4 `@theme` (usable as `bg-brand`, `text-muted`, radius/shadow vars).
- **Framework-agnostic `lib/`** so future backend/mobile can reuse the TypeScript core.
- **Adopted Next 16 `proxy.ts`** (replaces deprecated `middleware.ts`).

## Design System

- **Palette:** warm neutrals (ivory → walnut → charcoal) + restrained clay `brand` (#9A5B3B) and sage `accent` (#5E6A53); semantic success/warning/danger. No neon, no purple gradients.
- **Typography:** Fraunces (English display) + Hanken Grotesk (English body) + IBM Plex Sans Arabic (Arabic), with direction-aware `--font-heading`/`--font-body` and Arabic-specific tracking/line-height.
- **Tokens:** spacing rhythm, radius scale, four soft shadows, motion easings/durations, container widths — all CSS variables.
- **RTL:** logical properties throughout; only directional glyphs flip (`rtl:rotate-180`); identifiers carry `translate="no"`.
- **Accessibility baked in:** `:focus-visible` rings, real form labels, `aria-label`/`aria-pressed`/`aria-expanded`/`aria-busy`, `prefers-reduced-motion`, `color-scheme`/`theme-color`.
- Full spec in `docs/DESIGN_SYSTEM.md`.

## Files

**Config / tokens**
- `package.json` (name `athathi`, `typecheck` script), `src/app/globals.css` (tokens + base + utilities), `src/proxy.ts`.

**i18n** — `src/i18n/config.ts`, `src/i18n/dictionaries.ts`, `src/i18n/dictionaries/{en,ar}.json`.

**lib** — `src/lib/fonts.ts`, `src/lib/utils.ts` (`cn`, `formatOmr`).

**UI primitives** — `src/components/ui/`: `button`, `icon-button`, `container`, `section`, `badge`, `chip`, `input` (+`Textarea`/`Field`), `card`, `image-frame`, `divider`, `skeleton`, `empty-state`.

**Layout / shared** — `src/components/layout/{header,site-footer}.tsx`, `src/components/shared/{logo,locale-switcher}.tsx`.

**App** — `src/app/[locale]/{layout,page}.tsx`.

**Showcase blocks** — `src/features/foundation/{placeholder-image,color-swatch,style-chips,product-preview}.tsx`.

**Docs** — `docs/{PRODUCT_VISION,MVP_SCOPE,USER_JOURNEYS,ARCHITECTURE,DESIGN_SYSTEM,SKILLS_USED,PROJECT_STATUS}.md` and `docs/phase-reports/{PHASE_01_SKILLS,PHASE_01_REPORT}.md`.

## Dependencies

- **Added:** `lucide-react` — one consistent, elegant icon system (justified; avoids emoji/mixed icon styles).
- **From scaffold:** `next`, `react`, `react-dom`, `tailwindcss` + `@tailwindcss/postcss`, `typescript`, `eslint` + `eslint-config-next`, `@types/*`.
- **No** UI framework, CSS-in-JS, animation library, or state library added — the visual language is hand-built. Fonts are self-hosted via `next/font` (no runtime font requests).

## Homepage / foundation page

Delivered the **foundation showcase** at `/[locale]` (not the final homepage, by design):

- Premium hero: Phase badge, editorial display headline, the **Room + Budget + Style → real shoppable design** equation, primary/secondary CTAs (**Design My Space / صمّم مساحتي**, **Shop Furniture / تصفّح الأثاث**), and a hero visual with a floating budget/agent-progress card.
- **Typography** section rendering the type scale in **both** languages side-by-side.
- **Colour** section documenting every palette + semantic token with hex values.
- **Buttons** section: all variants/sizes/states (loading, disabled, icon) + an accessible budget input.
- **Chips & badges** (interactive single-select style picker) and an editorial **product card** (Walnut Coffee Table, price in OMR, "Sample data" label).
- A clearly-labelled **demo/sample** notice — honest about mocked content.
- Sticky header with logo, nav, actions, locale switch, and an accessible mobile menu; a minimal footer with market/currency context.

## QA (visual checks performed)

Live browser **screenshot** inspection was **unavailable** (Claude-in-Chrome extension not connected). I instead inspected the **rendered output of a running production server**:

- Verified `<html lang="en" dir="ltr">` and `<html lang="ar" dir="rtl">` render correctly, with the correct localised H1 in each.
- Confirmed **both locales** render their own content (Arabic hero, product name طاولة قهوة من الجوز, Arabic price ٦٩٫٠٠٠, demo notice, currency ر.ع).
- Confirmed accessibility attributes in the DOM: all icon-only controls have `aria-label` (Search/Account/Cart/menu/favourite/language/home), chips expose `aria-pressed` (6), mobile toggle exposes `aria-expanded`, one `<h1>` with a sensible `<h2>`/`<h3>` hierarchy, form control has a `<label for>`.
- Verified the **compiled CSS** actually generates the custom utilities (`bg-brand`, `text-eyebrow`, `bg-linear-to-br`, palette backgrounds, aspect ratios `4/5·4/3·16/10`, and that `rtl:rotate-180` targets `[dir=rtl]` so arrows flip in Arabic).
- Checked the server log for hydration/console errors — none.
- Reviewed against the Vercel Web Interface Guidelines (focus, forms, reduced-motion, tabular-nums, `translate="no"`, `theme-color`, no `transition: all`).

**Issues found and fixed during QA:** two empty-interface lint errors (converted to type aliases); reduced `aria-busy` noise so it only appears while loading; repositioned the hero floating card to avoid any clipping by the section's `overflow-hidden`; migrated `middleware.ts` → `proxy.ts` to clear the Next 16 deprecation warning.

## Tests

| Command | Result |
| --- | --- |
| `npm run build` | ✅ Pass — compiled successfully; `/en` and `/ar` prerendered as static HTML; no warnings. |
| `npm run lint` | ✅ Pass — 0 problems (after fixing 2 empty-interface errors). |
| `npm run typecheck` (`tsc --noEmit`) | ✅ Pass — 0 errors. |
| Runtime smoke | ✅ `/` → 307 redirect (locale negotiation); `/en` → 200; `/ar` → 200. |

## Known Limitations

- Live screenshot/visual browser inspection unavailable (extension not connected) — mitigated by thorough DOM/CSS inspection as above; recommend a screenshot pass in an environment with the extension.
- Header nav + Search/Account/Cart are **intentional foundation placeholders**; real routes/behaviour arrive with their features.
- No E2E/unit test suite yet (no interactive flows to cover in P01).
- Placeholder furniture imagery only; no external assets shipped.
- Single light theme (deliberate); dark mode can be layered onto the token system later.

## Next Phase

**Phase 02 — Final Homepage & Product Storytelling.** Build the editorial marketing homepage on this foundation (premium hero, "How Athathi Works", AI-designer and budget-aware teasers, before/after concept, featured furniture and supplier teasers, final CTA, footer), add section-reveal motion polish, and lay an SEO metadata baseline.

> Phase 02 should **not** begin until requested. Later phases (catalog, product cards/pages, demo data, search/filter, cart foundations, then the AI designer/agent) follow per `docs/MVP_SCOPE.md`.
