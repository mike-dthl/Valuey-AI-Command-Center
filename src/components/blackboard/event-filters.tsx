"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventFilterState } from "@/types/blackboard";

interface EventFiltersProps {
  filters: EventFilterState;
  onFilterChange: (filters: EventFilterState) => void;
}

const priorityFilters = [
  { value: null, label: "Alle" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
] as const;

const statusFilters = [
  { value: null, label: "Alle Status" },
  { value: "pending", label: "Pending" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
] as const;

export function EventFilters({ filters, onFilterChange }: EventFiltersProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {priorityFilters.map((f) => (
          <Badge
            key={f.label}
            variant={filters.priority === f.value ? "default" : "outline"}
            className={cn("cursor-pointer hover:bg-accent")}
            onClick={() => onFilterChange({ ...filters, priority: f.value })}
          >
            {f.label}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <Badge
            key={f.label}
            variant={filters.status === f.value ? "default" : "outline"}
            className={cn("cursor-pointer hover:bg-accent")}
            onClick={() => onFilterChange({ ...filters, status: f.value })}
          >
            {f.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
