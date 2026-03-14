"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Agent, Team } from "@/types/database";

interface AgentConfigFormProps {
  agent?: Agent;
  teams: Team[];
  mode: "create" | "edit";
}

export function AgentConfigForm({ agent, teams, mode }: AgentConfigFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: agent?.name ?? "",
    role: agent?.role ?? "",
    description: agent?.description ?? "",
    team_id: agent?.team_id ?? "",
    system_prompt: agent?.system_prompt ?? "",
    model: agent?.model ?? "claude-sonnet-4-20250514",
    temperature: agent?.temperature ?? 0.7,
    max_tokens: agent?.max_tokens ?? 4096,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_id) {
      toast.error("Bitte wähle ein Team aus");
      return;
    }
    setSaving(true);

    try {
      const url = mode === "create" ? "/api/agents" : `/api/agents/${agent?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save agent");

      const data = await res.json();
      toast.success(mode === "create" ? "Agent erstellt" : "Agent gespeichert");
      router.push(`/agents/${data.id}`);
      router.refresh();
    } catch {
      toast.error("Agent konnte nicht gespeichert werden");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allgemein</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Writer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rolle</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="z.B. Content-Erstellung"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Was macht dieser Agent?"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select
              value={formData.team_id}
              onValueChange={(val) => setFormData({ ...formData, team_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Team auswählen" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Konfiguration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system_prompt">System Prompt</Label>
            <Textarea
              id="system_prompt"
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              placeholder="Beschreibe die Rolle und Aufgabe des Agenten..."
              rows={6}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(val) => setFormData({ ...formData, model: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
                  <SelectItem value="claude-haiku-4-5-20251001">Claude Haiku 4.5</SelectItem>
                  <SelectItem value="claude-opus-4-20250514">Claude Opus 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_tokens">Max Tokens: {formData.max_tokens}</Label>
              <Select
                value={String(formData.max_tokens)}
                onValueChange={(val) => setFormData({ ...formData, max_tokens: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">1.024</SelectItem>
                  <SelectItem value="2048">2.048</SelectItem>
                  <SelectItem value="4096">4.096</SelectItem>
                  <SelectItem value="8192">8.192</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Temperature: {formData.temperature}</Label>
            <Slider
              value={[formData.temperature]}
              onValueChange={([val]) => setFormData({ ...formData, temperature: val })}
              min={0}
              max={1}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Präzise (0)</span>
              <span>Kreativ (1)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Speichern..." : mode === "create" ? "Agent erstellen" : "Speichern"}
        </Button>
      </div>
    </form>
  );
}
