"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AgentGrid } from "@/components/agents/agent-grid";
import { useAgentsByTeam } from "@/hooks/use-agents";

export default function AgentsPage() {
  const { teams } = useAgentsByTeam();
  const agentCount = teams.reduce((sum, t) => sum + t.agents.length, 0);
  const busyCount = teams.reduce((sum, t) => sum + t.agents.filter((a) => a.status === "busy").length, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Teams</h2>
          <p className="text-sm text-muted-foreground">
            {teams.length} Teams &middot; {agentCount} Agenten &middot; {busyCount} aktiv
          </p>
        </div>
        <Link href="/agents/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Neuer Agent
          </Button>
        </Link>
      </div>
      <AgentGrid />
    </div>
  );
}
