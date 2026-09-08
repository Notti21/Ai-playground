# Retro — Store Care Program: Product / MVP Definition

**Cycle:** `agents/runs/2026-09-08-store-care-program-mvp-definition/`
**Date:** 2026-09-08
**Review verdict:** Pass with notes

## What we learned

- **Anti-fabrication discipline scales from a one-line project description to a whole product
  definition.** Every line of a 9-section MVP spec was tagged `[CONFIRMED]` (traceable to a
  human answer or a quoted repo source) or `[OPEN]` (explicitly deferred), and Do preserved
  that tagging verbatim instead of smoothing it into confident prose. Checklists, issue
  categories, form fields, status enums, store counts, staffing model, and the numeric success
  metric all correctly stayed `[OPEN]`. This is the same protocol the 2026-08-24 project-pages
  cycle established, now proven at much larger scope.

- **A two-phase Plan cycle worked well for this shape of problem.** Phase 1 (repo inventory +
  confirmed/unknown ledger + tiered question list) → human answers → Phase 2 (definition +
  blocking questions + phased plan) → human approves Part 1 and Part 3. The explicit answer
  gate between phases is what kept the definition free of invented scope. Worth reusing when
  turning any idea-stage project area into a buildable definition.

- **"Structure before software" held under pressure.** The natural pull was to scaffold an app
  or design a "proper" store-visit checklist. The cycle produced only a definition plus a
  phased plan, explicitly deferred the tech stack to its own decision record, and touched no
  application code. Milestone: this is the first real business application under Business OS to
  reach an accepted definition.

- **`notes/product/` is a genuinely new home.** The cycle created the first product-definition
  document. It parallels the one-subdirectory-per-category structure of `notes/`
  (`architecture/`, `checkpoints/`, `decisions/`) and does not compete with `notes/decisions/`
  — a decision records a point-in-time choice; this records an accepted, living product
  definition whose `[OPEN]` items are meant to be filled in by later cycles.

- **Non-blocking tensions surface cleanly when tagging is honest.** Review finding N1 — §5 says
  an Issue/Action "is created directly against a Store" while an `[OPEN]` note two lines below
  says that is undecided — was carried verbatim from the approved plan, not introduced by Do.
  Because both halves are visible in the doc, a future cycle can spot and reconcile it rather
  than inheriting a buried assumption.

- **Provenance granularity is a real tradeoff (N2).** The plan carried per-line `Q#` answer
  references; the standalone doc keeps the `[CONFIRMED]` / `[OPEN]` status but points back to
  `plan.md` Appendix D for the Q# map rather than repeating it. Acceptable for a readable
  product doc, but worth noting that full provenance now lives in two places.

## What changed in `notes/`

- **New checkpoint:** `notes/checkpoints/2026-09-08-store-care-program-mvp-definition.md` —
  records the milestone (first real business application defined), the key framing decisions
  (one-workflow spine, primary output, three entities, two roles, sits-alongside, fixed
  workflow-before-tech-stack sequencing), what the cycle proves, and the Next Actions below.

- **Not duplicated:** the MVP definition itself is Do's deliverable at
  `notes/product/store-care-program-mvp-definition.md` and is not restated here.

- **MEMORY:** no update made. The in-repo knowledge base is the source of truth; the checkpoint
  and the `notes/product/` doc cover this milestone durably, and private chat memory does not
  transfer between tools or people.

## Next Actions

Proposals for the next Plan cycle — the human selects which one runs. Listed in the human's
explicitly stated priority order: **workflow-definition comes before the tech-stack decision.**

1. **Workflow-definition cycle.** Write the v1 spine as a named workflow document (the phased
   plan anticipates `notes/workflows/`, e.g. `store-visit-issue-closure.md`) capturing the 8
   steps, the actors, and the entity lifecycle, and resolve the five field-level open items:
   (1) visit / finding fields — what a "finding" record contains; (2) free-text vs structured
   checklist for the visit; (3) issue / action lifecycle and status values; (4) whether an
   issue can exist without a parent visit; (5) what counts as resolution / closure evidence.
   This cycle should also reconcile review finding N1 (the §5 "created directly against a
   Store" phrasing vs. the `[OPEN]` note directly below it) when it settles item 4.

2. **Tech-stack decision cycle (Phase 0).** Only after the workflow is confirmed. Gather the O7
   inputs from the human (data residency, Thai-language UI requirement, hosting / existing
   accounts, who maintains the app after build), evaluate the plan's options A/B/C, and record
   the choice as its own `notes/decisions/YYYY-MM-DD-store-care-program-tech-stack.md` entry
   with explicit human approval. The plan's recommendation (Option C — new
   `projects/store-care-program/` app + managed Postgres/auth, fall back to Option B
   self-hosted if residency rules it out) is a starting point, not a decision.

3. **Business-input gathering (parallel, non-blocking).** Primary-user job title; pilot scope
   (store count, retailer / channel, whether store people are Jula or retailer employees, who
   performs visits today, visit frequency); current volume / baseline of store issues and
   visits (feeds the numeric success metric); target delivery date or event. None of these
   block the workflow cycle — they can be collected alongside it and folded into the
   definition's `[OPEN]` items as they arrive.

4. **Later: update the `projects.ts` Store Care Program entry.** Now that an accepted
   definition exists, the older long placeholder description and `"Idea"` status may warrant an
   update (and a pointer to `notes/product/store-care-program-mvp-definition.md`). Explicitly
   deferred by this cycle's Non-Goals; a small separate cycle, lower priority than 1–3.

These are proposals only. They feed the next Plan cycle; the human orchestrator picks which one
(if any) starts next.
