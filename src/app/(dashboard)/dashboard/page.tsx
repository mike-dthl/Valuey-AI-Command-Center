"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Cpu,
  CheckCircle2,
  Users,
  FolderKanban,
  Bot,
  TrendingUp,
  TrendingDown,
  Plus,
  MessageSquare,
  Workflow,
  FileText,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useAgentsByTeam } from "@/hooks/use-agents";
import { useNotifications } from "@/hooks/use-notifications";
import { AgentStatusBadge } from "@/components/agents/agent-status-badge";
import type { AgentStatus } from "@/types/database";

interface KpiItem {
  key: string;
  title: string;
  icon: typeof DollarSign;
  prefix?: string;
  suffix?: string;
  color: string;
}

const kpiConfig: KpiItem[] = [
  { key: "revenue", title: "Umsatz (Monat)", icon: DollarSign, prefix: "€ ", color: "text-emerald-400" },
  { key: "apiCosts", title: "API Kosten", icon: Cpu, prefix: "€ ", color: "text-red-400" },
  { key: "tasksCompleted", title: "Tasks erledigt", icon: CheckCircle2, color: "text-blue-400" },
  { key: "activeClients", title: "Aktive Clients", icon: Users, color: "text-purple-400" },
  { key: "activeProjects", title: "Laufende Projekte", icon: FolderKanban, color: "text-amber-400" },
  { key: "agentCount", title: "Agenten", icon: Bot, color: "text-cyan-400" },
];

const teamColorMap: Record<string, string> = {
  content: "text-purple-400",
  sales: "text-blue-400",
  ops: "text-emerald-400",
  dev: "text-amber-400",
};

const quickActions = [
  { label: "Neuer Client", href: "/clients", icon: Users, color: "bg-purple-500/10 text-purple-400" },
  { label: "Neues Projekt", href: "/projects", icon: FolderKanban, color: "bg-amber-500/10 text-amber-400" },
  { label: "Agent Chat", href: "/agents", icon: MessageSquare, color: "bg-blue-500/10 text-blue-400" },
  { label: "Neuer Workflow", href: "/workflows/new", icon: Workflow, color: "bg-emerald-500/10 text-emerald-400" },
];

const notifTypeColors = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  urgent: "bg-red-500",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `vor ${diffHrs} Std.`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "gestern";
  return `vor ${diffDays} Tagen`;
}

interface ProjectInfo {
  id: string;
  name: string;
  status: string;
  client: { name: string } | null;
  tasks: { id: string }[];
}

export default function DashboardPage() {
  const { teams, loading } = useAgentsByTeam();
  const { notifications } = useNotifications(5);
  const [kpis, setKpis] = useState<Record<string, number>>({
    revenue: 0,
    apiCosts: 0,
    tasksCompleted: 0,
    activeClients: 0,
    activeProjects: 0,
    agentCount: 0,
  });
  const [recentProjects, setRecentProjects] = useState<ProjectInfo[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Fetch agent count from teams
  useEffect(() => {
    if (teams.length > 0) {
      const totalAgents = teams.reduce((sum, t) => sum + t.agents.length, 0);
      setKpis((prev) => ({ ...prev, agentCount: totalAgents }));
    }
  }, [teams]);

  // Fetch counts and recent projects
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [clientsRes, projectsRes, revenueRes] = await Promise.all([
          fetch("/api/clients?status=active"),
          fetch("/api/projects"),
          fetch("/api/analytics/revenue?months=1"),
        ]);
        if (clientsRes.ok) {
          const clients = await clientsRes.json();
          setKpis((prev) => ({ ...prev, activeClients: clients.length }));
        }
        if (projectsRes.ok) {
          const projects = await projectsRes.json();
          const active = projects.filter(
            (p: ProjectInfo) => p.status === "active" || p.status === "planning"
          );
          const taskCount = projects.reduce(
            (sum: number, p: ProjectInfo) => sum + (p.tasks?.length ?? 0),
            0
          );
          setKpis((prev) => ({
            ...prev,
            activeProjects: active.length,
            tasksCompleted: taskCount,
          }));
          setRecentProjects(projects.slice(0, 5));
        }
        if (revenueRes.ok) {
          const revenue = await revenueRes.json();
          setKpis((prev) => ({
            ...prev,
            revenue: revenue.totals?.totalIncome ?? 0,
            apiCosts: revenue.totals?.totalExpense ?? 0,
          }));
        }
      } catch {
        // Silently fail for KPIs
      } finally {
        setProjectsLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const busyAgents = teams.reduce(
    (sum, t) => sum + t.agents.filter((a) => a.status === "busy").length,
    0
  );
  const errorAgents = teams.reduce(
    (sum, t) => sum + t.agents.filter((a) => a.status === "error").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpiConfig.map((kpi) => {
          const Icon = kpi.icon;
          const value = kpis[kpi.key] ?? 0;
          const isPositive = kpi.key === "revenue" || kpi.key === "activeClients" || kpi.key === "activeProjects";
          return (
            <Card key={kpi.key} className="group transition-colors hover:border-border/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{kpi.title}</p>
                  <div className={cn("rounded-md p-1.5", kpi.color.replace("text-", "bg-").replace("400", "500/10"))}>
                    <Icon className={cn("h-3.5 w-3.5", kpi.color)} />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {kpi.prefix ?? ""}{value.toLocaleString("de-DE")}{kpi.suffix ?? ""}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    {value > 0 ? (
                      <>
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className={cn("text-xs", isPositive ? "text-emerald-400" : "text-red-400")}>
                          aktiv
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <Card className="cursor-pointer transition-all hover:border-border/80 hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={cn("rounded-lg p-2", action.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{action.label}</span>
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Teams + Activity Feed */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Agent Team Status — 2 cols */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Team Status</h2>
            {(busyAgents > 0 || errorAgents > 0) && (
              <div className="flex items-center gap-2">
                {busyAgents > 0 && (
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                    {busyAgents} aktiv
                  </Badge>
                )}
                {errorAgents > 0 && (
                  <Badge variant="outline" className="text-red-400 border-red-400/30">
                    {errorAgents} Fehler
                  </Badge>
                )}
              </div>
            )}
          </div>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={cn("text-sm font-semibold", teamColorMap[team.slug] ?? "text-zinc-400")}>
                        {team.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px]">
                        {team.agents.length} Agents
                      </Badge>
                    </div>
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
                                agent.status === "busy" ? "bg-amber-400 animate-pulse" :
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

        {/* Right Sidebar: Activity + Recent Projects */}
        <div className="space-y-4">
          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Aktivität
                </CardTitle>
                <Link href="/blackboard" className="text-xs text-muted-foreground hover:text-foreground">
                  Alle
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine Aktivitäten
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          notifTypeColors[n.type]
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-tight">{n.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Projekte
                </CardTitle>
                <Link href="/projects" className="text-xs text-muted-foreground hover:text-foreground">
                  Alle
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              {projectsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine Projekte
                </p>
              ) : (
                <div className="space-y-2">
                  {recentProjects.map((project) => (
                    <Link
                      key={project.id}
                      href="/projects"
                      className="flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-accent/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{project.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {project.client?.name ?? "Kein Client"} &middot; {project.tasks?.length ?? 0} Tasks
                        </p>
                      </div>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
