# Athathi — Design System

Source of truth: `src/app/globals.css` (tokens) + `src/components/ui/*` (primitives).

## 1. Visual principles

**Premium interior studio × high-end furniture ecommerce × modern technology.**

- Warm, calm, spacious, editorial, trustworthy, highly polished.
- Minimal without feeling empty; hierarchy from whitespace, imagery, and typography — not heavy borders or shadows.
- AI feels *embedded* in a furniture experience, never bolted on.

**Explicitly avoided:** generic SaaS/AI templates, Amazon/Temu density, purple/blue gradients, neon "AI" glow, glassmorphism overload, oversized rounded cards, emoji-as-icons.

## 2. Colour

One warm light theme. Tokens are CSS variables mapped into Tailwind (`bg-brand`, `text-muted`, …).

### Neutrals (warm)
| Token | Hex | Use |
| --- | --- | --- |
| `background` | `#F5F1EA` | Canvas (warm ivory) |
| `surface` | `#FBF8F3` | Raised panels / alternating sections |
| `elevated` | `#FFFFFF` | Cards, dialogs, sheets |
| `foreground` | `#262019` | Primary text (espresso, not pure black) |
| `muted` | `#766C60` | Secondary text |
| `subtle` | `#9A9184` | Captions / tertiary |
| `border` | `#E4DCCF` | Default hairline |
| `border-subtle` | `#EDE7DC` | Softest hairline |

### Brand & accent (restrained)
| Token | Hex | Use |
| --- | --- | --- |
| `brand` / `brand-hover` | `#9A5B3B` / `#834B2F` | Primary actions, warm clay/sienna |
| `brand-soft` | `#F0E4DA` | Tinted brand surfaces / badges |
| `accent` | `#5E6A53` | Muted olive/sage secondary accent |
| `accent-soft` | `#E6E9E0` | Tinted accent surfaces |

### Semantic
`success #4F6F52`, `warning #A9792D`, `danger #A8432F`, each with a soft tint (e.g. budget states).

### Interior palette (documentation swatches)
`ivory #F5F1EA · cream #EFE7D9 · sand #E3D4BD · stone #C9BFB1 · taupe #A99C8C · walnut #6B4A32 · charcoal #2A2521`.

> Accents are used sparingly. Dark brown is not overused. The palette is warm but never monochromatic-boring.

## 3. Typography

- **English display:** Fraunces — editorial, warm, characterful serif (headings/hero).
- **English body/UI:** Hanken Grotesk — refined humanist grotesque.
- **Arabic (headings + body):** IBM Plex Sans Arabic — premium and highly readable.

Direction-aware via CSS variables: `--font-heading` / `--font-body` switch on `[lang="ar"]`. Arabic headings drop negative tracking, run a slightly heavier weight, and use looser line-height (1.85 body) for readability.

