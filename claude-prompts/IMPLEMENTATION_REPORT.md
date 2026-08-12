# DAR / Athathi Redesign — Phase 02 Implementation Report

**Approach:** applied the **Terra Interiors** visual system to the *existing* Next.js application — no rebuild, no static-HTML replacement. Because the app was already ~85% aligned (Discovery §1) and every surface reads **semantic CSS custom properties**, the redesign is driven from the **token layer**: one edit to `globals.css` re-skins the whole site coherently, plus targeted Terra-signature treatments (headline italics, olive-inverse footer, blob/icon-badge utilities).

**Decisions confirmed with the user (Discovery §11.1 gate):**
1. **Accent hierarchy → Terra literal:** olive-700 (`#4F5A3E`) **primary**, terracotta-500 (`#B15E39`) **secondary**.
2. **Typography → keep** Fraunces (display) + Hanken (body) + IBM Plex Arabic, **adopt** Terra's headline treatment (one italic emphasis word) + tracked eyebrows + type rhythm.
3. **Blob dividers → added** as a sparse, opt-in utility (not applied everywhere).

**All quality gates pass:** `audit:arabic` ✓ · `test` 348/348 ✓ · `lint` ✓ · `typecheck` ✓ · `build` ✓ (1057 static pages). Verified live on **http://localhost:3000** (`/en` + `/ar` → 200); confirmed the olive/terracotta/sand tokens, olive-inverse footer, blob/icon-badge utilities, and the italic-headline rule are present in the **served** CSS, and the hero renders its `<em>` emphasis.

---

## Files created
- `src/components/…` — *no new component was needed*: the existing `SectionHeader` (in `components/ui/section.tsx`) already implements Terra's eyebrow → serif-display → description pattern, so it was reused rather than duplicated (per the "don't duplicate components" rule).
- `claude-prompts/IMPLEMENTATION_REPORT.md` (this file).

## Files modified
| File | Change |
|---|---|
| `src/app/globals.css` | **Core token reconciliation** — neutrals retuned to Terra sand/ink; `--color-brand`→olive-700, `--color-brand-hover`→olive-900, `--color-brand-foreground`→sand; `--color-accent`→terracotta-500 (+`--color-accent-hover`, retinted `--color-accent-soft`); added `--color-inverse`/`--color-inverse-foreground` (olive footer), `--radius-blob`; added the italic-headline `em`/`i` rule (with Arabic → olive-colour fallback), `.blob` utility (RTL-mirrored), `.icon-badge` utility. |
| `src/app/[locale]/layout.tsx` | `viewport.themeColor` → new sand background `#f8f3ec`. |
| `src/components/layout/site-footer.tsx` | Rebuilt as a **warm olive-inverse block** (Terra footer) — inverse tokens, sand text at tiered opacities, larger vertical rhythm. |
| `src/components/shared/logo.tsx` | Added `onInverse` prop so the wordmark + arch mark render correctly on the dark footer. |
| `src/features/home/hero.tsx` | Headline emphasis changed from a **colour swap** to Terra's **italic word** (`<em>`) — the signature treatment. |
| `eslint.config.mjs` | Ignore `design-reference/**` (read-only reference export was being linted). |

## Components created / refactored
- **Refactored:** `SiteFooter` (olive-inverse), `Logo` (inverse variant), `Hero` (italic emphasis).
- **Inherited automatically via tokens** (no per-file edits needed): `Button` (olive primary / terracotta secondary), `Badge` (`brand`→olive, `accent`→terracotta), `Chip`, `Card`, `Input`, `Section`, `SectionHeader`, `ProductCard`, `ProductGrid`, header, all shop/AI/cart/checkout surfaces — every one consumes `bg-brand`/`text-accent`/`border`/etc., so the palette flipped everywhere at once.

## Design tokens implemented (from `_ds_manifest.json` / `tokens/*.css`)
- **Neutrals:** background `#F8F3EC` (sand-100), surface `#FDFBF8` (cream-white), elevated `#FFFFFF`; text `#2B2621`/`#6E6559`/`#9A8F80` (ink); borders `#E4D7C3`/`#F1E9DD` (sand-300/200).
- **Primary (olive):** brand `#4F5A3E`, hover `#3C4530`, soft `#E6E9E0`, on-brand text `#F8F3EC`.
- **Secondary (terracotta):** accent `#B15E39`, hover `#9B4E2E`, soft `#F1E2D7`.
- **Inverse block:** `#313A29` bg / `#EEF0E6` text.
- **Radii:** kept the app's fine-grained scale (already matches Terra's 6/14/28/pill); **added** `--radius-blob: 2rem 6rem 2rem 6rem`.
- **Shadows / motion:** kept — the app's soft warm shadows and `--ease-soft`/`--ease-out` (150/220/340ms) already match Terra's philosophy (`ease-standard`, ~150–240ms, no bounce).
- **Type treatment:** italic-word headline emphasis; tracked small-caps eyebrows (`.kicker`/`.text-eyebrow`, now olive); Terra type scale honoured by the existing display utilities.
- **Product-colour taxonomy left untouched** — `catalog/taxonomy.ts` olive/terracotta hexes are *furniture colours* (data), deliberately separate from UI-chrome tokens.

