export function Hero() {
  return (
    <section className="flex flex-col gap-4 py-16">
      <span className="text-xs font-medium uppercase tracking-widest text-accent">
        Personal AI Operating System
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Command Center
      </h1>
      <p className="max-w-xl text-base text-muted sm:text-lg">
        One place to plan, execute, review, and improve — where Plan, Do, Check,
        and Act agents turn ideas into structured execution across every
        project.
      </p>
    </section>
  );
}
