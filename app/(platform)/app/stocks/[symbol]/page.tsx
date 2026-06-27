import { getStockBySymbol } from "@/lib/db/stocks";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { ja } from "@/lib/i18n/ja";
import Link from "next/link";
import { notFound } from "next/navigation";

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const t = ja.platform.stock;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const stock = await getStockBySymbol(symbol);

  if (!stock) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/app"
        className="text-sm text-white/45 transition-colors hover:text-white"
      >
        ← 銘柄検索に戻る
      </Link>

      <div className="mt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          {stock.exchange}
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-white">
          {stock.symbol}
        </h1>
        <p className="mt-2 text-lg text-white/55">{stock.name}</p>
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm leading-7 text-white/45">{t.comingSoon}</p>
      </div>
    </div>
  );
}
