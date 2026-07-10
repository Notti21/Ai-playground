# Change Log: Add `aria-pressed` to ThemeToggle

Implements the approved plan at `agents/runs/2026-07-08-theme-toggle-aria-pressed/plan.md`, using the confirmed decisions: keep the existing `aria-label` wording unchanged, add only `aria-pressed`, with `true` meaning dark mode is active.

## Step 1 — Add `aria-pressed` (`src/components/ui/ThemeToggle.tsx`)

Added `aria-pressed={theme === "dark"}` to the existing `<button>`, alongside the untouched `aria-label`/`title`. No new state was introduced — it derives directly from the same `theme` variable that already drives the icon, the label, and (from the last cycle's fix) the live-OS-change and explicit-choice-wins behavior. Because all of that was already correct, `aria-pressed` inherits it "for free," but per plan this still had to be verified directly, not assumed.

## Step 2 — Update the architecture note (`notes/architecture/theme-toggling.md`)

Replaced the "Known gap, not yet applied anywhere" line under Accessibility with a note that `aria-pressed` is now implemented (linking to this run folder), and added a new "Known tradeoff, deliberately not changed" line documenting the label-wording decision from Plan's Open Question #1 — so the reasoning behind keeping the dynamic label is preserved for whoever touches this pattern next, not just the outcome.

## Step 3 — Verification

- `npm run build` — succeeds.
- `npm run lint` — clean.
- Real-browser verification (Playwright, installed temporarily for this check only, then removed), covering exactly the four scenarios the plan called for:
  - **Reload with a stored preference:** set `localStorage` theme to `"dark"`, reload — `aria-pressed="true"` is correct immediately (confirmed both via the raw attribute and via `page.getByRole('button', { pressed: true })`, which reflects what the accessibility tree actually exposes, not just the string attribute).
  - **Live OS change, no explicit choice yet:** flipped the OS to dark mid-session with nothing stored — `aria-pressed` updated live from `"false"` to `"true"`, matching the label/background, with no new code needed since it shares the already-fixed state.
  - **User interaction after a state change:** clicked the toggle — `aria-pressed` flips from `false` to `true` immediately, confirmed via the accessibility-tree-aware locator.
  - **Explicit choice vs. later system change:** clicked to set an explicit choice (→ dark), then flipped the OS back to light — `aria-pressed` correctly stayed `true`, confirming the explicit choice still overrides a later system change, exactly like the label and background already did.

**One thing worth flagging, not a product bug:** my first pass at the verification script used an unscoped `page.getByRole('button', { pressed: ... })`, which matched *two* buttons on the page in dev mode — ours, and Next.js's own dev-mode overlay button (not part of the app; doesn't exist in a production build). That produced one incorrect-looking result in scenario 3 on the first run. Rescoping the locator to `{ name: /switch to/i, pressed: ... }` fixed the test itself; the application code was never wrong. Calling this out explicitly since it's exactly the kind of "verification method has a gap" issue Check should not have to rediscover.

## Deviations from the plan

None. Both approved decisions (keep the existing label, `pressed = dark`) were implemented exactly as specified. No file outside `ThemeToggle.tsx` and `theme-toggling.md` was touched — no redesign of the toggle, no change to the theme-tracking mechanism.

## Handoff

Ready for the Check Agent to review against `plan.md`.
