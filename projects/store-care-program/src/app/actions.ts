"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authorizeOperational } from "@/lib/auth";
import { getIssue } from "@/lib/db";
import { checkTransition } from "@/lib/issue-status";
import { t } from "@/lib/th";
import type { FollowUpType, IssueStatus } from "@/types/domain";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const FOLLOW_UP_TYPES: FollowUpType[] = ["in_person", "phone", "chat", "other"];

// Custom SQLSTATEs raised by perform_issue_transition() (migrations/0002).
const RPC_ERROR_MESSAGES: Record<string, string> = {
  SCP01: t.errors.notFound,
  SCP02: t.errors.transitionNotAllowed,
  SCP03: t.errors.reasonRequired,
};

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

// --- Create store ------------------------------------------------------------

export async function createStore(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const authz = await authorizeOperational();
  if (!authz.ok) return { error: authz.message };

  const name = str(formData, "name");
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = t.errors.fieldRequired;
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const { supabase, user } = authz.auth;
  const { data, error } = await supabase
    .from("store")
    .insert({
      name,
      channel: str(formData, "channel") || null,
      location: str(formData, "location") || null,
      contact: str(formData, "contact") || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: t.errors.generic };

  revalidatePath("/stores");
  redirect(`/stores/${data.id}`);
}

// --- Create store follow-up -------------------------------------------------

export async function createFollowUp(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const authz = await authorizeOperational();
  if (!authz.ok) return { error: authz.message };

  const storeId = str(formData, "store_id");
  const activityDate = str(formData, "activity_date");
  const followUpType = str(formData, "follow_up_type");
  const performedBy = str(formData, "performed_by");
  const notes = str(formData, "notes");

  if (!storeId) return { error: t.errors.notFound };

  const fieldErrors: Record<string, string> = {};
  if (!isIsoDate(activityDate)) fieldErrors.activity_date = t.errors.fieldRequired;
  if (!FOLLOW_UP_TYPES.includes(followUpType as FollowUpType))
    fieldErrors.follow_up_type = t.errors.fieldRequired;
  if (!performedBy) fieldErrors.performed_by = t.errors.fieldRequired;
  if (!notes) fieldErrors.notes = t.errors.fieldRequired;
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const { supabase, user } = authz.auth;
  const { data, error } = await supabase
    .from("store_follow_up")
    .insert({
      store_id: storeId,
      activity_date: activityDate,
      follow_up_type: followUpType as FollowUpType,
      performed_by: performedBy,
      notes,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: t.errors.generic };

  revalidatePath(`/stores/${storeId}`);
  redirect(`/stores/${storeId}?followUpCreated=${data.id}`);
}

// --- Create issue / action -------------------------------------------------

export async function createIssue(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const authz = await authorizeOperational();
  if (!authz.ok) return { error: authz.message };

  const storeId = str(formData, "store_id");
  const followUpId = str(formData, "follow_up_id");
  const description = str(formData, "description");
  const dueDate = str(formData, "due_date");
  const ownerMode = str(formData, "owner_mode"); // "user" | "name"
  const ownerUserId = str(formData, "owner_user_id");
  const ownerNameTyped = str(formData, "owner_name");

  if (!storeId) return { error: t.errors.notFound };

  const { supabase, user } = authz.auth;

  const fieldErrors: Record<string, string> = {};
  if (!description) fieldErrors.description = t.errors.fieldRequired;
  if (!isIsoDate(dueDate)) fieldErrors.due_date = t.errors.fieldRequired;

  // Owner is hybrid (A1): owner_name is always stored; owner_user_id is linked
  // only when the owner is picked from the app's user list.
  let ownerName = "";
  let ownerUserIdValue: string | null = null;
  if (ownerMode === "user") {
    const { data: ownerRow } = ownerUserId
      ? await supabase
          .from("app_user")
          .select("display_name, email")
          .eq("id", ownerUserId)
          .maybeSingle()
      : { data: null };
    if (!ownerRow) {
      fieldErrors.owner = t.errors.fieldRequired;
    } else {
      ownerUserIdValue = ownerUserId;
      ownerName = ownerRow.display_name || ownerRow.email;
    }
  } else {
    if (!ownerNameTyped) fieldErrors.owner = t.errors.fieldRequired;
    ownerName = ownerNameTyped;
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
  const { data, error } = await supabase
    .from("issue")
    .insert({
      store_id: storeId,
      follow_up_id: followUpId || null,
      description,
      owner_name: ownerName,
      owner_user_id: ownerUserIdValue,
      due_date: dueDate,
      status: "open" satisfies IssueStatus,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { error: t.errors.generic };

  revalidatePath(`/stores/${storeId}`);
  redirect(`/issues/${data.id}`);
}

// --- Transition an issue's status -----------------------------------------

export async function transitionIssue(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const authz = await authorizeOperational();
  if (!authz.ok) return { error: authz.message };

  const issueId = str(formData, "issue_id");
  const toStatus = str(formData, "to_status") as IssueStatus;
  const reason = str(formData, "reason");

  const { supabase } = authz.auth;
  const issue = await getIssue(supabase, issueId);
  if (!issue) return { error: t.errors.notFound };

  // Defence in depth: pre-validate in the app for a clean error message before
  // the round-trip. The database function re-validates and is the real guard.
  const check = checkTransition(issue.status, toStatus, reason);
  if (!check.ok) {
    return {
      error:
        check.error === "reason_required"
          ? t.errors.reasonRequired
          : t.errors.transitionNotAllowed,
    };
  }

  // One atomic operation: validate + update issue.status/resolved_at + insert
  // the issue_event row, or roll back as one transaction (migrations/0002).
  const { error: rpcError } = await supabase.rpc("perform_issue_transition", {
    p_issue_id: issueId,
    p_to_status: toStatus,
    p_reason: check.reason,
  });
  if (rpcError) {
    return {
      error: RPC_ERROR_MESSAGES[rpcError.code ?? ""] ?? t.errors.generic,
    };
  }

  revalidatePath(`/stores/${issue.store_id}`);
  redirect(`/issues/${issueId}`);
}
