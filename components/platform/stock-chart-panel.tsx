"use client";

import type { ChartPoint, ChartRange, StockChart, StockQuote } from "@/lib/finnhub/types";
import { chartRanges } from "@/lib/finnhub/ranges";
import { ja } from "@/lib/i18n/ja";
import { useEffect, useMemo, useState } from "react";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type StockChartPanelProps = {
  symbol: string;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

function buildLinePath(points: ChartPoint[], width: number, height: number): string {
  if (points.length === 0) {
    return "";
  }

  const closes = points.map((point) => point.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const spread = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point.close - min) / spread) * (height - 16) - 8;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function StockChartPanel({ symbol }: StockChartPanelProps) {
  const t = ja.platform.stock;
  const [range, setRange] = useState<ChartRange>("1M");
  const [quoteStatus, setQuoteStatus] = useState<LoadStatus>("loading");
  const [chartStatus, setChartStatus] = useState<LoadStatus>("loading");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [chartMessage, setChartMessage] = useState("");
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [chart, setChart] = useState<StockChart | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuote() {
      setQuoteStatus("loading");
      setQuoteMessage("");

      try {
        const response = await fetch(`/api/stocks/${symbol}/quote`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          quote?: StockQuote;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? t.quoteError);
        }

        setQuote(data.quote ?? null);
        setQuoteStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setQuote(null);
        setQuoteStatus("error");
        setQuoteMessage(error instanceof Error ? error.message : t.quoteError);
      }
    }

    void loadQuote();

    return () => controller.abort();
  }, [symbol, t.quoteError]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadChart() {
      setChartStatus("loading");
      setChartMessage("");

      try {
        const response = await fetch(`/api/stocks/${symbol}/chart?range=${range}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          chart?: StockChart;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? t.chartError);
        }

        setChart(data.chart ?? null);
        setChartStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setChart(null);
        setChartStatus("error");
        setChartMessage(error instanceof Error ? error.message : t.chartError);
      }
    }

    void loadChart();

    return () => controller.abort();
  }, [range, symbol, t.chartError]);

  const linePath = useMemo(() => {
    if (!chart?.points.length) {
      return "";
    }

    return buildLinePath(chart.points, 640, 220);
  }, [chart]);

  const isPositive = quote
    ? quote.change >= 0
    : (chart?.points.at(-1)?.close ?? 0) >= (chart?.points[0]?.close ?? 0);

  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        {quoteStatus === "loading" ? (
          <p className="text-sm text-white/40">{t.loading}</p>
        ) : null}

        {quoteStatus === "error" ? (
          <p className="text-sm text-red-400">{quoteMessage}</p>
        ) : null}

        {quoteStatus === "ready" && quote ? (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
              {t.priceLabel}
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-4xl font-medium tracking-tight text-white">
                {formatPrice(quote.price)}
              </p>
              <p
                className={`font-mono text-sm ${
                  quote.change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatPrice(quote.change)} ({formatPercent(quote.changePercent)})
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            {t.chartLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {chartRanges.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                disabled={chartStatus === "loading"}
                className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors disabled:opacity-50 ${
                  range === item
                    ? "bg-white text-black"
                    : "border border-white/10 text-white/50 hover:border-white/25 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {chartStatus === "loading" ? (
          <p className="mt-6 text-sm text-white/40">{t.loading}</p>
        ) : null}

        {chartStatus === "error" ? (
          <p className="mt-6 text-sm text-red-400">{chartMessage}</p>
        ) : null}

        {chartStatus === "ready" && chart?.points.length ? (
          <div className="mt-6 overflow-hidden">
            <svg
              viewBox="0 0 640 220"
              className="h-[220px] w-full"
              role="img"
              aria-label={t.chartLabel}
            >
              <path
                d={linePath}
                fill="none"
                stroke={isPositive ? "#34d399" : "#f87171"}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : null}

        {chartStatus === "ready" && !chart?.points.length ? (
          <p className="mt-6 text-sm text-white/40">{t.chartEmpty}</p>
        ) : null}
      </div>
    </section>
  );
}
