"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ClientWithProjectCount } from "@/types/client";

export function useClients() {
  const [clients, setClients] = useState<ClientWithProjectCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("clients-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "clients" },
        () => fetchClients()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "clients" },
        () => fetchClients()
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "clients" },
        (payload) => {
          setClients((prev) => prev.filter((c) => c.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}

export function useClient(id: string) {
  const [client, setClient] = useState<ClientWithProjectCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (!res.ok) throw new Error("Client not found");
      const data = await res.json();
      setClient(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return { client, loading, error, refetch: fetchClient };
}
