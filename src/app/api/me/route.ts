import { NextResponse } from "next/server";
import { profile } from "@/lib/seed/profile";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://localhost:8000/api";

export async function GET() {
  
  const res = await fetch(`${DJANGO_API_URL}/api/about/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return NextResponse.json({
    status: res.status,
    statusText: res.statusText,
    data: (await res.json()).data,
  });
}