### Scale (fluid, Tailwind sizes)
| Role | Approx | Notes |
| --- | --- | --- |
| Display | `text-4xl → 3.5rem` | Hero only |
| H1 | `text-4xl/5xl` | One per page |
| H2 | `text-2xl/3xl` | Section headers |
| H3 | `text-xl/2xl` | Subsections / card titles |
| Body L | `text-lg` | Lead paragraphs |
| Body | `text-base` | Default |
| Small / caption | `text-sm / text-xs` | Muted |
| Eyebrow | `.text-eyebrow` | 0.75rem, uppercase, tracked, brand-coloured |
| Price | `.tabular` | `tabular-nums` for alignment |

Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`. No tiny text; restrained weight set (400–600).

## 4. Spacing, radius, shadow, motion

- **Spacing:** Tailwind scale; section rhythm via `Section` (`py-12 → py-32` responsive); container gutters `px-5 → px-12`.
- **Containers:** `--container-content` 76rem, `--container-wide` 90rem, plus `narrow` (3xl).
- **Radius:** `sm .375 · md .625 · lg .875 · xl 1.25 · 2xl 1.75 · full`. Cards use `xl`; images modest `md/lg` (no oversized corners); pills/buttons `full`.
- **Shadow:** four soft, warm-tinted steps (`xs → lg`) — used sparingly for elevation, never heavy.
- **Motion:** `--ease-soft`, `--ease-out`; durations `fast 150 / base 220 / slow 340`. Transitions list explicit properties (never `transition: all`) and favour transform/opacity. Motion is subtle: hover image zoom (~1.04), button lift, card lift. `prefers-reduced-motion` is fully honoured.

## 5. Components (Phase 01)

`Button` (primary/secondary/outline/ghost/destructive; sm/md/lg; loading/disabled/icon; focus-visible), `IconButton` (mandatory `label`→`aria-label`), `Chip` (`aria-pressed` selectable), `Badge` (tones incl. `demo`), `Input`/`Textarea`/`Field` (labels, hints, inline errors, `aria-invalid`), `Card` (elevated/surface/outline, optional interactive lift), `ImageFrame` (fixed aspect ratios, clip, optional hover zoom), `Container`, `Section`/`SectionHeader`, `Divider`, `Skeleton`, `EmptyState`, `Logo` (arch mark + wordmark), `LocaleSwitcher`, `Header`, `SiteFooter`.

**Card principle:** editorial restraint — whitespace + image scale + calm type; avoid excessive borders, huge shadows, nested cards, over-rounding.

## 6. Iconography & imagery

- One line-icon system (`lucide-react`), consistent stroke weights (~1.5–1.75). No emoji as UI.
- Furniture imagery uses consistent aspect ratios via `ImageFrame`, modest radius, subtle hover zoom, and (in later phases) `next/image` for responsive, shift-free loading. Phase 01 ships labelled placeholders only.

## 7. Arabic / RTL principles

- `<html dir>` set per locale on the server.
- Build with **logical properties** (`ps/pe`, `ms/me`, `start/end`, `text-start/end`) so layouts mirror automatically.
- Only genuinely directional glyphs (arrows) flip via `rtl:rotate-180`.
- Brand/language identifiers carry `translate="no"` to survive machine translation.
- Arabic typography is tuned separately (weight, tracking, line-height) rather than reusing Latin metrics.

## 8. Accessibility

- Semantic HTML; correct `<button>` vs `<a>`/`<Link>`.
- Visible `:focus-visible` ring (brand, 2px offset) everywhere; `outline-none` is never used without a replacement.
- Icon-only controls require an accessible name; form controls have real labels + hints/errors with `aria-live`.
- `aria-pressed` (chips), `aria-expanded`/`aria-controls` (mobile menu), `aria-busy` (loading buttons).
- Contrast tuned for the warm palette; reduced-motion respected; `color-scheme` + `theme-color` set.

## 9. Mobile behaviour

- Mobile-first responsive rhythm; touch targets ≥ ~40px; nav collapses to an accessible toggle panel (Escape to close).
- No horizontal overflow; flex/grid layouts (no JS measurement); content wraps gracefully in both directions.

## 10. Phase 02 additions (homepage patterns)

- **Original illustration, not stock.** `RoomIllustration` is a hand-built SVG interior (furnished "after" / bare "before") drawn from the palette — the homepage visual anchor. Imagery elsewhere uses `PlaceholderImage` (palette gradient + line icon), always labelled `Sample`. Production photography (warm modern, beige/walnut/cream) is a documented remaining need; wire via `next/image` with responsive `sizes`.
- **Motion.** One orchestrated hero entrance (`.animate-fade-up` with staggered `animation-delay`) and a scroll `Reveal` (client, `IntersectionObserver`). Reveal only dims its `data-reveal="hidden"` state, so no-JS/reduced-motion users always see content. CSS-only — no animation library.
- **Before/After slider.** `BeforeAfterSlider` is direction-aware (LTR/RTL clip + inverted arrow keys), draggable anywhere, and a real `role="slider"` (arrow/Home/End, `aria-valuenow`). Container uses `touch-action: pan-y` so vertical page scroll still works on touch.
- **ProductCard.** Editorial furniture card (square `ImageFrame` + hover zoom, name/meta, OMR price with `tabular`, optional `Sample` badge + favourite). Server component, reused across featured/before-after.
- **Polymorphic Button.** Renders `<a>` when `href` is set (in-page anchors/links) and `<button>` otherwise; `buttonClasses()` is exported for one-off link styling.
- **Graceful links + honest coming-soon.** All nav/CTA/footer links resolve to in-page section anchors (`#top #how #design #keep #budget #before-after #shop #featured #styles #reference #custom #suppliers #final-cta`) — no unbuilt routes. Genuinely future features use a **disabled** CTA plus a `Coming soon/later` badge.
- **Section rhythm.** `Section` tones (`base`/`surface`/`contrast`) alternate down the page for editorial cadence; `SectionHeader` gives every section a consistent eyebrow → title → description.

