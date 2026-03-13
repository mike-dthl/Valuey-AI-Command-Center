"use client";

import { use, useState, useEffect } from "react";
import { useAgent } from "@/hooks/use-agents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentChat } from "@/components/agents/agent-chat";
import { AgentStatusBadge } from "@/components/agents/agent-status-badge";
import { AgentConfigForm } from "@/components/agents/agent-config-form";
import { ArrowLeft, Bot, MessageSquare, ListTodo, Settings } from "lucide-react";
import Link from "next/link";
import type { AgentTask, Team } from "@/types/database";

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { agent, loading, error } = useAgent(id);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch(`/api/agents/${id}/tasks`)
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then(setTeams)
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="space-y-4">
        <Link href="/agents" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Zurück zu Agents
        </Link>
        <p className="text-sm text-destructive">Agent nicht gefunden.</p>
      </div>
    );
  }

  const taskStatusColors: Record<string, string> = {
    pending: "secondary",
    running: "warning",
    completed: "success",
    failed: "destructive",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link href="/agents" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Zurück zu Agents
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Bot className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{agent.name}</h2>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
            </div>
            <AgentStatusBadge status={agent.status} />
          </div>
          {agent.description && (
            <p className="mt-2 text-sm text-muted-foreground">{agent.description}</p>
          )}
        </div>
        {agent.team && (
          <Badge variant="outline">{agent.team.name}</Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" /> Chat
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="h-4 w-4" /> Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <AgentChat agentId={agent.id} agentName={agent.name} />
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasks ({tasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Keine Tasks vorhanden
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={taskStatusColors[task.status] as "secondary" | "warning" | "success" | "destructive"} className="text-[10px]">
                          {task.status}
                        </Badge>
                        {task.tokens_used && (
                          <span className="text-xs text-muted-foreground">
                            {task.tokens_used.toLocaleString()} tokens
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <AgentConfigForm agent={agent} teams={teams} mode="edit" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
