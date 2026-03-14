"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientTable } from "@/components/clients/client-table";
import { ClientDialog } from "@/components/clients/client-dialog";
import { useClients } from "@/hooks/use-clients";

export default function ClientsPage() {
  const { clients, loading, refetch } = useClients();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clients</h2>
          <p className="text-sm text-muted-foreground">
            {clients.length} Kunden
          </p>
        </div>
        <ClientDialog onSuccess={refetch} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Kunden suchen..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <ClientTable clients={clients} searchQuery={searchQuery} />
      )}
    </div>
  );
}
