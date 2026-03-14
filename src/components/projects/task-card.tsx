"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TASK_PRIORITIES } from "@/lib/constants";
import { GripVertical, Calendar, Bot } from "lucide-react";
import type { TaskPriority } from "@/types/database";

const priorityVariants: Record<TaskPriority, "destructive" | "warning" | "info" | "secondary"> = {
  urgent: "destructive",
  high: "warning",
  medium: "info",
  low: "secondary",
};

export interface TaskCardData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: TaskPriority;
  position: number;
  due_date: string | null;
  project_id: string;
  project?: { id: string; name: string } | null;
  assigned_agent?: { id: string; name: string; role: string } | null;
}

interface TaskCardProps {
  task: TaskCardData;
  onClick?: () => void;
  overlay?: boolean;
}

export function TaskCard({ task, onClick, overlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = TASK_PRIORITIES[task.priority];

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={cn(isDragging && !overlay && "opacity-30")}
    >
      <Card
        className={cn(
          "cursor-pointer border-l-2 transition-all hover:border-primary/30",
          priorityConfig.border,
          overlay && "shadow-xl rotate-2 scale-105"
        )}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <button
              className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground"
              {...(overlay ? {} : { ...attributes, ...listeners })}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{task.title}</p>
              {task.project?.name && (
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {task.project.name}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge
                  variant={priorityVariants[task.priority]}
                  className="text-[10px]"
                >
                  {priorityConfig.label}
                </Badge>
                {task.assigned_agent && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Bot className="h-3 w-3" />
                    {task.assigned_agent.name}
                  </span>
                )}
                {task.due_date && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.due_date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
