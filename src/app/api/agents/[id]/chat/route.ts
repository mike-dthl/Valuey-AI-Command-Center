import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamAgentChat, calculateCost } from "@/lib/anthropic";
import type { ChatMessageInput } from "@/lib/anthropic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: agentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { message, conversation_id } = body as {
    message: string;
    conversation_id?: string;
  };

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // Load agent config
  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agentId)
    .single();

  if (agentError || !agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Get or create conversation
  let convId = conversation_id;
  if (!convId) {
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .insert({
        agent_id: agentId,
        title: message.slice(0, 100),
        created_by: user.id,
      })
      .select()
      .single();

    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }
    convId = conv.id;
  }

  // Save user message
  await supabase.from("messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  // Update agent status to busy
  await supabase
    .from("agents")
    .update({ status: "busy" })
    .eq("id", agentId);

  // Load conversation history
  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at");

  const chatMessages: ChatMessageInput[] = (history ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Stream response
  let assistantContent = "";
  let usageData: { inputTokens: number; outputTokens: number; cost: number } | null = null;

  let stream;
  try {
    stream = await streamAgentChat({
      systemPrompt: agent.system_prompt,
      messages: chatMessages,
      model: agent.model,
      temperature: Number(agent.temperature),
      maxTokens: agent.max_tokens,
      onUsage(usage) {
        usageData = usage;
      },
    });
  } catch (err) {
    // Reset agent status on error — prevent stuck "busy" state
    await supabase.from("agents").update({ status: "idle" }).eq("id", agentId);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }

  // Create a transform stream that captures content for DB storage
  const transformStream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      // Parse the SSE data to capture assistant content
      const text = new TextDecoder().decode(chunk);
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.type === "text") {
              assistantContent += parsed.text;
            }
            if (parsed.type === "done") {
              usageData = {
                inputTokens: parsed.usage.input_tokens,
                outputTokens: parsed.usage.output_tokens,
                cost: parsed.usage.cost,
              };
            }
          } catch {
            // ignore parse errors
          }
        }
      }
      // Add conversation_id metadata on first chunk
      controller.enqueue(chunk);
    },
    async flush() {
      // Save assistant message to DB after stream completes
      if (assistantContent) {
        await supabase.from("messages").insert({
          conversation_id: convId,
          role: "assistant",
          content: assistantContent,
          tokens_used: usageData
            ? usageData.inputTokens + usageData.outputTokens
            : null,
          cost: usageData?.cost ?? null,
        });
      }

      // Log usage
      if (usageData) {
        await supabase.from("usage_logs").insert({
          agent_id: agentId,
          action_type: "chat",
          tokens_input: usageData.inputTokens,
          tokens_output: usageData.outputTokens,
          cost: usageData.cost,
          model: agent.model,
        });
      }

      // Reset agent status
      await supabase
        .from("agents")
        .update({ status: "idle" })
        .eq("id", agentId);
    },
  });

  const responseStream = stream.pipeThrough(transformStream);

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Conversation-Id": convId!,
    },
  });
}
