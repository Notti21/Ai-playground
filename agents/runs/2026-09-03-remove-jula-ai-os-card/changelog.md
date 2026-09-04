# Change Log — Remove the Jula AI OS card from the Projects grid

**Cycle:** `agents/runs/2026-09-03-remove-jula-ai-os-card/`
**Date:** 2026-09-03
**Plan:** `plan.md` (approved by human 2026-09-03, with answers to all three open questions)
**Status:** Implemented, not committed.

## Human decisions on the plan's open questions

1. **Projects section wording** — leave as-is. Do not reword the heading or description. (Confirmed
   plan's assessment.)
2. **`notes/architecture/slug-project-pages.md` tense update** — do it in this cycle. The decision
   is accepted and this cycle implements the removal; the doc note should read as done, not pending.
3. **`Project["status"]` union** — leave `"In progress" | "Planned" | "Idea"` unchanged. The unused
   members stay as valid future values. Out of scope to trim.

## Changes made

### 1. `projects/ai-command-center/src/data/projects.ts`

- Removed the `Jula AI OS` object (was the first entry in the `projects` array: name "Jula AI OS",
  the umbrella-system description, `status: "In progress"`, `icon: Bot`, no `slug`). The array now
  starts with the `CRM` entry.
- Removed the now-unused `Bot` icon from the `lucide-react` import:
  `import { Boxes, Building2, Workflow, Bot, Store, type LucideIcon }` →
  `import { Boxes, Building2, Workflow, Store, type LucideIcon }`. `Bot` was imported only for the
  Jula AI OS entry; leaving it would fail `next build`'s `@typescript-eslint/no-unused-vars`.
- **Untouched:** the `Project` interface (including the full `status` union), and the CRM, WMS,
  Automation, and Store Care Program entries (name, description, status, slug, icon all unchanged).

### 2. `notes/architecture/slug-project-pages.md` (tense/reference only)

Three spots updated from future/open wording to accepted/done wording, each now citing this cycle's
run folder:

- **Section 1** ("`slug` is an optional field…"): "Jula AI OS is the one remaining card with no
  `slug` — and per [decision] it will be *removed*" → "Every card in the grid now has a `slug` —
  Jula AI OS, the last card without one, was *removed* from the grid
  (`agents/runs/2026-09-03-remove-jula-ai-os-card/`)…".
- **Non-goals bullet** on linked/unlinked visual distinction: "It is now **largely moot**: … will
  be removed … Once that removal lands, every remaining card is a link" → "It is now **moot**: …
  was removed from the grid (`agents/runs/2026-09-03-remove-jula-ai-os-card/`) … Every remaining
  card is a link".
- **Final non-goals bullet** on Jula AI OS's role: "**now decided** … so it will be removed from
  the Projects grid" → "**decided** … so it was removed from the Projects grid
  (`agents/runs/2026-09-03-remove-jula-ai-os-card/`) … A separate future cycle will represent it as
  a system-overview area".

No substantive rewrite; no other sections touched.

### 3. No component or route changes

- `src/components/sections/Projects.tsx` — no edit. The `.map()` is count-agnostic; the
  `if (project.slug) … return <Link> … else return <div>` branch is now dead (every card has a
  slug) but is harmless, valid, and out of scope to remove this cycle.
- `src/app/projects/[slug]/page.tsx` / `generateStaticParams()` — no edit. Jula AI OS never had a
  slug, so no route or static param referenced it.

## Verification

- **`npm run lint`** (in `projects/ai-command-center`) — passed, no warnings.
- **`npm run build`** — passed. Compiled successfully; TypeScript clean. Prerendered routes:
  `/`, `/_not-found`, and `/projects/[slug]` → `crm`, `wms`, `automation`, `store-care-program`.
  No Jula AI OS route.
- **Built homepage HTML** (`.next/server/app/index.html`): contains the four project card names
  (CRM, WMS, Automation, Store Care Program) and their four `href="/projects/…"` links; zero
  occurrences of "Jula AI OS".
- **`grep -rn "Jula AI OS" src/`** → no matches. **`grep -rn "\bBot\b" src/`** → no matches.
- Projects section heading/description in `Projects.tsx` unchanged
  ("What the system is being applied to" / "The real business systems this operating model is meant
  to build and run.").

## git status --short

```
 M notes/architecture/slug-project-pages.md
 M projects/ai-command-center/src/data/projects.ts
?? agents/runs/2026-09-03-remove-jula-ai-os-card/
```

## Not done (per plan / human instruction)

- No commit, no push.
- No Jula AI OS overview / system-overview page (separate future cycle — decision follow-up (ii)).
- No dashboard redesign, no card styling changes, no status-union trim.
- No changes to the four remaining project pages or to `docs/capability-map.md` /
  `docs/business-os-manifesto.md`.
