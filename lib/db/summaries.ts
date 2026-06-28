import { createAdminClient } from "@/lib/supabase/admin";
import type { AiStockSummary } from "@/lib/supabase/types";

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function mapSummaryRow(row: AiStockSummary) {
  return {
    summary: row.summary,
    bullCase: row.bull_case,
    bearCase: row.bear_case,
    keyRisks: parseStringArray(row.key_risks),
    whatToWatch: parseStringArray(row.what_to_watch),
    generatedAt: row.generated_at,
    model: row.model,
  };
}

export async function getSummaryBySnapshotHash(
  stockId: string,
  snapshotHash: string,
): Promise<AiStockSummary | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("ai_stock_summaries")
    .select("*")
    .eq("stock_id", stockId)
    .eq("source_snapshot_hash", snapshotHash)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

type SaveSummaryInput = {
  stockId: string;
  snapshotHash: string;
  summary: string;
  bullCase: string;
  bearCase: string;
  keyRisks: string[];
  whatToWatch: string[];
  model: string;
};

export async function saveSummary(input: SaveSummaryInput): Promise<AiStockSummary> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("ai_stock_summaries")
    .insert({
      stock_id: input.stockId,
      source_snapshot_hash: input.snapshotHash,
      summary: input.summary,
      bull_case: input.bullCase,
      bear_case: input.bearCase,
      key_risks: input.keyRisks,
      what_to_watch: input.whatToWatch,
      model: input.model,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
