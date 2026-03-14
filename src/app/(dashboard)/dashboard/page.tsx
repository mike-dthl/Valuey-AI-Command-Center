"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Cpu,
  CheckCircle2,
  Users,
  FolderKanban,
  Bot,
  TrendingUp,
} from "lucide-react";
import { useAgentsByTeam } from "@/hooks/use-agents";
import { AgentStatusBadge } from "@/components/agents/agent-status-badge";
import type { AgentStatus } from "@/types/database";

const kpiConfig = [
  { key: "revenue", title: "Umsatz (Monat)", icon: DollarSign, prefix: "€ " },
  { key: "apiCosts", title: "API Kosten", icon: Cpu, prefix: "€ " },
  { key: "tasksCompleted", title: "Tasks erledigt", icon: CheckCircle2 },
  { key: "activeClients", title: "Aktive Clients", icon: Users },
  { key: "activeProjects", title: "Laufende Projekte", icon: FolderKanban },
  { key: "agentCount", title: "Agenten", icon: Bot },
];

const teamColorMap: Record<string, string> = {
  content: "text-purple-400",
  sales: "text-blue-400",
  ops: "text-emerald-400",
  dev: "text-amber-400",
};

export default function DashboardPage() {
  const { teams, loading } = useAgentsByTeam();
  const [kpis, setKpis] = useState<Record<string, number>>({
    revenue: 0,
    apiCosts: 0,
    tasksCompleted: 0,
    activeClients: 0,
    activeProjects: 0,
    agentCount: 0,
  });

  // Fetch agent count from teams
  useEffect(() => {
    if (teams.length > 0) {
      const totalAgents = teams.reduce((sum, t) => sum + t.agents.length, 0);
      setKpis((prev) => ({ ...prev, agentCount: totalAgents }));
    }
  }, [teams]);

  // Fetch client and project counts
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          fetch("/api/clients?status=active"),
          fetch("/api/projects"),
        ]);
        if (clientsRes.ok) {
          const clients = await clientsRes.json();
          setKpis((prev) => ({ ...prev, activeClients: clients.length }));
        }
        if (projectsRes.ok) {
          const projects = await projectsRes.json();
          const active = projects.filter(
            (p: { status: string }) => p.status === "active" || p.status === "planning"
          );
          const completed = projects.reduce(
            (sum: number, p: { tasks?: { id: string }[] }) =>
              sum + (p.tasks?.length ?? 0),
            0
          );
          setKpis((prev) => ({
            ...prev,
            activeProjects: active.length,
            tasksCompleted: completed,
          }));
        }
      } catch {
        // Silently fail for KPIs
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpiConfig.map((kpi) => {
          const Icon = kpi.icon;
          const value = kpis[kpi.key] ?? 0;
          return (
            <Card key={kpi.key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{kpi.title}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {kpi.prefix ?? ""}{value.toLocaleString("de-DE")}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">—</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent Team Status */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Team Status</h2>
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-32 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader className="pb-3">
                  <CardTitle className={cn("text-sm font-semibold", teamColorMap[team.slug] ?? "text-zinc-400")}>
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    {team.agents.map((agent) => (
                      <Link
                        key={agent.id}
                        href={`/agents/${agent.id}`}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              agent.status === "idle" ? "bg-emerald-400" :
                              agent.status === "busy" ? "bg-amber-400" :
                              agent.status === "error" ? "bg-red-400" : "bg-zinc-500"
                            )}
                          />
                          <span className="text-sm">{agent.name}</span>
                        </div>
                        <AgentStatusBadge status={agent.status as AgentStatus} />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
