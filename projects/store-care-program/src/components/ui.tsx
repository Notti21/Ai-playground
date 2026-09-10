// Small shared UI primitives. Thai labels are passed in by callers.

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { IssueBucket, IssueStatus } from "@/types/domain";
import { ISSUE_BUCKET_LABELS, ISSUE_STATUS_LABELS } from "@/lib/th";

export const inputClass =
  "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mb-5">
      {backHref ? (
        <Link href={backHref} className="text-sm text-muted hover:text-foreground">
          ← {backLabel ?? "ย้อนกลับ"}
        </Link>
      ) : null}
      <h1 className="mt-1 text-xl font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
      {children}
    </h2>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
      {children}
    </p>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-sm text-danger">{children}</p>;
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
      {children}
    </p>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-accent text-white hover:opacity-90"
      : "border border-border bg-background hover:bg-surface";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${styles}`}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" | "danger" }) {
  const styles = {
    primary: "bg-accent text-white hover:opacity-90",
    secondary: "border border-border bg-background hover:bg-surface",
    danger: "bg-danger text-white hover:opacity-90",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-60 ${styles} ${className}`}
    />
  );
}

const STATUS_TONE: Record<IssueStatus, string> = {
  open: "bg-accent/10 text-accent",
  in_progress: "bg-warning/10 text-warning",
  waiting: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
  cancelled: "bg-muted/15 text-muted",
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[status]}`}
    >
      {ISSUE_STATUS_LABELS[status]}
    </span>
  );
}

const BUCKET_TONE: Record<IssueBucket, string> = {
  active: "bg-accent/10 text-accent",
  overdue: "bg-danger/10 text-danger",
  resolved: "bg-success/10 text-success",
  cancelled: "bg-muted/15 text-muted",
};

export function BucketBadge({ bucket }: { bucket: IssueBucket }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${BUCKET_TONE[bucket]}`}
    >
      {ISSUE_BUCKET_LABELS[bucket]}
    </span>
  );
}

// Shared field wrappers for forms.
export function TextField({
  label,
  name,
  hint,
  error,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <FieldError>{error}</FieldError>
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  error,
  required,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={rows}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <FieldError>{error}</FieldError>
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  error,
  required,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError>{error}</FieldError>
    </label>
  );
}
