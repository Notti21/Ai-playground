# Plan — "System Overview" homepage copy: one-word grammar fix

**Cycle:** `agents/runs/2026-09-08-system-overview-grammar-fix/`
**Date:** 2026-09-08
**Status:** Draft — awaiting user approval. Do may NOT act on this plan until the user explicitly approves it.

## Goal

Apply a single approved grammar fix to the "System Overview" section copy in the AI Command
Center homepage: insert the word `the` so `...the areas that operating model is being applied to.`
becomes `...the areas that the operating model is being applied to.` Nothing else changes.

## Background (why this is safe now)

- The missing `the` was flagged by Check as non-blocking Note 3 in
  `agents/runs/2026-09-04-jula-ai-os-system-overview/review.md`. The copy shipped verbatim from a
  human-approved content-lock, so shipping it unchanged then was correct.
- It has been carried as an optional Next Action in three subsequent retros
  (`2026-09-04-jula-ai-os-system-overview`, `2026-09-04-docs-jula-ai-os-reconciliation`,
  `2026-09-07-readme-project-list-and-dead-branch`).
- The human has now explicitly asked for the fix, which lifts the content-lock for this one word only.

## Re-verified current text

`projects/ai-command-center/src/components/sections/SystemOverview.tsx` line 11, verified
2026-09-08, the `description` prop passed to `<SectionHeading>` (exact current string):

```
Jula AI OS is the operating model for running the company. The AI Command Center is the dashboard and interface into it. CRM, WMS, Automation, and Store Care Program are the areas that operating model is being applied to.
```

`grep` confirms the phrase `that operating model` occurs exactly once in
`projects/ai-command-center/src` — only on this line. The card paragraph (lines 15-18) already
reads `The operating model is being built up progressively...` and is NOT affected.

## The exact edit

One word inserted in the `description` prop on line 11. No other character changes.

- **Before:** `... are the areas that operating model is being applied to.`
- **After:**  `... are the areas that the operating model is being applied to.`

Full `description` string after the edit:

```
Jula AI OS is the operating model for running the company. The AI Command Center is the dashboard and interface into it. CRM, WMS, Automation, and Store Care Program are the areas that the operating model is being applied to.
```

## Scope

- **In scope:** the one-word insertion above in `SystemOverview.tsx`; lint + build verification in
  `projects/ai-command-center`; a changelog entry for this run folder.
- **Out of scope:** everything else (see Non-Goals).

## Steps (for Do)

1. Edit `projects/ai-command-center/src/components/sections/SystemOverview.tsx` line 11: insert
   `the ` before `operating model` in the `that operating model` clause of the `description` prop.
   Change nothing else in the file.
2. From `projects/ai-command-center`, run `npm run lint`. Expect a clean pass, no new warnings.
3. From `projects/ai-command-center`, run `npm run build`. Expect success, TypeScript clean,
   route set unchanged (`/`, `/_not-found`, `/projects/[slug]`).
4. Optionally confirm the built homepage HTML (`.next/server/app/index.html`) now contains
   `areas that the operating model is being applied to` and no longer contains
   `areas that operating model is being applied to`.
5. Write `agents/runs/2026-09-08-system-overview-grammar-fix/changelog.md`: the one-word
   before/after, the lint/build results, and `git status --short`.
6. Stop. Do NOT commit.

## Check gate

- Diff is exactly one word (`the`) added on one line of `SystemOverview.tsx`; no other file
  modified except the new run-folder files.
- `npm run lint` passes; `npm run build` succeeds; route set unchanged.
- The rest of the "System Overview" copy (eyebrow `System Overview`, title
  `How the parts fit together`, the first two sentences of the description, the card paragraph) is
  byte-for-byte unchanged.
- No commit was made.

## Risks

- **Over-editing / polishing.** The temptation to "improve" the sentence further (e.g. tightening
  `are the areas that the operating model is being applied to`). Do must resist — only `the` is added.
- **Touching the wrong occurrence.** The word `operating model` appears twice in the file; the edit
  is only in the `description` prop's `that operating model` clause on line 11, not the card
  paragraph. `grep 'that operating model'` disambiguates (single match).
- **Build/lint environment.** If `npm` deps are not installed in `projects/ai-command-center`, Do
  may need `npm install` first; that is a local dev artifact, not a scope change.
- **Prettier/formatter reflow.** A formatter on save could rewrap the long JSX string. Do should
  ensure only the intended one-word change appears in the diff and revert any incidental reflow.

## Open Questions

None. The wording, the file, and the constraints are fully specified. If Do finds the current text
does not match the "Re-verified current text" above, stop and report rather than adapting the edit.

## Non-Goals

- No change to any other word of `SystemOverview.tsx` copy — no rewrites, no polishing.
- No layout, styling, className, or component-structure changes.
- No route, `page.tsx`, `TopBar`, `Projects.tsx`, or `src/data/*` changes.
- No docs changes (`notes/`, `docs/`, `README.md`).
- No project-data changes.
- No commit or push in this cycle.
