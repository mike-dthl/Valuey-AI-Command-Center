"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type PostgresChange = RealtimePostgresChangesPayload<Record<string, unknown>>;

export function useRealtime(
  table: string,
  callback: (payload: PostgresChange) => void,
  filter?: string
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

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
      .on("postgres_changes", channelConfig, (payload) => callbackRef.current(payload))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);
}
