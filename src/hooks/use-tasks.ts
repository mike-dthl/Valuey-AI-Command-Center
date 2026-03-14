"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TaskWithDetails } from "@/types/client";
import type { TaskStatus } from "@/types/database";

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      let url: string;
      if (projectId) {
        url = `/api/projects/${projectId}/tasks`;
      } else {
        // Fetch all tasks across projects by getting all projects with tasks
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const projects = await res.json();

        // Fetch tasks for each project
        const allTasks: TaskWithDetails[] = [];
        for (const project of projects) {
          const taskRes = await fetch(`/api/projects/${project.id}/tasks`);
          if (taskRes.ok) {
            const projectTasks = await taskRes.json();
            allTasks.push(
              ...projectTasks.map((t: TaskWithDetails) => ({
                ...t,
                project: { id: project.id, name: project.name },
              }))
            );
          }
        }
        setTasks(allTasks);
        setError(null);
        setLoading(false);
        return;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus, position: number) => {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status, position } : t))
      );

      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, position }),
        });
        if (!res.ok) {
          // Revert on error
          fetchTasks();
          throw new Error("Failed to update task");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    },
    [fetchTasks]
  );

  return { tasks, loading, error, refetch: fetchTasks, updateTaskStatus };
}