## Animations implemented
Kept the existing **CSS-only** system (no JS animation library added — consistent with Terra's calm, minimal-motion brief and the "avoid large dependencies" rule):
- Hero entrance `animate-fade-up` (staggered), `[data-reveal]` section reveals + staggered card reveals, `.lift` hover (translateY + shadow, **no scale** — matches Terra), button token-transitions + `active:translate-y-px`, `animate-fade` image/variant cross-fade, `value-pop`, `sheen` skeletons, Before/After staged loading.
- All gated behind `prefers-reduced-motion` (unchanged). The italic-headline change is static (no new motion).

## Responsive work
No layout regressions introduced; the app's existing responsive structure (fluid `clamp()` display type, `Container` widths, grid breakpoints, mobile filter sheet, stacked splits) was preserved. The token/treatment changes are size-agnostic. The olive-inverse footer keeps its 1→2→3 column responsive grid. **Full device-matrix browser QA remains a QA item** (see below) — the browser extension was not connected in this environment.

## RTL / LTR work
- **Blob utility mirrors in RTL** (`[dir="rtl"] .blob` swaps the asymmetric radius) so the organic shape leans the correct way.
- **Headline emphasis is script-aware:** English gets the italic serif word; Arabic (where italic serif is inappropriate) instead renders the emphasis word in the **olive brand colour** — an equivalent, correct accent. Implemented purely in `globals.css` via `[lang="ar"] … em`.
- Footer, logo, and all token-driven components continue to use the app's existing logical-property + `rtl:` mirroring; no physical-direction CSS was introduced.
- `audit:arabic` passes; no dictionary strings were changed (no copy edits).

## Intentionally left unchanged
- **All business/domain logic and APIs:** `src/lib/**` (catalog, catalog-preview, interior-agents, vision, visualization incl. the Google Gemini provider, chatbot, agent, orders, payments, repository, design), every `src/app/api/**` route — untouched. No mocks introduced, no backend behaviour changed, no paid services/APIs added.
- **Localization dictionaries** (`src/i18n/*`) — keys and copy unchanged.
- **Typography stack** — kept Fraunces/Hanken/IBM Plex Arabic per the confirmed decision (only the *treatment* adopted from Terra).
- **Radii/shadow/motion scales** — kept (already Terra-aligned); only added the blob token.
- **`room-illustration.tsx` hardcoded hexes** — kept: the `#9A5B3B` pot + `#5E6A53` plant are a representational **terracotta pot + olive branch**, which is exactly Terra's imagery mood, not UI chrome.
- **`.env*`** — never touched; no secrets modified.

## Remaining items for QA
1. **Browser device-matrix QA** (extension wasn't available here): verify `/en` + `/ar` at 360/390 (mobile), 768/834 (tablet), 1280 (laptop), 1440 (desktop) — header/mobile menu, hero, product grid, filters, AI/Before-After panels, footer; confirm RTL mirroring + directional-icon flips visually.
2. **Contrast spot-check:** olive `#4F5A3E` on sand and terracotta `#B15E39` on soft surfaces — verify AA for small text (buttons/badges use sand-on-olive which is high-contrast; confirm terracotta text usages).
3. **Optional Terra deepening (not required, additive):** apply `.icon-badge` to the "What We Do"/how-it-works service cards and a `.blob`-framed image or section divider on the homepage for more of Terra's organic character — deliberately left opt-in to avoid over-styling.
4. **Semantic-green proximity:** brand olive (`#4F5A3E`) and `--color-success` (`#4F6F52`) are both greens; confirm in-stock/success badges still read as distinct from primary in context (they differ in hue/lightness — flagged only for a visual pass).

---

*Redesign implemented on the real application with all gates green and no functionality, API, localization, or AI behaviour changed. The palette, shape language, and headline treatment now follow the Terra Interiors reference; the app's superior structure, RTL support, and CSS-only motion were preserved.*
