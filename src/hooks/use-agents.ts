"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Agent, Team } from "@/types/database";
import type { TeamWithAgents } from "@/types/agent";

type AgentWithTeam = Agent & { team: Team | null };

export function useAgents() {
  const [agents, setAgents] = useState<AgentWithTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed to fetch agents");
      const data = await res.json();
      setAgents(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Realtime updates for agent status changes
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("agents-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "agents" },
        (payload) => {
          setAgents((prev) =>
            prev.map((a) =>
              a.id === payload.new.id ? { ...a, ...payload.new } : a
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agents" },
        () => {
          fetchAgents();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "agents" },
        (payload) => {
          setAgents((prev) => prev.filter((a) => a.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAgents]);

  return { agents, loading, error, refetch: fetchAgents };
}

export function useAgentsByTeam() {
  const { agents, loading, error, refetch } = useAgents();

  const teamMap = new Map<string, TeamWithAgents>();
  for (const agent of agents) {
    if (!agent.team) continue;
    const teamId = agent.team.id;
    if (!teamMap.has(teamId)) {
      teamMap.set(teamId, { ...agent.team, agents: [] });
    }
    teamMap.get(teamId)!.agents.push(agent);
  }

  const teams = Array.from(teamMap.values()).sort(
    (a, b) => a.position - b.position
  );

  return { teams, loading, error, refetch };
}

export function useAgent(id: string) {
  const [agent, setAgent] = useState<AgentWithTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgent = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents/${id}`);
      if (!res.ok) throw new Error("Agent not found");
      const data = await res.json();
      setAgent(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  return { agent, loading, error, refetch: fetchAgent };
}
