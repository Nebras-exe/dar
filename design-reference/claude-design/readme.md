# Terra Interiors — Design System

## Context

This design system is built from a single reference image: an inspiration mockup titled *"Modern Home Interior & Website Design Ideas – Luxury Decor Inspiration"* (`assets/reference-mockup.jpg`, originally uploaded as a `.jfif`). It depicts a fictional interior-design studio, **Terra Interiors**, and its marketing homepage. There is no attached codebase or Figma file — this system is built from that single visual reference plus a font-pairing and color extraction pass.

Because the source is one static mockup (not a live product or codebase), this system covers **one surface**: the marketing website. The component set is a standard from-scratch primitive set (Button, Card, Input, Badge, Tag, Nav, Tabs, Accordion) sized to what a studio site like this needs — there is no existing component inventory to match exactly.

**No real logo was provided.** The mockup shows a plain serif wordmark ("terra INTERIORS") — no mark or icon. This system renders the brand name in type wherever a logo would go. If a real logo exists, add it to `assets/` and it will supersede the wordmark.

## Index

- `styles.css` — root stylesheet, imports all tokens
- `tokens/` — colors, typography, spacing, effects (shadow/motion)
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/core/` — Button, Badge, Tag, Input, Card, NavBar, Tabs, Accordion, SectionHeading
- `ui_kits/website/` — homepage recreation (`index.html` + screen sections)
- `assets/` — icons (Lucide, self-hosted SVG)
- `assets/reference-mockup.jpg` — the original inspiration mockup
- `SKILL.md` — portable skill definition for use outside this environment

## Content fundamentals

Voice, read off the mockup's actual copy:

- **Warm, calm, plain-spoken.** *"Beautiful interiors that restore and inspire."* *"Spaces that feel like home."* Short declarative sentences, no jargon.
- **Second person for the reader, first person for the studio.** *"We design wellness-inspired homes that blend natural beauty, function, and soulful living."* / *"I take the time to understand your story, needs, and your lifestyle."* The founder speaks in first-person singular in her bio; the studio speaks as "we" everywhere else.
- **Sentence case headlines with one italicized word for emphasis** — never the whole headline: *"Beautiful interiors that **restore** and **inspire**."*, *"Designing with intention. Rooted in **nature**."* The italic lands on the emotional or sensory word, not the subject.
- **Eyebrow labels are small caps, tracked out:** "WHAT WE DO", "OUR PROCESS", "KIND WORDS", "MEET THE FOUNDER" — these frame each section before the headline.
- **Buttons are Title Case, short, verb-led:** "Explore Our Work", "Book a Consultation", "Learn More".
- **No emoji, no exclamation points, no hype language.** No "amazing", "stunning", "game-changing". Confidence comes from plainness.
- **Numbers used sparingly and only when procedural** (the 5-step process: Discover, Design, Plan, Execute, Enjoy) — not stats or metrics.

## Visual foundations

- **Color:** a warm, low-saturation palette — cream/sand backgrounds, deep olive green as the primary accent (buttons, icon circles, dark section blocks), terracotta as a secondary warm accent (used sparingly — a pillow, an avatar backdrop). Near-black warm brown for text, never pure black. Two accents max on screen at once.
- **Type:** a serif display face (Lora) for headlines and pull quotes, paired with a clean grotesque-leaning sans (Karla) for nav, body, labels, and buttons. Headlines mix roman and italic in the same line for emphasis, rather than changing weight or color.
- **Backgrounds:** full-bleed photography in the hero and project grid; soft "blob" organic shapes (asymmetric border-radius) breaking up flat color fields between sections — no gradients, no repeating patterns, no textures/grain.
- **Imagery mood:** warm, sunlit, naturalistic interior photography — terracotta pots, olive branches, linen textures, soft daylight. No cool tones, no black-and-white, no heavy grain/filter.
- **Animation:** minimal by nature of the source (a static mockup). Assume standard easing (`ease-standard`, ~240ms) for hover/press transitions; nothing bouncy or elaborate.
- **Hover states:** buttons darken (olive → darker olive); links pick up an underline; cards lift slightly (subtle shadow increase, no scale).
- **Press states:** slight darken, no shrink — this is a calm, unhurried brand; avoid snappy/springy motion.
- **Borders:** rare and hairline-thin when present (`--border-subtle`), mostly on input fields and dividing lines — most separation comes from whitespace and color blocking, not borders.
- **Shadows:** soft and diffuse (`--shadow-card`), used only on cards and the sticky nav — never a hard drop shadow.
- **Corner radii:** generous. Photos and cards use a large radius (`--radius-l`, ~28px) or fully organic asymmetric "blob" shapes for section dividers; buttons use a pill shape (`--radius-pill`).
- **Cards:** cream/white surface, large soft radius, soft shadow, no border, generous internal padding, a small circular icon badge (olive fill, white icon) sitting above the card title.
- **Transparency/blur:** none observed — flat, opaque surfaces throughout.
- **Layout:** centered content column (~1200–1280px), generous section spacing (64–96px between sections), asymmetric two-column splits for founder/story sections, sticky top nav with a pill CTA button on the right.

## Iconography

The mockup shows very few icons: a small set of line icons inside olive circle badges on the "What We Do" cards (chair, pendant lamp, vase, painting — one per service), simple chevrons on testimonial carousel arrows, and social links (Pinterest, Instagram, Facebook) in the footer. There's no visible icon font or sprite to extract (single static image, no codebase).

- **System used here:** [Lucide](https://lucide.dev) via CDN, substituted for the mockup's custom line icons — closest match for stroke weight (1.5–2px) and minimal, rounded-line style. **This is a flagged substitution**, not an extracted asset.
- Hand-drawn botanical line illustrations (olive sprigs) appear as decorative corner flourishes in the mockup. These are custom illustration work, not something to approximate with generated SVG — omitted here. If the studio has the real illustration files, add them to `assets/illustrations/`.
- No emoji, no unicode-glyph icons.
- Social icons: Lucide's `instagram` and `facebook`; Lucide has no dedicated Pinterest glyph, substitute noted in the footer component.

## Intentional additions

No source component inventory exists (image-only reference), so the component set below is a standard primitive set sized to a studio-website's needs: Button, Badge, Tag, Input, Card (service + project variants), NavBar, Tabs, Accordion, SectionHeading. None of these are "inventions" beyond what a marketing site like the mockup requires — every one has a direct counterpart on the reference homepage.

## Caveats

- Built from one static image — no codebase, no Figma, no live product. Colors and spacing are close visual estimates, not extracted values.
- No real logo, illustration assets, or font files were provided. Lora/Karla are Google Fonts substitutes for the mockup's serif/sans pairing (loaded via CDN in `tokens/typography.css` — not self-hosted). Icons are Lucide substitutes.
- Only one surface (marketing website) exists to recreate — there's no app, dashboard, or second product in the source.
