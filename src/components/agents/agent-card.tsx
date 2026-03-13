"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentStatusBadge } from "./agent-status-badge";
import type { Agent } from "@/types/database";

const statusDotColors = {
  idle: "bg-emerald-400",
  busy: "bg-amber-400",
  error: "bg-red-400",
  offline: "bg-zinc-500",
} as const;

interface AgentCardProps {
  agent: Agent;
  teamColor?: string;
}

export function AgentCard({ agent, teamColor }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card
        className={cn(
          "cursor-pointer transition-all hover:border-primary/30 hover:shadow-md",
          teamColor
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Bot className="h-5 w-5 text-muted-foreground" />
            </div>
            <AgentStatusBadge status={agent.status} />
          </div>
          <CardTitle className="mt-2 text-base">{agent.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{agent.role}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{agent.model.split("-").slice(0, 2).join(" ")}</span>
            <div className="flex items-center gap-1">
              <div className={cn("h-1.5 w-1.5 rounded-full", statusDotColors[agent.status])} />
              <span>{agent.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
