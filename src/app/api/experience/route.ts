import { NextResponse } from "next/server";
import { experience } from "@/lib/seed/experience";

export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: { experience },
  });
}
