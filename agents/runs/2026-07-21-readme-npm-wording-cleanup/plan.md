# Plan: Clean up duplicate "npm" wording in AI Command Center README

## Goal

Remove the redundant "npm" mention between the `## Stack` and `## Prerequisites` sections of
`projects/ai-command-center/README.md`, so the package-manager requirement is stated clearly once
instead of being duplicated in a way that reads as sloppy or copy-pasted.

## Scope

**In scope (this cycle):**
- `projects/ai-command-center/README.md` only — specifically the `## Stack` section (currently
  lists `npm` as a bare bullet alongside `Next.js (App Router) + TypeScript` and `Tailwind CSS v4`)
  and the `## Prerequisites` section (which separately states `npm (this project uses
  package-lock.json; no other package manager is supported)`).
- Deciding how to de-duplicate: e.g., removing the bare `npm` bullet from `## Stack` and keeping
  the fuller explanation in `## Prerequisites` (since `## Stack` otherwise lists frameworks/
  libraries, not tooling, so a bare `npm` bullet arguably doesn't belong there anyway) — or an
  equivalent single-source-of-truth fix. The exact wording/placement is left to Do's judgment,
  but the end state must state npm as the package manager exactly once, not twice.
- Re-reading the rest of the README before editing, since this is Do's first re-visit of this file
  since the 2026-07-20 onboarding cycle, to confirm no other inaccuracies crept in that would be
  cheap to also flag (not fix unless trivial and clearly in scope — see Non-Goals).

**Out of scope (this cycle):**
- Any other wording, structural, or content changes to the README beyond de-duplicating the "npm"
  mention. This is a narrowly scoped cosmetic cleanup, per the source checkpoint's own framing of
  this item as "cosmetic, low priority" — not a re-opening of the full onboarding review.
- Any changes to `package.json`, `.nvmrc`, `engines` fields, or other project config. The
  Node-version-enforcement gap is a separate, still-open Next Action from the same checkpoint and
  is explicitly not this cycle's concern.
- Any changes to other files, other subprojects, the repo-root `README.md`, or `CLAUDE.md`.

## Steps (for Do)

1. Re-read `projects/ai-command-center/README.md` in full (it may have changed since this plan was
   written) and re-confirm the duplication still exists as described: a bare `npm` bullet under
   `## Stack` and a fuller `npm (...)` sentence under `## Prerequisites`.
2. Remove the bare `npm` bullet from the `## Stack` section, since `## Stack` otherwise lists
   frameworks/libraries (Next.js, Tailwind) rather than package-manager tooling, and the
   `## Prerequisites` section already covers npm with more useful detail (lockfile requirement, no
   other package manager supported).
3. Confirm the `## Prerequisites` section's existing npm sentence still reads correctly on its own
   without the `## Stack` bullet for context (it should, since it's already a self-contained
   sentence) — adjust only if the removal leaves an awkward gap.
4. Do not add npm to `## Stack` under a different label, and do not remove or shorten the
   `## Prerequisites` npm sentence beyond fixing the duplication — the goal is one clear mention,
   not zero or a diminished one.
5. Save changes to `projects/ai-command-center/README.md` only. No other files touched, no commits
   unless separately requested.

## Risks

- **Overall risk: very low.** Single-line removal in a docs-only file already reviewed end-to-end
  in the prior cycle (`agents/runs/2026-07-20-ai-command-center-readme-onboarding/`); no
  application behavior, config, or other subproject is touched.
- **Judgment-call risk:** "de-duplicate" has more than one valid resolution (remove from `Stack`,
  remove from `Prerequisites` and move detail up, or merge into one section). This plan recommends
  removing the `Stack` bullet as the most natural fix given `Stack`'s existing framework-only
  content, but Do should use judgment if re-reading the file reveals a better fit than assumed here.

## Open Questions

None. The source Next Action (`notes/checkpoints/2026-07-21-first-subagent-assisted-pdca.md`,
item 1) explicitly frames this as low-priority cosmetic cleanup with a clear, narrow target; no
ambiguity requires the user's input before Do can proceed.

## Non-Goals

- No changes to the Node-version-enforcement gap (`.nvmrc`/`engines` field) — that is a separate,
  still-open Next Action from the same checkpoint (item 2) and is not addressed by this cycle.
- No broader README rewrite or re-verification of install/build/lint steps — those were already
  verified in the 2026-07-20 cycle and are not being re-litigated here.
- No changes to any file other than `projects/ai-command-center/README.md`.
- No commits — this Plan step only produces
  `agents/runs/2026-07-21-readme-npm-wording-cleanup/plan.md`.
</content>
