export const APP_NAME = "Valuey AI Command Center";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Agent Teams", href: "/agents", icon: "Bot" },
  { label: "Blackboard", href: "/blackboard", icon: "Inbox" },
  { label: "Clients", href: "/clients", icon: "Users" },
  { label: "Projects", href: "/projects", icon: "FolderKanban" },
  { label: "Workflows", href: "/workflows", icon: "Workflow" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
] as const;

export const NAV_BOTTOM_ITEMS = [
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const AGENT_STATUSES = {
  idle: { label: "Idle", color: "text-emerald-400", bg: "bg-emerald-400" },
  busy: { label: "Busy", color: "text-amber-400", bg: "bg-amber-400" },
  error: { label: "Error", color: "text-red-400", bg: "bg-red-400" },
  offline: { label: "Offline", color: "text-zinc-500", bg: "bg-zinc-500" },
} as const;

export const EVENT_PRIORITIES = {
  urgent: { label: "Urgent", color: "text-red-400", bg: "bg-red-500/15" },
  high: { label: "High", color: "text-amber-400", bg: "bg-amber-500/15" },
  normal: { label: "Normal", color: "text-blue-400", bg: "bg-blue-500/15" },
  low: { label: "Low", color: "text-zinc-400", bg: "bg-zinc-500/15" },
} as const;

export const CLIENT_STATUSES = {
  active: { label: "Aktiv", color: "text-emerald-400", bg: "bg-emerald-400", dot: "bg-emerald-400" },
  inactive: { label: "Inaktiv", color: "text-zinc-400", bg: "bg-zinc-500", dot: "bg-zinc-500" },
  lead: { label: "Lead", color: "text-blue-400", bg: "bg-blue-400", dot: "bg-blue-400" },
} as const;

export const PROJECT_STATUSES = {
  planning: { label: "Planung", color: "text-blue-400", bg: "bg-blue-500/15" },
  active: { label: "Aktiv", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  paused: { label: "Pausiert", color: "text-amber-400", bg: "bg-amber-500/15" },
  completed: { label: "Abgeschlossen", color: "text-purple-400", bg: "bg-purple-500/15" },
  archived: { label: "Archiviert", color: "text-zinc-400", bg: "bg-zinc-500/15" },
} as const;

export const TASK_PRIORITIES = {
  urgent: { label: "Dringend", color: "text-red-400", bg: "bg-red-500/15", border: "border-l-red-400" },
  high: { label: "Hoch", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-l-amber-400" },
  medium: { label: "Mittel", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-l-blue-400" },
  low: { label: "Niedrig", color: "text-zinc-400", bg: "bg-zinc-500/15", border: "border-l-zinc-400" },
} as const;

export const KANBAN_COLUMNS = [
  { id: "todo" as const, title: "To Do", color: "text-blue-400" },
  { id: "in_progress" as const, title: "In Arbeit", color: "text-amber-400" },
  { id: "review" as const, title: "Review", color: "text-purple-400" },
  { id: "done" as const, title: "Erledigt", color: "text-emerald-400" },
] as const;

export const WORKFLOW_TRIGGER_TYPES = {
  manual: { label: "Manuell", color: "text-blue-400", bg: "bg-blue-500/15", icon: "Play" },
  scheduled: { label: "Geplant", color: "text-amber-400", bg: "bg-amber-500/15", icon: "Clock" },
  event: { label: "Event", color: "text-purple-400", bg: "bg-purple-500/15", icon: "Zap" },
} as const;

export const WORKFLOW_RUN_STATUSES = {
  running: { label: "Läuft", color: "text-amber-400", bg: "bg-amber-500/15" },
  completed: { label: "Abgeschlossen", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  failed: { label: "Fehlgeschlagen", color: "text-red-400", bg: "bg-red-500/15" },
} as const;
