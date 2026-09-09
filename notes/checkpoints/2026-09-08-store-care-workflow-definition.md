# Checkpoint — Store Care Program: v1 Workflow Defined ("Structure Before Software" Complete)

**Date:** 2026-09-08

## 1. What was completed

Store Care Program has a **canonical, accepted operational workflow definition**:
`notes/workflows/store-visit-issue-closure.md` (new file, new `notes/workflows/`
subdirectory — the first workflow document). This closes the "structure before software"
prerequisite (manifesto principle 1) for the first real line-of-business application under
Business OS: the process is written down before any code, schema, or tech-stack choice.

The cycle (`agents/runs/2026-09-08-store-care-workflow-definition/`) was a two-phase
Plan cycle:

- **Phase 1 (discovery):** inventoried what the accepted MVP definition confirms vs. leaves
  open (Appendix 1 W-item ledger), mapped the five blocking areas the MVP deferred here, and
  put them to the human as a tiered question list.
- **Phase 2 (definition):** wrote Part D — the seven required outputs (end-to-end workflow,
  minimum fields per step, issue/action status lifecycle, entity relationships, worked
  example, v1 exclusions, remaining open questions), every line tagged `[CONFIRMED]` or
  `[OPEN]`. The human answered the Priority-1 questions + v1 defaults, then in a **second
  answer round locked five state-machine transition decisions**, then approved Part D.
- **Do:** recorded the approved Part D verbatim to `notes/workflows/store-visit-issue-closure.md`,
  every tag preserved, no open item resolved or invented, the worked example left as a stub.

No application code, no schema, no tech-stack decision, no `projects/store-care-program/`
folder, no commit (the human commits separately).

## 2. Important decisions / framing captured

The five previously-deferred blocking areas are now resolved for v1:

- **Store Follow-up is one record type** with a type/channel field — values: In-person
  visit, Phone, Chat/message, Other. "Follow-up" covers in-person **and** remote activity,
  not only a return store visit. Required fields: Store, Activity date (back-datable, kept
  separate from the system created-at timestamp), Follow-up type, Person, Notes/findings.
- **Findings are free text** inside the follow-up notes. No categories, taxonomy, or
  checklist in v1 — a structured checklist is deferred until real recurring checks emerge
  from usage. Real finding examples (Q8) stay `[OPEN]`.
- **Issue/Action lifecycle — five states:** Open, In Progress, Waiting, Resolved, Cancelled.
  No separate `Closed` status, no manager-verification stage, no Priority/severity field.
- **Locked transition set (2026-09-08, second answer round):** In Progress ↔ Waiting both
  directions; Cancelled reachable from Open/In Progress/Waiting and **terminal** (a returning
  matter becomes a new issue); Waiting → Resolved direct; Open → Resolved direct; Resolved →
  In Progress reopen (reason required). Resolution note required before Resolved; cancel
  reason required before Cancelled.
- **Overdue is derived, never stored:** due date in the past AND status not Resolved AND not
  Cancelled.
- **Parent rule = hybrid (resolves MVP Check finding N1):** every Issue/Action belongs to
  exactly one Store (mandatory); the link to a Store Follow-up is optional. An issue from a
  phone call, chat, or HQ observation exists with no follow-up. This workflow document is
  **canonical** for the parent rule and the "Store Follow-up" name; MVP §5 is synced to match
  in a later follow-up edit.
- **"Action done ≠ problem solved":** completing an action does not auto-resolve; the issue
  is Resolved only when the underlying store problem is actually solved.
- **Roles unchanged:** operational user performs every transition; management/admin is
  view-only, no approval gate anywhere.

Sequencing (human-set): this workflow-definition cycle came **before** the tech-stack
decision cycle, which is now unblocked.

## 3. Artifacts changed

- `notes/workflows/store-visit-issue-closure.md` (new file, new `notes/workflows/`
  subdirectory)
- `agents/runs/2026-09-08-store-care-workflow-definition/` (run folder: `plan.md`,
  `changelog.md`, `review.md`, `retro.md`)

## 4. Current git state

Nothing committed this cycle. `HEAD` is still `c42d0e0` ("Define Store Care Program MVP").
The two artifacts above are untracked pending the human's own commit.

## 5. Outcome

