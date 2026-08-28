# Plan: Re-validate the two remaining `nextActions` entries for staleness

## Goal

Independently re-verify whether the two `nextActions` entries in
`projects/ai-command-center/src/data/actions.ts` that were *not* touched by the 2026-08-19
cleanup cycle — "Decide how MCP servers connect into the agent system" and "Turn Projects into
real project pages" — still accurately describe unfinished work, or whether either has become
stale (already done, or superseded) since it was last written. This item was explicitly deferred
as an open risk in the 2026-08-19 `cleanup-recent-activity-next-actions` plan and repeated as a
Next Action in both that cycle's retro and the following checkpoint-writing cycle's retro.

## Scope

**In scope:**
- Re-deriving, from current repository state (not from memory or the prior checkpoint's
  wording), whether MCP integration into the agent system has been decided/started.
- Re-deriving whether the "Projects" section of AI Command Center has been turned into real,
  linked project pages (vs. still being static summary cards on the homepage).
- Documenting the evidence and conclusion for each entry (still accurate / stale) so Check can
  independently confirm it.
- If either entry is found stale: **deleting it outright from `actions.ts`, with no
  replacement** — matching the precedent set by the 2026-08-19 cycle's resolved entry. This
  remediation path is decided in advance for this cycle; Do does not need to pause and ask again
  if staleness is confirmed.
- If both entries are confirmed still accurate: **that is a complete, sufficient outcome on its
  own.** No edit to `actions.ts` is required, and no further digging into finer-grained wording
  issues is expected or wanted.

**Out of scope (this cycle only revalidates staleness; it does not do the underlying work):**
- Actually deciding *how* MCP servers should connect into the agent system (that's the
  substance of the first `nextActions` entry itself, not this cycle's job).
- Actually building real project pages/routes for CRM, WMS, Automation, or Jula AI OS.
- Rewording an entry in place, or deferring an edit to a future cycle, as an alternative to
  deletion — deletion-with-no-replacement is the only sanctioned remediation for a stale entry
  this cycle.
- Writing an optional `notes/checkpoints/` entry for this cycle — explicitly skipped; the retro
  alone is the record of this cycle's outcome.
- Writing a `notes/decisions/` entry on the "flag-in-checkpoint" pattern itself — that's a
  separate, already-tracked Next Action from the prior two cycles, not this one.

## Steps

1. **Re-derive MCP status from source, not from the checkpoint's wording.** Grep the repo for
   MCP-related state: `agents/README.md` (which currently states MCP integration as "Not yet
   done... Phase 5"), `notes/decisions/2026-07-08-ai-organization-design.md`'s roadmap table and
   "Future MCP integrations" section, and the `mcp/` directory itself (currently empty/skeleton
   per `CLAUDE.md`'s repo structure description). Confirm whether any MCP server, client, or
   connection decision has been made or implemented since the entry was written.
2. **Re-derive Projects-section status from source.** Read
   `projects/ai-command-center/src/data/projects.ts` and
   `projects/ai-command-center/src/components/sections/Projects.tsx`, and list every file under
   `projects/ai-command-center/src/app/`. Confirm whether project cards (CRM, WMS, Automation,
   Jula AI OS) link anywhere, and whether any dedicated route/page exists for any of them beyond
   the single homepage (`src/app/page.tsx`).
3. **Cross-check against git history.** Run `git log --oneline` scoped to `projects.ts`,
   `Projects.tsx`, and the `mcp/` directory to confirm nothing has changed since the scaffold
   commit that would make either entry stale.
4. **Write up the conclusion for each entry** (still accurate vs. stale, with the supporting
   evidence from steps 1–3) as this cycle's primary deliverable.
5. **Apply the pre-decided remediation immediately, per entry:**
   - If an entry is confirmed **stale**: delete it outright from `actions.ts`, with no
     replacement. No further human check-in is required for this — it's already decided.
   - If an entry is confirmed **still accurate**: leave it untouched. Do not reword it, do not
     look for smaller phrasing nits — an accurate entry needs no edit.
   - If **both** entries turn out still accurate: make no edit to `actions.ts` at all. This is a
     complete, sufficient outcome for the cycle — not a failure to find something.
6. **Record the conclusion in this cycle's changelog/retro.** No checkpoint is written this
   cycle (explicitly skipped per the human's decision); the retro is the sole record.

## Risks

- **"Staleness" is judgment-based, not a simple binary check.** Unlike the previous cycle's
  entry (which had unambiguously already been done), these two describe genuinely unfinished,
  ongoing-priority work. There's a real chance both entries are simply "still true and still
  unstarted," which is now confirmed to be an acceptable outcome requiring no edit — Do should
  not invent busywork or additional wording review to justify the cycle.
- **Scope creep risk into actually doing the MCP or Projects-page work.** Because both entries
  describe substantial, unstarted features, there's a temptation to start scoping *how* to build
  them while investigating whether they're stale. Do must stay strictly within read-only
  verification (plus the pre-authorized delete-if-stale edit).
- **Preliminary read-only investigation done during this planning pass** (for context, not as a
  final verdict — Do/Check should independently re-confirm):
  - MCP: `agents/README.md` line 43 currently states "Not yet done: MCP integration (Phase 5...)"
    and the roadmap in `notes/decisions/2026-07-08-ai-organization-design.md` lists MCP as item 5
    of an unstarted list. This suggests the entry is **still accurate**, not stale.
  - Projects: `src/app/` contains only `page.tsx` (plus `layout.tsx`, `globals.css`,
    `favicon.ico`) — no per-project routes exist, and `git log` shows `projects.ts` /
    `Projects.tsx` have not changed since the original scaffold commit (`07ff86a`). This suggests
    the entry is also **still accurate**, not stale.
  - If Do's independent re-verification agrees with both of these, the expected outcome is "no
    staleness found, no `actions.ts` edit" — per the human's decision, this is a fully acceptable
    and complete result for this cycle.

## Open Questions

All three open questions from the initial plan have been resolved by the human ahead of
approval:

1. **Remediation path if a stale entry is found:** delete it outright from `actions.ts`, with no
   replacement — matching the 2026-08-19 precedent. Rewording in place or deferring the edit to
   a future cycle are not options for this cycle.
2. **Checkpoint:** skipped this cycle. No `notes/checkpoints/` entry will be written; the retro
   alone captures the outcome.
3. **"No staleness found" outcome:** confirmed as fully acceptable and complete on its own. If
   both entries are still accurate, no forced edit and no deeper digging into finer-grained
   wording issues is expected.

No open questions remain; this plan is ready for approval.

## Non-Goals

- Deciding or implementing how MCP servers connect into the agent system.
- Building real CRM/WMS/Automation/Jula-AI-OS project pages or routes.
- Rewording a stale entry in place, or deferring its removal to a later cycle, instead of
  deleting it outright.
- Writing a `notes/checkpoints/` entry for this cycle.
- Writing a `notes/decisions/` entry on the checkpoint/retro resolution pattern (tracked
  separately).
- Re-touching anything already resolved by the 2026-08-19 cycles (the `RecentActivity.tsx` copy
  and the "Design the Plan/Do/Check/Act agent workflow" entry) — those are done and out of scope
  here.
