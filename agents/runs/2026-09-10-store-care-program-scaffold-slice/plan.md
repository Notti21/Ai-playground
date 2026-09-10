# Plan — Store Care Program: Scaffold + First Vertical Slice

**Date:** 2026-09-10
**Cycle:** `agents/runs/2026-09-10-store-care-program-scaffold-slice/`
**Status:** Draft plan — awaiting human approval. **Do may not act on this plan until the
human explicitly approves it.**

**Revision (2026-09-10):** the human has **LOCKED** all hard-gate decisions (A1–A6, B1, B3,
B4, B5). This revision folds them in. The only remaining human input before schema work can
proceed is **none** (schema is unblocked); the only remaining input before **auth
configuration** is **B2** (the exact Workspace domain string); the only remaining input before
**deploy/provision** is **C1** (Supabase + Vercel projects + keys) and **B3** (the OAuth
client credentials, a deployment prerequisite). Still PLAN ONLY — no implementation.

## Source documents this plan implements against (required reading — all read)

- `notes/product/store-care-program-mvp-definition.md` — Accepted 2026-09-08 (MVP definition)
- `notes/workflows/store-visit-issue-closure.md` — Accepted 2026-09-08 (**canonical** operational
  workflow; canonical for the parent rule and the "Store Follow-up" name)
- `notes/decisions/2026-09-09-store-care-program-tech-stack.md` — Accepted 2026-09-09 (v1 stack)
- `notes/checkpoints/2026-09-09-store-care-program-tech-stack.md` — latest checkpoint; its §7
  Next Action 1 and §8 open items are the direct inputs to this cycle
- `notes/checkpoints/2026-09-08-store-care-workflow-definition.md`,
  `notes/checkpoints/2026-09-08-store-care-program-mvp-definition.md`
- `agents/runs/2026-09-08-store-care-program-mvp-definition/plan.md` Part 3 (phased plan;
  "Phase 1 — First BUILD slice")
- `CLAUDE.md` working conventions: explain before changing code; keep architecture simple; ask
  before major changes (new deps/frameworks/dirs); never fabricate requirements; document
  decisions in `notes/`. Each subproject sets up and documents its own build/lint/test.
- `notes/architecture/theme-toggling.md` — the CSS-variable theme pattern to reuse.

## Scope check (run by the orchestrator — recorded here)

- `pwd` = `/Users/norapong21/ai-playground/projects/ai-command-center`
- `git rev-parse --show-toplevel` = `/Users/norapong21/ai-playground`
- `projects/` currently contains only `ai-command-center`
- Write test to `projects/store-care-program/` **PASSED** (created, wrote, removed cleanly, no
  residue)
- **CONFIRMED:** the new app is created at `projects/store-care-program/` as a sibling of
  `projects/ai-command-center/`, a separate application. This session can write there. No
  workaround needed.

---

## Locked hard-gate decisions (folded into this revision)

| ID | Locked decision |
|---|---|
| **A1 — Owner identity** | **HYBRID.** `owner_name TEXT NOT NULL` (always present) + `owner_user_id uuid NULL REFERENCES app_user(id)`. Every Issue/Action has a named owner; the owner may be a non-user; link the account when the owner is an app user. Owners are **not** required to have a login in v1. |
| **A2 — MVP/workflow sync** | **YES — Do's Step 1, before any schema work.** Canonical workflow is source of truth. Edit `notes/product/store-care-program-mvp-definition.md` **§5 only**: (1) rename "Visit / Follow-up" → "Store Follow-up"; (2) every Issue/Action belongs to a Store (mandatory); (3) the Store Follow-up link is optional. Change nothing else in the MVP. |
| **A3 — Store seed** | No confirmed source. Include a **minimum Add Store screen** in the slice. Fields only: `name`, `channel`, `location`, `contact`. **No** CSV / import / integration. Bulk seeding is a later cycle. |
| **A4 — `performed_by`** | **Free text** in v1. `created_by` stays a separate `app_user` FK. `performed_by` = who actually did the follow-up; `created_by` = the authenticated user who entered the record; they may differ. |
| **A5 — Issue lifecycle** | **Full canonical v1 lifecycle exposed in the slice UI.** States: Open, In Progress, Waiting, Resolved, Cancelled. Transitions and required text per §Deliverable 3. Management buckets: **Active/Open** = Open + In Progress + Waiting; **Overdue** = derived subset of Active whose `due_date` is past; **Resolved** = Resolved. Cancelled has no dedicated management section this slice but stays visible in the issue record/history. UI stays simple — no workflow designer, no approval flow. |
| **A6 — Transition history** | A small **`issue_event`** table from day one. Records status transitions + actor / reason / time. Not a generic audit framework. The `issue` table still holds the current status. |
| **B1 — Pilot users** | Internal users with the company Google Workspace only. Off-domain users are a later auth decision; the v1 domain restriction is **not** weakened. |
| **B3 — OAuth credentials** | A Workspace / Cloud admin creates / approves the OAuth client; the human coordinates access. Never create, hardcode, print, or commit client secrets — env vars only. Treated as an environment/deployment prerequisite, not a product/schema decision. |
| **B4 — Management role** | Manual DB assignment is acceptable for the first slice. No admin-role-management UI in v1. |
| **B5 — Auth + RLS** | Supabase Auth **confirmed**. Add a **minimal RLS baseline in migration `0001`** (not app-guard-only): unauthenticated → no application data; authenticated approved Workspace users → only what v1 permits; server-side guards still enforce operational vs management behaviour; **no** per-store scoping; **no** complex RBAC. |

