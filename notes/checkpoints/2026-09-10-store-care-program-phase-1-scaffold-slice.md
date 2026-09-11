# Checkpoint — Store Care Program: Phase 1 Scaffold + First Vertical Slice (Built, Not Deployed)

**Date:** 2026-09-10

## 1. What was completed

Store Care Program now has all four foundation documents accepted and a **first
vertical slice built to green local checks** — not yet deployed or run against a
live database.

Accepted foundation (unchanged this cycle except the §5 sync below):

- **MVP definition complete** — `notes/product/store-care-program-mvp-definition.md`
  (Accepted 2026-09-08).
- **Canonical operational workflow complete** —
  `notes/workflows/store-visit-issue-closure.md` (Accepted 2026-09-08).
- **Tech-stack decision complete** —
  `notes/decisions/2026-09-09-store-care-program-tech-stack.md` (Accepted 2026-09-09).

This cycle (`agents/runs/2026-09-10-store-care-program-scaffold-slice/`) ran
Plan → human hard-gate answers (A1–A6, B1–B5) → Do → Check → Act, then a
post-review amendment (F1 + F2) → Check → Act.

### Confirmed facts from this cycle

- **First vertical slice scaffold complete** — new separate app at
  `projects/store-care-program/` (Next.js App Router / React 19 / Tailwind v4 /
  `lucide-react` / Supabase client libraries / Noto Sans Thai), config mirrored
  from AI Command Center. Thai-only user-facing UI. Screens for the full slice
  chain: sign-in, store list, add store, store detail, record follow-up, create
  issue, issue detail with status controls + event history, and the read-only
  management view (Active / Overdue / Resolved grouped by store).
- **Schema migrations 0001 and 0002 written** (not applied — see §3):
  - `migrations/0001_init.sql` — enums, five tables (`app_user`, `store`,
    `store_follow_up`, `issue`, `issue_event`), indexes, the
    `auth.users → app_user` trigger, an issue-creation trigger, the
    `is_operational()` helper, the RLS baseline on all five tables, and the
    `v_issue_management` view.
  - `migrations/0002_issue_transition.sql` — the atomic transition function
    (post-review amendment F2).
- **State machine implemented and tested** — `src/lib/issue-status.ts` holds the
  canonical Open / In Progress / Waiting / Resolved / Cancelled lifecycle and its
  allowed transitions; `src/lib/issue-status.test.ts` has 13 unit tests, all
  passing. Check independently re-derived the transition table from the workflow
  doc and confirmed an exact match.
- **Atomic issue transition RPC implemented** — `perform_issue_transition()`
  (migration 0002) validates the current status, validates the requested
  transition, requires the correct reason for resolve / cancel / reopen, updates
  `issue.status` and `resolved_at`, and inserts the matching `issue_event` row in
  a single transaction. `src/app/actions.ts` `transitionIssue()` calls only this
  RPC for status changes; the app-side validator is retained as defence in depth.
- **Local build / lint / tests passing** — `npm run build`, `npm run lint`, and
  `npm test` (13/13) all pass. Local `npm run dev` route probes (with no
  environment configured) return HTTP 200 and render the Thai
  "not configured" fail-safe notice without crashing.
- **Next.js upgraded to 16.3.4** — from `16.2.10` (post-review amendment F1);
  `next` and `eslint-config-next` both at `16.3.4`. `npm audit` reports 0
  vulnerabilities (was 1 critical + 2 high). `projects/ai-command-center`
  dependencies were not changed.
- **MVP §5 synced** — `notes/product/store-care-program-mvp-definition.md` §5
  renamed "Visit / Follow-up" → "Store Follow-up" and adopted the canonical
  hybrid parent rule (Issue/Action always belongs to a Store; Store Follow-up
  link optional). Nothing else in the MVP changed.

### What is explicitly NOT done yet

- **No live Supabase / Vercel deployment yet.**
- **No real Google sign-in yet** (no OAuth client configured, no Workspace domain
  set).
- **Migrations not yet applied to a live database** — `0001_init.sql` and
  `0002_issue_transition.sql` have never been executed; they were written and
  reviewed by hand only.
- **`pg_dump` / restore round-trip not yet verified.**
- Also unverified until a database and auth exist: live RLS behaviour, the
  `security_invoker` view, the `auth.users` trigger firing, `perform_issue_transition`
  runtime behaviour (row lock, RLS under `SECURITY INVOKER`, custom SQLSTATE
  round-trip to the client), real off-domain sign-in rejection, the end-to-end
  slice chain against a real store, and reload persistence.

## 2. Cycle outcome

