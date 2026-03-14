import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try to get existing config
  const { data, error } = await supabase
    .from("obsidian_config")
    .select("*")
    .eq("created_by", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (data) return NextResponse.json(data);

  // Create default config if none exists
  const { data: newConfig, error: insertError } = await supabase
    .from("obsidian_config")
    .insert({
      vault_path: "",
      sync_enabled: false,
      auto_sync_clients: false,
      auto_sync_projects: false,
      auto_sync_agent_outputs: false,
      auto_sync_blackboard: false,
      auto_daily_summary: false,
      knowledge_path: "Knowledge",
      created_by: user.id,
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json(newConfig);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  // Upsert: update if exists, insert if not
  const { data: existing } = await supabase
    .from("obsidian_config")
    .select("id")
    .eq("created_by", user.id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("obsidian_config")
      .update(body)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("obsidian_config")
    .insert({ ...body, created_by: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
