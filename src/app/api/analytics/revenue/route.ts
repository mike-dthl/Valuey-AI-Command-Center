import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const months = parseInt(request.nextUrl.searchParams.get("months") ?? "6", 10);
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const { data: entries, error } = await supabase
    .from("revenue_entries")
    .select("*")
    .gte("date", since.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate by month
  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  for (const entry of entries ?? []) {
    const month = entry.date.substring(0, 7); // "2026-01"
    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }
    if (entry.type === "income") {
      monthlyMap[month].income += entry.amount;
      totalIncome += entry.amount;
    } else {
      monthlyMap[month].expense += entry.amount;
      totalExpense += entry.amount;
    }
  }

  const monthly = Object.entries(monthlyMap)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return NextResponse.json({
    entries,
    monthly,
    totals: { totalIncome, totalExpense, profit: totalIncome - totalExpense },
  });
}
