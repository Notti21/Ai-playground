import { agents } from "@/data/agents";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AgentSystem() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Agent System"
        title="Plan, Do, Check, Act"
        description="The operating loop behind every project in this system. You approve; the agents execute the loop."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent) => (
          <Card key={agent.key}>
            <agent.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              {agent.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-muted">{agent.role}</p>
            <p className="mt-3 text-sm text-muted">{agent.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
