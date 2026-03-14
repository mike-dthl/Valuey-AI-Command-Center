"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Check } from "lucide-react";
import { useProfile, useObsidianConfig } from "@/hooks/use-settings";

export default function SettingsPage() {
  const { profile, loading: profileLoading, saving: profileSaving, updateName } = useProfile();
  const { config, loading: configLoading, saving: configSaving, updateConfig } = useObsidianConfig();
  const [name, setName] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [obsidianSaved, setObsidianSaved] = useState(false);

  const displayName = name ?? profile?.full_name ?? "";

  const handleSaveProfile = async () => {
    await updateName(displayName);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveObsidian = async () => {
    if (!config) return;
    await updateConfig({
      vault_path: config.vault_path,
      sync_enabled: config.sync_enabled,
      auto_sync_clients: config.auto_sync_clients,
      auto_sync_projects: config.auto_sync_projects,
      auto_sync_agent_outputs: config.auto_sync_agent_outputs,
      auto_sync_blackboard: config.auto_sync_blackboard,
      auto_daily_summary: config.auto_daily_summary,
      knowledge_path: config.knowledge_path,
    });
    setObsidianSaved(true);
    setTimeout(() => setObsidianSaved(false), 2000);
  };

  const toggleField = (field: string, value: boolean) => {
    updateConfig({ [field]: value });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Einstellungen</h2>
        <p className="text-sm text-muted-foreground">Konfiguration deines Command Centers</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
          <CardDescription>Deine persönlichen Informationen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={profile?.email ?? ""} disabled />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                >
                  {profileSaving ? "Speichern..." : "Speichern"}
                </Button>
                {profileSaved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Check className="h-3 w-3" /> Gespeichert
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Keys</CardTitle>
          <CardDescription>AI Provider Konfiguration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Anthropic API Key
              <Badge variant="success" className="ml-2">Connected</Badge>
            </label>
            <Input type="password" value="sk-ant-***" disabled />
            <p className="text-xs text-muted-foreground">
              Wird über Umgebungsvariable ANTHROPIC_API_KEY konfiguriert
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Obsidian */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Obsidian Integration</CardTitle>
          <CardDescription>Verbinde dein Obsidian Vault mit dem Command Center</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {configLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : config ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vault Pfad</label>
                <Input
                  value={config.vault_path}
                  onChange={(e) => updateConfig({ vault_path: e.target.value })}
                  placeholder="/Users/du/Obsidian/MeinVault"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Knowledge Pfad</label>
                <Input
                  value={config.knowledge_path}
                  onChange={(e) => updateConfig({ knowledge_path: e.target.value })}
                  placeholder="Knowledge"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sync aktivieren</p>
                    <p className="text-xs text-muted-foreground">Hauptschalter für Obsidian-Sync</p>
                  </div>
                  <Switch
                    checked={config.sync_enabled}
                    onCheckedChange={(v) => toggleField("sync_enabled", v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Clients synchronisieren</p>
                  </div>
                  <Switch
                    checked={config.auto_sync_clients}
                    onCheckedChange={(v) => toggleField("auto_sync_clients", v)}
                    disabled={!config.sync_enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Projekte synchronisieren</p>
                  </div>
                  <Switch
                    checked={config.auto_sync_projects}
                    onCheckedChange={(v) => toggleField("auto_sync_projects", v)}
                    disabled={!config.sync_enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Agent-Outputs synchronisieren</p>
                  </div>
                  <Switch
                    checked={config.auto_sync_agent_outputs}
                    onCheckedChange={(v) => toggleField("auto_sync_agent_outputs", v)}
                    disabled={!config.sync_enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Blackboard synchronisieren</p>
                  </div>
                  <Switch
                    checked={config.auto_sync_blackboard}
                    onCheckedChange={(v) => toggleField("auto_sync_blackboard", v)}
                    disabled={!config.sync_enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Tägliche Zusammenfassung</p>
                  </div>
                  <Switch
                    checked={config.auto_daily_summary}
                    onCheckedChange={(v) => toggleField("auto_daily_summary", v)}
                    disabled={!config.sync_enabled}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleSaveObsidian}
                  disabled={configSaving}
                >
                  {configSaving ? "Speichern..." : "Speichern"}
                </Button>
                {obsidianSaved && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Check className="h-3 w-3" /> Gespeichert
                  </span>
                )}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
          <CardDescription>Verwalte Team-Mitglieder und Rollen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Multi-User Management wird hier verfügbar sein
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
