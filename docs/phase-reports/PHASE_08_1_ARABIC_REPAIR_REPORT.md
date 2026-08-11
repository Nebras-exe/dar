# Phase 08.1 — Arabic Language Repair & RTL Quality Audit — Report

_Status: ✅ Complete & verified. A corrective/quality phase between Phase 08 and Phase 09. **Key finding: the reversed-Arabic corruption this phase was scoped to repair does not exist in this codebase** — all Arabic across `ar.json` and every source file is already in correct logical Unicode order. Rather than fabricate a repair, this phase (1) proved the source is clean with an automated detector + a manual 55-string sample, (2) verified EN/AR key parity + placeholder integrity + brand + OMR + RTL structure, and (3) added permanent guards (`scripts/audit-arabic.mjs`, `npm run audit:arabic`, and `src/i18n/i18n.test.ts`) so any future reversed/garbled string fails CI. Build/lint/typecheck/tests green (116 tests); AR routes + server-rendered Arabic verified over HTTP. Chrome extension offline → visual QA via rendered-HTML inspection (documented)._

## Cause of the problem (and what was actually found)

The prompt described a critical bug: Arabic stored in **reversed character order** (e.g. `"يثاثأ ميمصت"` instead of `"تصميم أثاثي"`), which happens when an RTL string is typed/pasted backwards so it only *looks* right in a naive left-to-right editor. RTL must come from HTML/CSS directionality — never from reversing characters.

