import { fetchStockChartFromYahoo } from "@/lib/market/yahoo-chart";
import { fetchStockNewsFromYahoo } from "@/lib/market/yahoo-news";
import { getRangeWindow, isChartRange } from "@/lib/finnhub/ranges";
import type {
  ChartRange,
  FinnhubCandleResponse,
  FinnhubNewsItem,
  FinnhubQuote,
  StockChart,
  StockNewsArticle,
  StockQuote,
} from "@/lib/finnhub/types";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

export function isFinnhubConfigured(): boolean {
  return Boolean(process.env.FINNHUB_API_KEY);
}

function getFinnhubApiKey(): string {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new Error("FINNHUB_API_KEY is not configured.");
  }

  return apiKey;
}

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function assertValidSymbol(symbol: string): string {
  const normalized = normalizeSymbol(symbol);

  if (!/^[A-Z][A-Z0-9.-]{0,14}$/.test(normalized)) {
    throw new Error("Invalid stock symbol.");
  }

  return normalized;
}

async function finnhubFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${FINNHUB_BASE_URL}${path}`);
  url.searchParams.set("token", getFinnhubApiKey());

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Finnhub request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

async function fetchStockChartFromFinnhub(
  symbol: string,
  range: ChartRange,
): Promise<StockChart> {
  const normalized = assertValidSymbol(symbol);
  const { from, to } = getRangeWindow(range);

  const candles = await finnhubFetch<FinnhubCandleResponse>("/stock/candle", {
    symbol: normalized,
    resolution: "D",
    from: String(from),
    to: String(to),
  });

  if (candles.s !== "ok" || !candles.c?.length) {
    throw new Error(`Finnhub candle status: ${candles.s ?? "unknown"}.`);
  }

  const points = candles.t.map((timestamp, index) => ({
    timestamp,
    close: candles.c[index],
  }));

  return {
    symbol: normalized,
    range,
    points,
  };
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  const normalized = assertValidSymbol(symbol);
  const quote = await finnhubFetch<FinnhubQuote>("/quote", { symbol: normalized });

  if (quote.c == null || quote.c === 0) {
    throw new Error("Quote data is unavailable.");
  }

  return {
    symbol: normalized,
    price: quote.c,
    change: quote.d,
    changePercent: quote.dp,
    high: quote.h,
    low: quote.l,
    open: quote.o,
    previousClose: quote.pc,
    updatedAt: quote.t,
  };
}

export async function fetchStockChart(
  symbol: string,
  range: ChartRange,
): Promise<StockChart> {
  const normalized = assertValidSymbol(symbol);

  try {
    return await fetchStockChartFromFinnhub(normalized, range);
  } catch (finnhubError) {
    console.warn("Finnhub chart unavailable, falling back to Yahoo:", finnhubError);

    try {
      return await fetchStockChartFromYahoo(normalized, range);
    } catch (yahooError) {
      console.error("Yahoo chart fallback failed:", yahooError);
      throw yahooError;
    }
  }
}

export function parseChartRangeParam(value: string | null): ChartRange {
  if (isChartRange(value)) {
    return value;
  }

  return "1M";
}

function getNewsDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

async function fetchStockNewsFromFinnhub(
  symbol: string,
): Promise<StockNewsArticle[]> {
  const normalized = assertValidSymbol(symbol);
  const { from, to } = getNewsDateRange();

  const items = await finnhubFetch<FinnhubNewsItem[]>("/company-news", {
    symbol: normalized,
    from,
    to,
  });

  return (items ?? []).slice(0, 10).map((item) => ({
    id: String(item.id),
    title: item.headline,
    url: item.url,
    source: item.source,
    publishedAt: item.datetime,
    summary: item.summary,
  }));
}

export async function fetchStockNews(symbol: string): Promise<StockNewsArticle[]> {
  const normalized = assertValidSymbol(symbol);

  try {
    const articles = await fetchStockNewsFromFinnhub(normalized);

    if (articles.length > 0) {
      return articles;
    }

    throw new Error("Finnhub returned no news articles.");
  } catch (finnhubError) {
    console.warn("Finnhub news unavailable, falling back to Yahoo:", finnhubError);

    try {
      return await fetchStockNewsFromYahoo(normalized);
    } catch (yahooError) {
      console.error("Yahoo news fallback failed:", yahooError);
      throw yahooError;
    }
  }
}
