import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap, Play, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TriggerNodeData } from "@/types/workflow";

const triggerIcons = {
  manual: Play,
  scheduled: Clock,
  event: Zap,
} as const;

const triggerLabels = {
  manual: "Manuell",
  scheduled: "Geplant",
  event: "Event",
} as const;

function TriggerNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as TriggerNodeData;
  const Icon = triggerIcons[nodeData.triggerType] ?? Zap;
  const label = triggerLabels[nodeData.triggerType] ?? "Trigger";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border-2 border-emerald-500/50 bg-background px-4 py-3 shadow-md",
        "min-w-[120px]"
      )}
    >
      <div className="rounded-md bg-emerald-500/15 p-1.5">
        <Icon className="h-4 w-4 text-emerald-400" />
      </div>
      <div>
        <p className="text-[10px] font-medium text-emerald-400">TRIGGER</p>
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-emerald-400 !bg-background"
      />
    </div>
  );
}

export const TriggerNode = memo(TriggerNodeComponent);
