"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types/database";

const projectSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  description: z.string().optional(),
  client_id: z.string().optional(),
  status: z.enum(["planning", "active", "paused", "completed", "archived"]),
  budget: z.number().optional(),
  deadline: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  project?: Project;
  clients: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ProjectDialog({
  project,
  clients,
  onSuccess,
  trigger,
}: ProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      client_id: project?.client_id ?? "",
      status: project?.status ?? "planning",
      budget: project?.budget ?? undefined,
      deadline: project?.deadline
        ? new Date(project.deadline).toISOString().split("T")[0]
        : "",
    },
  });

  const statusValue = watch("status");
  const clientValue = watch("client_id");

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";
      const payload = {
        ...data,
        client_id: data.client_id || null,
        deadline: data.deadline || null,
        budget: data.budget ? Number(data.budget) : null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save project");
      toast.success(isEdit ? "Projekt aktualisiert" : "Projekt erstellt");
      setOpen(false);
      reset();
      onSuccess?.();
    } catch {
      toast.error("Projekt konnte nicht gespeichert werden");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Neues Projekt
          </Button>
        )}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Projekt bearbeiten" : "Neues Projekt"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Name *</Label>
              <Input
                id="proj-name"
                {...register("name")}
                placeholder="Projektname"
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc">Beschreibung</Label>
              <Textarea
                id="proj-desc"
                {...register("description")}
                placeholder="Projektbeschreibung..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  value={clientValue ?? ""}
                  onValueChange={(v) => setValue("client_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kein Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Kein Client</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(v) =>
                    setValue("status", v as ProjectFormData["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planung</SelectItem>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="paused">Pausiert</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="archived">Archiviert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proj-budget">Budget (EUR)</Label>
                <Input
                  id="proj-budget"
                  type="number"
                  {...register("budget")}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-deadline">Deadline</Label>
                <Input
                  id="proj-deadline"
                  type="date"
                  {...register("deadline")}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Speichern..."
                  : isEdit
                    ? "Speichern"
                    : "Erstellen"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
