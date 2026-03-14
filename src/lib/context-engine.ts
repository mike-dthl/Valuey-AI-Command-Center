import { SupabaseClient } from "@supabase/supabase-js";
import type { AgentMemory, KnowledgeEntry } from "@/types/database";

/**
 * Context Engine — Enriches agent system prompts with relevant memories and knowledge.
 * This is the core of the self-learning system.
 */

const MAX_MEMORIES = 10;
const MAX_KNOWLEDGE = 5;

/**
 * Load the most relevant memories for an agent.
 * Updates access_count and last_accessed_at for retrieved memories.
 */
export async function getRelevantMemories(
  supabase: SupabaseClient,
  agentId: string
): Promise<AgentMemory[]> {
  const { data: memories } = await supabase
    .from("agent_memories")
    .select("*")
    .eq("agent_id", agentId)
    .order("relevance_score", { ascending: false })
    .limit(MAX_MEMORIES);

  if (!memories || memories.length === 0) return [];

  // Update access stats (fire-and-forget)
  const ids = memories.map((m) => m.id);
  supabase
    .from("agent_memories")
    .update({
      access_count: memories[0].access_count + 1,
      last_accessed_at: new Date().toISOString(),
    })
    .in("id", ids)
    .then(() => {});

  return memories as AgentMemory[];
}

/**
 * Search knowledge base by tags or keyword matching.
 * Returns top entries sorted by recency.
 */
export async function searchKnowledge(
  supabase: SupabaseClient,
  query: string,
  tags?: string[]
): Promise<KnowledgeEntry[]> {
  let queryBuilder = supabase
    .from("knowledge_entries")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(MAX_KNOWLEDGE);

  // If tags provided, filter by overlap
  if (tags && tags.length > 0) {
    queryBuilder = queryBuilder.overlaps("tags", tags);
  }

  const { data } = await queryBuilder;

  if (!data || data.length === 0) return [];

  // Simple keyword relevance filter — prefer entries whose title/content matches the query
  const queryLower = query.toLowerCase();
  const scored = data.map((entry) => ({
    ...entry,
    _score:
      (entry.title.toLowerCase().includes(queryLower) ? 2 : 0) +
      (entry.content.toLowerCase().includes(queryLower) ? 1 : 0),
  }));

  return scored
    .sort((a, b) => b._score - a._score)
    .map(({ _score, ...entry }) => entry) as KnowledgeEntry[];
}

/**
 * Build an enriched system prompt by injecting memories and knowledge.
 */
export function buildEnrichedPrompt(
  basePrompt: string,
  memories: AgentMemory[],
  knowledge: KnowledgeEntry[]
): string {
  const sections: string[] = [basePrompt];

  if (memories.length > 0) {
    const memoryLines = memories.map(
      (m) => `- [${m.category}] ${m.content}`
    );
    sections.push(
      `\n## Dein Gedächtnis\nDiese Fakten hast du aus früheren Konversationen gelernt:\n${memoryLines.join("\n")}`
    );
  }

  if (knowledge.length > 0) {
    const knowledgeLines = knowledge.map(
      (k) => `- **${k.title}**: ${k.content.slice(0, 200)}${k.content.length > 200 ? "…" : ""}`
    );
    sections.push(
      `\n## Relevantes Wissen\n${knowledgeLines.join("\n")}`
    );
  }

  return sections.join("\n");
}

const MEMORY_CATEGORIES = [
  "client_preference",
  "task_learning",
  "domain_knowledge",
  "workflow_insight",
  "error_pattern",
] as const;

/**
 * Extract memories from a conversation using Claude Haiku.
 * Called async after chat completes — not blocking the UX.
 */
export async function extractMemories(
  supabase: SupabaseClient,
  agentId: string,
  conversationId: string,
  messages: { role: string; content: string }[]
): Promise<{ category: string; content: string }[]> {
  // Only extract from conversations with at least 2 messages
  if (messages.length < 2) return [];

  const { getAnthropicClient, calculateCost } = await import("@/lib/anthropic");
  const anthropic = getAnthropicClient();

  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n\n");

  const extractionPrompt = `Analysiere diese Konversation und extrahiere 0-3 wichtige Fakten oder Learnings, die für zukünftige Aufgaben relevant sind.

Kategorien:
- client_preference: Kundenpräferenzen (z.B. "Client mag kurze Texte")
- task_learning: Aufgaben-Learnings (z.B. "Bei SEO-Texten H2-Struktur verwenden")
- domain_knowledge: Branchenwissen (z.B. "Branche hat Compliance-Anforderungen")
- workflow_insight: Prozess-Erkenntnisse (z.B. "Erst Outline, dann Draft")
- error_pattern: Fehler-Muster (z.B. "API X ist abends langsam")

Antworte NUR mit einem JSON-Array. Wenn nichts Relevantes: leeres Array [].
Format: [{"category": "...", "content": "..."}]

Konversation:
${conversationText}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      temperature: 0.3,
      messages: [{ role: "user", content: extractionPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Log extraction cost
    const cost = calculateCost(
      "claude-haiku-4-5-20251001",
      response.usage.input_tokens,
      response.usage.output_tokens
    );
    await supabase.from("usage_logs").insert({
      agent_id: agentId,
      action_type: "memory_extraction",
      tokens_input: response.usage.input_tokens,
      tokens_output: response.usage.output_tokens,
      cost,
      model: "claude-haiku-4-5-20251001",
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]) as {
      category: string;
      content: string;
    }[];

    // Validate and save
    const validMemories = parsed.filter(
      (m) =>
        MEMORY_CATEGORIES.includes(m.category as (typeof MEMORY_CATEGORIES)[number]) &&
        m.content?.trim()
    );

    for (const memory of validMemories) {
      await supabase.from("agent_memories").insert({
        agent_id: agentId,
        category: memory.category,
        content: memory.content.trim(),
        source_conversation_id: conversationId,
      });
    }

    // Note: Memory relevance decay can be implemented via a periodic cron job
    // or Supabase Edge Function in the future.

    return validMemories;
  } catch (err) {
    console.error("Memory extraction failed:", err);
    return [];
  }
}
