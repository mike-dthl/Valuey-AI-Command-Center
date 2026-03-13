"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type PostgresChange = RealtimePostgresChangesPayload<Record<string, unknown>>;

export function useRealtime(
  table: string,
  callback: (payload: PostgresChange) => void,
  filter?: string
) {
  useEffect(() => {
    const supabase = createClient();

    const channelConfig: {
      event: "INSERT" | "UPDATE" | "DELETE" | "*";
      schema: string;
      table: string;
      filter?: string;
    } = {
      event: "*",
      schema: "public",
      table,
    };

    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(`realtime-${table}${filter ? `-${filter}` : ""}`)
      .on("postgres_changes", channelConfig, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, filter]);
}
