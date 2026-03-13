import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Bot } from "lucide-react";
import { AGENT_STATUSES } from "@/lib/constants";

const teams = [
  {
    name: "Marketing & Content",
    slug: "content",
    color: "border-purple-500/30",
    headerColor: "text-purple-400",
    agents: [
      { name: "Researcher", role: "Themen-Recherche & Trends", status: "idle" as const, tasks: 23 },
      { name: "Writer", role: "Content-Erstellung", status: "busy" as const, tasks: 45 },
      { name: "Repurposer", role: "Multi-Format Umwandlung", status: "idle" as const, tasks: 38 },
      { name: "Scheduler", role: "Veröffentlichungsplanung", status: "idle" as const, tasks: 52 },
    ],
  },
  {
    name: "Sales & Pipeline",
    slug: "sales",
    color: "border-blue-500/30",
    headerColor: "text-blue-400",
    agents: [
      { name: "Prospector", role: "Lead-Identifikation", status: "idle" as const, tasks: 89 },
      { name: "Qualifier", role: "Lead-Bewertung", status: "idle" as const, tasks: 67 },
      { name: "Outreach-Writer", role: "Personalisierte Ansprache", status: "busy" as const, tasks: 34 },
    ],
  },
  {
    name: "Operations & Delivery",
    slug: "ops",
    color: "border-emerald-500/30",
    headerColor: "text-emerald-400",
    agents: [
      { name: "Project Manager", role: "Projektstatus & Deadlines", status: "busy" as const, tasks: 156 },
      { name: "Client Communicator", role: "Kundenkommunikation", status: "idle" as const, tasks: 42 },
      { name: "Finance Agent", role: "Rechnungen & Cashflow", status: "idle" as const, tasks: 28 },
      { name: "Compliance Agent", role: "DSGVO & Verträge", status: "offline" as const, tasks: 11 },
    ],
  },
  {
    name: "Development & Product",
    slug: "dev",
    color: "border-amber-500/30",
    headerColor: "text-amber-400",
    agents: [
      { name: "Planner", role: "Feature-Planung & Specs", status: "idle" as const, tasks: 34 },
      { name: "Developer", role: "Code & Implementierung", status: "busy" as const, tasks: 78 },
      { name: "Reviewer", role: "Code-Reviews & Security", status: "idle" as const, tasks: 45 },
    ],
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Teams</h2>
          <p className="text-sm text-muted-foreground">
            4 Teams &middot; 14 Agenten &middot; 4 aktiv
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Neuer Agent
        </Button>
      </div>

      {teams.map((team) => (
        <div key={team.slug}>
          <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wider", team.headerColor)}>
            {team.name}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.agents.map((agent) => {
              const statusConfig = AGENT_STATUSES[agent.status];
              return (
                <Card
                  key={agent.name}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/30 hover:shadow-md",
                    team.color
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Bot className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Badge
                        variant={
                          agent.status === "idle"
                            ? "success"
                            : agent.status === "busy"
                            ? "warning"
                            : agent.status === "offline"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 text-base">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{agent.tasks} Tasks</span>
                      <div className="flex items-center gap-1">
                        <div className={cn("h-1.5 w-1.5 rounded-full", statusConfig.bg)} />
                        <span className={statusConfig.color}>{statusConfig.label}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
