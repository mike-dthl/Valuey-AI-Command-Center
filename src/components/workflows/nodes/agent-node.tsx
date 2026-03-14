import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Bot, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentNodeData } from "@/types/workflow";

const statusConfig = {
  idle: { border: "border-blue-500/50", icon: Bot, iconColor: "text-blue-400" },
  running: { border: "border-amber-500/50", icon: Loader2, iconColor: "text-amber-400" },
  done: { border: "border-emerald-500/50", icon: CheckCircle2, iconColor: "text-emerald-400" },
  error: { border: "border-red-500/50", icon: AlertCircle, iconColor: "text-red-400" },
} as const;

function AgentNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData;
  const status = nodeData.status ?? "idle";
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-background px-4 py-3 shadow-md transition-colors",
        config.border,
        selected && "ring-2 ring-primary/50",
        "min-w-[140px]"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-blue-400 !bg-background"
      />
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-blue-500/15 p-1.5">
          <StatusIcon
            className={cn(
              "h-4 w-4",
              config.iconColor,
              status === "running" && "animate-spin"
            )}
          />
        </div>
        <div>
          <p className="text-[10px] font-medium text-blue-400">AGENT</p>
          <p className="text-xs font-semibold">{nodeData.agentName ?? nodeData.label}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-blue-400 !bg-background"
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
