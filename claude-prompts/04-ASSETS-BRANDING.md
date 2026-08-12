# DAR - STYLE IMAGES + LOGO + BRANDING

PROJECT ROOT:
D:\Athathi

NEW ASSETS:
D:\Athathi\pic

Use the following mapping exactly:

1.png → Warm Modern / مودرن دافئ
2.png → Japandi / جاباندي
3.png → Minimal / مينيمال
4.png → Contemporary / معاصر
5.png → Modern Classic / كلاسيكي مودرن
6.png → Bohemian / بوهيمي

LOGO:
D:\Athathi\pic\Logo.jpeg

==================================================
TASK 1 - STYLE IMAGES
==================================================

Find the existing interior-style selection section containing six cards.

Replace the current placeholder/gradient imagery with the new real images.

Maintain this exact order:

1. Warm Modern / مودرن دافئ
2. Japandi / جاباندي
3. Minimal / مينيمال
4. Contemporary / معاصر
5. Modern Classic / كلاسيكي مودرن
6. Bohemian / بوهيمي

Copy the assets into a proper permanent location inside the project, preferably:

public/images/styles/

Use clean filenames such as:

warm-modern.webp
japandi.webp
minimal.webp
contemporary.webp
modern-classic.webp
bohemian.webp

You may convert PNG → WebP locally if quality remains visually excellent.

DO NOT delete the original files from:

D:\Athathi\pic

==================================================
TASK 2 - IMAGE PRESENTATION
==================================================

Integrate the images professionally into the existing Terra-inspired DAR design.

Requirements:

- Preserve existing card dimensions.
- Preserve rounded corners.
- Use object-cover.
- Do not stretch images.
- Keep the important furniture near the center.
- Keep the images bright and clearly visible.
- Avoid excessive zoom.
- Avoid large dark overlays.
- Preserve responsive behavior.

If text is overlaid on the image, use only a subtle warm dark gradient near the bottom for readability.

The image itself should remain the visual focus.

==================================================
TASK 3 - CARD MICRO-INTERACTIONS
==================================================

Use relevant existing design / animation Skills.

Add subtle premium interaction:

- slight image zoom on hover
- slight card elevation
- smooth transition around 250-400ms
- elegant, restrained motion

Do NOT use aggressive scaling.

Do NOT install a new animation library only for this.

Respect prefers-reduced-motion.

==================================================
TASK 4 - NEW DAR LOGO
==================================================

Use:

D:\Athathi\pic\Logo.jpeg

as the new DAR logo.

Copy it into a permanent project location such as:

public/brand/dar-logo.jpeg

Inspect where the current logo appears and replace the visible branding where appropriate:

- desktop header
- mobile header
- footer
- navigation
- authentication screens
- other important public branding surfaces

Requirements:

- preserve aspect ratio
- do not stretch
- keep it sharp
- appropriate desktop/mobile size
- clean spacing
- visually compatible with the current Terra/DAR design

==================================================
TASK 5 - BRAND NAME CHANGE
==================================================

The PUBLIC product brand is now:

Arabic:
دار

English:
DAR

The website must no longer publicly present the product as:

أثاثي
Athathi

Search user-facing UI and replace branding appropriately:

أثاثي → دار
Athathi → DAR

Check areas including:

- header
- footer
- navigation
- logo alt text
- metadata
- page titles
- Open Graph metadata
- accessibility labels
- manifest/PWA name if applicable
- authentication UI
- user-visible messages

IMPORTANT:

This is a PUBLIC BRANDING change only.

DO NOT rename:

D:\Athathi

DO NOT blindly rename:

- internal folders
- package names
- API routes
- database identifiers
- environment variables
- internal source-code identifiers

unless the identifier is genuinely user-facing and changing it is clearly safe.

==================================================
TASK 6 - ARABIC + ENGLISH
==================================================

DAR is Arabic-first.

Arabic branding:
دار

English branding:
DAR

Use the existing localization architecture.

Do NOT break RTL/LTR.

Do not unnecessarily hardcode translations.

Maintain the correct style names:

مودرن دافئ
جاباندي
مينيمال
معاصر
كلاسيكي مودرن
بوهيمي

==================================================
TASK 7 - DESIGN CONSISTENCY
==================================================

Keep the current Terra-inspired visual system:

- warm sand background
- olive primary
- terracotta secondary
- Fraunces / Hanken
- IBM Plex Arabic
- calm editorial furniture aesthetic
- soft shadows
- premium spacing
- restrained motion

Do NOT revert the recent redesign.

Do NOT redesign unrelated sections.

Integrate these new assets into the current system.

==================================================
TASK 8 - PRESERVE FUNCTIONALITY
==================================================

Do NOT break or remove:

- AI features
- authentication
- routing
- APIs
- localization
- product browsing
- cart
- checkout
- recommendation logic
- style selection logic
- responsive layout
- existing working functionality

The six style cards must continue functioning exactly as they do now.

Only their imagery and visual presentation should change.

==================================================
TASK 9 - CLEANUP
==================================================

After integrating the assets:

- remove obsolete placeholder references if no longer required
- avoid unnecessary duplicate assets
- do not delete D:\Athathi\pic
- verify every asset path
- use Next.js Image where appropriate
- provide meaningful alt text

Suggested Arabic alt text:

1. غرفة بتصميم مودرن دافئ
2. غرفة بتصميم جاباندي
3. غرفة بتصميم مينيمال
4. غرفة بتصميم معاصر
5. غرفة بتصميم كلاسيكي مودرن
6. غرفة بتصميم بوهيمي

Provide English equivalents for English locale where appropriate.

==================================================
TASK 10 - VALIDATION
==================================================

After implementation:

1. Run TypeScript check.
2. Run lint.
3. Run relevant tests.
4. Run production build.
5. Confirm all six images load.
6. Confirm the DAR logo loads.
7. Confirm Arabic displays دار.
8. Confirm English displays DAR.
9. Confirm correct image mapping from 1 through 6.
10. Confirm card selection/click functionality still works.
11. Confirm Arabic RTL.
12. Confirm English LTR.
13. Confirm desktop layout.
14. Confirm mobile layout.
15. Confirm no missing-image errors.
16. Confirm no broken asset paths.

If running the site, use port 3000.

DO NOT COMMIT.
DO NOT PUSH.

At the end report:

- assets copied
- final asset paths
- files modified
- confirmation of image mapping
- logo locations replaced
- old Athathi/أثاثي branding replaced
- test/build results
- any remaining public occurrence of the old brand name
