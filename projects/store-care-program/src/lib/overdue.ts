// The single derived "overdue" predicate for the application layer.
//
// Overdue is NEVER stored (workflow §2, §8). An issue is overdue when its status
// is active (open / in_progress / waiting) AND its due date is strictly before
// today. The database mirrors this exact rule in v_issue_management; keep the two
// in sync.
//
// Dates are compared as YYYY-MM-DD strings in UTC, matching the database's
// current_date. Good enough for the pilot; revisit with an explicit Asia/Bangkok
// timezone if day-boundary edge cases matter in practice.

import type { IssueStatus } from "@/types/domain";
import { isActive } from "@/lib/issue-status";

export function todayIsoDate(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function isOverdue(
  status: IssueStatus,
  dueDate: string,
  now: Date = new Date(),
): boolean {
  if (!isActive(status)) return false;
  return dueDate < todayIsoDate(now);
}
