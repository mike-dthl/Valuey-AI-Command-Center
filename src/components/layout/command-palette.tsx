"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Users,
  FolderKanban,
  Workflow,
  BarChart3,
  Settings,
  Inbox,
  Plus,
  MessageSquare,
  Play,
  Search,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[20vh]">
            <Command
              className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-border px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  placeholder="Suche nach Seiten, Aktionen, Agenten..."
                  className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  Keine Ergebnisse gefunden.
                </Command.Empty>

                <Command.Group
                  heading="Navigation"
                  className="mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  <CommandItem
                    icon={<LayoutDashboard className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/dashboard"))}
                  >
                    Dashboard
                  </CommandItem>
                  <CommandItem
                    icon={<Bot className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/agents"))}
                  >
                    Agent Teams
                  </CommandItem>
                  <CommandItem
                    icon={<Inbox className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/blackboard"))}
                  >
                    Blackboard
                  </CommandItem>
                  <CommandItem
                    icon={<Users className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/clients"))}
                  >
                    Clients
                  </CommandItem>
                  <CommandItem
                    icon={<FolderKanban className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/projects"))}
                  >
                    Projects
                  </CommandItem>
                  <CommandItem
                    icon={<Workflow className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/workflows"))}
                  >
                    Workflows
                  </CommandItem>
                  <CommandItem
                    icon={<BarChart3 className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/analytics"))}
                  >
                    Analytics
                  </CommandItem>
                  <CommandItem
                    icon={<Settings className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/settings"))}
                  >
                    Settings
                  </CommandItem>
                </Command.Group>

                <Command.Separator className="mx-2 my-1 h-px bg-border" />

                <Command.Group
                  heading="Aktionen"
                  className="mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  <CommandItem
                    icon={<Plus className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/agents/new"))}
                  >
                    Neuen Agent erstellen
                  </CommandItem>
                  <CommandItem
                    icon={<MessageSquare className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/agents"))}
                  >
                    Mit Agent chatten
                  </CommandItem>
                  <CommandItem
                    icon={<Plus className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/clients"))}
                  >
                    Neuen Client anlegen
                  </CommandItem>
                  <CommandItem
                    icon={<Play className="h-4 w-4" />}
                    onSelect={() => runCommand(() => router.push("/workflows"))}
                  >
                    Workflow starten
                  </CommandItem>
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

function CommandItem({
  children,
  icon,
  onSelect,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </Command.Item>
  );
}
