import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: teams, error } = await supabase
    .from("teams")
    .select("*, agents(id)")
    .order("position");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const teamsWithCount = teams.map((team) => ({
    ...team,
    agent_count: team.agents?.length ?? 0,
    agents: undefined,
  }));

  return NextResponse.json(teamsWithCount);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { data, error } = await supabase
    .from("teams")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
