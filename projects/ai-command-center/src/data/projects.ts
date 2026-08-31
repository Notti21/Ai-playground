import { Boxes, Building2, Workflow, Bot, Store, type LucideIcon } from "lucide-react";

export interface Project {
  name: string;
  description: string;
  status: "In progress" | "Planned" | "Idea";
  icon: LucideIcon;
  slug?: string;
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
    description:
      "CRM is a project area for defining how Jula's Herb manages customer relationships, customer data, follow-up, retention, and repeat-purchase activities more systematically. The exact users, workflows, metrics, and implementation plan are not confirmed yet.",
    status: "Idea",
    icon: Building2,
    slug: "crm",
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
  {
    name: "Store Care Program",
    description:
      "Store Care Program is a business project for helping Jula's Herb manage and support retail stores more systematically. The goal is to create a clearer operating flow for store follow-up, store visit/checklist, issue tracking, sales support, merchandising support, and communication between the company and store/frontline teams.",
    status: "Idea",
    icon: Store,
    slug: "store-care-program",
  },
];
