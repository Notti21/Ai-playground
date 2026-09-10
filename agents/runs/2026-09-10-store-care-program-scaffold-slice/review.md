# Review Report — Store Care Program: Scaffold + First Vertical Slice

**Reviewer:** Check agent (independent verification)
**Date:** 2026-09-10
**Cycle:** `agents/runs/2026-09-10-store-care-program-scaffold-slice/`
**Inputs reviewed:** `plan.md`, `changelog.md`, `notes/workflows/store-visit-issue-closure.md`,
`notes/product/store-care-program-mvp-definition.md` (§5 diff),
`notes/decisions/2026-09-09-store-care-program-tech-stack.md`, the full
`projects/store-care-program/` tree, and the working-tree git state.

---

## Overall verdict: PASS WITH FINDINGS

The implementation matches the approved plan closely. All seven deliverables are present and
built as specified; the locked hard-gate decisions (A1–A6, B1–B5) are correctly reflected in
the schema, RLS, auth layer, and UI. Build, lint, and tests pass. Deviations from the plan
are minor, were flagged by Do rather than made silently, and are defensible.

**One finding (F1 — Next.js advisory) needs a human decision before any deployment.** It does
not block committing this scaffold cycle (nothing is deployed and deploy is already gated on
C1/B2/B3), but it must be tracked as a hard pre-deploy gate. **F2 (non-atomic transition
write)** should also be fixed before the app goes live.

---

## Plan-vs-actual verdict

| Deliverable | Status |
|---|---|
| 1 — Slice boundary (Store → Follow-up → free-text Finding → Issue → Owner+Due → Status → Resolution) | Built as specified. No `finding` table. |
| 2 — App/file structure | Matches, sibling of ai-command-center. Minor: `ThemeToggle` intentionally omitted (flagged), guard renamed `authorizeOperational`. |
| 3 — DB schema | `0001_init.sql` matches the plan's tables/columns/FKs/nullability/enums/indexes exactly. |
| 4 — Owner model (A1 hybrid) | `owner_name NOT NULL` + `owner_user_id NULL FK`; form offers pick-user or type-name. Correct. |
| 5 — Auth + authz + RLS | Supabase Auth + server-side domain check + `is_operational()` RLS baseline. Fail-closed. Correct. |
| 6 — Route/screen list | All 11 routes present (+ `/` and `_not-found` = 12 build routes). |
| 7 — Prerequisites | B2/B3/C1/C2 correctly left open; env has no defaults; `.env.example` names only. |

State machine, management buckets, and the append-only history model are faithful to the
**canonical** workflow (`store-visit-issue-closure.md` §3/§4/§8).

---

## 1. Scope / source-of-truth — VERIFIED

- **Separate app:** `projects/store-care-program/` is a new sibling of
  `projects/ai-command-center/`. Confirmed on disk and in `git status` (untracked dir).
- **ai-command-center untouched:** `git status` shows only:
  `notes/product/store-care-program-mvp-definition.md` modified, plus two untracked dirs
  (`projects/store-care-program/`, `agents/runs/2026-09-10-.../`). No application file in
  `projects/ai-command-center/` is touched. No other note/doc changed.
- **MVP §5 sync edit:** `git diff` shows the change is confined to §5. It renames
  "Visit / Follow-up" → "Store Follow-up", rewrites the Issue/Action + Relationships lines to
  the hybrid parent rule (Store mandatory, Follow-up optional), and replaces the resolved
  `[OPEN]` parent-rule note with a `[CONFIRMED — synced from …§4, 2026-09-10]` note. This
  matches canonical §4 verbatim in intent. The second `[OPEN]` note (permitted `status`
  values) is deliberately left intact — correct, it was out of the approved edit scope.

## 2. State-machine integrity — VERIFIED (live RLS enforcement BLOCKED-by-C1)

Re-derived every transition from `store-visit-issue-closure.md` §3 and compared to
`src/lib/issue-status.ts`:

| From | Canonical §3 allows | `issue-status.ts` `TRANSITIONS` | Match |
|---|---|---|---|
| (create) | → open | trigger `handle_new_issue` writes NULL→open | ✅ |
| open | in_progress, resolved, cancelled | in_progress, resolved, cancelled | ✅ |
| in_progress | waiting, resolved, cancelled | waiting, resolved, cancelled | ✅ |
| waiting | in_progress, resolved, cancelled | in_progress, resolved, cancelled | ✅ |
| resolved | in_progress (reopen only) | in_progress (`reopen`) | ✅ |
| cancelled | none (terminal) | `[]` | ✅ |

Required text: → resolved ⇒ `resolution`; → cancelled ⇒ `cancellation`; resolved→in_progress
⇒ `reopen`. Matches §3's "required text on transitions" table. `checkTransition()` rejects a
disallowed transition *before* checking the reason, and rejects an empty/whitespace reason
when one is required. The 13 unit tests in `issue-status.test.ts` assert exactly this against
§3 and all pass.

