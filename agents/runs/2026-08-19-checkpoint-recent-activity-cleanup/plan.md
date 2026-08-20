# Plan: Record a checkpoint for the 2026-08-19 RecentActivity/nextActions cleanup cycle

## Goal

Write a new `notes/checkpoints/` entry documenting the outcome of the already-completed,
already-committed `agents/runs/2026-08-19-cleanup-recent-activity-next-actions/` cycle (commit
`2303e43 "Clean up stale AI Command Center activity copy"`), which resolved two of the three
items the `2026-08-04-pdca-status-section` checkpoint deferred: `RecentActivity.tsx`'s stale
"No activity yet" copy, and the stale `"Design the Plan / Do / Check / Act agent workflow"`
entry in `src/data/actions.ts`. This is a documentation/housekeeping cycle — no application
code changes.

## Scope

**In scope:**
- One new file: `notes/checkpoints/2026-08-19-recent-activity-cleanup.md`, following the
  same 7-section structure as the precedent checkpoint
  (`notes/checkpoints/2026-08-04-pdca-status-section.md`): What was completed, Target cycle,
  Artifacts changed, Current git state, Outcome, What this proves, Lessons / Next Actions.
- Content sourced only from the target cycle's own artifacts — `agents/runs/2026-08-19-cleanup-recent-activity-next-actions/plan.md`,
  `changelog.md`, `review.md`, `retro.md` — plus `git log`/`git show` to confirm the commit
  hash and files actually changed. No new claims beyond what those source documents already
  establish.
- The new checkpoint's "Lessons / Next Actions" section carries forward the current, still-open
  Next Actions, combining two sources:
  - From the 2026-08-19 cycle's own `retro.md`: re-validate the two remaining `nextActions`
    entries; connect `RecentActivity` to a real agent log; consider a `notes/decisions/` entry
    on the "flag-in-checkpoint → resolve-in-later-cycle" pattern.
  - Explicitly re-surfaced from the 2026-08-04 checkpoint (per human decision, since it was not
    addressed by the 08-19 cycle and does not appear in its retro): the still-open "watch for
    copy drift between `PdcaStatus.tsx` and `agents/README.md`'s Status section" item, so it
    doesn't silently drop out of the fallback-checkpoint trail.
  This makes the new checkpoint — not just the retro — the complete, up-to-date fallback source
  for the next Plan cycle.
- Standard cycle housekeeping: Check independently re-derives every factual claim in the new
  checkpoint from the source artifacts and git history; Act commits the new file and writes its
  own retro.

**Out of scope:** see Non-Goals.

## Steps

1. Do re-reads the four source artifacts in `agents/runs/2026-08-19-cleanup-recent-activity-next-actions/`
   (plan, changelog, review, retro) and confirms the commit hash/message via `git log` /
   `git show 2303e43 --stat`.
2. Do drafts `notes/checkpoints/2026-08-19-recent-activity-cleanup.md` at the confirmed path,
   using the established 7-section format, summarizing: what changed (two stale-copy fixes, no
   live data wiring added), the Pass verdict and how Check verified it (build/lint re-run, live
   dev-server HTML grep, `git diff --stat` confirming README was untouched), and the
   "checkpoint-recorded lessons function as real cross-cycle memory" finding from the retro.
3. Do's "Lessons / Next Actions" section in the new checkpoint restates, in substance (not
   reworded into new claims), four open items: the three carried forward from the 2026-08-19
   retro, plus the copy-drift watch-item re-surfaced from the 2026-08-04 checkpoint — all
   explicitly framed as proposals for a human to select from, not commitments.
4. Check independently re-reads the same four source artifacts plus `git show 2303e43` and
   verifies every factual claim in the new checkpoint (files changed, verdict, commit hash,
   Next Actions content — including that the copy-drift item is present and accurately
   describes the still-open state from the 2026-08-04 checkpoint) traces back to those sources
   with no fabrication or drift. Check also confirms via `git diff --stat` (or equivalent) that
   this cycle touched exactly one new file, at the exact confirmed path — no application code,
   no edits to any existing checkpoint or run folder.
5. Act writes its own retro for this checkpoint-writing cycle and, on approval, commits the new
   checkpoint file.

## Risks

- **Redundancy with the target cycle's own `retro.md`.** The new checkpoint will restate
  information already recorded in `agents/runs/2026-08-19-cleanup-recent-activity-next-actions/retro.md`.
  This duplication is the established pattern (checkpoints are the durable, top-level fallback
  record; retros are per-cycle detail) but means two places must be read to get full context —
  same tradeoff the 08-04 checkpoint already accepted.
- **Next Actions drift if not copied faithfully.** If the new checkpoint's Next Actions section
  paraphrases rather than faithfully carries forward the source items (both the 08-19 retro's
  list and the re-surfaced copy-drift item), future Plan cycles reading only the checkpoint
  (per the documented fallback behavior) could miss or misstate an open item.
- **The re-surfaced copy-drift item needs care not to overstate status.** It is a standing
  "watch for" item, not a completed or in-progress action — the new checkpoint should describe
  it exactly as still-open and unaddressed, not imply any work has happened on it since
  2026-08-04.

## Open Questions

Both resolved by the human:

1. **Checkpoint filename** — confirmed: `notes/checkpoints/2026-08-19-recent-activity-cleanup.md`.
2. **Copy-drift watch-item** — confirmed: explicitly re-surface the still-open "watch for copy
   drift between `PdcaStatus.tsx` and `agents/README.md`'s Status section" item (originally
   flagged in the 2026-08-04 checkpoint) in this new checkpoint's Next Actions section, so it
   doesn't silently drop out of the fallback-checkpoint trail.

## Non-Goals

- No changes to any application code (AI Command Center or otherwise).
- No edits to any existing file under `notes/checkpoints/` or `agents/runs/` — the 08-04
  checkpoint and the 08-19 cycle's own artifacts remain untouched historical records.
- No re-validation of the two remaining `nextActions` entries' staleness ("Decide how MCP
  servers connect into the agent system", "Turn Projects into real project pages") — that stays
  an open, unstarted Next Action, only restated, not acted on, here.
- No decision on whether to write a `notes/decisions/` entry about the checkpoint-resolution
  pattern — that also stays an open, unstarted Next Action, only restated here.
- No work on connecting `RecentActivity` to a real agent log — that remains future scope.
- No resolution of the copy-drift watch-item itself (i.e., no comparison or edit of
  `PdcaStatus.tsx` or `agents/README.md`'s Status section content) — it is only re-surfaced as
  an open item, not investigated or acted on, in this cycle.