**Pass with notes.** Check verified the written doc matches approved Part D
section-for-section, the locked transition set is correctly enumerated in prose, the worked
example is a genuine stub (no hypothetical), N1 is reconciled in §4, tag counts are 24
`[CONFIRMED]` / 11 `[OPEN]` with every `[CONFIRMED]` traceable, and scope stayed to the one
new file plus the run folder. Three non-blocking notes: the §3 ASCII transition diagram is
visually rough (prose bullets below it are precise and complete); one `[CONFIRMED]` tag uses
the variant form `[CONFIRMED, from the MVP definition]`; §2 is organised by entity rather
than strictly per-step (every step still labelled, nothing lost). Recorded as candidate
Next Actions, not defects.

## 6. What this proves

- **Anti-fabrication discipline held at its highest-risk point yet.** The pull was to fill
  the `[OPEN]` finding examples with plausible ones and to write a "representative" worked
  example. Both were refused: Q8 and Q32 stay `[OPEN]`, §5 ships as an explicit stub. A
  process definition with a deliberately empty worked-example section is honest and
  acceptable — thinness is not a defect.
- **A mid-cycle second answer round is a clean way to lock a state machine.** The transition
  set was the one genuinely non-verbatim area of the first draft. Rather than the agent
  inferring it, the human was asked five precise transition questions and locked all five;
  the draft was then updated in place and re-approved. The state machine is now
  `[CONFIRMED: locked]`, not inferred.
- **`notes/workflows/` is now an established home** for written-down workflows, parallel to
  `notes/product/`, `notes/decisions/`, `notes/architecture/`, `notes/checkpoints/`. The
  capability map's guidance ("a workflow should be written down in `notes/` before it's
  automated") now has a concrete first instance.
- **A downstream cross-doc inconsistency is being handled by designating one canonical
  source + a scheduled sync edit**, not by editing two docs in one cycle. MVP §5 stays as-is
  until its own small follow-up cycle.

## 7. Lessons / Next Actions

Proposals only — the human selects which becomes the next Plan cycle's goal. Listed in the
human's stated priority order.

1. **Tech-stack decision cycle (Phase 0) — now unblocked, the natural next priority.** Gather
   the O7 inputs from the human (data residency, Thai-language UI requirement, hosting /
   existing accounts, who maintains the app after build), evaluate the MVP plan's options
   A/B/C, and record the choice as its own
   `notes/decisions/YYYY-MM-DD-store-care-program-tech-stack.md` with explicit human
   approval. The plan's recommendation (Option C — new `projects/store-care-program/` app +
   managed Postgres/auth, fall back to Option B self-hosted if residency rules it out) is a
   starting point, not a decision.

2. **MVP §5 sync edit (small, can run any time).** Sync
   `notes/product/store-care-program-mvp-definition.md` §5 to match the workflow doc: rename
   the entity "Visit / Follow-up" → "Store Follow-up", and replace the parent-rule wording
   (and its `[OPEN]` note) with the confirmed hybrid rule (Store link mandatory, Follow-up
   link optional). Confirmed as a Next Action by the human's OQ3 answer; scoped out of this
   cycle deliberately.

3. **Fill Q8 (real finding examples) and Q32 (the worked example) — needs human data first.**
   When the human supplies 5–10 real findings and one real recent end-to-end case, a small
   follow-up pass fills §2's `[OPEN]` finding note and §5's stub (the real case walked
   through steps 1–8 with each step's recorded fields). Only reconsider a structured finding
   checklist if the real examples show recurring checks. Do not fabricate in the meantime.
   A good moment to also tighten the §3 ASCII transition diagram (Check note 1).

4. **Business-input gathering (parallel, non-blocking).** Primary-user job title; pilot scope
   (store count, retailer / channel, whether store people are Jula or retailer employees, who
   performs visits today, visit frequency); current volume / baseline of store issues and
   visits (feeds the numeric success metric); discovery-channel proportions (visit vs phone
   vs chat vs HQ — the human has no honest numbers, do not invent); target delivery date.
   None block the tech-stack cycle.

5. **Later: point the `projects.ts` Store Care Program entry at the definition + workflow.**
   The old longer placeholder description and `"Idea"` status may warrant an update now that
   an accepted definition and workflow exist. A small separate cycle, lower priority than
   1–4.
