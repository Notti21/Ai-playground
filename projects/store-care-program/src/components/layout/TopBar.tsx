import Link from "next/link";
import { loadSession } from "@/lib/auth";
import { t } from "@/lib/th";

export async function TopBar() {
  const session = await loadSession();
  const signedIn = session.state === "signed_in";

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href={signedIn ? "/stores" : "/"} className="font-semibold">
          {t.appName}
        </Link>

        {signedIn ? (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/stores" className="hover:text-accent">
              {t.nav.stores}
            </Link>
            <Link href="/manage" className="hover:text-accent">
              {t.nav.manage}
            </Link>
            <form action="/auth/sign-out" method="post">
              <button type="submit" className="text-muted hover:text-foreground">
                {t.nav.signOut}
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
