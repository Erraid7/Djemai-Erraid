import { NextResponse } from "next/server";
import { profile } from "@/lib/seed/profile";

export async function GET() {
    return NextResponse.json({
      status: 200,
      statusText: "OK",
      data: profile,
    });
}
