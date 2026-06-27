import { createAdminClient } from "@/lib/supabase/admin";
import type { Stock } from "@/lib/supabase/types";
import { escapeIlikePattern } from "@/lib/db/escape-ilike";

export async function listStocks(): Promise<Stock[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .order("symbol", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function searchStocks(query: string): Promise<Stock[]> {
  const supabase = createAdminClient();
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const symbolPattern = escapeIlikePattern(trimmed.toUpperCase());
  const namePattern = escapeIlikePattern(trimmed);

  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .or(`symbol.ilike.%${symbolPattern}%,name.ilike.%${namePattern}%`)
    .order("symbol", { ascending: true })
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}
