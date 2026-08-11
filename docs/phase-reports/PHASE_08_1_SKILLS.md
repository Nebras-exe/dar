# Phase 08.1 — Skills Used

Per §2, all available skills/agents/MCP servers were inspected, and every one that
materially improved this Arabic/RTL audit was used. Skill names were not invented.

## Skills discovered (relevant)

- `frontend-design` — frontend/RTL implementation quality.
- `code-review`, `security-review` — review passes.
- `claude-in-chrome` — browser automation for visual QA.
- Localisation/translation-adjacent automation skills exist in the catalog, but
  none provides a credentialed Arabic-linguistic service in this environment; the
  Arabic review was done directly (native capability) — which is the right tool
  here, since the task is judging naturalness of existing strings, not calling an
  MT API.

## Skills actually used

| Skill | Why |
| --- | --- |
| **`frontend-design`** | Framed the RTL structural review (logical properties, `dir`, directional-glyph flips, intentional LTR islands for numbers/emails) against the established Athathi system. |

## Native Claude Code capabilities used

- **Arabic linguistic review** — direct reading of 55+ Arabic strings across every
  section for logical-order correctness, natural Omani/GCC furniture tone, brand
  consistency (أثاثي), and OMR presentation (ر.ع + Arabic-Indic digits).
- **Audit tooling** — authored `scripts/audit-arabic.mjs`, a repeatable reversed-
  Arabic detector (heuristic: known reversed literals + structural signals — words
  ending in "لا" = reversed "ال", trailing leading-hamza), validated to catch
  reversed text while passing legitimate Arabic (including many-`ال` strings).
- **Programmatic parity/placeholder checks** — key-tree parity + `{token}`
  integrity between `en.json` and `ar.json`.
- **Testing** — `src/i18n/i18n.test.ts` wires parity + placeholders + reversed-
  detection + a detector-self-test + brand consistency into `npm test`, so a future
  reversed/garbled string fails CI. Plus `npm run audit:arabic`.
- **HTTP/render verification** — `curl` against the running app to confirm
  `dir="rtl"`/`lang="ar"` and correct Arabic (and zero reversed strings) reach the
  server-rendered HTML on the critical routes.

## Subagents

Not spawned — the audit stayed coherent in one context, and the review passes
(parity, placeholders, reversed-detection, RTL, 55-string sample) were completed
inline with the automated checks + 116 unit tests. The audit script + i18n tests
make an independent re-review a single command.

## Unavailable capabilities & fallback

- **`claude-in-chrome` browser automation.** The extension did not connect (as in
  Phases 04–08). Live device rendering was unavailable and **not faked**. Fallback
  (§13): server-rendered HTML inspection (`dir`/`lang`/correct Arabic/no reversed
  strings), all-AR-route verification, the automated audit script, and RTL code
  review. Documented as a limitation.
