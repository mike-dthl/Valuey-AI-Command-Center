"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CLIENT_STATUSES } from "@/lib/constants";
import type { ClientWithProjectCount } from "@/types/client";
import type { ClientStatus } from "@/types/database";

const statusVariants: Record<ClientStatus, "success" | "secondary" | "info"> = {
  active: "success",
  inactive: "secondary",
  lead: "info",
};

const avatarColors = [
  "bg-purple-500/20 text-purple-400",
  "bg-blue-500/20 text-blue-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

type SortKey = "name" | "company" | "status";
type SortDir = "asc" | "desc";

interface ClientTableProps {
  clients: ClientWithProjectCount[];
  searchQuery: string;
}

export function ClientTable({ clients, searchQuery }: ClientTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = clients.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company?.toLowerCase().includes(q) ?? false) ||
      (c.email?.toLowerCase().includes(q) ?? false)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = (a[sortKey] ?? "").toString().toLowerCase();
    const valB = (b[sortKey] ?? "").toString().toLowerCase();
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="ml-1 text-zinc-600">&#8597;</span>;
    return <span className="ml-1">{sortDir === "asc" ? "&#8593;" : "&#8595;"}</span>;
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border py-12 text-muted-foreground">
        <p className="text-sm">
          {searchQuery ? "Keine Kunden gefunden." : "Noch keine Kunden vorhanden."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium text-muted-foreground">
            <th
              className="px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
              onClick={() => handleSort("name")}
            >
              Name <SortIcon column="name" />
            </th>
            <th
              className="px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
              onClick={() => handleSort("company")}
            >
              Firma <SortIcon column="company" />
            </th>
            <th className="px-4 py-3">Email</th>
            <th
              className="px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
              onClick={() => handleSort("status")}
            >
              Status <SortIcon column="status" />
            </th>
            <th className="px-4 py-3 text-right">Projekte</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((client) => {
            const statusConfig = CLIENT_STATUSES[client.status];
            return (
              <tr key={client.id}>
                <td colSpan={5} className="p-0">
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex w-full border-b border-border transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 w-[25%]">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          getAvatarColor(client.name)
                        )}
                      >
                        {getInitials(client.name)}
                      </div>
                      <span className="text-sm font-medium truncate">{client.name}</span>
                    </div>
                    <div className="flex items-center px-4 py-3 w-[20%]">
                      <span className="text-sm text-muted-foreground truncate">
                        {client.company ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center px-4 py-3 w-[25%]">
                      <span className="text-sm text-muted-foreground truncate">
                        {client.email ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 w-[15%]">
                      <div className={cn("h-2 w-2 rounded-full", statusConfig.dot)} />
                      <Badge variant={statusVariants[client.status]} className="text-[10px]">
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-end px-4 py-3 w-[15%]">
                      <Badge variant="secondary" className="text-[10px]">
                        {client.projects?.length ?? 0}
                      </Badge>
                    </div>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
