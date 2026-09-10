import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { isOverdue } from "@/lib/overdue";
import { t } from "@/lib/th";
import type { Issue } from "@/types/domain";

export function IssueRow({ issue }: { issue: Issue }) {
  const overdue = isOverdue(issue.status, issue.due_date);

  return (
    <Link
      href={`/issues/${issue.id}`}
      className="block rounded-md border border-border bg-surface p-3 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm">{issue.description}</p>
        <StatusBadge status={issue.status} />
      </div>
      <p className={`mt-1 text-xs ${overdue ? "text-danger" : "text-muted"}`}>
        {t.manage.owner}: {issue.owner_name} · {t.manage.dueOn} {issue.due_date}
        {overdue ? ` · ${t.manage.buckets.overdue}` : ""}
      </p>
    </Link>
  );
}
