export interface NextAction {
  title: string;
  detail: string;
}

export const nextActions: NextAction[] = [
  {
    title: "Design the Plan / Do / Check / Act agent workflow",
    detail: "Decide how each agent hands off work to the next.",
  },
  {
    title: "Decide how MCP servers connect into the agent system",
    detail: "This is how agents will reach real tools and data.",
  },
  {
    title: "Turn Projects into real project pages",
    detail: "Start with CRM, WMS, and Automation.",
  },
  {
    title: "Connect Recent Activity to a real agent log",
    detail: "Replace the empty state once agents actually run.",
  },
];
