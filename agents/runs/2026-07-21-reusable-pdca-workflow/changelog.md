# Change Log: Reusable PDCA Workflow Command

## Files changed

- `.claude/commands/pdca.md` — new file, the only artifact this cycle creates. No application code,
  `agents/roles/*.md`, `.claude/agents/*.md`, or `agents/README.md` were touched.

## What was built and why

Created `.claude/commands/pdca.md`, a Claude Code project slash command invoked as `/pdca [goal]`,
per the approved plan. Before drafting it, read in full: `agents/README.md`, all four
`agents/roles/*.md` files, and all three `.claude/agents/*.md` subagent wrappers, so the command
references the canonical role/subagent definitions rather than restating or forking them.

The command's body sequences, matching the approved plan's Steps exactly:

1. Determine the goal: if `$ARGUMENTS` is non-empty, pass it to the `plan` subagent as the stated
   goal. If empty, invoke `plan` with no goal and let Plan's own existing fallback (checking the
   latest `notes/checkpoints/` entry for Next Actions, per `agents/roles/plan.md`'s Inputs section
   and the Plan subagent wrapper's "Locating cycle inputs" section) take over. The command does not
   duplicate or reimplement that fallback logic.
2. Invoke the `plan` subagent to produce `agents/runs/<date>-<slug>/plan.md`.
3. **Approval gate 1** — an explicit "STOP" instruction: present the plan and wait for explicit
   human approval before Do does anything. Exact wording used: *"STOP. Present the finalized plan
   to the human and wait for explicit approval before Do does anything. This is a hard stop, not a
   suggestion — end your turn here..."* The instruction also explicitly forbids treating "no
   objection" as approval, and requires looping back if open questions remain.
4. Do implements the approved plan in the main session — the command states plainly that Do is
   never a subagent, citing the twice-reaffirmed rationale in
   `notes/checkpoints/2026-07-20-pdca-subagents.md` section 3, and instructs Do to follow
   `agents/roles/do.md` (implement faithfully, flag scope creep, write `changelog.md`).
5. Invoke the `check` subagent against the same run folder to produce `review.md`.
6. Immediately invoke the `act` subagent (no gate between steps 5 and 6, matching all five prior
   cycles' precedent) to produce `retro.md`.
7. **Approval gate 2** — a second, independent "STOP" instruction: present Check's verdict and
   Act's Next Actions, and do not commit. Exact wording used: *"STOP. Present Check's verdict and
   Act's Next Actions to the human, and do not commit anything. This is a second, independent hard
   stop — separate from the plan-approval gate in step 2, and it does not get satisfied by that
   earlier approval."*

A "Hard constraints" section at the end restates, in one place, the things that must never happen
regardless of future edits to this file: no Do subagent, no skipping/merging the two gates, no
commit/push without a separate explicit instruction, no restating role files, no inventing a goal
on empty `$ARGUMENTS`.

## Smoke test performed (plan Step 3)

Rather than waiting for a human to literally type `/pdca` in a chat session, smoke-tested the
command's logic directly by invoking the `plan` subagent exactly as the command's Sequence step 1
instructs when `$ARGUMENTS` is empty — mirroring how the original Plan subagent smoke test
(`agents/runs/2026-07-16-readme-run-instructions/`) validated Plan in isolation before any full
cycle ran.

- Plan subagent was told to simulate a no-argument `/pdca` invocation: check the latest checkpoint
  under `notes/checkpoints/` for Next Actions, select one without inventing a goal, and produce a
  real Plan Document.
- **Result:** Plan read `notes/checkpoints/2026-07-21-first-subagent-assisted-pdca.md` (the latest),
  correctly identified its three listed Next Actions, and selected the one that was concrete and
  immediately actionable ("trim the duplicate npm wording" — the other two were explicitly
  deferred/methodological, not ready-to-plan items) — exactly the kind of judgment call the
  no-argument fallback needs to make correctly.
- Produced a genuine Plan Document at
  `agents/runs/2026-07-21-readme-npm-wording-cleanup/plan.md` and stopped there, per its own role —
  **no implementation occurred**, confirming the command's step 1 → step 2 (approval gate) sequence
  holds: Plan runs, a real plan is produced, and nothing proceeds to Do without a human approving
  it.
- This smoke test's byproduct run folder (`agents/runs/2026-07-21-readme-npm-wording-cleanup/`) is
  left in place, untouched further, exactly as the earlier Plan-subagent smoke test's byproduct
  (`agents/runs/2026-07-16-readme-run-instructions/`) was left in place rather than being retroactively
  cleaned up.

## Next Action filed for Act (per plan Step 6)

`agents/README.md` still contains stale wording ("Status: Phase 1 ... No subagents wired up ... No
slash command.") that no longer reflects reality now that `plan`/`check`/`act` subagents exist, one
full subagent-assisted cycle has run through them, and `/pdca` now exists as a slash command. Per
the approved plan and explicit human decision, this cycle does **not** touch `agents/README.md` in
any form. Act should surface a Next Action recommending a future cycle update that file's Status
section to reflect Phase 2 (subagents) and Phase 4 (slash command) reality.

## Deviations from the plan

None. All six plan steps were followed as approved. `agents/README.md`, `agents/roles/*.md`, and
`.claude/agents/*.md` were read but not modified. No Do subagent was created. Both approval gates
are present in the command's wording, independently of each other. No commit was made.

## Files NOT touched (confirmed via `git status --short`)

Only `.claude/commands/pdca.md` (new) plus this run folder's own new files
(`plan.md`, this `changelog.md`) and the smoke test's byproduct run folder
(`agents/runs/2026-07-21-readme-npm-wording-cleanup/`) show as untracked. No application code,
`agents/README.md`, `agents/roles/*.md`, or `.claude/agents/*.md` were modified.
