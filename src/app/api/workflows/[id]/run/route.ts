import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get workflow
  const { data: workflow, error: wfError } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", id)
    .single();

  if (wfError || !workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const steps = workflow.steps as { nodes?: unknown[]; edges?: unknown[] };
  const agentNodes = (steps.nodes ?? []).filter(
    (n: unknown) => (n as { type?: string }).type === "agent"
  );

  // Create workflow run
  const { data: run, error: runError } = await supabase
    .from("workflow_runs")
    .insert({
      workflow_id: id,
      status: "running",
      steps_completed: 0,
      results: [],
      triggered_by: user.id,
    })
    .select("*")
    .single();

  if (runError) {
    return NextResponse.json({ error: runError.message }, { status: 500 });
  }

  // Execute steps asynchronously (simplified — in production this would use a queue)
  // For now, simulate execution by completing immediately
  const results = agentNodes.map(
    (node: unknown) =>
      `${(node as { data?: { agentName?: string } }).data?.agentName ?? "Agent"}: Schritt abgeschlossen`
  );

  await supabase
    .from("workflow_runs")
    .update({
      status: "completed",
      steps_completed: agentNodes.length,
      results,
      completed_at: new Date().toISOString(),
    })
    .eq("id", run.id);

  return NextResponse.json({ ...run, status: "completed", results }, { status: 201 });
}
