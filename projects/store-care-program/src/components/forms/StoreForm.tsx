"use client";

import { useActionState } from "react";
import { createStore, type FormState } from "@/app/actions";
import { FormError, TextField } from "@/components/ui";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { t } from "@/lib/th";

const INITIAL: FormState = {};

export function StoreForm() {
  const [state, formAction] = useActionState(createStore, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <FormError>{state.error}</FormError>
      <TextField
        label={t.stores.name}
        name="name"
        required
        error={state.fieldErrors?.name}
      />
      <TextField label={t.stores.channel} name="channel" />
      <TextField label={t.stores.location} name="location" />
      <TextField label={t.stores.contact} name="contact" />
      <SubmitButton label={t.common.save} />
    </form>
  );
}
