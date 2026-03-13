"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AgentConfigForm } from "@/components/agents/agent-config-form";
import type { Team } from "@/types/database";

export default function NewAgentPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then(setTeams)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/agents" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Zurück zu Agents
        </Link>
        <h2 className="mt-2 text-2xl font-bold">Neuer Agent</h2>
        <p className="text-sm text-muted-foreground">
          Erstelle einen neuen AI-Agenten für dein Team
        </p>
      </div>
      <AgentConfigForm teams={teams} mode="create" />
    </div>
  );
}
