import { Boxes, Building2, Workflow, Store, type LucideIcon } from "lucide-react";

export interface Project {
  name: string;
  description: string;
  status: "In progress" | "Planned" | "Idea";
  icon: LucideIcon;
  slug?: string;
}

export const projects: Project[] = [
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
    description:
      "WMS is a project area for defining how Jula's Herb tracks inventory, stock movement, stock accuracy, and location-based inventory across warehouse and retail-related stock locations more systematically. The exact users, workflows, metrics, and implementation plan are not confirmed yet.",
    status: "Idea",
    icon: Boxes,
    slug: "wms",
  },
  {
    name: "Automation",
    description:
      "Automation is a project area for defining how Jula's Herb can use AI, workflow automation, and internal tools to reduce repetitive work, improve follow-up, and support business operations more systematically. The exact users, workflows, metrics, and implementation plan are not confirmed yet.",
    status: "Idea",
    icon: Workflow,
    slug: "automation",
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
