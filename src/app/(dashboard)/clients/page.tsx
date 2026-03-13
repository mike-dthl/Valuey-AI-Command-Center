import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const clients = [
  { name: "Acme Corp", company: "Acme Corp", email: "john@acme.com", status: "active", projects: 2 },
  { name: "Startup XYZ", company: "XYZ GmbH", email: "maria@xyz.de", status: "active", projects: 1 },
  { name: "Tech Solutions", company: "TechSol AG", email: "info@techsol.de", status: "lead", projects: 0 },
  { name: "Digital Agency", company: "DigiAg", email: "hello@digiag.com", status: "active", projects: 3 },
  { name: "E-Commerce Plus", company: "ECP Ltd", email: "ceo@ecp.io", status: "inactive", projects: 1 },
];

const statusVariants: Record<string, "success" | "secondary" | "info"> = {
  active: "success",
  inactive: "secondary",
  lead: "info",
};

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clients</h2>
          <p className="text-sm text-muted-foreground">{clients.length} Kunden</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Neuer Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Kunden suchen..." className="pl-10" />
      </div>

      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Firma</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Projekte</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.email}
                className="border-b border-border transition-colors hover:bg-accent/50 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm font-medium">{client.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.company}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[client.status]}>{client.status}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{client.projects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
