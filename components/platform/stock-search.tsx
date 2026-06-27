"use client";

import Link from "next/link";
import { ja } from "@/lib/i18n/ja";
import type { Stock } from "@/lib/supabase/types";
import { useEffect, useState } from "react";

type SearchStatus = "idle" | "loading" | "success" | "error";

type StockSearchProps = {
  configured: boolean;
};

export function StockSearch({ configured }: StockSearchProps) {
  const t = ja.platform.dashboard;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<Stock[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!configured) {
      return;
    }

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setStatus("idle");
      setResults([]);
      setMessage("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch(
          `/api/stocks?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as {
          stocks?: Stock[];
          error?: string;
        };

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error ?? t.searchError);
          setResults([]);
          return;
        }

        const stocks = data.stocks ?? [];
        setStatus("success");
        setResults(stocks);
        setMessage(stocks.length === 0 ? t.noResults : "");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setStatus("error");
        setMessage(t.searchError);
        setResults([]);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [configured, query, t.noResults, t.searchError]);

  return (
    <div className="mt-10">
      <label htmlFor="stock-search" className="sr-only">
        {t.searchLabel}
      </label>
      <input
        id="stock-search"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.searchPlaceholder}
        disabled={!configured}
        autoComplete="off"
        className="h-12 w-full rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
      />

      {!configured ? (
        <p className="mt-3 text-center text-sm text-white/35">
          {t.dbNotConfigured}
        </p>
      ) : null}

      {configured && query.trim().length < 2 ? (
        <p className="mt-3 text-center text-xs text-white/30">{t.searchHint}</p>
      ) : null}

      {configured && status === "loading" ? (
        <p className="mt-3 text-center text-sm text-white/40">{t.searching}</p>
      ) : null}

      {configured && status === "error" ? (
        <p className="mt-3 text-center text-sm text-red-400">{message}</p>
      ) : null}

      {configured && status === "success" && message ? (
        <p className="mt-3 text-center text-sm text-white/40">{message}</p>
      ) : null}

      {configured && results.length > 0 ? (
        <div className="mt-6">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            {t.resultsLabel}
          </h2>
          <ul className="mt-4 space-y-2">
            {results.map((stock) => (
              <li key={stock.id}>
                <Link
                  href={`/app/stocks/${stock.symbol}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div>
                    <p className="font-mono text-sm text-white">{stock.symbol}</p>
                    <p className="mt-1 text-xs text-white/45">{stock.name}</p>
                  </div>
                  <span className="text-xs text-white/30">{stock.exchange}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
