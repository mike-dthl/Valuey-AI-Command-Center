"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AgentGrid } from "@/components/agents/agent-grid";
import { useAgents } from "@/hooks/use-agents";

export default function AgentsPage() {
  const { agents } = useAgents();
  const busyCount = agents.filter((a) => a.status === "busy").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Teams</h2>
          <p className="text-sm text-muted-foreground">
            4 Teams &middot; {agents.length} Agenten &middot; {busyCount} aktiv
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
