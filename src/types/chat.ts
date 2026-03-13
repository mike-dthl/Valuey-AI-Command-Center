import type { MessageRole } from "./database";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  isStreaming?: boolean;
}

export interface SendMessagePayload {
  message: string;
  conversation_id?: string;
}

export interface ChatStreamResponse {
  conversation_id: string;
  message_id: string;
}
