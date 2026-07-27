# Plan — Clean up `agents/README.md`'s stale wording

## Goal

Update `agents/README.md` so it accurately reflects the current state of the PDCA system —
Plan/Check/Act subagents wired up, a `/pdca` slash command in place, and a growing history of real
run folders — instead of the "Phase 1, everything is manual, no automation yet" description left
over from before those were built.

This is one of two candidate Next Actions recommended in the latest checkpoint
(`notes/checkpoints/2026-07-22-reusable-pdca-command.md`, section 7); the other — testing a real
`/pdca` invocation end-to-end — is left for a separate cycle (see Non-Goals).

## Scope

**In scope:**
- `agents/README.md` only.
- Correcting statements that are now factually wrong or stale, specifically:
  - The "Status: Phase 1" section's claim of "no automation yet: No subagents wired up. No slash
    command. No MCP integration," which is now inaccurate for the first two points.
  - The "Who's who" diagram's "Orchestrator — (you, for now — see Status below)" note: update it to
    say that the `/pdca` slash command now handles the mechanical sequencing of the four roles,
    while the human remains the orchestrator in the sense that matters — stating goals and giving
    approvals at the Plan and Check/Act gates. Do not remove the human from the diagram or imply the
    loop now runs unattended; the human is still "Orchestrator" for goals/approvals, `/pdca` is the
    thing that now does the sequencing on their behalf.
  - The "Folder guide" line stating `runs/` is "Not created yet — the first one is created when you
    run your first cycle," which is stale now that eight-plus run folders exist.
  - The "How one cycle works" narrative, only if it no longer matches the actual subagent-mediated
    flow described in `.claude/commands/pdca.md` (e.g., it should still reflect that Do runs in the
    main session, never a subagent).
- Keeping the document's existing tone, structure, and heading layout intact — this is a factual
  accuracy pass, not a rewrite.

**Out of scope:** anything not in `agents/README.md` (see Non-Goals), and any change to `notes/` —
this is a factual correction to existing documentation, not a new decision or architectural change,
so no `notes/` update is warranted this cycle (the checkpoint system already tracks this history).

## Steps

1. Re-read `agents/README.md` in full alongside the canonical sources it should stay consistent
   with: `agents/roles/*.md`, `.claude/agents/plan.md`/`check.md`/`act.md`, and
   `.claude/commands/pdca.md`.
2. Identify every sentence in `agents/README.md` that is now factually stale (subagents, slash
   command, run-folder existence) versus sentences that are still accurate and should be left
   alone.
3. Rewrite the "Status" section to describe the current state accurately: Plan, Check, and Act are
   wired up as subagents; Do intentionally remains the main session, not a subagent (per
   `notes/checkpoints/2026-07-20-pdca-subagents.md`, section 3); a `/pdca` slash command sequences
   the full cycle; no MCP integration yet (this part is still true and can stay).
4. Update the "Who's who" diagram's "Orchestrator" line so it reads accurately: the `/pdca` command
   now performs the sequencing that used to be manual, while the human is still the one who states
   the goal and approves at each gate. Word this so it doesn't go stale again if the mechanism
   changes later (avoid over-specifying implementation details of `/pdca` itself).
5. Update the "Folder guide" line about `runs/` to reflect that run folders now exist, without
   needing to enumerate or link every one (avoid creating a maintenance burden of keeping a list in
   sync).
6. Check the "How one cycle works" list for any wording that implicitly assumes everything is
   manual (e.g., "you open a Claude Code session and explicitly tell it to act as a given role");
   update only if it contradicts the current subagent/slash-command reality, otherwise leave as-is.
7. Write a Change Log to `agents/runs/2026-07-22-agents-readme-cleanup/changelog.md` describing
   exactly what changed and why, per `agents/roles/do.md`.

## Risks

- **Scope creep into a full README rewrite.** The existing document has a specific voice and
  structure; Do should correct stale facts, not restructure or expand the document's scope (e.g.,
  don't add new diagrams or sections beyond what's needed to fix accuracy).
- **Introducing new staleness.** Overly specific claims (e.g., naming an exact count of run folders
  or listing every subagent capability in detail) could go stale again quickly; prefer wording that
  stays accurate as the system keeps evolving. This applies to the Orchestrator-line rewording too:
  describe `/pdca`'s role functionally (sequencing the cycle) rather than in implementation detail
  that could drift out of sync with `.claude/commands/pdca.md`.
- **Drift from canonical sources.** `agents/README.md` should describe the system, not restate or
  fork `agents/roles/*.md`, `.claude/agents/*.md`, or `.claude/commands/pdca.md` — if Do finds itself
  copying large chunks of those files' content, that's a sign to summarize and reference instead.
- **Low but nonzero risk of misrepresenting the Do-is-never-a-subagent rationale** if it's touched at
  all — this point has been reaffirmed twice already and any rewording should preserve it exactly,
  not paraphrase it into something weaker.
- **Diluting the human's role.** When updating the Orchestrator line, care should be taken not to
  understate that the human still owns goals and approvals — `/pdca` automates sequencing, not
  judgment or authorization.

## Open Questions

None remaining. Both items raised in the prior draft of this plan have been resolved by the human:

1. The "Orchestrator" line should be updated (not left as-is) to note that `/pdca` now handles
   sequencing, with the human remaining the orchestrator for goals/approvals — see Scope and Steps
   above.
2. No `notes/` update is needed this cycle — see Scope and Non-Goals.

## Non-Goals

- Testing a real `/pdca` slash-command invocation end-to-end — this is the checkpoint's other
  recommended Next Action and is deliberately left for a separate cycle, not folded into this one.
- Any change to `agents/roles/*.md`, `.claude/agents/*.md`, or `.claude/commands/pdca.md` — this
  cycle only touches `agents/README.md`.
- Any change to `notes/` — this cycle is a factual correction to existing documentation, not a new
  decision or architectural change, and the checkpoint system already tracks this history.
- Any change to MCP integration status or project code.
- Adding new sections, diagrams, or content to `agents/README.md` beyond what's needed to correct
  stale facts.
</content>
