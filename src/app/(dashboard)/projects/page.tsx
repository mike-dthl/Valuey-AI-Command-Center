"use client";

import { useState, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { TaskDialog } from "@/components/projects/task-dialog";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useAgents } from "@/hooks/use-agents";
import type { TaskCardData } from "@/components/projects/task-card";
import type { TaskStatus } from "@/types/database";

export default function ProjectsPage() {
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects();
  const { tasks, loading: tasksLoading, refetch: refetchTasks, updateTaskStatus } = useTasks();
  const { agents } = useAgents();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCardData | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<string>("todo");

  // Build task card data with project info
  const [taskCards, setTaskCards] = useState<TaskCardData[]>([]);

  useEffect(() => {
    const cards: TaskCardData[] = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      position: t.position,
      due_date: t.due_date,
      project_id: t.project_id,
      project: t.project ?? projects.find((p) => p.id === t.project_id)
        ? { id: t.project_id, name: projects.find((p) => p.id === t.project_id)?.name ?? "" }
        : null,
      assigned_agent: t.assigned_agent ?? null,
    }));
    setTaskCards(cards);
  }, [tasks, projects]);

  const handleTaskMove = useCallback(
    (taskId: string, newStatus: TaskStatus, newPosition: number) => {
      updateTaskStatus(taskId, newStatus, newPosition);
    },
    [updateTaskStatus]
  );

  const handleTaskClick = useCallback((task: TaskCardData) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  }, []);

  const handleAddTask = useCallback((status: TaskStatus) => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setTaskDialogOpen(true);
  }, []);

  const handleTaskSuccess = useCallback(() => {
    refetchTasks();
  }, [refetchTasks]);

  const handleProjectSuccess = useCallback(() => {
    refetchProjects();
    refetchTasks();
  }, [refetchProjects, refetchTasks]);

  const projectList = projects.map((p) => ({ id: p.id, name: p.name }));
  const clientList = projects
    .filter((p) => p.client)
    .map((p) => ({ id: p.client!.id, name: p.client!.name }))
    .filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);

  const agentList = agents.map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
  }));

  const loading = projectsLoading || tasksLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">Kanban Board</p>
        </div>
        <ProjectDialog
          clients={clientList}
          onSuccess={handleProjectSuccess}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-72 shrink-0" />
            ))}
          </div>
        </div>
      ) : (
        <KanbanBoard
          tasks={taskCards}
          projects={projectList}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      )}

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
        projects={projectList}
        agents={agentList}
        defaultStatus={defaultTaskStatus}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
}
