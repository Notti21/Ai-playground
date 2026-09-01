# Retro — Decide Jula AI OS's role in the AI Command Center

**Cycle:** `agents/runs/2026-09-01-jula-ai-os-role/`
**Date:** 2026-09-01
**Review verdict:** Pass with notes (two non-blocking observations)
**Commit status:** Nothing committed yet — the human reviews the decision entry's exact wording first.

## What we learned

- **A question deferred across four prior cycles is now resolved.** "What is Jula AI OS and how
  should it be represented" was carried out of scope by `2026-08-24-project-pages`,
  `2026-08-28-crm-project-page`, and `2026-08-31-wms-automation-project-pages` (twice in that last
  cycle's retro), always as "an umbrella/system-level concept, not a normal project" but never
  written down as a decision. Giving it a dedicated decision-only cycle got the answer:
  `notes/decisions/2026-09-01-jula-ai-os-role.md` — Jula AI OS is the Jula-specific instance of
  Business OS, not a peer project; remove it from the Projects grid now, represent it as a
  system-overview area later.

- **The blocker was human knowledge, not effort.** No file in the repo defined what "Jula" /
  "Jula's Herb" is, or stated that "Jula AI OS" is a Jula-specific instance of "Business OS." Four
  cycles of Do/Check could not have closed this on their own — it needed the orchestrator to state
  business intent. The lesson for the org: when a deferral keeps recurring, check whether it is
  blocked on a human decision rather than on work, and if so, spin a small decision cycle whose
  whole job is to ask the right questions and record the answer.

- **"Do nothing yet" is only legitimate when recorded as a decision with a reason.** The decision
  entry makes this explicit (option (c), "leave it as a plain unlinked card indefinitely," was
  rejected precisely because it left the deferral unresolved). Even the "not this cycle" parts are
  now documented direction, not silent limbo.

- **A decision-only cycle with a hard "no application code" non-goal ran cleanly.** The separation
  of deciding from implementing held — `git diff` touched only `notes/` and `agents/runs/`, Check
  confirmed independently. The cycle produced three well-scoped implementation/docs follow-ups
  instead of half-doing any of them.

- **The current-state brief as a run-folder artifact (not a `notes/` file) was the right call.** It
  assembled verbatim evidence for the decision — including the naming overlap between "Jula AI OS,"
  "Business OS," "AI Command Center," "AI Organization," and "Personal AI Operating System" — without
  adding a fifth overlapping description to the durable knowledge base.

- **Resolving one question cascaded into two more.** It made the linked-vs-unlinked card UX question
  moot (Jula AI OS was the last unlinked card), and it sharpened the `capability-map.md` /
  `business-os-manifesto.md` inconsistency about whether AI Command Center is a project or a
  dashboard into a follow-up that clearly needs its own decision entry.

- **Prior Next Action already closed:** the WMS/Automation retro's Next Action #1 (close the
  `actions.ts` "Turn Projects into real project pages" entry) was done in commit `4851b08` before
  this cycle. That entry no longer frames Jula AI OS as unfinished work.

## What changed in `notes/`

Both changes were made by Do this cycle and verified by Check — recorded here, not made by Act.

- **New:** [`notes/decisions/2026-09-01-jula-ai-os-role.md`](../../../notes/decisions/2026-09-01-jula-ai-os-role.md)
  — the decision record. Status: Accepted, but still uncommitted pending the human's approval of the
  exact wording (see Check's closing note and Next Action 5 below).
- **Edited (living document):**
  [`notes/architecture/slug-project-pages.md`](../../../notes/architecture/slug-project-pages.md)
  — three spots updated to point the previously-open "should Jula AI OS ever get a page" question at
  the new decision entry, and to record the linked/unlinked-card visual-distinction question as
  largely moot rather than open.
- **Not touched (correctly):** `notes/decisions/2026-07-08-ai-organization-design.md` (immutable —
  the new entry refines its treatment of Jula AI OS's classification without editing it),
  `docs/business-os-manifesto.md`, `docs/capability-map.md`.

## On Check's two non-blocking observations

- **Observation A (follow-up (iv) is a Consequences bullet, not a numbered item):** no action.
  The moot-point note appears twice in the decision entry and is a "do not re-raise this" note
  rather than a schedulable action, so it belongs in Consequences, not the follow-up queue. No
  content is lost. Not worth a change, especially to an about-to-be-committed decision record.

- **Observation B (one off-by-one line anchor — `projects.ts:13-18` vs the object spanning 12-18 —
  in `current-state-brief.md`):** no action. The brief is a point-in-time supporting artifact in the
  run folder, not durable knowledge; every quoted string is verbatim accurate and a reader clicking
  to `:13` still lands inside the right object. Not worth editing.

## Next Actions

Proposals for future Plan cycles. None are started. The human orchestrator selects which (if any)
happen next and in what order.

1. **Implementation cycle — remove the Jula AI OS card from the Projects grid (decision follow-up
   (i)).** Edit `src/data/projects.ts` to drop the Jula AI OS entry; verify `Projects.tsx`'s
   `.map()` / layout / any empty-state assumptions still hold with four cards instead of five;
   confirm whether the Projects section heading and description ("What the system is being applied
   to" / "The real business systems this operating model is meant to build and run") still read
   correctly with Jula AI OS gone, and reword only if needed.

2. **Implementation cycle — build the umbrella / system-overview representation of Jula AI OS
   (decision follow-up (ii)).** A place elsewhere in the app that describes the operating model
   itself and the app's hierarchy and direction, distinct from the peer-project cards. Location,
   shape, and content are undecided and are this cycle's to determine. Audience: the operator and
   internal Jula's Herb management. Hard constraint: the Anti-Fabrication Protocol — invent no
   features, modules, users, workflows, metrics, or roadmap items.

3. **Docs-reconciliation cycle — resolve the `capability-map.md` / `business-os-manifesto.md`
   inconsistency (decision follow-up (iii)).** `capability-map.md:49` lists both "Jula AI OS" and
   "AI Command Center" as Projects; this decision (Jula AI OS = the operating model, not a project)
   and the manifesto (AI Command Center = a dashboard into Business OS, not a project) both
   contradict that list. Per the capability map's own rule, the fix goes through its own new
   `notes/decisions/` entry. This likely also has to settle AI Command Center's own
   project-vs-dashboard status, which the current cycle explicitly kept out of scope.

4. **Drop the linked-vs-unlinked card visual-distinction item from the Next Actions list.** It was
   carried as Next Action #3 in the WMS/Automation retro. It is now moot: Jula AI OS was the only
   unlinked card, and once follow-up (i) removes it, every remaining Projects card is a link. Both
   the decision entry and `slug-project-pages.md` record this. A future cycle should not re-raise
   it.

5. **Housekeeping — the human approves the exact wording of
   `notes/decisions/2026-09-01-jula-ai-os-role.md` before it is committed.** The entry is marked
   Status: Accepted but is still untracked. Plan Step 2 and Check's closing note both require the
   wording-approval gate. The `slug-project-pages.md` edits and the run-folder files are part of the
   same uncommitted change set.

These are proposals only. They feed the next Plan cycle and require human selection before any of
them starts a new cycle.