**Still genuinely open (do NOT invent):** B2 (exact Workspace domain string — human provides
before auth config); B3 credentials (deployment prerequisite); C1 (Supabase + Vercel projects
+ keys); C2 (region confirmation); C3 (primary-user job title — labels only); C4 (issue edit
permissions beyond "any operational user"); C5 (findings shape — default: one free-text
block); C7 (delivery date). Prior non-blocking business inputs (real finding examples "Q8",
the worked example "Q32") stay OPEN.

---

## Goal

Plan (not build) the creation of the `projects/store-care-program/` application against the
approved v1 stack, plus the first end-to-end vertical slice of exactly this chain:

> **Store → Store Follow-up → Finding → Issue/Action → Owner + Due Date → Status → Resolution**

with a management view that shows **Open / Overdue / Resolved, grouped by store**, and nothing
else. This is Phase 1 of the phased plan, now that Phase 0 (tech stack) is Accepted and the
hard-gate decisions are locked.

---

## Scope

### In scope for this cycle (planning only)

- The exact slice boundary (deliverable 1).
- The app / file structure (deliverable 2).
- The minimum DB schema for the slice, with the locked decisions applied (deliverable 3).
- The owner / user model as locked (deliverable 4).
- The auth / authz + RLS approach as locked (deliverable 5).
- The pages / screens for the slice (deliverable 6).
- The prerequisites still requiring human input before Do can begin (deliverable 7).
- Standard Plan sections: Risks, Rollback, Verification, Non-Goals.

### Explicitly NOT in scope for this cycle

- Writing any code, config, migration, schema file, `package.json`, or README.
- Creating the `projects/store-care-program/` folder.
- Creating Supabase / Vercel / Google Cloud accounts or projects.
- Installing dependencies.
- Editing any doc except (in the Do cycle) the three specified §5 lines of the MVP definition.
- Committing anything (the human commits separately).

---

## Deliverable 1 — The exact first vertical slice boundary

### 1a. What "Finding" means in this chain (prevents over-modelling)

The canonical workflow (`store-visit-issue-closure.md` §2–§3, step 3) states findings are
**free text inside the Store Follow-up's `Notes / findings` field** — *"No structured finding
fields, no categories/taxonomy, no checklist in v1."* Therefore **"Finding" in the slice chain
is not a separate entity or table.** It is the notes text on a Store Follow-up. "A finding
that needs action becomes an Issue/Action" = the operational user reads the notes and creates
an Issue/Action (optionally linked back to that follow-up). Do must not create a `finding`
table.

### 1b. IN the first slice

| Chain link | In-slice behaviour |
|---|---|
| **Store** | Select an existing Store from a list. Store detail screen shows its follow-ups and its issues. **Add Store screen is IN the slice** (A3) — fields `name`, `channel`, `location`, `contact` only. |
| **Store Follow-up** | Create one against a Store: Store, Activity date (back-datable, separate from `created_at`), Follow-up type {In-person visit, Phone, Chat/message, Other}, `performed_by` (free text, A4), Notes/findings (free text). Attachments **not** in the slice. |
| **Finding** | Free text in the follow-up's Notes/findings field (see 1a). No separate record. |
| **Issue/Action** | Create from a follow-up (optional `follow_up_id` link) **or** directly against a Store (link empty — workflow §4 hybrid rule). Fields: description, Store (mandatory), owner (hybrid, A1), due date, status. |
| **Owner + Due Date** | `owner_name` always required; `owner_user_id` optionally linked to an `app_user` (A1). Due date required. |
| **Status** | `issue_status` enum = {open, in_progress, waiting, resolved, cancelled}. **Full canonical lifecycle exposed in the slice UI** (A5). Created as `open`. |
| **Resolution** | Resolution note **required** before an issue can become `resolved` (server action + DB CHECK on the `issue_event` row). Cancel reason required for `cancelled`; reopen reason required for `resolved → in_progress`. |
| **Transition history** | Every status change writes an `issue_event` row (A6): from/to status, actor, timestamp, and the required reason text when applicable. |
| **Management view** | One read-only screen: all Issues/Actions across all stores, **grouped by store**, showing buckets **Active/Open** (open + in_progress + waiting), **Overdue** (derived subset of Active with `due_date < today`), **Resolved**. Cancelled issues are not bucketed here but remain visible on the issue record. "Overdue" is derived, never stored. |
| **Persistence** | All persisted in Supabase Postgres; survives reload. |
| **Auth** | Internal Workspace users sign in with Google (domain-restricted). Only the `operational` path is built end-to-end; the `management` guard + RLS know both roles from day one. |
| **UI** | Thai-only user-facing strings; mobile-first; reuse the CSS-variable theme pattern. |

### 1c. Explicitly DEFERRED (not in the first slice)

- A separate `management`-only login / role-gated navigation as a distinct product surface
  (Phase 2). The `/manage` **view** is built now; a `management` user is assigned manually in
  the DB (B4) and no management-specific onboarding is built.
