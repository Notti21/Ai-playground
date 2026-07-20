# Checkpoint — PDCA Subagent Phase

**Date:** 2026-07-20

## 1. What subagents were created

Three of the four PDCA roles were wrapped as Claude Code subagent definitions under `.claude/agents/`:

- **`.claude/agents/plan.md`** — turns a stated goal into a Plan Document for a new cycle in `agents/runs/`. Read/Grep/Glob/Bash/Write only; never implements, never lets Do proceed without human approval.
- **`.claude/agents/check.md`** — independently verifies Do's implementation against an approved plan. Same restricted tool set; invoked only after Do finishes a cycle, not proactively on every code change.
- **`.claude/agents/act.md`** — closes a completed cycle by extracting lessons learned and proposing Next Actions. Never implements, never decides new priority unilaterally.

This completes Phase 2 of the roadmap in `notes/decisions/2026-07-08-ai-organization-design.md`: Plan, Check, and Act are now invocable by name instead of hand-loaded role files.

## 2. Which ones were smoke-tested and how

All three were smoke-tested, each with a different method appropriate to what the subagent produces:

- **Plan** (`e91c793`, "Add Plan subagent smoke test") — given a real, small, self-contained goal (document local run instructions for `projects/ai-command-center`), the subagent produced a genuine Plan Document at `agents/runs/2026-07-16-readme-run-instructions/plan.md`. The plan was never executed by Do — the test validated that the subagent produces a scoped, actionable plan, not that the full cycle ran.
- **Check** (`agents/runs/2026-07-10-theme-hydration-warning/check-subagent-smoke-test.md`) — re-run against an already-closed cycle (the theme hydration warning fix), independently re-verifying the plan-vs-actual diff and re-running real verification commands (`npm run build`, `npm run lint`, headless-browser regression scenarios) without reading the cycle's existing `review.md` first. Written to a separate `check-subagent-smoke-test.md` file so it wouldn't collide with the real `review.md`. Verdict: Pass, matched the original review's findings independently.
- **Act** (`agents/runs/2026-07-10-theme-hydration-warning/act-subagent-smoke-test.md`) — given restricted read access to only `agents/roles/act.md`, `plan.md`, `changelog.md`, and `review.md` for that same closed cycle, asked to produce a simulated retro (lessons learned + Next Actions) as if closing the cycle for real, plus a self-assessment of whether `act.md`'s instructions were sufficient. Verdict: usable as-is; one minor non-blocking suggestion surfaced (clarify the case where Do already updated a `notes/` file per the plan and Act's job is just to confirm it, not author it).

Across all three smoke tests: no application code was modified, only the intended output files were written, and nothing was committed until reviewed.

## 3. Why Do remains the main session, not a subagent

Per the original design in `notes/decisions/2026-07-08-ai-organization-design.md`, and reaffirmed after three manual PDCA cycles (see `notes/checkpoints/2026-07-15-three-theme-pdca-cycles.md`): Do needs the broadest tool access (Edit/Write/Bash, unrestricted) to actually implement changes, whereas Plan, Check, and Act have narrow, well-defined boundaries (Plan and Check are close to read-only; Act's writes stay confined to `notes/` and `agents/runs/`) that map cleanly onto Claude Code's restricted subagent tool-permission model. Forcing Do into a similarly restricted subagent would either strip it of the tool access it actually needs, or require a permissions profile no tighter than the default session — at which point wrapping it buys nothing. The default session remains the natural home for implementation work.

## 4. Current workflow

```
Plan subagent → Do (main session) → Check subagent → Act subagent
```

Plan drafts and gets human approval before Do acts. Do implements against the approved plan. Check independently verifies Do's work against that plan. Act closes the cycle with lessons learned and proposed Next Actions — never implementing, never unilaterally re-prioritizing.

## 5. Current git state

Latest commit on `origin/main`:

```
0f0f65b Add Act subagent wrapper
```

## 6. Recommended next mission

**Run one real PDCA cycle end-to-end using the new subagents**, rather than smoke-testing each in isolation: invoke Plan for a new, real, small goal; let Do implement against the approved plan in the main session; invoke Check to verify; invoke Act to close the cycle. This is the first true test of the subagents working together as a pipeline (hand-offs between them, not just each one individually), and will surface any friction in the interfaces between roles that isolated smoke tests can't catch — e.g., whether Check's restricted read access lines up with what Plan and Do actually produce, or whether Act's Next Actions naturally feed a subsequent Plan invocation.
