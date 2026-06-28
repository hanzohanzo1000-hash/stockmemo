"use client";

import type { StockNewsArticle } from "@/lib/finnhub/types";
import { ja } from "@/lib/i18n/ja";
import { useEffect, useState } from "react";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type StockNewsPanelProps = {
  symbol: string;
};

function formatPublishedAt(timestamp: number): string {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

export function StockNewsPanel({ symbol }: StockNewsPanelProps) {
  const t = ja.platform.stock;
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState<StockNewsArticle[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch(`/api/stocks/${symbol}/news`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          articles?: StockNewsArticle[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? t.newsError);
        }

        setArticles(data.articles ?? []);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setArticles([]);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : t.newsError);
      }
    }

    void loadNews();

    return () => controller.abort();
  }, [symbol, t.newsError]);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        {t.newsLabel}
      </p>

      {status === "loading" ? (
        <p className="mt-4 text-sm text-white/40">{t.newsLoading}</p>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 text-sm text-red-400">{message}</p>
      ) : null}

      {status === "ready" && articles.length === 0 ? (
        <p className="mt-4 text-sm text-white/40">{t.newsEmpty}</p>
      ) : null}

      {status === "ready" && articles.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {articles.map((article) => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm leading-6 text-white">{article.title}</p>
                  <span className="shrink-0 text-xs text-white/30">
                    {formatPublishedAt(article.publishedAt)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/35">{article.source}</p>
                {article.summary ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                    {article.summary}
                  </p>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
