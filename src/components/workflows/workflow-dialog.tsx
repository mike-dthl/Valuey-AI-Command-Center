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
import type { Workflow } from "@/types/database";

const workflowSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  description: z.string().optional(),
  trigger_type: z.enum(["manual", "scheduled", "event"]),
  is_active: z.boolean(),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

interface WorkflowDialogProps {
  workflow?: Workflow;
  onSuccess?: (workflow: Workflow) => void;
  trigger?: React.ReactNode;
}

export function WorkflowDialog({
  workflow,
  onSuccess,
  trigger,
}: WorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!workflow;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: workflow?.name ?? "",
      description: workflow?.description ?? "",
      trigger_type: workflow?.trigger_type ?? "manual",
      is_active: workflow?.is_active ?? true,
    },
  });

  const triggerType = watch("trigger_type");

  const onSubmit = async (data: WorkflowFormData) => {
    setSubmitting(true);
    try {
      const url = isEdit
        ? `/api/workflows/${workflow.id}`
        : "/api/workflows";
      const method = isEdit ? "PATCH" : "POST";
      const payload = {
        ...data,
        ...(isEdit
          ? {}
          : {
              steps: {
                nodes: [
                  {
                    id: "trigger-1",
                    type: "trigger",
                    position: { x: 50, y: 150 },
                    data: { label: "Start", triggerType: data.trigger_type },
                  },
                  {
                    id: "output-1",
                    type: "output",
                    position: { x: 400, y: 150 },
                    data: { label: "Fertig" },
                  },
                ],
                edges: [
                  {
                    id: "e-t-o",
                    source: "trigger-1",
                    target: "output-1",
                    animated: true,
                  },
                ],
              },
            }),
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      const result = await res.json();
      toast.success(isEdit ? "Workflow aktualisiert" : "Workflow erstellt");
      setOpen(false);
      reset();
      onSuccess?.(result);
    } catch {
      toast.error("Workflow konnte nicht gespeichert werden");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Neuer Workflow
          </Button>
        )}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Workflow bearbeiten" : "Neuer Workflow"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wf-name">Name *</Label>
              <Input
                id="wf-name"
                {...register("name")}
                placeholder="Workflow-Name"
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wf-desc">Beschreibung</Label>
              <Textarea
                id="wf-desc"
                {...register("description")}
                placeholder="Was macht dieser Workflow?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select
                value={triggerType}
                onValueChange={(v) =>
                  setValue("trigger_type", v as WorkflowFormData["trigger_type"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manuell</SelectItem>
                  <SelectItem value="scheduled">Geplant</SelectItem>
                  <SelectItem value="event">Event-basiert</SelectItem>
                </SelectContent>
              </Select>
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
