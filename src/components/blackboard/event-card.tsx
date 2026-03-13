"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, Clock, Check, X, ArrowRight } from "lucide-react";
import type { BlackboardEvent } from "@/types/database";

const priorityConfig = {
  urgent: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  high: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  normal: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  low: { icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
} as const;

const statusVariant = {
  pending: "secondary",
  acknowledged: "info",
  in_progress: "warning",
  resolved: "success",
  dismissed: "secondary",
} as const;

interface EventCardProps {
  event: BlackboardEvent & {
    source_team?: { name: string } | null;
    target_team?: { name: string } | null;
  };
  onUpdateStatus?: (id: string, status: string) => void;
}

export function EventCard({ event, onUpdateStatus }: EventCardProps) {
  const config = priorityConfig[event.priority];
  const Icon = config.icon;

  const timeAgo = getTimeAgo(event.created_at);

  return (
    <Card className={cn("transition-colors hover:bg-accent/30", config.border)}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className={cn("mt-1 rounded-lg p-2", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{event.title}</p>
              {event.payload && "description" in event.payload && event.payload.description ? (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {String(event.payload.description)}
                </p>
              ) : null}
            </div>
            {event.status !== "resolved" && event.status !== "dismissed" && onUpdateStatus && (
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateStatus(event.id, "resolved")}
                  title="Erledigt"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateStatus(event.id, "dismissed")}
                  title="Verwerfen"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Badge variant={statusVariant[event.status]} className="text-[10px]">
              {event.status}
            </Badge>
            {(event.source_team || event.target_team) && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {event.source_team?.name ?? "—"}
                <ArrowRight className="h-3 w-3" />
                {event.target_team?.name ?? "—"}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
