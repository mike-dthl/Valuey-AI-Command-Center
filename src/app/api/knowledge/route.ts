import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const search = url.searchParams.get("search");

  let query = supabase
    .from("knowledge_entries")
    .select("*")
    .order("updated_at", { ascending: false });

  if (type) {
    query = query.eq("entry_type", type);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { title, content, entry_type, tags } = body as {
    title: string;
    content: string;
    entry_type: string;
    tags?: string[];
  };

  if (!title?.trim() || !content?.trim() || !entry_type) {
    return NextResponse.json({ error: "title, content, and entry_type required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("knowledge_entries")
    .insert({
      title: title.trim(),
      content: content.trim(),
      entry_type,
      tags: tags ?? [],
      source_type: "manual",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
