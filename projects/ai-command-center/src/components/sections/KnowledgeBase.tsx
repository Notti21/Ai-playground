import { knowledgeItems } from "@/data/knowledge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function KnowledgeBase() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Knowledge Base"
        title="What the system knows"
        description="The accumulated prompts, notes, and decisions behind this project."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {knowledgeItems.map((item) => (
          <Card key={item.name}>
            <item.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              {item.name}
            </h3>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
