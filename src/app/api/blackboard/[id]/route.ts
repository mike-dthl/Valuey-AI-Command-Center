import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const updateData: Record<string, unknown> = { status: body.status };

  if (body.status === "resolved") {
    updateData.resolved_at = new Date().toISOString();
    updateData.resolved_by = user.id;
  }

  const { data, error } = await supabase
    .from("blackboard_events")
    .update(updateData)
    .eq("id", id)
    .select("*, source_team:teams!blackboard_events_source_team_id_fkey(*), target_team:teams!blackboard_events_target_team_id_fkey(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
