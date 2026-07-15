# Plan: Fix the pre-paint theme script's hydration mismatch warning

## Goal

Silence the React hydration-mismatch console warning that fires when a visitor's stored theme preference differs from their system preference at reload, caused by the pre-paint script in `layout.tsx`. Logged as a non-blocking follow-up in the `aria-pressed` cycle (`agents/runs/2026-07-08-theme-toggle-aria-pressed/review.md`, finding #1).

## What causes the warning

`layout.tsx`'s inline pre-paint script runs synchronously, before React hydrates, and calls `document.documentElement.setAttribute('data-theme', t)` directly on the real `<html>` DOM node when a stored preference exists. The server-rendered HTML for `<html>` — produced by `RootLayout`'s JSX, which never sets a `data-theme` prop at all — has no way to know that preference, since `localStorage` isn't available during server rendering.

When React hydrates, it reconciles its own rendered output against the live DOM and, as a general safety check (the same one that would flag a browser extension silently modifying markup), notices `<html>` has an attribute its render output didn't produce, and warns. This is a false positive in this specific case: the mismatch is intentional and by design — the entire purpose of the pre-paint script is to make the client differ from what the server could ever render, so the theme is correct before the first paint.

## Why `suppressHydrationWarning` on `<html>` is the expected fix

`suppressHydrationWarning` is a React prop that tells React to skip warning about a mismatch **for that specific element's own attributes/text, one level deep** — it does not silence hydration warnings anywhere else in the tree (children are unaffected). Applying it to `<html>` specifically acknowledges "the `data-theme` difference here is expected," without weakening React's ability to catch a genuine, unrelated hydration bug elsewhere in the app later. This is the same approach used by established theme-toggle libraries (e.g. `next-themes`) for exactly this situation, and it's already named as the expected fix in `notes/architecture/theme-toggling.md`'s "Known gotcha" note.

## Steps

1. Add `suppressHydrationWarning` to the `<html>` element in `projects/ai-command-center/src/app/layout.tsx`. No other prop or logic on that element changes.
2. Update the "Known gotcha, not yet fixed" paragraph in `notes/architecture/theme-toggling.md`'s step 4 to reflect that this is now fixed, linking to this run folder — following the same pattern used when the `aria-pressed` gap was closed.

## What files are expected to change

- `projects/ai-command-center/src/app/layout.tsx` — one prop added to one element.
- `notes/architecture/theme-toggling.md` — the existing gotcha paragraph updated to say "fixed," not rewritten.

Nothing else. No change to the pre-paint script's own logic, no change to `ThemeToggle.tsx`, `globals.css`, or `TopBar.tsx`.

## How Do should verify the warning is gone

Reproduce the exact scenario from the original finding, with a console listener attached: set system preference to one value, store the opposite value in `localStorage`, reload, and confirm no hydration-mismatch warning appears in the console. Then re-run the existing regression suite from the last two cycles to confirm nothing else changed:

- Default follows system when nothing is stored.
- A stored preference persists across reload (and is applied pre-paint, not after).
- A live OS change is honored only when no explicit choice exists yet.
- An explicit choice overrides a later system change.
- `aria-pressed` and the label stay correct throughout.

`suppressHydrationWarning` only silences a dev-mode console warning — it must not change any actual rendered behavior. If anything visual or functional changes as a result of this fix, that's a sign something is wrong, not an acceptable side effect.

## Risks

- `suppressHydrationWarning` is a blunt-ish tool: per React's own docs, it's meant as a narrow escape hatch and suppresses *all* attribute-mismatch warnings on the element it's applied to — not selectively just `data-theme`. If a genuine, unrelated hydration bug ever appears on `<html>` itself in the future, this suppression would mask that too. This is a known, accepted tradeoff of the standard fix, not a flaw in applying it here — worth documenting (in the updated architecture note) so a future maintainer understands exactly what's being silenced and why.
- Otherwise low risk: a single, well-documented prop addition with no logic change.

## Open Questions

None. This is a small, already-diagnosed issue with a single named standard fix, already recorded as the expected solution in `notes/architecture/theme-toggling.md`. If Do discovers the fix doesn't fully resolve the warning, or reveals something more is going on, that's a reason to stop and flag it rather than improvise further.

## Non-Goals

- Not attempting to eliminate hydration mismatches broadly across the app — scoped specifically to this one, already-diagnosed case.
- Not changing the pre-paint script's logic, the theme-tracking state, or any visual behavior.
- Not adding an automated test suite to the repo — verification stays manual/browser-based, consistent with how this project has verified every cycle so far.
