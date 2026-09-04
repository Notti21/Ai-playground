# Retro — Remove the Jula AI OS card from the Projects grid

**Cycle:** `agents/runs/2026-09-03-remove-jula-ai-os-card/`
**Date:** 2026-09-03
**Review verdict:** Pass with notes (two non-blocking, pre-existing/deferred)
**Commit status:** Nothing committed yet — the human chooses whether/when to commit.

## What we learned

- **The prior decision cycle's "contained single-file removal" prediction held exactly.**
  `2026-09-01-jula-ai-os-role` predicted follow-up (i) would be a data-only change to
  `src/data/projects.ts` with no route or component edits. It was: `git diff --stat HEAD`
  shows zero changes to `Projects.tsx` and `[slug]/page.tsx`. The slug-project-pages
  pattern's "adding a page is a one-file data edit" property works in the *remove*
  direction too — removing a card is also just a `projects.ts` edit.

- **Deleting a data entry that carries its own icon means fixing the import line in the
  same edit.** The one real risk was the orphaned `Bot` import — `next build` runs ESLint
  and `@typescript-eslint/no-unused-vars` would have failed the build. The plan named this
  risk up front and folded the import fix into the same step, so lint and build passed on
  the first try. Generalizable: when a `projects.ts` entry is removed, check whether its
  `icon:` is used by any other entry before leaving the `lucide-react` import untouched.

- **Removing the last unlinked card turned an already-"largely moot" UX question fully
  moot.** The linked-vs-unlinked card visual-distinction question was carried open across
  the first three project-page cycles' retros. Jula AI OS was the only unlinked card; with
  it gone, every remaining card is a `Link` and there is no mix to distinguish. Both homes
  of that note (`slug-project-pages.md` non-goals section) now say so in past tense.

- **Pairing the living-doc tense update with the code change that makes it true kept the
  knowledge base honest with the smallest possible diff.** Per the human's answer to open
  question 2, `slug-project-pages.md` was updated this cycle rather than deferred — three
  future/open → done edits, each citing this run folder, no analysis rewritten. Doing it
  now avoided a window where the doc said "will be removed" about something already
  removed.

- **A dead branch was consciously created and left alone — correct here, but now unowned.**
  The `if (project.slug) … else return <div>` branch in `Projects.tsx` is unreachable now
  that every card has a slug. Removing it was correctly out of scope for a data-only cycle
  (the human's constraints said no component/styling changes), but it is real cleanup that
  needs to be surfaced rather than silently accumulated — see Next Action #4.

## What changed in `notes/`

- **None by Act.** `notes/architecture/slug-project-pages.md` was updated during Do this
  cycle (human answer to open question 2) and verified by Check — three tense/reference
  edits only. Re-recording that here would duplicate it.
- `notes/decisions/2026-09-01-jula-ai-os-role.md` is immutable and already committed
  (`5ea9b6b`); its follow-ups (ii) and (iii) are tracked in that entry. No new decision
  record is warranted — this cycle implemented an already-accepted decision without
  changing its scope.

## On Check's two non-blocking notes

- **Dead `if (project.slug)` branch in `Projects.tsx`:** no action this cycle. Out of
  scope per the human's constraints (no component changes). Recorded as Next Action #4.
- **`docs/capability-map.md:49` still lists "Jula AI OS" as a Project:** no action. This
  is decision follow-up (iii), which per the capability map's own rule needs its own
  `notes/decisions/` entry. Already tracked; Check noted it only for completeness.

## Next Actions

Proposals for future cycles. None are started. The human orchestrator selects which (if
any) happen next and in what order.

1. **Commit this cycle's change set.** `projects/ai-command-center/src/data/projects.ts`
   and `notes/architecture/slug-project-pages.md` plus this run folder. Check passed; the
   prior decision's wording-approval gate (prior retro Next Action #5) is already closed —
   the decision record was committed in `5ea9b6b`. Committing closes decision follow-up
   (i).

2. **Implementation cycle — build the umbrella / system-overview representation of Jula AI
   OS** (decision follow-up (ii), still open). A place elsewhere in the app describing the
   operating model itself and the app's hierarchy and direction, distinct from the
   peer-project cards. Location, shape, and content undecided. Audience: the operator and
   internal Jula's Herb management. Hard constraint: the Anti-Fabrication Protocol.

3. **Docs-reconciliation cycle — resolve the `capability-map.md` / `business-os-manifesto.md`
   inconsistency** (decision follow-up (iii), still open). `capability-map.md:49` lists
   both "Jula AI OS" and "AI Command Center" as Projects; the 2026-09-01 decision and the
   manifesto both contradict that. Per the capability map's own rule, the fix goes through
   its own new `notes/decisions/` entry, and likely also has to settle AI Command Center's
   project-vs-dashboard status.

4. **Small cleanup cycle — remove the now-dead unlinked-card branch in `Projects.tsx` and
   sync the `slug-project-pages.md` code snippet.** The `if (project.slug)` conditional and
   the `else return <div>` path are unreachable now that every card has a slug. Low
   priority. Do **not** do this blind if Next Action #2 might introduce a non-linked card
   or entry into the grid — settle (ii) first, or confirm it won't touch the grid.

5. **Retire the prior retro's Next Action #4** (drop the linked-vs-unlinked card
   visual-distinction item). It is now fully self-resolved by this cycle — recorded in both
   the decision entry and `slug-project-pages.md`. A future cycle should not re-raise it.

These are proposals only. They feed the next Plan cycle and require human selection before
any of them starts.
