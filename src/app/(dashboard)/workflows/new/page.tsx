"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAgents } from "@/hooks/use-agents";
import { WorkflowEditor } from "@/components/workflows/workflow-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import type { Node, Edge } from "@xyflow/react";

const defaultNodes: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 50, y: 150 },
    data: { label: "Start", triggerType: "manual" },
  },
  {
    id: "output-1",
    type: "output",
    position: { x: 500, y: 150 },
    data: { label: "Fertig" },
  },
];

const defaultEdges: Edge[] = [
  { id: "e-t-o", source: "trigger-1", target: "output-1", animated: true },
];

export default function NewWorkflowPage() {
  const router = useRouter();
  const { agents } = useAgents();
  const agentList = agents.map((a) => ({ name: a.name, role: a.role }));

  const handleSave = useCallback(
    async (nodes: Node[], edges: Edge[]) => {
      try {
        const res = await fetch("/api/workflows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Neuer Workflow",
            description: "",
            trigger_type: "manual",
            is_active: true,
            steps: { nodes, edges },
          }),
        });
        if (res.ok) {
          const workflow = await res.json();
          router.push(`/workflows/${workflow.id}`);
        }
      } catch {
        // Silent fail
      }
    },
    [router]
  );

  const triggerSave = useCallback(() => {
    const actions = (
      window as unknown as {
        __workflowEditorActions?: { save: () => void };
      }
    ).__workflowEditorActions;
    actions?.save();
  }, []);

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
            <h2 className="text-lg font-bold">Neuer Workflow</h2>
            <p className="text-xs text-muted-foreground">
              Nodes hinzufügen und verbinden, dann speichern
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-2" onClick={triggerSave}>
          <Save className="h-3.5 w-3.5" />
          Speichern
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <WorkflowEditor
          initialNodes={defaultNodes}
          initialEdges={defaultEdges}
          agents={agentList}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
