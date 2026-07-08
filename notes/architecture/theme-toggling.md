# Theme Toggling (Light/Dark)

A living reference for the reusable pattern behind manual light/dark theme support — first built in AI Command Center's dark-mode-toggle PDCA cycle (`agents/runs/2026-07-08-dark-mode-toggle/`). Update this file as the pattern is reused or refined; it's a living document, not an immutable decision record.

## Prerequisite: colors live in CSS custom properties, not scattered per-component

Every component reads color through semantic CSS variables (`--background`, `--foreground`, `--surface`, `--border`, `--muted`, `--accent`), exposed as Tailwind utilities (`bg-background`, `text-foreground`, etc.) via a `@theme inline` mapping — never hardcoded colors, never per-component `dark:` variants. This is what makes the rest of the pattern cheap: switching themes is changing variable values in one file, not touching every component. If a future project hasn't adopted this convention, do that first — the rest of this pattern assumes it.

## The pattern, step by step

### 1. System preference is the default

A `@media (prefers-color-scheme: dark)` block redefines the variables for anyone who hasn't made an explicit choice. This is the zero-JS baseline behavior.

### 2. An explicit `data-theme` attribute overrides system preference

`:root[data-theme="light"]` and `:root[data-theme="dark"]` blocks duplicate the same variables. An attribute selector on `:root` has higher CSS specificity than a bare `:root` inside a media query, so once `data-theme` is set, it wins regardless of system preference or where the rule sits in the file.

### 3. `localStorage` is the persistence layer — written only after an explicit choice

Nothing is written to `localStorage` until the visitor actually clicks the toggle. Until then, system preference governs untouched. Don't assume a preference the user never stated.

### 4. A pre-paint inline script prevents a flash of the wrong theme

`localStorage` isn't available during server rendering, so server-rendered HTML can never reflect a stored preference on its own. A small, static inline `<script>` in `<head>` — not a `useEffect`, which only runs after the first paint — reads `localStorage` synchronously and sets `data-theme` before the browser paints. This is safe to inline via `dangerouslySetInnerHTML` specifically because the script is a fixed string literal with no interpolated data; there's nothing in it an attacker could influence.

### 5. Live OS theme changes are handled, but only when no explicit choice exists yet

A `matchMedia('(prefers-color-scheme: dark)')` `change` listener keeps a toggle control's displayed state (icon, label) in sync if the visitor's OS theme changes while the tab stays open. The listener must check whether `data-theme` is already set before reacting: if it is, an explicit choice exists and system changes must be ignored, or the control silently reverts to "following system" without the visitor asking for that.

This is worth over-emphasizing because it was a real, confirmed bug in the first implementation, caught by Check specifically because Do's own testing only exercised the "reload" path, never "OS changes while the tab is already open" (full detail: `agents/runs/2026-07-08-dark-mode-toggle/review.md`). Any future reuse of this pattern should test the live-change path explicitly, not just reload behavior.

### 6. Accessibility

- The control needs an `aria-label` (and optionally `title`) describing the action the click will perform — e.g. "Switch to dark mode" / "Switch to light mode" — not just an icon.
- **Known gap, not yet applied anywhere:** `aria-pressed` would be a more complete pattern for a two-state toggle button, letting assistive tech announce pressed/not-pressed state directly instead of relying on the accessible name changing. Add this the next time this pattern is touched, here or elsewhere.

## Non-goals (as built so far)

- No three-state ("System") option once an explicit choice has been made — deliberately deferred for simplicity, not a limitation of the approach itself. Revisit if a real user asks for a way back to "follow my OS."
- No server-side or account-level persistence — `localStorage` only, since there's no backend or auth yet.

## Reference implementation

`projects/ai-command-center`: `src/app/globals.css` (variables + overrides), `src/app/layout.tsx` (pre-paint script), `src/components/ui/ThemeToggle.tsx` (control + live-change listener). Full cycle history, including the bug that shaped step 5: `agents/runs/2026-07-08-dark-mode-toggle/`.
