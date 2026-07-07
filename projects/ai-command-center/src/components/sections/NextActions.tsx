import { nextActions } from "@/data/actions";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function NextActions() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Next Actions"
        title="What's next"
        description="The current seed roadmap for turning this into a real operating system."
      />
      <Card className="divide-y divide-border p-0">
        {nextActions.map((action) => (
          <div key={action.title} className="flex flex-col gap-1 px-6 py-4">
            <span className="text-sm font-medium text-foreground">
              {action.title}
            </span>
            <span className="text-sm text-muted">{action.detail}</span>
          </div>
        ))}
      </Card>
    </section>
  );
}
