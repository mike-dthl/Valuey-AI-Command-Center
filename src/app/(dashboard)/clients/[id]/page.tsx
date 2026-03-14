"use client";

import { use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientDetail } from "@/components/clients/client-detail";
import { useClient } from "@/hooks/use-clients";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { client, loading, refetch } = useClient(id);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>Client nicht gefunden.</p>
      </div>
    );
  }

  return <ClientDetail client={client as never} onRefetch={refetch} />;
}
