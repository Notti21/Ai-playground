# Plan: Make AI Command Center README fully self-sufficient for first-time local setup

## Goal

Rewrite/extend `projects/ai-command-center/README.md` so a first-time reader can go from a fresh
clone of this monorepo to a running local dev instance of the AI Command Center using only what's
written in the README — with no missing steps (prerequisites, install, run, verify-it-worked) and
nothing inaccurate relative to the actual project (`package.json` scripts, configs, env usage).

## Scope

**In scope (this cycle):**
- The full content of `projects/ai-command-center/README.md` — not just the existing
  "Development"/"Scripts" sections (unlike the earlier smoke-test plan in
  `agents/runs/2026-07-16-readme-run-instructions/plan.md`, which is out of scope for this cycle
  and should not be reused).
- Adding any missing prerequisite/verification information Do can source from real, checkable
  project artifacts (`package.json`, `node_modules/*/package.json` engine fields, lockfiles,
  config files, `src/` source for env-var usage).
- Documenting the Node.js `>=20.9.0` requirement in the README's prose only (see Step 3) — this is
  a documentation-only addition, not an application-config change.
- Do performing the actual edit and, since Do has broader tool access than Plan, actually running
  the documented steps for real (`npm install`, `npm run dev`, hitting `localhost:3000` and
  observing what renders, `npm run build`, `npm run lint`) to confirm the README's instructions
  work as written before considering the cycle done. This is confirmed, non-destructive,
  project-local verification work — no further confirmation is needed before Do executes these
  commands.
- Keeping the README narrowly scoped to "how to run this one app" — no added cross-reference back
  to the ai-playground monorepo root.

