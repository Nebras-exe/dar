# DAR — UI CLEANUP + IMAGE 7

PROJECT ROOT:
D:\Athathi

NEW ROOM IMAGE:
D:\Athathi\pic\7.png

This task contains three targeted visual fixes only.

Do NOT redesign unrelated parts of the website.
Do NOT remove or break any existing functionality.

==================================================
TASK 1 — REMOVE DUPLICATE "DAR" TEXT BESIDE LOGO
==================================================

Inspect the site header/navigation branding.

The new logo image already contains the word:

دار

Currently the website also displays a separate text label "دار" next to the logo.

This creates duplicate branding.

REMOVE ONLY the separate visible text "دار" that appears beside the logo.

IMPORTANT:

- KEEP the logo image.
- DO NOT remove the logo.
- DO NOT modify the actual logo image.
- DO NOT remove the word دار from inside the logo.
- Only remove the duplicate standalone text rendered next to the logo.

The header should visually show only the logo itself.

Apply this consistently wherever this exact duplicate logo + text treatment occurs, including desktop/mobile header if applicable.

Do not blindly remove normal occurrences of the brand name elsewhere in the website.

==================================================
TASK 2 — USE IMAGE 7 FOR THE AI ROOM PREVIEW
==================================================

Use this image:

D:\Athathi\pic\7.png

Find the current large room illustration / room-preview image in the AI interior design interface.

It is currently using an illustrated/cartoon-style room scene.

Replace that room illustration with image 7.png.

Copy the asset into an appropriate permanent public location, for example:

public/images/ai/ai-room-preview.webp

or:

public/images/ai/ai-room-preview.png

You may convert it locally to WebP if quality remains excellent.

Do NOT delete the original file:

D:\Athathi\pic\7.png

==================================================
IMAGE 7 PRESENTATION
==================================================

Display image 7 professionally inside the existing room-preview container.

Requirements:

- preserve the current rounded container
- image fills the available preview area
- use object-cover where appropriate
- preserve image aspect ratio
- no stretching
- no distortion
- no excessive zoom
- keep the important room/furniture composition visible
- maintain the existing responsive behavior
- preserve the existing UI controls/badges that belong above the image
- do not cover important parts of the image unnecessarily

The image must feel integrated with the current DAR / Terra-inspired design system.

Keep:

- warm sand visual language
- olive primary
- terracotta secondary
- soft rounded shapes
- premium minimal aesthetic

If the current illustrated room component becomes unused after this replacement, remove only the obsolete visual reference/component safely if it has no other usage.

Do not remove functional AI logic connected to the room preview.

==================================================
TASK 3 — CLEAN THE BUDGET BAR AREA
==================================================

Find the UI section containing:

- الميزانية
- الإجمالي التقديري

There are currently furniture/product thumbnails/cards appearing immediately under or visually behind this budget bar.

These images make the section look cluttered and visually broken.

REMOVE the furniture thumbnail/card row that appears directly beneath / behind the budget summary bar in this specific interface.

I want the budget area to look clean and minimal.

KEEP:

- the budget value
- the estimated total
- their icons
- the budget summary container
- the actual calculations
- budget functionality
- relevant state/data

REMOVE FROM THIS VISUAL AREA:

- furniture thumbnail images
- clipped product images
- product mini-cards that visually overlap the budget bar
- product labels belonging specifically to this unwanted row
- empty containers left behind after removing them

IMPORTANT:

Do NOT delete furniture/product data from the application.

Do NOT remove furniture from other valid sections of the site.

This is a UI cleanup of THIS specific budget-summary area only.

==================================================
EXPECTED VISUAL RESULT
==================================================

The relevant screen should visually flow like this:

1. Clean budget / estimated-total bar
2. Proper whitespace
3. Large AI room preview using image 7.png

There should NOT be a messy strip of clipped furniture images between the budget bar and the room preview.

The result should feel:

- clean
- premium
- spacious
- simple
- visually organized
- consistent with the Terra/DAR design system

==================================================
RESPONSIVE + RTL
==================================================

Check both:

Arabic RTL
English LTR

Ensure:

- logo remains correctly aligned
- removing the duplicate text does not leave awkward spacing
- budget bar remains balanced
- image 7 scales correctly
- no horizontal overflow
- no clipped content
- mobile layout remains clean

==================================================
PRESERVE FUNCTIONALITY
==================================================

Do NOT break:

- AI functionality
- room design workflow
- budget calculations
- estimated total calculations
- product data
- routing
- localization
- APIs
- authentication
- responsive design
- existing working features

This task is primarily visual cleanup and asset replacement.

==================================================
VALIDATION
==================================================

After implementation:

1. Confirm the logo image still appears.
2. Confirm the duplicate standalone "دار" beside the logo is gone.
3. Confirm image 7.png is now used for the AI room preview.
4. Confirm the old illustrated room is no longer shown in that location.
5. Confirm the unwanted furniture-thumbnail row below/behind the budget bar is gone.
6. Confirm الميزانية still works.
7. Confirm الإجمالي التقديري still works.
8. Confirm Arabic RTL remains correct.
9. Confirm English LTR remains correct.
10. Check desktop.
11. Check mobile.
12. Run TypeScript check.
13. Run lint.
14. Run relevant tests.
15. Run production build.
16. Confirm no broken image paths.

