"use client";

import { useActionState, useState } from "react";
import { createIssue, type FormState } from "@/app/actions";
import {
  FieldError,
  FormError,
  TextAreaField,
  TextField,
  inputClass,
} from "@/components/ui";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { t } from "@/lib/th";

const INITIAL: FormState = {};

type OwnerOption = { id: string; label: string };

export function IssueForm({
  storeId,
  followUpId,
  users,
  today,
}: {
  storeId: string;
  followUpId?: string;
  users: OwnerOption[];
  today: string;
}) {
  const [state, formAction] = useActionState(createIssue, INITIAL);
  const [ownerMode, setOwnerMode] = useState<"user" | "name">(
    users.length > 0 ? "user" : "name",
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormError>{state.error}</FormError>
      <input type="hidden" name="store_id" value={storeId} />
      {followUpId ? (
        <input type="hidden" name="follow_up_id" value={followUpId} />
      ) : null}

      <TextAreaField
        label={t.issue.description}
        name="description"
        required
        rows={4}
        error={state.fieldErrors?.description}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          {t.issue.owner} <span className="text-danger">*</span>
        </legend>
        <p className="text-xs text-muted">{t.issue.ownerHint}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          {users.length > 0 ? (
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="owner_mode"
                value="user"
                checked={ownerMode === "user"}
                onChange={() => setOwnerMode("user")}
              />
              {t.issue.ownerPickUser}
            </label>
          ) : null}
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="owner_mode"
              value="name"
              checked={ownerMode === "name"}
              onChange={() => setOwnerMode("name")}
            />
            {t.issue.ownerTypeName}
          </label>
        </div>

        {ownerMode === "user" ? (
          <select name="owner_user_id" className={inputClass} defaultValue={users[0]?.id}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="owner_name"
            placeholder={t.issue.ownerNamePlaceholder}
            className={inputClass}
          />
        )}
        <FieldError>{state.fieldErrors?.owner}</FieldError>
      </fieldset>

      <TextField
        type="date"
        label={t.issue.dueDate}
        name="due_date"
        required
        defaultValue={today}
        error={state.fieldErrors?.due_date}
      />
      <SubmitButton label={t.common.save} />
    </form>
  );
}
