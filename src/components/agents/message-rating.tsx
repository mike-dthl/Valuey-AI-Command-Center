"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MessageRatingProps {
  messageContent: string;
  conversationId: string | null;
  onSignal?: (type: "copied" | "thumbs_up" | "thumbs_down") => void;
}

export function MessageRating({
  messageContent,
  conversationId,
  onSignal,
}: MessageRatingProps) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRate = async (value: "up" | "down") => {
    if (rating === value) return;
    setRating(value);

    if (!conversationId) return;

    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          rating: value === "up" ? 5 : 1,
          feedback_type: "quality",
        }),
      });
      onSignal?.(value === "up" ? "thumbs_up" : "thumbs_down");
    } catch {
      // Silent — rating is non-critical
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopied(true);
      toast.success("Kopiert!");
      setTimeout(() => setCopied(false), 2000);
      onSignal?.("copied");

      // Track copy signal
      if (conversationId) {
        fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationId,
            signal_type: "copied",
          }),
        }).catch(() => {});
      }
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  return (
    <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6",
          rating === "up" && "text-emerald-400 hover:text-emerald-400"
        )}
        onClick={() => handleRate("up")}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6",
          rating === "down" && "text-red-400 hover:text-red-400"
        )}
        onClick={() => handleRate("down")}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-emerald-400" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
