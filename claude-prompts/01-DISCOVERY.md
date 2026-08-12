# DAR REDESIGN — PHASE 01: DISCOVERY

PROJECT ROOT:
D:\Athathi

DESIGN REFERENCE:
D:\Athathi\design-reference\claude-design

You are working on the existing DAR / Athathi website.

IMPORTANT:
Do NOT modify any application code during this phase.
This phase is analysis and planning only.

The existing Next.js application is the source of truth for:
- routing
- functionality
- authentication
- APIs
- AI features
- product logic
- data
- localization
- existing working features

The Claude Design export is the source of truth for:
- visual design
- colors
- typography
- layout
- spacing
- visual hierarchy
- components appearance
- navigation style
- product presentation
- overall design language

--------------------------------------------------
1. INSPECT THE EXISTING APPLICATION
--------------------------------------------------

Inspect the existing project thoroughly.

Understand:
- Next.js architecture
- React components
- Tailwind setup
- global styles
- layout files
- routes
- reusable components
- current homepage
- product UI
- AI features
- localization
- RTL/LTR handling
- dependencies
- Framer Motion or existing animation libraries
- existing functionality that must not break

Do not rewrite anything yet.

--------------------------------------------------
2. INSPECT THE CLAUDE DESIGN EXPORT
--------------------------------------------------

Inspect everything inside:

D:\Athathi\design-reference\claude-design

Pay special attention to:

- readme.md
- SKILL.md
- styles.css
- Terra Interiors Homepage.html
- tokens\
- guidelines\
- components\
- ui_kits\
- assets\
- uploads\
- _ds_manifest.json
- _ds_bundle.js

There is also:

Dar Design System.zip

Do not rely on the ZIP if the required files are already extracted.

Understand exactly how the design system is intended to work.

--------------------------------------------------
3. DESIGN SYSTEM EXTRACTION
--------------------------------------------------

Identify:

- primary colors
- secondary colors
- neutrals
- backgrounds
- text colors
- typography
- font sizes
- font weights
- line heights
- spacing scale
- radius scale
- borders
- shadows
- containers
- grid rules
- breakpoints
- buttons
- cards
- forms
- badges
- product presentation
- navigation
- footer
- image treatment
- hover states
- focus states
- responsive rules

Prefer actual token/guideline values from the design files instead of guessing from the HTML screenshot.

--------------------------------------------------
4. SKILLS DISCOVERY
--------------------------------------------------

Inspect all Skills actually available to Claude Code in this environment.

Do NOT assume Skill names.

Search for relevant Skills related to:

- frontend
- frontend design
- UI
- UX
- web design
- design systems
- React
- Next.js
- Tailwind CSS
- animation
- Framer Motion
- micro-interactions
- ecommerce
- accessibility
- responsive design
- Arabic
- RTL
- typography
- browser testing
- visual testing
- frontend QA
- performance

Also inspect:

D:\Athathi\design-reference\claude-design\SKILL.md

Use the design-provided Skill/guidelines when applicable.

Create a shortlist of the most useful available Skills and explain what each will be used for.

--------------------------------------------------
5. COMPONENT MAPPING
--------------------------------------------------

Map the design reference to the existing application.

For every important existing page/component identify:

CURRENT COMPONENT/PAGE
→ DESIGN REFERENCE
→ REQUIRED CHANGE
→ KEEP EXISTING FUNCTIONALITY?

Identify reusable components that should be created or updated, such as:

- Header
- Navbar
- Mobile navigation
- Hero
- Search
- Category card
- Product card
- Product grid
- Filters
- Buttons
- Inputs
- Badges
- Modals
- AI sections
- Before/After UI
- Cart UI
- Footer

Reuse existing good components where possible.

--------------------------------------------------
6. ANIMATION PLAN
--------------------------------------------------

Determine where motion materially improves the experience.

Plan subtle premium animations for things such as:

- hero entrance
- section reveals
- card staggering
- navigation
- hover interactions
- buttons
- product cards
- image transitions
- modal transitions
- expand/collapse
- Before/After
- loading states

Do NOT over-animate.

Motion should feel:

- premium
- smooth
- natural
- quick
- intentional

Avoid:

- gimmicks
- excessive parallax
- long animations
- distracting movement

Respect prefers-reduced-motion.

--------------------------------------------------
7. RTL + RESPONSIVE PLAN
--------------------------------------------------

DAR is Arabic-first.

Analyze what is required for:

Arabic RTL
English LTR

Check:

- navigation
- alignment
- arrows
- icons
- forms
- cards
- sliders
- animations
- spacing
- typography

Also plan layouts for:

- desktop
- laptop
- tablet
- mobile

Mobile must be intentionally designed, not simply a smaller desktop layout.

--------------------------------------------------
8. OUTPUT
--------------------------------------------------

Create this report in:

D:\Athathi\claude-prompts\DISCOVERY_REPORT.md

The report must include:

1. Current architecture summary
2. Design-system summary
3. Important design tokens
4. Skills selected
5. Component mapping
6. Animation plan
7. RTL/LTR plan
8. Responsive plan
9. Files expected to be modified
10. Risks
11. Recommended implementation order

Do NOT implement the redesign yet.

Stop after creating DISCOVERY_REPORT.md.
