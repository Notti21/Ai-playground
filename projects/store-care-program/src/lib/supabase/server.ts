// Server-side Supabase client, bound to the request cookies (the user's JWT).
// All server components and server actions use this so that RLS applies to every
// query. Returns null when Supabase is not configured (C1) — callers degrade
// gracefully rather than crash.

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

type CookiesToSet = { name: string; value: string; options: CookieOptions }[];

export async function createClient() {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component where cookies are read-only.
          // The middleware refreshes the session cookie, so this is safe to ignore.
        }
      },
    },
  });
}
