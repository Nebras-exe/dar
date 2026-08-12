# DAR — Image-Aware Design Flow Fix — Report

Fixed the three UX/AI issues in "Design My Space / صمّم مساحتي" without rebuilding the page. Claude Room Agent, catalog-only rules, budget, visualization, Before/After, cart, chatbot, and product architecture all preserved. **All gates pass.** Not committed, not pushed.

---

## Final report card
```
NO-IMAGE FAKE ANALYSIS REMOVED:        YES
AI STYLE RECOMMENDATION OPTION:        YES
REAL IMAGE DETECTION USED FOR KEEP STEP: YES
HARDCODED KEEP ITEMS REMOVED:          YES
CONFIDENCE FILTER:                     PASS
EMPTY ROOM HANDLING:                   PASS
CATALOG-ONLY RULE PRESERVED:           YES
ANTHROPIC CALL REUSE/COST CONTROL:     PASS
ARABIC/ENGLISH:                        PASS
TESTS/BUILD:                           PASS (367/367, build 1057 pages)
```

## 1. Never analyse a room with no uploaded image
- The room-analysis panel already renders only when a real photo exists (`showVision = Boolean(file) || Boolean(analysis)`).
- **Removed the "Analyze sample" button** that fabricated a deterministic room-analysis fixture — so a demo fixture can never appear as "here's what we found / إليك ما وجدناه" from the user's photo. When no Vision provider is configured, the panel shows guidance only (never fake analysis). When one IS configured, the real Analyze action stays `disabled` without an image.
- Added a **defence-in-depth guard** in `runAnalysis`: it early-returns if there is no `file`, so analysis can never run on an empty upload.
- The Style and Keep steps (below) show clean upload-first guidance when there's no analysis. Demo fixtures still exist for automated tests only — never in the real UI.

## 2. Style step — "Recommend the best style for me"
- Added a prominent primary option at the top of the Style step: **"اقترح لي الأنسب" / "Recommend the best style for me"** (`styleMode = "ai-recommended"`), with the required supporting copy in both locales. Verified live on `/ar/design` and `/en/design`.
- When selected **and** the room photo has been analysed, the style is derived from the analysis (`recommendedStyleFrom` → a **valid Athathi style id**, confidence ≥ 0.5) and shown to the user ("اخترنا لك: …"). The user can override it with any manual style (a manual pick switches `styleMode` back to `"manual"` — full manual control kept).
- When selected but **no photo/analysis** exists, it does NOT pretend to know a style — it prompts "upload a photo first". If the photo yields no confident style, it asks the user to pick one.
- All manual styles remain available (nothing removed).

## 3. Keep step uses ONLY real image analysis
- **Removed the hardcoded per-room category list** (`getDecisionCategories(room)`) from the Keep step. It now renders **only furniture the Vision analysis actually detected**, via the new pure single-source-of-truth helper `detectedKeepItems(analysis)`.
- So if the photo shows a bed + bedside table, the step shows **سرير / طاولة جانبية** only — never an undetected sofa / wardrobe / desk / rug.
- Each detected item offers **أبقيه / أستبدله / غير متأكد** (Keep / Replace / Not sure), defaulting to the detection's suggestion or the neutral **"غير متأكد"** — never auto-replace.
- **No analysis** → "upload a photo first so DAR can detect what's already there." **Empty room** (nothing detected above threshold) → the honest "لم نكتشف أثاثاً واضحاً… سنبدأ من مساحة شبه فارغة." — no fake furniture rows.

## 4. Confidence threshold
`detectedKeepItems` filters: **≥ 0.70** shown normally; **0.50–0.69** under a "ربما يوجد أيضاً / Maybe also present" group; **< 0.50** dropped entirely. De-duplicated by category (highest-confidence detection wins). Prefers fewer accurate detections over many guesses.

## 7. One analysis source of truth
The same `RoomAnalysis` (`state.analysis`) feeds: detected existing furniture (Keep step), the AI style recommendation (Style step), the analysis review, and — via the existing keep/replace decisions → RenderSpec preserve — the visualization. No separate hardcoded list pretends to be image analysis.

## 11. Cost control
The analysis is produced once and **reused across the wizard** from `state.analysis` (Style + Keep both read it; no per-step Claude call). Re-analysis happens only when the user replaces/removes the image (`CLEAR_ANALYSIS` drops stale analysis + the AI-derived style) or explicitly re-analyses. No repeated Anthropic calls.

## Files modified
- `src/lib/vision/mapping.ts` — added `detectedKeepItems` + `DetectedItem` + `KEEP_SHOW/MAYBE_CONFIDENCE` (confidence-filtered detection source of truth).
- `src/features/design/wizard-state.ts` — added `styleMode` + `recommendedStyleFrom`; `SET_STYLE_MODE` action; AI style derived from analysis and kept in sync (`SET_ANALYSIS`), invalidated on `CLEAR_ANALYSIS`; a manual pick reverts to manual.
- `src/features/design/steps.tsx` — Style step AI-recommend option; Existing/Keep step rewritten to render only detected furniture (with maybe-group + empty/needs-photo states).
- `src/features/design/vision-panel.tsx` — removed the fabricated "Analyze sample" path; guard analysis to require a real image.
- `src/i18n/dictionaries/en.json`, `ar.json` — `style.aiRecommend.*` and `existing.{needPhoto,emptyRoom,maybeTitle,detectedNote}` in both locales (natural Arabic, stored normally — not reversed).
- Tests: `src/lib/vision/detected-keep.test.ts` (+6), `src/features/design/wizard-image-aware.test.ts` (+6), fixed 2 draft fixtures in `vision.test.ts`.

## Tests / gates
| Check | Result |
|---|---|
| `typecheck` | ✓ clean |
| `lint` | ✓ clean |
| `audit:arabic` | ✓ 3101 strings, no reversed/corrupt |
| `test` | ✓ **367/367** (+12 new) |
| `build` | ✓ compiled, **1057/1057** pages |

Test coverage per spec: no-image → no detected furniture; confidence filter (≥0.70 / 0.50–0.69 / <0.50); empty-room → no fake rows; unmapped detection dropped; AI-recommended maps to a valid style; AI-recommended + no image → asks for a photo (step blocked); image replacement invalidates old analysis; manual pick overrides. Vision mocked — **no paid API calls in tests**.

## Live verification (port 3000)
- `/ar/design` + `/en/design` → 200; the "اقترح لي الأنسب" / "Recommend the best style for me" option is present in both locales.

## Notes
- **Live device/interaction QA** (uploading a real bed-only room, choosing AI style, driving the wizard on mobile) still needs the browser tooling that is unavailable in this environment; the logic is covered by unit tests and served-page checks. A manual pass of Cases A/B/C on `/ar/design` is recommended.
- Catalog-only rule untouched: the Room Agent still selects only real catalog products/variants; this change only fixes what the wizard OBSERVES (image-derived furniture + style), never what it recommends.
- Per instruction: **not committed, not pushed.** DAR is running on http://localhost:3000.
