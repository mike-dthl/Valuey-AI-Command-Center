"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WorkflowWithRunCount, WorkflowWithRuns } from "@/types/workflow";

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<WorkflowWithRunCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    try {
      const res = await fetch("/api/workflows");
      if (!res.ok) throw new Error("Failed to fetch workflows");
      const data = await res.json();
      setWorkflows(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("workflows-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workflows" },
        () => fetchWorkflows()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWorkflows]);

  return { workflows, loading, error, refetch: fetchWorkflows };
}

export function useWorkflow(id: string) {
  const [workflow, setWorkflow] = useState<WorkflowWithRuns | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch(`/api/workflows/${id}`);
      if (!res.ok) throw new Error("Workflow not found");
      const data = await res.json();
      setWorkflow(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`workflow-${id}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workflow_runs", filter: `workflow_id=eq.${id}` },
        () => fetchWorkflow()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, fetchWorkflow]);

  return { workflow, loading, error, refetch: fetchWorkflow };
}
