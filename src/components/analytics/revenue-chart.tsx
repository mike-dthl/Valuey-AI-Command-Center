"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { month: string; income: number; expense: number }[];
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mär", "04": "Apr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Okt", "11": "Nov", "12": "Dez",
};

function formatMonth(month: string) {
  const [, m] = month.split("-");
  return MONTH_LABELS[m] ?? m;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={{ stroke: "#3f3f46" }}
          tickLine={false}
          tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
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
            `€ ${Number(value).toLocaleString("de-DE")}`,
            name === "income" ? "Einnahmen" : "Ausgaben",
          ]}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#34d399"
          strokeWidth={2}
          fill="url(#incomeGrad)"
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#f87171"
          strokeWidth={2}
          fill="url(#expenseGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
