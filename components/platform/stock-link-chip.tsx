import Link from "next/link";
import type { Stock } from "@/lib/supabase/types";

type StockLinkChipProps = {
  stock: Pick<Stock, "symbol" | "name">;
};

export function StockLinkChip({ stock }: StockLinkChipProps) {
  return (
    <Link
      href={`/app/stocks/${stock.symbol}`}
      className="inline-flex flex-col items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
    >
      <span className="font-mono text-sm text-white/80">{stock.symbol}</span>
      <span className="mt-0.5 max-w-[140px] truncate text-[10px] text-white/35">
        {stock.name}
      </span>
    </Link>
  );
}
