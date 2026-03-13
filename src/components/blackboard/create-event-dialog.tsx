"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Team } from "@/types/database";

const eventTypes = [
  "content_published",
  "deal_closed",
  "feature_request",
  "bug_report",
  "feature_shipped",
  "deployment_status",
  "capacity_update",
] as const;

interface CreateEventDialogProps {
  onCreated?: () => void;
}

export function CreateEventDialog({ onCreated }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    event_type: "",
    title: "",
    description: "",
    source_team_id: "",
    target_team_id: "",
    priority: "normal",
  });

  useEffect(() => {
    if (open) {
      fetch("/api/teams")
        .then((r) => r.json())
        .then(setTeams)
        .catch(() => {});
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/blackboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: form.event_type,
          title: form.title,
          source_team_id: form.source_team_id || null,
          target_team_id: form.target_team_id || null,
          priority: form.priority,
          payload: { description: form.description },
        }),
      });

      if (res.ok) {
        setOpen(false);
        setForm({
          event_type: "",
          title: "",
          description: "",
          source_team_id: "",
          target_team_id: "",
          priority: "normal",
        });
        onCreated?.();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Neues Event
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neues Blackboard Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Event-Typ</Label>
            <Select
              value={form.event_type}
              onValueChange={(val) => setForm({ ...form, event_type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Typ auswählen" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Titel</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Event-Titel"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Beschreibung</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Details zum Event"
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Von Team</Label>
              <Select
                value={form.source_team_id}
                onValueChange={(val) => setForm({ ...form, source_team_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>An Team</Label>
              <Select
                value={form.target_team_id}
                onValueChange={(val) => setForm({ ...form, target_team_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Priorität</Label>
            <Select
              value={form.priority}
              onValueChange={(val) => setForm({ ...form, priority: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={saving || !form.title || !form.event_type}>
              {saving ? "Erstellen..." : "Event erstellen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
