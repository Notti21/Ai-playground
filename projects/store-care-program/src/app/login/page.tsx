import { redirect } from "next/navigation";
import { loadSession } from "@/lib/auth";
import { getAllowedEmailDomain, isSupabaseConfigured } from "@/lib/env";
import { Notice } from "@/components/PageGate";
import { PageHeader, FormError } from "@/components/ui";
import { SignInButton } from "@/components/auth/SignInButton";
import { t } from "@/lib/th";

const ERROR_MESSAGES: Record<string, string> = {
  config: t.errors.configMissing,
  signin: t.errors.signInFailed,
  domain: t.errors.notAuthorised,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await loadSession();
  if (session.state === "signed_in") redirect("/stores");

  if (!isSupabaseConfigured()) return <Notice>{t.errors.configMissing}</Notice>;
  if (!getAllowedEmailDomain()) {
    return <Notice>{t.errors.domainNotConfigured}</Notice>;
  }

  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <PageHeader title={t.login.title} subtitle={t.login.intro} />
      <FormError>{errorMessage}</FormError>
      <SignInButton />
    </div>
  );
}
