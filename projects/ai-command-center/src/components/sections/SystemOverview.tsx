import { Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SystemOverview() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="System Overview"
        title="How the parts fit together"
        description="Jula AI OS is the operating model for running the company. The AI Command Center is the dashboard and interface into it. CRM, WMS, Automation, and Store Care Program are the areas that operating model is being applied to."
      />
      <Card>
        <Layers className="h-5 w-5 text-accent" strokeWidth={1.75} />
        <p className="mt-4 text-sm text-muted">
          Jula AI OS is in progress. The operating model is being built up progressively
          through its parts — it is not a finished product or a completed system.
        </p>
      </Card>
    </section>
  );
}
