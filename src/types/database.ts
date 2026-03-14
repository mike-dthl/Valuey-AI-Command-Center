// Row types matching the Supabase database schema

export type AgentStatus = "idle" | "busy" | "error" | "offline";
export type EventPriority = "low" | "normal" | "high" | "urgent";
export type EventStatus = "pending" | "acknowledged" | "in_progress" | "resolved" | "dismissed";
export type UserRole = "admin" | "member" | "viewer";
export type ClientStatus = "active" | "inactive" | "lead";
export type ProjectStatus = "planning" | "active" | "paused" | "completed" | "archived";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type AgentTaskStatus = "pending" | "running" | "completed" | "failed";
export type MessageRole = "user" | "assistant";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  position: number;
  created_at: string;
}

export interface Agent {
  id: string;
  team_id: string | null;
  name: string;
  role: string;
  description: string | null;
  avatar_url: string | null;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  tools: unknown[];
  status: AgentStatus;
  config: Record<string, unknown>;
  position: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlackboardEvent {
  id: string;
  event_type: string;
  source_team_id: string | null;
  target_team_id: string | null;
  source_agent_id: string | null;
  priority: EventPriority;
  title: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  title: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_used: number | null;
  cost: number | null;
  created_at: string;
}

export interface AgentTask {
  id: string;
  agent_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  status: AgentTaskStatus;
  tokens_used: number | null;
  cost: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  notes: string | null;
  status: ClientStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  deadline: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  assigned_agent_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: "info" | "success" | "warning" | "urgent";
  source_type: string | null;
  source_id: string | null;
  read: boolean;
  created_at: string;
}

export interface UsageLog {
  id: string;
  agent_id: string | null;
  action_type: string;
  tokens_input: number;
  tokens_output: number;
  cost: number;
  model: string | null;
  created_at: string;
}

export type WorkflowTriggerType = "manual" | "scheduled" | "event";
export type WorkflowRunStatus = "running" | "completed" | "failed";

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  trigger_type: WorkflowTriggerType;
  trigger_config: Record<string, unknown>;
  steps: Record<string, unknown>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface RevenueEntry {
  id: string;
  client_id: string | null;
  project_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  type: "income" | "expense";
  created_by: string | null;
  created_at: string;
}

export interface ObsidianConfig {
  id: string;
  vault_path: string;
  sync_enabled: boolean;
  auto_sync_clients: boolean;
  auto_sync_projects: boolean;
  auto_sync_agent_outputs: boolean;
  auto_sync_blackboard: boolean;
  auto_daily_summary: boolean;
  knowledge_path: string;
  created_by: string | null;
  updated_at: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: WorkflowRunStatus;
  steps_completed: number;
  results: unknown[];
  started_at: string;
  completed_at: string | null;
  triggered_by: string | null;
}
