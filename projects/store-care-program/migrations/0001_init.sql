-- Store Care Program — migration 0001: initial schema.
--
-- Target: Postgres (Supabase). English identifiers. Idempotent-ish where practical,
-- but intended to run once against a fresh database.
--
-- Covers the first vertical slice only:
--   Store -> Store Follow-up -> Finding (free text) -> Issue/Action
--   -> Owner + Due Date -> Status -> Resolution
-- plus the read-only management view (Active / Overdue / Resolved by store).
--
-- Scope notes:
--   * "Finding" is NOT an entity: findings are free text in store_follow_up.notes.
--   * "Overdue" is DERIVED, never stored (see v_issue_management + lib/overdue.ts).
--   * Transition text (resolution note / cancel reason / reopen reason) lives ONLY
--     in issue_event, not on issue.
--   * RLS baseline: unauthenticated -> no data; authenticated -> read; only an
--     'operational' user may write. No per-store scoping. No RBAC beyond the two roles.
--
-- Transactions: this file contains no BEGIN/COMMIT. scripts/migrate.mjs wraps each
-- migration file in its own transaction. If applying by hand (psql / Supabase SQL
-- editor), wrap it in a transaction yourself for atomicity.

-- gen_random_uuid() is built in on Postgres 13+ (Supabase is 15+); the extension
-- keeps this migration portable to older/plain Postgres too.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type follow_up_type as enum ('in_person', 'phone', 'chat', 'other');

create type issue_status as enum ('open', 'in_progress', 'waiting', 'resolved', 'cancelled');

create type user_role as enum ('operational', 'management');

create type issue_event_reason_kind as enum ('resolution', 'cancellation', 'reopen');

-- ---------------------------------------------------------------------------
-- app_user — one row per authenticated person. id == auth.users.id.
-- Rows are created by the on_auth_user_created trigger (below), never by the app.
-- ---------------------------------------------------------------------------

create table app_user (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null unique,
  display_name text,
  role         user_role not null default 'operational',
  created_at   timestamptz not null default now()
);

comment on table app_user is
  'Application-level user record, 1:1 with auth.users. role is assigned manually in the DB for the pilot (no admin UI).';

-- ---------------------------------------------------------------------------
-- store
-- ---------------------------------------------------------------------------

