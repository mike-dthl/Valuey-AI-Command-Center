"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { WorkflowDialog } from "@/components/workflows/workflow-dialog";
import { useWorkflows } from "@/hooks/use-workflows";
import { toast } from "sonner";
import type { Workflow } from "@/types/database";

export default function WorkflowsPage() {
  const { workflows, loading, refetch } = useWorkflows();
  const router = useRouter();

  const handleRun = useCallback(
    async (workflowId: string) => {
      try {
        await fetch(`/api/workflows/${workflowId}/run`, { method: "POST" });
        toast.success("Workflow gestartet");
        refetch();
      } catch {
        toast.error("Workflow konnte nicht gestartet werden");
      }
    },
    [refetch]
  );

  const handleCreateSuccess = useCallback(
    (workflow: Workflow) => {
      router.push(`/workflows/${workflow.id}`);
    },
    [router]
  );

  const activeCount = workflows.filter((w) => w.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflows</h2>
          <p className="text-sm text-muted-foreground">
            {workflows.length} Workflows &middot; {activeCount} aktiv
          </p>
        </div>
        <WorkflowDialog onSuccess={handleCreateSuccess} />
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border py-12 text-muted-foreground">
          <p className="text-sm">Noch keine Workflows erstellt.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onRun={handleRun}
            />
          ))}
        </div>
      )}
    </div>
  );
}
