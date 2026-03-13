"use client";

import { useState, useEffect, useCallback } from "react";
import { useUIStore } from "@/stores/ui-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  PanelRightClose,
  Plus,
  Play,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";
import type { BlackboardEvent } from "@/types/database";

const priorityConfig = {
  urgent: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  high: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  normal: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
  low: { icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10" },
} as const;

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

export function CommandPanel() {
  const { commandPanelOpen, toggleCommandPanel } = useUIStore();
  const [events, setEvents] = useState<BlackboardEvent[]>([]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/blackboard?limit=10");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Realtime updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("command-panel-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blackboard_events" },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

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
          {events.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Keine Events
            </p>
          ) : (
            events.map((event) => {
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
                      {event.payload && "description" in event.payload && event.payload.description ? (
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {String(event.payload.description)}
                        </p>
                      ) : null}
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
                        <span className="text-[10px] text-muted-foreground">
                          {getTimeAgo(event.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