- **Every mutation path routes through the guard + validator:** `src/app/actions.ts` has
  exactly four server actions (`createStore`, `createFollowUp`, `createIssue`,
  `transitionIssue`); each calls `authorizeOperational()` as its first statement.
  `transitionIssue` additionally calls `checkTransition(issue.status, toStatus, reason)` and
  returns on failure before any write. No other file writes to the DB (`db.ts` is read-only;
  grep for `.insert(`/`.update(`/`.from("issue")` outside `actions.ts` is clean).
- **No unguarded `issue.status` write in app code.** The only `issue` UPDATE is in
  `transitionIssue`, post-validation. `createIssue` sets `status: "open"` on INSERT (creation
  only). `resolved_at` is set on → resolved and cleared on reopen, consistent with the plan.
- **Server-side, not just client:** `StatusControls.tsx` only renders buttons from
  `allowedTransitions(status)` and marks `cancelled` terminal, but the authoritative checks
  are the server action's `authorizeOperational()` + `checkTransition()`.
- **Cancelled is terminal:** `TRANSITIONS.cancelled = []`; `isTerminal("cancelled") === true`;
  test "cancelled is terminal" + "only cancelled is terminal" confirm.
- **DB backstop — `issue_event` CHECK:** present and correct —
  `(reason_kind IS NULL AND reason IS NULL) OR (reason_kind IS NOT NULL AND reason IS NOT NULL
  AND length(btrim(reason)) > 0)`. It enforces *reason-text presence* when a kind is set. It
  does **not** enforce that `reason_kind` matches the transition or that `from_status` is
  legal (see F4).

## 3. Database / migration review (`migrations/0001_init.sql`) — VERIFIED by reading; execution BLOCKED-by-C1

**FK / nullability vs Deliverable 3:** match exactly. `app_user.id → auth.users(id) ON DELETE
CASCADE`; `store.created_by`, `store_follow_up.{store_id,created_by}`,
`issue.{store_id,created_by}`, `issue_event.{issue_id,changed_by}` all `NOT NULL`;
`issue.follow_up_id`, `issue.owner_user_id`, `issue.resolved_at`,
`store.{channel,location,contact}` all nullable. Enums match (`issue_status` has all 5
canonical values; `issue_event_reason_kind` = resolution|cancellation|reopen).

**`handle_new_user()`** — `SECURITY DEFINER`, `set search_path = ''`, every object
schema-qualified (`public.app_user`), built-ins (`coalesce`, `split_part`) resolve via
implicit `pg_catalog`, `on conflict (id) do nothing` ⇒ idempotent. `raw_user_meta_data ->>
'full_name' / 'name'` with `split_part(email,'@',1)` fallback — no fabricated data. Correct.
Residual: `app_user.email` is `UNIQUE`; a (pathological) second auth user with the same email
would raise inside the trigger and block the `auth.users` insert — acceptable edge case.

**`handle_new_issue()`** — `SECURITY DEFINER`, `search_path=''`, schema-qualified insert into
`public.issue_event` with `from_status=NULL, to_status=new.status,
changed_by=new.created_by`. Runs `AFTER INSERT` so it is atomic with the issue insert.
Correct; matches plan intent ("creation event written on INSERT").

**`is_operational()`** — `SECURITY DEFINER`, `STABLE`, `LANGUAGE sql`, `search_path=''`.
Reads only `public.app_user WHERE id = auth.uid() AND role='operational'` — caller's own row
only. `auth.uid()` is schema-qualified (`auth.` prefix), so it resolves correctly under the
empty search_path. Verified: no leak, no privilege widening.

**RLS policies (all 5 tables):**
- RLS `ENABLE`d on `app_user`, `store`, `store_follow_up`, `issue`, `issue_event`.
- **Unauthenticated:** no policy matches (`anon` ⇒ `auth.uid()` is NULL ⇒ every
  `USING/WITH CHECK` is false) ⇒ zero rows, no writes. Holds — but via RLS only, see F3.
- **SELECT:** every table has `… using (auth.uid() is not null)` ⇒ any authenticated user.
- **INSERT/UPDATE:** `store`, `store_follow_up`, `issue` gated by
  `with check (public.is_operational())` (UPDATE also `using`). Management role ⇒ blocked.
- **`issue_event`:** INSERT-only policy for operational; **no UPDATE and no DELETE policy** ⇒
  append-only enforced by RLS denial.
- **`app_user`:** SELECT-only policy; no INSERT/UPDATE/DELETE policy ⇒ `role` (and everything
  else) is not client-writable. Rows arrive only via the `SECURITY DEFINER` trigger.
- **No per-store scoping, no DELETE policy anywhere.** Confirmed.

**GRANTs:** `usage on schema public`, `select` on the 5 tables + the view, `insert,update` on
the 3 write tables, `insert` on `issue_event` — all to `authenticated` only. `anon` is not
named. Consistent with RLS. Nothing grants DELETE. `app_user` gets SELECT only. See F3 for
the Supabase default-privileges caveat.

**`issue_event` append-only:** enforced (no UPDATE/DELETE policy under RLS = denied) and the
CHECK forces non-blank `reason` when `reason_kind` is set. Correct.

