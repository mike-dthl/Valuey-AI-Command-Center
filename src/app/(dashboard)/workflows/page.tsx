import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Play, ArrowRight } from "lucide-react";

const workflows = [
  {
    name: "Content Pipeline",
    description: "Researcher → Writer → Repurposer → Scheduler",
    trigger: "manual",
    active: true,
    runs: 23,
    lastRun: "vor 2 Std.",
    steps: ["Researcher", "Writer", "Repurposer", "Scheduler"],
  },
  {
    name: "Lead Qualification",
    description: "Prospector → Qualifier → Outreach-Writer",
    trigger: "scheduled",
    active: true,
    runs: 15,
    lastRun: "vor 6 Std.",
    steps: ["Prospector", "Qualifier", "Outreach-Writer"],
  },
  {
    name: "Client Onboarding",
    description: "Project Manager → Client Communicator → Finance Agent",
    trigger: "event",
    active: true,
    runs: 8,
    lastRun: "vor 1 Tag",
    steps: ["Project Manager", "Client Communicator", "Finance Agent"],
  },
  {
    name: "Code Review Pipeline",
    description: "Planner → Developer → Reviewer",
    trigger: "manual",
    active: false,
    runs: 5,
    lastRun: "vor 3 Tagen",
    steps: ["Planner", "Developer", "Reviewer"],
  },
];

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflows</h2>
          <p className="text-sm text-muted-foreground">
            {workflows.length} Workflows &middot; {workflows.filter((w) => w.active).length} aktiv
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Neuer Workflow
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {workflows.map((workflow) => (
          <Card key={workflow.name} className="transition-all hover:border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{workflow.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={workflow.active ? "success" : "secondary"}>
                    {workflow.active ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-1">
                {workflow.steps.map((step, i) => (
                  <span key={step} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{step}</Badge>
                    {i < workflow.steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Trigger: {workflow.trigger}</span>
                <span>{workflow.runs} Runs &middot; Letzter: {workflow.lastRun}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
