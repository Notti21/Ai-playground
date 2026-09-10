// Authentication + authorization helpers.
//
// Model (tech-stack decision §4, plan Deliverable 5):
//   * Auth  = Google sign-in via Supabase Auth, restricted to the company
//             Workspace domain. The domain check also runs server-side in the
//             OAuth callback.
//   * Authz = one two-value role on app_user (operational | management) and one
//             server-side guard. 'operational' performs every mutation;
//             'management' gets the read-only /manage view only.
//   * RLS in the database is defence-in-depth on top of these guards.
//
// Nothing here needs the service-role key: the app_user row is created by a
// database trigger on first sign-in.

import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { t } from "@/lib/th";
import type { AppUser } from "@/types/domain";

export type Session =
  | { state: "unconfigured" }
  | { state: "signed_out" }
  | { state: "no_user_record" }
  | { state: "signed_in"; user: AppUser; supabase: SupabaseClient };

// Deduped per request so TopBar + the page gate share one session lookup.
export const loadSession = cache(async function loadSession(): Promise<Session> {
  const supabase = await createClient();
  if (!supabase) return { state: "unconfigured" };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { state: "signed_out" };

  const { data, error: rowError } = await supabase
    .from("app_user")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (rowError) return { state: "signed_out" };
  if (!data) return { state: "no_user_record" };

  return { state: "signed_in", user: data as AppUser, supabase };
});

// Thai message for a non-signed-in session state.
export function messageForSession(
  state: "unconfigured" | "signed_out" | "no_user_record",
): string {
  switch (state) {
    case "unconfigured":
      return t.errors.configMissing;
    case "no_user_record":
      return t.errors.userRecordMissing;
    case "signed_out":
    default:
      return t.errors.notSignedIn;
  }
}

// --- Guard for server actions (mutations) -------------------------------------

export type Authorized = { user: AppUser; supabase: SupabaseClient };
export type AuthzResult =
  | { ok: true; auth: Authorized }
  | { ok: false; message: string };

// Returns the authorized operational user + client, or a Thai failure message.
// Actions return the message to the form rather than throwing.
export async function authorizeOperational(): Promise<AuthzResult> {
  const session = await loadSession();

  if (session.state !== "signed_in") {
    return { ok: false, message: messageForSession(session.state) };
  }
  if (session.user.role !== "operational") {
    return { ok: false, message: t.errors.forbidden };
  }
  return {
    ok: true,
    auth: { user: session.user, supabase: session.supabase },
  };
}