**Investigation result:** none of the cited reversed literals (`يثاثأ`, `كتفرغ`, `لوخدلا`, `ةنياعملا`, `نودروملا`, `ميمصت`) appear anywhere in `src/`. All Arabic in this project was authored in correct logical Unicode order from Phase 01 onward (Athathi's design rules mandated "Arabic authored in logical Unicode order" — see `catalog/types.ts` `Localized`). The heuristic + structural detector scanned **1,340** real Arabic strings and flagged **zero**. Per §3/§11/§15, legitimate Arabic was **not** mechanically reversed or altered.

This report therefore documents an **audit that confirmed correctness** and hardened the codebase against the bug recurring — not a mass rewrite.

## Scope of strings reviewed / repaired

- **Strings repaired:** 0 (none were corrupted).
- **Arabic strings audited automatically:** 1,340 across `ar.json` + all `.ts/.tsx`.
- **Translatable Arabic dictionary values:** 768.
- **Manually sampled for naturalness:** 55, evenly spread across `home`, `shop`, `design`, `vision`, `agent`, `visualization`, `auth`, `account`, `suppliers`, and `supplier` — all read as correct logical-order, natural, premium Omani/GCC furniture copy.

## Detection tooling (added)

- **`scripts/audit-arabic.mjs`** (`npm run audit:arabic`) — a repeatable detector for reversed/corrupted Arabic. It does **not** reject legitimate Arabic; it flags only on concrete reversed signatures: (1) known reversed literals, (2) a majority of words ending in `لا` (a reversed `ال` definite article — correct Arabic *starts* words with `ال`), or (3) a majority of words ending in a leading-hamza letter. Validated: it catches reversed samples (including fresh, non-blocklisted ones) and passes correct strings, including many-`ال` phrases. Test files are excluded (they hold deliberate reversed fixtures).
- **`src/i18n/i18n.test.ts`** — wires five guards into `npm test`: EN/AR key-tree parity, placeholder integrity, no-reversed-Arabic, a **detector self-test** (so the check can't silently degrade to a no-op), and brand consistency.

## Routes reviewed

Server-rendered Arabic verified over HTTP on: `/ar`, `/ar/shop`, `/ar/design`, `/ar/cart`, `/ar/login`, `/ar/signup`, `/ar/account` (307 → auth guard), `/ar/suppliers`, `/ar/suppliers/apply`, `/ar/supplier`, plus Arabic supplier profiles and product pages. All respond correctly with `lang="ar"` + `dir="rtl"`; correct Arabic reaches the HTML (e.g. `تسجيل الدخول`, `الموردون على أثاثي`, `صمّم`, `المورّد`); **zero** reversed strings appear in any rendered page.

## Key parity result

`en.json` and `ar.json`: **900 keys each — 0 missing, 0 extra, 0 type mismatches.** Placeholder integrity: **every** `{name}`/`{count}`/`{room}`/`{style}`/`{total}` token in an English value is preserved identically in its Arabic value (0 mismatches). Placeholder identifiers were never translated or reversed.

## RTL findings

RTL is fully **structural**, never content-reversal:

- `dir` + `lang` set on `<html>` server-side per locale (correct on first paint).
- **Zero** physical-direction Tailwind classes (`pl/pr/ml/mr-*`, `left/right-*`, `text-left/right`) across the entire `src/` tree — everything uses logical properties (`ps/pe`, `ms/me`, `start/end`, `text-start/end`, `inset-inline`) — 41 logical usages.
- Directional glyphs (arrows) flip via `rtl:rotate-180` / `rtl:-scale-x-100` / explicit `dir` checks (12 sites).
- The before/after slider inverts its **clip direction and arrow keys** structurally (`dir === "rtl" ? …`), not by reversing content.
- Intentional LTR islands are correct: email, phone, price, budget and dimension inputs carry `dir="ltr"` so numbers/emails render LTR *within* the RTL layout — the right behaviour, not a bug.
- New Phase 08 surfaces (auth, account, supplier apply, dashboard, product form) all follow the same logical-property discipline.

## Brand & OMR

- **Brand:** `أثاثي` appears 49× in source; the wrong forms (`اثاثي` without hamza, `أثاثى` with alef maksura, reversed `يثاثأ`) appear **0×**. `ar.brand.name === "أثاثي"`, `en.brand.name === "Athathi"`.
- **OMR:** the Arabic UI uses `ر.ع` consistently (29 occurrences) with Arabic-Indic digits (`٥٠٠ ر.ع`); no Latin `OMR` leaks into Arabic values. Runtime money formatting uses `Intl.NumberFormat` via `formatOmr` (numeric, 3-decimal), so budgets/totals/remaining/price-deltas never store or corrupt formatted strings.

## Skills used

See `PHASE_08_1_SKILLS.md`. Headline: `frontend-design` for the RTL structural review; native Arabic linguistic review; the custom audit script + i18n tests; `curl`-based render verification.

## Tests

`npm test` → **116 passing** (5 new in `src/i18n/i18n.test.ts`: parity, placeholders, no-reversed-Arabic, detector self-test, brand). `npm run audit:arabic` → clean (1,340 strings scanned, 0 flagged). No prior tests removed.

## Build result

- `npm run lint` → clean, 0 warnings.
- `npm run typecheck` → clean.
- `npm run build` → success, **217 pages**.
- `npm run audit:arabic` → ✓ no reversed/corrupted Arabic.

## Remaining limitations

- **No live browser QA** — the Chrome extension did not connect (as in Phases 04–08); device rendering (bidi shaping, cursor behaviour in RTL inputs) was not visually captured and was **not faked**. Verified instead via server-rendered HTML (`dir`/`lang`/correct Arabic/no reversed strings), all-AR-route checks, the audit script, and RTL code review.
- The reversed-Arabic detector is heuristic by design (to avoid rejecting legitimate Arabic); it targets the specific corruption class from this phase, not every conceivable typo. Its self-test guards against silent degradation.
- Arabic copy quality is native-review-level, not a certified professional translation pass; the tone is clear, modern and premium as required, and is easy to refine per-string later.

## Phase status

Phase 08.1 is complete: the Arabic source is confirmed correct (no reversal bug present), parity + placeholders + brand + OMR + RTL are verified, and permanent CI guards are in place. **Phase 09 not started.**
