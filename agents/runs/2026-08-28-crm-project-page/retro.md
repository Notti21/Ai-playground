# Retro — CRM project page (second use of the [slug] routing pattern)

## What we learned

- **The `[slug]` pattern generalized cleanly on its second use, with zero code changes.** Exactly as
  the Store Care Program cycle's optional-field design (`slug?: string`) predicted, adding CRM's page
  required touching only `src/data/projects.ts` — `Projects.tsx` and
  `src/app/projects/[slug]/page.tsx` needed no edits at all. This is strong empirical confirmation
  (not just theoretical) that the pattern is reusable infrastructure now, not a one-off: Do's plan
  correctly predicted "Mechanical steps already proven," and Check verified the prediction held (git
  diff showed only `projects.ts` changed; both routes rendered correctly for two slugged projects
  simultaneously).

- **The anti-fabrication discipline held up on a harder case than last time — verifying an absence,
  not just a match.** Unlike Store Care Program, this cycle had a specific trap: the human's own
  answer to "what is CRM for" contained content ("likely future users: CRM/marketing, customer
  service/admin, management") that was explicitly background-only, not approved for shipping. Do
  correctly excluded it, and Check didn't just trust the changelog — it grepped the full source tree
  and built HTML output for the excluded phrases and confirmed zero matches, plus did a
  character-by-character comparison of the shipped description against the plan's locked-in text.
  This is the same "verify against the primary source, not the self-report" discipline the first
  cycle established, now proven on a case where the risk was inclusion of plausible-sounding content
  rather than omission of required content — a meaningfully different failure mode to guard against,
  and it was guarded against correctly.

- **Deferring the `actions.ts` `nextActions` edit to Act, a second time, confirms this is a real
  recurring pattern, not a one-off judgment call.** Both this cycle's plan and the Store Care Program
  plan explicitly left `src/data/actions.ts`'s "Turn Projects into real project pages" entry
  untouched, reasoning that a cycle which only *partially* satisfies an existing `nextActions` entry
  shouldn't unilaterally decide how to reword or close it. Two cycles in a row hitting this same
  boundary is a good signal to name it explicitly as a standing convention: **when a cycle partially
  satisfies an existing `nextActions` entry, updating that entry's wording is Act's call, not Do's or
  Plan's mid-cycle.**

- **The `actions.ts` entry is now measurably stale, on two independent counts.** Its detail text reads
  "Start with CRM, WMS, and Automation" — but Store Care Program (not on that list) shipped first,
  and CRM (on the list) is now also done. The literal list is simultaneously incomplete (missing
  Store Care Program) and outdated (implies CRM hasn't started when it now has a real page). Leaving
  it as-is is actively misleading, not neutral — see Next Actions below for my recommendation.

- **Progress on the underlying "Turn Projects into real project pages" goal:** 2 of the 4 non-Jula AI
  OS projects (Store Care Program, CRM) now have real pages; WMS and Automation still don't. Jula AI
  OS remains intentionally out of scope for this pattern (it's the umbrella system, "In progress"
  status, structurally different from the other four) and isn't counted against this goal.

## What changed in `notes/`

None. Per the Act role's scope in this wrapper, `notes/` is only updated when the human has
explicitly instructed an update for this specific cycle, and no such instruction was given — the user
asked me to weigh in on judgment calls, not to write notes directly. The prior cycle's retro already
flagged an open question (whether to record a `notes/architecture/` doc for the `[slug]` pattern,
similar in spirit to `notes/architecture/theme-toggling.md`) that still hasn't been decided. This
cycle strengthens the case for it — the pattern has now been proven twice, the second time requiring
literally zero code changes — but writing it remains a human decision, carried forward below.

## Next Actions

These are proposals for the next Plan cycle. None have been started; the human selects which (if
any) happen next.

1. **Update (don't remove) the `actions.ts` "Turn Projects into real project pages" entry.** The
   user asked me to weigh in with judgment, so: I recommend **rewording the `detail` text**, not
   removing the entry (2 of 4 target projects — CRM, WMS, Automation — still lack pages, so the
   underlying goal isn't done) and not leaving it as-is (the current text "Start with CRM, WMS, and
   Automation" is now misleading, since it omits Store Care Program which already shipped and lists
   CRM as not-yet-started when it now has a page). A reworded detail should reflect actual state —
   e.g., something conveying "Store Care Program and CRM have pages; WMS and Automation still need
   them." I'm not locking in exact wording — that's Plan/Do's call in a small follow-up cycle — but
   the direction (update to reflect current progress, keep the entry open until WMS/Automation are
   also done) is my recommendation.

2. **Decide whether to record a `notes/architecture/` entry for the `[slug]` project-page pattern.**
   Carried forward from the first cycle's retro, now with stronger evidence: the pattern has been
   reused twice, and the second use required zero changes to `Projects.tsx` or the route file — only
   a data edit. A living doc (same format as `theme-toggling.md`) capturing the shape — optional
   `slug?` field, `generateStaticParams` filtered to items with a `slug`, real `notFound()` for
   unmatched params, conditional `Link`-wrap at the card level, and the content-locking /
   anti-fabrication discipline used for page descriptions — would save future cycles (WMS, Automation)
   from re-deriving it from `plan.md`/`changelog.md` archaeology. Still requires explicit human
   instruction to write, per this wrapper's notes-update policy.

3. **Plan the next project-page cycle: WMS and/or Automation.** The pattern is now proven twice with
   no code overhead per additional project — only content matters. Each will need its own
   human-confirmed, locked-in description gathered the same way CRM's was (explicit human answers to
   "what is this for," explicit exclusion of any background-only context that isn't approved for
   shipping), per the same Anti-Fabrication Protocol precedent from both prior cycles. Human to choose
   which project(s) and whether to do one or both in a single cycle.

4. **Revisit the unlinked-cards UX gap, now narrower than before.** After this cycle, 2 of 5 project
   cards are real links (Store Care Program, CRM) and 3 are not (Jula AI OS, WMS, Automation), with no
   visual distinction between linked and unlinked cards. This was flagged as an accepted tradeoff in
   the first cycle's plan; worth deciding whether to address it (e.g., visually distinguishing linked
   vs. unlinked cards) before, or alongside, the next project-page cycle, since the ratio is now
   trending toward "most cards are pages" rather than "most cards are stubs."

These are proposals only, not decisions — they feed the next Plan cycle and require human selection
before any of them starts a new cycle.
