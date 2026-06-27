import { createAdminClient } from "@/lib/supabase/admin";
import type { Stock } from "@/lib/supabase/types";

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
  const normalized = query.trim().toUpperCase();

  if (!normalized) {
    return [];
  }

  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .or(`symbol.ilike.%${normalized}%,name.ilike.%${query.trim()}%`)
    .order("symbol", { ascending: true })
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}
