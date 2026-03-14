"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { TaskCard } from "./task-card";
import type { TaskCardData } from "./task-card";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: TaskCardData[];
  onTaskClick?: (task: TaskCardData) => void;
  onAddTask?: () => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="w-72 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={cn("text-sm font-semibold", color)}>{title}</h3>
          <Badge variant="secondary" className="text-[10px]">
            {tasks.length}
          </Badge>
        </div>
        {onAddTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAddTask}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[200px] space-y-2 rounded-lg border border-transparent p-1 transition-colors",
          isOver && "border-primary/30 bg-accent/30"
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
            Keine Tasks
          </div>
        )}
      </div>
    </div>
  );
}
