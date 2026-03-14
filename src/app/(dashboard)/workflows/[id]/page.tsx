"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Save,
  Play,
  History,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/hooks/use-workflows";
import { useAgents } from "@/hooks/use-agents";
import { WorkflowEditor } from "@/components/workflows/workflow-editor";
import { RunHistory } from "@/components/workflows/run-history";
import type { Node, Edge } from "@xyflow/react";

type Tab = "editor" | "runs";

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { workflow, loading, refetch } = useWorkflow(id);
  const { agents } = useAgents();
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [saving, setSaving] = useState(false);

  const agentList = agents.map((a) => ({ name: a.name, role: a.role }));

  const handleSave = useCallback(
    async (nodes: Node[], edges: Edge[]) => {
      setSaving(true);
      try {
        await fetch(`/api/workflows/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ steps: { nodes, edges } }),
        });
        refetch();
      } catch {
        // Silent fail
      } finally {
        setSaving(false);
      }
    },
    [id, refetch]
  );

  const handleRun = useCallback(async () => {
    try {
      await fetch(`/api/workflows/${id}/run`, { method: "POST" });
      refetch();
    } catch {
      // Silent fail
    }
  }, [id, refetch]);

  const triggerSave = useCallback(() => {
    const actions = (
      window as unknown as {
        __workflowEditorActions?: { save: () => void };
      }
    ).__workflowEditorActions;
    actions?.save();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>Workflow nicht gefunden.</p>
      </div>
    );
  }

  const steps = workflow.steps as { nodes?: Node[]; edges?: Edge[] };
  const initialNodes = (steps.nodes ?? []) as Node[];
  const initialEdges = (steps.edges ?? []) as Edge[];

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-1 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/workflows">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{workflow.name}</h2>
              <Badge variant={workflow.is_active ? "success" : "secondary"} className="text-[10px]">
                {workflow.is_active ? "Aktiv" : "Inaktiv"}
              </Badge>
            </div>
            {workflow.description && (
              <p className="text-xs text-muted-foreground">
                {workflow.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={triggerSave}
            disabled={saving}
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Speichern..." : "Speichern"}
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={handleRun}
            disabled={!workflow.is_active}
          >
            <Play className="h-3.5 w-3.5" />
            Ausführen
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border px-1">
        <button
          onClick={() => setActiveTab("editor")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm transition-colors",
            activeTab === "editor"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
          Editor
        </button>
        <button
          onClick={() => setActiveTab("runs")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm transition-colors",
            activeTab === "runs"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="h-3.5 w-3.5" />
          Runs ({workflow.workflow_runs?.length ?? 0})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "editor" ? (
          <WorkflowEditor
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            agents={agentList}
            onSave={handleSave}
          />
        ) : (
          <div className="p-4 overflow-auto h-full">
            <RunHistory runs={workflow.workflow_runs ?? []} />
          </div>
        )}
      </div>
    </div>
  );
}
