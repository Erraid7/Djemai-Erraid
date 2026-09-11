import { NextResponse } from "next/server";
import { secret } from "@/lib/seed/secrets";

// The payoff for finding every unlisted route.
export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: secret,
    tests: [{ label: "all unlisted routes found", pass: true }],
  });
}
