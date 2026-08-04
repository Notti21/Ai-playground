import { ListChecks } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PdcaStatus() {
  return (
    <section className="py-12">
      <SectionHeading
        eyebrow="Workflow Status"
        title="The loop runs end-to-end"
        description="A snapshot of how Plan, Do, Check, and Act actually operate today, not an aspirational roadmap."
      />
      <Card>
        <ListChecks className="h-5 w-5 text-accent" strokeWidth={1.75} />
        <p className="mt-4 text-sm text-muted">
          A single command sequences a full cycle: Plan drafts a plan, you approve it, Do
          implements it in this same session, Check verifies the result, and Act closes the
          cycle — with a second, independent approval required before anything is committed.
        </p>
        <p className="mt-3 text-sm text-muted">
          Plan, Check, and Act run as dedicated subagents; Do always runs in the main session,
          since implementing changes needs broader tool access than reviewing or planning them.
        </p>
      </Card>
    </section>
  );
}
