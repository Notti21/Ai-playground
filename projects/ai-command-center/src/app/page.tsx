import { Hero } from "@/components/sections/Hero";
import { AgentSystem } from "@/components/sections/AgentSystem";
import { Projects } from "@/components/sections/Projects";
import { Tools } from "@/components/sections/Tools";
import { KnowledgeBase } from "@/components/sections/KnowledgeBase";
import { RecentActivity } from "@/components/sections/RecentActivity";
import { NextActions } from "@/components/sections/NextActions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      <Hero />
      <AgentSystem />
      <Projects />
      <Tools />
      <KnowledgeBase />
      <RecentActivity />
      <NextActions />
    </main>
  );
}
