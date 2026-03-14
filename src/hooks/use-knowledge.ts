"use client";

import { useState, useEffect, useCallback } from "react";
import type { KnowledgeEntry, KnowledgeEntryType } from "@/types/database";

export function useKnowledge() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<KnowledgeEntryType | "all">("all");
  const [search, setSearch] = useState("");

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("type", filter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/knowledge?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Failed to fetch knowledge:", err);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = useCallback(
    async (entry: {
      title: string;
      content: string;
      entry_type: KnowledgeEntryType;
      tags?: string[];
    }) => {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("Failed to create entry");
      const data = await res.json();
      setEntries((prev) => [data, ...prev]);
      return data;
    },
    []
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<KnowledgeEntry>) => {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      const data = await res.json();
      setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
      return data;
    },
    []
  );

  const deleteEntry = useCallback(async (id: string) => {
    const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete entry");
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return {
    entries,
    loading,
    filter,
    search,
    setFilter,
    setSearch,
    createEntry,
    updateEntry,
    deleteEntry,
    refresh: fetchEntries,
  };
}
