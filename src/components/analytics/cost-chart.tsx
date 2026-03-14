"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CostChartProps {
  data: { name: string; cost: number }[];
}

const COLORS = [
  "#34d399", "#60a5fa", "#a78bfa", "#f472b6",
  "#fbbf24", "#fb923c", "#f87171", "#2dd4bf",
];

export function CostChart({ data }: CostChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Keine Kostendaten vorhanden
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="cost"
          nameKey="name"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value) => [`€ ${Number(value).toFixed(2)}`, "Kosten"]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
          formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
