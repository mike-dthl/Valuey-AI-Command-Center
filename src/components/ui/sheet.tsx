"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
}

function SheetContent({
  children,
  className,
  side = "left",
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex h-full w-72 flex-col border-border bg-background p-6 shadow-lg transition-transform",
        side === "left" ? "left-0 border-r" : "right-0 border-l",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

export { Sheet, SheetContent };