## 11. Phase 03 additions (catalog & discovery patterns)

- **One `ProductCard`, evolved — not a second system.** The Phase 02 card became a single catalog-driven card (`product` + `locale` + label bundle) used on shop, category, related and homepage-featured grids. Whole-card **stretched link** (`after:absolute after:inset-0`) with the favourite button lifted above it (`pointer-events-auto`, `z-10`); the card's focus ring is driven by `has-[a:focus-visible]` so keyboard focus outlines the whole card, not just the title. Restraint: square image, one-line material·style meta, up to four swatch dots, OMR price, a single **Sample** badge (availability lives on the detail page to avoid card noise).
- **Generated product art.** `ProductArt` draws a category-specific SVG furniture silhouette tinted by the product's real swatches over a warm gradient with a seed-placed accent shape — deterministic per product, no external assets, no two cards alike. `ProductImage` is the seam: real `images` → `next/image` automatically. `ImageFrame` keeps square ratios shift-free.
- **URL-as-state browsing.** Search (`q`), facets and `sort` all live in the query string; server pages render results, client islands (`SearchBar`, `SortSelect`, `FilterContent`/`FilterSheet`, `ActiveFilters`) only mutate the URL. Filters: sticky sidebar on desktop, shared full-height drawer on mobile. Selected state is never colour-only (ring + check + `aria-pressed`); active filters show as removable chips with a count + clear-all.
- **Price & dimensions.** Prices use `formatOmr` (3-decimal OMR, `tabular-nums`); price filter uses accessible number inputs (not an inaccessible slider). Structured `Dimensions` render as a labelled grid with localized digits — the room-fit differentiator.
- **Local stores.** Cart + favourites use `useSyncExternalStore` over `localStorage`; the cart stores intent only and derives price/name from the catalog. Quantity steppers, remove, and checkout are real accessible controls; **Try in My Room** and **checkout** are honestly disabled with a "later phase" note.
- **Honesty patterns.** Every product carries a **Sample** badge and `isDemo`; suppliers are fictional demo names; a shop-wide notice states the catalog is demo. No ratings/reviews/discounts/stock-urgency anywhere.

## 12. Phase 04 additions (AI Designer patterns)

- **Guided wizard, not a form.** A 7-step brief uses **visual selection cards** (room types, styles) and chips (budget, colours, materials) rather than dropdowns, one clear action per step, and a review step with per-row Edit jump-backs. State is a `useReducer` + `localStorage` machine (phases `brief → analysis → result`); content renders immediately (no opacity-gated hydration blank).
- **Restrained progress.** Desktop = a labelled step rail (number → check, visited steps clickable, `aria-current`); mobile = a compact "Step n of m" line + a thin `role=progressbar` bar. No giant SaaS stepper.
- **Not a chatbot.** The AI is expressed through interior/product surfaces and an occasional single `Sparkles` mark — no chat bubbles, no purple gradients, no glowing-AI icons. Demo Mode is stated plainly in a quiet `Badge` + surface note, never dominant.
- **Honest Demo analysis.** The progress panel reveals the *actual* deterministic steps the engine ran, in a short bounded stagger (≈0.4 s/step, completed-at-once under reduced-motion) — never a fake multi-second "AI thinking" timer.
- **Accessible budget meter.** A `role=progressbar` bar plus always-visible text (percent used, remaining **or** "Over budget by …"); state is never colour-only. Over-budget uses a distinct danger fill and an explicit line.
- **DesignItem card reuses the catalog.** The result's compact item card uses the same `ProductImage`, pricing, taxonomy and product link as the shop — plus a deterministic reason line and a replace menu (cheaper/similar/upgrade) that reports honestly when no alternative exists. No separate product-card system.
- **Local-only upload.** Drag-and-drop **or** click, keyboard-operable drop zone, live preview, replace/remove, invalid/too-large states — the image never leaves the browser (object-URL preview; only the file name enters state).
- **Structured-result principle.** The result UI consumes a typed `DesignRecommendation` (items by slug, numeric `BudgetSummary`, `{en,ar}` reasons), never model prose — so a future agent can replace Demo Mode behind `generateDemoDesign`/`generateAgentDesign` without UI changes.

