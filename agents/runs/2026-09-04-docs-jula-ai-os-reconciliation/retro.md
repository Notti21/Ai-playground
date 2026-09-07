# Retro — Reconcile capability-map & manifesto with the Jula AI OS role decision

**Cycle:** `agents/runs/2026-09-04-docs-jula-ai-os-reconciliation/`
**Date:** 2026-09-04
**Review verdict:** Pass with notes (three non-blocking, all foreseen in the plan's Risks)
**Commit status:** Nothing committed yet — the human commits separately. `HEAD` is `d6d4941`.

This cycle implemented decision follow-up **(iii)** from
`notes/decisions/2026-09-01-jula-ai-os-role.md`: bring `docs/capability-map.md` and
`docs/business-os-manifesto.md` into agreement with the accepted ruling that Jula AI OS is the
operating model (not a peer project) and AI Command Center is the dashboard into it. With it, all
three of that decision's follow-ups — (i) remove the card, (ii) system-overview section,
(iii) docs reconciliation — are resolved.

## What we learned

- **The "decide everything in Plan, lock wording verbatim" pattern held for a third consecutive
  cycle.** Plan arrived at Do with 8 resolved human decisions, a line-by-line contradiction
  inventory classifying every relevant mention as (a) consistent / (b) contradicts / (c) ambiguous,
  exact before/after text for 3 edits, and a full decision-record draft. Do had no interpretation
  to make; Check compared byte-for-byte against the plan. Result: 3 lines changed, exactly the
  planned 3, decision file reproduced verbatim, zero scope creep. For a task whose named top risk
  was "over-reach — a 'reconciliation' invites rewriting more of a v1 doc than the named
  sentences," moving all judgement upstream is what contained it.

- **An explicit "consistent (a)" list is a cheap, powerful scope fence.** The plan catalogued every
  line in both docs that was already correct and instructed Check to verify each one byte-unchanged.
  That converts "did Do stay in scope?" from a judgement call into a checklist. Worth reusing
  whenever a cycle edits a few lines inside a document that mostly should not change.

- **The capability map's own amendment rule ("changes go through a new `notes/decisions/` entry")
  did its job.** It forced a 3-line doc edit to carry a full decision record. That feels heavy for
  the size of the change, but the record is the durable artifact — the doc diff will blend into
  history within a few commits, whereas the decision entry is what a future reader lands on. The
  rule is pulling its weight.

- **The UI led the docs, and that ordering worked.** Follow-ups (i) and (ii) shipped first
  (`e71edd4`, `d6d4941`), so by the time this cycle ran, the "Jula AI OS is not a project" framing
  was already live in the app and this cycle was pure catch-up on prose. Doing the visible change
  first and the documentation reconciliation second kept each cycle small and gave the docs cycle a
  concrete, already-accepted target to align to.

- **One fact, three homes — accepted, but now a standing sync cost.** After this cycle, "AI Command
  Center is the dashboard, not a project" is asserted in the new decision entry, `manifesto:16`,
  and the capability-map Dashboards section. They agree and the decision entry is canonical, but
  this is the second consecutive cycle to close with an explicitly-accepted "N places to keep in
  sync" note (the prior one was `slug-project-pages.md`). Not a problem yet; worth watching whether
  it compounds.

- **Deliberate partial reconciliation leaves a visible seam.** `agents/README.md:19` still carries
  the identical five-project misclassification. The human scoped it out on purpose (this cycle was
  chartered for two `docs/` files), and it is recorded under the decision entry's "What this does
  NOT decide" — but until a follow-up lands, someone reading only `agents/README.md` is still
  misled. Deferral is fine; the tracking is what keeps it from being lost.

## What changed in `notes/`

- **None by Act.** The warranted knowledge-base update — a new decision record — was created by Do
  during the cycle, as `capability-map.md:5` and the 2026-09-01 decision's follow-up (iii) both
  require: `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`
  (Status: Accepted), a verbatim reproduction of the plan's final draft, verified by Check.
  Re-recording it here would duplicate it.
- **No further `notes/decisions/` entry is warranted.** This cycle implemented an already-accepted
  decision without changing its scope.
- `notes/decisions/2026-09-01-jula-ai-os-role.md` and
  `notes/decisions/2026-07-08-ai-organization-design.md` are immutable and untouched. The latter's
  line ~132 still lists the old five-project framing; `2026-09-01-jula-ai-os-role.md` already
  recorded that this divergence is intentional and that the later ruling governs — no action.

## On Check's three non-blocking notes

1. **Register seam in the manifesto** — line 14 now mixes "automation" (lowercase general noun)
   with "the Store Care Program" (proper project name) in one list. Explicitly accepted in the
   plan's Risks as the cost of keeping the two docs' lists aligned. No action.
2. **Partial reconciliation remains** (`agents/README.md:19`, `2026-07-08-…:32`) — the former is a
   human deferral, surfaced as Next Action #2 below; the latter is immutable and already annotated.
3. **AI Command Center classification asserted in three places** — see "What we learned" above.
   Flagged in the plan's Risks as acceptable; decision entry is canonical.

## Next Actions

Proposals for future Plan cycles. None are started. The human orchestrator selects which (if any)
happen next and in what order.

1. **Commit this cycle's change set.** `docs/capability-map.md`, `docs/business-os-manifesto.md`,
   `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` (new), and this
   run folder. Check passed with no blocking findings and nothing is staged. Committing formally
   closes decision follow-up **(iii)** and, with it, all three follow-ups of
   `2026-09-01-jula-ai-os-role.md`.

2. **Small cleanup cycle — reconcile `agents/README.md:19`.** It still reads
   "Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center)" — the identical
   misclassification this cycle fixed in the two `docs/` files. Not immutable; the human deferred
   it out of this cycle's two-doc scope and Check + the new decision entry both recommend it as a
   follow-up. `agents/README.md` is not governed by the capability-map amendment rule, so this is
   likely a single line-scoped edit citing
   `2026-09-04-capability-map-ai-command-center-classification.md` — probably no new decision entry
   needed. Confirm in Plan whether the fix is "drop Jula AI OS + AI Command Center, add Store Care
   Program" (matching the docs) or a different phrasing given the README's context.

3. **Small cleanup cycle — remove the dead unlinked-card branch in `Projects.tsx`** (carried from
   the last two retros, still open). The `if (project.slug) … else return <div>` path is
   unreachable now that every Projects card has a slug and the Jula AI OS card is gone. The
   "settle follow-up (ii) first" precondition has been met since the prior cycle. Low priority.
   Bundle in syncing the `notes/architecture/slug-project-pages.md` code snippet if it still shows
   the branch.

4. **One-word user-facing copy fix (needs human sign-off).** In
   `projects/ai-command-center/src/components/sections/SystemOverview.tsx`, "the areas that
   operating model is being applied to" → "…that the operating model…". Trivial, but the string
   was a human-approved content-lock, so only the human should re-open it. Cheapest as a rider on
   Next Action #3 rather than its own cycle.

5. **No action needed, recorded so it is not re-raised:** the `2026-07-08-ai-organization-design.md`
   five-project line is immutable and already annotated by the 2026-09-01 decision; the
   linked-vs-unlinked card visual-distinction question is moot (no unlinked cards remain); and
   there is no visual/browser-verification gap this cycle since it was docs-only.

These are proposals only. They feed the next Plan cycle and require human selection before any of
them starts a new cycle.
