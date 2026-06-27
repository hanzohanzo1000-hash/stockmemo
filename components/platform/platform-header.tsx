import Link from "next/link";
import { ja } from "@/lib/i18n/ja";

export function PlatformHeader() {
  const t = ja.platform.header;

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/app" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/[0.04]">
            <span className="font-mono text-xs font-medium tracking-tight">
              SM
            </span>
          </div>
          <span className="text-sm font-medium tracking-tight">
            {ja.common.brand}
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            {t.home}
          </Link>
          <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/40">
            {t.login}
          </span>
        </nav>
      </div>
    </header>
  );
}
