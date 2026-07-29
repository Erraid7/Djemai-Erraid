import { NextResponse } from "next/server";
import { services } from "@/lib/seed/services";

export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: services,
  });
}
