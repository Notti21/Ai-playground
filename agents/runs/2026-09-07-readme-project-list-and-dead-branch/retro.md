# Retro — Fix stale project list in `agents/README.md`; assess the dead unlinked-card branch in `Projects.tsx`

**Cycle:** `agents/runs/2026-09-07-readme-project-list-and-dead-branch/`
**Date:** 2026-09-07
**Review verdict:** Pass with notes (three non-blocking: this retro was owed; `2026-07-08-…:32` immutable; item 2 direction deliberately deferred)
**Commit status:** Nothing committed yet — the human commits separately. `HEAD` is `b4dd13f`.

This was a two-item cleanup cycle closing the last two loose ends of the four-cycle Jula AI OS /
AI Command Center lineage (`2026-09-01-jula-ai-os-role`, `2026-09-03-remove-jula-ai-os-card`,
`2026-09-04-jula-ai-os-system-overview`, `2026-09-04-docs-jula-ai-os-reconciliation`).

- **Item 1 (done):** `agents/README.md:19` — replaced `Jula AI OS, AI Command Center` with
  `Store Care Program` inside the "projects vs agents" parenthetical, matching
  `docs/capability-map.md:49` verbatim. One line, one substitution, nothing else touched. This was
  the single file that `2026-09-04-capability-map-ai-command-center-classification.md` explicitly
  named as a deferred follow-up in its "What this does NOT decide" section.
- **Item 2 (assessed, no change):** the `if (project.slug) { return <Link> } return <div>` fallback
  branch in `projects/ai-command-center/src/components/sections/Projects.tsx`. Plan's determination:
  unreachable with today's data, but **not provably dead**. Human chose **Option A — leave it as-is**.

## What we learned

- **"Decide everything in Plan" held for a fourth consecutive cycle — and this time Plan's
  deliverable for one item was a *determination*, not a change.** Plan was chartered to answer "is
  this branch provably dead?" and to STOP for the human if the answer was no. It answered no, laid
  out Options A/B/C with a recommendation, and stopped. Do made zero interpretation on either item;
  Check compared byte-for-byte. A cleanup cycle that is allowed to conclude "leave it alone" is a
  real, valuable outcome — the alternative (a charter that presumes the deletion) would have forced
  a design change through a cleanup-sized process.

- **"Unreachable today" is not "provably dead," and the difference was load-bearing here.** The
  `<div>` branch is never taken at runtime (all four `projects.ts` entries set `slug`), but
  `slug?: string` is still optional *by design*, and that optionality is independently relied on by
  `src/app/projects/[slug]/page.tsx` (`generateStaticParams()` filters on `p.slug` and casts
  `as string`; plus a `notFound()` guard) and documented in `notes/architecture/slug-project-pages.md`
  §1/§2/§5 as the "incremental rollout" pattern. Removing only the branch would have shipped
  `<Link href="/projects/undefined">` silently for any future slug-less card — TypeScript `strict`
  does not catch a template literal. Lesson worth keeping: before deleting "obviously dead"
  defensive code, check whether its *type-level premise* is still true and whether anything else
  leans on that premise.

- **This cycle converted a three-retro-old nag into a settled decision.** The dead-branch question
  rode along as "low priority, still open" in the Next Actions of `2026-09-03`, `2026-09-04-system-overview`,
  and `2026-09-04-docs-reconciliation`. It is now resolved: the branch is *intentionally kept*
  (Option A), consistent with the type, the route, and the documented pattern. It should not
  reappear as an open "dead code" loose end. If the simpler component is ever wanted, that is
  Option B — a separate, explicitly-chartered design cycle (see Next Actions).

- **A cleanup cycle that ends in "no change" also ends with no new sync cost.** The prior two
  retros each closed with an explicitly-accepted "N places to keep in sync" note. Option A here
  adds none: `slug-project-pages.md` §2 still reproduces the branch accurately, so there is no doc
  drift to chase and no new home for a fact.

