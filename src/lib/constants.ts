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
