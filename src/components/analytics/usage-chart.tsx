"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UsageChartProps {
  data: { agentName: string; tokens_input: number; tokens_output: number }[];
}

export function UsageChart({ data }: UsageChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Keine Nutzungsdaten vorhanden
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="agentName"
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#a1a1aa" }}
          formatter={(value, name) => [
            Number(value).toLocaleString("de-DE"),
            name === "tokens_input" ? "Input Tokens" : "Output Tokens",
          ]}
        />
        <Bar dataKey="tokens_input" stackId="tokens" fill="#60a5fa" radius={[0, 0, 0, 0]} />
        <Bar dataKey="tokens_output" stackId="tokens" fill="#a78bfa" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
