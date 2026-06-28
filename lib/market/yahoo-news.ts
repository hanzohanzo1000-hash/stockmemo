import type { StockNewsArticle } from "@/lib/finnhub/types";

type YahooSearchResponse = {
  news?: Array<{
    uuid?: string;
    title?: string;
    link?: string;
    publisher?: string;
    providerPublishTime?: number;
    summary?: string;
  }>;
};

export async function fetchStockNewsFromYahoo(
  symbol: string,
): Promise<StockNewsArticle[]> {
  const normalized = symbol.trim().toUpperCase();
  const url = new URL("https://query1.finance.yahoo.com/v1/finance/search");
  url.searchParams.set("q", normalized);
  url.searchParams.set("quotesCount", "0");
  url.searchParams.set("newsCount", "10");

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      "User-Agent": "StockMemo/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo news request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as YahooSearchResponse;

  return (data.news ?? [])
    .filter((item) => item.title && item.link)
    .map((item) => ({
      id: item.uuid ?? item.link!,
      title: item.title!,
      url: item.link!,
      source: item.publisher ?? "Yahoo Finance",
      publishedAt: item.providerPublishTime
        ? Math.floor(item.providerPublishTime / 1000)
        : 0,
      summary: item.summary ?? "",
    }));
}
