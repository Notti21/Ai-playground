# Plan — Remove the Jula AI OS card from the Projects grid

**Cycle:** `agents/runs/2026-09-03-remove-jula-ai-os-card/`
**Date:** 2026-09-03
**Status:** Draft — awaiting human approval. Do may not act on this plan until the user explicitly approves it.

## Goal

Make the AI Command Center's Projects grid match the accepted decision in
`notes/decisions/2026-09-01-jula-ai-os-role.md` (decision follow-up **(i)**, retro Next Action #1):
remove the "Jula AI OS" card, leaving CRM, WMS, Automation, and Store Care Program. This is a
data-only removal — no new page, no redesign.

## Scope

### In scope

- Delete the `Jula AI OS` entry from the `projects` array in
  `projects/ai-command-center/src/data/projects.ts`.
- Remove the now-unused `Bot` icon from the `lucide-react` import in that same file (it is imported
  only for the Jula AI OS entry — confirmed by grep: no other `Bot` usage in `src/`).
- Verify `projects/ai-command-center/src/components/sections/Projects.tsx` still renders correctly
  with four cards: the `.map()` is count-agnostic, the grid is
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, and there is no empty-state branch — so no code
  change is expected here, only confirmation.
- Verify `projects/ai-command-center/src/app/projects/[slug]/page.tsx` and `generateStaticParams()`
  are unaffected (Jula AI OS never had a `slug`, so no route or static param references it).
- Run `npm run lint` and `npm run build` in `projects/ai-command-center`, and do a visual check of
  the Projects section, to confirm nothing broke.
- Minimal tense-only update to the living document
  `notes/architecture/slug-project-pages.md` so its "Jula AI OS *will be* removed" phrasing reads
  as done — **only if the human approves this in Open Question 2**; otherwise leave it for a later
  pass.
- Write this cycle's run-folder artifacts (changelog, review, retro) as the PDCA loop proceeds.

### Out of scope

See Non-Goals.

## Steps

1. **Confirm the starting state.** Re-read `projects/ai-command-center/src/data/projects.ts` and
   `.../components/sections/Projects.tsx`. Confirm the Jula AI OS object spans lines 12–18, that
   `Bot` is imported on line 1 and used nowhere else, and that no other file in
   `projects/ai-command-center/src/` references "Jula AI OS" (grep already shows only `projects.ts`).

2. **Edit `projects/ai-command-center/src/data/projects.ts`:**
   - Remove the entire `{ name: "Jula AI OS", ... icon: Bot, }` object (and its trailing comma) so
     the array starts with the `CRM` entry.
   - Remove `Bot` from the `import { Boxes, Building2, Workflow, Bot, Store, type LucideIcon } from "lucide-react";`
     line, leaving `import { Boxes, Building2, Workflow, Store, type LucideIcon } from "lucide-react";`.
   - Leave the `Project` interface untouched, including the `status` union
     (`"In progress" | "Planned" | "Idea"`) even though no remaining card uses `"In progress"` or
     `"Planned"` — see Risks / Open Question 3.
   - Do **not** touch the CRM, WMS, Automation, or Store Care Program entries (name, description,
     status, slug, icon all unchanged).

3. **Confirm no component change is needed.** Inspect `Projects.tsx` and `[slug]/page.tsx`. Expect
   zero edits. If either turns out to actually need a change (e.g. a hardcoded assumption about card
   count that grep missed), **stop and report back** rather than improvising — that would be a
   sign the removal is not as contained as the decision assumes.

4. **Lint and build.** In `projects/ai-command-center`: `npm run lint` then `npm run build`. Both
   must pass. A failing unused-import lint error here is the most likely failure mode (see Risks).

5. **Visual check.** Run the dev server (or inspect the build output) and confirm the Projects
   section shows exactly four cards — CRM, WMS, Automation, Store Care Program — in a single row at
   `lg` width, two-up at `sm`, one-up on mobile, with no gap, stray wrapper, or broken layout where
   the fifth card was.

6. **Projects section wording.** Compare the current heading/description —
   *"What the system is being applied to"* / *"The real business systems this operating model is
   meant to build and run."* — against the four remaining cards. Do **not** reword unless the human
   answers Open Question 1 asking for a change. Plan's assessment: the wording reads correctly (and
   arguably better) with Jula AI OS gone, because the four remaining cards are exactly "business
   systems the operating model is applied to" and Jula AI OS was the misfit the decision identifies.

