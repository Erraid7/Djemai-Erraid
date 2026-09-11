import { NextResponse } from "next/server";
import { whoami } from "@/lib/seed/secrets";

// Unlisted on purpose -- see src/lib/discovery.ts.
export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: whoami,
    tests: [
      { label: "unlisted endpoint reached", pass: true },
      { label: "auth required", pass: false },
    ],
  });
}
