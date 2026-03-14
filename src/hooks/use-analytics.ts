"use client";

import { useState, useEffect, useCallback } from "react";

interface AgentUsage {
  tokens_input: number;
  tokens_output: number;
  cost: number;
  count: number;
}

interface UsageData {
  byAgent: Record<string, AgentUsage>;
  totals: { totalCost: number; totalTokensIn: number; totalTokensOut: number };
}

interface MonthlyRevenue {
  month: string;
  income: number;
  expense: number;
}

interface RevenueData {
  monthly: MonthlyRevenue[];
  totals: { totalIncome: number; totalExpense: number; profit: number };
}

export function useUsageAnalytics(days = 30) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics/usage?days=${days}`);
      if (!res.ok) throw new Error("Failed to fetch usage analytics");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

export function useRevenueAnalytics(months = 6) {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics/revenue?months=${months}`);
      if (!res.ok) throw new Error("Failed to fetch revenue analytics");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}
