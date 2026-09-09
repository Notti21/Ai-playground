# Change Log — Store Care Program: Tech-Stack Decision (Phase 0)

**Cycle:** `agents/runs/2026-09-09-store-care-program-tech-stack/`
**Date:** 2026-09-09
**Plan:** `plan.md` — evaluation criteria, five separable sub-decisions with options, a
finalized recommendation (after the human answered 4 of 6 Open Questions), and a filled draft
decision record. The human then confirmed the two provisional items and approved
("Go with the recommended defaults, proceed to Do").
**Status:** Implemented (decision record only), not committed.

## What this cycle is

A decision cycle. Per the plan and the human's instruction: no application code, no scaffold,
no `projects/store-care-program/` folder, no `package.json`, no dependency install, no account
creation. Do writes the decision record and nothing else.

## Human's confirmed inputs (2026-09-09)

- Data residency: no constraint — nearest reliable region.
- Existing accounts: a Google Workspace exists; no Vercel/Supabase/other cloud account yet.
- Maintainer: "Me + Claude Code" — human operates it, changes go through PDCA cycles.
- Budget: small monthly cost acceptable (a few USD to low tens/month).
- **UI language (confirmed):** Thai-only user-facing UI for v1; code, schema, and technical
  documentation remain English.
- **Auth mechanism (confirmed):** Google sign-in restricted to the approved Jula Google
  Workspace domain.
- 2-role authorization model with server-side enforcement: kept.

## Changes made

### 1. Added `notes/decisions/2026-09-09-store-care-program-tech-stack.md`

New decision record, Status: Accepted, written verbatim from the finalized draft in `plan.md`
with the two provisional spans replaced by the human's confirmed choices (Thai-only UI /
domain-restricted Google sign-in). Format mirrors
`notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md` (Date, Status,
Cycle, Context, Decision, Options considered, What this does NOT decide, Consequences), plus a
final "Open items flagged for the scaffold cycle" section.

The decision, in five parts:

1. **Structure** — new app at `projects/store-care-program/` (not extending AI Command
   Center; capability-map boundary).
2. **Framework** — Next.js App Router + React + Tailwind (matching AI Command Center),
   `lucide-react`, CSS-variable theme pattern. Thai-only UI: hardcoded Thai strings, Thai
   webfont, no i18n library; code/schema/docs in English.
3. **Database** — managed Postgres via Supabase (Postgres + Auth + storage), nearest region;
   fallback Neon + Auth.js. Portability guard: in-repo migrations + documented `pg_dump`
   export from the first slice.
4. **Auth** — domain-restricted Google sign-in via Supabase Auth (or Auth.js under the Neon
   fallback); a pilot user outside the Workspace switches to magic-link or a hardcoded list,
   enforcement unchanged. Enforcement: 2-value `role` {operational, management} + one
   server-side guard, no RBAC, no per-store scoping. First slice = operational path only;
   schema + guard know both roles.
5. **Hosting** — Vercel + the managed Postgres, nearest region, no VPS ops.

Options A (extend AI Command Center) rejected; B (self-hosted) rejected in favour of C; C
(new folder + managed Postgres + managed auth + platform deploy) chosen.

### 2. No other files changed

- No `projects/**`, no code, no scaffold, no folder, no `package.json`, no install.
- No edits to `notes/product/store-care-program-mvp-definition.md`,
  `notes/workflows/store-visit-issue-closure.md`, `docs/capability-map.md`,
  `docs/business-os-manifesto.md`, `projects/ai-command-center/**`, or any existing decision
  record.
- No account created, nothing provisioned or deployed.

## Verification

- `git status --short` shows only: the new `notes/decisions/2026-09-09-store-care-program-tech-stack.md`
  and the untracked run folder.
- The decision record's Decision points 1–5 match the finalized recommendation in `plan.md`
  section-for-section; the two provisional spans are replaced with the confirmed choices
  (Thai-only UI, domain-restricted Google sign-in) and nothing else changed.
- Status: Accepted; Date: 2026-09-09; Cycle reference correct; format matches the existing
  decision records.
- No application code, no schema, no scaffold, no commit.

## git status --short

```
?? agents/runs/2026-09-09-store-care-program-tech-stack/
?? notes/decisions/2026-09-09-store-care-program-tech-stack.md
```

## Not done (per plan / human instruction)

- No commit, no push.
- No application code, no `projects/store-care-program/` folder, no scaffold, no install.
- No Supabase / Vercel account creation or provisioning.
- No database schema or screen inventory — the scaffold cycle's job.
- No MVP §5 sync edit (separate pending Next Action).

## Post-review amendment (2026-09-09, human-directed)

Check note 1 flagged that the decision record carried a sixth section, "Open items flagged for
the scaffold cycle", not in the approved draft. The human reviewed the four bullets, classified
all four as transient (implementation prerequisites / operational inputs / a verification task
— none an unresolved architecture decision), and directed:

- **`notes/decisions/2026-09-09-store-care-program-tech-stack.md`** — the "Open items flagged
  for the scaffold cycle" section removed. The record now ends on the Consequences section and
  contains only settled architecture decisions. **No accepted architecture decision changed.**
- **`notes/checkpoints/2026-09-09-store-care-program-tech-stack.md`** — new section 8, "Open
  items / prerequisites for the scaffold cycle", holding the four items verbatim with a
  provenance note. Section 5 note 1 updated to record the resolution.

`git diff` for this amendment touches only those two files. Nothing else. No commit.
