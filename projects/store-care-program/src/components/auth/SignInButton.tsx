"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";
import { t } from "@/lib/th";

export function SignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // The 'hd' hosted-domain hint is set on the Google OAuth client by the
          // Workspace admin (B3). The authoritative domain check runs server-side
          // in /auth/callback regardless.
          queryParams: { prompt: "select_account" },
        },
      });
      if (oauthError) {
        setError(t.errors.signInFailed);
        setLoading(false);
      }
    } catch {
      setError(t.errors.configMissing);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={signIn} disabled={loading}>
        {loading ? t.common.loading : t.login.google}
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
