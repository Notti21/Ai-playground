import { ClipboardList, Hammer, SearchCheck, RefreshCcw, type LucideIcon } from "lucide-react";

export interface Agent {
  key: "plan" | "do" | "check" | "act";
  name: string;
  role: string;
  description: string;
  icon: LucideIcon;
}

export const agents: Agent[] = [
  {
    key: "plan",
    name: "Plan",
    role: "Understands goals",
    description:
      "Breaks down work, identifies risks, and proposes execution plans for approval.",
    icon: ClipboardList,
  },
  {
    key: "do",
    name: "Do",
    role: "Executes",
    description:
      "Implements approved plans: writes code, creates documents, builds workflows.",
    icon: Hammer,
  },
  {
    key: "check",
    name: "Check",
    role: "Reviews",
    description:
      "Checks logic, challenges assumptions, tests outputs, and finds problems.",
    icon: SearchCheck,
  },
  {
    key: "act",
    name: "Act",
    role: "Improves",
    description:
      "Summarizes learnings, updates documentation, and suggests next actions.",
    icon: RefreshCcw,
  },
];