**Indexes:** all 7 from the plan, on the right columns — `issue(store_id)`, `issue(status)`,
`issue(due_date)`, `issue(owner_user_id)`, `store_follow_up(store_id)`,
`store_follow_up(store_id, activity_date)`, `issue_event(issue_id, changed_at)`.

**`v_issue_management`:** `WITH (security_invoker = on)` — present and critical (without it the
view would run as owner and bypass RLS). Bucket logic:
`resolved` → status=resolved; `cancelled` → status=cancelled; `overdue` → active status AND
`due_date < current_date`; else `active`. Matches the management spec and A5. The overdue
predicate (`status IN (open,in_progress,waiting) AND due_date < current_date`) matches
`src/lib/overdue.ts` (`isActive(status) && dueDate < todayIsoDate()`), including the
strict-less-than (an issue due *today* is not overdue). UTC/`current_date` timezone caveat is
acknowledged in code comments — acceptable for a pilot.

**`scripts/migrate.mjs` transactions:** wraps each file in `begin`/`commit` with `rollback`
on error; `0001_init.sql` contains no `BEGIN/COMMIT` ⇒ no nested-transaction conflict.
`CREATE TYPE` / `CREATE FUNCTION` / `CREATE EXTENSION` are all transactional in Postgres.
No `CREATE INDEX CONCURRENTLY` (which would break inside a txn). `client.query(sql)` uses the
simple-query protocol, which supports the multi-statement file. Correct.

**BLOCKED-by-C1 (NOT passed — could not be executed here, no local Postgres/Docker/Supabase):**
- Applying `0001_init.sql` to a real Postgres / Supabase.
- Live RLS behaviour (operational vs management vs unauthenticated).
- `security_invoker` view behaviour against a real caller.
- The `auth.users` trigger firing on a real sign-in.
- `scripts/export-db.sh` `pg_dump` → restore round-trip.
- Data persistence across reload.

## 4. Auth / authorization — VERIFIED (live sign-in BLOCKED-by-B2/B3/C1)

- **Fail-closed on missing `ALLOWED_EMAIL_DOMAIN`:**
  - `src/lib/env.ts`: `getAllowedEmailDomain()` returns `null` when unset (no default);
    `emailIsInAllowedDomain()` returns `false` when the domain is `null` or the email is
    missing.
  - `src/app/auth/callback/route.ts`: after `exchangeCodeForSession`, if
    `!getAllowedEmailDomain() || !emailIsInAllowedDomain(user.email)` ⇒ `signOut()` +
    redirect `/login?error=domain`. Refuses when unconfigured.
  - `/login` page: if `!getAllowedEmailDomain()` ⇒ renders a Thai "domain not configured"
    notice and **no sign-in button**.
- **No secrets committed.** Grepped the whole tree for `supabase.co`, JWT-shaped strings,
  `client_secret`, `GOCSPX`, `-----BEGIN`, `service_role`, `apikey`, and `@domain.tld`
  patterns — the only hit is an unrelated `integrity` hash in `package-lock.json`. No Workspace
  domain, OAuth id/secret, Supabase URL/key anywhere. `.env.example` is names-only (the sole
  value is the non-secret `NEXT_PUBLIC_SITE_URL=http://localhost:3000`). `.gitignore` covers
  `.env`, `.env.local`, `.env*.local`, plus `/db-exports/`. `SignInButton` passes no hardcoded
  `hd`; the server-side check is authoritative.
- **`/manage` renders no mutation controls** (read-only list of links only). `/issues/[issueId]`
  renders `StatusControls` only when `session.user.role === 'operational'`. Every action in
  `actions.ts` calls `authorizeOperational()` first, which returns
  `{ ok:false, message: forbidden }` for a `management` user ⇒ mutation rejected even if the
  request is forged. RLS (`is_operational()`) is the second layer.

**BLOCKED-by-B2/B3/C1 (kept explicitly blocked):**
- Real Google sign-in for a Workspace account landing on `/stores`.
- Real off-domain account rejected at the callback with the Thai message.
- `management` user hitting live RLS on a direct API write.
- Unauthenticated request getting no data from a live DB.

## 5. Next.js dependency advisory — FINDING F1 (needs human decision before deploy)

`npm audit` in `projects/store-care-program/` reports **3 vulnerabilities (1 critical,
2 high)**: `next 9.3.4-canary.0 – 16.3.2` (critical cluster), transitive `postcss <=8.5.22`
(high, build-time), transitive `sharp <=0.35.4-rc.0` (high, image-optimization only). Fixed
`next` is **16.3.4**. `projects/ai-command-center` also pins `next@16.2.10` (confirmed).

Re-derived against **this app's actual surface**:

