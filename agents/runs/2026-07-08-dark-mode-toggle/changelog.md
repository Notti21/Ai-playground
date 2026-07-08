# Change Log: Manual light/dark theme toggle

Implements the approved plan at `agents/runs/2026-07-08-dark-mode-toggle/plan.md`, using the decisions: two-state toggle, system-preference default with explicit choice persisted after interaction, icon-only sun/moon with an accessible label.

## Step 1 — Explicit theme override layer (`src/app/globals.css`)

Added `:root[data-theme="light"]` and `:root[data-theme="dark"]` blocks, duplicating the same variable values already used in the `@media (prefers-color-scheme: dark)` block. The media query is untouched and still governs when no `data-theme` attribute is present. An attribute selector (`[data-theme="dark"]`) has higher CSS specificity than a plain `:root` inside a media query, so once the attribute is set, it wins regardless of system preference.

## Step 2 — Pre-paint script (`src/app/layout.tsx`)

Added a `<head>` containing one inline `<script>` (via `dangerouslySetInnerHTML`) that reads `localStorage.getItem('theme')` and sets `data-theme` on `<html>` if it's `"light"` or `"dark"`. This is safe to inline because the script content is a fixed string literal in our own source — no user or request data is interpolated into it, so there's no injection risk despite `dangerouslySetInnerHTML`'s name.

This has to be a plain synchronous script tag, not a React effect — effects only run after the browser has already painted the first frame, which would produce exactly the flash this feature exists to prevent.

## Step 3 — Toggle component (`src/components/ui/ThemeToggle.tsx`, new file)

A small client component (`"use client"`, since it reads `localStorage`/`window` and handles a click):

- Reads the effective theme (the `data-theme` attribute if set, otherwise the system's `prefers-color-scheme`) after mount.
- On click, flips between `light`/`dark`, writes the choice to `document.documentElement`'s `data-theme` attribute and to `localStorage`, per the approved decision that persistence only happens after a manual choice.
- Shows a Sun icon when the current theme is dark (meaning "tap to go light") and a Moon icon when light (meaning "tap to go dark"), from `lucide-react` — already an installed dependency, no new one added.
- `aria-label` and `title` both describe the action the click will perform (e.g. "Switch to dark mode"), satisfying the approved accessibility requirement.

**One deviation from a naive implementation, called out per Do's "flag it" responsibility rather than silently deciding:** the component's initial React state always starts as `"light"` and is corrected to the real theme inside a `useEffect` after mount. This looks like it contradicts the plan's own risk note about effects running after paint — but it's a different, narrower problem: the *page background* is already correct before paint (Step 2 handles that, independently of this component). This effect only corrects the *toggle icon itself*, which cannot be computed during server rendering because `document`/`window` don't exist there. Computing it eagerly in the state initializer instead would either crash during server rendering or produce a value that mismatches the server-rendered HTML. This is the same pattern used by widely-adopted theme-toggle libraries (e.g. `next-themes`) for this exact reason.

ESLint's `react-hooks/set-state-in-effect` rule flags this `setState`-in-effect regardless, so I added a scoped `eslint-disable-next-line` with a comment explaining why, rather than restructuring the component with a more complex external-store subscription to satisfy a lint heuristic that doesn't fit this specific, well-understood exception.

## Step 4 — Mount in the app shell (`src/components/layout/TopBar.tsx`)

`ThemeToggle` is rendered next to the existing "Foundation phase" badge, both wrapped in a `flex items-center gap-3` container. No other section component was touched, matching the plan's Non-Goals.

## Step 5 — Verification

- `npm run build` — succeeds (Next.js production build, TypeScript check included).
- `npm run lint` — clean, no errors or warnings.
- Real-browser verification (Playwright, installed temporarily for this check only, then removed — not a project dependency):
  - With nothing stored and system set to dark: page follows system (`background-color: rgb(10, 10, 10)`), no console errors.
  - Clicking the toggle flips `data-theme` and writes it to `localStorage`.
  - After manually setting `localStorage` to `"light"` and reloading (system still dark): `data-theme="light"` is already present at `domcontentloaded` (i.e. before the "networkidle"/hydration point), and the background is white — confirming the stored choice overrides system preference and is applied pre-paint, not after.
  - The inline script's `data-theme` reference appears in the raw server HTML before `<body>`, confirming it can only execute pre-paint.
  - The accessible label ("Switch to dark mode") is present and discoverable by accessible name in light mode.

## Deviations from the plan

None. All three approved decisions (two-state, system-default-then-persist, icon-only with accessible label) were implemented as specified, and no section component outside `TopBar` was touched.

## Handoff

Ready for the Check Agent to review against `plan.md`.

---

## Revision — fix for Check finding #1 (stale toggle state on live OS theme change)

Check's review (`review.md`) confirmed one bug: if the OS color scheme changed while the tab stayed open, and the visitor hadn't made an explicit choice yet, the toggle's label and next-click behavior went stale — the page's background updated live (plain CSS), but `ThemeToggle`'s React state didn't, because nothing was listening for that change.

**Fix, scoped to `src/components/ui/ThemeToggle.tsx` only** — no other file touched, no redesign, still a two-state toggle:

- The existing mount `useEffect` now also subscribes to `window.matchMedia('(prefers-color-scheme: dark)')`'s `change` event.
- The handler only updates `theme` state if `document.documentElement` has **no** `data-theme` attribute at the time of the event — that attribute's presence is the single signal for "an explicit choice already exists," whether it was set moments ago by a click or earlier by the pre-paint script reading a stored `localStorage` value. If an explicit choice exists, later system changes are correctly ignored, preserving the two-state (not three-state/"system") behavior the plan called for.
- The listener is removed on unmount (`removeEventListener` in the effect's cleanup), avoiding a leak.
- Setting state inside the `change` event callback (not synchronously in the effect body) is exactly the pattern ESLint's `react-hooks/set-state-in-effect` rule itself describes as correct ("subscribe for updates from an external system, calling setState in a callback"), so no new lint suppression was needed for this part — only the pre-existing one (for the mount-time read) remains.

**Re-verification (independent of the original checks, using Check's exact reported scenario):**
- `npm run build` — succeeds.
- `npm run lint` — clean.
- Reproduced Check's failing case in a fresh browser session: start light (label "Switch to dark mode") → OS flips to dark with no click made → label now correctly updates to "Switch to light mode" (previously stayed stuck on "Switch to dark mode") → clicking sets `data-theme="light"` and persists it, matching what the label promised.
- Confirmed no regression on the other direction: after an explicit click (e.g. to dark), a later OS change back to light is correctly ignored — `data-theme` stays `"dark"` and the label stays consistent with it, proving the explicit choice still overrides system changes made afterward.

## Deviations from the plan (updated)

Still none. This fix is a bug fix within the already-approved scope (Step 3's component), not new scope.

## Handoff (updated)

Ready for the Check Agent to re-review the fix.
