# Plan — Fix stale project list in `agents/README.md`; assess the dead unlinked-card branch in `Projects.tsx`

**Cycle:** `agents/runs/2026-09-07-readme-project-list-and-dead-branch/`
**Date:** 2026-09-07
**Status:** Draft — awaiting human approval. Do may not act on any part of this plan until the user explicitly approves it.

---

## Goal

Close the last two loose ends of the four-cycle Jula AI OS / AI Command Center lineage:

1. Correct the stale five-project classification in `agents/README.md` line 19 so it matches the
   accepted architecture decisions (`notes/decisions/2026-09-01-jula-ai-os-role.md`,
   `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`).
2. Determine whether the `if (project.slug) … else return <div>` fallback branch in
   `projects/ai-command-center/src/components/sections/Projects.tsx` is *provably* dead and therefore
   safe to remove — and if it is not provably dead, present the options and STOP for the human.

No commit in this cycle.

---

## Scope

**In scope**

- One line-scoped edit to `agents/README.md:19` (item 1).
- A written determination for item 2, with re-derived evidence, plus options and a STOP if the
  branch is not provably dead.

**Out of scope** — see Non-Goals for the full list. In brief: no project-content / route / card-styling
changes, no changes to the Jula AI OS / AI Command Center architecture decisions, no edits to
`docs/capability-map.md` or `docs/business-os-manifesto.md`, no `SystemOverview.tsx` copy fix, no
refactoring, no commit.

---

## Item 1 — `agents/README.md` stale project list

### Re-derived evidence (read from the repo at `HEAD` = `b4dd13f`, working tree clean)

**Exact current text — `agents/README.md`, lines 17–21:**