- Any dedicated **Cancelled** management section (A5) — cancelled issues stay visible on the
  issue record only.
- Photo / attachment upload and storage (Supabase Storage) — deferred entirely.
- Structured finding checklist / categories / taxonomy.
- A saved / formatted visit-report screen.
- Notifications, reminders, escalations, email.
- Analytics, discovery-channel reporting, exports (beyond the `pg_dump` portability export).
- Search / filtering beyond "group by store" on the management view.
- Store-staff logins or any store-facing surface.
- CSV / bulk import / any external store-seeding integration (A3).
- Off-domain / external-user authentication (B1).
- Per-store data scoping in RLS or the app (B5).
- An admin role-management UI (B4).
- CRM / WMS / Automation integration or data sync.
- Offline mode.
- Bilingual UI / any i18n library.
- Scheduled-ahead ("planned but not done") follow-ups; multi-person follow-ups; check-in /
  geolocation / arrival-departure time.
- Production hardening: monitoring, backup cadence, staging environment, scale.
- Updating `projects/ai-command-center/src/data/projects.ts` (separate later cycle).

---

## Deliverable 2 — Proposed app / file structure

A new **separate** app at `projects/store-care-program/` (decision §1), not a change to
`projects/ai-command-center/`. Config pattern mirrors AI Command Center: Next.js 16 App
Router, React 19, TypeScript, Tailwind v4, `lucide-react`, npm + `package-lock.json`,
`eslint-config-next`, the `@theme inline` CSS-variable pattern from
`notes/architecture/theme-toggling.md`. New for this app: a Thai-covering webfont (e.g. Noto
Sans Thai), `@supabase/supabase-js` + `@supabase/ssr`, and a plain-SQL migration workflow.

```
projects/store-care-program/
  README.md                     build / run / test / deploy commands + the pg_dump export
  package.json                  scripts: dev, build, start, lint, db:migrate, db:export
  next.config.ts
  tsconfig.json
  postcss.config.mjs
  eslint.config.mjs
  .gitignore                    ignores .env*.local, .next, node_modules
  .env.example                  every required env var, names only, no secrets
  migrations/
    0001_init.sql               enums + tables + issue_event + indexes + RLS baseline
                                + auth.users -> app_user trigger + management view
  scripts/
    export-db.sh                one-command pg_dump full export (decision's portability guard)
    migrate.mjs                  applies migrations/*.sql in order (thin runner)
  src/
    app/
      layout.tsx                Thai font, theme CSS vars, <html lang="th">
      globals.css               CSS variables + light/dark overrides
      page.tsx                  redirect: signed-in -> /stores, else -> /login
      login/page.tsx            "Sign in with Google" (Thai UI)
      auth/callback/route.ts    OAuth callback: code exchange, domain check, session
      auth/sign-out/route.ts
      stores/page.tsx           store list (operational) + "add store" link
      stores/new/page.tsx       Add Store form: name, channel, location, contact
      stores/[storeId]/page.tsx store detail: info + follow-ups list + issues list
      stores/[storeId]/follow-ups/new/page.tsx    record a Store Follow-up
      issues/new/page.tsx       create Issue/Action (query params: storeId, optional followUpId)
      issues/[issueId]/page.tsx issue detail + full state-machine controls + event history
      manage/page.tsx           management view: Active/Open, Overdue, Resolved, grouped by store
      actions.ts               server actions (all mutations); each calls the auth guard
    components/
      ui/                       Card, SectionHeading, ThemeToggle, form controls (Thai labels)
      layout/TopBar.tsx
      issues/StatusControls.tsx transition buttons + required-reason prompts
    lib/
      supabase/server.ts        SSR Supabase client bound to the request cookies (user JWT)
      supabase/client.ts        browser client (sign-in only)
      auth.ts                   getCurrentUser(), requireOperational(), domain check
      db.ts                     typed query helpers
      issue-status.ts           the state-machine table: allowed transitions + required text
      overdue.ts                the single derived-overdue predicate (queries + UI)
    types/
      domain.ts                 Store, StoreFollowUp, Issue, IssueEvent, IssueStatus, FollowUpType, Role
  public/
```

Migration tooling: **plain `.sql` files** in `migrations/` applied by a thin `scripts/migrate.mjs`
runner (or the Supabase CLI if the human prefers). No ORM, no heavy migration framework.

---

## Deliverable 3 — Final minimum database schema for the slice

Postgres (Supabase). English identifiers (decision §2). `gen_random_uuid()` PKs. All
timestamps `timestamptz`. **This schema is now fully specified — all hard gates are locked, so
schema modelling is unblocked.**

### Enums

| Enum | Values | Source |
|---|---|---|
| `follow_up_type` | `in_person`, `phone`, `chat`, `other` | workflow §2 |
| `issue_status` | `open`, `in_progress`, `waiting`, `resolved`, `cancelled` | workflow §3 (A5) |
| `user_role` | `operational`, `management` | decision §4 |
| `issue_event_reason_kind` | `resolution`, `cancellation`, `reopen` | A6 |

