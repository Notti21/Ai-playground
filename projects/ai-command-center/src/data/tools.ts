import { TerminalSquare, GitBranch, Plug, Sparkles, type LucideIcon } from "lucide-react";

export interface Tool {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const tools: Tool[] = [
  {
    name: "Claude Code",
    description: "AI pair-programmer used to design and build this system.",
    icon: TerminalSquare,
  },
  {
    name: "Codex",
    description: "OpenAI's coding agent, used for comparison and experimentation.",
    icon: Sparkles,
  },
  {
    name: "GitHub",
    description: "Version control and collaboration for every project in this system.",
    icon: GitBranch,
  },
  {
    name: "MCP",
    description: "Model Context Protocol — connects AI agents to real tools and data.",
    icon: Plug,
  },
];
