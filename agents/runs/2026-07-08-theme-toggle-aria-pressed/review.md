# Review: Add `aria-pressed` to ThemeToggle

Reviewed against `agents/runs/2026-07-08-theme-toggle-aria-pressed/plan.md` and `changelog.md`. All checks below were re-run independently — fresh browser sessions, my own scripts, not the Change Log's numbers taken on faith.

## Plan-vs-actual verdict

**Matches the plan.** `git diff` confirms exactly the two files the plan expected changed: one line added to `ThemeToggle.tsx` (`aria-pressed={theme === "dark"}`), and the two-line update to `theme-toggling.md` marking the gap closed and recording the label-wording tradeoff. No other file touched, no dependency changes.

## Answers to the seven things I was asked to verify

1. **`aria-pressed` added correctly** — yes. It's a plain boolean expression derived from the existing `theme` state, exactly as planned; no new state, no new logic.
2. **Reflects current state, not next action** — confirmed directly: right after a click, `aria-pressed` and `aria-label` briefly disagree in *framing* (label describes the next action, "Switch to light mode"; pressed describes the state just entered, `true` = dark) but both are internally consistent with "dark is now active." I verified this is `theme`-derived at render time, not tied to the click handler's `next` variable — so it can't drift into describing an action.
3. **`aria-label`/`title` intentionally unchanged** — confirmed. Byte-for-byte identical to before this cycle in the diff; the only line touching the button element is the new `aria-pressed` line.
4. **Only approved files changed** — confirmed via independent `git status`/`git diff` and a diff of `package.json`/`package-lock.json` (empty).
5. **Browser/accessibility checks sufficient** — yes, and appropriately so: they used `page.getByRole('button', { pressed })`, which reflects the accessibility tree (what assistive tech actually perceives), not just the raw attribute string. They covered all four scenarios the plan asked for (reload, live OS change, click, explicit-choice-vs-later-system-change). I independently re-ran all four myself and got the same results.
6. **No regressions from previous theme toggle behavior** — mostly confirmed, with one finding below (#1) that's real but pre-existing, not caused by this cycle.
7. **Test-script scoping issue handled correctly** — confirmed independently. I inventoried every `<button>` on the page myself: there genuinely are two, ours and Next.js's own dev-mode overlay ("Open Next.js Dev Tools", `data-next-mark="true"`, `aria-haspopup="menu"`), which doesn't exist in a production build. Scoping the query by accessible name (`name: /switch to/i`) was the correct fix, and I confirmed the underlying `ThemeToggle` behavior was never actually wrong — Do's diagnosis was accurate, not a rationalization.

## Findings

### 1. Confirmed, pre-existing, not introduced by this cycle — a React hydration-mismatch console warning when a stored preference differs from system preference at reload

**What's wrong:** With system preference dark and `localStorage` theme set to `"light"`, reloading produces a console warning: *"A tree hydrated but some attributes of the server rendered HTML didn't match the client properties,"* specifically calling out `data-theme="light"` on `<html>`. This happens because the pre-paint script (from the original cycle, `layout.tsx`) sets `data-theme` on the real DOM before React hydrates, but the server-rendered markup — which can't know `localStorage`'s contents — never included that attribute, so React's dev-mode hydration checker flags the discrepancy.

**Concrete scenario:** Any visitor whose OS is set to one theme but who has previously chosen the other via the toggle will see this warning in their browser console on every full page load (dev builds; production builds don't print this specific warning, though the same discrepancy exists in the DOM).

**Confidence:** Confirmed — reproduced directly with a console listener attached.

**Severity:** Low. I verified this is cosmetic, not functional: `aria-pressed`, the label, and the background all remained correct throughout (`ariaPressedAfterReload` correctly showed `"false"` matching the stored `"light"` choice). React doesn't attempt to "fix" this attribute because `data-theme` isn't one React manages via props on `<html>` — it just warns. This is not a regression from this cycle's change (the warning is about `data-theme`, not `aria-pressed`, and traces back to the pre-paint script from the *original* dark-mode cycle) — it was already latent, and simply hadn't been surfaced before because no prior test combined a console-error listener with the "stored preference differs from system preference, then reload" scenario in one run.

**Recommendation:** Not a blocker for this cycle — it's unrelated to `aria-pressed` and was not introduced by this Do pass. Worth a small, separate follow-up: add `suppressHydrationWarning` to the `<html>` element in `layout.tsx`, which is the standard, documented fix for this exact pattern (used by libraries like `next-themes` for the same reason). Logging as a Next Action for Act rather than expanding this cycle's scope.

## Recommendation

**Pass.** The approved plan was implemented exactly, both decisions were honored precisely, scope was respected, and all four required verification scenarios hold up under independent re-testing. Finding #1 is real but out of scope for this cycle (a pre-existing issue in shared infrastructure from the *previous* cycle, not something this change introduced) and doesn't block closing this one out — it should be carried forward as a Next Action.

## Final verdict: **Pass with notes**

Pass on everything this cycle was responsible for. "With notes" because of finding #1 — a real, confirmed, low-severity issue that predates this cycle and isn't caused by it, but that Act should carry forward rather than let disappear now that it's been surfaced.
