import Anthropic from "@anthropic-ai/sdk";

// Singleton Anthropic client
let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

// Cost per 1M tokens (USD)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-20250514": { input: 3, output: 15 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
  "claude-opus-4-20250514": { input: 15, output: 75 },
};

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model] ?? { input: 3, output: 15 };
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
}

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

/**
 * Stream a chat response from Claude.
 * Returns a ReadableStream of text chunks + usage info via callback.
 */
export async function streamAgentChat({
  systemPrompt,
  messages,
  model = "claude-sonnet-4-20250514",
  temperature = 0.7,
  maxTokens = 4096,
  onUsage,
}: {
  systemPrompt: string;
  messages: ChatMessageInput[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onUsage?: (usage: { inputTokens: number; outputTokens: number; cost: number }) => void;
}): Promise<ReadableStream<Uint8Array>> {
  const anthropic = getAnthropicClient();

  const stream = anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  let fullContent = "";

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullContent += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`));
          }
        }

        // Get final message for usage
        const finalMessage = await stream.finalMessage();
        const usage = finalMessage.usage;
        const cost = calculateCost(model, usage.input_tokens, usage.output_tokens);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              usage: {
                input_tokens: usage.input_tokens,
                output_tokens: usage.output_tokens,
                cost,
              },
            })}\n\n`
          )
        );

        if (onUsage) {
          onUsage({
            inputTokens: usage.input_tokens,
            outputTokens: usage.output_tokens,
            cost,
          });
        }

        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", error: String(error) })}\n\n`
          )
        );
        controller.close();
      }
    },
  });
}
