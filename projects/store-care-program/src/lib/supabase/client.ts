"use client";

// Browser Supabase client — used only for starting the Google OAuth sign-in flow
// on the /login page. All data access happens server-side under RLS.

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Supabase environment is not configured");
  }
  return createBrowserClient(env.url, env.anonKey);
}
