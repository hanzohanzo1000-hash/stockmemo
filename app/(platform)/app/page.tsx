import { listStocks } from "@/lib/db/stocks";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { ja } from "@/lib/i18n/ja";

const fallbackSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"];

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

      <form className="mt-10" action="#" aria-label={t.searchLabel}>
        <label htmlFor="stock-search" className="sr-only">
          {t.searchLabel}
        </label>
        <input
          id="stock-search"
          type="search"
          name="q"
          placeholder={t.searchPlaceholder}
          disabled
          className="h-12 w-full rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm text-white placeholder:text-white/30 outline-none"
        />
        <p className="mt-3 text-center text-xs text-white/30">{t.searchHint}</p>
      </form>

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

        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {(stocks.length > 0
            ? stocks.map((stock) => ({
                key: stock.id,
                label: stock.symbol,
                sublabel: stock.name,
              }))
            : fallbackSymbols.map((symbol) => ({
                key: symbol,
                label: symbol,
                sublabel: null,
              }))
          ).map((item) => (
            <li key={item.key}>
              <span className="inline-flex flex-col items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <span className="font-mono text-sm text-white/80">
                  {item.label}
                </span>
                {item.sublabel ? (
                  <span className="mt-0.5 max-w-[120px] truncate text-[10px] text-white/35">
                    {item.sublabel}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
