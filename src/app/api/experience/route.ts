import { NextResponse } from "next/server";
import { experience, impactStats } from "@/lib/seed/experience";

export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: { experience, impactStats },
  });
}
