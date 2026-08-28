import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects
    .filter((project) => project.slug)
    .map((project) => ({ slug: project.slug as string }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← Back to home
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <project.icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {project.name}
        </h1>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
          {project.status}
        </span>
      </div>
      <p className="mt-6 max-w-2xl text-sm text-muted sm:text-base">
        {project.description}
      </p>
      {project.status === "Idea" && (
        <p className="mt-6 max-w-2xl text-sm text-muted sm:text-base">
          Current status: this project is at the idea and early planning stage. No system has
          been built for it yet.
        </p>
      )}
    </main>
  );
}
