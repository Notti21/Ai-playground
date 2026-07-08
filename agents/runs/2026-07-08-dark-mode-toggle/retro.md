# Retro: Manual light/dark theme toggle

First full PDCA cycle run end-to-end, by hand, following `agents/roles/*.md`. Closing it out per `agents/roles/act.md`.

## 1. What was planned

A manual light/dark toggle for AI Command Center's `TopBar`, scoped tightly: theme-switching mechanism + one toggle control only, no other section touched. Three decisions were left open for approval and resolved as: two-state (Light/Dark, no "System" option), default-to-system-until-a-manual-choice-is-made (then persist in `localStorage`), and an icon-only sun/moon control with an accessible label. Full detail in `plan.md`.

## 2. What was implemented

Exactly the five planned steps: a `data-theme` CSS override layer in `globals.css` (sitting alongside, not replacing, the existing `prefers-color-scheme` media query), a pre-paint inline script in `layout.tsx` to prevent a flash of the wrong theme, a new `ThemeToggle.tsx` client component, mounting it in `TopBar.tsx`, and a first round of build/lint/browser verification. Scope held exactly to plan — no section component outside `TopBar` was touched, and no dependency files changed. Full detail in `changelog.md`.

## 3. What Check found

One confirmed bug, one non-blocking suggestion:

- **Confirmed:** if the OS theme changed while the tab stayed open, and the visitor hadn't made an explicit choice yet, the toggle's label and next-click behavior went stale — the page's background updated live (plain CSS), but the toggle's own React state didn't, because nothing was listening for the system-level change. Reproduced directly, not inferred from reading code.
- **Plausible, non-blocking:** no `aria-pressed` on the toggle button — a more complete accessibility pattern for a two-state toggle, but not something the plan required.

Check also noted the original browser verification only exercised the "reload" path, never the "live change while the tab is open" path — which is exactly why the bug wasn't caught the first time. Full detail in `review.md`.

## 4. What was fixed after Check

Do added a `matchMedia('(prefers-color-scheme: dark)')` change listener inside the existing mount effect in `ThemeToggle.tsx` — the only file touched in the fix. It updates the toggle's state on a live system change only when no explicit choice exists yet (`data-theme` attribute absent); once a choice has been made, later system changes are correctly ignored, preserving the two-state model. Check re-reviewed independently in a fresh browser session and confirmed: the bug is fixed, no new scope was added, the previously-passing checks (default-follows-system, persistence-across-reload, keyboard access) still hold, and the explicit-choice-wins behavior is intact.

## 5. Final outcome

**Pass.** One fix-and-reverify loop was needed; the feature is complete, scoped exactly as planned, and independently verified at every stage (Plan → Do → Check → fix → re-Check), not just self-reported.

## 6. Lessons learned about the PDCA process

- **The segregation of duties worked exactly as designed.** Do's own testing was reasonably thorough (build, lint, multiple real-browser scenarios) but still missed a real bug, because it only tested the paths it thought to test. Check, working independently and deliberately trying to break the feature rather than confirm it, found a scenario Do hadn't considered. This is the concrete payoff of `agents/roles/check.md`'s "never assume correctness without testing it" principle, and validates a core premise of `notes/decisions/2026-07-08-ai-organization-design.md` (Do and Check must be separate functions).
- **The role templates did not need revision.** The original assumption going into this cycle (per the checkpoint's recommended next step) was that running a real cycle would likely expose awkwardness in `agents/roles/*.md` requiring changes. It didn't — Plan's Open Questions gate, Do's "flag deviations" habit, and Check's "test what can be tested" mandate all worked as written. Worth recording as a genuine (if unglamorous) finding: no template changes are being proposed this cycle.
- **One small, worth-proposing refinement (not applied yet):** Check's finding surfaced a specific, nameable gap — "test the reload path" is not the same as "test a live, in-session state change." `agents/roles/do.md`'s Responsibilities could be sharpened to say so explicitly, so future Do cycles catch this class of bug before Check has to. Proposed as a Next Action below rather than edited directly — role files are operating documents you should review changes to, not something Act rewrites unilaterally.

## 7. Follow-up items / Next Actions

1. **Non-blocking:** add `aria-pressed` to `ThemeToggle` for more complete two-state toggle-button accessibility semantics. Small, isolated, not urgent.
2. **Process refinement (proposed, not applied):** consider adding a line to `agents/roles/do.md`'s Responsibilities prompting Do to test live/interactive state changes, not just load/reload behavior — directly motivated by what Check caught this cycle.
3. **Deferred by design, not forgotten:** if a visitor ever asks for a way to explicitly return to "follow my OS" after making a manual choice, revisit the two-state vs. three-state ("System") decision that Plan intentionally deferred in favor of simplicity.
4. **Reuse opportunity:** if any future project needs light/dark support, the pattern built here (CSS custom properties + `data-theme` attribute override + pre-paint script + `matchMedia` listener that respects an explicit choice) is directly reusable — see the proposed durable note below.
5. **Roadmap:** this is the first PDCA cycle run end-to-end by hand, satisfying the 1-month success criterion in `docs/business-os-manifesto.md`. The natural next step per the agreed roadmap (`notes/decisions/2026-07-08-ai-organization-design.md`, Phase 2) is wrapping these roles as Claude Code subagent definitions, now that the manual process has been validated once on a real task.

## 8. Durable notes / decisions

**Recommended, not yet created:** a living architecture note, `notes/architecture/theme-toggling.md`, documenting the reusable pattern from this cycle (CSS custom properties as the only place components read color from, the `data-theme` override layer, the pre-paint script, and the "explicit choice wins over later system changes" rule) — so a future project needing light/dark support doesn't have to re-derive this design or re-discover the flash/staleness pitfalls. This fits `docs/capability-map.md`'s Knowledge capability (`notes/architecture/` — living documents) rather than `notes/decisions/` (immutable point-in-time record), since it's a "how we build this" reference likely to be refined, not a one-time structural ruling.

No `notes/decisions/` entry is warranted — nothing here was a structural or organizational choice; it was task execution within already-decided scope.

I'm holding off creating that file until you confirm, consistent with how file creation has been gated throughout this project. Let me know and I'll write it.
