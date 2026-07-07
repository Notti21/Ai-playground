import { Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function RecentActivity() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Recent Activity"
        title="What the agents have done"
      />
      <Card className="flex flex-col items-center gap-3 py-12 text-center">
        <Activity className="h-6 w-6 text-muted" strokeWidth={1.5} />
        <p className="max-w-sm text-sm text-muted">
          No activity yet. Once the Plan, Do, Check, and Act agents start
          running, their actions will appear here.
        </p>
      </Card>
    </section>
  );
}
