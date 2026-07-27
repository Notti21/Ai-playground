# Retro — Clean up `agents/README.md`'s stale wording

## What we learned

- **The cleanup itself landed cleanly.** Do made exactly the four targeted edits the plan called
  for (Status → "Phase 4 complete," the Orchestrator diagram line, the `runs/` folder-guide line,
  and one clarifying paragraph after "How one cycle works") and touched nothing else. Check
  independently re-derived every claim from scratch — `git diff --stat`, cross-checks against
  `.claude/agents/*.md`, `.claude/commands/pdca.md`, the roadmap table in
  `notes/decisions/2026-07-08-ai-organization-design.md`, and an independent count of 8 run
  folders — and found the diff surgical, not a rewrite. This is the cycle working exactly as a
  small, well-scoped documentation fix should: no scope creep, no forked documentation (the README
  references canonical sources rather than restating them), no drift.

- **This cycle quietly closed a second, more important open item: a real `/pdca` invocation.**
  The plan's own Non-Goals section explicitly deferred "testing a real `/pdca` slash-command
  invocation end-to-end" to a separate cycle — meaning the plan's *content* was scoped to the
  README fix only. But the *mechanism* by which this cycle was produced was a genuine, unscripted
  `/pdca` invocation with no goal argument, which for the first time exercised Plan's
  checkpoint-fallback logic for real rather than in simulation (the prior cycle,
  `2026-07-21-reusable-pdca-workflow`, had only smoke-tested that logic directly). That prior
  cycle's retro listed "test a real `/pdca` invocation end-to-end" as Next Action #1 — this cycle
  satisfies it, incidentally rather than by design. Worth flagging explicitly: a cycle's *subject
  matter* (what Plan scopes in/out) and the *invocation path that produced it* (hand-run steps vs.
  a real slash command) are two independent things, and a retro should check both before declaring
  a Next Action closed.

- **Checkpoint-fallback selected a small, safe item — which is itself a useful data point.** Given
  two candidate Next Actions in `notes/checkpoints/2026-07-22-reusable-pdca-command.md` §7 (README
  cleanup vs. testing `/pdca` itself), the no-argument fallback picked the lower-risk, purely
  documentation-only one rather than the more consequential "test /pdca" item — which turned out to
  be resolved anyway, just as a side effect of the invocation mechanism rather than as the chosen
  subject. This suggests the fallback logic's selection criteria (however it weighs candidates)
  tend toward safe, bounded items, which is a reasonable default but worth watching over more
  cycles before treating it as a settled behavior.

- **Nothing about this cycle stress-tested the approval gates.** Both STOP gates in
  `.claude/commands/pdca.md` (before Do starts, before any commit) were presumably exercised during
  this real invocation, but neither plan.md, changelog.md, nor review.md records *how* the human
  interacted with them (e.g., whether approval was explicit, whether there was any hesitation or
  ambiguity in how the gate was presented). For a cycle whose main significance is "first real
  `/pdca` invocation," that's a gap in the record — future real invocations should have Check or
  Act explicitly note whether the gates behaved as documented, not just that the artifacts turned
  out correct.

## What changed in `notes/`

None. Per the plan (explicitly out of scope), the changelog, and the review, no `notes/` update was
warranted for the README fix itself, and no instruction was given to update `notes/` for this
cycle's meta-significance (the real `/pdca` invocation) either. That fact is recorded here in this
retro instead, per the instructions governing this cycle.

## Next Actions

1. **Record the first real `/pdca` invocation as a checkpoint or decision.** This is arguably the
   most durable fact to come out of this cycle — more durable than the README wording itself — and
   it currently lives only in this retro and in the orchestrating agent's own framing of the task,
   not in `notes/`. A future cycle (or a direct instruction to Act) should capture: what triggered
   the no-argument fallback, which candidate it selected and why, and confirmation that both
   approval gates were exercised as documented in `.claude/commands/pdca.md`.
2. **When a cycle is invoked via a real `/pdca` run, have Check or Act explicitly verify gate
   behavior, not just output correctness.** Add a line to future Check/Act work (or to
   `.claude/commands/pdca.md` itself, if a future cycle touches it) confirming that both STOP gates
   were presented and separately approved — not just that the eventual artifacts match the plan.
   This closes the observation above about an unrecorded gate-behavior gap.
3. **Consider the trivial Phase-3-evidence gap Check flagged.** The Status section's "Phase 4
   complete" claim doesn't explicitly cite Phase 3 evidence the way it cites Phase 4/5, even though
   the inference (8 run folders, multiple checkpoints) clearly supports it. Not a defect — Check
   passed the cycle clean — but a small future polish item if `agents/README.md` is touched again.
4. **Continue observing checkpoint-fallback's selection behavior over more real invocations.** This
   cycle's fallback picked the lower-risk of two candidates; one data point isn't enough to
   characterize the logic's general behavior. Worth a light note in a future cycle once a few more
   real, no-argument `/pdca` invocations have happened.

These are proposals only — they feed the next Plan cycle, and a human selects which one (if any)
starts a new cycle.
