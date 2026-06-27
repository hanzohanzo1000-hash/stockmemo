import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { ja } from "@/lib/i18n/ja";

export default function Home() {
  const t = ja.marketing;

  return (
    <div className="relative min-h-full bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-120px] h-[720px] w-[1000px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute right-[-200px] top-1/3 h-[400px] w-[400px] rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/[0.04]">
              <span className="font-mono text-xs font-medium tracking-tight">
                SM
              </span>
            </div>
            <span className="text-sm font-medium tracking-tight">
              {ja.common.brand}
            </span>
          </div>
          <nav className="hidden items-center gap-8 sm:flex">
            <a
              href="#features"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              {t.nav.product}
            </a>
            <a
              href="#proof"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              {t.nav.customers}
            </a>
            <Link
              href="/app"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              {t.nav.research}
            </Link>
            <a
              href="#waitlist"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              {t.nav.waitlist}
            </a>
          </nav>
        </header>

        <main className="flex flex-1 flex-col">
          <section className="flex flex-col items-center pt-12 pb-20 text-center sm:pt-20 sm:pb-28">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl sm:leading-[1.02] lg:text-7xl">
              {t.hero.title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/55 sm:text-xl">
              {t.hero.subtitle}
            </p>

            <Link
              href="/app"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all hover:opacity-90 hover:shadow-[0_0_60px_rgba(255,255,255,0.18)]"
            >
              {t.hero.openApp}
            </Link>

            <div id="waitlist" className="mt-10 w-full max-w-md">
              <WaitlistForm source="hero" variant="hero" />
            </div>

            <div className="relative mt-20 w-full max-w-4xl">
              <div className="absolute inset-x-8 -bottom-6 h-24 rounded-full bg-white/[0.06] blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  </div>
                  <span className="ml-3 font-mono text-[11px] text-white/30">
                    {t.preview.windowTitle}
                  </span>
                </div>
                <div className="grid gap-px bg-white/10 sm:grid-cols-3">
                  <div className="bg-black p-6 text-left sm:col-span-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                      {t.preview.summaryLabel}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {t.preview.summaryText}
                    </p>
                  </div>
                  <div className="bg-black p-6 text-left">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                      {t.preview.metricsLabel}
                    </p>
                    <dl className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-white/40">{t.preview.revenue}</dt>
                        <dd className="font-mono text-emerald-400">
                          {t.preview.revenueValue}
                        </dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-white/40">{t.preview.eps}</dt>
                        <dd className="font-mono text-emerald-400">
                          {t.preview.epsValue}
                        </dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-white/40">{t.preview.guidance}</dt>
                        <dd className="font-mono text-white/70">
                          {t.preview.guidanceValue}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="proof" className="border-y border-white/10 py-14">
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
              {t.proof.label}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {t.proof.audiences.map((label) => (
                <span
                  key={label}
                  className="text-sm font-medium tracking-tight text-white/25 transition-colors hover:text-white/45"
                >
                  {label}
                </span>
              ))}
            </div>
          </section>

          <section className="py-24">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {t.valueProps.map((prop) => (
                <article
                  key={prop.label}
                  className="bg-black px-8 py-10 text-center sm:px-6 sm:py-12"
                >
                  <p className="font-mono text-2xl font-medium tracking-tight text-white sm:text-3xl">
                    {prop.stat}
                  </p>
                  <h2 className="mt-4 text-base font-medium tracking-tight text-white sm:text-lg">
                    {prop.label}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    {prop.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 py-24">
            <div className="mb-14 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                {t.testimonials.label}
              </p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {t.testimonials.title}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {t.testimonials.items.map((item) => (
                <blockquote
                  key={item.role}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-8"
                >
                  <p className="text-sm leading-7 text-white/60">
                    「{item.quote}」
                  </p>
                  <footer className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-sm font-medium text-white">
                      {item.role}
                    </p>
                    <p className="mt-1 text-xs text-white/35">{item.firm}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section id="features" className="border-t border-white/10 py-24">
            <div className="mb-16 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                {t.features.label}
              </p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {t.features.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/45">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {t.features.items.map((feature) => (
                <article
                  key={feature.title}
                  className="group bg-black p-8 transition-colors hover:bg-white/[0.02] sm:p-10"
                >
                  <div className="mb-6 h-px w-8 bg-white/20 transition-all group-hover:w-12 group-hover:bg-white/40" />
                  <h3 className="text-lg font-medium tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-white/10 py-24">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-16 text-center sm:px-16 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_65%)]"
              />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                  {t.cta.label}
                </p>
                <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  {t.cta.title}
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/45">
                  {t.cta.subtitle}
                </p>
                <WaitlistForm source="cta" variant="cta" />
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-10 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/[0.04]">
              <span className="font-mono text-[10px] font-medium">SM</span>
            </div>
            <span className="text-sm text-white/40">
              © {new Date().getFullYear()} {ja.common.brand}
            </span>
          </div>
          <p className="text-sm text-white/30">{t.footer.tagline}</p>
        </footer>
      </div>
    </div>
  );
}
