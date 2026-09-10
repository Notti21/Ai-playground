import type { ReactElement, ReactNode } from "react";
import { redirect } from "next/navigation";

import { loadSession, type Session } from "@/lib/auth";
import { t } from "@/lib/th";

type SignedIn = Extract<Session, { state: "signed_in" }>;

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-6 text-sm">
      {children}
    </div>
  );
}

// Page-level auth gate. Redirects to /login when signed out; otherwise returns
// either the signed-in session or a Notice element for the page to render.
export async function gate(
  opts: { operationalOnly?: boolean } = {},
): Promise<{ session: SignedIn } | { notice: ReactElement }> {
  const session = await loadSession();

  if (session.state === "signed_out") redirect("/login");

  if (session.state !== "signed_in") {
    const message =
      session.state === "unconfigured"
        ? t.errors.configMissing
        : t.errors.userRecordMissing;
    return { notice: <Notice>{message}</Notice> };
  }

  if (opts.operationalOnly && session.user.role !== "operational") {
    return { notice: <Notice>{t.errors.forbidden}</Notice> };
  }

  return { session };
}
