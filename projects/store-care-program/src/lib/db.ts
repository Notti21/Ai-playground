// Typed read helpers over the Supabase Postgres.
//
// Every helper takes an already-authenticated, request-scoped SupabaseClient
// (from lib/auth.ts), so RLS applies. Writes live in app/actions.ts.

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AppUser,
  Issue,
  IssueEvent,
  IssueManagementRow,
  Store,
  StoreFollowUp,
} from "@/types/domain";

type SB = SupabaseClient;

export async function listStores(sb: SB): Promise<Store[]> {
  const { data, error } = await sb.from("store").select("*").order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Store[];
}

export async function getStore(sb: SB, id: string): Promise<Store | null> {
  const { data, error } = await sb.from("store").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Store) ?? null;
}

export async function listFollowUpsForStore(sb: SB, storeId: string): Promise<StoreFollowUp[]> {
  const { data, error } = await sb
    .from("store_follow_up")
    .select("*")
    .eq("store_id", storeId)
    .order("activity_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StoreFollowUp[];
}

export async function getFollowUp(sb: SB, id: string): Promise<StoreFollowUp | null> {
  const { data, error } = await sb
    .from("store_follow_up")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as StoreFollowUp) ?? null;
}

export async function listIssuesForStore(sb: SB, storeId: string): Promise<Issue[]> {
  const { data, error } = await sb
    .from("issue")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Issue[];
}

export async function getIssue(sb: SB, id: string): Promise<Issue | null> {
  const { data, error } = await sb.from("issue").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Issue) ?? null;
}

export async function listIssueEvents(sb: SB, issueId: string): Promise<IssueEvent[]> {
  const { data, error } = await sb
    .from("issue_event")
    .select("*")
    .eq("issue_id", issueId)
    .order("changed_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as IssueEvent[];
}

export async function listAppUsers(sb: SB): Promise<AppUser[]> {
  const { data, error } = await sb
    .from("app_user")
    .select("*")
    .order("display_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AppUser[];
}

export async function listManagementRows(sb: SB): Promise<IssueManagementRow[]> {
  const { data, error } = await sb
    .from("v_issue_management")
    .select("*")
    .order("store_name", { ascending: true })
    .order("due_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as IssueManagementRow[];
}
