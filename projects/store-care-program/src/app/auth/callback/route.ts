import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  emailIsInAllowedDomain,
  getAllowedEmailDomain,
  getSupabaseEnv,
} from "@/lib/env";

// Google OAuth callback. Exchanges the code for a session, then enforces the
// Workspace-domain restriction server-side (B2) before letting the user in.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const env = getSupabaseEnv();

  if (!env || !code) {
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=signin`);
  }

  // Fail safe: if the domain is unconfigured OR the email is outside it, refuse.
  if (!getAllowedEmailDomain() || !emailIsInAllowedDomain(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=domain`);
  }

  return NextResponse.redirect(`${origin}/stores`);
}