```
17	```
18	
19	Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they're what the loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.
20	
21	## How one cycle works
```

The line sits directly under the "Who's who" ASCII diagram (lines 7–17), which shows only
`You → Orchestrator → Plan/Do/Check/Act`. Line 19's sole job is to distinguish **projects** (what
the loop is applied to) from **agents**. Neither "Jula AI OS" nor "AI Command Center" appears
anywhere else in `agents/README.md`.

**Why the current list is wrong**, per the accepted decisions:

- `notes/decisions/2026-09-01-jula-ai-os-role.md` (Accepted, committed `5ea9b6b`), Decision ¶1–3:
  "Jula AI OS is **not a peer project** alongside CRM, WMS, Automation, and Store Care Program.
  Those are areas the system is *applied to*; Jula AI OS is the umbrella operating model *above*
  them, and AI Command Center is the dashboard/interface into it."
- `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` (Accepted,
  committed `b4dd13f`), Decision ¶1–3: Jula AI OS and AI Command Center are removed from the
  Projects list; "The Projects list is completed with Store Care Program"; the four applied project
  areas are "CRM, WMS, Automation, Store Care Program" — matching
  `projects/ai-command-center/src/data/projects.ts` (four entries: CRM, WMS, Automation, Store Care
  Program).
- The same decision's "What this does NOT decide" explicitly names `agents/README.md:19` as
  carrying "the same 'Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center)' list … not
  immutable … explicitly deferred to a separate cleanup" — i.e. this cycle.

**Corroboration that the target wording is already the live convention** (re-derived by grep):

- `docs/capability-map.md:49` now reads: "…the concrete initiatives the business is actually
  running: CRM, WMS, Automation, Store Care Program."
- `docs/business-os-manifesto.md:14` now reads: "…every future project — CRM, WMS, automation, the
  Store Care Program, and whatever comes after…"
- The only other file still carrying the old five-project list is
  `notes/decisions/2026-07-08-ai-organization-design.md:32`, which is an **immutable decision
  record** — deliberately not edited; `2026-09-01-jula-ai-os-role.md` (Consequences) already
  records that the later ruling governs where the two differ. (Historical `agents/runs/*/` files
  also contain the old list; those are frozen case files and are correct to leave untouched.)

### Exact proposed edit

**File:** `agents/README.md` — **one line changed, line 19.**

**BEFORE:**

```
Projects (CRM, WMS, Automation, Jula AI OS, AI Command Center) are not agents — they're what the loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.
```

**AFTER:**

```
Projects (CRM, WMS, Automation, Store Care Program) are not agents — they're what the loop is applied *to*. One PDCA cycle always runs in the context of a specific project or task.
```

Change = replace `Jula AI OS, AI Command Center` with `Store Care Program` inside the parenthetical.
Everything else on the line (and every other line in the file) is unchanged. This matches
`docs/capability-map.md:49`'s list exactly.

### Does item 1 need a new `notes/decisions/` entry?

**No.** `agents/README.md` is not governed by the capability-map amendment rule, and this edit only
propagates an already-Accepted decision
(`2026-09-04-capability-map-ai-command-center-classification.md`) into one more file it explicitly
named as a follow-up. Do should cite that decision in the changelog. If the human wants the README
change recorded, the retro's "What changed in notes/" section is sufficient. (Surfaced as Open
Question 1 in case the human disagrees.)

---

## Item 2 — the unlinked-card fallback branch in `Projects.tsx`

### The code in question (re-derived, `Projects.tsx` lines 15–40)

```tsx
{projects.map((project) => {
  const cardContent = ( /* <Card> … </Card> */ );

  if (project.slug) {
    return (
      <Link key={project.name} href={`/projects/${project.slug}`}>
        {cardContent}
      </Link>
    );
  }

  return <div key={project.name}>{cardContent}</div>;   // <-- the branch in question
});
```

### Evidence gathered

1. **`slug` is optional on the shared type.** `src/data/projects.ts:3–9`:

   ```ts
   export interface Project {
     name: string;
     description: string;
     status: "In progress" | "Planned" | "Idea";
     icon: LucideIcon;
     slug?: string;          // <-- optional, not required
   }
   ```

2. **Every current entry sets `slug`.** `src/data/projects.ts:11–44` — four entries:
   `crm`, `wms`, `automation`, `store-care-program`. The only card that ever lacked a slug
   (Jula AI OS) was removed from the array in `agents/runs/2026-09-03-remove-jula-ai-os-card/`
   (committed `e71edd4`). So **at runtime today the `<div>` branch is never taken** — it is
   unreachable *given the current data*.

3. **Nothing else consumes the branch itself.** `grep -rn "slug" src/` returns only:
   `Projects.tsx` (this branch + the `<Link href>`), `src/data/projects.ts` (the type + 4 entries),
   and `src/app/projects/[slug]/page.tsx`. No test files exist (`find src -name "*.test.*"` → none;
   `package.json` has no test script). No other component imports `projects` and branches on `slug`.

4. **BUT the *optionality* of `slug` is independently load-bearing in a second place.**
   `src/app/projects/[slug]/page.tsx:5–9`:

   ```ts
   export function generateStaticParams() {
     return projects
       .filter((project) => project.slug)                 // <-- only slugged projects get prerendered
       .map((project) => ({ slug: project.slug as string }));  // <-- cast needed *because* slug is optional
   }
   ```

   Plus the `if (!project) notFound();` at line 19–21. This route is written, on purpose, to
   tolerate a `projects` array that contains slug-less entries.

5. **The optional-`slug` design is documented as a deliberate, still-current architecture pattern.**
   `notes/architecture/slug-project-pages.md` (a *living* reference, last touched to reflect the
   Jula AI OS removal) §1: *"`slug?: string` … **Optional, not required — this is what makes
   incremental rollout cheap**: … a project without one just omits the field, with every piece of
   downstream logic below written to treat 'no `slug`' as 'no page'."* §2 quotes the exact
   `if (project.slug) … return <div>` branch as step 2 of the pattern. §5: *"giving a new project a
   real page means editing exactly one file: `src/data/projects.ts` — add `slug: "..."`."* The
   pattern's whole selling point is that a future project can be added to the grid *without* a page
   by omitting `slug`.

### Determination: the branch is NOT provably dead

It is **unreachable with today's data**, but it is **not provably dead**, because:

- `slug` remains `slug?: string` (optional) on `Project`. The type permits a slug-less entry.
- Adding a slug-less entry is an explicitly documented, supported workflow
  (`slug-project-pages.md` §1, §5) — "incremental rollout" is the stated reason the field is
  optional. A future project card with no page yet is a realistic, sanctioned case.
- The optionality is independently relied on by `[slug]/page.tsx`'s `generateStaticParams()`
  (`.filter(p => p.slug)` + `as string` cast) and its `notFound()` guard. `Projects.tsx`'s `<div>`
  branch is the grid-side half of that same "slug-less project renders safely" contract.
- Removing only the `<div>` branch (leaving `slug` optional) would leave a latent inconsistency:
  a future slug-less entry would render `<Link href="/projects/undefined">` — a template literal is
  always `string`, so TypeScript's `strict` mode would **not** catch it; it would ship as a broken
  link silently.
- Making the branch genuinely dead requires changing `slug?: string` → `slug: string` and updating
  `[slug]/page.tsx` (`generateStaticParams`) and `slug-project-pages.md` §1/§2/§5/Non-goals — i.e.
  editing the documented architecture pattern. That is a design change, not cleanup, and is
  out of scope per this cycle's hard constraints ("no refactoring of unrelated code"; "no changes
  to the … architecture decisions").

Per this cycle's hard constraint — *"If the `Projects.tsx` branch is NOT provably dead … the plan
must present that and STOP for the human to decide"* — **Do must not remove this branch. Item 2
stops here for a human decision** (Open Question 2).

### Options for the human (item 2)

- **Option A — Leave `Projects.tsx` and `slug-project-pages.md` exactly as they are (recommended).**
  The branch is ~2 lines of defensive rendering that is consistent with the type, with
  `[slug]/page.tsx`, and with the documented "optional slug = incremental rollout" pattern. It costs
  nothing at runtime and is correct if a future card is added without a page. `slug-project-pages.md`
  §2 still accurately shows the branch, so no doc drift. Net change for item 2: none.

- **Option B — Make `slug` mandatory and remove the branch (a deliberate design change; needs its
  own cycle).** `slug?: string` → `slug: string`; drop the `<div>` branch in `Projects.tsx`; drop
  the `.filter(p => p.slug)` + `as string` cast in `generateStaticParams`; rewrite
  `slug-project-pages.md` §1, §2, §5 and Non-goals to state slug is required and every grid card
  must have a page; likely a new `notes/decisions/` entry since it reverses a documented pattern.
  This trades the "add a card without a page" capability for a slightly simpler component. It is
  bigger than "small cleanup" and conflicts with this cycle's non-goals, so it should be a separate,
  explicitly-chartered cycle if the human wants it — not folded in here.

- **Option C — Remove only the `<div>` branch, keep `slug` optional.** Not recommended: creates the
  silent `/projects/undefined` broken-link hazard described above and desyncs `Projects.tsx` from
  `slug-project-pages.md` §2.

Also note: `slug-project-pages.md` §2 currently reproduces the branch verbatim. If the human picks
Option A, that snippet stays accurate and needs no edit. (The retro that proposed this work floated
"bundle in syncing the `slug-project-pages.md` code snippet if it still shows the branch" — under
Option A there is nothing to sync.)

---

## Steps (for Do, once approved)

Do proceeds with **item 1 only**. Item 2 is blocked on Open Question 2.

1. **Confirm preconditions.** `git status` clean; `HEAD` is `b4dd13f`; `agents/README.md:19` still
   reads the BEFORE text above verbatim. If line 19 differs from the quoted BEFORE, STOP and report.
2. **Edit `agents/README.md` line 19** — apply the single BEFORE→AFTER substitution above
   (`Jula AI OS, AI Command Center` → `Store Care Program`). No other line changes.
3. **Verify the diff.** `git diff agents/README.md` shows exactly one line changed, matching the
   AFTER text byte-for-byte. `git status` shows only `agents/README.md` modified (plus the new
   untracked run folder).
4. **Write `changelog.md`** in the run folder: the one-line edit, citing
   `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` and
   `notes/decisions/2026-09-01-jula-ai-os-role.md`; and record that item 2 was assessed and
   deliberately left unchanged pending the human's Option A/B/C decision (this plan's Item 2
   section).
5. **Do NOT commit.** Hand off to Check.

If the human answers Open Question 2 with Option A: item 2 requires **no code change** — Do just
records the determination in the changelog (already covered by step 4). Options B/C are out of scope
for this cycle and would need a new plan.

---

## Check gate

- `agents/README.md:19` equals the approved AFTER text byte-for-byte; no other line in the file
  changed (`git diff` = exactly one line, one substitution).
- `grep -rn "CRM, WMS, Automation" agents/ notes/ docs/` shows no remaining *non-immutable,
  non-historical* file with the old five-project list. Expected remaining hits:
  `notes/decisions/2026-07-08-ai-organization-design.md:32` (immutable — correct to leave) and
  frozen `agents/runs/*/` case files (correct to leave). `agents/README.md` should now read
  `CRM, WMS, Automation, Store Care Program`.
- New README list matches `docs/capability-map.md:49` exactly.
- No changes to any file under `projects/ai-command-center/`, `docs/`, `notes/decisions/`, or
  `notes/architecture/` (item 2 stopped; item 1 is README-only).
- Nothing committed.
- `changelog.md` records both the item 1 edit and the item 2 determination.
- No markdown build/lint applies (README is plain docs); no app build needed since no app file
  changed.

---

## Risks

- **The README edit could be seen as needing a decision record.** Mitigated: the retro of
  `2026-09-04-docs-jula-ai-os-reconciliation` and the 2026-09-04 decision's own "What this does NOT
  decide" both pre-authorize this as a deferred follow-up, not a new decision. Surfaced as Open
  Question 1.
- **Phrasing choice for README:19.** The minimal edit drops Jula AI OS / AI Command Center silently
  rather than adding a clause explaining they are the operating model / the dashboard. That matches
  `capability-map.md:49` and keeps the line's "projects vs agents" focus, but a reader of only this
  line loses the "why they're not here" context. Alternative in Open Question 1.
- **Item 2 temptation to "just delete two lines."** The branch looks obviously dead. The plan's
  determination and this cycle's hard constraint both say: do not. Do must respect the STOP.
- **Stale line numbers.** This plan quotes `agents/README.md:19` and `Projects.tsx` / `projects.ts`
  / `[slug]/page.tsx` line numbers as of `HEAD` `b4dd13f`. Do re-verifies the BEFORE text in step 1
  rather than trusting the line number.
- **Working-tree note:** the session-start `git status` snapshot showed `projects.ts` and
  `slug-project-pages.md` as modified; the live tree is clean at `b4dd13f` (those changes were
  committed in `d6d4941` / `b4dd13f`). Do should confirm a clean tree before starting.

---

## Open Questions

1. **README:19 phrasing + record-keeping.** (a) Is the minimal substitution
   (`… Jula AI OS, AI Command Center` → `… Store Care Program`) acceptable, or do you want an added
   clause noting Jula AI OS is the operating model and AI Command Center the dashboard? (b) Confirm
   no new `notes/decisions/` entry is needed (recommended: none — retro note suffices).

2. **Item 2 direction.** The `<div>` fallback branch in `Projects.tsx` is unreachable today but
   **not provably dead** (`slug` is still optional by design; `[slug]/page.tsx` and
   `slug-project-pages.md` both depend on that optionality). Pick one:
   - **A — leave it as-is** (recommended; no change this cycle),
   - **B — make `slug` mandatory and remove the branch** (separate, explicitly-chartered cycle —
     out of scope here),
   - **C — remove only the branch, keep `slug` optional** (not recommended — silent broken-link
     hazard).

---

## Non-Goals

- No commit in this cycle.
- No edit to `projects/ai-command-center/src/components/sections/Projects.tsx` (item 2 is stopped
  for a human decision).
- No edit to `src/data/projects.ts`, `src/app/projects/[slug]/page.tsx`, or
  `notes/architecture/slug-project-pages.md`.
- No changes to project content, descriptions, statuses, routes, card styling, layout, or the four
  project pages.
- No changes to the Jula AI OS / AI Command Center architecture decisions
  (`2026-09-01-jula-ai-os-role.md`, `2026-09-04-capability-map-ai-command-center-classification.md`).
- No edits to `docs/capability-map.md` or `docs/business-os-manifesto.md`.
- No edit to the immutable `notes/decisions/2026-07-08-ai-organization-design.md`.
- The `SystemOverview.tsx` copy fix ("that operating model" → "that the operating model") is
  explicitly OUT of this cycle.
- No new features, no refactoring of unrelated code, no dependency or tooling changes.

---

**Do may not act on this plan until the user explicitly approves it.** Once approved, Do executes
**item 1 only** and stops; item 2 remains blocked on Open Question 2.
