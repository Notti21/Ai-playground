# Change Log: Fix the pre-paint theme script's hydration mismatch warning

Implements the approved plan at `agents/runs/2026-07-10-theme-hydration-warning/plan.md` exactly: a single prop added, one existing note updated to reflect the fix.

## Step 1 — `suppressHydrationWarning` on `<html>` (`src/app/layout.tsx`)

Added `suppressHydrationWarning` to the `<html>` element, with a comment explaining why: the pre-paint script intentionally sets `data-theme` on that element before React hydrates, based on `localStorage`, which the server can't read — so the mismatch React was warning about is expected, not a bug. No other prop, no logic change, nothing else on that element touched.

## Step 2 — Update the architecture note (`notes/architecture/theme-toggling.md`)

Changed the existing "Known gotcha, not yet fixed" paragraph under step 4 to "Known gotcha, fixed" — updated the tense throughout to reflect it's resolved, and added a link to this run folder alongside the existing link to the cycle that found it. No other part of the note was touched.

## Step 3 — Verification

- `npm run build` — succeeds.
- `npm run lint` — clean.
- **Reproduced the exact original scenario** (per plan): system preference dark, stored preference light, reload, with a console listener attached. Result: zero console errors, zero console warnings, and specifically confirmed no message containing "didn't match the client properties" (the hydration-mismatch signature from the original finding) — the warning is gone. The theme itself remained correct throughout (`data-theme: "light"`, background white), confirming the fix only silenced the warning and didn't change behavior.
- **Re-ran the full existing regression suite**, all passing:
  - Default follows system when nothing is stored.
  - A stored preference persists across reload, applied by `domcontentloaded` (pre-paint, not after).
  - A live OS change is honored when no explicit choice exists yet (label and `aria-pressed` both update live).
  - An explicit choice overrides a later system change (`aria-pressed` stayed `true` after the OS flipped back).
  - Keyboard access (Tab reaches the toggle, Enter activates it) is unaffected.

## Deviations from the plan

None. The fix was exactly the one line the plan specified, and the architecture note was updated rather than rewritten, as planned.

## Handoff

Ready for the Check Agent to review against `plan.md`.
