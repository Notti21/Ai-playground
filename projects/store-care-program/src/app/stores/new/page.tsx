import { gate } from "@/components/PageGate";
import { PageHeader } from "@/components/ui";
import { StoreForm } from "@/components/forms/StoreForm";
import { t } from "@/lib/th";

export default async function NewStorePage() {
  const g = await gate({ operationalOnly: true });
  if ("notice" in g) return g.notice;

  return (
    <div className="space-y-4">
      <PageHeader
        title={t.stores.addTitle}
        backHref="/stores"
        backLabel={t.stores.title}
      />
      <StoreForm />
    </div>
  );
}