## 13. Phase 05 additions (Room Analysis / Vision patterns)

- **Analysis reads as interior design, not dev tooling.** Detections render as elegant labelled rows + swatch/feature chips over warm surfaces — never a JSON dump, never chat bubbles, never purple/glowing-AI. A single `ScanSearch`/`Sparkles`/`ShieldCheck` mark, used sparingly.
- **Confidence as bands, never decimals or colour-only.** Raw model confidence is shown as a text pill — High / Medium / Low — with a matching (but non-sole) ring colour. Low-confidence fields are not auto-applied; the wizard asks instead.
- **Consent before the image leaves the browser.** When a real provider is available, a privacy note + explicit consent checkbox gate analysis; when none is configured, the UI says so honestly and offers a clearly-badged **Sample · Demo Mode** analysis plus manual entry. Upload copy never claims a false privacy guarantee.
- **AI suggests, the user decides.** Detected furniture shows an **AI suggestion** with an app-authored bilingual rationale (never trusted model prose) and an editable Keep / Replace / Not sure `radiogroup`; any detection can be removed. Applying uses the edited working copy, and pre-fill never overwrites a field the user already set (**user wins**).
- **Honest dimensions.** The review always states that dimensions can't be measured from a photo; the data model can never carry numbers (`dimensionsStatus:"unknown"`).
- **Real status, no fake progress.** The analysing state shows short honest phases (Preparing → Analysing → Structuring) via `aria-live`, not a fabricated multi-second timer; every failure maps to friendly bilingual copy with Try again / Continue manually.

## 14. Phase 06 additions (AI Agent patterns)

- **A control panel, not a chatbot.** "Ask Athathi" is an embedded panel in the design result — a labelled composer + contextual quick commands — and the design result stays the main screen. No full-screen chat, no message-bubble stream, no purple/glowing-robot iconography (a single `Wand2`/`Sparkles` mark).
- **Tool activity, not tool logs.** Actions surface as human check-lines ("✓ Checked your budget", "✓ Replaced the rug", "✓ New total OMR 398") — never raw JSON or internal tool-call payloads.
- **Explicit approval, cost visible.** State-changing actions (add to cart) never auto-commit: the Agent proposes ("Add N pieces for OMR X?") and the user must press Confirm; the cost is always shown. A **Demo Agent** badge appears when no live provider is configured.
- **The design changes in place.** Agent edits update the actual plan (items + budget meter) via the reducer — the panel explains concisely with tool-returned numbers; it never regenerates a different room unless asked, and respects kept furniture (user wins).
- **Bilingual, accessible composer.** A real `role="search"` form with a labelled input, keyboard submit, `aria-live` results, and quick commands that map to real supported actions in EN + AR.

## 15. Phase 07 additions (Before/After Visualization patterns)

