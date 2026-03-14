import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function OutputNodeComponent({ selected }: NodeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border-2 border-emerald-500/50 bg-background px-4 py-3 shadow-md",
        selected && "ring-2 ring-primary/50",
        "min-w-[100px]"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-emerald-400 !bg-background"
      />
      <div className="rounded-md bg-emerald-500/15 p-1.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      </div>
      <div>
        <p className="text-[10px] font-medium text-emerald-400">OUTPUT</p>
        <p className="text-xs font-semibold">Fertig</p>
      </div>
    </div>
  );
}

export const OutputNode = memo(OutputNodeComponent);
