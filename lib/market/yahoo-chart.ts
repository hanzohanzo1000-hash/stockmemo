import type { ChartRange, StockChart } from "@/lib/finnhub/types";
import { chartRanges } from "@/lib/finnhub/ranges";

const yahooRangeMap: Record<ChartRange, string> = {
  "1W": "5d",
  "1M": "1mo",
  "3M": "3mo",
  "6M": "6mo",
  "1Y": "1y",
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
    error?: {
      description?: string;
    };
  };
};

export async function fetchStockChartFromYahoo(
  symbol: string,
  range: ChartRange,
): Promise<StockChart> {
  const normalized = symbol.trim().toUpperCase();
  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${normalized}`,
  );
  url.searchParams.set("range", yahooRangeMap[range]);
  url.searchParams.set("interval", "1d");

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      "User-Agent": "StockMemo/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo chart request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as YahooChartResponse;
  const result = data.chart?.result?.[0];

  if (!result) {
    throw new Error(data.chart?.error?.description ?? "Chart data is unavailable.");
  }

  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];

  const points = timestamps
    .map((timestamp, index) => ({
      timestamp,
      close: closes[index] ?? null,
    }))
    .filter(
      (point): point is { timestamp: number; close: number } =>
        point.close !== null && Number.isFinite(point.close),
    );

  if (points.length === 0) {
    throw new Error("Chart data is unavailable.");
  }

  return {
    symbol: normalized,
    range,
    points,
  };
}

export { chartRanges };