### Table `app_user`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | equals Supabase `auth.users.id` |
| `email` | text NOT NULL UNIQUE | from Google identity |
| `display_name` | text | |
| `role` | `user_role` NOT NULL DEFAULT `'operational'` | `management` set manually in DB (B4) |
| `created_at` | timestamptz NOT NULL DEFAULT now() | |

Populated by a `SECURITY DEFINER` trigger on `auth.users` INSERT (so runtime code never needs
the service-role key — see deliverable 5).

### Table `store`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text NOT NULL | A3 |
| `channel` | text NULL | A3 ("channel / account") |
| `location` | text NULL | A3 |
| `contact` | text NULL | A3 (single free-text field; no invented sub-structure) |
| `created_by` | uuid NOT NULL REFERENCES `app_user(id)` | who added the store |
| `created_at` | timestamptz NOT NULL DEFAULT now() | |

### Table `store_follow_up`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `store_id` | uuid NOT NULL REFERENCES `store(id)` | Store 1 — * follow-up |
| `activity_date` | date NOT NULL | back-datable; **separate from `created_at`** (workflow §2) |
| `follow_up_type` | `follow_up_type` NOT NULL | |
| `performed_by` | text NOT NULL | free text (A4) — who actually did it; default to current user's `display_name` |
| `notes` | text NOT NULL | free-text findings (deliverable 1a) |
| `created_by` | uuid NOT NULL REFERENCES `app_user(id)` | authenticated user who entered the record (A4) — may differ from `performed_by` |
| `created_at` | timestamptz NOT NULL DEFAULT now() | system timestamp |

### Table `issue`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `store_id` | uuid NOT NULL REFERENCES `store(id)` | **mandatory** (workflow §4 hybrid rule) |
| `follow_up_id` | uuid NULL REFERENCES `store_follow_up(id)` | **optional** link |
| `description` | text NOT NULL | |
| `owner_name` | text NOT NULL | **always present** (A1 hybrid) |
| `owner_user_id` | uuid NULL REFERENCES `app_user(id)` | linked when the owner is an app user (A1) |
| `due_date` | date NOT NULL | required for an actionable issue (workflow §2) |
| `status` | `issue_status` NOT NULL DEFAULT `'open'` | **current** status only; history in `issue_event` (A6) |
| `created_by` | uuid NOT NULL REFERENCES `app_user(id)` | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | |
| `resolved_at` | timestamptz NULL | set when status becomes `resolved`, cleared on reopen — convenience for sorting the management view |

Transition text (`resolution_note`, `cancel_reason`, `reopen_reason`) is **not** stored on
`issue` — it lives in `issue_event` as the single source of truth. The management view reads
the latest `issue_event` for display when needed.

### Table `issue_event` (A6)

Records status transitions only — not a generic audit framework. **Chosen shape: a single
`reason` column + a `reason_kind` discriminator** (cleaner than three mostly-null columns;
exactly zero or one reason applies per transition).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `issue_id` | uuid NOT NULL REFERENCES `issue(id)` | |
| `from_status` | `issue_status` NULL | NULL only for the creation event |
| `to_status` | `issue_status` NOT NULL | |
| `reason_kind` | `issue_event_reason_kind` NULL | set for → resolved / → cancelled / reopen |
| `reason` | text NULL | the resolution note / cancel reason / reopen reason |
| `changed_by` | uuid NOT NULL REFERENCES `app_user(id)` | actor |
| `changed_at` | timestamptz NOT NULL DEFAULT now() | |

`CHECK ((reason_kind IS NULL AND reason IS NULL) OR (reason_kind IS NOT NULL AND reason IS NOT
NULL AND length(btrim(reason)) > 0))` — enforces "required text" at the DB level in addition to
the server action. A creation event is written on `INSERT` into `issue` (`from_status` NULL,
`to_status` `open`).

### Management view

`0001_init.sql` defines `v_issue_management`: each issue plus a computed `bucket` —
`resolved` when `status = 'resolved'`; `overdue` when `status IN ('open','in_progress','waiting')
AND due_date < current_date`; `active` when `status IN ('open','in_progress','waiting')` and not
overdue; `cancelled` otherwise (not shown as a section, available for the record view). The
page query groups by `store_id`. The same overdue predicate lives once in `lib/overdue.ts`.

### Indexes

`issue(store_id)`, `issue(status)`, `issue(due_date)`, `issue(owner_user_id)`,
`store_follow_up(store_id)`, `store_follow_up(store_id, activity_date)`,
`issue_event(issue_id, changed_at)`.

### Relationships summary

```
app_user 1 ── * store            (created_by)
app_user 1 ── * store_follow_up   (created_by)
app_user 1 ── * issue             (created_by; and owner_user_id when the owner is a user)
app_user 1 ── * issue_event       (changed_by)
store    1 ── * store_follow_up
store    1 ── * issue             (mandatory)
store_follow_up 1 ── 0..* issue   (optional follow_up_id)
issue    1 ── * issue_event
issue    * ── 1 owner             (owner_name always; owner_user_id optional)
```

---

## Deliverable 4 — Owner / user model (LOCKED — A1 hybrid)

- Every Issue/Action has **`owner_name` (TEXT NOT NULL)** — a human-readable owner, always
  present. The Add/Edit Issue form requires it.
