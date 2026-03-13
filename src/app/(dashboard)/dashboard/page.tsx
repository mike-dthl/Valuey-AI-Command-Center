import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { AGENT_STATUSES } from "@/lib/constants";

// Placeholder KPI data
const kpis = [
  {
    title: "Umsatz (Monat)",
    value: "\u20AC 12.450",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "API Kosten",
    value: "\u20AC 342",
    change: "-8%",
    trend: "down",
    icon: Cpu,
  },
  {
    title: "Tasks erledigt",
    value: "47",
    change: "+12",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    title: "Aktive Clients",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Users,
  },
  {
    title: "Laufende Projekte",
    value: "5",
    change: "0",
    trend: "neutral",
    icon: FolderKanban,
  },
  {
    title: "Agenten aktiv",
    value: "14",
    change: "4 Teams",
    trend: "neutral",
    icon: Bot,
  },
];

type AgentStatus = "idle" | "busy" | "error" | "offline";

// Placeholder team data
const teams: Array<{
  name: string;
  color: string;
  agents: Array<{ name: string; status: AgentStatus; task?: string }>;
}> = [
  {
    name: "Marketing & Content",
    color: "text-purple-400",
    agents: [
      { name: "Researcher", status: "idle" as const },
      { name: "Writer", status: "busy" as const, task: "Blog Draft" },
      { name: "Repurposer", status: "idle" as const },
      { name: "Scheduler", status: "idle" as const },
    ],
  },
  {
    name: "Sales & Pipeline",
    color: "text-blue-400",
    agents: [
      { name: "Prospector", status: "idle" as const },
      { name: "Qualifier", status: "idle" as const },
      { name: "Outreach-Writer", status: "busy" as const, task: "LinkedIn DM" },
    ],
  },
  {
    name: "Operations & Delivery",
    color: "text-emerald-400",
    agents: [
      { name: "Project Manager", status: "busy" as const, task: "Status Update" },
      { name: "Client Communicator", status: "idle" as const },
      { name: "Finance Agent", status: "idle" as const },
      { name: "Compliance Agent", status: "offline" as const },
    ],
  },
  {
    name: "Development & Product",
    color: "text-amber-400",
    agents: [
      { name: "Planner", status: "idle" as const },
      { name: "Developer", status: "busy" as const, task: "Feature #42" },
      { name: "Reviewer", status: "idle" as const },
    ],
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{kpi.title}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {kpi.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                    {kpi.trend === "down" && <TrendingDown className="h-3 w-3 text-emerald-400" />}
                    <span
                      className={cn(
                        "text-xs",
                        kpi.trend === "up" ? "text-emerald-400" : "text-muted-foreground"
                      )}
                    >
                      {kpi.change}
                    </span>
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
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.name}>
              <CardHeader className="pb-3">
                <CardTitle className={cn("text-sm font-semibold", team.color)}>
                  {team.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  {team.agents.map((agent) => {
                    const statusConfig = AGENT_STATUSES[agent.status];
                    return (
                      <div
                        key={agent.name}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn("h-2 w-2 rounded-full", statusConfig.bg)}
                          />
                          <span className="text-sm">{agent.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {agent.status === "busy" && "task" in agent && (
                            <span className="text-xs text-muted-foreground">
                              {agent.task}
                            </span>
                          )}
                          <Badge
                            variant={
                              agent.status === "idle"
                                ? "success"
                                : agent.status === "busy"
                                ? "warning"
                                : agent.status === "error"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
