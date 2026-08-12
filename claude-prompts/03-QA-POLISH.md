# DAR REDESIGN — PHASE 03: QA + POLISH

PROJECT ROOT:
D:\Athathi

DESIGN REFERENCE:
D:\Athathi\design-reference\claude-design

Read:

D:\Athathi\claude-prompts\DISCOVERY_REPORT.md
D:\Athathi\claude-prompts\IMPLEMENTATION_REPORT.md

Use all relevant available testing, browser, frontend, accessibility and visual QA Skills/tools.

Now validate the implementation.

==================================================
1. CODE QUALITY
==================================================

Check:

- TypeScript
- ESLint
- production build
- broken imports
- runtime errors
- console errors
- invalid React patterns

Fix issues caused by the redesign.

==================================================
2. VISUAL QA
==================================================

Compare the real site with the supplied design reference.

Check:

- colors
- typography
- spacing
- radius
- shadows
- hierarchy
- header
- hero
- cards
- sections
- buttons
- navigation
- image presentation
- footer

Fix obvious visual inconsistencies.

==================================================
3. RESPONSIVE QA
==================================================

Check:

- desktop
- laptop
- tablet
- common mobile widths

Look for:

- overflow
- clipped content
- oversized typography
- broken grids
- navigation issues
- awkward spacing
- unusable buttons
- broken modals
- filters that do not fit

Fix issues.

==================================================
4. RTL / LTR QA
==================================================

Test Arabic RTL carefully.

Also test English LTR.

Check:

- alignment
- directional icons
- chevrons
- arrows
- animation direction
- inputs
- navigation
- product cards
- modal layouts
- sliders

Fix issues.

==================================================
5. ANIMATION QA
==================================================

Check that animations are:

- smooth
- fast
- subtle
- consistent

Remove or reduce animations that are distracting.

Ensure prefers-reduced-motion is respected.

==================================================
6. ACCESSIBILITY
==================================================

Check important accessibility issues:

- keyboard focus
- focus visibility
- semantic controls
- contrast
- labels
- image alt text where appropriate
- interactive target sizes
- reduced motion

Fix important problems.

==================================================
7. PERFORMANCE
==================================================

Look for:

- oversized images
- unnecessary client components
- excessive rerenders
- animation overhead
- layout shift
- duplicate dependencies

Make safe improvements.

==================================================
8. FINAL VALIDATION
==================================================

Run appropriate project checks.

Do not claim success if a command actually fails.

Fix redesign-related failures where possible.

Finally create:

D:\Athathi\claude-prompts\FINAL_DESIGN_QA_REPORT.md

Document:

- checks performed
- fixes made
- build result
- lint result
- TypeScript result
- responsive result
- RTL result
- animation result
- remaining known issues

Do not introduce new features during this QA phase.
