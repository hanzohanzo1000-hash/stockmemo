import {
  fetchStockQuote,
  isFinnhubConfigured,
} from "@/lib/finnhub/client";
import { ja } from "@/lib/i18n/ja";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ symbol: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isFinnhubConfigured()) {
    return NextResponse.json(
      { error: ja.api.finnhub.notConfigured },
      { status: 503 },
    );
  }

  try {
    const { symbol } = await context.params;
    const quote = await fetchStockQuote(symbol);

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Failed to fetch stock quote:", error);
    return NextResponse.json(
      { error: ja.api.finnhub.quoteFailed },
      { status: 500 },
    );
  }
}
