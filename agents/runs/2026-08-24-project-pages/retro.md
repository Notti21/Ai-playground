# Retro — Store Care Program vertical slice (project pages pattern)

## What we learned

- **The vertical-slice approach worked as intended.** Scoping this cycle to exactly one new
  project (Store Care Program) rather than picking among the four existing cards let Do prove out
  the routing/data pattern — optional `Project.slug`, dynamic `src/app/projects/[slug]/page.tsx`
  with `generateStaticParams` + real `notFound()`, conditional `Link`-wrapping in `Projects.tsx` —
  without taking on the larger, harder question of what CRM/WMS/Automation/Jula AI OS pages should
  actually contain. Plan, Do, and Check all stayed aligned on that boundary; Check confirmed no
  scope crept into stub pages for the other four.

- **The mid-cycle Anti-Fabrication Protocol held up under independent verification, not just
  self-report.** The human escalated it as an explicit rule after the plan was already drafted, and
  Check didn't just trust Do's changelog claim of compliance — it did a byte-for-byte
  normalized-whitespace comparison of the shipped description against the plan's quoted text, and
  curl'd a production build to confirm no workflow steps, roles, metrics, or module names leaked
  into the rendered HTML. This is a good template: for content-fabrication risk, "the changelog
  says it's honored" isn't itself verification — independently re-deriving against the primary
  source (the human's literal words, in this case) is what makes a Pass verdict trustworthy.

- **Deferring the `nextActions` edit was the right call, not a gap.** The plan explicitly left
  `src/data/actions.ts`'s "Turn Projects into real project pages" entry untouched because this
  cycle only partially resolves it (1 of 5 projects now has a page; the entry's own detail text
  says "Start with CRM, WMS, and Automation" — none of which happened yet). Closing or rewording
  that entry is correctly treated as an Act-stage/Plan-stage decision for a later cycle, not
  something Do should decide unilaterally mid-implementation. That boundary was honored throughout
  — worth naming as the pattern to repeat whenever a cycle only partially satisfies an existing
  `nextActions` entry.

- **Optional-field design (`slug?: string`) is a reusable trick for incremental rollout.** Making
  the new field optional rather than required avoided forcing placeholder values onto the four
  projects that don't have pages yet, and kept `Projects.tsx`/the route naturally inert for them
  (`generateStaticParams` filters to `projects.filter(p => p.slug)`). This is the kind of
  small architectural choice that made "add one project's page without touching the other four"
  cheap — likely to recur whenever a shared data shape needs to support "some items have this
  capability, some don't yet."

## What changed in `notes/`

None. Per the Act role's scope, `notes/` is only updated when both (a) the cycle produced something
clearly worth remembering long-term, and (b) the human has instructed an update for this specific
cycle. No such instruction was given here — the human asked only to *surface* whether a
`notes/decisions/` entry for the `[slug]`-route pattern would be worthwhile, not to write one. That
question is carried forward as a Next Action below for the human to decide.

## Next Actions

These are proposals for the next Plan cycle. None have been started; the human selects which (if
any) happen next.

1. **Decide the fate of the `actions.ts` "Turn Projects into real project pages" entry.** The
   pattern is now proven with one real project (Store Care Program). Options to weigh: reword the
   entry to reflect "1 of 5 done, pattern proven — extend to CRM, WMS, Automation next" (the
   original detail text says "Start with CRM, WMS, and Automation," which didn't happen this
   cycle); split it into per-project entries; or leave it as-is until more projects have pages.
   This was explicitly deferred by this cycle's plan as an Act/Plan-stage decision, not Do's to
   make.

2. **Decide whether to record a `notes/architecture/` (or `notes/decisions/`) entry documenting
   the `[slug]`-route pattern**, so future cycles building CRM, WMS, Automation, or Jula AI OS
   pages have a reference for the established shape: optional `slug?` field, `generateStaticParams`
   filtered to items with a `slug`, real `notFound()` for unmatched params, conditional `Link`-wrap
   at the card level. Given the existing `theme-toggling.md` precedent (a living architecture doc
   updated as a pattern is reused/refined, rather than an immutable decision), the same living-doc
   format may fit better than a one-off `notes/decisions/` entry, since this pattern is explicitly
   expected to be extended (not just referenced) by future cycles. Worth deciding now, before the
   next project-page cycle starts, so that cycle can extend a documented pattern rather than
   re-deriving it from this cycle's `plan.md`/`changelog.md`.

3. **Plan the next project-page cycle** (CRM, WMS, Automation, or Jula AI OS — human to choose
   which, and how many at once). Given this cycle proved the pattern works, a future cycle could
   plausibly do more than one project at a time, but that's a scope call for the next Plan cycle,
   not a foregone conclusion — each project will need its own real, human-supplied content (per the
   same Anti-Fabrication Protocol precedent) rather than assuming Store Care Program's content
   depth or framing transfers directly.

4. **Consider the four-unlinked-cards UX gap flagged in this cycle's plan (Risks section):** after
   this cycle, 1 of 5 cards is clickable and 4 are not, with no visual distinction between them.
   This was an accepted, intentional tradeoff for the vertical slice, not a defect — but it's worth
   the next Plan cycle deciding whether to address it (e.g., visually distinguishing linked vs.
   unlinked cards) before or alongside adding more real pages, so the UX gap doesn't linger longer
   than intended.

These are proposals only, not decisions — they feed the next Plan cycle and require human selection
before any of them starts a new cycle.
