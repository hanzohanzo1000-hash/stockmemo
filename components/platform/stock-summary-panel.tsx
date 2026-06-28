"use client";

import type { StockSummaryResponse } from "@/lib/ai/types";
import { ja } from "@/lib/i18n/ja";
import { useEffect, useState } from "react";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type StockSummaryPanelProps = {
  symbol: string;
};

function formatGeneratedAt(isoDate: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function StockSummaryPanel({ symbol }: StockSummaryPanelProps) {
  const t = ja.platform.stock;
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<StockSummaryResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch(`/api/stocks/${symbol}/summary`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          summary?: StockSummaryResponse;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? t.summaryError);
        }

        setSummary(data.summary ?? null);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSummary(null);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : t.summaryError);
      }
    }

    void loadSummary();

    return () => controller.abort();
  }, [symbol, t.summaryError]);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          {t.summaryLabel}
        </p>
        {summary?.cached ? (
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/30">
            {t.summaryCached}
          </span>
        ) : null}
      </div>

      {status === "loading" ? (
        <p className="mt-4 text-sm text-white/40">{t.summaryLoading}</p>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 text-sm text-red-400">{message}</p>
      ) : null}

      {status === "ready" && summary ? (
        <div className="mt-4 space-y-6">
          <p className="text-sm leading-7 text-white/80">{summary.summary}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">
                {t.bullLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75">{summary.bullCase}</p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red-300/70">
                {t.bearLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75">{summary.bearCase}</p>
            </div>
          </div>

          {summary.keyRisks.length > 0 ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                {t.keyRisksLabel}
              </p>
              <ul className="mt-3 space-y-2">
                {summary.keyRisks.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-7 text-white/70"
                  >
                    <span className="text-white/30">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {summary.whatToWatch.length > 0 ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                {t.whatToWatchLabel}
              </p>
              <ul className="mt-3 space-y-2">
                {summary.whatToWatch.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-7 text-white/70"
                  >
                    <span className="text-white/30">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-white/30">
              {t.generatedAtLabel}: {formatGeneratedAt(summary.generatedAt)}
            </p>
            <p className="mt-2 text-xs leading-6 text-white/30">{t.summaryDisclaimer}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
