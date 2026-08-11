# Claude API Setup

Athathi's interior engine + room vision use Claude **when a key is present**. With no
key they run the deterministic **Demo** path (no external calls, no cost). The key is
server-side only and is **never** committed, logged, or sent to the browser.

> The assistant that built this integration **did not** read, print, test, or call any
> key. You add your own key manually below, then explicitly ask for the first live test.

## 1. Create / open your local env file

Create `D:\Athathi\.env.local` (this file is git-ignored — see `.gitignore`, `.env*`).
**Never** put a real key in `.env.example` or any committed file.

## 2. Add your key + (optional) model

```
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-sonnet-5
```

- `ANTHROPIC_API_KEY` — your own Anthropic key. Server-side only; never `NEXT_PUBLIC_*`.
- `ANTHROPIC_MODEL` — optional. A model **name** (not a secret). If omitted, the safe
  default in `src/lib/interior-agents/config.ts` is used. The same key also enables the
  existing room-vision providers.

## 3. Restart the dev server

```
npm run dev
```

Environment variables are read at server start, so a restart is required after editing
`.env.local`.

## 4. Verify the provider mode WITHOUT printing the key

Never echo the key. Instead check the capability endpoint (returns an **enum only**):

```
curl -s http://localhost:3000/api/interior-agent/run
# → {"designerMode":"claude"}   when a key is set
# → {"designerMode":"demo"}     when no key is set
```

In the UI, open **`/en/design`** — the intro shows a **"Claude Vision"** badge when the
key is active, or **"Demo Analysis"** when it isn't. That's the honest signal; the key
value is never displayed.

## 5. Disable Claude / return to Demo Mode

Remove or comment out `ANTHROPIC_API_KEY` in `.env.local` (or rename the file) and
restart `npm run dev`. The engine returns to the deterministic Demo path with no
external calls. Everything still works end to end.

## Cost / safety notes

- Every run is bounded (`INTERIOR_LIMITS` in `config.ts`): max Claude calls, max
  retries, max needs/selections, and per-call timeouts — no runaway usage.
- Money and catalog truth are always deterministic; Claude only plans.
- Tests never call the real API (the provider is mocked).

## First live test

After you add the key and restart, **explicitly ask** to run the first live test — the
integration will not call the real API on its own.
