import type { Node, Edge } from "@xyflow/react";
import type { Workflow, WorkflowRun, WorkflowTriggerType } from "./database";

export interface TriggerNodeData {
  label: string;
  triggerType: WorkflowTriggerType;
  [key: string]: unknown;
}

export interface AgentNodeData {
  label: string;
  agentName: string;
  agentId?: string | null;
  status?: "idle" | "running" | "done" | "error";
  [key: string]: unknown;
}

export interface OutputNodeData {
  label: string;
  [key: string]: unknown;
}

export type TriggerNode = Node<TriggerNodeData, "trigger">;
export type AgentNode = Node<AgentNodeData, "agent">;
export type OutputNode = Node<OutputNodeData, "output">;

export type FlowNode = TriggerNode | AgentNode | OutputNode;
export type FlowEdge = Edge;

export interface WorkflowSteps {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export type WorkflowWithRuns = Workflow & {
  workflow_runs: WorkflowRun[];
};

export type WorkflowWithRunCount = Workflow & {
  workflow_runs: { id: string }[];
};
