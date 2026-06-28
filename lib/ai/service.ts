import { generateStockSummary } from "@/lib/ai/generate-summary";
import { buildSnapshotHash } from "@/lib/ai/snapshot";
import type { StockSummaryResponse, SummaryContext } from "@/lib/ai/types";
import {
  getSummaryBySnapshotHash,
  mapSummaryRow,
  saveSummary,
} from "@/lib/db/summaries";
import { fetchStockNews, fetchStockQuote } from "@/lib/finnhub/client";
import type { Stock } from "@/lib/supabase/types";

async function buildSummaryContext(stock: Stock): Promise<SummaryContext> {
  const [quote, news] = await Promise.all([
    fetchStockQuote(stock.symbol),
    fetchStockNews(stock.symbol),
  ]);

  return {
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    sector: stock.sector,
    industry: stock.industry,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    news: news.slice(0, 8).map((article) => ({
      title: article.title,
      source: article.source,
      summary: article.summary,
    })),
  };
}

export async function getOrCreateStockSummary(stock: Stock): Promise<StockSummaryResponse> {
  const context = await buildSummaryContext(stock);
  const snapshotHash = buildSnapshotHash(context);

  const cached = await getSummaryBySnapshotHash(stock.id, snapshotHash);

  if (cached) {
    return {
      ...mapSummaryRow(cached),
      cached: true,
    };
  }

  const generated = await generateStockSummary(context);

  try {
    const saved = await saveSummary({
      stockId: stock.id,
      snapshotHash,
      summary: generated.summary,
      bullCase: generated.bullCase,
      bearCase: generated.bearCase,
      keyRisks: generated.keyRisks,
      whatToWatch: generated.whatToWatch,
      model: generated.model,
    });

    return {
      ...mapSummaryRow(saved),
      cached: false,
    };
  } catch (error) {
    const retry = await getSummaryBySnapshotHash(stock.id, snapshotHash);

    if (retry) {
      return {
        ...mapSummaryRow(retry),
        cached: true,
      };
    }

    throw error;
  }
}