- **`owner_user_id` (uuid NULL, FK `app_user.id`)** — set when the owner is a person who signs
  into the app; left NULL when the owner does not use the app. The form offers picking an
  existing `app_user` (which fills both fields) or typing a free name (fills `owner_name`
  only).
- Owners are **not** required to have a login in v1. `app_user` rows are created automatically
  on first Google sign-in (deliverable 5); there is no manual user-creation screen.
- The slice's management view groups by **store**, not by owner, so `owner_user_id` is not
  used for filtering in the slice — it is captured now so a "my issues" view is a pure
  additive change later.
- `store_follow_up.performed_by` is **free text** (A4), distinct from `created_by` (the
  authenticated entrant). No FK; defaults to the current user's `display_name` in the form.

---

## Deliverable 5 — Authentication + authorization + RLS boundary (LOCKED — B1/B3/B4/B5)

### Authentication

- **Mechanism:** Google sign-in via **Supabase Auth's Google provider** (confirmed, B5),
  restricted to the approved company **Google Workspace domain** (B1). No password store, no
  email-sending service.
- Google OAuth is configured with the `hd` (hosted-domain) hint; because `hd` alone is not a
  hard guarantee, `auth/callback/route.ts` **also** verifies the session email ends in the
  approved domain server-side and rejects anything else (signs the user out + shows a Thai
  "not authorised" message).
- **B2 (still open):** the exact domain string is provided by the human before auth is
  configured. Do must not invent it; until it is provided, the domain check reads it from an
  env var (`ALLOWED_EMAIL_DOMAIN`) with no default.
- **B3 (deployment prerequisite):** the OAuth client ID/secret are created by a Workspace/Cloud
  admin and supplied as env vars / Supabase provider config. Never created, printed, hardcoded,
  or committed by Do.
- On first successful sign-in, a `SECURITY DEFINER` trigger on `auth.users` INSERT creates the
  matching `app_user` row (`id`, `email`, `display_name`) with `role = 'operational'`. Runtime
  app code therefore never needs the service-role key.
