"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bell, Check, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  read: boolean;
  createdAt: string;
}

// Placeholder notifications
const placeholderNotifications: Notification[] = [
  {
    id: "1",
    title: "Agent 'Writer' hat Task abgeschlossen",
    message: "Blog Draft: AI Trends 2026 ist fertig",
    type: "success",
    read: false,
    createdAt: "vor 5 Min.",
  },
  {
    id: "2",
    title: "Neues Blackboard Event",
    message: "deal_closed: Acme Corp — Website Redesign",
    type: "urgent",
    read: false,
    createdAt: "vor 12 Min.",
  },
  {
    id: "3",
    title: "Workflow 'Content Pipeline' abgeschlossen",
    message: "4/4 Steps erfolgreich",
    type: "info",
    read: true,
    createdAt: "vor 1 Std.",
  },
];

const typeColors = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  urgent: "bg-red-500",
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(placeholderNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">Benachrichtigungen</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Alle gelesen
                </button>
              )}
            </div>

            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Keine Benachrichtigungen
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50",
                        !notification.read && "bg-accent/20"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          typeColors[notification.type]
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {notification.createdAt}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-1 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