- **Check verdict: PASS** (initial review was PASS WITH FINDINGS; upgraded to
  PASS after the F1 + F2 amendment was re-verified).
- Findings F1 (Next.js advisory) and F2 (non-atomic status update) are
  **RESOLVED for `store-care-program`**.
- Scope held: Store Care is a separate app; `projects/ai-command-center`
  application code is untouched; no invented Workspace domain, credentials,
  Supabase/Vercel projects, seed data, finding taxonomy, or worked examples.

## 3. Artifacts changed / committed

Committed and pushed this cycle as **`0d5629f` "Build Store Care Program first
vertical slice"** (`origin/main`):

- `notes/product/store-care-program-mvp-definition.md` (§5 sync)
- `projects/store-care-program/` (new app — 47 tracked files, incl. both migrations)
- `agents/runs/2026-09-10-store-care-program-scaffold-slice/` (`plan.md`,
  `changelog.md` + amendment, `review.md` + amendment re-check, `retro.md` +
  amendment retro)

Not committed here: this checkpoint file (shown to the human first).

Two `next dev`-generated files (`projects/store-care-program/AGENTS.md`,
`projects/store-care-program/CLAUDE.md`) were added to that project's
`.gitignore` and deliberately left out of the commit.

## 4. Current git state

`HEAD` = `0d5629f`, pushed to `origin/main`. `projects/ai-command-center` still
pins `next@16.2.10`.

## 5. Carried-forward blockers (hard gates)

These block applying the migrations, all live verification, and any deployment:

- **B2 — exact Google Workspace domain.** The app reads `ALLOWED_EMAIL_DOMAIN`
  with no default and refuses all sign-in until it is set. The human supplies the
  exact string; it must not be invented.
- **B3 — Google OAuth client credentials.** Created / approved by a Workspace or
  Cloud administrator, supplied as environment / Supabase provider config. Never
  created, printed, hardcoded, or committed.
- **C1 — Supabase + Vercel projects / keys.** Needed to apply `0001_init.sql` and
  `0002_issue_transition.sql`, run any live check, and deploy.
- **C2 — deployment region.** For both the Supabase instance and the Vercel
  deployment; confirm against current provider availability.

## 6. Carried-forward OPEN business inputs (non-blocking — must not be fabricated)

- **C3 — primary-user job title** (labels only; a generic Thai role label ships
  now, renamed later).
- **C4 — issue edit / reassignment permissions** beyond "any operational user".
- **C5 — findings shape** (one free-text block vs a list of points; default is
  one block).
- **C7 — target delivery date** (deferred to a separate estimation pass).
- **Q8 — real finding examples** (5–10 real findings from the human; needed
  before any finding structure or category).
- **Q32 — the worked real example** (one real recent end-to-end case; workflow §5
  is a stub until then).

## 7. Other carried-forward items

- **F3–F7 / N1 hardening items** (from Check; non-blocking, for a later pass):
  - **F3** — `migrations/0001` never `REVOKE`s default privileges ("anon gets
    nothing" currently holds via RLS only, not the grant layer).
  - **F4** — no database-level transition-legality enforcement on `issue`
    (operational users trusted — matches plan intent).
  - **F5** — dead `getSiteUrl()` helper.
  - **F6** — `hd`-hint comment vs. code mismatch in the sign-in path.
  - **F7** — `/manage` fetches cancelled rows it then discards; reused
    `error=domain` query param.
  - **N1** — under a non-operational caller, `perform_issue_transition()`'s
    `issue` UPDATE silently no-ops under RLS and the rollback is actually enforced
    by the `issue_event` INSERT check; optional `GET DIAGNOSTICS` / `IF NOT
    FOUND` hardening. Net behaviour is correct today.
- **AI Command Center Next.js upgrade** — `projects/ai-command-center` still pins
  `next@16.2.10` (the version `npm audit` flagged). Bumping it is a **separate
  project cycle** in that project, not part of Store Care Program.
- **Delivery date / effort estimate** — still deferred; a short estimation pass
  can now run against the built slice.
- **`projects/ai-command-center/src/data/projects.ts`** — the Store Care Program
  entry is still `status: "Idea"`; updating it is a small separate cycle.

## 8. Next step

The critical path is unblocking **B2 / B3 / C1 / C2**, then a build cycle that
applies both migrations, verifies RLS / the RPC / the `pg_dump` round-trip / real
auth live, runs the end-to-end slice against a real store, and deploys. The
F3–F7 / N1 hardening pass and the AI Command Center Next.js bump are independent
follow-ups. No PDCA cycle is started by this checkpoint.
