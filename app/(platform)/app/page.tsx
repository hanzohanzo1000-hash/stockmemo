import { StockLinkChip } from "@/components/platform/stock-link-chip";
import { StockSearch } from "@/components/platform/stock-search";
import { listStocks } from "@/lib/db/stocks";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { ja } from "@/lib/i18n/ja";

export default async function AppDashboardPage() {
  const t = ja.platform.dashboard;
  const configured = isSupabaseConfigured();
  const stocks = configured ? await listStocks().catch(() => []) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          {t.label}
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight text-white sm:text-4xl">
          {t.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/45">{t.subtitle}</p>
      </div>

      <StockSearch configured={configured} />

      <section className="mt-16">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          {t.popularLabel}
        </h2>

        {!configured ? (
          <p className="mt-4 text-center text-sm text-white/35">{t.dbPending}</p>
        ) : null}

        {configured && stocks.length === 0 ? (
          <p className="mt-4 text-center text-sm text-white/35">{t.dbEmpty}</p>
        ) : null}

        {stocks.length > 0 ? (
          <ul className="mt-4 flex flex-wrap justify-center gap-3">
            {stocks.map((stock) => (
              <li key={stock.id}>
                <StockLinkChip stock={stock} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
