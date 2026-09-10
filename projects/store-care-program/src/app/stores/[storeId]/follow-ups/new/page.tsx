import { gate, Notice } from "@/components/PageGate";
import { getStore } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { FollowUpForm } from "@/components/forms/FollowUpForm";
import { todayIsoDate } from "@/lib/overdue";
import { t } from "@/lib/th";

export default async function NewFollowUpPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const g = await gate({ operationalOnly: true });
  if ("notice" in g) return g.notice;

  const { storeId } = await params;
  const store = await getStore(g.session.supabase, storeId);
  if (!store) return <Notice>{t.errors.notFound}</Notice>;

  return (
    <div className="space-y-4">
      <PageHeader
        title={t.followUp.title}
        subtitle={store.name}
        backHref={`/stores/${storeId}`}
        backLabel={store.name}
      />
      <FollowUpForm
        storeId={storeId}
        defaultPerformedBy={g.session.user.display_name ?? ""}
        today={todayIsoDate()}
      />
    </div>
  );
}
