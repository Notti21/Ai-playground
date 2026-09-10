# Change Log — Store Care Program: Scaffold + First Vertical Slice

**Cycle:** `agents/runs/2026-09-10-store-care-program-scaffold-slice/`
**Do run:** 2026-09-10
**Plan:** `plan.md` in this folder (approved by the human; hard-gate decisions
A1–A6 / B1–B5 locked in the approval message).

Not committed. No deployment. No Supabase / Vercel / Google Cloud project created.

---

## Step 1 — MVP §5 ↔ workflow §4 sync edit (plan Step 1, A2)

**File:** `notes/product/store-care-program-mvp-definition.md` (§5 only).

- Renamed the entity **"Visit / Follow-up" → "Store Follow-up"** in §5.
- Rewrote the Issue/Action line and the Relationships paragraph to state the
  **hybrid parent rule**: an Issue/Action **always belongs to exactly one Store
  (mandatory)** and **may optionally link to one Store Follow-up**.
- Replaced the now-resolved `[OPEN]` note ("Whether an Issue/Action can exist
  without a parent Visit/Follow-up") with a `[CONFIRMED — synced from workflow §4,
  2026-09-10]` note.
- Nothing else in the MVP changed. The second `[OPEN]` note (permitted `status`
  values) was left as-is — resolving it was not in the approved edit scope.

## Step 2 — Scaffold `projects/store-care-program/` (plan Step 2)

A new **separate** app, sibling of `projects/ai-command-center/`. Scope check
recorded in the plan: `pwd` = `.../projects/ai-command-center`, repo root
`/Users/norapong21/ai-playground`, write-test to the sibling path passed.

Config mirrored from AI Command Center:

- `package.json` — Next.js `16.2.10`, React `19.2.4`, Tailwind v4, `lucide-react`,
  `eslint-config-next`, npm + `package-lock.json`. Scripts: `dev`, `build`,
  `start`, `lint`, `test` (`node --test`), `db:migrate`, `db:export`.
- Added dependencies: `@supabase/ssr`, `@supabase/supabase-js` (data + auth);
  `pg` + `@types/pg` (dev — migration runner only, never imported by app code).
- `next.config.ts`, `tsconfig.json` (with `@/*` path), `postcss.config.mjs`,
  `eslint.config.mjs` (also ignores `scripts/`), `.gitignore` (ignores
  `.env*.local`, `.next`, `node_modules`, `db-exports/`), `.env.example`
  (variable **names only**, documents the B2/B3/C1/C2 gaps).
- `README.md` — stack, every command, the env table with pending prerequisites,
  the database/migration/`pg_dump` procedure, model notes, and the open
  prerequisites list (CLAUDE.md: each subproject documents its own tooling).
- `src/app/layout.tsx` — `<html lang="th">`, Noto Sans Thai webfont via
  `next/font/google` (`display: "swap"`), `export const dynamic = "force-dynamic"`
  (every page is per-user and auth-gated; also avoids a stale build-time
  prerender once real env is set).
- `src/app/globals.css` — the `@theme inline` CSS-variable pattern from
  `notes/architecture/theme-toggling.md`, light + `prefers-color-scheme: dark`
  palettes. **Deviation from the plan's component list:** no manual
  `ThemeToggle` / localStorage pre-paint script — `prefers-color-scheme` only.
  Kept the slice smaller; a toggle is a pure additive change later.
- `src/lib/th.ts` — all Thai user-facing strings + enum label maps in one module.

## Step 3 — `migrations/0001_init.sql` + scripts (plan Step 3)

**`migrations/0001_init.sql`** — the whole first-slice schema:

- `create extension if not exists pgcrypto` (portability for `gen_random_uuid()`).
- Enums: `follow_up_type`, `issue_status` (all 5 canonical values),
  `user_role`, `issue_event_reason_kind` (`resolution` | `cancellation` | `reopen`).
- Tables: `app_user`, `store`, `store_follow_up`, `issue`, `issue_event`
  (exactly the plan's Deliverable 3 columns + FKs).
- `issue_event` CHECK: `(reason_kind IS NULL AND reason IS NULL) OR (reason_kind
  IS NOT NULL AND reason IS NOT NULL AND length(btrim(reason)) > 0)`.
- Trigger `on_issue_created` → `handle_new_issue()` writes the creation event
  (`NULL → open`) automatically. (Plan wording "a creation event is written on
  INSERT into issue" → implemented as a trigger so it is atomic and reason-free.)
- Trigger `on_auth_user_created` → `handle_new_user()` (`SECURITY DEFINER`,
  `search_path = ''`, `ON CONFLICT DO NOTHING`) creates the `app_user` row on
  first sign-in with `role = 'operational'`. Runtime code never needs the
  service-role key.
- `is_operational()` — `SECURITY DEFINER`, `STABLE`, reads only `auth.uid()`'s
  own row.
- Indexes: the 7 from the plan.
- **RLS baseline** enabled on all 5 tables; policies exactly per plan Deliverable
  5 (SELECT = any authenticated; INSERT/UPDATE on `store` / `store_follow_up` /
  `issue` = `is_operational()`; `issue_event` INSERT-only for operational; no
  DELETE anywhere; `app_user.role` never client-writable; no per-store scoping).
- `v_issue_management` view (`security_invoker = on`) with the computed `bucket`
  (`resolved` / `cancelled` / `overdue` / `active`).
- Explicit `GRANT`s to `authenticated` (RLS still gates rows; `anon` gets
  nothing) so the migration is also correct on a plain Postgres.
- No `BEGIN/COMMIT` in the file — `scripts/migrate.mjs` wraps each file in a
  transaction.

**`scripts/migrate.mjs`** — thin forward-only runner: `schema_migrations` table,
applies unApplied `NNNN_*.sql` in order, each in its own transaction, reads
`SUPABASE_DB_URL` from env or `.env.local`. The only code that opens a direct
Postgres connection.

**`scripts/export-db.sh`** — `pg_dump --no-owner --no-privileges --schema=public`
to `db-exports/<UTC timestamp>.sql` (the decision's portability guard).

> **Not executed.** There is no local Postgres, Docker, or Supabase project in
> this environment, so `0001_init.sql` has **not been applied** and the `pg_dump`
> round-trip has **not been run**. Both are blocked on C1 and must be verified
> then. The SQL was written and reviewed by hand only.

## Step 5 — Data + auth layer (plan Step 5)

- `src/lib/env.ts` — fail-safe env access, nothing throws on import.
  `getSupabaseEnv()` → null when unset; `getAllowedEmailDomain()` → null when
  unset (**no default** — B2); `emailIsInAllowedDomain()` returns false when the
  domain is unconfigured (fail safe).
- `src/lib/supabase/server.ts` — request-cookie-bound SSR client; returns null
  when unconfigured.
- `src/lib/supabase/client.ts` — browser client, sign-in only.
- `src/proxy.ts` — session-refresh proxy (Next 16 renamed `middleware` → `proxy`);
  no-ops when unconfigured.
- `src/lib/auth.ts` — `loadSession()` (React `cache()`-deduped) returns
  `unconfigured | signed_out | no_user_record | signed_in{user,supabase}`;
  `authorizeOperational()` returns `{ ok, auth } | { ok:false, message }` (Thai)
  for server actions — the single write-side guard.
- `src/lib/db.ts` — typed read helpers over the request-scoped client (RLS applies).
- `src/lib/issue-status.ts` — the canonical state machine: `allowedTransitions`,
  `findTransition`, `checkTransition` (validates transition + required reason),
  `isActive`, `isTerminal`. Pure, no framework/DB deps.
- `src/lib/overdue.ts` — the single derived-overdue predicate (mirrors the view).
- `src/types/domain.ts` — types mirroring the schema 1:1.
- `src/app/auth/callback/route.ts` — OAuth code exchange **then** server-side
  Workspace-domain check (`ALLOWED_EMAIL_DOMAIN`); on failure signs out and
  redirects to `/login?error=domain`.
- `src/app/auth/sign-out/route.ts` — clears the session, 303 → `/login`.

## Step 6 — Operational screens + server actions (plan Step 6)

- `src/app/actions.ts` — `createStore`, `createFollowUp`, `createIssue`,
  `transitionIssue`. Each calls `authorizeOperational()` first and returns a Thai
  `FormState` on failure (no thrown errors to the user). `transitionIssue`
  re-checks the transition via `checkTransition()` before any write, updates
  `issue.status` (+ `resolved_at` on resolve / clear on reopen), then inserts the
  `issue_event` row.
- `src/components/PageGate.tsx` — `gate({ operationalOnly? })`: redirects to
  `/login` when signed out; returns the signed-in session or a Thai `<Notice>`.
- Screens: `/` (redirect/notice), `/login` (+ `SignInButton`), `/stores`,
  `/stores/new` (Add Store: name, channel, location, contact — no import),
  `/stores/[storeId]` (info + follow-ups + issues, "create issue from this
  follow-up" links, post-save banner), `/stores/[storeId]/follow-ups/new`,
  `/issues/new` (owner = pick app_user **or** type a name — A1 hybrid;
  validates a passed `followUpId` belongs to the store), `/issues/[issueId]`
  (details + `StatusControls` for operational only + full `issue_event` history).
- `src/components/issues/StatusControls.tsx` — renders only the transitions
  `allowedTransitions(status)` permits; prompts for the required reason
  (resolution / cancellation / reopen) before submitting; shows a Thai
  "terminal — no further changes" line for `cancelled`.
- Form components use `useActionState` / `useFormStatus`; Thai labels; mobile-first
  Tailwind (single-column, `max-w-3xl` shell).

## Step 7 — `/manage` (plan Step 7)

- `src/app/manage/page.tsx` — read-only, **grouped by store**, three buckets:
  **กำลังดำเนินการ (Active/Open** = open + in_progress + waiting), **เกินกำหนด
  (Overdue** = derived subset past due), **แก้ไขแล้ว (Resolved**). Cancelled is
  not bucketed here (still visible on the issue record). No mutating controls.
  Any authenticated user may view it; the issue links open the read-only detail
  for management.

## Verification run locally

| Check | Result |
|---|---|
| `npm install` | ok (384 packages) |
| `npm run build` | ok — all 12 routes compile, all `ƒ` (dynamic) |
| `npm run lint` | ok — no findings |
| `npm test` | ok — 13/13 (state machine vs workflow §3) |
| `npm run dev` + probe `/ /login /stores /manage /issues/new` with **no env** | all HTTP 200; data pages render the Thai "not configured" notice; no crash |

**Not verified (blocked):** applying `0001_init.sql`, the `pg_dump` export/restore
round-trip, real Google sign-in + domain rejection, `operational` vs `management`
behaviour against live RLS, the end-to-end chain against a real store, reload
persistence. All require C1 (Supabase project) and B2 (domain string); auth also
needs B3.

## Deviations / decisions taken during Do (flagged, not silently expanded)

1. **No `ThemeToggle`** — `prefers-color-scheme` only (see Step 2).
2. **Creation `issue_event` via DB trigger** rather than a second app write —
   atomic, matches plan intent.
3. **`issue_event` reason model** — went with the plan's stated preference
   (single `reason` + `reason_kind` discriminator).
4. **`next@16.2.10`** kept to mirror AI Command Center. `npm audit` flags this
   version (fix = `16.3.4`). Not bumped unilaterally — flagged for the human /
   Check; a bump of both projects is a small separate cleanup.
5. **`node --test` on a `.ts` file** emits a `MODULE_TYPELESS_PACKAGE_JSON`
   warning (native type-stripping). Harmless; left as-is rather than adding
   `"type": "module"` (which AI Command Center also does not set).
6. **`export const dynamic = "force-dynamic"`** in the root layout — see Step 2.

---

## Amendment (post-review) — F1 + F2 only

**Date:** 2026-09-10 (same day, after Check's PASS WITH FINDINGS).
Scope restricted by the human to Check findings **F1 and F2 only**. F3–F7 not
touched. B2/B3/C1/C2 remain blocked. Nothing invented, deployed, or committed.

### F1 — Next.js security baseline

- `projects/store-care-program/package.json`: `next` `16.2.10 → 16.3.4`,
  `eslint-config-next` `16.2.10 → 16.3.4`. `package-lock.json` regenerated via
  `npm install`.
- **`projects/ai-command-center` dependencies unchanged** (`git status` clean for
  that folder — verified).
- Transitively, `npm install` pulled the patched `sharp@0.35.4` and
  `postcss@8.5.23` (both were flagged in the original `npm audit`).
- **`npm audit` now reports `found 0 vulnerabilities`** (was 1 critical + 2 high).

**Upgrade impact review (16.2.10 → 16.3.4, this app's actual surface):**
App Router + Server Actions + a session-refresh `proxy.ts` + `next/font/google`;
no `next/image` usage, no custom server, Vercel deploy target.

| Change | Detail | Action taken |
|---|---|---|
| Stricter TS import-extension check | 16.3's typecheck rejects `import "./issue-status.ts"` (TS5097) — the explicit `.ts` is needed for `node --test` native type-stripping | Added `"allowImportingTsExtensions": true` to `tsconfig.json` (valid because `noEmit` is set). **Only config change forced by the upgrade.** |
| `middleware` → `proxy` deprecation | Already migrated in the original scaffold; the warning is now fully gone | none |
| Build log | 16.3 prints `next.config.ts` load timing | cosmetic |
| Routes / render / auth behaviour | Route table identical (12 routes, all dynamic); local probes on `/ /login /stores /manage /issues/new` + dynamic-param routes all HTTP 200 with the fail-safe Thai notice | none |

No behavioural or API changes for this app beyond the tsconfig line.

### F2 — Atomic issue transition

- **New migration `migrations/0002_issue_transition.sql`** — a separate file
  (0001 already reviewed by Check; append-only migration discipline). Defines
  `public.perform_issue_transition(p_issue_id uuid, p_to_status issue_status,
  p_reason text) returns issue`:
  1. `SELECT … FOR UPDATE` the issue (row lock; serialises concurrent
     transitions); raises `SCP01` if not found.
  2. Validates `from → to` against the canonical state machine inline (same set
     as workflow §3 / `lib/issue-status.ts`); raises `SCP02` if not allowed.
  3. Derives `reason_kind` (`resolution` / `cancellation` / `reopen` / none) and
     raises `SCP03` if a required reason is blank; ignores a reason on a
     no-text transition.
  4. Updates `issue.status` and `resolved_at` (set on → resolved, cleared on
     reopen, untouched otherwise).
  5. Inserts the matching `issue_event` row with `changed_by = auth.uid()`.
  6. All in one function body = one transaction; any `RAISE` rolls back the
     whole thing.
- `SECURITY INVOKER` (default) — the UPDATE and INSERT are still subject to the
  0001 RLS policies, so only an `operational` user can complete a transition. A
  `management` caller fails at the UPDATE and the whole call rolls back.
- `REVOKE ALL … FROM public` + `GRANT EXECUTE … TO authenticated`.
- **`src/app/actions.ts` `transitionIssue()`** — the non-atomic
  `UPDATE issue` + separate `INSERT issue_event` pair is **removed**. It now:
  - still calls `authorizeOperational()` and `checkTransition()` first
    (defence in depth + clean field-level Thai errors before any round-trip);
  - then calls `supabase.rpc("perform_issue_transition", …)` — the single
    atomic path;
  - maps `SCP01/02/03` SQLSTATEs to Thai messages, generic fallback otherwise.
  - `user` was dropped from the destructure (no longer needed — `changed_by`
    comes from `auth.uid()` in the function).
- The canonical state machine is unchanged. `lib/issue-status.ts` and its 13
  tests are untouched and still pass. No generic audit framework — the function
  handles only the issue status lifecycle.

> **Still BLOCKED-by-C1** (unchanged): `0002` has not been executed (no
> Postgres). The function's runtime behaviour, the `FOR UPDATE` locking, the
> RLS-under-INVOKER path, and the `SCP0x` SQLSTATE round-trip to supabase-js
> are all unverified until a database exists.

### Amendment verification (local)

| Check | Result |
|---|---|
| `npm audit` | **0 vulnerabilities** |
| `npm run build` | ok — 12 routes, all dynamic, on Next 16.3.4 |
| `npm run lint` | ok — no findings |
| `npm test` | ok — 13/13 |
| `npm run dev` + probe 5 routes + 2 dynamic-param routes, no env | all HTTP 200, fail-safe Thai notice, no crash |
| `projects/ai-command-center` | untouched (git status clean) |

### Files changed in the amendment

- `projects/store-care-program/package.json` (F1)
- `projects/store-care-program/package-lock.json` (F1)
- `projects/store-care-program/tsconfig.json` (F1 — one line)
- `projects/store-care-program/migrations/0002_issue_transition.sql` (F2 — new)
- `projects/store-care-program/src/app/actions.ts` (F2)
- `agents/runs/2026-09-10-store-care-program-scaffold-slice/changelog.md` (this section)
