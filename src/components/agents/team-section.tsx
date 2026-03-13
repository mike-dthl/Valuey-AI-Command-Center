import { cn } from "@/lib/utils";
import { AgentCard } from "./agent-card";
import type { Agent } from "@/types/database";

const teamColorMap: Record<string, { header: string; border: string }> = {
  content: { header: "text-purple-400", border: "border-purple-500/30" },
  sales: { header: "text-blue-400", border: "border-blue-500/30" },
  ops: { header: "text-emerald-400", border: "border-emerald-500/30" },
  dev: { header: "text-amber-400", border: "border-amber-500/30" },
};

interface TeamSectionProps {
  name: string;
  slug: string;
  agents: Agent[];
}

export function TeamSection({ name, slug, agents }: TeamSectionProps) {
  const colors = teamColorMap[slug] ?? { header: "text-zinc-400", border: "border-zinc-500/30" };

  return (
    <div>
      <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wider", colors.header)}>
        {name}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents
          .sort((a, b) => a.position - b.position)
          .map((agent) => (
            <AgentCard key={agent.id} agent={agent} teamColor={colors.border} />
          ))}
      </div>
    </div>
  );
}
