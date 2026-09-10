import Link from "next/link";
import { gate } from "@/components/PageGate";
import { listStores } from "@/lib/db";
import { Card, EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { t } from "@/lib/th";

export default async function StoresPage() {
  const g = await gate({ operationalOnly: true });
  if ("notice" in g) return g.notice;

  const stores = await listStores(g.session.supabase);

  return (
    <div className="space-y-4">
      <PageHeader title={t.stores.title} />
      <LinkButton href="/stores/new">+ {t.stores.add}</LinkButton>

      {stores.length === 0 ? (
        <EmptyState>{t.stores.empty}</EmptyState>
      ) : (
        <ul className="space-y-2">
          {stores.map((store) => (
            <li key={store.id}>
              <Link href={`/stores/${store.id}`} className="block">
                <Card className="transition-colors hover:border-accent">
                  <p className="font-medium">{store.name}</p>
                  {store.channel ? (
                    <p className="text-sm text-muted">{store.channel}</p>
                  ) : null}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
