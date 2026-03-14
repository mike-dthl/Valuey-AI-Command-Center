"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { EventCard } from "./event-card";
import { EventFilters } from "./event-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlackboardEvent } from "@/types/database";
import { toast } from "sonner";
import type { EventFilterState } from "@/types/blackboard";

type EventWithRelations = BlackboardEvent & {
  source_team?: { name: string } | null;
  target_team?: { name: string } | null;
};

interface EventQueueProps {
  showFilters?: boolean;
  limit?: number;
}

export function EventQueue({ showFilters = true, limit = 50 }: EventQueueProps) {
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilterState>({
    priority: null,
    status: null,
    team: null,
  });

  const fetchEvents = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.status) params.set("status", filters.status);
    if (filters.team) params.set("team_id", filters.team);
    params.set("limit", String(limit));

    try {
      const res = await fetch(`/api/blackboard?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      toast.error("Events konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }, [filters, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Realtime updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("blackboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blackboard_events" },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/blackboard/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: status as BlackboardEvent["status"] } : e))
        );
      }
    } catch {
      toast.error("Status konnte nicht aktualisiert werden");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && <EventFilters filters={filters} onFilterChange={setFilters} />}
      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Keine Events vorhanden
          </p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
