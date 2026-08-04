# Plan — Add a PDCA Workflow Status section to AI Command Center

## Goal

Add a small section to the AI Command Center homepage (`projects/ai-command-center`) that
explains the current status of the PDCA workflow — accurately reflecting real state per
`docs/business-os-manifesto.md`'s "never fabricate" principle, not an invented or aspirational
status.

## Scope

**In scope:**
- One new small section on the AI Command Center homepage describing the PDCA workflow's current
  capability/phase (what's wired up, what isn't yet).
- A new section component under `src/components/sections/`, following this codebase's existing
  conventions (see Steps). Static, hand-written content only — no data file, no filesystem/git
  access at build or runtime.
- Wording is original, fresh copy written for a UI audience: concise and durable (capability-level,
  not a raw count), describing the same underlying facts as `agents/README.md`'s `## Status`
  section but not copied or trimmed from its prose, and not a link out to that file either.
- Placement: directly after `AgentSystem` and before `Projects`.
- Wiring the new section into `src/app/page.tsx`.
- Updating `projects/ai-command-center/README.md`'s list of section titles (the "You should see…"
  line) to include the new section, matching how every prior section was documented there.
- Do chooses the exact section eyebrow/title wording and component filename, consistent with this
  app's existing PascalCase component-per-section naming pattern (e.g. `AgentSystem.tsx`,
  `RecentActivity.tsx`). This is an implementation detail, not a decision requiring further human
  input.

**Out of scope (this cycle):**
- Rewriting or replacing the existing `RecentActivity` section's placeholder ("No activity yet…").
  It is thematically adjacent (also about PDCA activity) but is a distinct, larger piece of work —
  turning a per-event activity log into something backed by real data — and is explicitly listed as
  its own future item in `src/data/actions.ts` ("Connect Recent Activity to a real agent log").
  Confirmed out of scope by the human — leave for a separate future cycle.
- Updating `src/data/actions.ts`'s `nextActions` list, even though at least one entry ("Design the
  Plan/Do/Check/Act agent workflow") now reads as stale given Phase 4 is complete. Confirmed out of
  scope by the human — leave for a separate future cycle.
- Any live/dynamic data source (parsing `agents/runs/`, `notes/checkpoints/`, or git history at
  build or request time). Confirmed: static content only, matching every existing section's
  convention.
- Any change to `agents/README.md`, `docs/capability-map.md`, or `docs/business-os-manifesto.md`
  themselves — this cycle reads them as sources of truth, it doesn't edit them.

## Steps

1. **Draft the section's content**: fresh, concise, UI-appropriate copy (not copied/trimmed from
   `agents/README.md`'s Status paragraph, not a link to it) describing real, currently-true state:
   - The PDCA loop is fully defined (`agents/roles/*.md`) and wired as a `/pdca [goal]` slash
     command (`.claude/commands/pdca.md`), which sequences Plan → human approval gate → Do → Check
     → Act → human approval gate before any commit.
   - Plan, Check, and Act run as Claude Code subagents (`.claude/agents/plan.md`, `check.md`,
     `act.md`); Do intentionally remains the main session (needs the broadest tool access).
   - Frame this as durable capability ("the loop is wired end-to-end, cycles have run
     successfully") rather than a raw run/checkpoint count, per the staleness lesson from
     `agents/README.md`'s prior "Phase 1" wording fix. If a count is included at all, it must be
     visually/textually marked as a point-in-time snapshot, not framed as always-current.
2. **Build a new section component** under `src/components/sections/` (filename Do's choice,
   following the existing PascalCase pattern, e.g. `PdcaStatus.tsx`), following the established
   pattern: `SectionHeading` (eyebrow/title/description) + a single `Card` (the closest structural
   precedent is `RecentActivity.tsx`'s single centered-message Card, since this is one status
   statement, not a grid of items). Content is short, static JSX text (like `Hero.tsx`) — no new
   `src/data/*.ts` file for this cycle.
3. **Wire it into `src/app/page.tsx`**, placed directly after `AgentSystem` and before `Projects`.
4. **Update `projects/ai-command-center/README.md`**'s "You should see…" sentence to add the new
   section's title, matching how the existing six section titles are already listed there.
5. Confirm via `git diff` that exactly the intended files changed:
   - New: one file under `src/components/sections/` (name Do's choice, e.g. `PdcaStatus.tsx`)
   - Modified: `src/app/page.tsx`
   - Modified: `projects/ai-command-center/README.md`
   - No other files touched — in particular, no changes to `src/data/actions.ts`, `RecentActivity.tsx`,
     `agents/README.md`, `docs/capability-map.md`, or `docs/business-os-manifesto.md`.

## Risks

- **Content drift / duplicated source of truth.** `agents/README.md`'s `## Status` section is
  already the canonical, actively-maintained description of PDCA workflow status. Since the new UI
  section will describe similar underlying facts in its own original wording, the two can drift out
  of sync the next time the workflow changes phase (e.g. when Phase 5/MCP lands) — a known and
  accepted tradeoff per the human's confirmed decision to use fresh UI copy rather than a link-out.
- **Staleness on re-read.** Any specific count (run folders, checkpoints) embedded in static JSX
  will be wrong almost immediately, the same failure mode `agents/README.md`'s "Phase 1" wording
  had before its 2026-07-22 cleanup cycle. Wording must favor durable capability statements over
  numbers, or explicitly label any number as a snapshot with a date.
- **This is the first cycle touching `projects/ai-command-center`'s application code**, not just
  docs/workflow artifacts. There's no established precedent in this repo's PDCA history for how
  Check should verify a UI change (visual correctness, build/lint passing, etc.) — Check's approach
  may need to adapt, which is a Check-cycle concern, not a blocker for this plan, but worth noting.
- **Thematic overlap with `RecentActivity`** could confuse a future reader into thinking the two
  sections do the same job. Distinct placement (this new section sits right after `AgentSystem`,
  well before `RecentActivity` later on the page) and clearly different framing (capability/status
  vs. chronological activity log) should keep them legible as separate, but this is a judgment call
  Do should carry through carefully.

## Open Questions

None outstanding. All four open questions from the prior draft of this plan have been resolved by
the human and folded into Scope/Steps above:
1. Data approach: static content, confirmed.
2. Wording source: original, fresh UI copy — not a trimmed restatement of `agents/README.md`, not a
   link out.
3. Placement: directly after `AgentSystem`, before `Projects`.
4. Cycle scope: minimal — `RecentActivity`'s stale copy and `src/data/actions.ts`'s stale entry are
   explicitly deferred to a separate future cycle.

Section eyebrow/title wording and the exact component filename are left as an implementation
detail for Do to choose, consistent with this app's existing naming conventions — not treated as an
open question requiring further human input.

## Non-Goals

- Not building a real "Recent Activity" feed backed by `agents/runs/` data (that is a distinctly
  larger, already-identified future item).
- Not fixing other stale content in `src/data/actions.ts` (`NextActions`), even though this
  investigation surfaced at least one outdated entry.
- Not introducing filesystem/git-based live data reading into this app in this cycle.
- Not changing `agents/README.md`, `docs/capability-map.md`, or `docs/business-os-manifesto.md`.
- Not adding tests, CI, or new tooling — none exist for this project yet, and adding them isn't
  part of this goal.
</content>