- **Two-item cleanup cycles work when the items are independent in kind.** A trivial mechanical
  doc edit (item 1) and an open-ended code assessment (item 2) did not compete for attention
  because their Check gates were fully separable. Do finished item 1 and stopped item 2 cleanly.

- **Retro-before-commit is now a stable rhythm.** Fourth cycle running where the retro is written
  while the change set sits uncommitted on top of the prior commit, and the human commits
  separately afterward (`e71edd4`, `d6d4941`, `b4dd13f` each landed that way). The ordering is
  fine; noting it so it is not mistaken for a dropped step.

## What changed in `notes/`

- **None.** Open Question 1 was resolved as "minimal substitution + **retro note only**, no new
  `notes/decisions/` entry." `agents/README.md` is not governed by the capability-map amendment
  rule; the item 1 edit only propagates the already-Accepted
  `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` into the one file
  that decision named as a follow-up. This is that retro note:
  **`agents/README.md:19` changed from `Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center)`
  to `Projects (CRM, WMS, Automation, Store Care Program)`.**
- Item 2 (Option A) required no `notes/` change — the "why optional `slug` exists" rationale is
  already in `notes/architecture/slug-project-pages.md` §1; the fact that removal was assessed and
  declined is retro-level knowledge, recorded here.
- `notes/decisions/2026-07-08-ai-organization-design.md:32` still carries the old five-project list.
  It is immutable and already annotated by `2026-09-01-jula-ai-os-role.md` (the later ruling
  governs). No action — recorded so a future greps-and-panics reader isn't surprised.

## Next Actions

Proposals for future Plan cycles. None are started. The human orchestrator selects which (if any)
happen next and in what order.

1. **Commit this cycle's change set.** `agents/README.md` (one line) plus this run folder, on top
   of `b4dd13f`. Check passed with no blocking findings and nothing is staged. Committing formally
   closes the last loose end of the four-cycle Jula AI OS / AI Command Center lineage — after it,
   no live file misclassifies Jula AI OS or AI Command Center as a project.

2. **One-word user-facing copy fix in `SystemOverview.tsx` (needs human sign-off).** "the areas
   that operating model is being applied to" → "…that the operating model…". Carried from the
   `2026-09-04-system-overview` and `2026-09-04-docs-reconciliation` retros. Prior retros suggested
   routing it as a rider on the dead-branch cleanup — that cleanup has now resolved as "no change,"
   so this no longer has a cheap host cycle. Options: its own ~5-minute cycle, or fold into the
   next AI Command Center content change. The string was a human-approved content-lock, so only the
   human can re-open it — including deciding it is not worth a cycle at all.

3. **If a simpler `Projects.tsx` is ever wanted: Option B, as its own chartered design cycle.**
   Make `slug` mandatory (`slug?: string` → `slug: string`), drop the `<div>` branch, drop the
   `.filter(p => p.slug)` + `as string` cast in `generateStaticParams`, and rewrite
   `notes/architecture/slug-project-pages.md` §1/§2/§5/Non-goals. This *reverses a documented
   pattern* (optional slug = incremental rollout, "add a card without a page"), so it needs a new
   `notes/decisions/` entry and explicit charter — not a cleanup rider. **Not recommended** unless
   the "card without a page" capability is judged genuinely unwanted; Option A was chosen this
   cycle on purpose. Listed only so the option is on record, not as a pending task.

4. **No action — recorded so they are not re-raised:**
   - The dead-branch question is **settled** (Option A, intentionally kept) — not an open loose end.
   - `2026-07-08-ai-organization-design.md:32`'s five-project line is immutable and already
     annotated.
   - The standing "no browser/visual verification for AI Command Center" gap was not triggered this
     cycle (no app file touched); it still applies to any future genuinely-visual change.

These are proposals only. They feed the next Plan cycle and require human selection before any of
them starts a new cycle.
