import { NextResponse } from "next/server";
import { profile } from "@/lib/seed/profile";

export async function GET() {
  // MOCK: replace with `await prisma.profile.findFirst()` in the backend phase.
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: profile,
  });
}
