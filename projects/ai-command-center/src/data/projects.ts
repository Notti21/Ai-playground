import { Boxes, Building2, Workflow, Bot, type LucideIcon } from "lucide-react";

export interface Project {
  name: string;
  description: string;
  status: "In progress" | "Planned" | "Idea";
  icon: LucideIcon;
}

export const projects: Project[] = [
  {
    name: "Jula AI OS",
    description:
      "The umbrella system connecting agents, projects, and tools into one operating model.",
    status: "In progress",
    icon: Bot,
  },
  {
    name: "CRM",
    description: "Customer relationship management for the business.",
    status: "Idea",
    icon: Building2,
  },
  {
    name: "WMS",
    description: "Warehouse management system for inventory and operations.",
    status: "Idea",
    icon: Boxes,
  },
  {
    name: "Automation",
    description: "Workflow automation across Gmail, Drive, and other APIs.",
    status: "Planned",
    icon: Workflow,
  },
];
