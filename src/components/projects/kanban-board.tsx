"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { KanbanColumn } from "./kanban-column";
import { TaskCard, type TaskCardData } from "./task-card";
import type { TaskStatus } from "@/types/database";

interface KanbanBoardProps {
  tasks: TaskCardData[];
  projects: Array<{ id: string; name: string }>;
  onTaskMove: (taskId: string, newStatus: TaskStatus, newPosition: number) => void;
  onTaskClick?: (task: TaskCardData) => void;
  onAddTask?: (status: TaskStatus) => void;
}

export function KanbanBoard({
  tasks,
  projects,
  onTaskMove,
  onTaskClick,
  onAddTask,
}: KanbanBoardProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [activeTask, setActiveTask] = useState<TaskCardData | null>(null);
  const [localTasks, setLocalTasks] = useState<TaskCardData[]>(tasks);

  // Sync when tasks prop changes (from refetch)
  if (tasks !== localTasks && !activeTask) {
    setLocalTasks(tasks);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const filteredTasks = useMemo(() => {
    if (selectedProjectId === "all") return localTasks;
    return localTasks.filter((t) => t.project_id === selectedProjectId);
  }, [localTasks, selectedProjectId]);

  const columnTasks = useMemo(() => {
    const map: Record<string, TaskCardData[]> = {};
    for (const col of KANBAN_COLUMNS) {
      map[col.id] = filteredTasks
        .filter((t) => t.status === col.id)
        .sort((a, b) => a.position - b.position);
    }
    return map;
  }, [filteredTasks]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = filteredTasks.find((t) => t.id === event.active.id);
      if (task) setActiveTask(task);
    },
    [filteredTasks]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find source column (current status of active task)
      const activeTaskItem = localTasks.find((t) => t.id === activeId);
      if (!activeTaskItem) return;

      // Determine target column: if over a task, use that task's status; if over a column id, use that
      const isOverColumn = KANBAN_COLUMNS.some((c) => c.id === overId);
      let targetStatus: string;

      if (isOverColumn) {
        targetStatus = overId;
      } else {
        const overTask = localTasks.find((t) => t.id === overId);
        if (!overTask) return;
        targetStatus = overTask.status;
      }

      // If moving to a different column, update local state for preview
      if (activeTaskItem.status !== targetStatus) {
        setLocalTasks((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, status: targetStatus as TaskStatus } : t
          )
        );
      }
    },
    [localTasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const task = localTasks.find((t) => t.id === activeId);
      if (!task) return;

      // Determine target column
      const isOverColumn = KANBAN_COLUMNS.some((c) => c.id === overId);
      let targetStatus: TaskStatus;
      let targetPosition: number;

      if (isOverColumn) {
        targetStatus = overId as TaskStatus;
        // Dropped on empty column or column header
        const colTasks = localTasks.filter(
          (t) => t.status === targetStatus && t.id !== activeId
        );
        targetPosition = colTasks.length;
      } else {
        const overTask = localTasks.find((t) => t.id === overId);
        if (!overTask) return;
        targetStatus = overTask.status as TaskStatus;

        // Calculate position
        const colTasks = localTasks
          .filter((t) => t.status === targetStatus && t.id !== activeId)
          .sort((a, b) => a.position - b.position);
        const overIndex = colTasks.findIndex((t) => t.id === overId);
        targetPosition = overIndex >= 0 ? overIndex : colTasks.length;
      }

      // Update local state
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === activeId
            ? { ...t, status: targetStatus, position: targetPosition }
            : t
        )
      );

      // Persist to API
      onTaskMove(activeId, targetStatus, targetPosition);
    },
    [localTasks, onTaskMove]
  );

  return (
    <div className="space-y-4">
      {/* Project Filter */}
      <div className="flex items-center gap-3">
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Projekt auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Projekte</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filteredTasks.length} Tasks
        </span>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={columnTasks[column.id] ?? []}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask ? () => onAddTask(column.id) : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
