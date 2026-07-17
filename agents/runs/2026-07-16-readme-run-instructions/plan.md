# Plan: Document local run instructions for AI Command Center

## Goal

Add a short, accurate README section for `projects/ai-command-center` explaining how to run the
app locally, derived from `package.json`'s `scripts` and the README's existing structure.

## Scope

**In scope (this cycle):**
- Reviewing/updating the existing "Development" and "Scripts" sections of
  `projects/ai-command-center/README.md` so they clearly and correctly document local setup and
  run steps, based on what's actually defined in `package.json`.
- Producing a plan for Do to execute; Do performs the actual edit.

**Out of scope (this cycle):**
- Any change to application code, `package.json`, or files outside
  `projects/ai-command-center/README.md`.
- Any change to repo-root documentation or `CLAUDE.md`.

## Steps (for Do)

1. Open `projects/ai-command-center/README.md` and confirm current content of the "Development"
   and "Scripts" sections (see Open Questions below — README already contains both).
2. Verify each documented script against `package.json`'s `scripts` block:
   - `npm run dev` → `next dev`
   - `npm run build` → `next build`
   - `npm run start` → `next start`
   - `npm run lint` → `eslint`
3. Add or adjust a "Local Development" (or equivalently named) section that covers, at minimum:
   - Prerequisite: Node.js installed (version not currently pinned anywhere Plan read — Do should
     check for an `.nvmrc`/`engines` field before inventing a version number, or omit a specific
     version if none is pinned).
   - `npm install` to install dependencies.
   - `npm run dev` to start the dev server, with the existing `http://localhost:3000` note.
   - Optionally note `npm run build` + `npm run start` for a production-mode local run.
4. Keep the existing "Scripts" list as the single source of truth for command reference; avoid
   duplicating script descriptions in two places if not necessary — consolidate wording rather
   than repeating it, unless the user prefers two distinct sections (setup vs. reference).
5. Save the README change only — no other files touched.
6. Do NOT run `npm install`, `npm run dev`, `npm run build`, or `npm run lint` as verification
   unless the user has explicitly allowed Do to execute commands in this cycle; if verification
   requires running the dev server, confirm with the user first per this repo's "ask before major
   changes" convention.

## Risks

- **Overall risk: trivial/low.** This is a docs-only change to a single README file in an
  isolated project directory; no code, dependencies, or shared tooling are touched.
- Duplication risk: the README already has both a "Development" section (with `npm install` /
  `npm run dev` / localhost URL) and a "Scripts" section (listing all four scripts). Adding a new
  section without checking these could result in redundant or conflicting instructions.
- Version drift risk: no Node.js version is documented anywhere Plan was permitted to read (only
  `agents/roles/plan.md`, `CLAUDE.md`, the README, and `package.json` were read, per this cycle's
  read constraints). If Do is tempted to state a specific Node version, it should verify against
  an actual pinned source (e.g., `.nvmrc`, `engines` field) rather than guessing.

## Open Questions

- The README (`projects/ai-command-center/README.md`) already contains a "Development" section
  with `npm install` / `npm run dev` / localhost URL, and a "Scripts" section listing all four
  npm scripts. This substantially already covers "how to run locally." Please confirm: is the
  goal (a) to expand/polish this existing content (e.g., add prerequisites, production-mode run
  steps, or a clearer heading), or (b) something else not yet visible in the README as currently
  read? Do should not invent new scope beyond what you confirm.
- Should Do verify the plan by actually running `npm install && npm run dev` locally, or is a
  static review (reading the file back, confirming section renders correctly, confirming script
  names match `package.json`) sufficient for this docs-only change?

## Non-Goals

- No changes to `package.json`, application source code, or any file other than
  `projects/ai-command-center/README.md`.
- No changes to repo-root `CLAUDE.md` or other subprojects.
- No commits — this Plan step only produces `agents/runs/2026-07-16-readme-run-instructions/plan.md`.
- No historical retro review was performed for this cycle, per the explicit constraint to read
  only the four named files.
