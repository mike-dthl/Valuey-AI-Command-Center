"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/types/chat";

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadConversation = useCallback(async (convId: string) => {
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at");

      if (data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            created_at: m.created_at,
          }))
        );
        setConversationId(convId);
      }
    } catch {
      // ignore
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      // Add user message optimistically
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Add placeholder for assistant
      const assistantId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(true);

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch(`/api/agents/${agentId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            conversation_id: conversationId,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Chat failed: ${res.status}`);
        }

        // Get conversation ID from header
        const convId = res.headers.get("X-Conversation-Id");
        if (convId) setConversationId(convId);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.type === "text") {
                accumulatedContent += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }

        // Mark streaming as done
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Fehler beim Senden der Nachricht. Bitte versuche es erneut.",
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [agentId, conversationId, isStreaming]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return {
    messages,
    isStreaming,
    conversationId,
    sendMessage,
    stopStreaming,
    clearMessages,
    loadConversation,
  };
}
