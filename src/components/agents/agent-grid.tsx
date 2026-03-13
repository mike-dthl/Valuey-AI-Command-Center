"use client";

import { useAgentsByTeam } from "@/hooks/use-agents";
import { TeamSection } from "./team-section";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentGrid() {
  const { teams, loading, error } = useAgentsByTeam();

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-36 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Fehler beim Laden der Agenten: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {teams.map((team) => (
        <TeamSection
          key={team.id}
          name={team.name}
          slug={team.slug}
          agents={team.agents}
        />
      ))}
    </div>
  );
}
