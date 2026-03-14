"use client";

import { Badge } from "@/components/ui/badge";
import { WORKFLOW_RUN_STATUSES } from "@/lib/constants";
import type { WorkflowRun, WorkflowRunStatus } from "@/types/database";

const statusVariants: Record<WorkflowRunStatus, "success" | "warning" | "destructive"> = {
  running: "warning",
  completed: "success",
  failed: "destructive",
};

function formatDuration(start: string, end: string | null): string {
  if (!end) return "läuft...";
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

interface RunHistoryProps {
  runs: WorkflowRun[];
}

export function RunHistory({ runs }: RunHistoryProps) {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border py-12 text-muted-foreground">
        <p className="text-sm">Noch keine Ausführungen.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Schritte</th>
            <th className="px-4 py-3">Dauer</th>
            <th className="px-4 py-3">Gestartet</th>
            <th className="px-4 py-3">Ergebnisse</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => {
            const statusConfig = WORKFLOW_RUN_STATUSES[run.status];
            return (
              <tr
                key={run.id}
                className="border-b border-border transition-colors hover:bg-accent/50"
              >
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[run.status]} className="text-[10px]">
                    {statusConfig.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  {run.steps_completed} Schritte
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDuration(run.started_at, run.completed_at)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatTimeAgo(run.started_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(run.results as string[]).slice(0, 3).map((r, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-[10px] max-w-[150px] truncate"
                      >
                        {r}
                      </Badge>
                    ))}
                    {(run.results as string[]).length > 3 && (
                      <Badge variant="secondary" className="text-[10px]">
                        +{(run.results as string[]).length - 3}
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
