import Link from "next/link";
import { gate } from "@/components/PageGate";
import { listManagementRows } from "@/lib/db";
import { EmptyState, PageHeader } from "@/components/ui";
import { t } from "@/lib/th";
import type { IssueManagementRow } from "@/types/domain";

// Management view (read-only). Buckets, per workflow §8 + plan A5:
//   Active   = open + in_progress + waiting, not past due
//   Overdue  = the same active statuses, past due  (derived, never stored)
//   Resolved = resolved
// Cancelled issues are intentionally not shown here (still visible on the issue
// record itself).

function Bucket({
  label,
  rows,
  tone,
}: {
  label: string;
  rows: IssueManagementRow[];
  tone: "muted" | "danger" | "success";
}) {
  const toneClass = {
    muted: "text-muted",
    danger: "text-danger",
    success: "text-success",
  }[tone];

  return (
    <div className="mt-2">
      <p className={`text-xs font-semibold uppercase tracking-wide ${toneClass}`}>
        {label} ({rows.length})
      </p>
      {rows.length > 0 ? (
        <ul className="mt-1 space-y-1">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/issues/${row.id}`}
                className="block rounded-md border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-accent"
              >
                <span>{row.description}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {t.manage.owner}: {row.owner_name} · {t.manage.dueOn}{" "}
                  {row.due_date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default async function ManagePage() {
  const g = await gate();
  if ("notice" in g) return g.notice;

  const rows = await listManagementRows(g.session.supabase);

  const header = (
    <PageHeader title={t.manage.title} subtitle={t.manage.subtitle} />
  );

  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        {header}
        <EmptyState>{t.manage.empty}</EmptyState>
      </div>
    );
  }

  const byStore = new Map<
    string,
    { name: string; rows: IssueManagementRow[] }
  >();
  for (const row of rows) {
    const entry = byStore.get(row.store_id) ?? {
      name: row.store_name,
      rows: [],
    };
    entry.rows.push(row);
    byStore.set(row.store_id, entry);
  }

  return (
    <div className="space-y-6">
      {header}
      {[...byStore.entries()].map(([storeId, group]) => (
        <section key={storeId}>
          <h2 className="font-semibold">{group.name}</h2>
          <Bucket
            label={t.manage.buckets.active}
            tone="muted"
            rows={group.rows.filter((r) => r.bucket === "active")}
          />
          <Bucket
            label={t.manage.buckets.overdue}
            tone="danger"
            rows={group.rows.filter((r) => r.bucket === "overdue")}
          />
          <Bucket
            label={t.manage.buckets.resolved}
            tone="success"
            rows={group.rows.filter((r) => r.bucket === "resolved")}
          />
        </section>
      ))}
    </div>
  );
}
