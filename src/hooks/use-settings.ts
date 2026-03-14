"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ObsidianConfig } from "@/types/database";

export function useProfile() {
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          full_name: user.user_metadata?.full_name ?? "",
          email: user.email ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const updateName = useCallback(async (fullName: string) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      setProfile((prev) => prev ? { ...prev, full_name: fullName } : prev);
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, saving, updateName };
}

export function useObsidianConfig() {
  const [config, setConfig] = useState<ObsidianConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/obsidian");
      if (!res.ok) throw new Error("Failed to fetch config");
      const data = await res.json();
      setConfig(data);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = useCallback(async (updates: Partial<ObsidianConfig>) => {
    setSaving(true);
    // Optimistic update
    setConfig((prev) => prev ? { ...prev, ...updates } : prev);
    try {
      const res = await fetch("/api/settings/obsidian", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setConfig(data);
    } catch {
      // Revert on error
      fetchConfig();
    } finally {
      setSaving(false);
    }
  }, [fetchConfig]);

  return { config, loading, saving, updateConfig };
}
