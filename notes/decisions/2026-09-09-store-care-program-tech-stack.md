# Store Care Program v1 Tech Stack

**Date:** 2026-09-09
**Status:** Accepted
**Cycle:** `agents/runs/2026-09-09-store-care-program-tech-stack/`

## Context

Store Care Program is the first real line-of-business application (a *Business Applications*
capability, `docs/capability-map.md`) built under Jula AI OS. Its product scope is fixed by
`notes/product/store-care-program-mvp-definition.md` (Accepted 2026-09-08) and its operational
process by `notes/workflows/store-visit-issue-closure.md` (Accepted 2026-09-08). The phased
plan in `agents/runs/2026-09-08-store-care-program-mvp-definition/plan.md` Part 3 makes the
tech-stack choice "Phase 0" — the last gate before build cycles.

No prior `notes/decisions/` or `notes/architecture/` entry chooses a stack, database, auth
model, or hosting for a persistent application. The only existing stack in the repo is AI
Command Center's (`projects/ai-command-center/package.json`: Next.js 16, React 19, Tailwind
v4; no backend, no auth, `localStorage` only — `notes/architecture/theme-toggling.md`).

The requirements the stack must meet (evaluation criteria EC1–EC10 in the cycle's `plan.md`):
mobile-first responsive web, no native app, no offline; real persistence for 3 entities with
the workflow §4 relationships; a minimal 2-role model (operational read-write, management
read-only), no granular permissions, no store-staff logins; internal pilot quality, smallest
usable vertical slice; data portable / not vendor-locked (manifesto principle 7); standalone,
no CRM/WMS/Automation integration; simple and inspectable by the maintainer; cheap derived
"overdue" queries and back-datable dates; room to add photo storage / a finding checklist /
a report view later; Thai-language capable.

The human answered the decision inputs on 2026-09-09:

- **Data residency:** No legal or policy constraint on where the data lives — the nearest
  reliable region is acceptable.
- **Existing accounts / hosting preference:** A Google Workspace exists. No Vercel, Supabase,
  or other cloud account yet (creating what is needed is fine). No hard avoids.
- **Who maintains the app after build:** The human operates it day-to-day; all changes go
  through PDCA cycles ("Me + Claude Code").
- **Budget tolerance for managed services:** A small monthly cost (a few USD to low tens per
  month) is acceptable for the pilot.
- **UI language:** Thai-only user-facing UI for v1 (hardcoded Thai strings, a Thai-covering
  webfont, no i18n library). Code, schema, and technical documentation remain in English.
- **Auth mechanism:** Google sign-in restricted to the approved Jula Google Workspace domain.

## Decision

The Store Care Program v1 pilot is built as:

1. **Project structure:** a new app at `projects/store-care-program/`, separate from
   `projects/ai-command-center/`. Rationale: the capability map places Business Applications
   in *"Future subfolders of `projects/`"* and keeps them off the Dashboards surface, which is
   deliberately backend-less and auth-less.

2. **Frontend framework:** Next.js App Router + React + Tailwind, matching AI Command Center
   (Next.js 16, React 19, Tailwind v4), with `lucide-react` and the CSS-variable theme
   pattern from `notes/architecture/theme-toggling.md`. Mobile-first via Tailwind responsive
   utilities. The user-facing UI is **Thai-only** for v1: hardcoded Thai strings, a
   Thai-covering webfont (e.g. Noto Sans Thai), and **no i18n library**. Code, identifiers,
   the database schema, and technical documentation are in English. If a bilingual UI is
   needed later, that adds `next-intl` with a Thai/English locale switch and nothing else.

3. **Persistence / database:** managed Postgres via **Supabase** (bundles Postgres + Auth +
   object storage for later photo attachments — collapsing the database, auth, and
   future-attachment concerns into one system), in the nearest region (e.g. Singapore — the
   exact region confirmed against current Supabase availability during the scaffold cycle).
   Fallback, if bundling proves undesirable: **Neon Postgres + Auth.js**. Portability guard:
   the schema is defined in in-repo migrations owned by this project; a documented
   one-command full export (`pg_dump`) exists from the first slice (satisfies manifesto
   principle 7 regardless of provider).

4. **Auth + role enforcement:** mechanism = **Google sign-in restricted to the approved Jula
   Google Workspace domain**, via Supabase Auth's Google provider (or the Auth.js Google
   provider under the Neon fallback). No password store, no email-sending service. If a pilot
   user turns out to be outside the Workspace domain, the mechanism becomes email magic-link
   or a hardcoded pilot user list — **enforcement is unchanged**. Enforcement = a two-value
   `role` attribute (`operational`, `management`) plus a single **server-side** authorization
   guard: `operational` performs every workflow mutation and status transition; `management`
   gets only the read-only cross-store issue view (workflow §1 step 8). No RBAC library, no
   permission matrix, no per-store scoping. Postgres row-level security is an optional
   defense-in-depth layer on top of the app guard, not required for the pilot. The first
   vertical slice exercises only the `operational` path; the schema and guard know both roles
   from the start.

