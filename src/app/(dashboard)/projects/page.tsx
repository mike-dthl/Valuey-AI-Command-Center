import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const columns = [
  {
    title: "Planning",
    color: "text-blue-400",
    tasks: [
      { title: "Content-Strategie Q2", project: "Acme Corp", agent: "Planner", priority: "high" },
    ],
  },
  {
    title: "In Progress",
    color: "text-amber-400",
    tasks: [
      { title: "Website Redesign", project: "Acme Corp", agent: "Developer", priority: "high" },
      { title: "Blog Artikel", project: "Startup XYZ", agent: "Writer", priority: "medium" },
      { title: "Lead-Analyse", project: "Tech Solutions", agent: "Qualifier", priority: "medium" },
    ],
  },
  {
    title: "Review",
    color: "text-purple-400",
    tasks: [
      { title: "Social Media Kampagne", project: "DigiAg", agent: "Reviewer", priority: "low" },
    ],
  },
  {
    title: "Done",
    color: "text-emerald-400",
    tasks: [
      { title: "Onboarding Dokumente", project: "Acme Corp", agent: "Client Communicator", priority: "medium" },
      { title: "Rechnung Q1", project: "DigiAg", agent: "Finance Agent", priority: "low" },
    ],
  },
];

const priorityVariants: Record<string, "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">Kanban Board</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Neues Projekt
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.title} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${column.color}`}>
                {column.title}
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {column.tasks.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card key={task.title} className="cursor-pointer transition-all hover:border-primary/30">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{task.project}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{task.agent}</span>
                      <Badge variant={priorityVariants[task.priority]} className="text-[10px]">
                        {task.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
