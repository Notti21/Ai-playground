import Link from "next/link";
import { gate, Notice } from "@/components/PageGate";
import {
  getFollowUp,
  getIssue,
  getStore,
  listAppUsers,
  listIssueEvents,
} from "@/lib/db";
import {
  Card,
  PageHeader,
  SectionHeading,
  StatusBadge,
} from "@/components/ui";
import { StatusControls } from "@/components/issues/StatusControls";
import { isOverdue } from "@/lib/overdue";
import { ISSUE_STATUS_LABELS, t } from "@/lib/th";

function formatTimestamp(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const g = await gate();
  if ("notice" in g) return g.notice;

  const { issueId } = await params;
  const sb = g.session.supabase;

  const issue = await getIssue(sb, issueId);
  if (!issue) return <Notice>{t.errors.notFound}</Notice>;

  const [store, followUp, events, users] = await Promise.all([
    getStore(sb, issue.store_id),
    issue.follow_up_id ? getFollowUp(sb, issue.follow_up_id) : Promise.resolve(null),
    listIssueEvents(sb, issueId),
    listAppUsers(sb),
  ]);

  const userLabel = (id: string) => {
    const u = users.find((x) => x.id === id);
    return u ? u.display_name || u.email : t.common.none;
  };

  const isOperational = g.session.user.role === "operational";
  const overdue = isOverdue(issue.status, issue.due_date);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t.issue.detailTitle}
        backHref={store ? `/stores/${store.id}` : "/stores"}
        backLabel={store?.name ?? t.stores.title}
      />

      <Card>
        <div className="flex items-start justify-between gap-2">
          <p className="whitespace-pre-wrap text-sm">{issue.description}</p>
          <StatusBadge status={issue.status} />
        </div>
        <dl className="mt-3 grid grid-cols-[8rem_1fr] gap-y-1 text-sm">
          <dt className="text-muted">{t.issue.store}</dt>
          <dd>
            {store ? (
              <Link href={`/stores/${store.id}`} className="text-accent underline">
                {store.name}
              </Link>
            ) : (
              t.common.none
            )}
          </dd>
          <dt className="text-muted">{t.issue.owner}</dt>
          <dd>{issue.owner_name}</dd>
          <dt className="text-muted">{t.issue.dueDate}</dt>
          <dd className={overdue ? "text-danger" : undefined}>
            {issue.due_date}
            {overdue ? ` · ${t.manage.buckets.overdue}` : ""}
          </dd>
          <dt className="text-muted">
            {followUp ? t.issue.fromFollowUp : ""}
          </dt>
          <dd>
            {followUp
              ? `${followUp.activity_date}`
              : t.issue.notFromFollowUp}
          </dd>
          <dt className="text-muted">{t.issue.createdBy}</dt>
          <dd>{userLabel(issue.created_by)}</dd>
        </dl>
      </Card>

      {isOperational ? (
        <section>
          <SectionHeading>{t.issue.changeStatus}</SectionHeading>
          <StatusControls issueId={issue.id} status={issue.status} />
        </section>
      ) : null}

      <section>
        <SectionHeading>{t.issue.history}</SectionHeading>
        <ol className="space-y-2">
          {events.map((e) => (
            <li
              key={e.id}
              className="rounded-md border border-border bg-surface p-3 text-sm"
            >
              <p className="font-medium">
                {e.from_status
                  ? `${ISSUE_STATUS_LABELS[e.from_status]} → ${ISSUE_STATUS_LABELS[e.to_status]}`
                  : ISSUE_STATUS_LABELS[e.to_status]}
              </p>
              {e.reason_kind ? (
                <p className="mt-1">
                  <span className="text-muted">
                    {t.issue.reasonLabels[e.reason_kind]}:{" "}
                  </span>
                  {e.reason}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted">
                {userLabel(e.changed_by)} · {formatTimestamp(e.changed_at)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
