import { Badge } from "@/components/ui/badge";
import type { AgentStatus } from "@/types/database";

const statusConfig: Record<AgentStatus, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  idle: { label: "Idle", variant: "success" },
  busy: { label: "Busy", variant: "warning" },
  error: { label: "Error", variant: "destructive" },
  offline: { label: "Offline", variant: "secondary" },
};

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className="text-[10px]">
      {config.label}
    </Badge>
  );
}
