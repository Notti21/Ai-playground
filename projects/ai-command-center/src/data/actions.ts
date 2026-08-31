export interface NextAction {
  title: string;
  detail: string;
}

export const nextActions: NextAction[] = [
  {
    title: "Decide how MCP servers connect into the agent system",
    detail: "This is how agents will reach real tools and data.",
  },
  {
    title: "Connect Recent Activity to a real agent log",
    detail: "Replace the empty state once agents actually run.",
  },
];
