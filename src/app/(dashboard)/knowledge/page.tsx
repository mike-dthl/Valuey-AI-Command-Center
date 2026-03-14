"use client";

import { useState } from "react";
import { useKnowledge } from "@/hooks/use-knowledge";
import { KnowledgeDialog } from "@/components/knowledge/knowledge-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import type { KnowledgeEntry, KnowledgeEntryType } from "@/types/database";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  client_profile: { label: "Client-Profil", color: "bg-blue-500/15 text-blue-400" },
  project_context: { label: "Projekt-Kontext", color: "bg-purple-500/15 text-purple-400" },
  industry_knowledge: { label: "Branchenwissen", color: "bg-amber-500/15 text-amber-400" },
  best_practice: { label: "Best Practice", color: "bg-emerald-500/15 text-emerald-400" },
  sop: { label: "SOP", color: "bg-red-500/15 text-red-400" },
};

export default function KnowledgePage() {
  const {
    entries,
    loading,
    filter,
    search,
    setFilter,
    setSearch,
    createEntry,
    updateEntry,
    deleteEntry,
  } = useKnowledge();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);

  const handleCreate = () => {
    setEditingEntry(null);
    setDialogOpen(true);
  };

  const handleEdit = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      toast.success("Eintrag gelöscht");
    } catch {
      toast.error("Löschen fehlgeschlagen");
    }
  };

  const handleSave = async (data: {
    title: string;
    content: string;
    entry_type: KnowledgeEntryType;
    tags: string[];
  }) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, data);
    } else {
      await createEntry(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground">
            Wissen das deine Agenten schlauer macht — {entries.length} Einträge
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Wissen hinzufügen
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as KnowledgeEntryType | "all")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alle Typen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            {Object.entries(TYPE_LABELS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Noch kein Wissen vorhanden</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Füge Wissen hinzu, das deine Agenten in ihren Antworten nutzen können.
            </p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Ersten Eintrag erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => {
            const typeInfo = TYPE_LABELS[entry.entry_type] ?? {
              label: entry.entry_type,
              color: "bg-zinc-500/15 text-zinc-400",
            };
            return (
              <Card key={entry.id} className="group relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{entry.title}</CardTitle>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEdit(entry)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-400"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Badge variant="secondary" className={typeInfo.color}>
                    {typeInfo.label}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.content}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <KnowledgeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        onSave={handleSave}
      />
    </div>
  );
}
