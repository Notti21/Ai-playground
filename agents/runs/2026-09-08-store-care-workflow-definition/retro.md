# Retro — Store Care Program: Operational Workflow Definition (v1)

**Cycle:** `agents/runs/2026-09-08-store-care-workflow-definition/`
**Date:** 2026-09-08
**Review verdict:** Pass with notes

## What we learned

- **The fabrication pull concentrates as a definition matures, and the discipline still
  holds.** The MVP cycle's `[OPEN]` items were spread thin across nine sections; this cycle
  narrowed them to two sharp temptations — invent plausible finding examples (Q8), write a
  "representative" worked example (Q32). Both were refused. §5 ships as an explicit stub and
  §2 carries an `[OPEN]` finding note. A workflow doc with a deliberately empty
  worked-example section is honest and acceptable — thinness is not a defect. Check greps for
  invented finding text, categories, priorities, SLAs, and approval steps all came back
  negative.

- **A mid-cycle second answer round is the right tool for locking a state machine.** The
  Issue/Action transition set was the one genuinely non-verbatim area of the first Phase 2
  draft. Rather than let the agent infer it, the human was asked five precise transition
  questions (In Progress ↔ Waiting both ways; Cancelled sources + terminality; Waiting →
  Resolved direct; Open → Resolved direct; Overdue exclusions) and locked all five. The draft
  was then updated in place and re-approved. The state machine is now `[CONFIRMED: locked]`,
  not inferred — worth reusing whenever a cycle's remaining risk is one bounded decision the
  human can just make.

- **"Structure before software" survived a second, more concrete pressure test.** With an
  accepted MVP definition already in hand, the natural pull this cycle was to start sketching
  fields as a schema or naming a stack. D2/D4 stayed plain lists and relationship lines; the
  tech-stack decision stayed explicitly in its own next cycle. The prerequisite is now
  genuinely complete — the process is fully written down before any code.

- **Cross-doc inconsistencies are best handled by naming one canonical source plus a
  scheduled sync, not by editing both docs at once.** MVP Check finding N1 (the §5 "created
  directly against a Store" phrasing vs. the `[OPEN]` note below it) is resolved *in this
  workflow doc* (§4, hybrid rule), which is declared canonical; MVP §5 stays untouched until
  its own small follow-up edit. This keeps each cycle's scope clean and each change
  reviewable, at the cost of a short-lived known divergence between the two docs.

- **`notes/workflows/` slotted in without friction.** It parallels the
  one-subdirectory-per-category shape of `notes/` and gives the capability map's "write a
  workflow down before automating it" guidance its first concrete instance. No competition
  with `notes/product/` (an accepted product definition) or `notes/decisions/` (a
  point-in-time choice) — this is a living process definition whose `[OPEN]` items later
  cycles fill.

- **Non-blocking Check notes were all presentational.** The §3 ASCII transition diagram is
  visually rough (reopen target renders as a stray second "IN PROGRESS"; "Waiting → Resolved"
  easy to miss from the diagram alone), one tag uses the variant form
  `[CONFIRMED, from the MVP definition]`, and §2 is grouped by entity rather than strictly
  per-step. In every case the precise information is present elsewhere in the doc (prose
  bullets, correct attribution, step labels). Recorded as candidate Next Actions for the next
  edit pass, not defects.

## What changed in `notes/`

- **New checkpoint:** `notes/checkpoints/2026-09-08-store-care-workflow-definition.md` —
  records the milestone (v1 workflow defined; "structure before software" prerequisite
  complete for the first real business application), the five resolved blocking areas, the
  locked transition set, the hybrid parent rule / N1 reconciliation, what the cycle proves,
  and the Next Actions below.

- **Not duplicated:** the workflow definition itself is Do's deliverable at
  `notes/workflows/store-visit-issue-closure.md` and is not restated in the checkpoint or
  here.

- **MEMORY / private memory:** no update. The in-repo checkpoint and the `notes/workflows/`
  doc are the durable record; private chat memory does not transfer between tools or people.

## Next Actions

Proposals for the next Plan cycle — the human orchestrator selects which one (if any) runs
next. Listed in priority order.

1. **Tech-stack decision cycle (Phase 0) — now unblocked, the natural next priority.** Gather
   the O7 inputs from the human (data residency, Thai-language UI requirement, hosting /
   existing accounts, who maintains the app after build), evaluate the MVP plan's options
   A/B/C, and record the choice as its own
   `notes/decisions/YYYY-MM-DD-store-care-program-tech-stack.md` with explicit human
   approval. The plan's recommendation (Option C — new `projects/store-care-program/` app +
   managed Postgres/auth, fall back to Option B self-hosted if residency rules it out) is a
   starting point, not a decision.

2. **MVP §5 sync edit (small, can run any time).** Sync
   `notes/product/store-care-program-mvp-definition.md` §5 to the workflow doc: rename
   "Visit / Follow-up" → "Store Follow-up", and replace the parent-rule wording plus its
   `[OPEN]` note with the confirmed hybrid rule (Store link mandatory, Follow-up link
   optional). Confirmed as a Next Action by the human's OQ3 answer; deliberately scoped out
   of this cycle.

3. **Fill Q8 (real finding examples) and Q32 (the worked example) — needs human data first.**
   When the human supplies 5–10 real findings and one real recent end-to-end case, a small
   follow-up pass fills §2's `[OPEN]` finding note and §5's stub (the real case walked
   through steps 1–8 showing each step's recorded fields). Only reconsider a structured
   finding checklist if the real examples reveal recurring checks. A good moment to also
   tighten the §3 ASCII transition diagram (Check note 1) and normalise the one variant
   `[CONFIRMED, from the MVP definition]` tag (Check note 2).

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

These are proposals only. They feed the next Plan cycle; the human orchestrator picks which
one (if any) starts next.
