# Change Log — Store Care Program: Operational Workflow Definition (v1)

**Cycle:** `agents/runs/2026-09-08-store-care-workflow-definition/`
**Date:** 2026-09-08
**Plan:** `plan.md` — Phase 1 (workflow discovery) + Phase 2 (workflow definition draft, Part
D). The human answered the Priority-1 questions, the v1 defaults, and — in a second round —
locked five state-machine transition decisions. The human then approved Part D
("approved, proceed to Do") after reviewing the final workflow / state-machine summary.
**Status:** Implemented (documentation only), not committed.

## What this cycle is

The workflow-definition cycle — a process definition, no code, no schema, no tech choice.
Per the human's instruction it precedes the tech-stack decision cycle.

## Changes made

### 1. Added `notes/workflows/store-visit-issue-closure.md`

The accepted v1 operational workflow, written from Part D of the cycle's `plan.md` (as
approved, including the five locked transition decisions). New `notes/workflows/`
subdirectory — the first workflow document, anticipated by the MVP definition's phased plan
and the capability map's Workflows guidance ("a workflow should be written down in `notes/`
before it's automated").

Sections:

1. **End-to-end workflow** — the 8-step spine expanded, both actors, the Store Follow-up
   record with its 4-value type field, the step-4 branch (finding may or may not become an
   issue), the hybrid parent rule (Issue always → Store, optionally → Follow-up, plus the
   "created directly against a Store" path), the inline state machine, the Resolved vs
   Cancelled closure branches, and the reopen path.
2. **Minimum fields per step** — plain lists, required/optional, mobile-first framing. Store
   Follow-up = the 5 required fields + the type enum {In-person visit | Phone | Chat/message
   | Other}; findings = free text inside the follow-up notes, no structure; Issue/Action =
   description, one owner, due date, status, plus conditionally-required resolution note /
   cancel reason / reopen reason; management view with derived overdue.
3. **Issue / Action status lifecycle** — the 5 states with verbatim definitions; the locked
   transition set (In Progress ↔ Waiting both ways; Open/In Progress/Waiting → Resolved;
   Open → Resolved direct; Open/In Progress/Waiting → Cancelled with reason, terminal;
   Resolved → In Progress reopen with reason); who performs each (operational user does all,
   management view-only, no approval gate); the "action done ≠ problem solved" rule; the
   required-text table.
4. **Entity relationships** — Store / Store Follow-up / Issue-Action; Store→Issue mandatory,
   Follow-up→Issue optional link, one owner per Issue. N1 explicitly resolved.
5. **Worked example** — STUB with an `[OPEN]` note. No hypothetical written.
6. **Explicit v1 exclusions** — 12 items, cross-referenced to MVP §4.
7. **Remaining open questions** — 8 items (real findings, worked example, discovery-channel
   baseline, store-master seed source, owner identity, edit permissions, scheduled-ahead
   follow-ups, findings shape), plus the downstream MVP §5 sync as a Next Action.

Tag counts: 24 `[CONFIRMED]`, 11 `[OPEN]`. Every `[CONFIRMED]` line traces to a human answer
or the accepted MVP definition. No `[OPEN]` item was resolved or converted to an assumption.
No findings, categories, checklist items, issue categories, priorities, SLAs, or approval
steps were invented. The worked example is a stub, not a hypothetical.

### 2. Updated `agents/runs/2026-09-08-store-care-workflow-definition/plan.md`

Part D updated in place with the five locked transition decisions (header note, D1 steps 6–8,
D3 transition diagram + rules + required-text table, D7 reclassification, Risks, OQ-B marked
resolved, Appendix 2 "Locked state-machine decisions" block added). This is the cycle's own
run-folder plan, updated to reflect what was approved.

### 3. No other files changed

- `notes/product/store-care-program-mvp-definition.md` — NOT edited. Its §5 sync (rename
  "Visit / Follow-up" → "Store Follow-up"; fix the parent-rule wording) is a separate
  downstream Next Action, per the human's OQ3 answer.
- No `projects/**`, no `docs/**`, no `notes/decisions/**`, no `notes/architecture/**`.
- No code, no schema, no tech-stack choice, no `notes/decisions/` entry.

## Verification

- `git status --short` shows only: the new `notes/workflows/store-visit-issue-closure.md`,
  the untracked run folder, and the in-place `plan.md` update inside it.
- The workflow doc's sections 1–7 match Part D of the approved plan section-for-section,
  including the locked transition set.
- `grep "[OPEN]"` → 11 hits, all legitimate deferrals; `grep "[CONFIRMED"` → 24 hits.
- The worked example (§5) is a stub with an `[OPEN]` note — no hypothetical scenario.
- No invented finding text, category name, checklist item, priority level, SLA, or approval
  step anywhere in the doc.
- N1 is explicitly reconciled in §4.

## git status --short

```
?? agents/runs/2026-09-08-store-care-workflow-definition/
?? notes/workflows/
```

## Not done (per plan / human instruction)

- No commit, no push.
- No MVP §5 sync edit (separate downstream Next Action).
- No tech-stack / database / auth / hosting / framework decision — the next cycle.
- No application code, scaffold, `projects/store-care-program/` folder, or schema.
- Q8 (real findings) and Q32 (worked example) left explicitly `[OPEN]` — nothing invented.
