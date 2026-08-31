# Retro — WMS and Automation project pages (third use of the [slug] routing pattern)

## What we learned

- **Batching two projects into one Plan/Do/Check/Act cycle worked cleanly, with no observed
  friction.** This was the first cycle to ship more than one project's page in a single loop, rather
  than one project per cycle (Store Care Program and CRM each got their own). The reasoning in the
  plan held up in practice: WMS and Automation needed the same category of human input (what it's
  for, real status, description, slug, depth), so gathering it together avoided running the same
  question-asking process twice. The plan's explicit escape valve — "if either project turns out to
  need more than a `projects.ts` data edit, stop and ask rather than improvise" — never had to
  trigger; both landed as pure data edits, verified by `git diff --stat` showing zero changes to
  `Projects.tsx` or `[slug]/page.tsx`. This is a useful data point for future multi-project cycles:
  batching is a reasonable default when candidates share the same mechanical shape and content-gathering
  needs, but the value came from an explicit stop-and-ask condition being stated up front, not from
  assuming batching is always safe.

- **The anti-fabrication discipline caught a third, structurally distinct trap.** CRM's cycle had to
  exclude background content about *future* plans (likely future user groups) that the human
  mentioned while explaining CRM's purpose. Automation's cycle had a related but different version:
  the human noted that "some technical exploration exists in the repo" (the `automation/` directory)
  as context for *why* status stays `"Idea"` despite that existing work — not as approved content
  describing that work as the project's confirmed scope. Do correctly excluded any mention of
  `automation/`, Gmail, or Drive from the shipped page, and Check independently verified via a
  source-tree-wide grep (not just the built HTML, as in prior cycles) plus a literal comparison
  against the plan's locked-in text. Three cycles in, the "background context the human gives isn't
  automatically shippable content" rule has now been tested against both future-facing and
  past-facing versions of the trap, and held both times.

- **The pattern itself required zero code changes for a third time, now proven across four total
  slugged projects.** `Projects.tsx`'s conditional `Link`-wrap and the `[slug]/page.tsx` route's
  `generateStaticParams` filter continue to generalize automatically over any number of slugged
  projects — this cycle is the strongest confirmation yet, since it added two projects at once and
  still touched only `projects.ts`.

- **The `nextActions`-entry-deferral convention held a third time.** Per both prior cycles'
  established boundary, Do again left `src/data/actions.ts`'s "Turn Projects into real project pages"
  entry untouched, correctly treating its update as an Act-stage decision. Check confirmed the entry's
  current text ("Store Care Program and CRM now have pages; WMS and Automation still need them") is a
  leftover from an earlier, non-PDCA edit made directly by the human mid-session — not this cycle's
  output — and is now stale on a new count: it still says WMS and Automation "still need" pages, which
  is no longer true after this cycle. Three cycles running the same convention is enough to treat "who
  updates `nextActions` text" as settled, not something each new cycle needs to re-derive.

- **Progress on the underlying "Turn Projects into real project pages" goal: complete for its
  original four targets.** Store Care Program, CRM, WMS, and Automation all now have real, linked
  pages. Only Jula AI OS remains unlinked, and it was never part of this goal's original scope — it's
  treated as a separate, deliberately-deferred decision (umbrella/system-level concept, not a normal
  project) in every cycle so far, this one included.

## What changed in `notes/`

Updated `notes/architecture/slug-project-pages.md` to reflect the pattern's third proven reuse:

- Documented this cycle (WMS and Automation, added together in one cycle) in the intro, the
  step-by-step sections, and the "Cycle history" reference list.
- Added a new step (§6) capturing the batching data point: multiple projects can be added in one
  cycle when their content-gathering shape is identical, with an explicit stop-and-ask escape valve
  as the safety net — not a claim that batching is always safe.
- Added Automation's "existing technical work as background, not shippable content" trap to the
  Anti-Fabrication Protocol section, alongside CRM's earlier "future user groups" trap, since they're
  distinct failure modes worth naming separately for future cycles to watch for.
- Updated the non-goals section's linked/unlinked-card count (now 4 of 5 linked, only Jula AI OS
  unlinked) and reframed the open question accordingly (see Next Actions below).
- Corrected the optional-field description, which previously listed WMS and Automation as projects
  "without a page yet" — no longer accurate after this cycle.

This was warranted because the file is an explicitly living document (not an immutable decision), was
already stale in a factual sense (claiming WMS/Automation lacked slugs, which is no longer true), and
the user's task framing for this cycle specifically flagged it as worth updating if warranted.

No `notes/decisions/` entry was added — nothing in this cycle constitutes a new one-time decision
(open questions about Jula AI OS and linked/unlinked styling remain genuinely undecided, so there's
nothing yet to record as decided).

## Next Actions

These are proposals for the next Plan cycle. None have been started; the human selects which (if
any) happen next.

1. **Close or reword the `actions.ts` "Turn Projects into real project pages" entry — my
   recommendation is to close it.** All four of its original target projects (Store Care Program,
   CRM, WMS, Automation) now have real pages; the concrete scope that entry described is done. Unlike
   after the CRM cycle (where 2 of 4 targets were still missing pages, so rewording to show partial
   progress made sense), there's no partial state left to describe — leaving a reworded-but-still-open
   entry around risks looking like there's remaining work when there isn't. If the human wants to keep
   a visible trace of the pattern's existence (e.g., for future new projects), a differently-scoped
   entry could be added later, but that would be new scope, not a continuation of this one. I'm not
   editing `actions.ts` myself — per the established convention, that's implementation work for a
   follow-up Plan/Do cycle to execute, however it's worded.

2. **Decide Jula AI OS's role — still undecided, carried forward a third time.** Every cycle so far
   (Store Care Program, CRM, WMS/Automation) has kept Jula AI OS explicitly out of scope as an
   umbrella/system-level concept rather than deciding whether it should ever get a normal project page.
   With all four other cards now linked, this is the only remaining open item in the original set of
   five project cards — worth an explicit decision (yes, no, or "not a normal page but something else")
   rather than continuing to defer indefinitely.

3. **Decide whether linked/unlinked cards need visual distinction — still undecided, but the framing
   has shifted.** After the CRM cycle it was 2 of 5 cards linked, 3 unlinked; after this cycle it's 4
   of 5 linked, only Jula AI OS unlinked. The original framing ("should linked cards look different
   from unlinked ones") may now fit less well than the inverse framing ("should the one remaining
   unlinked card, Jula AI OS, be visually marked as an exception"), since it's now the minority case.
   Worth deciding explicitly rather than carrying forward unexamined a fourth time — including the
   option of leaving it as-is if the single unlinked card isn't confusing in practice.

These are proposals only, not decisions — they feed the next Plan cycle and require human selection
before any of them starts a new cycle.
