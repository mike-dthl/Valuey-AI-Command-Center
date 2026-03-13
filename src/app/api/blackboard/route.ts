import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const priority = searchParams.get("priority");
  const status = searchParams.get("status");
  const teamId = searchParams.get("team_id");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  let query = supabase
    .from("blackboard_events")
    .select("*, source_team:teams!blackboard_events_source_team_id_fkey(*), target_team:teams!blackboard_events_target_team_id_fkey(*), source_agent:agents!blackboard_events_source_agent_id_fkey(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (priority) query = query.eq("priority", priority);
  if (status) query = query.eq("status", status);
  if (teamId) {
    query = query.or(`source_team_id.eq.${teamId},target_team_id.eq.${teamId}`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("blackboard_events")
    .insert(body)
    .select("*, source_team:teams!blackboard_events_source_team_id_fkey(*), target_team:teams!blackboard_events_target_team_id_fkey(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
