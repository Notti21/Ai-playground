# Plan: Clean up stale RecentActivity placeholder and nextActions entry

## Goal

Remove the two pieces of stale copy in AI Command Center that the 2026-08-04
`pdca-status-section` checkpoint explicitly flagged and deferred: `RecentActivity.tsx`'s
"No activity yet" empty-state copy, and the `"Design the Plan / Do / Check / Act agent
workflow"` entry in `src/data/actions.ts`'s `nextActions` array — both now inaccurate since
the PDCA workflow (Phase 4) is designed, documented (`PdcaStatus.tsx`), and has run through
many real cycles.

## Scope

**In scope:**
- `projects/ai-command-center/src/components/sections/RecentActivity.tsx` — replace the
  "No activity yet... once the Plan, Do, Check, and Act agents start running" copy with
  accurate, **static** copy (no live filesystem/data reads), consistent with the precedent
  set by `PdcaStatus.tsx` (a snapshot description, not a live feed). This is a copy fix only —
  the section stays static and is explicitly not wired to a real agent log this cycle.
- `projects/ai-command-center/src/data/actions.ts` — delete the stale
  `"Design the Plan / Do / Check / Act agent workflow"` entry from `nextActions`, with no
  replacement entry added. The array will have three remaining entries.
- `projects/ai-command-center/README.md` — sync the "You should see…" verification text in
  this same cycle so it stays consistent with `RecentActivity.tsx`'s updated copy/title (if
  the title changes) — same-cycle sync decided to avoid the copy-drift risk the 2026-08-04
  checkpoint already flagged.
- Build/lint verification (`npm run build`, `npm run lint`) per the pattern established in
  the 2026-08-04 cycle.

**Out of scope:** see Non-Goals.

## Steps

1. Grep the repo for other references to the exact stale strings being removed/changed
   (`"No activity yet"`, `"Design the Plan / Do / Check / Act agent workflow"`) to confirm
   `RecentActivity.tsx`, `actions.ts`, and `README.md` are the only files affected.
2. Update `src/data/actions.ts`: delete the stale `"Design the Plan / Do / Check / Act agent
   workflow"` entry from the `nextActions` array. Do not add a replacement entry — the array
   goes from four entries to three.
3. Update `RecentActivity.tsx`: rewrite the empty-state copy so it no longer falsely implies
   no agent activity has happened, while keeping the section static (no `fs`/directory reads
   of `notes/checkpoints/` or `agents/runs/`) — matching the constraint Check verified for
   `PdcaStatus.tsx`. Do not add any live data wiring; that remains a separate, already-tracked
   future `nextActions` entry ("Connect Recent Activity to a real agent log").
4. Update `README.md`'s "You should see…" sentence in this same cycle so it matches
   `RecentActivity.tsx`'s new title/copy exactly (only if the section's title text changes;
   if only the body copy inside the card changes and the section title stays "What the agents
   have done", no README edit is needed there).
5. Do runs `npm run build` and `npm run lint` locally; Check independently re-runs both plus
   its own dev-server render check, per established cycle precedent.
6. Optionally record a checkpoint noting these two deferred items from the 2026-08-04
   checkpoint are now resolved.

## Risks

- **Copy could overstate reality in the opposite direction.** Removing "No activity yet"
  without wiring real data risks new copy that implies a live activity feed exists when it
  doesn't — the same class of staleness/misleading-copy problem, just inverted. The new copy
  should describe agent activity in general, snapshot terms (like `PdcaStatus.tsx` does),
  not claim specific counts or recency it can't back up statically.
- **README drift if step 4 is skipped or done inconsistently.** This is the exact drift the
  2026-08-04 checkpoint already flagged as a lesson; doing the sync in the same cycle (as
  decided) mitigates it, but only if the wording is actually kept in sync, not just present.
- **Remaining `nextActions` entries not re-validated.** This cycle only touches the one
  explicitly-flagged stale entry; the other three entries are not being re-checked for
  staleness, per the user's stated scope — but that means any staleness among them (e.g.
  "Turn Projects into real project pages") would persist unnoticed.

## Open Questions

None — all three questions raised in the initial plan have been answered by the human:

1. `RecentActivity.tsx` gets a static copy fix only; no live agent-log wiring this cycle.
2. The stale `nextActions` entry is deleted outright, with no replacement entry added.
3. `README.md`'s "You should see…" text is synced in this same cycle.

## Non-Goals

- Wiring `RecentActivity` to a real, live agent-activity log (reading `notes/checkpoints/` or
  `agents/runs/`) — this remains its own separate, already-tracked `nextActions` entry.
- Re-evaluating or editing any other `nextActions` entries beyond the one explicitly flagged
  stale, and no replacement entry for the deleted one.
- Adding a `notes/decisions/` entry (the 2026-08-04 checkpoint only suggested "considering" this
  later, not committing to it now).
- Any restructuring of the `NextActions` or `RecentActivity` component's layout, styling, or
  props — this is a content/copy cleanup only.
