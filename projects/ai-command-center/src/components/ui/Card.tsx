import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50 ${className}`}
    >
      {children}
    </div>
  );
}
