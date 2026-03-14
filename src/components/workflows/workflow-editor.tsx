"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./workflow-editor.css";

import { TriggerNode } from "./nodes/trigger-node";
import { AgentNode } from "./nodes/agent-node";
import { OutputNode } from "./nodes/output-node";
import { NodePalette } from "./node-palette";

const nodeTypes = {
  trigger: TriggerNode,
  agent: AgentNode,
  output: OutputNode,
};

interface WorkflowEditorProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  agents: Array<{ name: string; role: string }>;
  onSave: (nodes: Node[], edges: Edge[]) => void;
}

export function WorkflowEditor({
  initialNodes,
  initialEdges,
  agents,
  onSave,
}: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(100);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge({ ...connection, animated: true }, eds)
      );
    },
    [setEdges]
  );

  const handleAddNode = useCallback(
    (type: string, data: Record<string, unknown>) => {
      const id = `${type}-${nodeIdCounter}`;
      setNodeIdCounter((c) => c + 1);

      // Place new node in center-ish of viewport
      const newNode: Node = {
        id,
        type,
        position: {
          x: 300 + Math.random() * 200,
          y: 100 + Math.random() * 200,
        },
        data,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodeIdCounter, setNodes]
  );

  // Save handler - expose current nodes/edges
  const handleSave = useCallback(() => {
    onSave(nodes, edges);
  }, [nodes, edges, onSave]);

  // Expose save via a ref-like pattern
  const editorActions = useMemo(
    () => ({ save: handleSave }),
    [handleSave]
  );

  // Store actions on window for parent access
  if (typeof window !== "undefined") {
    (window as unknown as { __workflowEditorActions?: typeof editorActions }).__workflowEditorActions =
      editorActions;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            className="!bottom-4 !right-4"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
          />
        </ReactFlow>
      </div>
      <NodePalette agents={agents} onAddNode={handleAddNode} />
    </div>
  );
}
