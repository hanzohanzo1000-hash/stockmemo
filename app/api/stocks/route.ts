import { listStocks, searchStocks } from "@/lib/db/stocks";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    const stocks = query ? await searchStocks(query) : await listStocks();

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error("Failed to fetch stocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch stocks." },
      { status: 500 },
    );
  }
}
