# Retro — Store Care Program: Tech-Stack Decision (Phase 0)

**Cycle:** `agents/runs/2026-09-09-store-care-program-tech-stack/`
**Date:** 2026-09-09
**Review verdict:** Pass with notes

## What we learned

- **When the decision inputs genuinely converge, the cycle should say so rather than
  manufacture a trade-off.** The human answered 4 of 6 gating questions — no data-residency
  constraint, a maintainer who routes changes through PDCA cycles and does not want server
  ops, a small managed-service budget, an existing Google Workspace — and all four pointed the
  same direction. Every self-hosted fallback lost its rationale at once. The plan and the
  record state this convergence plainly. There was no residual conflict between residency,
  budget, and maintainer model to resolve, and pretending otherwise would have added noise.

- **A "provisional span" in the draft decision record is a clean way to keep momentum without
  fabricating a choice.** Two items — v1 UI language and the auth mechanism — were genuinely
  orthogonal to sub-decisions (i), (iii), (v), and each had a scoped, low-cost fallback
  (`next-intl` for bilingual; magic-link or a hardcoded list for an out-of-domain pilot user).
  They were written into the draft as `[PROVISIONAL — ...]` spans; the human confirmed them at
  approval; Do replaced the spans verbatim and changed nothing else. This mirrors the workflow
  cycle's mid-cycle second answer round — the right tool whenever a cycle's remaining risk is
  one or two bounded decisions the human can simply make. The key discipline is separating
  "this blocks the decision" from "this is a local adjustment either way".

- **Breaking "the tech stack" into five separable sub-decisions made the choice auditable and
  the lock-in assessable per axis.** Structure / framework / database / auth / hosting each got
  its own option table, criteria mapping, and verdict. That made explicit which axes the
  human's answers actually moved (database, auth, hosting) versus which were settled on
  principle (structure — the capability-map boundary; framework — existing team knowledge). It
  also let reversibility be judged axis-by-axis: framework is the lowest-regret axis; datastore
  and hosting are the expensive-to-reverse axes, which is precisely why the decision is
  explicitly pilot-scoped and why it carries a portability guard.

- **A managed provider can satisfy the tool-agnostic principle with a concrete, testable
  mitigation.** Manifesto principle 7 (data portable, not vendor-locked) would, taken alone,
  push toward SQLite or self-hosted Postgres. What lets Supabase pass instead is a specific,
  checkable guard: the schema lives in in-repo migrations owned by this project, and a
  one-command `pg_dump` full export is exercised from the first vertical slice. "The schema is
  ours and we can dump it any time" is a testable claim; "we'll avoid lock-in" is not.

- **The "What this does NOT decide" section is the guard against a stack decision sprawling
  into schema and screens.** The workflow doc has real open items (owner identity, store seed
  source, findings shape) and the pull was to resolve them here. The record instead enumerates
  seven things it deliberately does not decide and hands them to the scaffold cycle. This is
  the same "one canonical source + a scheduled handoff" pattern the workflow cycle used for the
  MVP §5 divergence.

- **Do relocated plan material into the record, which Review flagged as a non-blocking
  deviation.** Plan step 5 said "write verbatim from the finalized draft … changing nothing
  else". Do added a sixth section, "Open items flagged for the scaffold cycle", built from the
  plan's "Secondary" Open Questions (three bullets) and Risks (one bullet). It is relocated
  plan content, not invented scope, and arguably a useful handoff — but it is a literal
  deviation, and none of the three existing decision records carry such a section. Lesson: when
  a "write it verbatim" instruction meets other useful plan material, the safe move is to
  surface it in the retro / checkpoint (a mutable handoff artifact) rather than the immutable
  decision record — or to get explicit sign-off on the addition. Left as a Next Action for the
  human to accept or trim.

- **Deferring the nearest-region check was the right call on fabrication grounds even though it
  diverged from the plan's timing.** The plan said to verify the region "when the decision
  record is written — not asserted from memory". Do could not verify it (no live provider
  lookup) so it wrote "e.g. Singapore — confirmed … during the scaffold cycle" and listed the
  check as an open item. Not asserting an unverified region from memory is more important than
  hitting the plan's stated timing, and no sub-decision depends on the exact region. The
  scaffold cycle must actually perform the check before provisioning.

## What changed in `notes/`

