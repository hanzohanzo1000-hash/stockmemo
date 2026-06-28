import { createHash } from "crypto";
import type { SummaryContext } from "@/lib/ai/types";

export function buildSnapshotHash(context: SummaryContext): string {
  const payload = JSON.stringify({
    symbol: context.symbol,
    price: context.price.toFixed(2),
    changePercent: context.changePercent.toFixed(2),
    news: context.news.slice(0, 5).map((item) => item.title),
  });

  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