| CVE | Applies here? | Effective impact here |
|---|---|---|
| GHSA-6gpp-xcg3-4w24 — Middleware/Proxy bypass (App Router + Turbopack + single locale) | Config matches (App Router ✅, Turbopack build ✅, Thai single-locale ✅, `src/proxy.ts` present ✅) | **Low.** `proxy.ts` does **session-cookie refresh only** — it carries no authorization. Every page independently calls `loadSession()` → `supabase.auth.getUser()` and every action calls `authorizeOperational()`. A bypassed proxy just means a stale token isn't refreshed ⇒ user treated as signed-out ⇒ fail-safe, not privilege escalation. |
| GHSA-m99w-x7hq-7vfj — DoS via Server Actions | Yes (4 server actions) | **Medium — availability only.** |
| GHSA-955p-x3mx-jcvp — disclosure of internal Server Function endpoints | Partially | **Low** — actions self-authorize; only endpoint identifiers leak. |
| GHSA-68g3-v927-f742 / GHSA-4633-3j49-mh5q — response-body cache confusion | Marginal | **Low** — every route is `force-dynamic`, no full-route cache. |
| GHSA-4c39-4ccg-62r3 — unbounded Server Action payload (Edge runtime) | No | No Edge runtime used. |
| GHSA-89xv-2m56-2m9x / GHSA-p9j2-gv94-2wf4 — SSRF (custom server / rewrites) | No | Vercel target, no custom server, no `rewrites`. |
| GHSA-q8wf-6r8g-63ch / GHSA-2xp9-vwfh-vxw4 — Image Optimization SVG DoS / AVIF RCE | No | `next/image` not used, no `images` config, `dangerouslyAllowSVG` false, AVIF not in default formats. |
| GHSA-p293-qw3h-jr36 — RCE on Windows-hosted servers | No | Linux/Vercel. |
| postcss / sharp | Build-time / unreachable at runtime | Low. |

**Assessment:** the package-level rating is "critical", but there is **no confirmed
remote-code-execution or auth-bypass path in this app as built**. Real residual exposure is
Server Action DoS (availability) plus minor info disclosure.

**Recommendation:**
- Does **not** block committing *this* scaffold cycle — nothing is deployed, and deploy is
  already gated on C1/B2/B3.
- **Must** be tracked as a hard pre-deploy gate: bump both `store-care-program` and
  `ai-command-center` to `next@16.3.4+` before either is deployed. This is a dependency
  change ⇒ needs the human's approval per CLAUDE.md. Per the review instruction it is
  recorded here as a **blocking finding requiring the human's decision**.
- Not upgraded during this review (as instructed).

## 6. Anti-fabrication / scope — VERIFIED

- **No fabricated business content.** `src/lib/th.ts` and all screens use a single free-text
  "บันทึก / สิ่งที่พบ" (notes/findings) field — no finding categories, taxonomy, checklist,
  seed stores, pilot data, or worked examples anywhere. Grep confirms. Q8 (real finding
  examples) and Q32 (worked example) remain OPEN and untouched — the canonical docs' `[OPEN]`
  markers are intact.
- **No deferred features crept in:** no attachments/storage, no notifications, no analytics,
  no CSV/import, no store-staff login, no admin-role UI, no per-store scoping, no i18n
  library (hardcoded Thai only), no `finding` table, no saved-report screen. Confirmed by
  file tree + grep.
- **Management view** (`/manage`) is read-only, grouped by store, buckets exactly
  **กำลังดำเนินการ (Active) / เกินกำหนด (Overdue) / แก้ไขแล้ว (Resolved)**. Cancelled is not
  bucketed there; it stays visible on the issue record (`ISSUE_STATUS_LABELS.cancelled` +
  `StatusControls` terminal message).

## Build / lint / test — run independently

| Command | Result |
|---|---|
| `npm run build` | **PASS** — Next 16.2.10 (Turbopack), compiled in ~4s, TypeScript clean, 12 routes all `ƒ` (dynamic), Proxy/Middleware emitted. |
| `npm run lint` | **PASS** — no findings. |
| `npm test` | **PASS** — 13/13 (`issue-status.test.ts` vs workflow §3). Emits the harmless `MODULE_TYPELESS_PACKAGE_JSON` warning (native TS type-stripping), as the changelog noted. |
| `npm audit` | 3 vulns (1 critical, 2 high) — see F1. |

---

## Findings (most severe first)

### F1 — Next.js `16.2.10` security advisory cluster — HIGH (package) / MEDIUM (effective) — CONFIRMED — needs human decision before deploy
`npm audit` rates this critical; fix is `next@16.3.4`. Re-derived against this app's surface,
no confirmed RCE/auth-bypass path (the middleware-bypass CVE is neutralised because
`src/proxy.ts` performs no authorization — auth is enforced per-page and per-action). Real
residual risk: Server Action DoS + minor endpoint disclosure.
**Failure scenario:** after deploy, an unauthenticated client floods a Server Action endpoint
and degrades availability for in-store users; or a future change moves an auth check into the
proxy and the bypass becomes a real hole.
**Action:** human approves bumping `store-care-program` **and** `ai-command-center` to
`next@16.3.4+` (both currently pin 16.2.10). Track as a hard pre-deploy gate. Not required to
commit this scaffold. Confidence: **confirmed** (audit output + surface analysis).

