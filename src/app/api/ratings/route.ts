import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { conversation_id, message_id, rating, feedback_type, comment } = body as {
    conversation_id: string;
    message_id?: string;
    rating: number;
    feedback_type?: string;
    comment?: string;
  };

  if (!conversation_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "conversation_id and rating (1-5) required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("conversation_ratings")
    .insert({
      conversation_id,
      message_id: message_id ?? null,
      rating,
      feedback_type: feedback_type ?? "quality",
      comment: comment ?? null,
      rated_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