**Out of scope (this cycle):**
- Changing application behavior, `package.json` scripts, or any source file under `src/` — Do
  documents how the app runs, not how it behaves. If Do discovers something in `package.json`/
  config that is actually wrong or missing in a way that blocks a new user (e.g., a required env
  var that's undocumented, a script that fails), Do should flag it back rather than silently fixing
  application code.
- Changes to repo-root `README.md`, `CLAUDE.md`, or other subprojects.
- Adding a Node version pin (`.nvmrc`/`engines` field) to this project's own `package.json`. This
  has been explicitly decided as out of scope for this cycle: the Node `>=20.9.0` requirement is
  documented in the README's prose only. Do must not touch `package.json`, add `.nvmrc`, or add an
  `engines` field — this stays strictly documentation-only this cycle.
- Adding any cross-reference from `projects/ai-command-center/README.md` back to the ai-playground
  monorepo root (e.g., a pointer to root `CLAUDE.md`/`notes/`). This has been explicitly decided:
  the README stays narrowly scoped to running this one app.

## Steps (for Do)

1. Re-read `projects/ai-command-center/README.md` in full and treat every existing section as
   provisional — verify it, don't assume it's already correct.

2. **Add an explicit "clone" step.** The README currently starts at `npm install`, which silently
   assumes the reader is already inside `projects/ai-command-center/`. Since this is a subproject
   in a monorepo (root `README.md` is currently empty, so it provides no navigation), add a first
   step showing:
   ```bash
   git clone https://github.com/Notti21/Ai-playground.git
   cd Ai-playground/projects/ai-command-center
   ```
   (Confirm the clone URL against `git remote -v` at edit time in case it has changed.)

3. **Add a "Prerequisites" section documenting the Node.js requirement, in prose only.** This
   project's own `package.json` has no `engines` field and there's no `.nvmrc`, so the README
   currently states no Node version at all. The installed `next` package
   (`node_modules/next/package.json`) declares `"engines": { "node": ">=20.9.0" }` for the pinned
   version (`next@16.2.10`) — this is a real, verifiable constraint, not an invented one. Do should:
   - State the Node.js >=20.9.0 requirement in the README's text, sourced from `next`'s own
     `engines` field (re-verify at edit time in case the lockfile has changed since this plan was
     written).
   - Note npm as the package manager (confirmed by presence of `package-lock.json` and absence of
     `yarn.lock`/`pnpm-lock.yaml`), and note whatever npm version ships with that Node baseline if
     worth mentioning, or omit an npm version if it's not a real constraint.
   - Do NOT add a `.nvmrc` file or an `engines` field to `projects/ai-command-center/package.json`
     — this requirement is documented in the README only, per the confirmed decision above.

4. **Confirm and document (or explicitly rule out) environment variables.** A search of `src/` for
   `process.env` usage found no matches — there is no `.env` file or example checked in either. Do
   should re-verify this at edit time (source may have changed) and either:
   - Add a one-line note confirming "no environment variables are required to run this locally", or
   - If Do's re-check finds env vars now in use that aren't documented, stop and flag it rather
     than inventing values.

5. **Keep the install/run steps, verified against `package.json`'s `scripts` block**
   (`dev` → `next dev`, `build` → `next build`, `start` → `next start`, `lint` → `eslint`) — these
   already match the README's existing "Scripts" list; Do should re-confirm they still match at
   edit time and keep this list as the single source of truth for command reference rather than
   duplicating descriptions in two places.

6. **Add a concrete "verify it worked" step.** The README currently only says "Open
   http://localhost:3000" with no indication of what a first-time reader should actually see to
   confirm success. Do should actually run `npm run dev` locally, load the page, and add a brief,
   accurate description of what renders (e.g., naming the actual visible sections/headings from
   `src/components/sections/*` and `src/app/page.tsx`) — based on real observed output, not
   inference from source alone — so a reader can positively confirm the app is working versus
   seeing a blank page or error.

7. **Optionally document the production-mode path** (`npm run build` + `npm run start`) as an
   alternate local verification path, consistent with the existing "Scripts" list, if Do judges it
   adds value without bloating the README — this is a nice-to-have, not required for the goal.

8. **Actually verify the finished README works end-to-end** before considering the cycle done: run
   `npm install`, `npm run dev` (confirm the page loads and matches the written description),
   `npm run build`, and `npm run lint` in `projects/ai-command-center/`, exactly as a first-time
   reader following the README would, and observe real output/results for each (not just reason
   about expected behavior). Fix the README (not the app) if any documented step doesn't match
   reality. Do has standing tool access and confirmed approval to run these commands as part of
   this cycle's verification work; no extra confirmation is needed for this project-local,
   non-destructive verification.

9. Save changes to `projects/ai-command-center/README.md` only. No other files touched, no commits
   unless separately requested.

## Risks

- **Overall risk: low.** This remains a docs-only change to a single README in an isolated project
  directory; no shared tooling, dependencies, or other subprojects are touched.
- **Staleness risk:** the Node engine requirement (`>=20.9.0`) and the "no env vars" finding were
  both derived by Plan reading the current `node_modules/next/package.json` and `src/` at planning
  time. If dependencies are upgraded or new source files added before Do executes, Do must
  re-verify these facts rather than trusting this plan blindly.
- **Documentation-only tension:** documenting a Node version constraint that isn't enforced
  anywhere in the project's own config (no `.nvmrc`/`engines` field) means a reader on an older
  Node version who skims past the README's prose could still hit npm's install-time engine
  warnings unprepared. This is an accepted tradeoff for this cycle per the confirmed decision to
  keep this strictly documentation-only; Do should not resolve this by adding config.
- **Verification execution risk:** Step 8 requires actually running `npm install`/`npm run dev`/
  `npm run build`/`npm run lint` locally and observing real output. This is non-destructive and
  scoped to a single subproject directory. If any command fails or behaves unexpectedly, Do should
  fix the README to match reality (not the app) and, if the issue looks like a real application bug
  rather than a docs gap, flag it back rather than editing application code.

## Open Questions

None remaining — the three questions raised in the prior version of this plan have been answered
by the user and folded into Scope/Steps/Non-Goals above:
1. Node version pin: documentation-only in the README; no `package.json`/`.nvmrc`/`engines` changes
   this cycle.
2. Verification method: Do should actually run `npm install`/`npm run dev`/`npm run build`/
   `npm run lint` for real and observe actual output, including what renders at `localhost:3000`.
3. Monorepo cross-reference: not added — the README stays narrowly scoped to running this one app.

## Non-Goals

- No changes to `package.json`, `.nvmrc`/`engines` fields, `next.config.ts`, `eslint.config.mjs`,
  `tsconfig.json`, or any file under `src/` — this cycle only touches
  `projects/ai-command-center/README.md`.
- No changes to the repo-root `README.md` or `CLAUDE.md`.
- No cross-reference added from the README back to the ai-playground monorepo root.
- No commits — this Plan step only produces
  `agents/runs/2026-07-20-ai-command-center-readme-onboarding/plan.md`.
- Not reusing or modifying `agents/runs/2026-07-16-readme-run-instructions/plan.md` — that folder
  is a smoke-test artifact only and is left untouched.
</content>
