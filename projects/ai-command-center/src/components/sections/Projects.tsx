import { projects } from "@/data/projects";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Projects() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Projects"
        title="What the system is being applied to"
        description="The real business systems this operating model is meant to build and run."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.name}>
            <div className="flex items-start justify-between">
              <project.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
                {project.status}
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              {project.name}
            </h3>
            <p className="mt-2 text-sm text-muted">{project.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
