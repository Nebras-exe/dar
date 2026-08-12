# DAR REDESIGN — PHASE 02: IMPLEMENTATION

PROJECT ROOT:
D:\Athathi

DESIGN REFERENCE:
D:\Athathi\design-reference\claude-design

DISCOVERY REPORT:
D:\Athathi\claude-prompts\DISCOVERY_REPORT.md

Before doing anything:

1. Read 01-DISCOVERY.md
2. Read DISCOVERY_REPORT.md
3. Reinspect relevant existing source files.
4. Reinspect relevant design-reference files.
5. Use the relevant Skills identified during discovery.

Now implement the redesign.

==================================================
CORE RULE
==================================================

The Claude Design export is a DESIGN REFERENCE.

Do NOT replace the existing Next.js application with static exported HTML.

Do NOT rebuild the website from scratch.

Preserve:

- existing routing
- existing APIs
- existing AI functionality
- authentication
- product functionality
- data
- localization
- working business logic

Apply the new visual system to the existing application.

==================================================
DESIGN SYSTEM
==================================================

Translate the supplied Claude Design system into reusable project-level design foundations.

Use real values from:

- tokens
- guidelines
- components
- ui_kits
- styles
- design manifest

Prefer centralized reusable tokens.

Avoid repeating hard-coded style values.

Integrate appropriately with the project's existing Tailwind CSS setup.

==================================================
COMPONENTS
==================================================

Create or refactor reusable React components when appropriate.

Examples:

- Header
- Navbar
- MobileNav
- Hero
- Search
- CategoryCard
- ProductCard
- ProductGrid
- Filter controls
- Button
- Input
- Badge
- Modal
- AI-related UI
- BeforeAfter
- Cart components
- Footer

Do not duplicate components unnecessarily.

==================================================
SITE IMPLEMENTATION
==================================================

Apply the visual language consistently across the REAL DAR website.

The finished application should feel like one coherent professionally designed product.

Do not merely change colors.

Match:

- layout
- hierarchy
- typography
- whitespace
- cards
- buttons
- imagery treatment
- sections
- navigation
- interaction states
- overall visual language

==================================================
ANIMATION
==================================================

Use the best relevant available Skill(s).

Use the existing animation solution if appropriate.
Use Framer Motion when it is already available or genuinely appropriate.

Add subtle animations where valuable:

- page/section entry
- staggered cards
- hover interaction
- button feedback
- navigation transitions
- product interactions
- modals
- image changes
- Before/After
- loading states

Respect prefers-reduced-motion.

Do NOT over-animate.

==================================================
ARABIC / RTL
==================================================

Arabic is first-class.

Ensure correct:

- RTL layout
- typography
- spacing
- navigation
- directional icons
- arrows
- forms
- animations
- product cards
- sliders

English LTR must also remain correct.

Do not blindly mirror components where that would hurt usability.

==================================================
RESPONSIVE
==================================================

Test and adapt for:

- large desktop
- laptop
- tablet
- mobile

Do not merely scale down desktop layouts.

Ensure especially strong mobile UX for:

- header
- navigation
- search
- categories
- product grids
- filters
- AI design tools
- cards
- buttons
- forms

==================================================
UX
==================================================

Improve:

- hierarchy
- readability
- product discovery
- CTA prominence
- empty states
- loading states
- error states
- focus states
- hover states
- active states
- accessibility

Do not add unnecessary product features.

==================================================
PERFORMANCE
==================================================

Avoid:

- unnecessary JavaScript
- excessive client components
- large dependencies
- duplicate libraries
- huge images
- layout shifts
- unnecessary animation wrappers

Follow Next.js best practices.

==================================================
SAFETY
==================================================

Do NOT:

- delete working functionality
- remove APIs
- replace real functionality with mocks
- remove localization
- remove AI functionality
- change backend behavior unnecessarily
- introduce paid services
- introduce paid APIs
- redesign outside the supplied visual language
- overwrite environment secrets

==================================================
IMPLEMENTATION FLOW
==================================================

Work progressively.

After each meaningful implementation group:

- ensure TypeScript remains valid
- ensure imports are valid
- avoid knowingly leaving broken pages

Continue until the redesign is implemented.

When implementation is complete create:

D:\Athathi\claude-prompts\IMPLEMENTATION_REPORT.md

Include:

- files created
- files modified
- components created
- design tokens implemented
- animations implemented
- responsive work
- RTL/LTR work
- anything intentionally left unchanged
- remaining items for QA
