import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { message_id, signal_type, metadata } = body as {
    message_id?: string;
    signal_type: string;
    metadata?: Record<string, unknown>;
    conversation_id?: string;
  };

  const validSignals = ["copied", "regenerated", "edited", "used_in_task", "conversation_continued", "conversation_ended"];
  if (!signal_type || !validSignals.includes(signal_type)) {
    return NextResponse.json({ error: "Valid signal_type required" }, { status: 400 });
  }

  // If no message_id, try to get the last assistant message from the conversation
  let resolvedMessageId = message_id;
  if (!resolvedMessageId && body.conversation_id) {
    const { data: lastMsg } = await supabase
      .from("messages")
      .select("id")
      .eq("conversation_id", body.conversation_id)
      .eq("role", "assistant")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    resolvedMessageId = lastMsg?.id;
  }

  if (!resolvedMessageId) {
    return NextResponse.json({ error: "message_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("output_signals")
    .insert({
      message_id: resolvedMessageId,
      signal_type,
      metadata: metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
