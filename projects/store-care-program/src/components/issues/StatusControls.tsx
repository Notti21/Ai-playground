"use client";

import { useActionState, useState } from "react";
import { transitionIssue, type FormState } from "@/app/actions";
import { allowedTransitions } from "@/lib/issue-status";
import { Button, FormError, inputClass } from "@/components/ui";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { ISSUE_STATUS_LABELS, t } from "@/lib/th";
import type { IssueEventReasonKind, IssueStatus } from "@/types/domain";

const INITIAL: FormState = {};

function actionLabel(to: IssueStatus, from: IssueStatus): string {
  if (to === "in_progress" && from === "resolved") return t.issue.reopenAction;
  return `${t.issue.changeStatus} ${ISSUE_STATUS_LABELS[to]}`;
}

export function StatusControls({
  issueId,
  status,
}: {
  issueId: string;
  status: IssueStatus;
}) {
  const [state, formAction] = useActionState(transitionIssue, INITIAL);
  const [selected, setSelected] = useState<{
    to: IssueStatus;
    requiredReason: IssueEventReasonKind | null;
  } | null>(null);

  const transitions = allowedTransitions(status);

  if (transitions.length === 0) {
    return <p className="text-sm text-muted">{t.issue.terminal}</p>;
  }

  if (selected === null) {
    return (
      <div className="space-y-3">
        <FormError>{state.error}</FormError>
        <div className="flex flex-wrap gap-2">
          {transitions.map((tr) => (
            <Button
              key={tr.to}
              type="button"
              variant="secondary"
              onClick={() =>
                setSelected({ to: tr.to, requiredReason: tr.requiredReason })
              }
            >
              {actionLabel(tr.to, status)}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-md border border-border p-3"
    >
      <FormError>{state.error}</FormError>
      <input type="hidden" name="issue_id" value={issueId} />
      <input type="hidden" name="to_status" value={selected.to} />

      <p className="text-sm font-medium">{actionLabel(selected.to, status)}</p>

      {selected.requiredReason ? (
        <label className="block">
          <span className="text-sm">
            {t.issue.reasonLabels[selected.requiredReason]}
            <span className="text-danger"> *</span>
          </span>
          <textarea name="reason" rows={3} required className={inputClass} />
        </label>
      ) : null}

      <div className="flex gap-2">
        <SubmitButton label={t.common.save} />
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSelected(null)}
        >
          {t.common.cancel}
        </Button>
      </div>
    </form>
  );
}
