# Checkpoint — Reusable PDCA Workflow Command

**Date:** 2026-07-22

## 1. What was completed

The second real PDCA cycle run through the subagent-assisted workflow, this time producing a
reusable workflow artifact rather than a project-level change. Run folder:
`agents/runs/2026-07-21-reusable-pdca-workflow/`. This graduates the now-repeatedly-proven manual
Plan → Do → Check → Act sequence into a single invocable command, per `docs/capability-map.md`'s
own definition of the "Workflows" capability layer — a process done the same way several times by
hand should graduate into a named, documented Workflow.

## 2. Artifact created

`.claude/commands/pdca.md` — a Claude Code project slash command, invoked as `/pdca [goal]`, sitting
as a sibling of the already-established `.claude/agents/` convention. It references the canonical
`agents/roles/*.md` and `.claude/agents/*.md` definitions rather than restating or forking them.

## 3. Workflow encoded

```
Plan subagent → stop for human approval → Do (main session) → Check subagent → Act subagent → stop before commit
```

- Plan subagent runs first, producing `agents/runs/<date>-<slug>/plan.md`. If invoked with no goal
  argument, it delegates to Plan's own existing checkpoint-fallback logic rather than duplicating it.
- A hard, explicit "STOP" gate follows: the plan is presented and nothing proceeds until the human
  explicitly approves it — worded to reject "no objection" as implicit approval.
- Do implements the approved plan in the main session — explicitly and unambiguously never a
  subagent, per the twice-reaffirmed rationale in
  `notes/checkpoints/2026-07-20-pdca-subagents.md` (section 3).
- Check subagent verifies Do's work against the plan, then Act subagent closes the cycle
  immediately after — no approval gate between Check and Act, matching all prior cycles' precedent.
- A second, independent hard "STOP" gate follows: Check's verdict and Act's Next Actions are
  presented, and nothing is committed until the human separately asks for it.

## 4. Current git state

Latest commit on `origin/main`:

```
f74a7a6 Add reusable PDCA workflow command
```

## 5. Check/Act outcome

**Pass with notes.** Check independently re-derived every claim from scratch — scope via
`git diff`, the command's actual wording for both approval gates, the "Do is never a subagent"
language, the no-argument fallback's delegation to Plan, and confirmed no Do subagent file exists
anywhere — and found no confirmed or plausible defects. Act closed the cycle citing the same
outcome, with no `notes/` update warranted beyond this checkpoint.

## 6. Known notes / Next Actions

- **Real `/pdca` invocation still needs to be tested in a future cycle.** This cycle's smoke test
  exercised the Plan subagent's logic directly (simulating what the command would do), not the
  actual slash-command invocation mechanism itself — a known, expected gap, not a defect.
- **`agents/runs/2026-07-21-readme-npm-wording-cleanup/plan.md` is an intentional byproduct plan,
  not stalled work.** It was produced by the no-argument fallback smoke test (which correctly
  selected the one concrete, ready-to-plan Next Action from the prior checkpoint) and deliberately
  left unexecuted, with no changelog/review/retro, by design.
- **`agents/README.md` still has stale "Phase 1 / no subagents wired up / no slash command"
  wording** and should be cleaned up in a separate future cycle — left untouched in this cycle by
  explicit decision.

## 7. Recommended next mission

**Test a real `/pdca` invocation end-to-end, or clean up `agents/README.md`'s stale wording in a
separate small cycle.** The former closes the one meaningful verification gap this cycle left open
(the command has only been logic-tested, never actually invoked as a slash command); the latter is
a small, low-risk documentation fix that's been deferred twice now and keeps the repo's own
front-door documentation accurate.
