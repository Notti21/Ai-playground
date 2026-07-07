interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-widest text-accent">
        {eyebrow}
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-muted sm:text-base">{description}</p>
      )}
    </div>
  );
}