### F2 — `transitionIssue()` performs two non-atomic writes — MEDIUM — CONFIRMED
`src/app/actions.ts` updates `issue` (status, `resolved_at`) and then, in a separate call,
inserts the `issue_event` history row. There is no transaction.
**Failure scenario:** the `issue` UPDATE commits, then the `issue_event` INSERT fails
(transport blip, pooler drop). The issue is now e.g. `resolved` with `resolved_at` set but
with **no history row** for that transition; the user sees a generic error and, on retry,
`checkTransition` rejects the (already-applied) transition — the operator cannot cleanly
recover and the audit trail is permanently missing an entry (`issue_event` is append-only, no
edit path — plan R11).
**Action:** move both writes into one Postgres function invoked via `supabase.rpc(...)` so
they commit together (or an explicit transaction). Likelihood is low (`checkTransition`
pre-validates so the CHECK won't trip), impact is a silent audit gap. Confidence: **confirmed**.

### F3 — Migration never `REVOKE`s default privileges; "anon gets nothing" is true only via RLS — LOW — CONFIRMED
`0001_init.sql` comments claim *"Unauthenticated ('anon') is granted nothing on application
data,"* but the file only `GRANT`s and never `REVOKE`s. On Supabase, default privileges grant
table CRUD to `anon`/`authenticated` on new `public` tables, so `anon` retains table-level
grants; unauthenticated access is blocked **solely** by RLS (all policies require
`auth.uid() IS NOT NULL`).
**Failure scenario:** a future migration adds a table and forgets `ENABLE ROW LEVEL SECURITY`
— it is then world-readable/writable via the inherited `anon` grant, with no second layer.
**Action:** add explicit `REVOKE ALL ON ... FROM anon, PUBLIC;` before the targeted `GRANT`s,
and make the comment accurate. Live behaviour BLOCKED-by-C1. Confidence: **confirmed** (code)
/ **plausible** (exact Supabase default-privilege state unverified here).

### F4 — No DB-level transition-legality enforcement on `issue` — LOW — CONFIRMED (matches plan intent)
An `operational` user with the anon key + their own JWT can `UPDATE issue SET status='resolved'`
directly (bypassing `checkTransition`), or insert an `issue_event` whose `from_status` /
`reason_kind` don't reflect a real transition — the CHECK only enforces reason-text presence,
not kind-vs-transition or legal `from`→`to`.
This is **consistent with the plan** ("RLS is defence-in-depth; app guards remain the primary
control"; operational users are trusted; no per-user issue scoping in v1). Recorded as
residual risk, **not a deviation**. If tighter integrity is wanted later, enforce transitions
in a DB trigger/function. Confidence: **confirmed**.

### F5 — Minor auth-layer nits — INFO
- `getSiteUrl()` in `src/lib/env.ts` is dead code (the callback derives `origin` from the
  request; nothing imports `getSiteUrl`).
- `SignInButton` comment references an `hd` hosted-domain hint it does not actually pass
  (fine — the server-side callback check is authoritative and B2 is unknown).
- `/login?error=domain` is reused for both "domain unconfigured" and "off-domain email", so
  the unconfigured case shows "อีเมลนี้ไม่ได้อยู่ในโดเมนที่อนุญาต" instead of a
  configuration message. Cosmetic.

### F6 — Flagged plan deviations, all acceptable — INFO
1. Guard named `authorizeOperational()` (returns a result object with a Thai message) rather
   than the plan's `requireOperational()` (throw). Functionally equivalent, arguably better.
2. `ThemeToggle` / localStorage pre-paint omitted; `prefers-color-scheme` only (changelog
   deviation #1). Additive later.
3. Creation `issue_event` via DB trigger rather than a second app write — atomic, matches
   plan intent.
4. `issue_event` single `reason` + `reason_kind` discriminator — the plan's stated preference.
5. `export const dynamic = "force-dynamic"` in the root layout — reasonable given every page
   is per-user and auth-gated.
All were disclosed in the changelog.

### F7 — `/manage` fetches `cancelled` rows it then discards — INFO
`v_issue_management` returns every non-terminal-filtered row; `manage/page.tsx` filters to
`active|overdue|resolved` client-side, so `cancelled` issue data travels to the server
component and is dropped. Harmless at pilot scale; could add `WHERE status <> 'cancelled'` or
filter in the query.

---

## Verified vs. Blocked summary

**Independently VERIFIED:**
- Separate app; ai-command-center application code untouched; MVP edit confined to §5 and
  faithful to canonical §4.
- State machine re-derived from workflow §3 — exact match; all mutations go through
  `authorizeOperational()` + (for transitions) `checkTransition()`; no unguarded `status`
  write in app code; required reason text enforced server-side; Cancelled terminal.
- `issue_event` CHECK constraint present and correct.
- Migration schema (tables, FKs, nullability, enums, 7 indexes) matches Deliverable 3.
- Triggers + `is_operational()` are `SECURITY DEFINER` / `search_path=''` / schema-qualified /
  idempotent; `auth.uid()` resolves under empty search_path.
- RLS enabled on all 5 tables; unauthenticated denied (via RLS); SELECT = any authenticated;
  INSERT/UPDATE = operational only; `issue_event` append-only (no UPDATE/DELETE policy);
  `app_user.role` not client-writable; no per-store scoping; no DELETE policies; GRANTs
  consistent and scoped to `authenticated`.
- `v_issue_management` uses `security_invoker = on`; bucket logic and overdue predicate match
  the spec and `lib/overdue.ts`.
- `migrate.mjs` transaction wrapping is compatible with the SQL file.
- Env access fails closed everywhere (`getAllowedEmailDomain`, `emailIsInAllowedDomain`,
  `/login` gate, `/auth/callback`).
- No secrets, domain strings, or keys committed; `.env.example` names-only; `.gitignore`
  covers `.env*.local`.
- `/manage` read-only; management role cannot mutate (guard + RLS).
- No fabricated finding taxonomy / seed / worked examples; Q8 & Q32 remain OPEN.
- No deferred features present.
- `npm run build`, `npm run lint`, `npm test` (13/13) all pass.
- ai-command-center also pins `next@16.2.10`.

**BLOCKED-by-prerequisite (NOT verified — no local Postgres / Supabase / OAuth here):**
- Applying `0001_init.sql`; live RLS behaviour (operational vs management vs anon); the
  `security_invoker` view against a real caller; the `auth.users` trigger on a real sign-in.
- `scripts/export-db.sh` `pg_dump` → restore round-trip.
- Real Google sign-in landing on `/stores`; real off-domain rejection at the callback.
- End-to-end chain on a device; reload persistence.
- (These are BLOCKED-by-C1 and BLOCKED-by-B2/B3, exactly as the changelog states.)

---

## What blocks a commit

- **Nothing hard-blocks committing the scaffold** (purely additive; ai-command-center
  untouched; build/lint/test green; no secrets).
- **Before merging, the human must decide on F1** (Next.js upgrade). Acceptable outcomes:
  (a) commit now + open a tracked hard pre-deploy gate to move both projects to
  `next@16.3.4+`, or (b) bump first. Either way the app must not be deployed on `16.2.10`.
- **F2** (non-atomic transition write) should be fixed before the app serves real users;
  it is a candidate Next Action, not a commit blocker.
- F3–F7 are non-blocking; fold into a later hardening pass.

---

## Verdict: PASS WITH FINDINGS

Matches the plan; findings recorded above. F1 requires a human decision (dependency upgrade)
and must gate any deployment; F2 should be fixed before go-live. Neither blocks committing
this additive scaffold cycle.

---

## Amendment re-check (F1 + F2) — independent verification

**Reviewer:** Check agent (independent re-verification)
**Date:** 2026-09-10 (after the human authorised a narrow amendment covering **only F1 and F2**)
**Inputs:** `changelog.md` §"Amendment (post-review) — F1 + F2 only", the amended files
(`package.json`, `package-lock.json`, `tsconfig.json`, `migrations/0002_issue_transition.sql`,
`src/app/actions.ts`), `notes/workflows/store-visit-issue-closure.md` §3, and a fresh
build/lint/test/audit run.

### Updated verdict: PASS WITH FINDINGS → **PASS** (for this cycle's committable scope)

F1 and F2 are both **RESOLVED** for `projects/store-care-program`. The amendment is tightly
scoped, introduces no regressions, and F3–F7 were correctly left untouched. One **new
low/INFO observation** (N1) and one **carry-forward** (F1 for `ai-command-center`) are noted
below; neither blocks a commit.

### F1 — Next.js upgrade — **RESOLVED**

| Check | Result |
|---|---|
| `package.json` | `next` `16.3.4`, `eslint-config-next` `16.3.4` — confirmed |
| `package-lock.json` resolved tree | `next 16.3.4`, `eslint-config-next 16.3.4`, `sharp 0.35.4`, `postcss 8.5.28` (and nested `next/node_modules/postcss 8.5.23`) — all at or above the advisory fix lines |
| `npm audit` (run independently) | **`found 0 vulnerabilities`** (was 1 critical + 2 high) |
| `projects/ai-command-center/` | **completely untouched** — `git status --porcelain projects/ai-command-center/` empty; `git diff --stat` empty; still pins `next@16.2.10` |
| `npm run build` | **PASS** — Next.js 16.3.4 (Turbopack), TypeScript clean, 12 routes all `ƒ` (dynamic), Proxy/Middleware emitted |
| `npm run lint` | **PASS** — no findings |
| `npm test` | **PASS** — 13/13 (`issue-status.test.ts` vs workflow §3); harmless `MODULE_TYPELESS_PACKAGE_JSON` warning only |

**Upgrade-impact review (independent):**
- `allowImportingTsExtensions: true` in `tsconfig.json` is the **only forced config change**.
  It is **safe**: `allowImportingTsExtensions` is only permitted with `noEmit` (or
  `emitDeclarationOnly`), and `tsconfig.json` sets `"noEmit": true`. TypeScript never emits
  from this project (Next/Turbopack compiles; `node --test` strips types natively), so the
  setting only relaxes the editor/`tsc --noEmit` check to allow the explicit `.ts` specifier
  the test file already needed. No runtime effect.
- No other 16.3 behavioural change touches this app: `middleware`→`proxy` was already done in
  the original scaffold; App Router / Server Actions / route table / render behaviour are
  unchanged (build route table identical, local probes 200 with the fail-safe Thai notice);
  `next/font/google` unchanged; `next/image` not used; Vercel target, no custom server, no
  `rewrites`. The F1 advisory cluster (middleware-bypass, Server Action DoS, endpoint
  disclosure, image CVEs) is closed at the dependency level.
- File mtimes confirm the amendment touched only `actions.ts`, `tsconfig.json`, `package.json`,
  `package-lock.json`, and the new `0002` — `next.config.ts`, `globals.css`, `layout.tsx`,
  `proxy.ts` etc. were not modified.

**Carry-forward (not a regression, explicitly out of the authorised scope):** the original F1
also called for bumping `projects/ai-command-center` to `next@16.3.4+` before *that* project
deploys. The human scoped the amendment to `store-care-program` only, so `ai-command-center`
remains on `16.2.10`. That is correct for this cycle; it stays an open pre-deploy gate on the
`ai-command-center` side and should be tracked in that project's cycle, not this one.

### F2 — Atomic transition — **RESOLVED**

`migrations/0002_issue_transition.sql` reviewed line-by-line (cannot be executed here — no
Postgres). Re-derived every requirement against workflow §3:

| Requirement | Verdict |
|---|---|
| Inline `from → to` set equals the canonical state machine | **EXACT MATCH.** `open→{in_progress,resolved,cancelled}`, `in_progress→{waiting,resolved,cancelled}`, `waiting→{in_progress,resolved,cancelled}`, `resolved→{in_progress}`, `cancelled→∅` (falls through to `SCP02`). No extra or missing edge. Identical to `lib/issue-status.ts` `TRANSITIONS`. |
| `reason_kind` derivation | Correct: `→resolved`⇒`resolution`; `→cancelled`⇒`cancellation`; (`resolved→in_progress`)⇒`reopen`; else `null`. Blank required reason ⇒ `raise … SCP03`. Reason on a no-text transition is discarded (`if v_reason_kind is null then v_reason := null`). |
| `resolved_at` | `now()` on `→resolved`; `null` on reopen (`v_from='resolved' and p_to='in_progress'`); otherwise `v_issue.resolved_at` (untouched). Correct. |
| `changed_by` | `auth.uid()` in the INSERT — not an app-supplied value. The app no longer destructures `user` for this path. Correct. |
| Row lock / not-found | `select * into v_issue … for update`; `if not found then raise … SCP01`. Correct. In READ COMMITTED a blocked `FOR UPDATE` re-reads the latest committed row, so `v_from` reflects a concurrent prior transition — serialisation holds. |
| `SECURITY INVOKER` | No `security definer` clause ⇒ default INVOKER ⇒ the 0001 RLS policies still gate the UPDATE and the INSERT. A `management` caller is blocked and the whole call rolls back — **confirmed**, with a mechanism nuance: the `issue` UPDATE silently affects 0 rows under its `using (is_operational())` policy (RLS USING-filtering does not raise), then the `issue_event` INSERT trips `with check (public.is_operational())` and raises `42501`, aborting the function and rolling back everything. End state is correct (nothing persisted); see N1. |
| `search_path=''` + schema-qualified | `set search_path = ''`; every object qualified: `public.issue`, `public.issue_event`, param/enum types `public.issue_status` / `public.issue_event_reason_kind`, `auth.uid()`. Built-ins (`now`, `nullif`, `btrim`, `coalesce`) resolve via implicit `pg_catalog`. Enum literals compare via context cast. Correct. |
| `REVOKE … FROM public` + `GRANT EXECUTE … TO authenticated` | Present (function-execute default to PUBLIC is revoked, then granted to `authenticated` only). `anon` cannot call it. Correct. |
| Custom SQLSTATEs `SCP01/02/03` | Valid Postgres custom codes (5 chars, `[0-9A-Z]`, non-standard class `SC`). PostgREST passes unknown SQLSTATEs through as HTTP 400 with `code`/`message`, so supabase-js surfaces them as `error.code`. `actions.ts` maps `rpcError.code` → `RPC_ERROR_MESSAGES` (`SCP01`→notFound, `SCP02`→transitionNotAllowed, `SCP03`→reasonRequired), generic fallback otherwise. Correct. |
| Atomic (one implicit transaction) | The `begin … end` is the plpgsql block, **not** a subtransaction; there is no `EXCEPTION` block, so any `RAISE` propagates and rolls back the whole statement/transaction. When called via `supabase.rpc()` PostgREST wraps it in one transaction. Correct. |
| Not a generic audit framework | Correct — the function only handles the issue status lifecycle from workflow §3. |

**App-side (`src/app/actions.ts`) — no remaining non-atomic write path:**
- `transitionIssue()` no longer does `UPDATE issue` + separate `INSERT issue_event`. It calls
  `authorizeOperational()` → `checkTransition()` (defence in depth, still present, gives clean
  field-level Thai errors before any round-trip) → `supabase.rpc("perform_issue_transition", …)`
  as the single status-change path → maps `SCP0x` to Thai messages.
- Grepped the whole `src/` tree: the only `.from("issue")` writes are `createIssue`'s INSERT
  with `status: "open"` (creation only); **no `.from("issue").update(` anywhere**; **no
  `.from("issue_event").insert(` in app code** (only `db.ts` reads it via `.select`); the only
  `.rpc(` call is `perform_issue_transition`. `db.ts` is read-only. Clean.
- `lib/issue-status.ts` and `issue-status.test.ts` are **unchanged** (file mtimes predate the
  amendment) and the 13 tests still pass against workflow §3.

### New finding introduced by the amendment

**N1 — `management`-caller rollback relies on the `issue_event` INSERT RLS check, not the
`issue` UPDATE — INFO / LOW — plausible (runtime BLOCKED-by-C1).**
Under RLS, the `UPDATE public.issue … where id = p_issue_id` in `perform_issue_transition`
silently matches 0 rows for a non-operational caller (USING-clause filtering does not raise);
`v_issue` becomes an all-NULL row and execution continues to the `issue_event` INSERT, which
*does* raise `42501` and rolls everything back. Net behaviour is correct today (management
cannot complete a transition; nothing persists; the app-side `authorizeOperational()` blocks
management before the RPC is ever reached). The fragility: if a future migration ever loosened
the `issue_event` INSERT policy, a non-operational caller hitting the RPC directly would get a
"successful" return with an all-NULL `issue` row and no state change — misleading, though not
a data-integrity breach. Optional hardening: after the UPDATE, `if not found then raise …`
(or `get diagnostics … row_count`) so the function fails loudly on a no-op UPDATE.
Not blocking; fold into the same later hardening pass as F3/F4.

### Explicit blocked-vs-verified list

**Independently VERIFIED (this amendment):**
- `next`/`eslint-config-next` at `16.3.4` in both `package.json` and the resolved lockfile;
  `sharp`/`postcss` transitively patched; `npm audit` = 0 vulnerabilities.
- `projects/ai-command-center/` has **zero** modifications (git status + git diff).
- `allowImportingTsExtensions: true` is the only forced config change and is safe (`noEmit`).
- `npm run build` (Next 16.3.4), `npm run lint`, `npm test` (13/13) all pass.
- `0002_issue_transition.sql`: transition set is an exact match to workflow §3; `reason_kind`,
  `resolved_at`, `changed_by = auth.uid()`, `FOR UPDATE`, `SCP01`, `search_path=''` +
  schema-qualification, `SECURITY INVOKER`, `REVOKE/GRANT`, custom SQLSTATE validity, atomic
  single-transaction body — all correct by reading.
- `transitionIssue()` has no remaining non-atomic write path; RPC is the sole status-change
  route; `checkTransition()` pre-check retained; `db.ts` read-only; no stray `issue`/
  `issue_event` writes in `src/`.
- `lib/issue-status.ts` + its 13 tests unchanged and green.
- No secrets / Workspace domain / OAuth creds / Supabase keys anywhere (re-grepped
  `*.ts/tsx/mjs/sh/json/md/.env*`; only placeholder/doc strings in `.env.example` and the
  migration/export scripts).
- F3–F7 untouched (file mtimes predate the amendment); not half-fixed. Note `0002` adds a
  function-level `revoke … from public` — that is unrelated to F3's table default-privilege
  concern; F3 stays open. F4 (no DB-level transition-legality enforcement on a *direct*
  `issue` UPDATE via the anon key) is unchanged — `0002` adds no trigger on `issue`, and
  operational users still hold table-level UPDATE; the RPC is an additional clean path, not a
  lock-down. Both remain as originally recorded.
- Management view still read-only; buckets unchanged; `manage/page.tsx` not modified. Storage
  buckets: none defined (unchanged).

**BLOCKED-by-prerequisite (NOT verified — no local Postgres / Supabase / OAuth), now
including `0002` runtime behaviour:**
- Applying `0001_init.sql` **and** `0002_issue_transition.sql` to a real Postgres/Supabase.
- `perform_issue_transition` runtime: the `SELECT … FOR UPDATE` row lock / concurrent-
  transition serialisation; the RLS-under-`SECURITY INVOKER` path (operational succeeds,
  management rolls back — including the N1 mechanism); the `SCP01/02/03` SQLSTATE round-trip
  surfacing as `error.code` in supabase-js.
- Live RLS behaviour (operational vs management vs unauthenticated); the `security_invoker`
  view against a real caller; the `auth.users` trigger on a real sign-in.
- `scripts/export-db.sh` `pg_dump` → restore round-trip.
- Real Google sign-in landing on `/stores`; real off-domain rejection at the callback.
- End-to-end chain on a device; reload persistence.
- (All BLOCKED-by-C1 and BLOCKED-by-B2/B3, exactly as the changelog states. B2/B3/C1/C2 remain
  blocked.)

### Does anything block a commit now?

**No.** The amendment is purely additive to the (still-uncommitted, un-deployed) scaffold:
`ai-command-center` untouched; `npm run build` / `lint` / `test` green on Next 16.3.4;
`npm audit` clean; no secrets; the atomic-transition function is correct by inspection and its
runtime verification is already covered by the existing BLOCKED-by-C1 gate. F1 and F2 are
resolved for `store-care-program`. Remaining open items (F1 for `ai-command-center`, F3, F4,
F5–F7, N1) are non-blocking and belong in a later hardening pass or the `ai-command-center`
cycle.

### Verdict: PASS
