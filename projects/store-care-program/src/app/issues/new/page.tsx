import { gate, Notice } from "@/components/PageGate";
import { getFollowUp, getStore, listAppUsers } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { IssueForm } from "@/components/forms/IssueForm";
import { todayIsoDate } from "@/lib/overdue";
import { t } from "@/lib/th";

export default async function NewIssuePage({
  searchParams,
}: {
  searchParams: Promise<{ storeId?: string; followUpId?: string }>;
}) {
  const g = await gate({ operationalOnly: true });
  if ("notice" in g) return g.notice;

  const { storeId, followUpId } = await searchParams;
  const sb = g.session.supabase;

  if (!storeId) return <Notice>{t.errors.notFound}</Notice>;
  const store = await getStore(sb, storeId);
  if (!store) return <Notice>{t.errors.notFound}</Notice>;

  // If a follow-up id was passed, make sure it belongs to this store.
  let validFollowUpId: string | undefined;
  if (followUpId) {
    const followUp = await getFollowUp(sb, followUpId);
    if (followUp && followUp.store_id === storeId) validFollowUpId = followUpId;
  }

  const users = await listAppUsers(sb);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t.issue.newTitle}
        subtitle={store.name}
        backHref={`/stores/${storeId}`}
        backLabel={store.name}
      />
      {validFollowUpId ? (
        <p className="text-sm text-muted">{t.issue.fromFollowUp}</p>
      ) : (
        <p className="text-sm text-muted">{t.issue.notFromFollowUp}</p>
      )}
      <IssueForm
        storeId={storeId}
        followUpId={validFollowUpId}
        users={users.map((u) => ({
          id: u.id,
          label: u.display_name || u.email,
        }))}
        today={todayIsoDate()}
      />
    </div>
  );
}