create table store (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  channel    text,
  location   text,
  contact    text,
  created_by uuid not null references app_user (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- store_follow_up — one recorded follow-up against a store.
-- performed_by is FREE TEXT (the person who actually did the follow-up); it is
-- deliberately separate from created_by (the authenticated user who entered it).
-- ---------------------------------------------------------------------------

create table store_follow_up (
  id             uuid primary key default gen_random_uuid(),
  store_id       uuid not null references store (id),
  activity_date  date not null,
  follow_up_type follow_up_type not null,
  performed_by   text not null,
  notes          text not null,
  created_by     uuid not null references app_user (id),
  created_at     timestamptz not null default now()
);

comment on column store_follow_up.activity_date is
  'The date the follow-up happened. May be back-dated. Separate from created_at.';
comment on column store_follow_up.notes is
  'Free-text notes / findings. Findings are NOT a separate entity in v1.';

-- ---------------------------------------------------------------------------
-- issue — an Issue/Action. Always belongs to exactly one store (mandatory).
-- May optionally link to the follow-up it was found on.
-- owner is hybrid: owner_name is always present; owner_user_id links an app_user
-- when the owner is someone who signs in.
-- status holds the CURRENT status only; full history is in issue_event.
-- ---------------------------------------------------------------------------

create table issue (
  id            uuid primary key default gen_random_uuid(),
  store_id      uuid not null references store (id),
  follow_up_id  uuid references store_follow_up (id),
  description   text not null,
  owner_name    text not null,
  owner_user_id uuid references app_user (id),
  due_date      date not null,
  status        issue_status not null default 'open',
  created_by    uuid not null references app_user (id),
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz
);

comment on column issue.resolved_at is
  'Set when status becomes resolved; cleared on reopen. Convenience for sorting the management view.';

-- ---------------------------------------------------------------------------
-- issue_event — append-only record of status transitions.
-- Deliberately minimal: NOT a generic audit framework.
-- reason_kind + reason capture the workflow's required transition text:
--   resolution note / cancel reason / reopen reason.
-- ---------------------------------------------------------------------------

create table issue_event (
  id          uuid primary key default gen_random_uuid(),
  issue_id    uuid not null references issue (id),
  from_status issue_status,           -- NULL only for the creation event
  to_status   issue_status not null,
  reason_kind issue_event_reason_kind,
  reason      text,
  changed_by  uuid not null references app_user (id),
  changed_at  timestamptz not null default now(),
  constraint issue_event_reason_consistency check (
    (reason_kind is null and reason is null)
    or (reason_kind is not null and reason is not null and length(btrim(reason)) > 0)
  )
);

comment on table issue_event is
  'Append-only history of issue status transitions and their required text. No UPDATE/DELETE.';

-- ---------------------------------------------------------------------------
-- Write the creation event (NULL -> open) automatically whenever an issue is
-- inserted, so every issue has a complete history without the app needing a
-- second round-trip. Status TRANSITIONS after creation are written by the
-- server action (which also carries the required reason text).
-- ---------------------------------------------------------------------------

create function public.handle_new_issue()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.issue_event (issue_id, from_status, to_status, changed_by)
  values (new.id, null, new.status, new.created_by);
  return new;
end;
$$;

create trigger on_issue_created
  after insert on issue
  for each row execute function public.handle_new_issue();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index idx_issue_store_id on issue (store_id);
create index idx_issue_status on issue (status);
create index idx_issue_due_date on issue (due_date);
create index idx_issue_owner_user_id on issue (owner_user_id);
create index idx_store_follow_up_store_id on store_follow_up (store_id);
create index idx_store_follow_up_store_activity on store_follow_up (store_id, activity_date);
create index idx_issue_event_issue_changed_at on issue_event (issue_id, changed_at);

-- ---------------------------------------------------------------------------
-- Auth integration: create an app_user row on first sign-in.
-- SECURITY DEFINER so the app never needs the service-role key.
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.app_user (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Authorization helper: is the current user an 'operational' user?
-- SECURITY DEFINER + STABLE; reads only the caller's own app_user row.
-- ---------------------------------------------------------------------------

create function public.is_operational()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.app_user
    where id = auth.uid()
      and role = 'operational'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row-level security baseline (B5).
--   * RLS enabled on every application table.
--   * SELECT: any authenticated user (auth.uid() is not null).
--   * INSERT/UPDATE on store / store_follow_up / issue: only 'operational'.
--   * issue_event: INSERT only for 'operational'; never UPDATE/DELETE.
--   * app_user: read-only to the API; rows come from the trigger.
--   * No DELETE policies anywhere. No per-store scoping.
-- The server-side guards (lib/auth.ts) remain the primary control; RLS is
-- defence-in-depth. The two must agree.
-- ---------------------------------------------------------------------------

alter table app_user       enable row level security;
alter table store          enable row level security;
alter table store_follow_up enable row level security;
alter table issue          enable row level security;
alter table issue_event    enable row level security;

-- app_user: authenticated users may read the user list (needed to link an owner).
create policy app_user_select_authenticated on app_user
  for select
  using (auth.uid() is not null);

-- store
create policy store_select_authenticated on store
  for select
  using (auth.uid() is not null);

create policy store_insert_operational on store
  for insert
  with check (public.is_operational());

create policy store_update_operational on store
  for update
  using (public.is_operational())
  with check (public.is_operational());

-- store_follow_up
create policy follow_up_select_authenticated on store_follow_up
  for select
  using (auth.uid() is not null);

create policy follow_up_insert_operational on store_follow_up
  for insert
  with check (public.is_operational());

create policy follow_up_update_operational on store_follow_up
  for update
  using (public.is_operational())
  with check (public.is_operational());

-- issue
create policy issue_select_authenticated on issue
  for select
  using (auth.uid() is not null);

create policy issue_insert_operational on issue
  for insert
  with check (public.is_operational());

create policy issue_update_operational on issue
  for update
  using (public.is_operational())
  with check (public.is_operational());

-- issue_event (append-only)
create policy issue_event_select_authenticated on issue_event
  for select
  using (auth.uid() is not null);

create policy issue_event_insert_operational on issue_event
  for insert
  with check (public.is_operational());

-- ---------------------------------------------------------------------------
-- Management view: each issue + a derived bucket, for the read-only /manage
-- screen. security_invoker so the caller's RLS applies.
--   bucket:
--     'resolved'  -> status = resolved
--     'cancelled' -> status = cancelled (not shown as a section; available in the record view)
--     'overdue'   -> active status AND due_date < today
--     'active'    -> active status, not overdue
-- The same overdue predicate is duplicated once in lib/overdue.ts for the app.
-- ---------------------------------------------------------------------------

create view v_issue_management
with (security_invoker = on)
as
select
  i.id,
  i.store_id,
  s.name          as store_name,
  s.channel       as store_channel,
  i.description,
  i.owner_name,
  i.owner_user_id,
  i.due_date,
  i.status,
  i.created_at,
  i.resolved_at,
  case
    when i.status = 'resolved' then 'resolved'
    when i.status = 'cancelled' then 'cancelled'
    when i.status in ('open', 'in_progress', 'waiting') and i.due_date < current_date then 'overdue'
    else 'active'
  end as bucket
from issue i
join store s on s.id = i.store_id;

-- ---------------------------------------------------------------------------
-- Grants. RLS (above) restricts WHICH rows each role sees; these grants make
-- the objects reachable at all. Unauthenticated ('anon') is granted nothing on
-- application data. Supabase usually sets equivalent default privileges, but
-- being explicit keeps the migration correct on a plain Postgres too.
-- ---------------------------------------------------------------------------

grant usage on schema public to authenticated;

grant select on app_user, store, store_follow_up, issue, issue_event to authenticated;
grant insert, update on store, store_follow_up, issue to authenticated;
grant insert on issue_event to authenticated;
grant select on v_issue_management to authenticated;
