---
description: Run one Plan → Do → Check → Act cycle in agents/runs/. Do implements in the main session, never a subagent. Stops for human approval before Do starts, and again before any commit.
argument-hint: [goal]
---

# /pdca — Run one PDCA cycle

This command sequences one Plan → Do → Check → Act cycle. It does not replace or restate the
canonical role definitions — it only removes the need to manually re-explain and re-invoke each
step by hand. The canonical sources of truth remain:

- `agents/roles/plan.md`, `agents/roles/do.md`, `agents/roles/check.md`, `agents/roles/act.md` —
  each role's mission, inputs, responsibilities, and output format.
- `.claude/agents/plan.md`, `.claude/agents/check.md`, `.claude/agents/act.md` — the Claude Code
  subagent wrappers around those roles.

If any instruction below ever conflicts with those files, the canonical files win — fix this
command rather than trusting a drifted copy.

## Goal argument

The user may invoke this as `/pdca <goal text>` or as `/pdca` with no argument.

- **If a goal was given** (`$ARGUMENTS` is non-empty): pass that goal text to the `plan` subagent
  as the stated goal for a new cycle.
- **If no goal was given** (`$ARGUMENTS` is empty): do **not** ask the user to restate a goal and
  do not invent one. Invoke the `plan` subagent with no goal specified. Plan already has its own
  documented fallback behavior for this case — per `agents/roles/plan.md`'s Inputs section and the
  Plan subagent wrapper's "Locating cycle inputs" section, it checks the most recent checkpoint
  under `notes/checkpoints/` for Next Actions first, falling back further only when a specific run
  folder is clearly relevant. This command does not reimplement or duplicate that logic — it only
  needs to omit forcing a goal argument and let Plan's existing behavior take over. Do not invent
  scope beyond whatever Plan itself surfaces this way.

## Sequence

1. **Invoke the `plan` subagent** (Agent tool, `subagent_type: plan`) with the goal from above.
   Plan produces `agents/runs/<date>-<slug>/plan.md` and, per its own role, does not implement
   anything.

2. **STOP. Present the finalized plan to the human and wait for explicit approval before Do does
   anything.** This is a hard stop, not a suggestion — end your turn here if the plan has open
   questions or has not yet been explicitly approved. Do not proceed to step 3 based on an assumed
   "looks fine" or a lack of objection. Only an explicit approval (e.g. "approved", "proceed to
   Do") from the human moves this to step 3. If the plan has open questions, surface them to the
   human (e.g. via clarifying questions) and loop back to step 1/2 with a finalized plan before
   proceeding — do not let Do start against a plan with unresolved open questions.

3. **Do implements the approved plan in the main session.** Do is never a subagent — it always runs
   as the default session, per the twice-reaffirmed design rationale in
   `notes/checkpoints/2026-07-20-pdca-subagents.md` (section 3): Do needs the broadest tool access
   (Edit/Write/Bash, unrestricted), which doesn't map onto the restricted subagent permission model
   the way Plan/Check/Act's narrow boundaries do. **Never create or invoke a "Do subagent" as part
   of this command, now or as a future change to this file.** Do follows `agents/roles/do.md`:
   implement each step in the approved plan faithfully, flag scope creep back to the human instead
   of silently expanding it, and write a Change Log to `agents/runs/<date>-<slug>/changelog.md`.

4. **Invoke the `check` subagent** (Agent tool, `subagent_type: check`) against the same run folder.
   Check independently verifies Do's output against the approved plan and writes
   `agents/runs/<date>-<slug>/review.md`.

5. **Immediately invoke the `act` subagent** (Agent tool, `subagent_type: act`) against the same run
   folder — **no human approval gate between steps 4 and 5**, matching every prior cycle's
   precedent. Act writes `agents/runs/<date>-<slug>/retro.md`: what was learned, what (if anything)
   changed in `notes/`, and proposed Next Actions.

6. **STOP. Present Check's verdict and Act's Next Actions to the human, and do not commit
   anything.** This is a second, independent hard stop — separate from the plan-approval gate in
   step 2, and it does not get satisfied by that earlier approval. Do not run `git commit` (or
   push) until the human explicitly asks for a commit in a later message. Next Actions are
   proposals only — the human picks what happens next, not this command.

## Hard constraints (apply to every invocation of this command)

- Never create, invoke, or reference a "Do subagent." Do always runs in the main session.
- Never skip or merge the two approval gates (step 2 and step 6). They are independent: approving
  the plan does not also approve the commit.
- Never commit or push without an explicit, separate human instruction to do so, even after Check
  passes and Act closes the cycle.
- Never duplicate or restate the content of `agents/roles/*.md` or `.claude/agents/*.md` inside this
  file — reference them.
- Never fabricate a goal when `$ARGUMENTS` is empty — only use whatever Plan's own existing
  fallback surfaces.
