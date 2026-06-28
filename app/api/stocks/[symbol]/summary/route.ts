import { getOrCreateStockSummary } from "@/lib/ai/service";
import { isOpenAiConfigured } from "@/lib/ai/generate-summary";
import { getStockBySymbol } from "@/lib/db/stocks";
import { isFinnhubConfigured } from "@/lib/finnhub/client";
import { ja } from "@/lib/i18n/ja";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ symbol: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: ja.api.stocks.notConfigured },
      { status: 503 },
    );
  }

  if (!isFinnhubConfigured()) {
    return NextResponse.json(
      { error: ja.api.finnhub.notConfigured },
      { status: 503 },
    );
  }

  if (!isOpenAiConfigured()) {
    return NextResponse.json(
      { error: ja.api.ai.notConfigured },
      { status: 503 },
    );
  }

  try {
    const { symbol } = await context.params;
    const stock = await getStockBySymbol(symbol);

    if (!stock) {
      return NextResponse.json(
        { error: ja.platform.stock.notFound },
        { status: 404 },
      );
    }

    const summary = await getOrCreateStockSummary(stock);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Failed to generate stock summary:", error);
    return NextResponse.json(
      { error: ja.api.ai.summaryFailed },
      { status: 500 },
    );
  }
}
