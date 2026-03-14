"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { KnowledgeEntry, KnowledgeEntryType } from "@/types/database";

const ENTRY_TYPES: { value: KnowledgeEntryType; label: string }[] = [
  { value: "client_profile", label: "Client-Profil" },
  { value: "project_context", label: "Projekt-Kontext" },
  { value: "industry_knowledge", label: "Branchenwissen" },
  { value: "best_practice", label: "Best Practice" },
  { value: "sop", label: "SOP" },
];

interface KnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: KnowledgeEntry | null;
  onSave: (data: {
    title: string;
    content: string;
    entry_type: KnowledgeEntryType;
    tags: string[];
  }) => Promise<void>;
}

export function KnowledgeDialog({
  open,
  onOpenChange,
  entry,
  onSave,
}: KnowledgeDialogProps) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [entryType, setEntryType] = useState<KnowledgeEntryType>(
    entry?.entry_type ?? "best_practice"
  );
  const [tagsInput, setTagsInput] = useState(entry?.tags?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Titel und Inhalt sind Pflichtfelder");
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await onSave({ title: title.trim(), content: content.trim(), entry_type: entryType, tags });
      toast.success(entry ? "Eintrag aktualisiert" : "Eintrag erstellt");
      onOpenChange(false);
    } catch {
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Wissen bearbeiten" : "Neues Wissen hinzufügen"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="kb-title">Titel</Label>
            <Input
              id="kb-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Client X — Kommunikationspräferenzen"
            />
          </div>

          <div>
            <Label htmlFor="kb-type">Typ</Label>
            <Select value={entryType} onValueChange={(v) => setEntryType(v as KnowledgeEntryType)}>
              <SelectTrigger id="kb-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="kb-content">Inhalt</Label>
            <Textarea
              id="kb-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Beschreibe das Wissen hier..."
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="kb-tags">Tags (kommagetrennt)</Label>
            <Input
              id="kb-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="z.B. marketing, seo, client-x"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Speichern..." : "Speichern"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
