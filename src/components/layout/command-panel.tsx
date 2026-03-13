"use client";

import { useUIStore } from "@/stores/ui-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PanelRightClose,
  Plus,
  Play,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";

// Placeholder events for the initial layout
const placeholderEvents = [
  {
    id: "1",
    type: "deal_closed",
    title: "Neuer Deal abgeschlossen",
    description: "Acme Corp — Website Redesign",
    priority: "urgent" as const,
    time: "vor 5 Min.",
  },
  {
    id: "2",
    type: "bug_report",
    title: "Bug gemeldet",
    description: "Login-Seite lädt nicht",
    priority: "high" as const,
    time: "vor 15 Min.",
  },
  {
    id: "3",
    type: "content_published",
    title: "Content veröffentlicht",
    description: "LinkedIn Post: AI Trends 2026",
    priority: "normal" as const,
    time: "vor 1 Std.",
  },
];

const priorityConfig = {
  urgent: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  high: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  normal: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
  low: { icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10" },
};

export function CommandPanel() {
  const { commandPanelOpen, toggleCommandPanel } = useUIStore();

  if (!commandPanelOpen) return null;

  return (
    <aside className="flex w-72 flex-col border-l border-border bg-background">
      {/* Panel Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">Event Queue</h2>
        <button
          onClick={toggleCommandPanel}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {/* Events */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {placeholderEvents.map((event) => {
            const config = priorityConfig[event.priority];
            const Icon = config.icon;
            return (
              <div
                key={event.id}
                className={cn(
                  "rounded-lg border border-border p-3 transition-colors hover:bg-accent/50",
                  config.bg
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{event.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {event.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant={
                          event.priority === "urgent"
                            ? "destructive"
                            : event.priority === "high"
                            ? "warning"
                            : "info"
                        }
                        className="text-[10px]"
                      >
                        {event.priority.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Plus className="h-3 w-3" /> Neuer Task
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Play className="h-3 w-3" /> Workflow starten
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Plus className="h-3 w-3" /> Neues Event
          </Button>
        </div>
      </div>
    </aside>
  );
}
