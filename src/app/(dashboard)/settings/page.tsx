import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input defaultValue="Solo Founder" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue="founder@valuey.ai" disabled />
          </div>
          <Button size="sm">Speichern</Button>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Keys</CardTitle>
          <CardDescription>Konfiguriere deine AI Provider Keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Anthropic API Key
              <Badge variant="success" className="ml-2">Connected</Badge>
            </label>
            <Input type="password" defaultValue="sk-ant-***" />
          </div>
          <Button size="sm">Aktualisieren</Button>
        </CardContent>
      </Card>

      {/* Obsidian */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Obsidian Integration</CardTitle>
          <CardDescription>Verbinde dein Obsidian Vault mit dem Command Center</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vault Pfad</label>
            <Input placeholder="/Users/du/Obsidian/MeinVault" />
          </div>
          <div className="text-xs text-muted-foreground">
            Wird in Phase 6 vollständig implementiert
          </div>
          <Button size="sm" variant="outline">Verbinden</Button>
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
