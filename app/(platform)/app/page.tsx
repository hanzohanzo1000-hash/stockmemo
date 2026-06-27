import { ja } from "@/lib/i18n/ja";

const popularSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"];

export default function AppDashboardPage() {
  const t = ja.platform.dashboard;

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
        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {popularSymbols.map((symbol) => (
            <li key={symbol}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-white/60">
                {symbol}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