Use port 3000 if the dev server is needed.

DO NOT COMMIT.
DO NOT PUSH.

At the end, report:

- which file/component rendered the duplicate دار text
- what was removed
- final path of image 7
- which room-preview component was updated
- which furniture-thumbnail section was removed
- confirmation that budget functionality remains intact
- validation/test/build results

==================================================
TASK 4 — REPLACE BEFORE / AFTER DEMO IMAGES
==================================================

There is an existing Before / After comparison section on the DAR website.

The section currently shows an illustrated/cartoon room inside an interactive comparison slider.

Replace those current demo illustrations with the new real images provided by the user.

SOURCE FILES:

BEFORE:
D:\Athathi\pic\Before.png

AFTER:
D:\Athathi\pic\after.png

IMPORTANT MAPPING:

Before.png = BEFORE image
after.png  = AFTER image

Do NOT swap them.

==================================================
COPY ASSETS INTO THE PROJECT
==================================================

Copy both images into an appropriate permanent public directory.

Preferred structure:

public/images/before-after/

Suggested production filenames:

public/images/before-after/room-before.webp
public/images/before-after/room-after.webp

You may convert PNG → WebP locally if there is no noticeable loss in visual quality.

DO NOT delete or modify the originals in:

D:\Athathi\pic

==================================================
KEEP THE EXISTING COMPARISON EXPERIENCE
==================================================

The existing Before / After slider functionality must remain.

KEEP:

- draggable comparison divider
- comparison handle
- Before / After interaction
- mouse interaction
- touch interaction
- keyboard/accessibility behavior if already implemented
- responsive behavior
- current section heading and description
- RTL/LTR support

DO NOT replace the comparison component with two static images.

The user must still be able to drag the divider horizontally and compare Before vs After.

==================================================
IMAGE PRESENTATION
==================================================

Both images represent the SAME comparison and must align perfectly inside the same frame.

Requirements:

- use identical dimensions for both layers
- use identical object-fit behavior
- use identical object-position
- use object-cover where appropriate
- preserve aspect ratio
- no stretching
- no distortion
- no excessive zoom
- no mismatched crop between Before and After
- no white/empty bands
- fill the existing comparison container cleanly

The same physical area of the room should remain aligned when the slider moves.

If necessary, adjust:

object-position
container aspect ratio
image sizing

to create the best visual match.

Do NOT independently crop Before and After differently.

==================================================
VISUAL DESIGN
==================================================

Keep the current DAR / Terra-inspired visual system:

- warm sand background
- rounded container
- premium minimal presentation
- olive primary accent
- terracotta secondary accent
- soft borders/shadows
- generous whitespace

The real room images should become the main focus.

Remove any obsolete illustrated room artwork that is only being used by this comparison demo.

Do NOT remove an illustration/component if another section still legitimately uses it.

==================================================
BEFORE / AFTER LABELS
==================================================

If the comparison currently has labels, preserve or improve them.

Arabic:

قبل
بعد

English:

Before
After

Labels should be:

- small
- clean
- readable
- visually subtle
- positioned so they do not block important furniture

Use the existing localization system rather than unnecessary hardcoding.

==================================================
SLIDER HANDLE
==================================================

Preserve the comparison divider and handle.

Make sure:

- divider is clearly visible over both images
- handle remains centered on divider
- handle is easy to drag
- handle does not become oversized
- touch target remains usable on mobile
- visual styling matches the DAR design system

Do not add flashy animation.

Use subtle interaction feedback only.

==================================================
RESPONSIVE
==================================================

Check the Before / After section on:

- large desktop
- laptop
- tablet
- mobile

On smaller screens:

- maintain a useful image height
- avoid extreme cropping
- avoid horizontal page overflow
- preserve draggable comparison behavior
- keep controls accessible

==================================================
RTL / LTR
==================================================

Test:

Arabic RTL
English LTR

The comparison itself should behave naturally in both directions.

Do not accidentally reverse which asset represents Before vs After.

Before.png is ALWAYS Before.

after.png is ALWAYS After.

==================================================
PRESERVE REAL AI FUNCTIONALITY
==================================================

IMPORTANT:

This is only replacing the DEMO / PREVIEW imagery shown in this section.

Do NOT modify:

- real AI generation APIs
- image generation provider
- Gemini configuration
- uploaded-room workflow
- generated result handling
- Before/After AI logic elsewhere
- product recommendation logic

These two images are visual demo assets for this presentation section.

==================================================
VALIDATION
==================================================

After implementation:

1. Confirm Before.png maps to BEFORE.
2. Confirm after.png maps to AFTER.
3. Confirm both assets load successfully.
4. Confirm the old illustrated comparison is gone from this section.
5. Confirm the slider still works.
6. Confirm mouse dragging works.
7. Confirm touch interaction remains supported.
8. Confirm images remain aligned throughout slider movement.
9. Confirm no image distortion.
10. Confirm Arabic RTL remains correct.
11. Confirm English LTR remains correct.
12. Confirm desktop layout.
13. Confirm mobile layout.
14. Run TypeScript check.
15. Run lint.
16. Run relevant tests.
17. Run production build.

Do not commit.
Do not push.

At the end report:

- final Before asset path
- final After asset path
- component modified
- confirmation that Before/After mapping is correct
- confirmation that the interactive slider was preserved
- any old illustration removed
- validation results

