# Plan: Manual light/dark theme toggle for AI Command Center

## Goal

Add a manual light/dark theme toggle to AI Command Center, so a visitor can override the system-level `prefers-color-scheme` and have their choice remembered across visits.

## Scope

Only the theme-switching mechanism and a toggle control in the app shell (`TopBar`). Does not include redesigning any colors, adding themes beyond light/dark, or touching section content (Hero, Agent System, Projects, Tools, Knowledge Base, Recent Activity, Next Actions).

## Steps

1. Add an explicit override layer to `globals.css`: `:root[data-theme="light"]` and `:root[data-theme="dark"]` blocks, using the same variable values as the existing `@media (prefers-color-scheme: dark)` block. The media query stays as-is and remains the default when no override is set.
2. Add a small inline script in `layout.tsx`'s `<head>` that runs before the page paints: read a stored preference from `localStorage`, and set `data-theme` on `<html>` accordingly. If nothing is stored, no attribute is set and the system preference (media query) governs, exactly as today.
3. Add a small client component, `src/components/ui/ThemeToggle.tsx`: shows the current effective theme, toggles between light/dark on click, updates the `data-theme` attribute on `<html>`, and writes the choice to `localStorage`.
4. Mount `ThemeToggle` in `TopBar.tsx`, next to the existing "Foundation phase" badge.
5. Manually verify in a browser: with nothing stored, the page still follows system preference; clicking the toggle switches and persists across a reload; there is no visible flash of the wrong theme on reload.

## Risks

- **Flash of incorrect theme** is the standard failure mode for this kind of feature. Step 2's inline script is the standard fix, but it only works if it runs *before* the browser paints — if it's written as a `useEffect` (which runs *after* first paint) instead of a plain inline `<script>`, the flash will still happen. This is the single most important thing for Check to verify, not just read.
- Every component today reads color through CSS custom properties (`bg-background`, `text-foreground`, `bg-surface`, etc.), never Tailwind's `dark:` variant directly. That's good news — it means no section component should need to change, only `globals.css`, `layout.tsx`, and one new file. If Do finds itself editing a section component, that's a signal this assumption was wrong, and it should stop and flag it rather than push through.

## Open Questions

Need your input before Do starts:

1. **Two-state or three-state toggle?** Light ⇄ Dark (simpler), or Light / Dark / System (lets a visitor explicitly return to "follow my OS" after overriding it). Recommendation: start two-state, matching "keep architecture simple" — add System later if it's actually missed.
2. **Default for a brand-new visit** — confirm nothing-stored should keep following system preference (current behavior), rather than defaulting to always-light or always-dark.
3. **Icon-only vs. icon+label toggle?** TopBar is currently very minimal (wordmark + one small badge). Recommendation: icon-only (sun/moon), using `lucide-react`, which is already installed — no new dependency needed.

## Non-Goals

- No new color palette or themes beyond light/dark.
- No per-section theme overrides.
- No server-side/account-level persistence — `localStorage` only, since there's no backend or auth yet.
- No changes to any section component (Hero, AgentSystem, Projects, Tools, KnowledgeBase, RecentActivity, NextActions).
