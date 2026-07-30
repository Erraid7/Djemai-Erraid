import { NextResponse } from "next/server";
import { home } from "@/lib/seed/home";

export async function GET() {
  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: home,
  });
}