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
          This section is a placeholder for a live feed of agent runs.
          Today, agent activity is tracked in checkpoint notes and PDCA
          cycle folders elsewhere in the repo, not rendered here yet.
        </p>
      </Card>
    </section>
  );
}
