import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          AI Command Center
        </span>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            Foundation phase
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