- Session: cookie-based via `@supabase/ssr`; server components and server actions read the
  session server-side and use a **user-scoped** Supabase client (anon key + the user's JWT) so
  RLS applies to every query.

### Authorization (server guards)

- **One two-value `role`** on `app_user`: `operational`, `management` (assigned manually in the
  DB for the pilot — B4; no admin UI).
- **One server-side guard** — `requireOperational()` in `lib/auth.ts` — called at the top of
  **every** mutating server action / route handler. `operational` performs every workflow
  mutation and status transition. `management` may load only `/manage` (and issue/record
  read views); every mutation returns 403 for `management`.
- No RBAC library, no permission matrix, **no per-store scoping** (B5).
- The state machine itself is enforced in `lib/issue-status.ts` + the server action: an
  attempted transition not in the allowed set is rejected before any write.

### RLS baseline added by migration `0001` (B5)

RLS is **enabled on all five application tables** (`app_user`, `store`, `store_follow_up`,
`issue`, `issue_event`). Policies express the B5 principle — unauthenticated gets nothing;
authenticated approved Workspace users get exactly what v1 permits; guards still enforce
operational vs management; no per-store scoping; no complex RBAC:

| Table | SELECT | INSERT / UPDATE | DELETE |
|---|---|---|---|
| `app_user` | `auth.uid() IS NOT NULL` (any authenticated user may read the user list — needed to link an owner) | none via the API (rows come from the trigger); `UPDATE` of own `display_name` optional, `role` never client-writable | none |
| `store` | `auth.uid() IS NOT NULL` | only if the caller's `app_user.role = 'operational'` | none |
| `store_follow_up` | `auth.uid() IS NOT NULL` | only if caller is `operational` | none |
| `issue` | `auth.uid() IS NOT NULL` | only if caller is `operational` | none |
| `issue_event` | `auth.uid() IS NOT NULL` | INSERT only if caller is `operational`; no UPDATE/DELETE (history is append-only) | none |

- The "is operational" check is a helper `is_operational()` (`SECURITY DEFINER`, reads
  `app_user` by `auth.uid()`).
- Optional hardening once **B2** is known: add `auth.jwt()->>'email' LIKE '%@' || domain` to
  the SELECT policies as belt-and-braces; the primary domain enforcement remains the callback
  + guard. Flagged, not required for the slice.
- RLS is defence-in-depth; the app guards remain the primary control. The two must agree.

---

## Deliverable 6 — Exact route / screen list for the first slice

| # | Route | Type | Role | Purpose |
|---|---|---|---|---|
| 1 | `/login` | page | public | "Sign in with Google" button; Thai copy. |
| 2 | `/auth/callback` | route handler | — | Code exchange, server-side domain check (env `ALLOWED_EMAIL_DOMAIN`), redirect to `/stores` or sign-out-with-message. |
| 3 | `/auth/sign-out` | route handler | authenticated | Clears the session. |
| 4 | `/` | page | any | Redirect: signed-in → `/stores`, else → `/login`. |
| 5 | `/stores` | page | operational | List existing stores; link into each; "+ เพิ่มร้านค้า" → `/stores/new`. |
| 6 | `/stores/new` | page | operational | **Add Store** form: `name`, `channel`, `location`, `contact` (A3). No import. |
| 7 | `/stores/[storeId]` | page | operational | Store info; list of this store's follow-ups; list of this store's issues with current status; buttons: "record follow-up", "create issue". |
| 8 | `/stores/[storeId]/follow-ups/new` | page | operational | Record a Store Follow-up (store, activity date, type, `performed_by`, notes/findings). On save, offer "create issue from this follow-up". |
| 9 | `/issues/new` | page | operational | Create Issue/Action. Query params `storeId` (required), `followUpId` (optional). Fields: description, owner (pick `app_user` or type a name), due date. Status set to `open`; creation `issue_event` written. |
| 10 | `/issues/[issueId]` | page | operational (read: + management) | Issue detail; **full state-machine controls** (see deliverable 3 / below); required-reason prompts; the `issue_event` history list. |
| 11 | `/manage` | page | any authenticated, **read-only** | Management view: all issues across all stores, **grouped by store**, buckets **Active/Open**, **Overdue**, **Resolved**. No actions. Cancelled not bucketed here. |

~8 screens + 3 route handlers — consistent with the phased plan's "~4–6 simple screens"
sizing once Add Store and the full-lifecycle issue screen are included.

### State-machine mapping (enforced in `lib/issue-status.ts` + `actions.ts`, mirrored by the `issue_event` CHECK)

| From | Allowed to | Required text (`reason_kind` / `reason`) |
|---|---|---|
| *(create)* | `open` | none (creation event) |
| `open` | `in_progress`, `resolved`, `cancelled` | `resolved` → `resolution`; `cancelled` → `cancellation` |
| `in_progress` | `waiting`, `resolved`, `cancelled` | `resolved` → `resolution`; `cancelled` → `cancellation` |
| `waiting` | `in_progress`, `resolved`, `cancelled` | `resolved` → `resolution`; `cancelled` → `cancellation` |
| `resolved` | `in_progress` **(reopen only)** | `reopen` |
| `cancelled` | *(none — terminal)* | — |

- `in_progress ↔ waiting` both directions.
- `resolved → in_progress` is the **only** path out of `resolved`, and only via the reopen
  action with a required `reopen` reason.
- `cancelled` is terminal — no transitions; a recurring matter becomes a new issue.
- On `→ resolved`, set `issue.resolved_at = now()`; on reopen, clear it.
- Enforcement points: (1) `lib/issue-status.ts` allowed-transition table used to render only
  valid buttons; (2) the server action re-checks the transition and the required reason before
  writing; (3) the `issue_event` CHECK constraint guarantees reason text is present when
  `reason_kind` is set; (4) RLS ensures only an `operational` user can INSERT the event / UPDATE
  the issue.

---

## Deliverable 7 — Prerequisites still requiring human input before Do can start

All hard gates (A1–A6, B1, B3, B4, B5) are **LOCKED** — see the table near the top. What
remains:

### Blocks AUTH CONFIGURATION only (not schema, not the rest of the build)

| ID | Item |
|---|---|
| **B2** | The **exact Workspace domain string** (e.g. `example.com`). Human provides before the domain check is configured. Do reads it from `ALLOWED_EMAIL_DOMAIN` with **no default** until then. |

### Blocks DEPLOY / PROVISION only (not schema modelling, not local build)

| ID | Item |
|---|---|
| **B3** | The **Google OAuth client ID / secret**, created by a Workspace/Cloud admin; supplied as env vars / Supabase provider config. Never created or committed by Do. |
| **C1** | Human creates the **Supabase** and **Vercel** projects (or authorises it) and shares the project URL + anon key (and, for migrations only, a service/DB connection string) as secrets. |
| **C2** | Confirm the **nearest Supabase + Vercel region** (Singapore expected; verify current availability — tech-stack checkpoint §8). |

### Non-blocking (build proceeds with a stated default; confirm at leisure)

| ID | Item | Slice default |
|---|---|---|
| **C3** | Primary-user job title (MVP O1) | Generic Thai role label; renamed later. |
| **C4** | Issue edit / reassignment permissions beyond "any `operational` user" (workflow §7.6) | Any `operational` user may edit any issue. |
| **C5** | Findings shape (workflow §7.8) | One free-text block. |
| **C7** | Target delivery date (MVP O8) | Deferred to a separate estimation pass. |
| — | Real finding examples ("Q8"), the worked example ("Q32") | Stay OPEN; nothing fabricated. |

**Explicit statement:** **schema modelling is unblocked** — deliverable 3 is fully specified.
**Authentication configuration** is blocked only on **B2**. **Deployment** is blocked on
**B3 + C1** (and C2 for region choice). No other item blocks starting the Do cycle.

---

## Steps (for the eventual Do cycle, in order — not executed now)

1. **MVP §5 sync edit (A2) — FIRST, before any schema work.** Edit
   `notes/product/store-care-program-mvp-definition.md` **§5 only**: (a) rename "Visit /
   Follow-up" → "Store Follow-up" throughout §5; (b) state every Issue/Action belongs to a
   Store (mandatory); (c) state the Store Follow-up link is optional; remove the now-resolved
   `[OPEN]` note on the parent rule. Nothing else in the MVP changes. (Small; could also be a
   standalone micro-commit.)
2. **Scaffold `projects/store-care-program/`** — config mirrored from AI Command Center
   (Next 16 / React 19 / TS / Tailwind v4 / lucide-react / eslint), Thai webfont, theme
   CSS-variable pattern, `<html lang="th">`, Thai string constants, `.env.example`,
   `.gitignore`. No business logic yet. `README.md` with build / run / test / deploy commands
   and the `pg_dump` export procedure (CLAUDE.md: each subproject documents its own tooling).
3. **Write `migrations/0001_init.sql`** — enums; `app_user`, `store`, `store_follow_up`,
   `issue`, `issue_event`; indexes; the `v_issue_management` view; the `auth.users → app_user`
   `SECURITY DEFINER` trigger; `is_operational()` helper; **RLS enabled + the deliverable-5
   baseline policies**; the `issue_event` CHECK. Write `scripts/migrate.mjs` and
   `scripts/export-db.sh`, and **exercise the `pg_dump` export** (decision's portability guard
   — part of Definition of Done). *(Can be authored and applied to a local/dev Postgres before
   C1; re-applied to the Supabase project once provisioned.)*
4. **Provision** (needs C1/C2, and B2/B3 for auth): create the Supabase project (verified
   region), the Vercel project; configure the Google provider with the admin-supplied OAuth
   client; set env vars locally and in Vercel (`ALLOWED_EMAIL_DOMAIN`, Supabase URL/keys);
   never commit secrets. Apply `0001` to Supabase.
5. **Data + auth layer** — `lib/supabase/*` (user-scoped client), `lib/auth.ts`
   (`getCurrentUser`, `requireOperational`, server-side domain check), `lib/db.ts`,
   `lib/issue-status.ts` (transition table), `lib/overdue.ts`, `types/domain.ts`.
6. **Build operational screens 5–10** (deliverable 6), Thai UI, mobile-first; server actions in
   `actions.ts` each calling `requireOperational()`; enforce the state machine + required
   reason text; write an `issue_event` row on every status change.
7. **Build `/manage`** (screen 11) — read-only, grouped by store, buckets Active/Open /
   Overdue / Resolved.
8. **Deploy to Vercel**; run the verification checklist below on a phone against a real store;
   confirm reload persistence; confirm the `pg_dump` export restores.
9. **Write** the cycle's `changelog.md`, `review.md`, `retro.md`; draft a checkpoint. Leave the
   `projects.ts` status update and the delivery-date estimate to their own later cycles.

---

## Risks

- **R1 — B2 domain string wrong or late.** A wrong `ALLOWED_EMAIL_DOMAIN` locks everyone out or
  admits outsiders. *Mitigation:* no default value; auth is configured only after the human
  confirms the exact string; the callback test (below) exercises both a domain and a
  non-domain account.
- **R2 — RLS vs app-guard divergence / self-lockout.** An over-tight RLS policy can make the
  app unusable even for `operational`; `SECURITY DEFINER` helpers can leak if written loosely.
  *Mitigation:* keep policies to the small deliverable-5 table; test every screen as
  `operational` and as `management` on a fresh DB; `is_operational()` reads only `auth.uid()`'s
  own row.
- **R3 — Trigger-created `app_user` race / failure.** If the `auth.users` trigger fails, a
  signed-in user has no `app_user` row and every RLS write check fails. *Mitigation:* trigger
  is `SECURITY DEFINER` and idempotent (`ON CONFLICT DO NOTHING`); `getCurrentUser()` fails
  loudly with a Thai error if the row is missing.
- **R4 — Stack compatibility.** `@supabase/ssr` + Next.js 16 / React 19 cookie/session
  handling, and Tailwind v4 in a second project, need a quick check at scaffold time.
  *Mitigation:* verify in Step 2 before building screens; the Neon + Auth.js fallback exists
  but is a larger change and is explicitly not preferred (B5).
- **R5 — Scope creep.** A "my issues" view, per-store scoping, a Cancelled management section,
  attachments, a saved report, CSV import, an admin role UI — each is individually small and
  tempting. *Mitigation:* deliverable 1c + Non-Goals are the checklist; the locked decisions
  are the boundary.
- **R6 — "Finding" modelled as an entity.** *Mitigation:* deliverable 1a states it is free
  text on the follow-up; no `finding` table.
- **R7 — Portability guard skipped under time pressure.** *Mitigation:* the `pg_dump` export is
  in the Definition of Done (Steps 3 and 8).
- **R8 — Secrets in the repo.** OAuth client secret, Supabase keys. *Mitigation:* `.env*.local`
  gitignored; `.env.example` names only; secrets live in Vercel / Supabase config; the
  migration connection string is used only by `scripts/migrate.mjs`, never imported by app
  code.
- **R9 — Region latency.** Thailand → Singapore round-trips on a mobile connection in-store.
  *Mitigation:* server-rendered pages, minimal client JS; acceptable for a pilot; revisit in
  the production-readiness decision.
- **R10 — Thai webfont bundle size / rendering.** *Mitigation:* subset the font;
  `font-display: swap`.
- **R11 — `issue_event` append-only assumption.** If a correction is ever needed, there is no
  edit path by design. *Mitigation:* acceptable for a pilot; a correction is a new event; note
  in the README.

## Rollback

- The work is **purely additive**: one new folder `projects/store-care-program/`, plus the
  three-line §5 edit to the MVP definition in Step 1 (independently revertable). No other file
  in the repo is modified. There is no repo-root build, lockfile, or shared dependency.
- **Repo rollback:** delete `projects/store-care-program/`, revert the cycle's commits, revert
  the Step 1 doc edit. AI Command Center is untouched.
- **Infra rollback:** delete the Supabase project (pilot data only; keep a `pg_dump` snapshot
  if wanted), delete the Vercel project, disable/delete the Google OAuth client. No shared
  account is affected.
- **Migrations** are forward-only for the pilot; schema "rollback" = drop schema / delete the
  Supabase project. A `down` migration is not required for a pilot.

## Verification (for the eventual Do cycle)

- `npm run build` and `npm run lint` pass in `projects/store-care-program/`.
- `migrations/0001_init.sql` applies cleanly to a fresh Postgres, including enabling RLS and
  creating the trigger, helper, policies, view, and CHECK.
- `scripts/export-db.sh` produces a dump that restores into a clean database (portability
  guard).
- **Auth:** a Workspace-domain Google account signs in and lands on `/stores`; a non-domain
  Google account is rejected at the callback with the Thai message.
- **Authorization + RLS:** an `app_user` manually set to `management` can load `/manage` and an
  issue record but every mutating action returns 403; direct API writes as `management` are
  refused by RLS; unauthenticated requests get no data.
- **End-to-end chain on a phone, against a real store:**
  add a store (name/channel/location/contact) → select it → record a Store Follow-up with a
  back-dated activity date and a `performed_by` different from the signed-in user → create an
  Issue/Action from that follow-up with an owner typed as a free name (no `owner_user_id`) and
  a due date (status `open`, creation event written) → move `open → in_progress → waiting →
  in_progress → resolved`, confirming a resolution note is required at `→ resolved` → the issue
  shows under **Resolved** in `/manage`, grouped under its store, and its `issue_event` history
  lists every transition with actor and timestamp.
- A second issue created directly against a store (no follow-up), owner linked to an
  `app_user`, with a past `due_date`, left `open` → shows under **Overdue** in `/manage`;
  cancelling it (cancel reason required) removes it from all `/manage` buckets but it remains
  visible on its issue record.
- Reopen a resolved issue (reopen reason required) → it returns to **Active/Open**,
  `resolved_at` cleared.
- Reload the app — all records and history persist.

## Open Questions

Restated as the single list Do needs (all hard gates are LOCKED):

1. **B2** — the exact Workspace domain string. *Blocks auth configuration only.*
2. **B3** — the Google OAuth client ID/secret (admin-created). *Blocks deploy only.*
3. **C1** — Supabase + Vercel projects created and keys shared. *Blocks deploy/provision only.*
4. **C2** — nearest Supabase + Vercel region confirmed. *Blocks provision only.*
5. **C3** — primary-user job title. *Non-blocking; label only.*
6. **C4** — issue edit permissions beyond "any operational user". *Non-blocking; default stated.*
7. **C5** — findings shape (one block vs list). *Non-blocking; default: one free-text block.*
8. **C7** — target delivery date. *Non-blocking; separate estimation pass.*
9. Real finding examples ("Q8") and the worked example ("Q32"). *Non-blocking; stay OPEN.*

## Non-Goals

Do must not, in the slice cycle:

- Modify `projects/ai-command-center/` or any other existing project, or edit any doc other
  than the three specified §5 lines of `store-care-program-mvp-definition.md`.
- Create a `finding` table or any structured finding fields / categories / checklist.
- Build a separate `management`-only product surface / role-gated navigation, or an admin
  role-management UI (Phase 2 / B4).
- Add a dedicated Cancelled section to the management view (A5).
- Build attachment / photo upload or wire Supabase Storage.
- Build a saved / formatted visit-report screen.
- Add notifications, reminders, escalations, or any email-sending.
- Add analytics, discovery-channel reporting, dashboards, or exports beyond the `pg_dump`
  portability export.
- Add search or filtering beyond "group by store" on `/manage`, or a per-owner view.
- Add CSV / bulk import or any external store-seeding integration (A3).
- Add off-domain / external-user authentication (B1).
- Add per-store data scoping in RLS or the app, an RBAC library, or a permission matrix (B5).
- Turn `issue_event` into a generic audit/history framework (A6).
- Add an approval flow or a workflow designer (A5).
- Add an i18n library or any English-facing UI (Thai-only for v1).
- Add store-staff logins or any store-facing surface.
- Touch CRM / WMS / Automation code or data.
- Add offline support / a service worker.
- Build scheduled-ahead follow-ups, multi-person follow-ups, or check-in / geolocation.
- Do production hardening: monitoring, backup automation, a staging environment, load/scale
  work.
- Create, print, hardcode, or commit any OAuth client secret or Supabase service key (B3).
- Invent the Workspace domain string (B2) or any still-open C item.
- Commit an updated `projects/ai-command-center/src/data/projects.ts` entry, or a
  delivery-date commitment (separate later cycles).

---

## Approval gate

**Do may not act on this plan until the human explicitly approves it.** Once approved: schema
modelling (Step 3) may proceed immediately; auth configuration waits on **B2**; deployment
waits on **B3 + C1** (and **C2** for the region).
