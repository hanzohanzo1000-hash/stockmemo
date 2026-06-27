import { appendWaitlistEmail } from "@/lib/google-sheets";
import { ja } from "@/lib/i18n/ja";
import { NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      source?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const source = body.source?.trim() || "waitlist";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: ja.waitlist.errorInvalidEmail },
        { status: 400 },
      );
    }

    await appendWaitlistEmail(email, source);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist signup failed:", error);
    return NextResponse.json(
      { error: ja.waitlist.errorGeneric },
      { status: 500 },
    );
  }
}
