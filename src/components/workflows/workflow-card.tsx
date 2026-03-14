"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, ArrowRight, Zap, Clock } from "lucide-react";
import { WORKFLOW_TRIGGER_TYPES } from "@/lib/constants";
import type { Workflow, WorkflowTriggerType } from "@/types/database";

const triggerIcons = {
  manual: Play,
  scheduled: Clock,
  event: Zap,
} as const;

interface WorkflowCardProps {
  workflow: Workflow & { workflow_runs: { id: string }[] };
  onRun?: (id: string) => void;
}

export function WorkflowCard({ workflow, onRun }: WorkflowCardProps) {
  const triggerConfig = WORKFLOW_TRIGGER_TYPES[workflow.trigger_type as WorkflowTriggerType];
  const TriggerIcon = triggerIcons[workflow.trigger_type as keyof typeof triggerIcons] ?? Zap;

  // Extract agent names from steps
  const steps = workflow.steps as { nodes?: Array<{ type?: string; data?: { agentName?: string; label?: string } }> };
  const agentNames = (steps.nodes ?? [])
    .filter((n) => n.type === "agent")
    .map((n) => n.data?.agentName ?? n.data?.label ?? "Agent");

  const runCount = workflow.workflow_runs?.length ?? 0;

  return (
    <Link href={`/workflows/${workflow.id}`}>
      <Card className="transition-all hover:border-primary/30 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{workflow.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={workflow.is_active ? "success" : "secondary"}>
                {workflow.is_active ? "Aktiv" : "Inaktiv"}
              </Badge>
              {onRun && workflow.is_active && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRun(workflow.id);
                  }}
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {workflow.description && (
            <p className="mb-2 text-xs text-muted-foreground line-clamp-1">
              {workflow.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1">
            {agentNames.map((name, i) => (
              <span key={`${name}-${i}`} className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {name}
                </Badge>
                {i < agentNames.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TriggerIcon className={cn("h-3 w-3", triggerConfig?.color)} />
              {triggerConfig?.label ?? workflow.trigger_type}
            </span>
            <span>{runCount} Runs</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
