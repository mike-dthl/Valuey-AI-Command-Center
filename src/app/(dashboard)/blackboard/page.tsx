import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, AlertCircle, AlertTriangle, Info, Clock, Check, X } from "lucide-react";

const events = [
  {
    id: "1",
    type: "deal_closed",
    title: "Neuer Deal abgeschlossen",
    description: "Acme Corp — Website Redesign, Budget: 15.000 EUR",
    sourceTeam: "Sales",
    targetTeam: "Operations",
    priority: "urgent" as const,
    status: "pending" as const,
    time: "vor 5 Min.",
  },
  {
    id: "2",
    type: "bug_report",
    title: "Bug Report: Login-Seite",
    description: "Kunde meldet: Login-Seite lädt nicht nach Deployment",
    sourceTeam: "Operations",
    targetTeam: "Development",
    priority: "high" as const,
    status: "acknowledged" as const,
    time: "vor 15 Min.",
  },
  {
    id: "3",
    type: "feature_shipped",
    title: "Feature shipped: Dark Mode",
    description: "Dark Mode für Dashboard ist live. Changelog erstellt.",
    sourceTeam: "Development",
    targetTeam: "Content",
    priority: "normal" as const,
    status: "pending" as const,
    time: "vor 1 Std.",
  },
  {
    id: "4",
    type: "content_published",
    title: "Blog Post veröffentlicht",
    description: "AI Trends 2026 — 1.200 Wörter, LinkedIn-ready",
    sourceTeam: "Content",
    targetTeam: "Sales",
    priority: "normal" as const,
    status: "resolved" as const,
    time: "vor 3 Std.",
  },
  {
    id: "5",
    type: "capacity_update",
    title: "Kapazitäts-Update",
    description: "2 Projekt-Slots verfügbar ab nächster Woche",
    sourceTeam: "Operations",
    targetTeam: "Sales",
    priority: "low" as const,
    status: "pending" as const,
    time: "vor 5 Std.",
  },
];

const priorityConfig = {
  urgent: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  high: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  normal: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  low: { icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
};

const statusColors = {
  pending: "secondary",
  acknowledged: "info",
  in_progress: "warning",
  resolved: "success",
  dismissed: "secondary",
} as const;

export default function BlackboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blackboard</h2>
          <p className="text-sm text-muted-foreground">
            Event Queue — Inter-Team-Kommunikation
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Neues Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">Alle</Badge>
        <Badge variant="destructive" className="cursor-pointer">Urgent</Badge>
        <Badge variant="warning" className="cursor-pointer">High</Badge>
        <Badge variant="info" className="cursor-pointer">Normal</Badge>
        <Badge variant="secondary" className="cursor-pointer">Low</Badge>
      </div>

      {/* Events */}
      <div className="space-y-3">
        {events.map((event) => {
          const config = priorityConfig[event.priority];
          const Icon = config.icon;
          return (
            <Card key={event.id} className={cn("transition-colors hover:bg-accent/30", config.border)}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className={cn("mt-1 rounded-lg p-2", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Badge variant={statusColors[event.status]} className="text-[10px]">
                      {event.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {event.sourceTeam} → {event.targetTeam}
                    </span>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
