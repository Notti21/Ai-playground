// Domain types for Store Care Program. English identifiers (tech-stack decision).
// These mirror migrations/0001_init.sql exactly.

export type FollowUpType = "in_person" | "phone" | "chat" | "other";

export type IssueStatus =
  | "open"
  | "in_progress"
  | "waiting"
  | "resolved"
  | "cancelled";

export type UserRole = "operational" | "management";

export type IssueEventReasonKind = "resolution" | "cancellation" | "reopen";

export interface AppUser {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  channel: string | null;
  location: string | null;
  contact: string | null;
  created_by: string;
  created_at: string;
}

export interface StoreFollowUp {
  id: string;
  store_id: string;
  activity_date: string; // YYYY-MM-DD
  follow_up_type: FollowUpType;
  performed_by: string;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface Issue {
  id: string;
  store_id: string;
  follow_up_id: string | null;
  description: string;
  owner_name: string;
  owner_user_id: string | null;
  due_date: string; // YYYY-MM-DD
  status: IssueStatus;
  created_by: string;
  created_at: string;
  resolved_at: string | null;
}

export interface IssueEvent {
  id: string;
  issue_id: string;
  from_status: IssueStatus | null;
  to_status: IssueStatus;
  reason_kind: IssueEventReasonKind | null;
  reason: string | null;
  changed_by: string;
  changed_at: string;
}

// Management bucket, computed by v_issue_management (and mirrored in lib/overdue.ts).
export type IssueBucket = "active" | "overdue" | "resolved" | "cancelled";

export interface IssueManagementRow {
  id: string;
  store_id: string;
  store_name: string;
  store_channel: string | null;
  description: string;
  owner_name: string;
  owner_user_id: string | null;
  due_date: string;
  status: IssueStatus;
  created_at: string;
  resolved_at: string | null;
  bucket: IssueBucket;
}
