import { redirect } from "next/navigation";
import { loadSession } from "@/lib/auth";
import { Notice } from "@/components/PageGate";
import { t } from "@/lib/th";

export default async function Home() {
  const session = await loadSession();

  if (session.state === "signed_in") redirect("/stores");
  if (session.state === "signed_out") redirect("/login");

  const message =
    session.state === "unconfigured"
      ? t.errors.configMissing
      : t.errors.userRecordMissing;
  return <Notice>{message}</Notice>;
}
