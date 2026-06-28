import {
  fetchStockChart,
  isFinnhubConfigured,
  parseChartRangeParam,
} from "@/lib/finnhub/client";
import { ja } from "@/lib/i18n/ja";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ symbol: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  if (!isFinnhubConfigured()) {
    return NextResponse.json(
      { error: ja.api.finnhub.notConfigured },
      { status: 503 },
    );
  }

  try {
    const { symbol } = await context.params;
    const { searchParams } = new URL(request.url);
    const range = parseChartRangeParam(searchParams.get("range"));
    const chart = await fetchStockChart(symbol, range);

    return NextResponse.json({ chart });
  } catch (error) {
    console.error("Failed to fetch stock chart:", error);
    return NextResponse.json(
      { error: ja.api.finnhub.chartFailed },
      { status: 500 },
    );
  }
}