5. **Hosting / deploy:** **Vercel** (Next.js-first, git-push deploy, preview URLs, free/low
   tier sufficient for a pilot) + the managed Postgres from (3) in the nearest region. The
   "Me + Claude Code" maintainer model, acceptance of a small monthly cost, and absence of a
   residency constraint all point here, with no VPS operations burden. Residency note: no
   legal or policy constraint applies (per the human's answer), so the nearest reliable
   region is used for both the Vercel deployment and the Postgres instance.

This is a pilot-scoped decision. It is expected to be revisited if the pilot succeeds and the
app moves toward production (see Consequences).

## Options considered

- **(A) Extend the existing AI Command Center Next.js app** with a backend, database, and
  auth. *Rejected:* couples the *Dashboards* capability (a deliberately static, no-backend,
  no-auth surface — `notes/decisions/2026-09-04-capability-map-ai-command-center-classification.md`)
  with a *Business Applications* capability; adds auth to an app intentionally built without
  it; makes the dashboard's build and deploy heavier. Contradicts the capability-map
  boundary.

- **(B) New `projects/store-care-program/` app with a self-hosted / embedded datastore** —
  SQLite or self-hosted Postgres, library or hand-rolled auth, deployed on a single VPS.
  *Rejected in favour of C:* the human's answers — no data-residency constraint, a maintainer
  who operates the app but routes changes through PDCA cycles and does not want server
  operations, and acceptance of a small monthly managed-service cost — remove every reason to
  take on self-hosting's ongoing burden (provisioning, TLS, OS patching, backups, uptime).

- **(C) New `projects/store-care-program/` app with a managed Postgres + managed auth
  service**, deployed on a Next.js-friendly platform. *Chosen:* the fastest path to real
  persistence, auth, and a 2-role model for a pilot, with the least custom backend code; the
  data stays in standard Postgres so it remains portable via the in-repo schema + documented
  `pg_dump` export. Concretely: `projects/store-care-program/` + Next.js/React/Tailwind +
  Supabase (Postgres + Auth + storage) + Vercel; Neon Postgres + Auth.js is the documented
  fallback if the bundled provider proves undesirable.

- Framework alternatives considered and not chosen: a plain React SPA + separate API (adds a
  second deployable and an API contract for a ~6-screen pilot); a lighter server-rendered
  stack (new learning cost, no offsetting benefit); low-code / no-code platforms (**rejected**
  — data and app logic locked in a proprietary platform, fails manifesto principle 7).

- Database alternatives considered and not chosen: NoSQL / document stores (**rejected** —
  the data is relational; FK-enforced parent rules, filter-by-store, and derived date queries
  are the natural fit for SQL, and proprietary query APIs worsen lock-in). SQLite and
  self-hosted Postgres are viable but rejected here because the residency / maintainer /
  budget answers favour an ops-free managed service.

## What this does NOT decide

- **The database schema** — table and column names, types, indexes, how the back-dated
  activity date and system `created_at` are modelled, and whether an Issue/Action **owner**
  is a login user or a free-typed name (workflow §7 open item). That is the scaffold cycle's
  work, against the workflow doc.
- **The screen inventory and UI design** — which screens exist in the first slice, their
  layout, and the visual design. The MVP plan sketches ~4–6 screens; the scaffold cycle
  confirms them.
- **Photo / attachment storage** — the workflow makes attachments optional in v1. Where blobs
  live (object storage vs. skipped for the first slice) is deferred to the scaffold cycle.
- **A saved-visit-report view and any structured finding checklist** — deferred by the
  workflow doc; not in scope for the stack choice.
- **Store master seed source** — whether the Store list is imported from an existing
  spreadsheet or entered via an "add store" screen (workflow §2 open item). A build-cycle
  question.
- **CI, testing framework, linting, and per-project conventions** for
  `projects/store-care-program/` — set up in the scaffold cycle and documented in its
  `README`, per `CLAUDE.md` ("each subproject sets its own tooling").
- **The delivery date and effort estimate** — re-derived once this decision lands.
- **Any production hardening** — monitoring, backup cadence, multi-user scale, staging
  environments. Pilot scope only.

## Consequences

- A new top-level project folder `projects/store-care-program/` will be created **in the next
  cycle**, becoming the first entry under the *Business Applications* capability and the
  first `projects/` subfolder besides AI Command Center.
- `projects/store-care-program/README.md` will document the chosen stack's build / run / test
  commands (none exist repo-wide, per `CLAUDE.md`).
- A **Supabase** account and a **Vercel** account will be created for the pilot. An estimated
  **$0–low-tens per month** cost is accepted (both have free/hobby tiers that likely cover a
  pilot of this size; a small paid tier is acceptable if needed). Supabase becomes a data
  processor for Store Care Program data; Vercel hosts the application. The in-repo migrations
  + documented `pg_dump` export keep the data portable and the schema vendor-independent.
- The approved **Jula Google Workspace** is used as the identity provider for sign-in, with
  sign-in restricted to that domain. No separate password store or email-sending service is
  introduced for v1.
- The user-facing UI ships in **Thai only** for v1. Code, schema, and technical docs remain
  in English. A bilingual UI, if later needed, is an additive change (`next-intl` + locale
  switch).
- The `projects/ai-command-center/src/data/projects.ts` Store Care Program entry may later be
  updated to reflect that an implementation has started (currently `status: "Idea"`) — a
  separate small cycle, not triggered by this decision alone.
- This decision is pilot-scoped. If the pilot succeeds, a follow-up decision will revisit
  hosting, backups, auth hardening (including whether Supabase's bundled auth should be
  replaced with Auth.js), and scale before any production rollout — recorded as a new
  `notes/decisions/` entry, not an edit to this one (manifesto principle 4).
- `notes/architecture/` may gain a living document describing the Store Care Program
  architecture once it is built (parallel to `theme-toggling.md` and `slug-project-pages.md`).
