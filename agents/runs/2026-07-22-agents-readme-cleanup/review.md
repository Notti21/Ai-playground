# Review Report — Clean up `agents/README.md`'s stale wording

## Plan-vs-actual verdict

Matches the plan. The cycle was scoped to `agents/README.md` only, and every change I can verify
independently (git diff, directory listings, cited source files) confirms the four specific
corrections the plan called for were made, made surgically, and made accurately — with nothing else
touched.

## Verification performed

1. **Scope discipline** — `git status --short` shows exactly:
   ```
    M agents/README.md
   ?? agents/runs/2026-07-22-agents-readme-cleanup/
   ```
   `git diff --stat` confirms only `agents/README.md` changed (11 insertions, 9 deletions) relative
   to the last commit. `git diff --stat -- notes/ agents/roles .claude/agents .claude/commands`
   returns empty — zero changes to any of those paths. No application code touched. This matches the
   plan's scope and the changelog's claim exactly.

2. **Plan-vs-actual, read directly from current `agents/README.md`:**
   - **Status section**: no longer says "Phase 1" / "no subagents wired up" / "no slash command."
     Now reads "Status: Phase 4 complete" with prose describing Plan/Check/Act as subagents, Do as
     intentionally main-session, and `/pdca` as the sequencing command; closes with "Not yet done:
     MCP integration (Phase 5...)."
     - Verified against `.claude/agents/`: `plan.md`, `check.md`, `act.md` all exist (no `do.md`,
       consistent with the "Do is never a subagent" claim).
     - Verified against `.claude/commands/`: `pdca.md` exists (5287 bytes, real content, not a stub).
     - Verified the Phase 4 / Phase 5 labeling against `notes/decisions/2026-07-08-ai-organization-design.md`'s
       roadmap table (lines 99-108): Phase 4 = "Turn the cycle into a `/pdca <goal>` skill," Phase 5 =
       "First MCP integration: GitHub." The README's "Phase 4 complete... Not yet done: MCP
       integration (Phase 5...)" is an accurate paraphrase, not an invented label.
     - Verified the Do-rationale claim ("Do intentionally remains the main session... since it needs
       the broadest tool access") against `notes/checkpoints/2026-07-20-pdca-subagents.md` section 3,
       which states almost the same reasoning near-verbatim ("Do needs the broadest tool access
       (Edit/Write/Bash, unrestricted)..."). The README references, and lightly summarizes, rather
       than paraphrasing it into something weaker — the plan's risk about diluting this rationale did
       not materialize.
   - **"Who's who" diagram**: Orchestrator line now reads "(/pdca sequences it; you still set the
     goal and approve — see Status below)". The human is still present and undiminished elsewhere in
     the diagram ("You — System Designer (goals, approvals, final call)" is untouched at the top),
     and the wording explicitly retains the human as approver/goal-setter rather than removing them.
     This matches the plan's instruction precisely.
   - **Folder guide**: `runs/` line no longer says "Not created yet." I independently listed
     `agents/runs/` and counted 8 folders (`2026-07-08-dark-mode-toggle` through
     `2026-07-22-agents-readme-cleanup`), confirming "Several cycles have been run" is factually
     accurate and appropriately non-specific (doesn't hard-code a count that will go stale).
   - **"How one cycle works"**: the five numbered steps are byte-identical to the pre-change version
     (confirmed via `git diff`); only one new paragraph was appended after them, describing that the
     same steps can be run by hand or via `/pdca [goal]`, that Do always runs in the main session, and
     that both approval gates still apply. Cross-checked against `.claude/commands/pdca.md`: it does
     confirm Do runs in the main session (step 3, "Do is never a subagent"), and both approval gates
     (step 2 "STOP... before Do does anything" and step 6 "STOP... do not commit anything") are real
     and independent, matching the README's added paragraph exactly. No exaggeration or
     misrepresentation found.
   - **Not a wholesale rewrite**: `git diff agents/README.md` shows a small, targeted diff — 2 lines
     changed in the diagram, 4 lines added after the numbered list, 1 line changed in the folder
     guide, and a rewritten Status section (heading + one paragraph, replacing a heading + one
     paragraph + one bullet list). The opening paragraph, the "Projects... are not agents" paragraph,
     the five numbered steps, and the `roles/` folder-guide line are all untouched. This matches both
     the plan's non-goal ("not a rewrite") and the changelog's claim.

3. **No drift/forking**: the updated Status section and cycle-flow paragraph reference
   `.claude/agents/*.md`, `.claude/commands/pdca.md`, and the two `notes/` sources by path and give a
   one-sentence functional summary of each, rather than reproducing their content at length (e.g. it
   does not restate `pdca.md`'s full hard-constraints list or `2026-07-20-pdca-subagents.md`'s full
   rationale paragraph). This is consistent with the plan's risk note about avoiding forked
   documentation.

## Findings

None — confirmed (not just plausible). I found no factual inaccuracies, no scope violations, and no
unrequested rewrites in the diff.

One very minor, non-blocking observation (not a defect, just worth flagging as a candidate future
Next Action rather than something to fix now): the new Status paragraph asserts phases 2–4 of the
roadmap are complete ("Phase 4 complete") based on Plan/Check/Act being wired up and `/pdca` existing,
but doesn't explicitly cross-reference Phase 3 ("Run one real, small PDCA cycle end-to-end; revise
templates based on what breaks") the way it does Phase 4/5. This is a reasonable inference — 8 run
folders and multiple checkpoints exist, so Phase 3 has self-evidently already happened — and the plan
never asked for phase-by-phase justification, so this is not a defect, just a note for anyone auditing
phase-completion claims later.

## Verdict

**Pass**
