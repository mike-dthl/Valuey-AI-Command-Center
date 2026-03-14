import type { Agent, Client, Project, Task } from "./database";

export type ClientWithProjects = Client & {
  projects: Project[];
};

export type ClientWithProjectCount = Client & {
  projects: { id: string }[];
};

export type ProjectWithClient = Project & {
  client: Client | null;
};

export type ProjectWithTasks = Project & {
  tasks: TaskWithAgent[];
  client: Client | null;
};

export type ProjectWithTaskCount = Project & {
  client: Client | null;
  tasks: { id: string }[];
};

export type TaskWithAgent = Task & {
  assigned_agent: Pick<Agent, "id" | "name" | "role"> | null;
};

export type TaskWithProject = Task & {
  project: Project;
};

export type TaskWithDetails = Task & {
  assigned_agent: Pick<Agent, "id" | "name" | "role"> | null;
  project: Pick<Project, "id" | "name"> | null;
};
