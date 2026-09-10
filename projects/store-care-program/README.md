# Store Care Program

The first real line-of-business application under Business OS. It tracks the
store follow-up → issue/action → closure workflow so that every store-level issue
is visible, owned, given a due date, and driven to closure.

- Product / MVP: `../../notes/product/store-care-program-mvp-definition.md`
- Operational workflow (canonical): `../../notes/workflows/store-visit-issue-closure.md`
- Tech-stack decision: `../../notes/decisions/2026-09-09-store-care-program-tech-stack.md`
- Scaffold + first-slice plan: `../../agents/runs/2026-09-10-store-care-program-scaffold-slice/plan.md`

The user-facing UI is **Thai only** (v1). Code, schema, and this document are in English.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, `lucide-react`, Noto Sans Thai webfont
- Supabase (Postgres + Auth) — accessed only through a request-scoped, RLS-bound client
- Deployed on Vercel (not yet — see Prerequisites)

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm test` | Run unit tests (`node --test`; currently the issue state-machine) |
| `npm run db:migrate` | Apply `migrations/*.sql` in order (needs `SUPABASE_DB_URL`) |
| `npm run db:export` | Full `pg_dump` of the database to `db-exports/` (portability guard) |

## Environment

Copy `.env.example` to `.env.local` and fill it in. Nothing in the app throws on
missing config — pages render a Thai "not configured" message instead.

| Variable | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project | **C1 — pending** |
| `ALLOWED_EMAIL_DOMAIN` | Exact Google Workspace domain sign-in is restricted to. **No default.** | **B2 — pending** |
| `NEXT_PUBLIC_SITE_URL` | Origin used to build the OAuth redirect | local default provided |
| `SUPABASE_DB_URL` | Direct Postgres connection — **migrations/export only**, never imported by app code | **C1 — pending** |

The Google OAuth client ID/secret (**B3 — pending**) is configured in the Supabase
dashboard (Authentication → Providers → Google), not in this repo.

## Database

- Schema lives in `migrations/`, owned by this project (not generated from a
  running database). `0001_init.sql` is the whole first-slice schema: enums, the
  five tables, indexes, the `handle_new_user` / `handle_new_issue` triggers, the
  `is_operational()` helper, the RLS baseline, and the `v_issue_management` view.
- Apply with `npm run db:migrate` (a thin forward-only runner) or by pasting the
  file into the Supabase SQL editor.
- `npm run db:export` runs `pg_dump` and writes portable plain SQL to
  `db-exports/` (gitignored). Restore with `psql "$TARGET_DB_URL" -f <file>`.
- `app_user.role` is set to `management` **manually in the database** for the
  pilot (B4). There is no admin UI.

### Model notes

- "Finding" is **not** a table — findings are free text in `store_follow_up.notes`.
- "Overdue" is **derived**, never stored (`lib/overdue.ts` + `v_issue_management`).
- Transition text (resolution note / cancel reason / reopen reason) lives only in
  `issue_event`, which is append-only. A correction is a new event.
- The issue state machine is defined once in `src/lib/issue-status.ts` and covered
  by `src/lib/issue-status.test.ts`.

## Prerequisites still open (blocking deploy, not local build)

- **B2** — the exact Workspace domain string (`ALLOWED_EMAIL_DOMAIN`).
- **B3** — the Google OAuth client credentials (Workspace admin creates them).
- **C1** — the Supabase project + Vercel project + keys.
- **C2** — the Supabase / Vercel region.

Until B2/C1 are supplied the app runs locally but every data page shows the Thai
"not configured" notice and sign-in is refused.