- **New decision record (Do's deliverable, not restated here):**
  `notes/decisions/2026-09-09-store-care-program-tech-stack.md` — Status: Accepted. The first
  tech-stack decision in the repo and the first `notes/decisions/` entry that will spawn a new
  `projects/` subfolder.

- **New checkpoint:** `notes/checkpoints/2026-09-09-store-care-program-tech-stack.md` —
  records the milestone (Phase 0 complete; the build sequence is unblocked), a summary of the
  five-part decision, what the cycle proves, and the Next Actions below. Warranted because
  this is a milestone in the Store Care Program lineage (the two prior cycles each produced a
  checkpoint) and the first stack decision the repo has made.

- **Not duplicated:** the decision itself is the decision record; the checkpoint and this
  retro summarize and point at it rather than restating it.

- **MEMORY / private memory:** no update. The in-repo decision record and checkpoint are the
  durable record; private chat memory does not transfer between tools or people.

## Next Actions

Proposals for the next Plan cycle — the human orchestrator selects which one (if any) runs
next. Roughly in priority order.

1. **Scaffold + first vertical slice cycle (Phase 1) — now unblocked, the natural next
   priority.** Plan `projects/store-care-program/` against the approved stack and
   `notes/workflows/store-visit-issue-closure.md`: create the folder, `package.json`, and
   Next.js / Tailwind setup mirroring AI Command Center; write a `README` with build / run /
   test commands and the documented `pg_dump` export; create and provision the Supabase +
   Vercel accounts; **verify the nearest Supabase / Vercel region** (Review note 2); design
   the database schema for the three entities against workflow §4 — including the back-dated
   activity date vs. system `created_at`, and the owner-identity open item (login user vs.
   free-typed name, workflow §7); wire the domain-restricted Google sign-in + the two-role
   server-side guard; build the first `operational`-path slice. Confirm the MVP §5 sync edit
   (item 2) has landed before modelling the schema.

2. **MVP §5 ↔ workflow §4 sync edit (still pending — the workflow checkpoint's Next Action
   2).** Sync `notes/product/store-care-program-mvp-definition.md` §5 to the workflow doc:
   rename "Visit / Follow-up" → "Store Follow-up", and replace the parent-rule wording plus
   its `[OPEN]` note with the confirmed hybrid rule (Store link mandatory, Follow-up link
   optional). Small; should land before or as the first step of the scaffold cycle's schema
   work.

3. **~~Decide the fate of the decision record's extra "Open items flagged for the scaffold
   cycle" section (Review Finding 1).~~ DONE 2026-09-09.** The human classified all four
   bullets as transient (prerequisites / operational inputs / a verification task — no
   unresolved architecture decision), directed that the Accepted record hold only settled
   decisions, and approved the diff: the section was removed from
   `notes/decisions/2026-09-09-store-care-program-tech-stack.md` and its four items moved
   verbatim to section 8 of `notes/checkpoints/2026-09-09-store-care-program-tech-stack.md`.
   No architecture decision changed. Re-verified in `review.md` ("Post-review amendment
   verification"). Not committed.

4. **Fill Q8 (real finding examples) and Q32 (the worked example) in the workflow doc — needs
   human data first.** When the human supplies 5–10 real findings and one real recent
   end-to-end case, a small follow-up pass fills workflow §2's `[OPEN]` finding note and §5's
   stub. Do not fabricate in the meantime.

5. **Business-input gathering (parallel, non-blocking) — the pilot roster is now the urgent
   one.** The domain-restricted Google sign-in assumes every pilot user has a Jula Workspace
   account; the roster decides whether that mechanism holds or falls back to magic-link / a
   hardcoded list, so confirm it before the scaffold cycle builds auth. Also still open:
   primary-user job title; pilot scope (store count, retailer / channel, who performs visits,
   frequency); current volume / baseline of issues and visits; target delivery date.

6. **Re-derive the delivery date and effort estimate.** The MVP plan deferred both until the
   stack landed. A short estimation pass against the approved stack + the workflow doc's step
   count can produce a first target.

7. **Later: update `projects/ai-command-center/src/data/projects.ts`.** Move the Store Care
   Program entry off `status: "Idea"` and point its description at the definition + workflow +
   this decision, once the scaffold cycle actually starts implementation. A small separate
   cycle, not triggered by this decision alone.

These are proposals only. They feed the next Plan cycle; the human orchestrator picks which
one (if any) starts next. Nothing from this cycle is committed — the human commits the
decision record and run folder separately.
