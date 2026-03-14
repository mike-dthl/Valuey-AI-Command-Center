"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Cpu, CheckCircle2, TrendingUp } from "lucide-react";
import { useUsageAnalytics, useRevenueAnalytics } from "@/hooks/use-analytics";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { UsageChart } from "@/components/analytics/usage-chart";
import { CostChart } from "@/components/analytics/cost-chart";

export default function AnalyticsPage() {
  const { data: usage, loading: usageLoading } = useUsageAnalytics(30);
  const { data: revenue, loading: revenueLoading } = useRevenueAnalytics(6);

  const loading = usageLoading || revenueLoading;

  // Current month totals
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthRevenue = revenue?.monthly.find((m) => m.month === currentMonth);
  const monthIncome = currentMonthRevenue?.income ?? 0;
  const monthExpense = currentMonthRevenue?.expense ?? 0;
  const apiCosts = usage?.totals.totalCost ?? 0;
  const profitMargin = monthIncome > 0
    ? ((monthIncome - monthExpense - apiCosts) / monthIncome * 100)
    : 0;

  // Transform usage data for charts
  const usageByAgent = usage
    ? Object.entries(usage.byAgent).map(([agentName, data]) => ({
        agentName,
        tokens_input: data.tokens_input,
        tokens_output: data.tokens_output,
      }))
    : [];

  const costByAgent = usage
    ? Object.entries(usage.byAgent)
        .map(([name, data]) => ({ name, cost: data.cost }))
        .sort((a, b) => b.cost - a.cost)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Deine KPIs und Metriken auf einen Blick</p>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Umsatz (Monat)</p>
                {loading ? (
                  <Skeleton className="mt-1 h-7 w-24" />
                ) : (
                  <p className="text-xl font-bold">
                    &euro;{monthIncome.toLocaleString("de-DE")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <Cpu className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">API Kosten (30 Tage)</p>
                {loading ? (
                  <Skeleton className="mt-1 h-7 w-24" />
                ) : (
                  <p className="text-xl font-bold">
                    &euro;{apiCosts.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gesamtumsatz</p>
                {loading ? (
                  <Skeleton className="mt-1 h-7 w-24" />
                ) : (
                  <p className="text-xl font-bold">
                    &euro;{(revenue?.totals.totalIncome ?? 0).toLocaleString("de-DE")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit-Marge</p>
                {loading ? (
                  <Skeleton className="mt-1 h-7 w-24" />
                ) : (
                  <p className="text-xl font-bold">{profitMargin.toFixed(1)}%</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Umsatz &uuml;ber Zeit</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px]" />
            ) : (
              <RevenueChart data={revenue?.monthly ?? []} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Token Usage pro Agent</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px]" />
            ) : (
              <UsageChart data={usageByAgent} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Kosten-Verteilung pro Agent</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[280px]" />
            ) : (
              <CostChart data={costByAgent} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">&Uuml;bersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gesamt-Einnahmen</span>
                <span className="font-semibold text-emerald-400">
                  &euro;{(revenue?.totals.totalIncome ?? 0).toLocaleString("de-DE")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gesamt-Ausgaben</span>
                <span className="font-semibold text-red-400">
                  &euro;{(revenue?.totals.totalExpense ?? 0).toLocaleString("de-DE")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Kosten (30d)</span>
                <span className="font-semibold text-red-400">
                  &euro;{apiCosts.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profit</span>
                  <span className="text-lg font-bold text-emerald-400">
                    &euro;{(revenue?.totals.profit ?? 0).toLocaleString("de-DE")}
                  </span>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-muted-foreground">Token-Nutzung (30 Tage)</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Input</p>
                    <p className="text-sm font-medium">
                      {(usage?.totals.totalTokensIn ?? 0).toLocaleString("de-DE")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Output</p>
                    <p className="text-sm font-medium">
                      {(usage?.totals.totalTokensOut ?? 0).toLocaleString("de-DE")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
