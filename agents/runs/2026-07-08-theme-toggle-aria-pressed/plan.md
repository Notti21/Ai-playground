# Plan: Add `aria-pressed` to the ThemeToggle button

## Goal

Add `aria-pressed` to the existing `ThemeToggle` button in AI Command Center, closing the non-blocking accessibility gap Check identified in the previous cycle (`agents/runs/2026-07-08-dark-mode-toggle/review.md`, finding #2).

## Scope

Only `ThemeToggle`'s accessibility attributes. Not a redesign of the toggle, not a change to the two-state model, not a change to how theme state is tracked (that mechanism — including the live-OS-change fix from the last cycle — already works and stays as-is).

## What `aria-pressed` should represent

Per the ARIA spec, `aria-pressed` describes the button's own current state ("is this toggle currently on"), not an instruction about what clicking it will do next — it cannot represent "next action." That question is already settled by the spec, not a judgment call.

The judgment call is *which* state counts as "pressed" for this button. Recommendation: treat the feature as "Dark Mode," so `aria-pressed="true"` means dark theme is currently active, `aria-pressed="false"` means light is active. This is the natural reading and requires no new state — it derives directly from the existing `theme` variable (`theme === "dark"`).

## How this interacts with the existing `aria-label`

Mechanically, no conflict: a button can carry both `aria-label` (supplies the accessible *name*) and `aria-pressed` (supplies the *state*) at once. The real question is whether they'll make sense read together, because the current label is **action-oriented and changes with state** ("Switch to dark mode" when light is active, "Switch to light mode" when dark is active) — this is different from the ARIA Authoring Practices' canonical toggle-button pattern, which pairs a **static, feature-naming label** (e.g. "Dark Mode") with `aria-pressed` doing all the state-communication.

Combining our existing dynamic label with `aria-pressed` produces something like: while dark is active, a screen reader announces *"Switch to light mode, button, pressed"*. That's technically decodable (it tells you the button is "pressed" and pressing again switches to light) but reads a little awkwardly compared to the canonical pattern, since "pressed" and "switch to light mode" both describe the current state from slightly different angles rather than one naming the feature and the other its state. This is a real tradeoff, not something I should resolve unilaterally — see Open Questions.

## Steps

1. In `ThemeToggle.tsx`, add `aria-pressed={theme === "dark"}` to the existing `<button>`, alongside the current `aria-label`/`title`. (If Open Question 1 below is resolved in favor of the static-label alternative, this step also updates the label — see that question.)
2. No other file changes. No changes to `globals.css`, `layout.tsx`, `TopBar.tsx`, or the theme-tracking logic itself.
3. Update `notes/architecture/theme-toggling.md`'s "Known gap" line under Accessibility to reflect that `aria-pressed` has been added, once implemented — this is a Do-stage documentation update, not a separate cycle, since it's the same fact this cycle is closing out.

## What files are expected to change

- `projects/ai-command-center/src/components/ui/ThemeToggle.tsx` — the only application code file.
- `notes/architecture/theme-toggling.md` — the "Known gap" note updated to reflect the fix (small, factual edit, not a re-derivation of the pattern).

No other file should change. If Do finds itself touching anything else, that's scope creep to flag, not proceed with.

## How Do should verify it in a real browser

Per the updated `agents/roles/do.md`, this is exactly the kind of interactive/stateful UI change that requires browser verification beyond reload, specifically:

- **Reload behavior:** with a stored preference (e.g. `localStorage` theme = `"dark"`), reload and confirm `aria-pressed="true"` is correct immediately, not just the visual theme.
- **Live state change:** with no explicit choice stored, change the OS/system color scheme while the tab stays open (the exact scenario the last cycle's bug lived in) and confirm `aria-pressed` updates live, in sync with the label and the visual theme — since all three now derive from the same `theme` state, this should hold "for free," but must be verified directly, not assumed.
- **User interaction after a state change:** click the toggle and confirm `aria-pressed` flips immediately and matches the new visual theme.
- **Explicit choice vs. system/default:** make an explicit choice via a click, then change the OS theme again, and confirm `aria-pressed` stays with the explicit choice rather than following the system change — mirroring the same rule already verified for the label and background.
- Recommended technique: Playwright's accessibility-tree-aware locator (e.g. `page.getByRole('button', { pressed: true/false })`) rather than only reading the raw `aria-pressed` string attribute, since that better represents what assistive tech actually perceives.

## Risks

- **Label/state coherence risk (see the Open Question below):** if the existing dynamic label is kept as-is, the combination with `aria-pressed` is technically correct but reads slightly awkwardly to screen reader users, compared to the more conventional static-label pattern.
- Otherwise low risk: this derives from an already-correct, already-tested state variable; no new state-tracking logic is being introduced.

## Open Questions

1. **Keep the existing dynamic label as-is, or switch to a static, feature-naming label?**
   - **Option A (minimal, recommended given the goal says "add `aria-pressed` to the existing button," not "redesign it"):** keep `aria-label`/`title` exactly as they are ("Switch to dark mode" / "Switch to light mode"), and add `aria-pressed` alongside them. Smallest possible change; slightly non-canonical combination as described above.
   - **Option B (more conventional per ARIA Authoring Practices):** change the label to something static like `aria-label="Dark mode"`, and let `aria-pressed` carry all the state information. More textbook-correct, but changes existing, already-shipped wording — a small UX change beyond what the goal asked for.
   - Recommendation: Option A, to honor "do not redesign the toggle." Flagging Option B in case you'd rather fix both at once now instead of possibly revisiting later.
2. Confirm the "pressed = dark" mapping (rather than "pressed = light") matches your intent — this seemed like the more natural reading but is worth your explicit sign-off since it's user-facing semantics, not just an implementation detail.

## Non-Goals

- No three-state toggle, no change to the two-state model.
- No change to the theme-tracking mechanism (state variable, `matchMedia` listener, pre-paint script, CSS overrides) — all of that already works and is out of scope here.
- No visual/design changes.
- No changes to any file outside `ThemeToggle.tsx` and the one factual line in `notes/architecture/theme-toggling.md`.
