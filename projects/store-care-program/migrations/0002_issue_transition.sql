-- Store Care Program — migration 0002: atomic issue status transition.
--
-- Replaces the app's non-atomic "UPDATE issue.status; INSERT issue_event" pair
-- (Check finding F2) with one function that does the whole accepted transition
-- in a single transaction: validate current status, validate the requested
-- transition against the canonical state machine, require the correct reason
-- for resolve / cancel / reopen, update issue.status + resolved_at, and insert
-- the matching issue_event row. A function body is atomic — any RAISE rolls the
-- whole thing back.
--
-- This is NOT a generic audit framework: it handles exactly the issue status
-- lifecycle from notes/workflows/store-visit-issue-closure.md §3.
--
-- SECURITY INVOKER (the default): the function runs as the caller, so the RLS
-- policies from 0001 still apply to the UPDATE and the INSERT — only an
-- 'operational' user can complete a transition. The app-side validator in
-- src/lib/issue-status.ts stays in place as defence in depth and for clean
-- field-level error messages.
--
-- Custom SQLSTATEs let the server action map failures to Thai messages:
--   SCP01  issue not found
--   SCP02  transition not allowed from the current status
--   SCP03  a required reason (resolution / cancellation / reopen) was missing

create function public.perform_issue_transition(
  p_issue_id  uuid,
  p_to_status public.issue_status,
  p_reason    text
)
returns public.issue
language plpgsql
set search_path = ''
as $$
declare
  v_issue       public.issue;
  v_from        public.issue_status;
  v_reason_kind public.issue_event_reason_kind;
  v_reason      text;
  v_resolved_at timestamptz;
begin
  -- 1. Load + lock the current row so concurrent transitions serialise.
  select * into v_issue from public.issue where id = p_issue_id for update;
  if not found then
    raise exception 'issue not found: %', p_issue_id using errcode = 'SCP01';
  end if;
  v_from := v_issue.status;

  -- 2. Validate the transition against the canonical state machine (workflow §3):
  --      open        -> in_progress | resolved | cancelled
  --      in_progress -> waiting | resolved | cancelled
  --      waiting     -> in_progress | resolved | cancelled
  --      resolved    -> in_progress            (reopen only)
  --      cancelled   -> (terminal, no transitions)
  if not (
       (v_from = 'open'        and p_to_status in ('in_progress', 'resolved', 'cancelled'))
    or (v_from = 'in_progress' and p_to_status in ('waiting', 'resolved', 'cancelled'))
    or (v_from = 'waiting'     and p_to_status in ('in_progress', 'resolved', 'cancelled'))
    or (v_from = 'resolved'    and p_to_status = 'in_progress')
  ) then
    raise exception 'transition not allowed: % -> %', v_from, p_to_status
      using errcode = 'SCP02';
  end if;

  -- 3. Required reason for resolve / cancel / reopen; ignored otherwise.
  v_reason := nullif(btrim(coalesce(p_reason, '')), '');
  if p_to_status = 'resolved' then
    v_reason_kind := 'resolution';
  elsif p_to_status = 'cancelled' then
    v_reason_kind := 'cancellation';
  elsif v_from = 'resolved' and p_to_status = 'in_progress' then
    v_reason_kind := 'reopen';
  else
    v_reason_kind := null;
  end if;

  if v_reason_kind is not null and v_reason is null then
    raise exception 'reason required for transition kind %', v_reason_kind
      using errcode = 'SCP03';
  end if;
  if v_reason_kind is null then
    v_reason := null;
  end if;

  -- 4. resolved_at: set on -> resolved, cleared on reopen, unchanged otherwise.
  if p_to_status = 'resolved' then
    v_resolved_at := now();
  elsif v_from = 'resolved' and p_to_status = 'in_progress' then
    v_resolved_at := null;
  else
    v_resolved_at := v_issue.resolved_at;
  end if;

  update public.issue
     set status = p_to_status,
         resolved_at = v_resolved_at
   where id = p_issue_id
   returning * into v_issue;

  -- 5. Matching history row. changed_by is the authenticated caller, not a
  --    value passed by the app.
  insert into public.issue_event
    (issue_id, from_status, to_status, reason_kind, reason, changed_by)
  values
    (p_issue_id, v_from, p_to_status, v_reason_kind, v_reason, auth.uid());

  -- 6. One transaction: reached here means every step succeeded.
  return v_issue;
end;
$$;

comment on function public.perform_issue_transition(uuid, public.issue_status, text) is
  'Atomically apply one accepted issue status transition (validate + update + issue_event) in a single transaction. RLS still restricts this to operational users.';

-- Only signed-in users may call it; RLS inside decides whether the write lands.
revoke all on function public.perform_issue_transition(uuid, public.issue_status, text) from public;
grant execute on function public.perform_issue_transition(uuid, public.issue_status, text) to authenticated;
