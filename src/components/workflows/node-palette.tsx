"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Play, Clock, Bot, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NodePaletteProps {
  agents: Array<{ name: string; role: string; team?: string }>;
  onAddNode: (type: string, data: Record<string, unknown>) => void;
}

const triggerOptions = [
  { type: "manual", label: "Manuell", icon: Play, color: "text-blue-400" },
  { type: "scheduled", label: "Geplant", icon: Clock, color: "text-amber-400" },
  { type: "event", label: "Event", icon: Zap, color: "text-purple-400" },
];

export function NodePalette({ agents, onAddNode }: NodePaletteProps) {
  return (
    <div className="w-56 shrink-0 border-l border-border bg-card/50">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Nodes</p>
        <p className="text-xs text-muted-foreground">Klicken zum Hinzufügen</p>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4 p-4">
          {/* Trigger Nodes */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Trigger
            </p>
            <div className="space-y-1">
              {triggerOptions.map((t) => {
                const Icon = t.icon;
                return (
                  <Button
                    key={t.type}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs"
                    onClick={() =>
                      onAddNode("trigger", {
                        label: t.label,
                        triggerType: t.type,
                      })
                    }
                  >
                    <Icon className={cn("h-3.5 w-3.5", t.color)} />
                    {t.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Agent Nodes */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Agents
            </p>
            <div className="space-y-1">
              {agents.map((agent) => (
                <Button
                  key={agent.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs"
                  onClick={() =>
                    onAddNode("agent", {
                      agentName: agent.name,
                      label: agent.name,
                    })
                  }
                >
                  <Bot className="h-3.5 w-3.5 text-blue-400" />
                  <span className="truncate">{agent.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Output Node */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Output
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() =>
                onAddNode("output", { label: "Fertig" })
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Fertig
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
