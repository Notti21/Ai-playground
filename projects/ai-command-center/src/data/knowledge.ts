import { BookText, StickyNote, Scale, type LucideIcon } from "lucide-react";

export interface KnowledgeItem {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const knowledgeItems: KnowledgeItem[] = [
  {
    name: "Prompts",
    description: "Reusable prompts and AI instructions.",
    icon: StickyNote,
  },
  {
    name: "Notes",
    description: "Architecture notes and learning notes.",
    icon: BookText,
  },
  {
    name: "Decisions",
    description: "Key design decisions and the reasoning behind them.",
    icon: Scale,
  },
];
