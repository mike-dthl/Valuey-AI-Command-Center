"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CLIENT_STATUSES, PROJECT_STATUSES } from "@/lib/constants";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  FolderKanban,
  Calendar,
  Pencil,
} from "lucide-react";
import { ClientDialog } from "./client-dialog";
import type { Client, ClientStatus, ProjectStatus } from "@/types/database";

const statusVariants: Record<ClientStatus, "success" | "secondary" | "info"> = {
  active: "success",
  inactive: "secondary",
  lead: "info",
};

const projectStatusVariants: Record<ProjectStatus, "success" | "secondary" | "info" | "warning" | "default"> = {
  planning: "info",
  active: "success",
  paused: "warning",
  completed: "default",
  archived: "secondary",
};

interface ClientDetailProps {
  client: Client & {
    projects: Array<{
      id: string;
      name: string;
      description: string | null;
      status: ProjectStatus;
      budget: number | null;
      deadline: string | null;
      tasks: { id: string }[];
    }>;
  };
  onRefetch: () => void;
}

export function ClientDetail({ client, onRefetch }: ClientDetailProps) {
  const statusConfig = CLIENT_STATUSES[client.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", statusConfig.dot)} />
                <Badge variant={statusVariants[client.status]} className="text-[10px]">
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
            {client.company && (
              <p className="mt-1 text-sm text-muted-foreground">{client.company}</p>
            )}
          </div>
        </div>
        <ClientDialog
          client={client}
          onSuccess={onRefetch}
          trigger={
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="h-3.5 w-3.5" /> Bearbeiten
            </Button>
          }
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Mail className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">E-Mail</p>
              <p className="text-sm">{client.email ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Phone className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefon</p>
              <p className="text-sm">{client.phone ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Building2 className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Firma</p>
              <p className="text-sm">{client.company ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {client.notes && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notizen</p>
            <p className="text-sm">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Projekte</h3>
          <Badge variant="secondary" className="text-[10px]">
            {client.projects.length}
          </Badge>
        </div>

        {client.projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <FolderKanban className="mb-2 h-8 w-8" />
              <p className="text-sm">Noch keine Projekte</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {client.projects.map((project) => {
              const pStatus = PROJECT_STATUSES[project.status];
              return (
                <Link key={project.id} href={`/projects?project=${project.id}`}>
                  <Card className="transition-all hover:border-primary/30 cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{project.name}</CardTitle>
                        <Badge
                          variant={projectStatusVariants[project.status]}
                          className="text-[10px]"
                        >
                          {pStatus.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      {project.description && (
                        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FolderKanban className="h-3 w-3" />
                          {project.tasks?.length ?? 0} Tasks
                        </span>
                        {project.budget && (
                          <span>
                            {project.budget.toLocaleString("de-DE")} EUR
                          </span>
                        )}
                        {project.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.deadline).toLocaleDateString("de-DE")}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
