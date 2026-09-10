"use client";

import { useActionState } from "react";
import { createFollowUp, type FormState } from "@/app/actions";
import { FormError, SelectField, TextAreaField, TextField } from "@/components/ui";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FOLLOW_UP_TYPE_LABELS, t } from "@/lib/th";
import type { FollowUpType } from "@/types/domain";

const INITIAL: FormState = {};

const TYPE_OPTIONS = (
  ["in_person", "phone", "chat", "other"] as FollowUpType[]
).map((value) => ({ value, label: FOLLOW_UP_TYPE_LABELS[value] }));

export function FollowUpForm({
  storeId,
  defaultPerformedBy,
  today,
}: {
  storeId: string;
  defaultPerformedBy: string;
  today: string;
}) {
  const [state, formAction] = useActionState(createFollowUp, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <FormError>{state.error}</FormError>
      <input type="hidden" name="store_id" value={storeId} />

      <TextField
        type="date"
        label={t.followUp.activityDate}
        hint={t.followUp.activityDateHint}
        name="activity_date"
        required
        defaultValue={today}
        error={state.fieldErrors?.activity_date}
      />
      <SelectField
        label={t.followUp.type}
        name="follow_up_type"
        options={TYPE_OPTIONS}
        required
        error={state.fieldErrors?.follow_up_type}
      />
      <TextField
        label={t.followUp.performedBy}
        hint={t.followUp.performedByHint}
        name="performed_by"
        required
        defaultValue={defaultPerformedBy}
        error={state.fieldErrors?.performed_by}
      />
      <TextAreaField
        label={t.followUp.notes}
        hint={t.followUp.notesHint}
        name="notes"
        required
        rows={6}
        error={state.fieldErrors?.notes}
      />
      <SubmitButton label={t.common.save} />
    </form>
  );
}
