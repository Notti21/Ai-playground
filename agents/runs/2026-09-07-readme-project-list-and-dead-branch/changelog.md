# Change Log — Fix stale project list in `agents/README.md`; assess dead branch in `Projects.tsx`

**Cycle:** `agents/runs/2026-09-07-readme-project-list-and-dead-branch/`
**Date:** 2026-09-07
**Plan:** `plan.md` — approved 2026-09-07 with Open Questions resolved: Q1 → minimal substitution,
retro note only (no new decision record); Q2 → **Option A**, leave the `Projects.tsx` branch as-is.
**Status:** Implemented, not committed.

## Item 1 — `agents/README.md` stale project list (DONE)

One line changed, line 19.

- **before:** `Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they're what the loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.`
- **after:** `Projects (CRM, WMS, Automation, Store Care Program) are not agents — they're what the loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.`

Substitution: `Jula AI OS, AI Command Center` → `Store Care Program`. Nothing else on the line or
in the file changed.

**Basis:** `notes/decisions/2026-09-01-jula-ai-os-role.md` (Jula AI OS = umbrella operating model,
not a peer project) and `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`
(AI Command Center = the Dashboard, not a project; the four applied project areas are CRM, WMS,
Automation, Store Care Program). The latter's "What this does NOT decide" section explicitly named
`agents/README.md:19` as a deferred follow-up — this cycle closes it. The new list matches
`docs/capability-map.md:49` verbatim.

No new `notes/decisions/` entry created — `agents/README.md` is not under the capability-map
amendment rule, and this only propagates an already-Accepted decision into one more file it named.

## Item 2 — the unlinked-card fallback branch in `Projects.tsx` (ASSESSED, NO CHANGE)

The `if (project.slug) { return <Link> } return <div key={project.name}>{cardContent}</div>`
structure in `projects/ai-command-center/src/components/sections/Projects.tsx`.

**Determination (from the plan's re-derived evidence):** the `<div>` branch is **unreachable with
today's data** (all 4 `projects.ts` entries set `slug`) but is **not provably dead**:

- `slug?: string` is still optional on the `Project` type.
- `src/app/projects/[slug]/page.tsx` `generateStaticParams()` independently relies on that
  optionality (`.filter((project) => project.slug)` + `slug: project.slug as string`), plus a
  `notFound()` guard.
- `notes/architecture/slug-project-pages.md` §1/§2/§5 documents optional `slug` as the deliberate
  "incremental rollout" pattern (a card can be added to the grid without a page) and quotes this
  exact branch as step 2 of the pattern.
- Removing only the branch would silently ship `<Link href="/projects/undefined">` for any future
  slug-less entry — TypeScript `strict` would not catch it.

Per the cycle's hard constraint ("if the branch is not provably dead, stop and ask"), the human
was asked and chose **Option A — leave `Projects.tsx` and `slug-project-pages.md` exactly as they
are.** No code change. `slug-project-pages.md` §2 still shows the branch accurately, so no doc
drift.

Options B (make `slug` mandatory + remove the branch) and C (remove branch only) were presented
and not chosen; B would be a separate, explicitly-chartered design cycle if ever wanted.

## Verification

- `git diff agents/README.md` — exactly one line changed, matching the approved AFTER text
  byte-for-byte.
- `git status --short` — only `agents/README.md` modified, plus the untracked run folder.
- `grep -rn "Automation, Jula AI OS" agents/ notes/ docs/` — no remaining hit in a live,
  non-frozen, non-immutable file. Remaining hits are: this cycle's own `plan.md` (quoting the
  BEFORE), frozen `agents/runs/*/` case files, and the immutable decision records
  (`2026-07-08-ai-organization-design.md:32`, and `2026-09-01-jula-ai-os-role.md` /
  `2026-09-04-...md` which quote the old list while explaining the fix). All correct to leave.
- No file under `projects/ai-command-center/`, `docs/`, `notes/decisions/`, or
  `notes/architecture/` changed. No app build needed (no app file touched).
- Nothing committed.

## git status --short

```
 M agents/README.md
?? agents/runs/2026-09-07-readme-project-list-and-dead-branch/
```

## Not done (per plan / human instruction)

- No commit, no push.
- No `Projects.tsx` / `projects.ts` / `[slug]/page.tsx` / `slug-project-pages.md` change (Option A).
- No `SystemOverview.tsx` copy fix (explicitly out of this cycle).
- No `docs/` or immutable-decision edits.
