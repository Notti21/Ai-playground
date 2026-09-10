// Environment access with fail-safe defaults.
//
// Nothing here throws on import. Callers decide how to degrade when config is
// missing (the app renders a Thai "not configured" message rather than crashing).
//
// Deployment prerequisites still OPEN at scaffold time:
//   B2  ALLOWED_EMAIL_DOMAIN   — the exact Workspace domain. NO DEFAULT.
//   B3  Google OAuth client    — configured in Supabase, not in this repo.
//   C1  Supabase project       — NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY.

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

// The exact company Google Workspace domain sign-in is restricted to (B2).
// Returns null when unset — the caller MUST then refuse sign-in (fail safe),
// never fall back to a default or allow all domains.
export function getAllowedEmailDomain(): string | null {
  const raw = process.env.ALLOWED_EMAIL_DOMAIN;
  if (!raw || !raw.trim()) return null;
  return raw.trim().toLowerCase().replace(/^@/, "");
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

// True only when an email's domain matches the configured Workspace domain.
// Returns false when the domain is not configured (fail safe).
export function emailIsInAllowedDomain(email: string | null | undefined): boolean {
  const domain = getAllowedEmailDomain();
  if (!domain || !email) return false;
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  return email.slice(at + 1).toLowerCase() === domain;
}
