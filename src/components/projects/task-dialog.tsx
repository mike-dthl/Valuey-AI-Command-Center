"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { TaskCardData } from "./task-card";

const taskSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().optional(),
  project_id: z.string().min(1, "Projekt ist erforderlich"),
  assigned_agent_id: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  due_date: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskCardData | null;
  projects: Array<{ id: string; name: string }>;
  agents: Array<{ id: string; name: string; role: string }>;
  defaultStatus?: string;
  defaultProjectId?: string;
  onSuccess?: () => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  projects,
  agents,
  defaultStatus,
  defaultProjectId,
  onSuccess,
}: TaskDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!task;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      project_id: defaultProjectId ?? "",
      assigned_agent_id: "",
      priority: "medium",
      status: (defaultStatus as TaskFormData["status"]) ?? "todo",
      due_date: "",
    },
  });

  // Reset form when task changes (edit mode)
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        project_id: task.project_id,
        assigned_agent_id: task.assigned_agent?.id ?? "",
        priority: task.priority,
        status: task.status as TaskFormData["status"],
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        project_id: defaultProjectId ?? "",
        assigned_agent_id: "",
        priority: "medium",
        status: (defaultStatus as TaskFormData["status"]) ?? "todo",
        due_date: "",
      });
    }
  }, [task, defaultStatus, defaultProjectId, reset]);

  const projectId = watch("project_id");
  const priorityValue = watch("priority");
  const statusValue = watch("status");
  const agentValue = watch("assigned_agent_id");

  const onSubmit = async (data: TaskFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        assigned_agent_id: data.assigned_agent_id || null,
        due_date: data.due_date || null,
      };

      let res: Response;
      if (isEdit) {
        res = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/projects/${data.project_id}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save task");
      toast.success(isEdit ? "Task aktualisiert" : "Task erstellt");
      onOpenChange(false);
      reset();
      onSuccess?.();
    } catch {
      toast.error("Task konnte nicht gespeichert werden");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Task bearbeiten" : "Neuer Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Titel *</Label>
            <Input
              id="task-title"
              {...register("title")}
              placeholder="Task-Titel"
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc">Beschreibung</Label>
            <Textarea
              id="task-desc"
              {...register("description")}
              placeholder="Beschreibung..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Projekt *</Label>
              <Select
                value={projectId}
                onValueChange={(v) => setValue("project_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Projekt wählen" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_id && (
                <p className="text-xs text-red-400">
                  {errors.project_id.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Agent</Label>
              <Select
                value={agentValue ?? ""}
                onValueChange={(v) => setValue("assigned_agent_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kein Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Kein Agent</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} — {a.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Priorität</Label>
              <Select
                value={priorityValue}
                onValueChange={(v) =>
                  setValue("priority", v as TaskFormData["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Niedrig</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                  <SelectItem value="urgent">Dringend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(v) =>
                  setValue("status", v as TaskFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Arbeit</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Erledigt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Fällig am</Label>
              <Input id="task-due" type="date" {...register("due_date")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Speichern..."
                : isEdit
                  ? "Speichern"
                  : "Erstellen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
