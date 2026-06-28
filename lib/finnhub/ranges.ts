import type { ChartRange } from "@/lib/finnhub/types";

export const chartRanges: ChartRange[] = ["1W", "1M", "3M", "6M", "1Y"];

const rangeDays: Record<ChartRange, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
};

export function isChartRange(value: string | null): value is ChartRange {
  return value !== null && chartRanges.includes(value as ChartRange);
}

export function getRangeWindow(range: ChartRange): { from: number; to: number } {
  const to = Math.floor(Date.now() / 1000);
  const from = to - rangeDays[range] * 24 * 60 * 60;

  return { from, to };
}
