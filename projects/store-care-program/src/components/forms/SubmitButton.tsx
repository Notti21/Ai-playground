"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui";
import { t } from "@/lib/th";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? t.common.saving : label}
    </Button>
  );
}
