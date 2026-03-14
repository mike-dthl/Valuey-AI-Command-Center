import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const days = parseInt(request.nextUrl.searchParams.get("days") ?? "30", 10);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: logs, error } = await supabase
    .from("usage_logs")
    .select("*, agent:agents(name, role)")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate by agent
  const byAgent: Record<string, { tokens_input: number; tokens_output: number; cost: number; count: number }> = {};
  let totalCost = 0;
  let totalTokensIn = 0;
  let totalTokensOut = 0;

  for (const log of logs ?? []) {
    const agentName = (log.agent as { name: string } | null)?.name ?? "Unbekannt";
    if (!byAgent[agentName]) {
      byAgent[agentName] = { tokens_input: 0, tokens_output: 0, cost: 0, count: 0 };
    }
    byAgent[agentName].tokens_input += log.tokens_input;
    byAgent[agentName].tokens_output += log.tokens_output;
    byAgent[agentName].cost += log.cost;
    byAgent[agentName].count += 1;
    totalCost += log.cost;
    totalTokensIn += log.tokens_input;
    totalTokensOut += log.tokens_output;
  }

  return NextResponse.json({
    logs,
    byAgent,
    totals: { totalCost, totalTokensIn, totalTokensOut },
  });
}
