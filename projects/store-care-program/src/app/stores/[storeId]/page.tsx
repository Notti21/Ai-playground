import Link from "next/link";
import { gate, Notice } from "@/components/PageGate";
import {
  getStore,
  listFollowUpsForStore,
  listIssuesForStore,
} from "@/lib/db";
import {
  Card,
  EmptyState,
  LinkButton,
  PageHeader,
  SectionHeading,
} from "@/components/ui";
import { IssueRow } from "@/components/issues/IssueRow";
import { FOLLOW_UP_TYPE_LABELS, t } from "@/lib/th";

export default async function StoreDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ followUpCreated?: string }>;
}) {
  const g = await gate({ operationalOnly: true });
  if ("notice" in g) return g.notice;

  const { storeId } = await params;
  const { followUpCreated } = await searchParams;
  const sb = g.session.supabase;

  const store = await getStore(sb, storeId);
  if (!store) return <Notice>{t.errors.notFound}</Notice>;

  const [followUps, issues] = await Promise.all([
    listFollowUpsForStore(sb, storeId),
    listIssuesForStore(sb, storeId),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        title={store.name}
        backHref="/stores"
        backLabel={t.stores.title}
      />

      <Card>
        <dl className="grid grid-cols-[8rem_1fr] gap-y-1 text-sm">
          <dt className="text-muted">{t.stores.channel}</dt>
          <dd>{store.channel || t.common.none}</dd>
          <dt className="text-muted">{t.stores.location}</dt>
          <dd>{store.location || t.common.none}</dd>
          <dt className="text-muted">{t.stores.contact}</dt>
          <dd>{store.contact || t.common.none}</dd>
        </dl>
      </Card>

      <div className="flex flex-wrap gap-2">
        <LinkButton href={`/stores/${storeId}/follow-ups/new`}>
          {t.stores.recordFollowUp}
        </LinkButton>
        <LinkButton href={`/issues/new?storeId=${storeId}`} variant="secondary">
          {t.stores.createIssue}
        </LinkButton>
      </div>

      {followUpCreated ? (
        <div className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm">
          {t.followUp.saved} ·{" "}
          <Link
            href={`/issues/new?storeId=${storeId}&followUpId=${followUpCreated}`}
            className="font-medium text-accent underline"
          >
            {t.followUp.createIssueFromThis}
          </Link>
        </div>
      ) : null}

      <section>
        <SectionHeading>{t.stores.followUpsHeading}</SectionHeading>
        {followUps.length === 0 ? (
          <EmptyState>{t.stores.noFollowUps}</EmptyState>
        ) : (
          <ul className="space-y-2">
            {followUps.map((f) => (
              <li
                key={f.id}
                className="rounded-md border border-border bg-surface p-3"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {f.activity_date} · {FOLLOW_UP_TYPE_LABELS[f.follow_up_type]}
                  </span>
                  <span className="text-xs text-muted">{f.performed_by}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{f.notes}</p>
                <Link
                  href={`/issues/new?storeId=${storeId}&followUpId=${f.id}`}
                  className="mt-2 inline-block text-xs font-medium text-accent underline"
                >
                  {t.followUp.createIssueFromThis}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHeading>{t.stores.issuesHeading}</SectionHeading>
        {issues.length === 0 ? (
          <EmptyState>{t.stores.noIssues}</EmptyState>
        ) : (
          <ul className="space-y-2">
            {issues.map((issue) => (
              <li key={issue.id}>
                <IssueRow issue={issue} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