7. **(Conditional) Living-doc tense update.** If the human approves Open Question 2, update
   `notes/architecture/slug-project-pages.md` where it currently says Jula AI OS "will be removed" /
   "Once that removal lands" / "is the one remaining card with no `slug`" to past tense, citing this
   cycle. Tense and cross-reference only — no substantive rewrite. Otherwise skip.

8. **Hand off to Check.** Produce the changelog; Check verifies `git diff` touches only
   `projects/ai-command-center/src/data/projects.ts` (plus optionally `slug-project-pages.md` and
   run-folder files), that lint/build pass, and that the four expected cards render and no
   "Jula AI OS" string remains in `src/` or built output.

9. **Do not commit.** Leave all changes uncommitted for the human to review, per the human's
   explicit constraint for this cycle.

## Risks

- **Unused `Bot` import breaks the build.** `next build` runs ESLint (`next/core-web-vitals` +
  `next/typescript`), and `@typescript-eslint/no-unused-vars` will flag a leftover `Bot` import as
  an error, failing the build. Step 2 removes it; Step 4 catches it if missed.
- **A missed reference to card count or to Jula AI OS.** Grep of
  `projects/ai-command-center/src/` shows "Jula AI OS" only in `projects.ts`, and no
  `projects.length` / `projects[0]` / index access anywhere. Low risk, but Step 3's "stop and
  report" guard covers the case where something non-obvious depends on the fifth card.
- **Grid layout with four cards.** `lg:grid-cols-4` makes four cards one clean row; `sm:grid-cols-2`
  makes two rows of two. No expected issue, but Step 5 confirms visually rather than assuming.
- **Scope creep into the living doc.** If Step 7 runs, the edit must be tense/reference only.
  Rewriting `slug-project-pages.md`'s analysis, or touching its other sections, is out of scope.
- **Status-union dead members.** After removal, no card uses `"In progress"` or `"Planned"`. Leaving
  them is harmless (they are valid type members for future use). Removing them is a typing cleanup
  that is not part of this goal and could have knock-on effects on `[slug]/page.tsx`'s
  `status === "Idea"` branch reasoning — deferred, see Open Question 3.
- **Decision-record wording.** The human still holds final say on the decision entry's exact
  wording (prior retro Next Action #5), but that entry is already committed (`5ea9b6b`) with
  Status: Accepted, and this cycle treats it as the authority. If the human is not in fact settled
  on it, that should be raised before this cycle's Do runs.

## Open Questions

1. **Does the Projects section heading/description need rewording?** Current text:
   *"What the system is being applied to"* / *"The real business systems this operating model is
   meant to build and run."* Plan's assessment is that it reads correctly — arguably better —
   without Jula AI OS, so the plan is to leave it as-is. Confirm, or specify the replacement text.
   Do will not reword on its own judgement.
2. **Should `notes/architecture/slug-project-pages.md` get its tense-only update in this cycle**
   (Step 7), or should that be left for a later pass so this cycle's diff stays to a single file?
3. **Leave the `"In progress" | "Planned"` members of the `Project["status"]` union in place?**
   Plan recommends yes (leave them — valid future values, out of scope to touch). Confirm, or say
   you want the union trimmed to `"Idea"` as part of this cycle.

## Non-Goals

- **No Jula AI OS overview / system page or umbrella area.** That is decision follow-up **(ii)** /
  retro Next Action #2 — a separate future cycle. This cycle only removes the card.
- **No dashboard redesign.** No changes to layout, sections, navigation, or the homepage
  composition beyond the card disappearing from the grid.
- **No card styling changes** beyond whatever the removal strictly forces (none expected).
- **No changes to the CRM, WMS, Automation, or Store Care Program cards or pages** — descriptions,
  statuses, slugs, icons, and `[slug]/page.tsx` all stay exactly as they are.
- **No edits to `docs/capability-map.md` or `docs/business-os-manifesto.md`.** The
  `capability-map.md:49` "Projects" inconsistency is decision follow-up **(iii)** and needs its own
  `notes/decisions/` entry.
- **No edits to `notes/decisions/2026-07-08-ai-organization-design.md` or
  `notes/decisions/2026-09-01-jula-ai-os-role.md`** — both immutable / already accepted.
- **Not resolving AI Command Center's own project-vs-dashboard status** (follow-up (iii) territory).
- **No commit and no push.** The human reviews the uncommitted diff.
