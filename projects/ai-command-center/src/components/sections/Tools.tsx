import { tools } from "@/data/tools";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Tools() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Tools"
        title="What powers the system"
        description="The tools the agents run on and connect through."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Card key={tool.name}>
            <tool.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              {tool.name}
            </h3>
            <p className="mt-2 text-sm text-muted">{tool.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
