# Change Log: Clean up `agents/README.md`'s stale wording

## Files changed

- `agents/README.md` — only file touched, per plan.

## What changed and why

1. **"Who's who" diagram — Orchestrator line.** Replaced "(you, for now — see Status below)" with
   "(/pdca sequences it; you still set the goal and approve — see Status below)". Per the plan's
   explicit instruction, this does not remove the human from the diagram or imply the loop runs
   unattended — it clarifies that `/pdca` now performs the mechanical sequencing while the human
   remains the Orchestrator for goals and approvals, worded functionally rather than naming
   implementation details that could drift.

2. **"How one cycle works" — added one paragraph after the five-step list.** States that the same
   five steps can be run by hand or sequenced via `/pdca [goal]`, and that either way Do always runs
   in the main session (never a subagent) and both approval gates (before Do starts, before any
   commit) still apply. The original five numbered steps were left unchanged — they were still
   accurate and didn't need rewording.

3. **"Folder guide" — `runs/` line.** Replaced "Not created yet — the first one is created when you
   run your first cycle" (stale; eight-plus run folders now exist) with "Several cycles have been
   run; see `notes/checkpoints/` for a rolling summary of what's been completed" — deliberately not
   naming a specific count or listing folders, per the plan's risk note about avoiding new staleness.

4. **"Status" section — rewritten from "Phase 1" to "Phase 4 complete."** States that Plan, Check,
   and Act are wired up as Claude Code subagents (thin wrappers around their canonical `roles/*.md`
   files), that Do intentionally remains the main session rather than a subagent (citing
   `notes/checkpoints/2026-07-20-pdca-subagents.md` section 3 for the reasoning, without
   re-paraphrasing that rationale itself), and that `/pdca [goal]` now sequences a full cycle with
   both approval gates preserved. Closes with "Not yet done: MCP integration (Phase 5...)",
   replacing the old "No subagents wired up. No slash command. No MCP integration." bullet list,
   citing `notes/decisions/2026-07-08-ai-organization-design.md`'s roadmap table for the phase
   numbering rather than inventing new terminology.

## What was deliberately left unchanged

- The "How one cycle works" numbered steps themselves (1–5) — re-checked against
  `.claude/commands/pdca.md` and found still accurate; only a clarifying paragraph was added after
  them, per the plan's instruction to update this section "only if it no longer matches" the actual
  flow.
- The opening paragraph, the "Projects... are not agents" paragraph, and the `roles/` folder-guide
  line — all still accurate, untouched.
- No new sections, diagrams, or headings were added, per Non-Goals.

## Verification performed

- Re-read `agents/README.md` in full after editing to confirm no remaining stale claims (no
  "Phase 1," no "no subagents/no slash command," no "not created yet" for `runs/`).
- Cross-checked every new claim against its cited source before writing it: `.claude/agents/plan.md`,
  `check.md`, `act.md` (subagents exist and are thin wrappers), `.claude/commands/pdca.md` (the
  command's actual sequence, including both approval gates and the Do-never-a-subagent rule),
  `notes/checkpoints/2026-07-20-pdca-subagents.md` (section 3's rationale, referenced not restated),
  and `notes/decisions/2026-07-08-ai-organization-design.md` (roadmap phase numbers — confirmed
  Phase 4 is "`/pdca <goal>` skill," now done, and Phase 5 is "GitHub MCP," not yet done).
- Confirmed via `git status --short` that only `agents/README.md` shows as modified, alongside this
  cycle's own new run-folder files.

## Deviations from the plan

None. Both previously-open questions (Orchestrator wording, no `notes/` update) were resolved before
this cycle started and followed exactly as decided. No application code, `notes/`, `agents/roles/*.md`,
`.claude/agents/*.md`, or `.claude/commands/pdca.md` were touched.