- **One comparison interaction, generalized — not a second component.** The Phase 02 `BeforeAfterSlider` became a shared UI primitive (`components/ui/before-after-slider.tsx`) taking arbitrary `before`/`after` nodes; it now backs both the homepage illustration and the room preview. Still direction-aware (LTR/RTL clip inversion + inverted arrow keys), pointer-draggable, `touch-pan-y`, and a real `role="slider"` (Arrow/Home/End, `aria-valuenow`).
- **Honest "after", never a fake render.** With no image provider, the after is a **Demo Preview**: the room photo + a restrained, deterministic warm mood-wash (`soft-light`, ~0.14–0.30 opacity, from the design's real catalog colours) + a subtle scrim + a tray of the actual product artwork. It is labelled **Demo Preview** and stated to be a styling composition, not an AI-rendered room — no glowing-AI, no purple gradients.
- **One concise disclosure, not a wall of warnings.** A single line near the preview — "Visual preview — proportions and colours may vary in your actual space." — plus a quiet scale note by the products. Trust over clutter (§3/§23).
- **Stale is a first-class state.** A design fingerprint drives a "Design changed — update preview" banner (warning-toned, not alarming) with an **Update preview** action; the preview is never silently presented as matching a changed design.
- **Scale honesty.** Catalog dimensions (W/D/H, localized digits, `tabular-nums`) are shown **separately** from the preview with an explicit "doesn't prove physical fit" note; products without dimensions read "Dimensions not verified". No invented measurements.
- **Colour selection reuses the catalog.** Product cards offer only a product's **verified** colour swatches (`aria-pressed`, ring + label — never colour-only); selecting one updates the design, the preview (→ stale), the Agent context, and the cart.
- **Premium, calm, architectural.** Rounded `2xl` section, warm surfaces, `Wand2`/`Sparkles` used sparingly, soft shadows for the preview frame only — reusing the established tokens; no SaaS-dashboard density, no emoji UI.
- **Local-first privacy.** In demo mode the photo never leaves the browser (held in a session context, revoked object URL, never `localStorage`); the live path is consent-gated. Upload/preview copy never claims a false guarantee.

## 16. Phase 08 additions (Backend / auth / supplier patterns)

- **Auth that feels like Athathi, not a SaaS template.** `/login` + `/signup` reuse the warm tokens, Fraunces headings and the existing button/field styles — one centered card, a single accent, honest copy. A quiet **Demo Mode** note (never dominant) explains local accounts when no backend is configured.
- **Honest empty states over fake data (§38).** "No saved designs yet", "You haven't added any products yet", "No requests yet" — polished, never padded with invented rows. The supplier **Analytics** tab shows only truthful counts; there is **no revenue chart** until real orders exist.
- **Trust labelling.** Demo suppliers/products always carry a **Sample / Demo** badge; the **Verified** badge appears only when `verified = true`. Inventory shows real status with **no fake urgency** ("Only 1 left!" never appears).
- **A real workspace, desktop-first but mobile-safe.** The supplier dashboard uses an accessible `role="tablist"` (not a giant SaaS shell); the product form is **sectioned** (Basic → Pricing → … → Preview) rather than one 40-field wall, with a live preview that reuses the real `ProductImage`/pricing. Complex management is optimized for desktop; nothing breaks on mobile; customer auth/account is excellent on mobile.
- **Accessible forms.** Real `<label>`s, `aria-invalid` + inline errors, native `<select>` for category/type/inventory (accessible, not custom), `aria-pressed` colour buttons with `aria-label` (selection never colour-only), and server-side redirects for auth rather than hiding controls.
- **Server authority, not hidden buttons.** Access is enforced on the server (session-derived membership, `/account` redirect) and by RLS — the UI only reflects it. Sign-out is a real form submit to a server action.

## 17. Phase 09 additions (Custom furniture / RFQ patterns)

- **A guided flow, not a mega-form.** The custom experience is a short, labelled multi-step (idea → spec → review → suppliers → quotes) with a step rail (`aria-current="step"`). The spec form uses **progressive disclosure** — only the category's relevant fields — never one 20-field wall.
- **Honest uncertainty.** Dimensions offer an explicit **"ask the supplier"** value; the review shows "Not specified" / "Ask the supplier" for unset fields. Athathi extracts only facts the user stated and says so — never a measurement guessed from a photo.
- **Comparison over score.** Quotes are compared as real, readable fields (total, furniture/delivery/installation breakdown, lead time, warranty, budget position) in cards that stack on mobile — **never a single opaque "AI score."** Athathi's recommendation is a labelled pick **with reasons**, and a visible note states advertising never affects ranking.
- **Labelled demo quotes.** Every demo quote carries **Sample · Demo Quote**; nothing is presented as a real factory quotation. Budget/recommended/accepted states carry text + badges (not colour alone).
- **Explicit approval.** Accepting is a `role="dialog"` confirm showing supplier/total/lead-time and stating payment comes later; the Agent never accepts. Accepted → "Ready for order" badge; other quotes read "Not chosen".
- **Entry points that fit.** Custom is reachable from the homepage teaser (now a live CTA), product pages (customizable → "Request a custom version", deep-linked), the design result, the shop no-match state, and header nav — without crowding navigation.

## 18. Phase 09.5 additions (visual upgrade)

- **Generated art is a "studio photography" system, not a placeholder.** `ProductArt` composes a warm studio backdrop (wash + ambient glow + corner vignette), a grounding contact shadow, and category forms with real **depth** (lit face / shaded side / top highlight), all **material-aware** — fabric top-light & seams, wood grain, metal sheen, glass translucency, marble veining, leather sheen, rattan weave (classified from `materials[0]`). Deterministic per product, offline, no external assets, still clearly demo. This is the single biggest visual lever — every card/product/cart/design/RFQ/supplier surface inherits it.
- **Hover treatment actually fires on the art.** `ImageFrame` `zoomOnHover` targets `<img>` **and** `<svg>`; product cards sit in an elevated, ring-bordered surface that lifts on hover (`.lift`), with title→brand, swatch scale, and a larger price. A "Customisable" chip marks made-to-order pieces.
- **One CSS-only motion system, reduced-motion-safe.** Tokens/utilities in `globals.css`: `.lift` (hover raise + warm shadow), `[data-reveal-stagger]` (sequenced entrance via `--i`), `.animate-value-pop` (brief highlight when a number changes), plus the existing hero entrance + scroll reveal. Applied to product cards, the Agent "New total", and RFQ quote reveals. No JS animation runtime, no parallax; every rule collapses under `prefers-reduced-motion`.
- **Imagery stays owned + offline.** External image generation (higgsfield, etc.) was deliberately not wired in — it would add remote assets, latency, licensing and consistency risk, and break the deterministic demo model. Real photography swaps in later behind the unchanged `ProductImage` seam (a data change).

## 19. Phase 09.6 additions (editorial rebuild)

- **Oversized editorial display type.** `.text-display` (fluid clamp 2.75→5.25rem, tight tracking, Fraunces `opsz` 144) opens the hero and drops negative tracking + optical axis for Arabic. Section titles are larger and more confident.
- **Hairline section markers.** `.kicker` (an uppercase eyebrow with a leading rule) replaces plain eyebrows; `.rule-hair`, `.measure`, and `.bg-linen` support an editorial, less-boxed composition.
- **"Show, don't tell" hero.** Real catalog pieces (art + OMR price) float over an immersive room with an AI cue + budget/total strip — room + AI + real furniture in one glance.
- **Image-led categories.** Category tiles show a real representative product with a gradient scrim label + count (featured bento tile), not generic gradient/icon placeholders. Product-detail gallery is sticky on desktop.

## 20. Phase 10A additions (orders / checkout)

- **Calm, trustworthy checkout — not a SaaS form.** A short three-step flow (summary → Oman delivery → review/confirm) with a step rail (`aria-current="step"`) and a sticky totals card. Two-column on desktop, single-column on mobile.
- **Supplier-grouped orders.** Both cart and accepted-quote orders render as per-supplier group cards with subtotals + an overall total. Suppliers see only their own group (never another's items/totals).
- **Honest money + payment.** Catalog delivery/installation are shown as "arranged with the supplier" (no invented fees); only accepted-quote fees are charged. A prominent "payment is not processed yet" note precedes an explicit **Confirm demo order**; confirmed orders carry a **Demo** badge.
- **Real order history.** The account gains a real Orders section + `/orders/[id]` detail (replacing the "coming soon" placeholder); the supplier dashboard gains an Orders tab. Honest empty states, no fake history.
