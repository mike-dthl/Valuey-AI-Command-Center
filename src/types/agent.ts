import type { Agent, Team, AgentTask } from "./database";

export type AgentWithTeam = Agent & {
  team: Team | null;
};

export type TeamWithAgents = Team & {
  agents: Agent[];
};

export type AgentWithTaskCount = Agent & {
  task_count: number;
};

export type AgentDetail = Agent & {
  team: Team | null;
  recent_tasks: AgentTask[];
};
