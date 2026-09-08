# Checkpoint — Store Care Program: First Real Business Application Defined

**Date:** 2026-09-08

## 1. What was completed

Store Care Program — one of the four applied project areas
(`notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`) — moved from
an idea-stage placeholder to an **accepted product / MVP definition**, the first
line-of-business application taken seriously under Business OS. This realizes the intent in
`docs/capability-map.md` ("Business Applications ... Not built yet. Future subfolders of
`projects/`") and moves toward the manifesto's 6-month target ("one business application
actually storing real data").

The cycle was a two-phase definition/documentation cycle (`agents/runs/2026-09-08-store-care-program-mvp-definition/`):

- **Phase 1 (discovery):** repo inventory with quoted sources, a confirmed/unknown ledger, and
  a tiered question list. The human answered all Phase 1 questions.
- **Phase 2 (definition):** a 9-section MVP definition (Part 1), the remaining blocking
  questions tagged by what they block (Part 2), and a phased implementation plan (Part 3). The
  human approved Part 1 and Part 3.
- **Do:** recorded the approved definition verbatim to a new `notes/product/` document, every
  `[CONFIRMED]` / `[OPEN]` tag preserved, no open item resolved or invented.

No application code, no schema, no tech-stack decision, no `projects/store-care-program/`
folder, no commit (the human commits separately).

## 2. Important decisions / framing captured

- **The v1 spine is one workflow, not six modules.** "store visit / follow-up →
  issue/action tracking → closure" (8 steps), explicitly *not* the six intent areas in the old
  `projects.ts` placeholder treated as equal features.
- **Primary output is an assigned, dated, status-tracked Issue/Action**; the secondary output
  is a management view of open / overdue / resolved by store. A saved visit report is
  confirmed-useful but secondary.
- **Three entities:** Store, Visit/Follow-up, Issue/Action — relationships only, no schema.
- **Two minimal roles** (operational user, management/admin), no complex permissions.
- **v1 sits alongside** existing chat/spreadsheet processes — it does not replace or integrate
  with them, and does not touch CRM / WMS / Automation scope.
- **Sequencing is fixed by the human:** the workflow-definition cycle comes **before** the
  tech-stack decision cycle. Both are separate later cycles; neither has started.
- **Phase 0 tech-stack options** were laid out (A: extend AI Command Center — not recommended;
  B: new `projects/store-care-program/` app; C: B + managed Postgres/auth — recommended) but
  **no decision was made** — it gets its own `notes/decisions/` entry with human approval.

## 3. Artifacts changed

- `notes/product/store-care-program-mvp-definition.md` (new file, new `notes/product/`
  subdirectory — the first product-definition document)
- `agents/runs/2026-09-08-store-care-program-mvp-definition/` (run folder: `plan.md`,
  `changelog.md`, `review.md`, `retro.md`)

## 4. Current git state

Nothing committed this cycle. `HEAD` is still `7839ec9`. The two artifacts above are untracked
/ unstaged pending the human's own commit.

## 5. Outcome

**Pass with notes.** Check verified the recorded definition matches the approved plan Part 1
section-for-section, every tag and open item preserved, nothing invented, scope limited to the
one new file plus the run folder. Three non-blocking observations (N1: a pre-existing
"issue created directly against a Store" vs. `[OPEN]` tension copied verbatim from the approved
plan; N2: per-line `Q#` provenance dropped from the doc but retained in `plan.md` Appendix D;
N3: light framing added, all traceable to the plan) — recorded as candidate Next Actions, not
defects.

## 6. What this proves

- **Anti-fabrication discipline scales to a whole product definition.** Every line of a
  9-section MVP spec was forced to a `[CONFIRMED]` (traceable to a human answer or quoted repo
  source) or `[OPEN]` (explicitly deferred) tag, and Do preserved that structure verbatim
  rather than smoothing it into prose. Checklists, issue categories, form fields, status
  enums, store counts, staffing model, and the numeric success metric all stayed `[OPEN]`.
- **A two-phase Plan cycle (discovery then definition, with a human answer gate between) is a
  workable pattern** for turning an idea-stage placeholder into a buildable definition without
  inventing scope.
- **"Structure before software" (manifesto principle 1) held under pressure.** The obvious pull
  was to scaffold an app or design "a proper store-visit checklist"; instead the cycle produced
  only a definition and a plan, and explicitly deferred the tech stack to its own decision
  record.
- **`notes/product/` is now an established home** for accepted product definitions, parallel to
  `notes/decisions/`, `notes/architecture/`, `notes/checkpoints/`.

## 7. Lessons / Next Actions

Proposals only — the human selects which becomes the next Plan cycle's goal. Listed in the
human's stated priority order.

1. **Workflow-definition cycle (before the tech-stack decision).** Write the v1 spine as a
   named workflow document (the phased plan anticipates `notes/workflows/`, e.g.
   `store-visit-issue-closure.md`) capturing the 8 steps, actors, and entity lifecycle, and
   resolve the five field-level open items: (1) visit/finding fields, (2) free-text vs
   structured checklist, (3) issue/action lifecycle and status values, (4) whether an issue
   can exist without a parent visit, (5) what counts as resolution/closure evidence. This
   cycle should also reconcile review finding N1 (the §5 "created directly against a Store"
   phrasing vs. the `[OPEN]` note directly below it).
2. **Tech-stack decision cycle (Phase 0).** After the workflow is confirmed: gather the O7
   inputs from the human (data residency, Thai-language UI, hosting / existing accounts, who
   maintains the app), evaluate options A/B/C from the plan, and record the choice as its own
   `notes/decisions/YYYY-MM-DD-store-care-program-tech-stack.md` entry with explicit human
   approval.
3. **Business-input gathering (parallel, non-blocking).** Primary-user job title; pilot scope
   (store count, retailer/channel, whether store people are Jula or retailer employees, who
   performs visits today, visit frequency); current volume/baseline of issues and visits
   (feeds the numeric success metric); target delivery date. None of these block the workflow
   cycle; they can be collected alongside it.
4. **Later: point the `projects.ts` Store Care Program entry at the definition.** The old
   longer placeholder description and `"Idea"` status may warrant an update now that an
   accepted definition exists — explicitly deferred by this cycle's Non-Goals, a small
   separate cycle.
